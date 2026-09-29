package handlers

import (
	"context"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

	"github.com/gofiber/fiber/v2"
)

const siteInfoCacheKey = "cms:site_info"

func GetSiteInfoHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		// 1. Tentar obter do Cache Redis
		var cachedSiteInfo models.SiteSetting
		if cache.Get(ctx, siteInfoCacheKey, &cachedSiteInfo) {
			return c.JSON(fiber.Map{
				"source": "redis_cache",
				"data":   cachedSiteInfo,
			})
		}

		// 2. Consultar PostgreSQL
		var siteInfo models.SiteSetting
		if cfg.DB != nil {
			if err := cfg.DB.First(&siteInfo).Error; err != nil {
				// Se ainda não existir, inicializar registro padrão
				siteInfo = models.SiteSetting{
					Title:        "Associação dos Ribeirinhos do Porto Cercado",
					HeroTitle:    "Proteja Seu Futuro e Fortaleça Nossa Associação",
					HeroSubtitle: "Junte-se à Associação dos Ribeirinhos do Porto Cercado. Tenha voz e vez na Associação Pantaneira.",
					Email:        "contato@portocercado.com.br",
					Phone:        "(65) 99805-9960",
				}
			}
		}

		// 3. Gravar no Redis (TTL: 1 hora)
		cache.Set(ctx, siteInfoCacheKey, siteInfo, 1*time.Hour)

		return c.JSON(fiber.Map{
			"source": "postgresql",
			"data":   siteInfo,
		})
	}
}

func UpdateSiteInfoHandler(cfg *config.Config, cache *services.CacheService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.SiteSetting
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Payload de dados do site inválido",
			})
		}

		if cfg.DB != nil {
			var existing models.SiteSetting
			res := cfg.DB.First(&existing)
			if res.Error != nil {
				// Criar primeira entrada
				if err := cfg.DB.Create(&req).Error; err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"error": "Erro ao salvar informações institucionais do site",
					})
				}
			} else {
				// Atualizar existente
				req.ID = existing.ID
				if err := cfg.DB.Save(&req).Error; err != nil {
					return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
						"error": "Erro ao atualizar informações institucionais do site",
					})
				}
			}
		}

		// Invalidação da Estratégia de Cache Redis
		cache.Delete(context.Background(), siteInfoCacheKey)

		return c.JSON(fiber.Map{
			"message": "Informações institucionais do site atualizadas com sucesso",
			"data":    req,
		})
	}
}
