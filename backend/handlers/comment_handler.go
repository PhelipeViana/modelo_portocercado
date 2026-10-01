package handlers

import (
	"strconv"

	"porto-cercado-backend/config"
	"porto-cercado-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetArticleCommentsHandler retorna comentários aprovados de um artigo
func GetArticleCommentsHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		articleIDParam := c.Params("id")
		articleID, err := strconv.ParseUint(articleIDParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de artigo inválido"})
		}
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		var comments []models.Comment
		if err := cfg.DB.Where("article_id = ? AND status = ?", uint(articleID), models.CommentApproved).Order("created_at DESC").Find(&comments).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar comentários"})
		}
		return c.JSON(comments)
	}
}

// CreateCommentHandler envia um novo comentário para o artigo
func CreateCommentHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		articleIDParam := c.Params("id")
		articleID, err := strconv.ParseUint(articleIDParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de artigo inválido"})
		}

		var comment models.Comment
		if err := c.BodyParser(&comment); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Payload inválido"})
		}

		if comment.AuthorName == "" || comment.AuthorEmail == "" || comment.Content == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nome, e-mail e comentário são obrigatórios"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		// Verificar se o artigo existe
		var article models.Article
		if err := cfg.DB.First(&article, uint(articleID)).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notícia não encontrada"})
		}

		// Verificar se o e-mail pertence a um assinante ativo
		var sub models.Subscriber
		if err := cfg.DB.Where("email = ?", comment.AuthorEmail).First(&sub).Error; err != nil {
			// Se o assinante não existir, cria o cadastro automático ativo
			sub = models.Subscriber{
				Name:  comment.AuthorName,
				Email: comment.AuthorEmail,
				Ativo: true,
			}
			if err := cfg.DB.Create(&sub).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao validar assinatura"})
			}
		} else if !sub.Ativo {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Sua assinatura está inativa. Somente assinantes ativos podem comentar."})
		}

		comment.ArticleID = uint(articleID)
		comment.Status = models.CommentApproved // Publicação direta sem intermediador

		if err := cfg.DB.Create(&comment).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao salvar comentário"})
		}

		return c.Status(fiber.StatusCreated).JSON(comment)
	}
}

// GetAdminCommentsHandler retorna todos os comentários com status para o Admin
func GetAdminCommentsHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		var comments []models.Comment
		if err := cfg.DB.Preload("Article").Order("created_at DESC").Find(&comments).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao buscar comentários administrativos"})
		}

		for i := range comments {
			if comments[i].Article != nil {
				comments[i].ArticleTitle = comments[i].Article.Title
			}
		}

		return c.JSON(comments)
	}
}

// UpdateCommentStatusHandler altera o status de moderação (approved / pending / rejected)
func UpdateCommentStatusHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		var body struct {
			Status models.CommentStatus `json:"status"`
		}
		if err := c.BodyParser(&body); err != nil || body.Status == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Status inválido"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		if err := cfg.DB.Model(&models.Comment{}).Where("id = ?", uint(id)).Update("status", body.Status).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao atualizar status do comentário"})
		}

		return c.JSON(fiber.Map{"message": "Status do comentário atualizado com sucesso"})
	}
}

// DeleteCommentHandler remove um comentário
func DeleteCommentHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		idParam := c.Params("id")
		id, err := strconv.ParseUint(idParam, 10, 32)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID inválido"})
		}

		if cfg.DB == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Banco de dados indisponível"})
		}

		if err := cfg.DB.Delete(&models.Comment{}, uint(id)).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao remover comentário"})
		}

		return c.JSON(fiber.Map{"message": "Comentário removido com sucesso"})
	}
}
