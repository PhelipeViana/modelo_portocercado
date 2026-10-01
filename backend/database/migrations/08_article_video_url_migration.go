package migrations

import (
	"gorm.io/gorm"
	"porto-cercado-backend/models"
)

func MigrateArticleVideoURL(db *gorm.DB) error { return db.AutoMigrate(&models.Article{}) }
