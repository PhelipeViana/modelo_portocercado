package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"porto-cercado-backend/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// API Routes
	mux.HandleFunc("GET /api/health", handlers.HealthCheckHandler)
	mux.HandleFunc("GET /api/articles", handlers.GetArticlesHandler)
	mux.HandleFunc("GET /api/documents", handlers.GetDocumentsHandler)
	mux.HandleFunc("GET /api/events", handlers.GetEventsHandler)
	mux.HandleFunc("GET /api/videos", handlers.GetVideosHandler)
	mux.HandleFunc("POST /api/ai/chat", handlers.AIChatHandler)

	handler := handlers.CORS(mux)

	fmt.Printf("🚀 Servidor Golang Porto Cercado rodando na porta %s...\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Erro ao iniciar o servidor Go: %v", err)
	}
}
