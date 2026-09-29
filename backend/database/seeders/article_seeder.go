package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func SeedArticles(db *gorm.DB) error {
	var count int64
	db.Model(&models.Article{}).Count(&count)
	if count > 0 {
		return nil
	}

	articles := []models.Article{
		{
			Slug:          "comunidade-portocercado-reuniao-preservacao-2026",
			Title:         "Comunidade de Porto Cercado se reúne para discutir diretrizes de preservação e pesca no Pantanal",
			Subtitle:      "Encontro com pescadores e lideranças locais debate cotas, período de defeso e novas tecnologias de fiscalização.",
			Summary:       "Lideranças comunitárias e pescadores artesanais de Porto Cercado se reuniram nesta semana para alinhar propostas de conservação dos rios e regulamentação da pesca esportiva e profissional.",
			Content:       "Pescadores, ribeirinhos e autoridades locais participaram de um fórum aberto em Porto Cercado para debater medidas sustentáveis para a pesca no Pantanal mato-grossense...",
			Category:      "Meio Ambiente",
			CategoryColor: "bg-emerald-600",
			Tag:           "Preservação",
			ImageURL:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
			AuthorName:    "José Carlos dos Santos",
			AuthorRole:    "Presidente da Associação",
			AuthorInit:    "JC",
			Date:          "28 de Setembro, 2026",
			ReadTime:      "4 min",
			Featured:      true,
		},
		{
			Slug:          "abertas-inscricoes-carteira-associado-2026",
			Title:         "Abertas as inscrições para renovação e emissão da Carteira do Associado 2026",
			Subtitle:      "Associados em dia garantem benefícios exclusivos, assessoria jurídica e voto na assembleia geral.",
			Summary:       "A diretoria da Associação de Porto Cercado convoca todos os pescadores e moradores para atualizarem seus cadastros no novo portal digital.",
			Content:       "O processo de recadastramento de associados já está disponível online e na sede física...",
			Category:      "Institucional",
			CategoryColor: "bg-blue-600",
			Tag:           "Comunicado",
			ImageURL:      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
			AuthorName:    "Phelipe Gabriel",
			AuthorRole:    "Diretor de TI e Sistemas",
			AuthorInit:    "PG",
			Date:          "25 de Setembro, 2026",
			ReadTime:      "3 min",
			Featured:      false,
		},
	}

	for _, a := range articles {
		if err := db.Create(&a).Error; err != nil {
			log.Printf("❌ Erro ao semear artigo '%s': %v", a.Title, err)
			return err
		}
	}

	log.Println("  └─ 🟢 Seeder 'articles': Notícias iniciais semeadas.")
	return nil
}
