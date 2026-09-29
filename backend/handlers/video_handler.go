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

const videosCacheKey = "cms:videos:all"

func GetVideosHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		var cachedVideos []models.VideoEpisode
		if cache.Get(ctx, videosCacheKey, &cachedVideos) {
			return c.JSON(cachedVideos)
		}

		var videos []models.VideoEpisode
		if cfg.DB != nil {
			cfg.DB.Order("id DESC").Find(&videos)
		}

		cache.Set(ctx, videosCacheKey, videos, 30*time.Minute)
		return c.JSON(videos)
	}
}

func CreateVideoHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var vid models.VideoEpisode
		if err := c.BodyParser(&vid); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB != nil {
			if err := cfg.DB.Create(&vid).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar vídeo no CMS"})
			}
		}

		cache.Delete(context.Background(), videosCacheKey)
		return c.Status(fiber.StatusCreated).JSON(vid)
	}
}

func DeleteVideoHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB != nil {
			cfg.DB.Delete(&models.VideoEpisode{}, id)
		}

		cache.Delete(context.Background(), videosCacheKey)
		return c.JSON(fiber.Map{"message": "Vídeo removido com sucesso"})
	}
}
