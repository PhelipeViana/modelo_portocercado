package handlers

import (
	"context"
	"strconv"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

const usersCacheKey = "cms:users:all"

func GetUsersHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		// 1. Tentar ler do Cache Redis
		var cachedUsers []models.User
		if cache.Get(ctx, usersCacheKey, &cachedUsers) {
			return c.JSON(fiber.Map{
				"source": "redis_cache",
				"data":   cachedUsers,
			})
		}

		// 2. Buscar no PostgreSQL
		var users []models.User
		if cfg.DB != nil {
			if err := cfg.DB.Order("id DESC").Find(&users).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Erro ao buscar usuários do banco de dados",
				})
			}
		}

		// 3. Salvar no Redis (TTL: 15 minutos)
		cache.Set(ctx, usersCacheKey, users, 15*time.Minute)

		return c.JSON(fiber.Map{
			"source": "postgresql",
			"data":   users,
		})
	}
}

func CreateUserHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.CreateUserRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Requisição inválida",
			})
		}

		if req.Name == "" || req.Email == "" || req.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Nome, e-mail e senha são obrigatórios",
			})
		}

		// Validar Nível de Acesso Administrativo (tabela users é exclusiva para gestão)
		if req.Role == "" {
			req.Role = models.RoleAdmin
		}
		if req.Role != models.RoleAdmin && req.Role != models.RoleSuper {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Nível de acesso administrativo inválido. Use: admin ou super",
			})
		}

		hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Erro ao criptografar senha",
			})
		}

		user := models.User{
			Name:     req.Name,
			Email:    req.Email,
			Role:     req.Role,
			Password: string(hashedPass),
			Ativo:    req.Ativo,
		}

		if cfg.DB != nil {
			if err := cfg.DB.Create(&user).Error; err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "Erro ao criar usuário (e-mail já cadastrado?)",
				})
			}
		}

		// Invalidar Cache do Redis
		cache.Delete(context.Background(), usersCacheKey)

		return c.Status(fiber.StatusCreated).JSON(user)
	}
}

func UpdateUserHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		var req models.UpdateUserRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB != nil {
			var user models.User
			if err := cfg.DB.First(&user, id).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Usuário não encontrado"})
			}

			user.Name = req.Name
			user.Email = req.Email
			if req.Role != "" {
				user.Role = req.Role
			}
			user.Ativo = req.Ativo

			if req.Password != "" {
				hashedPass, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
				if err == nil {
					user.Password = string(hashedPass)
				}
			}

			if err := cfg.DB.Save(&user).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao atualizar usuário"})
			}
		}

		// Invalidar Cache do Redis
		cache.Delete(context.Background(), usersCacheKey)

		return c.JSON(fiber.Map{"message": "Usuário atualizado com sucesso"})
	}
}

func DeleteUserHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB != nil {
			if err := cfg.DB.Delete(&models.User{}, id).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao remover usuário"})
			}
		}

		// Invalidar Cache do Redis
		cache.Delete(context.Background(), usersCacheKey)

		return c.JSON(fiber.Map{"message": "Usuário removido com sucesso"})
	}
}
