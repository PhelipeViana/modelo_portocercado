package migrations

import (
	"gorm.io/gorm"
	"porto-cercado-backend/models"
)

func MigrateSubscribers(db *gorm.DB) error {
	return db.AutoMigrate(&models.Subscriber{})
}
