package handlers

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"
	"porto-cercado-backend/services"

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

type editorialDraft struct {
	Title   string `json:"title"`
	Summary string `json:"summary"`
	Content string `json:"content"`
}

type OpenRouterImageResponse struct {
	Data []struct {
		Base64 string `json:"b64_json"`
	} `json:"data"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func GenerateArticleImageHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var request models.AIImageRequest
		if err := c.BodyParser(&request); err != nil || strings.TrimSpace(request.Prompt) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Informe a pauta para gerar a imagem"})
		}
		if cfg.OpenRouterAPIKey == "" {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "A geração de imagens não está configurada"})
		}
		prompt := "Use case: photorealistic-natural. Asset type: editorial news cover for a fishing association website. Create a documentary-style 16:9 cover image based on this news topic: " + strings.TrimSpace(request.Prompt) + ". Scene should be relevant to the Pantanal or sustainable fishing when appropriate. No written text, no logos, no watermark, no collage, no sensationalism."
		payload, _ := json.Marshal(fiber.Map{"model": cfg.OpenRouterImageModel, "prompt": prompt, "aspect_ratio": "16:9", "output_format": "jpeg", "quality": "medium", "n": 1})
		httpRequest, err := http.NewRequest(http.MethodPost, "https://openrouter.ai/api/v1/images", bytes.NewReader(payload))
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Não foi possível iniciar a geração da imagem"})
		}
		httpRequest.Header.Set("Authorization", "Bearer "+cfg.OpenRouterAPIKey)
		httpRequest.Header.Set("Content-Type", "application/json")
		httpRequest.Header.Set("HTTP-Referer", "http://localhost:3150")
		httpRequest.Header.Set("X-Title", "Porto Cercado 2")
		response, err := (&http.Client{Timeout: 90 * time.Second}).Do(httpRequest)
		if err != nil {
			log.Printf("Erro na geração de imagem OpenRouter: %v", err)
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": "A IA não respondeu à geração de imagem"})
		}
		defer response.Body.Close()
		responseBody, _ := io.ReadAll(io.LimitReader(response.Body, 25*1024*1024))
		var result OpenRouterImageResponse
		if err := json.Unmarshal(responseBody, &result); err != nil || response.StatusCode < 200 || response.StatusCode >= 300 || len(result.Data) == 0 || result.Data[0].Base64 == "" {
			message := "Não foi possível gerar a imagem agora"
			if result.Error != nil && result.Error.Message != "" {
				message = result.Error.Message
			}
			return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"error": message})
		}
		imageBytes, err := base64.StdEncoding.DecodeString(result.Data[0].Base64)
		if err != nil {
			return c.Status(502).JSON(fiber.Map{"error": "A IA retornou uma imagem inválida"})
		}
		filenameBytes := make([]byte, 16)
		if _, err := rand.Read(filenameBytes); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Não foi possível salvar a imagem"})
		}
		filename := "ai-" + hex.EncodeToString(filenameBytes) + ".jpg"
		if err := os.WriteFile(filepath.Join(cfg.UploadsDir, filename), imageBytes, 0644); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Não foi possível gravar a imagem"})
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"url": "/uploads/" + filename, "provider": "OpenRouter"})
	}
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

		sources := services.FetchFishingNews()
		newsContext := services.FormatNewsContext(sources)

		// Se a chave OpenRouter estiver configurada, faz chamada de IA real
		if cfg.OpenRouterAPIKey != "" {
			systemPrompt := `Você é o editor de imprensa da Associação dos Ribeirinhos do Porto Cercado, em Poconé/MT.
Escreva uma notícia útil para pescadores e ribeirinhos sobre pesca, Pantanal, rios, meio ambiente, direitos, segurança, clima ou políticas públicas.
Use as manchetes fornecidas apenas como contexto: não invente dados, datas, decisões, órgãos ou citações. Se o contexto não sustentar um fato, trate-o como tema de atenção ou explique que a associação deve confirmar a informação.
Priorize Mato Grosso e Pantanal. Quando a pauta for global, explique de forma concreta por que ela pode afetar pescadores locais.
Responda APENAS com JSON válido, sem markdown ou blocos de código, com as chaves "title", "summary" e "content". O campo content deve conter HTML simples com parágrafos <p>, subtítulos <h2> e listas quando necessário.`
			userPrompt := fmt.Sprintf("Pedido editorial: %s\n\nManchetes recentes para pesquisa:\n%s", req.Prompt, newsContext)

			openRouterReq := OpenRouterRequest{
				Model: cfg.OpenRouterModel,
				Messages: []OpenRouterMessage{
					{Role: "system", Content: systemPrompt},
					{Role: "user", Content: userPrompt},
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
							draft, parsed := parseEditorialDraft(replyText)
							if parsed {
								return c.JSON(models.AIChatResponse{Reply: draft.Content, Title: draft.Title, Summary: draft.Summary, Content: draft.Content, Sources: sources, Provider: "OpenRouter", Timestamp: time.Now().Format("15:04:05")})
							}
							return c.JSON(models.AIChatResponse{
								Reply:     replyText,
								Provider:  "OpenRouter",
								Sources:   sources,
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
			Title:     "Pauta em análise pela Associação",
			Summary:   "Rascunho inicial que deve ser revisado antes da publicação.",
			Content:   "<p>" + reply + "</p>",
			Provider:  "Modo local",
			Sources:   sources,
			Timestamp: time.Now().Format("15:04:05"),
		})
	}
}

func parseEditorialDraft(response string) (editorialDraft, bool) {
	clean := strings.TrimSpace(response)
	clean = strings.TrimPrefix(clean, "```json")
	clean = strings.TrimPrefix(clean, "```")
	clean = strings.TrimSuffix(strings.TrimSpace(clean), "```")
	var draft editorialDraft
	if err := json.Unmarshal([]byte(clean), &draft); err != nil {
		return editorialDraft{}, false
	}
	if strings.TrimSpace(draft.Title) == "" || strings.TrimSpace(draft.Content) == "" {
		return editorialDraft{}, false
	}
	return draft, true
}
