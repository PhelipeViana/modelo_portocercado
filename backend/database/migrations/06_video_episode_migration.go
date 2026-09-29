package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateVideoEpisodes(db *gorm.DB) error {
	err := db.AutoMigrate(&models.VideoEpisode{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'video_episodes': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'video_episodes' verificada/criada.")
	return nil
}
