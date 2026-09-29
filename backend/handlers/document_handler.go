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

const documentsCacheKey = "cms:documents:all"

func GetDocumentsHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		var cachedDocs []models.OfficialDocument
		if cache.Get(ctx, documentsCacheKey, &cachedDocs) {
			return c.JSON(cachedDocs)
		}

		var docs []models.OfficialDocument
		if cfg.DB != nil {
			cfg.DB.Order("id DESC").Find(&docs)
		}

		cache.Set(ctx, documentsCacheKey, docs, 30*time.Minute)
		return c.JSON(docs)
	}
}

func CreateDocumentHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var doc models.OfficialDocument
		if err := c.BodyParser(&doc); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB != nil {
			if err := cfg.DB.Create(&doc).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar edital no CMS"})
			}
		}

		cache.Delete(context.Background(), documentsCacheKey)
		return c.Status(fiber.StatusCreated).JSON(doc)
	}
}

func DeleteDocumentHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB != nil {
			cfg.DB.Delete(&models.OfficialDocument{}, id)
		}

		cache.Delete(context.Background(), documentsCacheKey)
		return c.JSON(fiber.Map{"message": "Documento removido com sucesso"})
	}
}
