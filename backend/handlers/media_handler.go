package handlers

import (
	"os"
	"path/filepath"
	"sort"
	"strings"

	"porto-cercado-backend/config"

	"github.com/gofiber/fiber/v2"
)

type MediaFile struct {
	Name      string `json:"name"`
	URL       string `json:"url"`
	Size      int64  `json:"size"`
	UpdatedAt string `json:"updatedAt"`
}

// GetMediaFilesHandler traz a lista de arquivos salvos na pasta de upload
func GetMediaFilesHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		files, err := os.ReadDir(cfg.UploadsDir)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao ler pasta de upload"})
		}

		var mediaList []MediaFile
		for _, f := range files {
			if f.IsDir() || strings.HasPrefix(f.Name(), ".") {
				continue
			}
			info, err := f.Info()
			if err != nil {
				continue
			}
			mediaList = append(mediaList, MediaFile{
				Name:      f.Name(),
				URL:       "/uploads/" + f.Name(),
				Size:      info.Size(),
				UpdatedAt: info.ModTime().Format("02/01/2006 15:04"),
			})
		}

		// Ordenar os arquivos mais recentes primeiro
		sort.Slice(mediaList, func(i, j int) bool {
			return mediaList[i].UpdatedAt > mediaList[j].UpdatedAt
		})

		return c.JSON(mediaList)
	}
}

// DeleteMediaFileHandler remove um arquivo da pasta de upload
func DeleteMediaFileHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		filename := c.Params("filename")
		if filename == "" || strings.Contains(filename, "..") || strings.Contains(filename, "/") {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Nome de arquivo inválido"})
		}

		filePath := filepath.Join(cfg.UploadsDir, filename)
		if err := os.Remove(filePath); err != nil {
			if os.IsNotExist(err) {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Arquivo não encontrado"})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erro ao remover arquivo de mídia"})
		}

		return c.JSON(fiber.Map{"message": "Arquivo de mídia removido com sucesso"})
	}
}
