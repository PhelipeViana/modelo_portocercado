package migrations

import (
	"log"

	"gorm.io/gorm"
)

type MigrationItem struct {
	Version string
	Execute func(db *gorm.DB) error
}

// RunMigrations executa as migrações de forma versionada registrando cada versão em 'schema_migrations'
func RunMigrations(db *gorm.DB) error {
	if db == nil {
		log.Println("⚠️ Migrações ignoradas: Conexão com o banco de dados desativada/offline.")
		return nil
	}

	// 1. Inicializar a tabela de histórico de versões
	if err := initMigrationTable(db); err != nil {
		return err
	}

	log.Println("🔄 Verificando migrações pendentes no banco de dados...")

	migrationList := []MigrationItem{
		{Version: "20260929_01_users", Execute: MigrateUsers},
		{Version: "20260929_02_site_settings", Execute: MigrateSiteSettings},
		{Version: "20260929_03_articles", Execute: MigrateArticles},
		{Version: "20260929_04_official_documents", Execute: MigrateOfficialDocuments},
		{Version: "20260929_05_calendar_events", Execute: MigrateCalendarEvents},
		{Version: "20260929_06_video_episodes", Execute: MigrateVideoEpisodes},
		{Version: "20260930_01_article_status", Execute: MigrateArticleStatus},
		{Version: "20260930_02_article_video_url", Execute: MigrateArticleVideoURL},
	}

	appliedCount := 0
	for _, item := range migrationList {
		if isVersionApplied(db, item.Version) {
			log.Printf("  ├─ ⏩ Versão [%s] já aplicada anteriormente. Ignorando.", item.Version)
			continue
		}

		log.Printf("  ├─ 🚀 Aplicando migração [%s]...", item.Version)
		if err := item.Execute(db); err != nil {
			log.Printf("❌ Falha na migração [%s]: %v", item.Version, err)
			return err
		}

		if err := recordVersion(db, item.Version); err != nil {
			return err
		}
		appliedCount++
	}

	if appliedCount == 0 {
		log.Println("✅ O banco de dados já está totalmente atualizado na versão mais recente!")
	} else {
		log.Printf("✅ Migrações concluídas! (%d nova(s) versão(ões) aplicada(s)).", appliedCount)
	}

	return nil
}
