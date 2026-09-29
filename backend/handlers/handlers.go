package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"porto-cercado-backend/data"
	"porto-cercado-backend/models"
)

// CORS Middleware to allow requests from Frontend
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Health check handler
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "Porto Cercado Go API",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// Articles handler
func GetArticlesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Articles)
}

// Documents handler
func GetDocumentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Documents)
}

// Events handler
func GetEventsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Events)
}

// Videos handler
func GetVideosHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Videos)
}

// AI Assistant Chat handler
func AIChatHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var req models.AIChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Requisição inválida", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := models.AIChatResponse{
		Reply:     fmt.Sprintf("Atendente Virtual Porto Cercado (Go Backend): Recebi sua mensagem '%s'. Como posso ajudar mais com informações sobre pescarias, editais ou eventos?", req.Prompt),
		Timestamp: time.Now().Format("15:04:05"),
	}

	json.NewEncoder(w).Encode(response)
}
