package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func SeedCalendarEvents(db *gorm.DB) error {
	var count int64
	db.Model(&models.CalendarEvent{}).Count(&count)
	if count > 0 {
		return nil
	}

	events := []models.CalendarEvent{
		{
			Title:       "Assembleia Geral Ordinária de Pescadores de Porto Cercado",
			Day:         "15",
			Month:       "OUT",
			Year:        "2026",
			Time:        "09:00 - 12:00",
			Modality:    "Presencial",
			Location:    "Centro Comunitário de Porto Cercado",
			Description: "Discussão anual sobre cotas de pesca, relatórios financeiros e prestação de contas dos serviços prestados.",
			Category:    "Assembleia",
			Registered:  true,
		},
		{
			Title:       "Oficina de Pesca Sustentável e Limpeza dos Rios do Pantanal",
			Day:         "28",
			Month:       "OUT",
			Year:        "2026",
			Time:        "08:00 - 16:00",
			Modality:    "Presencial",
			Location:    "Orla do Rio Cuiabá - Porto Cercado",
			Description: "Mutirão ecológico com participação de associados, ambientalistas e comunidade local.",
			Category:    "Meio Ambiente",
			Registered:  false,
		},
	}

	for _, e := range events {
		if err := db.Create(&e).Error; err != nil {
			log.Printf("❌ Erro ao semear evento '%s': %v", e.Title, err)
			return err
		}
	}

	log.Println("  └─ 🟢 Seeder 'calendar_events': Agenda de eventos semeadas.")
	return nil
}
