package main

import (
	"fmt"
	"log"
	"os"

	"porto-cercado-backend/config"
	"porto-cercado-backend/database/migrations"
)

func main() {
	fmt.Println("==================================================")
	fmt.Println("🛠️ CLI MIGRATION - PORTO CERCADO 2")
	fmt.Println("==================================================")

	cfg, err := config.InitConfig()
	if err != nil {
		log.Fatalf("❌ Erro ao carregar configurações: %v", err)
	}

	if cfg.DB == nil {
		log.Fatalf("❌ Erro: Não foi possível conectar ao PostgreSQL. Verifique as credenciais no .env.")
		os.Exit(1)
	}

	if err := migrations.RunMigrations(cfg.DB); err != nil {
		log.Fatalf("❌ Erro durante a execução das migrações: %v", err)
		os.Exit(1)
	}

	fmt.Println("🎉 Execução de migração concluída com sucesso!")
}
