package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func SeedOfficialDocuments(db *gorm.DB) error {
	var count int64
	db.Model(&models.OfficialDocument{}).Count(&count)
	if count > 0 {
		return nil
	}

	docs := []models.OfficialDocument{
		{
			Title:       "Estatuto Social Aprovado em Assembleia 2025/2026",
			Code:        "EST-2025-01",
			Type:        "PDF",
			Date:        "15/03/2025",
			Size:        "2.4 MB",
			Status:      "Vigente",
			Summary:     "Estatuto regulamentar da Associação dos Ribeirinhos do Porto Cercado, estabelecendo deveres, direitos e regras de representação.",
			Category:    "Estatuto",
			DownloadURL: "#",
		},
		{
			Title:       "Edital de Convocação de Assembleia Geral Extraordinária",
			Code:        "ED-2026-04",
			Type:        "PDF",
			Date:        "20/09/2026",
			Size:        "1.1 MB",
			Status:      "Aberto",
			Summary:     "Convocação oficial de todos os associados para aprovação das contas do exercício de 2026 e eleição de comissão fiscal.",
			Category:    "Edital",
			DownloadURL: "#",
		},
	}

	for _, d := range docs {
		if err := db.Create(&d).Error; err != nil {
			log.Printf("❌ Erro ao semear documento '%s': %v", d.Title, err)
			return err
		}
	}

	log.Println("  └─ 🟢 Seeder 'official_documents': Documentos semearados.")
	return nil
}
