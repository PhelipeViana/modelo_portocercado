package handlers

import (
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/middleware"
	"porto-cercado-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func LoginHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Parâmetros da requisição inválidos",
			})
		}

		if req.Email == "" || req.Password == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "E-mail e senha são obrigatórios",
			})
		}

		var user models.User
		if cfg.DB != nil {
			err := cfg.DB.Where("email = ? AND ativo = true", req.Email).First(&user).Error
			if err != nil {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "Credenciais inválidas ou usuário inativo",
				})
			}

			// Comparar hash bcrypt
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "Credenciais inválidas",
				})
			}
		} else {
			// Mock Fallback se DB estiver offline
			if req.Email == "admin@portocercado.com.br" && req.Password == "admin123" {
				user = models.User{
					ID:    1,
					Name:  "Admin Fallback",
					Email: req.Email,
					Role:  models.RoleAdmin,
					Ativo: true,
				}
			} else {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "Credenciais inválidas (Modo Fallback)",
				})
			}
		}

		// Gerar JWT Token com nivel de acesso (role)
		claims := middleware.JWTClaims{
			UserID: user.ID,
			Email:  user.Email,
			Role:   user.Role,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signedToken, err := token.SignedString([]byte(cfg.JWTSecret))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Erro ao gerar token de acesso",
			})
		}

		return c.JSON(models.LoginResponse{
			Token: signedToken,
			User:  user,
		})
	}
}

func MeHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID := c.Locals("userID").(uint)

		var user models.User
		if cfg.DB != nil {
			if err := cfg.DB.First(&user, userID).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error": "Usuário não encontrado",
				})
			}
		}

		return c.JSON(user)
	}
}
