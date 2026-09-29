package handlers

import (
	"context"
	"time"

	"porto-cercado-backend/config"

	"github.com/gofiber/fiber/v2"
)

func HealthCheckHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		dbStatus := "online"
		if cfg.DB == nil {
			dbStatus = "offline"
		} else {
			sqlDB, err := cfg.DB.DB()
			if err != nil || sqlDB.Ping() != nil {
				dbStatus = "degraded"
			}
		}

		redisStatus := "online"
		if cfg.RedisClient == nil {
			redisStatus = "offline"
		} else {
			ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
			defer cancel()
			if err := cfg.RedisClient.Ping(ctx).Err(); err != nil {
				redisStatus = "offline"
			}
		}

		return c.JSON(fiber.Map{
			"status":      "healthy",
			"framework":   "Fiber v2 (Golang 1.24)",
			"database":    "PostgreSQL (" + dbStatus + ")",
			"cache":       "Redis (" + redisStatus + ")",
			"systemStage": "Etapa 1 - CMS & Gerenciamento de Informações do Site",
			"timestamp":   time.Now().Format(time.RFC3339),
		})
	}
}
