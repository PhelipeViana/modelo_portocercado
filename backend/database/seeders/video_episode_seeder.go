package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func SeedVideoEpisodes(db *gorm.DB) error {
	var count int64
	db.Model(&models.VideoEpisode{}).Count(&count)
	if count > 0 {
		return nil
	}

	videos := []models.VideoEpisode{
		{
			Title:         "Documentário: A Vida Ribeirinha no Porto Cercado",
			Category:      "Documentário",
			CategoryColor: "bg-emerald-600",
			Duration:      "18:45",
			Published:     "20 de Setembro, 2026",
			ImageURL:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
			Presenter:     "Equipe de Comunicação",
			Description:   "Conheça a história dos moradores e a luta pela preservação ambiental das margens do Rio Cuiabá.",
			VideoURL:      "https://www.youtube.com/embed/dQw4w9WgXcQ",
		},
	}

	for _, v := range videos {
		if err := db.Create(&v).Error; err != nil {
			log.Printf("❌ Erro ao semear vídeo '%s': %v", v.Title, err)
			return err
		}
	}

	log.Println("  └─ 🟢 Seeder 'video_episodes': Vídeos semeados.")
	return nil
}
