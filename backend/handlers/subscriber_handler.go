package handlers

import (
	"strconv"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"

	"github.com/gofiber/fiber/v2"
)

type SubscriberAuthRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

// RegisterSubscriberHandler registra ou retorna um assinante existente
func RegisterSubscriberHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req SubscriberAuthRequest
		if err := c.BodyParser(&req); err != nil || req.Email == "" || req.Name == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nome e e-mail são obrigatórios"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		var existing models.Subscriber
		err := cfg.DB.Where("email = ?", req.Email).First(&existing).Error

		if err == nil {
			// Já existe
			if !existing.Ativo {
				return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Assinatura inativa. Entre em contato com o suporte da associação."})
			}
			return c.JSON(existing)
		}

		// Novo cadastro
		sub := models.Subscriber{
			Name:  req.Name,
			Email: req.Email,
			Ativo: true,
		}

		if err := cfg.DB.Create(&sub).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao realizar cadastro de assinante"})
		}

		return c.Status(fiber.StatusCreated).JSON(sub)
	}
}

// LoginSubscriberHandler realiza login simples do assinante pelo e-mail
func LoginSubscriberHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req struct {
			Email string `json:"email"`
		}
		if err := c.BodyParser(&req); err != nil || req.Email == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "E-mail é obrigatório"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		var sub models.Subscriber
		if err := cfg.DB.Where("email = ?", req.Email).First(&sub).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Assinante não encontrado com este e-mail"})
		}

		if !sub.Ativo {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Assinatura inativa no sistema"})
		}

		return c.JSON(sub)
	}
}

// GetAdminSubscribersHandler lista todos os assinantes para o Admin
func GetAdminSubscribersHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		var subs []models.Subscriber
		if err := cfg.DB.Order("id DESC").Find(&subs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar assinantes"})
		}

		return c.JSON(subs)
	}
}

// ToggleSubscriberStatusHandler altera o status de ativo/inativo do assinante
func ToggleSubscriberStatusHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		var body struct {
			Ativo bool `json:"ativo"`
		}
		if err := c.BodyParser(&body); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		if err := cfg.DB.Model(&models.Subscriber{}).Where("id = ?", uint(id)).Update("ativo", body.Ativo).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao atualizar assinante"})
		}

		return c.JSON(fiber.Map{"message": "Status do assinante atualizado com sucesso"})
	}
}

// DeleteSubscriberHandler remove um assinante
func DeleteSubscriberHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		if err := cfg.DB.Delete(&models.Subscriber{}, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao remover assinante"})
		}

		return c.JSON(fiber.Map{"message": "Assinante removido com sucesso"})
	}
}
