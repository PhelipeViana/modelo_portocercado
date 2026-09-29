package handlers

import (
	"fmt"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"

	"github.com/gofiber/fiber/v2"
)

func AIChatHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.AIChatRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Requisição inválida",
			})
		}

		reply := fmt.Sprintf(
			"Atendente Virtual Porto Cercado (Go + Fiber): Recebi sua mensagem '%s'. Como posso ajudar mais com informações sobre estatuto, editais, pesca ou eventos da comunidade?",
			req.Prompt,
		)

		return c.JSON(models.AIChatResponse{
			Reply:     reply,
			Timestamp: time.Now().Format("15:04:05"),
		})
	}
}
