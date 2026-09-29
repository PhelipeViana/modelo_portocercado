package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateOfficialDocuments(db *gorm.DB) error {
	err := db.AutoMigrate(&models.OfficialDocument{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'official_documents': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'official_documents' verificada/criada.")
	return nil
}
