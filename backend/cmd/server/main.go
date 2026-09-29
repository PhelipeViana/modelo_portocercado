package main

import (
	"fmt"
	"log"

	"porto-cercado-backend/config"
	"porto-cercado-backend/handlers"
	"porto-cercado-backend/middleware"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Inicializar configurações (PostgreSQL & Redis)
	cfg, err := config.InitConfig()
	if err != nil {
		log.Fatalf("Erro crítico ao inicializar configurações: %v", err)
	}

	// 2. Inicializar serviço de cache Redis
	cache := services.NewCacheService(cfg.RedisClient)

	// 3. Criar aplicação Fiber v2
	app := fiber.New(fiber.Config{
		AppName:      "Porto Cercado Go API (Fiber + Redis + Postgres)",
		ServerHeader: "Fiber",
	})

	// 4. Middlewares Globais
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// 5. Grupo de Rotas da API
	api := app.Group("/api")

	// --- Rotas Públicas ---
	api.Get("/health", handlers.HealthCheckHandler(cfg))
	api.Post("/auth/login", handlers.LoginHandler(cfg))

	// CMS Site Info (Public Reads cached on Redis)
	api.Get("/site/info", handlers.GetSiteInfoHandler(cfg, cache))
	api.Get("/articles", handlers.GetArticlesHandler(cfg, cache))
	api.Get("/articles/:slug", handlers.GetArticleBySlugHandler(cfg, cache))
	api.Get("/documents", handlers.GetDocumentsHandler(cfg, cache))
	api.Get("/events", handlers.GetEventsHandler(cfg, cache))
	api.Get("/videos", handlers.GetVideosHandler(cfg, cache))
	api.Post("/ai/chat", handlers.AIChatHandler(cfg))

	// --- Rotas Protegidas (Requer Token JWT) ---
	protected := api.Group("", middleware.Protected(cfg.JWTSecret))
	protected.Get("/auth/me", handlers.MeHandler(cfg))

	// --- Rotas Administrativas CMS & Gerenciamento de Nível de Acesso (Admin / Super) ---
	admin := protected.Group("", middleware.RequireRole(models.RoleAdmin, models.RoleSuper))

	// CMS Site Settings Update (Com invalidação de cache Redis)
	admin.Put("/site/info", handlers.UpdateSiteInfoHandler(cfg, cache))

	// Gerenciamento de Usuários e Nível de Acesso
	admin.Get("/users", handlers.GetUsersHandler(cfg, cache))
	admin.Post("/users", handlers.CreateUserHandler(cfg, cache))
	admin.Put("/users/:id", handlers.UpdateUserHandler(cfg, cache))

	// Exclusão de usuários restrita para nível SUPER
	superAdmin := protected.Group("", middleware.RequireRole(models.RoleSuper))
	superAdmin.Delete("/users/:id", handlers.DeleteUserHandler(cfg, cache))

	// CRUD de Notícias, Documentos, Eventos e Vídeos
	admin.Post("/articles", handlers.CreateArticleHandler(cfg, cache))
	admin.Put("/articles/:id", handlers.UpdateArticleHandler(cfg, cache))
	admin.Delete("/articles/:id", handlers.DeleteArticleHandler(cfg, cache))

	admin.Post("/documents", handlers.CreateDocumentHandler(cfg, cache))
	admin.Delete("/documents/:id", handlers.DeleteDocumentHandler(cfg, cache))

	admin.Post("/events", handlers.CreateEventHandler(cfg, cache))
	admin.Delete("/events/:id", handlers.DeleteEventHandler(cfg, cache))

	admin.Post("/videos", handlers.CreateVideoHandler(cfg, cache))
	admin.Delete("/videos/:id", handlers.DeleteVideoHandler(cfg, cache))

	// 6. Iniciar Servidor Fiber
	fmt.Printf("🚀 Servidor Golang (Fiber v2) Porto Cercado rodando na porta %s...\n", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
