package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"

	"github.com/gofiber/fiber/v2"
)

type OpenRouterMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenRouterRequest struct {
	Model    string              `json:"model"`
	Messages []OpenRouterMessage `json:"messages"`
}

type OpenRouterResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func AIChatHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req models.AIChatRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Requisição inválida",
			})
		}

		if req.Prompt == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Prompt não informado",
			})
		}

		// Se a chave OpenRouter estiver configurada, faz chamada de IA real
		if cfg.OpenRouterAPIKey != "" {
			systemPrompt := "Você é o jornalista e redator de imprensa oficial da Associação dos Ribeirinhos do Porto Cercado (Pantanal, Poconé/MT). Seu tom de voz é informativo, transparente, comunitário e focado em sustentabilidade e preservação dos rios."

			openRouterReq := OpenRouterRequest{
				Model: cfg.OpenRouterModel,
				Messages: []OpenRouterMessage{
					{Role: "system", Content: systemPrompt},
					{Role: "user", Content: req.Prompt},
				},
			}

			reqBody, err := json.Marshal(openRouterReq)
			if err == nil {
				httpReq, err := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewBuffer(reqBody))
				if err == nil {
					httpReq.Header.Set("Content-Type", "application/json")
					httpReq.Header.Set("Authorization", "Bearer "+cfg.OpenRouterAPIKey)
					httpReq.Header.Set("HTTP-Referer", "http://localhost:3150")
					httpReq.Header.Set("X-Title", "Porto Cercado 2")

					client := &http.Client{Timeout: 15 * time.Second}
					resp, err := client.Do(httpReq)
					if err == nil && resp.StatusCode == 200 {
						defer resp.Body.Close()
						bodyBytes, _ := io.ReadAll(resp.Body)

						var openRouterResp OpenRouterResponse
						if err := json.Unmarshal(bodyBytes, &openRouterResp); err == nil && len(openRouterResp.Choices) > 0 {
							replyText := openRouterResp.Choices[0].Message.Content
							return c.JSON(models.AIChatResponse{
								Reply:     replyText,
								Timestamp: time.Now().Format("15:04:05"),
							})
						}
					} else if err != nil {
						log.Printf("⚠️ Erro na requisição OpenRouter: %v", err)
					}
				}
			}
		}

		// Fallback Local se OpenRouter não estiver configurado ou offline
		reply := fmt.Sprintf(
			"Rascunho gerado para Porto Cercado: Em relação ao tema '%s', a diretoria da Associação de Pescadores e Ribeirinhos de Porto Cercado destaca a importância da preservação das margens do Rio Cuiabá, alinhando desenvolvimento sustentável e engajamento da comunidade pantaneira.",
			req.Prompt,
		)

		return c.JSON(models.AIChatResponse{
			Reply:     reply,
			Timestamp: time.Now().Format("15:04:05"),
		})
	}
}
