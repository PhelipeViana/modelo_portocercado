package handlers

import (
	"context"
	"strconv"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

	"github.com/gofiber/fiber/v2"
)

const eventsCacheKey = "cms:events:all"

func GetEventsHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		var cachedEvents []models.CalendarEvent
		if cache.Get(ctx, eventsCacheKey, &cachedEvents) {
			return c.JSON(cachedEvents)
		}

		var events []models.CalendarEvent
		if cfg.DB != nil {
			cfg.DB.Order("id DESC").Find(&events)
		}

		cache.Set(ctx, eventsCacheKey, events, 30*time.Minute)
		return c.JSON(events)
	}
}

func CreateEventHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var evt models.CalendarEvent
		if err := c.BodyParser(&evt); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB != nil {
			if err := cfg.DB.Create(&evt).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar evento no CMS"})
			}
		}

		cache.Delete(context.Background(), eventsCacheKey)
		return c.Status(fiber.StatusCreated).JSON(evt)
	}
}

func DeleteEventHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB != nil {
			cfg.DB.Delete(&models.CalendarEvent{}, id)
		}

		cache.Delete(context.Background(), eventsCacheKey)
		return c.JSON(fiber.Map{"message": "Evento removido com sucesso"})
	}
}
