package handlers

import (
	"context"
	"strconv"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
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
			if err := cfg.DB.Where("status = ?", "published").Order("featured DESC, id DESC").Find(&articles).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar notícias"})
			}
		}

		cache.Set(ctx, articlesCacheKey, articles, 30*time.Minute)
		return c.JSON(articles)
	}
}

func GetAdminArticlesHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var articles []models.Article
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		if err := cfg.DB.Order("updated_at DESC, id DESC").Find(&articles).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar notícias"})
		}
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
			if err := cfg.DB.Where("slug = ? AND status = ?", slug, "published").First(&article).Error; err != nil {
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

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		if article.Title == "" || article.Slug == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Título e slug são obrigatórios"})
		}
		if article.Status == "" {
			article.Status = "published"
		}
		if article.Status != "published" && article.Status != "draft" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Status inválido"})
		}
		if article.Status != "published" {
			article.Featured = false
		}
		if err := cfg.DB.Transaction(func(tx *gorm.DB) error {
			if article.Featured {
				if err := tx.Model(&models.Article{}).Where("featured = ?", true).Update("featured", false).Error; err != nil {
					return err
				}
			}
			return tx.Create(&article).Error
		}); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar notícia no CMS"})
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
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		var existing models.Article
		if err := cfg.DB.First(&existing, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notícia não encontrada"})
		}
		article.ID = uint(id)
		if article.Title == "" || article.Slug == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Título e slug são obrigatórios"})
		}
		if article.Status == "" {
			article.Status = existing.Status
		}
		if article.Status != "published" && article.Status != "draft" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Status inválido"})
		}
		if article.Status != "published" {
			article.Featured = false
		}
		if err := cfg.DB.Transaction(func(tx *gorm.DB) error {
			if article.Featured {
				if err := tx.Model(&models.Article{}).Where("id <> ? AND featured = ?", article.ID, true).Update("featured", false).Error; err != nil {
					return err
				}
			}
			return tx.Model(&existing).Select("Slug", "Title", "Subtitle", "Summary", "Content", "Category", "CategoryColor", "Tag", "ImageURL", "VideoURL", "AuthorName", "AuthorRole", "AuthorInit", "Date", "ReadTime", "Featured", "Status").Updates(&article).Error
		}); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao atualizar notícia"})
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

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		result := cfg.DB.Delete(&models.Article{}, id)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao remover notícia"})
		}
		if result.RowsAffected == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notícia não encontrada"})
		}

		cache.InvalidatePrefix(context.Background(), "cms:article")
		return c.JSON(fiber.Map{"message": "Notícia removida com sucesso"})
	}
}

func IncrementArticleViewHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		if err := cfg.DB.Model(&models.Article{}).Where("id = ?", uint(id)).UpdateColumn("view_count", gorm.Expr("view_count + 1")).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao incrementar visualizações"})
		}
		return c.JSON(fiber.Map{"message": "Visualização registrada"})
	}
}

func IncrementArticleShareHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		if err := cfg.DB.Model(&models.Article{}).Where("id = ?", uint(id)).UpdateColumn("shares", gorm.Expr("shares + 1")).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao incrementar compartilhamentos"})
		}
		return c.JSON(fiber.Map{"message": "Compartilhamento registrado"})
	}
}

func GetRelatedArticlesHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		slug := c.Params("slug")
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}
		var current models.Article
		if err := cfg.DB.Where("slug = ?", slug).First(&current).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notícia não encontrada"})
		}

		var related []models.Article
		if err := cfg.DB.Where("slug <> ? AND category = ? AND status = ?", slug, current.Category, "published").Order("id DESC").Limit(3).Find(&related).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar notícias relacionadas"})
		}

		if len(related) < 3 {
			var fallback []models.Article
			excludeSlugs := []string{slug}
			for _, r := range related {
				excludeSlugs = append(excludeSlugs, r.Slug)
			}
			limit := 3 - len(related)
			cfg.DB.Where("slug NOT IN ? AND status = ?", excludeSlugs, "published").Order("id DESC").Limit(limit).Find(&fallback)
			related = append(related, fallback...)
		}

		return c.JSON(related)
	}
}

