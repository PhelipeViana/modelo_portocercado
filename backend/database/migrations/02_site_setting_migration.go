package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateSiteSettings(db *gorm.DB) error {
	err := db.AutoMigrate(&models.SiteSetting{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'site_settings': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'site_settings' verificada/criada.")
	return nil
}
