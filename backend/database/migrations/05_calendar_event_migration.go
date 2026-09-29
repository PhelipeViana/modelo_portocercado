package migrations

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func MigrateCalendarEvents(db *gorm.DB) error {
	err := db.AutoMigrate(&models.CalendarEvent{})
	if err != nil {
		log.Printf("❌ Erro na migração da tabela 'calendar_events': %v", err)
		return err
	}
	log.Println("  └─ 📁 Tabela 'calendar_events' verificada/criada.")
	return nil
}
