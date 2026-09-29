package seeders

import (
	"log"

	"gorm.io/gorm"
)

// RunSeeders executa todos os seeders organizados por entidade na ordem correta
func RunSeeders(db *gorm.DB) error {
	if db == nil {
		log.Println("⚠️ Seeders ignorados: Banco de dados offline.")
		return nil
	}

	log.Println("🌱 Executando seeders de dados iniciais...")

	if err := SeedUsers(db); err != nil {
		return err
	}
	if err := SeedSiteSettings(db); err != nil {
		return err
	}
	if err := SeedArticles(db); err != nil {
		return err
	}
	if err := SeedOfficialDocuments(db); err != nil {
		return err
	}
	if err := SeedCalendarEvents(db); err != nil {
		return err
	}
	if err := SeedVideoEpisodes(db); err != nil {
		return err
	}

	log.Println("✅ Todos os seeders foram concluídos com sucesso!")
	return nil
}
