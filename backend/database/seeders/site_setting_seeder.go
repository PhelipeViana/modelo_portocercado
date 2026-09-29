package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"gorm.io/gorm"
)

func SeedSiteSettings(db *gorm.DB) error {
	var count int64
	db.Model(&models.SiteSetting{}).Count(&count)
	if count > 0 {
		return nil
	}

	siteInfo := models.SiteSetting{
		Title:           "Associação dos Ribeirinhos do Porto Cercado",
		HeroTitle:       "Proteja Seu Futuro e Fortaleça Nossa Associação",
		HeroSubtitle:    "Junte-se à Associação dos Ribeirinhos do Porto Cercado. Tenha voz e vez na Associação Pantaneira.",
		HeroImage:       "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
		Logo:            "/logo.png",
		StatsAssociados: "52",
		StatsHistorico:  "1",
		FooterText:      "Unidos Somos Mais Fortes. A Associação tem por objetivo ser a voz e a luta em prol da Comunidade Ribeirinha de Porto Cercado.",
		Address:         "Porto Cercado, Poconé - MT",
		Phone:           "(65) 99805-9960",
		Whatsapp:        "(65) 99805-9960",
		Email:           "contato@portocercado.com.br",
		CNPJ:            "61.968.959/0001-00",
		Facebook:        "https://facebook.com/portocercado",
		Instagram:       "https://instagram.com/portocercado",
		AboutTitle:      "Voz e Luta em Prol da Comunidade Ribeirinha",
		AboutContent:    "Depois de várias reuniões, a Associação foi criada e aprovado seu estatuto em 15.03.2025. A Associação nasceu da necessidade de aglutinar os anseios dos Ribeirinhos e ser o porta-voz das demandas coletivas junto aos Poderes Públicos.",
		Benefit1Title:   "Assessoria Jurídica",
		Benefit1Desc:    "Defesa dos Direitos dos Ribeirinhos e Cidadãos do Porto Cercado e Adjacências.",
		Benefit1Icon:    "shield",
		Benefit2Title:   "Cursos e Capacitação",
		Benefit2Desc:    "Capacitação profissional, pesca sustentável e preservação do Pantanal.",
		Benefit2Icon:    "book",
		Benefit3Title:   "Pagamento Mensalidade",
		Benefit3Desc:    "Todo pagamento é via Sistema com transparência junto aos Associados.",
		Benefit3Icon:    "badge",
	}

	if err := db.Create(&siteInfo).Error; err != nil {
		log.Printf("❌ Erro ao semear 'site_settings': %v", err)
		return err
	}

	log.Println("  └─ 🟢 Seeder 'site_settings': Informações institucionais semeadas.")
	return nil
}
