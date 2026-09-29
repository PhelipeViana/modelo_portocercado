package seeders

import (
	"log"
	"porto-cercado-backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) error {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return nil
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("❌ Erro ao gerar hash de senha para usuários: %v", err)
		return err
	}
	defaultPassword := string(hashedPass)

	users := []models.User{
		{
			Name:     "José Carlos",
			Email:    "josecarlos@portocercado.com.br",
			Role:     models.RoleSuper,
			Ativo:    true,
			Password: defaultPassword,
		},
		{
			Name:     "Phelipe Gabriel",
			Email:    "phelipegabriel1988@gmail.com",
			Role:     models.RoleSuper,
			Ativo:    true,
			Password: defaultPassword,
		},
		{
			Name:     "Administrador Porto Cercado",
			Email:    "admin@portocercado.com.br",
			Role:     models.RoleAdmin,
			Ativo:    true,
			Password: defaultPassword,
		},
	}

	for _, u := range users {
		if err := db.Create(&u).Error; err != nil {
			log.Printf("❌ Erro ao semear usuário %s: %v", u.Email, err)
			return err
		}
	}

	log.Println("  └─ 🟢 Seeder 'users': Administradores mestre semeados.")
	return nil
}
