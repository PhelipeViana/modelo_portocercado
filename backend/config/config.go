package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Config struct {
	Port        string
	DB          *gorm.DB
	RedisClient *redis.Client
	JWTSecret   string
}

func getEnv(key, defaultValue string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultValue
}

func InitConfig() (*Config, error) {
	// Carregar arquivo .env (se existir localmente ou na raiz)
	if err := godotenv.Load("../.env"); err != nil {
		_ = godotenv.Load(".env") // Tenta no diretório atual
	}

	port := getEnv("PORT", "8080")
	jwtSecret := getEnv("JWT_SECRET", "portocercado2_super_secret_key_2026")

	// PostgreSQL Config (referências portocercado2)
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "portocercado2")
	dbPass := getEnv("DB_PASSWORD", "portocercado2_pass")
	dbName := getEnv("DB_NAME", "portocercado2_db")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Cuiaba",
		dbHost, dbUser, dbPass, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Printf("⚠️ Erro ao conectar ao PostgreSQL (%s@%s:%s/%s): %v. Mantendo fallback em memória...", dbUser, dbHost, dbPort, dbName, err)
	} else {
		sqlDB, err := db.DB()
		if err == nil {
			sqlDB.SetMaxIdleConns(10)
			sqlDB.SetMaxOpenConns(100)
			sqlDB.SetConnMaxLifetime(time.Hour)
			log.Println("✅ Conectado ao PostgreSQL (portocercado2_db) com sucesso!")
		}
	}

	// Redis Config
	redisHost := getEnv("REDIS_HOST", "localhost")
	redisPort := getEnv("REDIS_PORT", "6379")

	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password: "",
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("⚠️ Redis inacessível (%s:%s): %v", redisHost, redisPort, err)
	} else {
		log.Println("✅ Conectado ao Redis com sucesso!")
	}

	return &Config{
		Port:        port,
		DB:          db,
		RedisClient: rdb,
		JWTSecret:   jwtSecret,
	}, nil
}
