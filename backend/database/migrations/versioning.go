package migrations

import (
	"log"
	"time"

	"gorm.io/gorm"
)

// SchemaMigration armazena o histórico de migrações executadas no banco de dados (Versionamento)
type SchemaMigration struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Version   string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"version"`
	AppliedAt time.Time `gorm:"autoCreateTime" json:"appliedAt"`
}

func initMigrationTable(db *gorm.DB) error {
	if err := db.AutoMigrate(&SchemaMigration{}); err != nil {
		log.Printf("❌ Erro ao inicializar a tabela de versionamento 'schema_migrations': %v", err)
		return err
	}
	return nil
}

func isVersionApplied(db *gorm.DB, version string) bool {
	var count int64
	db.Model(&SchemaMigration{}).Where("version = ?", version).Count(&count)
	return count > 0
}

func recordVersion(db *gorm.DB, version string) error {
	rec := SchemaMigration{Version: version, AppliedAt: time.Now()}
	if err := db.Create(&rec).Error; err != nil {
		log.Printf("❌ Erro ao registrar versão '%s' em 'schema_migrations': %v", version, err)
		return err
	}
	return nil
}
