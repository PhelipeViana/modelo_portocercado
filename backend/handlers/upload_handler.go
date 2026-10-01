package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"mime/multipart"
	"path/filepath"

	"porto-cercado-backend/config"

	"github.com/gofiber/fiber/v2"
)

const maxUploadSize = 10 * 1024 * 1024

func UploadImageHandler(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		file, err := c.FormFile("image")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Envie uma imagem no campo image"})
		}
		if file.Size > maxUploadSize {
			return c.Status(fiber.StatusRequestEntityTooLarge).JSON(fiber.Map{"error": "A imagem deve ter no máximo 10 MB"})
		}
		if err := validateImage(file); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Arquivo de imagem inválido"})
		}

		bytes := make([]byte, 16)
		if _, err := rand.Read(bytes); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Não foi possível gerar o nome do arquivo"})
		}
		extension := ".jpg"
		if file.Header.Get("Content-Type") == "image/png" {
			extension = ".png"
		}
		filename := hex.EncodeToString(bytes) + extension
		if err := c.SaveFile(file, filepath.Join(cfg.UploadsDir, filename)); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Não foi possível salvar a imagem"})
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"url": "/uploads/" + filename})
	}
}

func validateImage(file *multipart.FileHeader) error {
	source, err := file.Open()
	if err != nil {
		return err
	}
	defer source.Close()
	if _, _, err := image.DecodeConfig(source); err != nil {
		return err
	}
	return nil
}
