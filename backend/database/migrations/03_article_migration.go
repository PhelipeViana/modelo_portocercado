package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateArticles(db *gorm.DB) error {
	err := db.AutoMigrate(&models.Article{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'articles': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'articles' verificada/criada.")
	return nil
}
