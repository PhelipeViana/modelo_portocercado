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

const articlesCacheKey = "cms:articles:all"

func GetArticlesHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		var cachedArticles []models.Article
		if cache.Get(ctx, articlesCacheKey, &cachedArticles) {
			return c.JSON(cachedArticles)
		}

		var articles []models.Article
		if cfg.DB != nil {
			cfg.DB.Order("id DESC").Find(&articles)
		}

		cache.Set(ctx, articlesCacheKey, articles, 30*time.Minute)
		return c.JSON(articles)
	}
}

func GetArticleBySlugHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		slug := c.Params("slug")
		cacheKey := "cms:article:slug:" + slug
		ctx := context.Background()

		var cachedArticle models.Article
		if cache.Get(ctx, cacheKey, &cachedArticle) {
			return c.JSON(cachedArticle)
		}

		var article models.Article
		if cfg.DB != nil {
			if err := cfg.DB.Where("slug = ?", slug).First(&article).Error; err != nil {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Artigo não encontrado"})
			}
		}

		cache.Set(ctx, cacheKey, article, 30*time.Minute)
		return c.JSON(article)
	}
}

func CreateArticleHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var article models.Article
		if err := c.BodyParser(&article); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if cfg.DB != nil {
			if err := cfg.DB.Create(&article).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar notícia no CMS"})
			}
		}

		cache.InvalidatePrefix(context.Background(), "cms:article")
		return c.Status(fiber.StatusCreated).JSON(article)
	}
}

func UpdateArticleHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		var article models.Article
		if err := c.BodyParser(&article); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}
		article.ID = uint(id)

		if cfg.DB != nil {
			if err := cfg.DB.Save(&article).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao atualizar notícia"})
			}
		}

		cache.InvalidatePrefix(context.Background(), "cms:article")
		return c.JSON(article)
	}
}

func DeleteArticleHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB != nil {
			cfg.DB.Delete(&models.Article{}, id)
		}

		cache.InvalidatePrefix(context.Background(), "cms:article")
		return c.JSON(fiber.Map{"message": "Notícia removida com sucesso"})
	}
}
