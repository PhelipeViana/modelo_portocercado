package migrations

import (
	"gorm.io/gorm"
	"porto-cercado-backend/models"
)

func MigrateArticleStatus(db *gorm.DB) error {
	return db.AutoMigrate(&models.Article{})
}
