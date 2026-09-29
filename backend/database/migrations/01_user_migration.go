package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateUsers(db *gorm.DB) error {
	err := db.AutoMigrate(&models.User{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'users': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'users' verificada/criada.")
	return nil
}
