package services

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

type CacheService struct {
	rdb *redis.Client
}

func NewCacheService(rdb *redis.Client) *CacheService {
	return &CacheService{rdb: rdb}
}

func (c *CacheService) Get(ctx context.Context, key string, dest interface{}) bool {
	if c.rdb == nil {
		return false
	}
	val, err := c.rdb.Get(ctx, key).Result()
	if err != nil {
		return false // Cache miss or Redis down
	}

	if err := json.Unmarshal([]byte(val), dest); err != nil {
		log.Printf("⚠️ Erro ao deserializar cache para chave %s: %v", key, err)
		return false
	}
	return true
}

func (c *CacheService) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) {
	if c.rdb == nil {
		return
	}
	data, err := json.Marshal(value)
	if err != nil {
		log.Printf("⚠️ Erro ao serializar cache para chave %s: %v", key, err)
		return
	}

	if err := c.rdb.Set(ctx, key, data, expiration).Err(); err != nil {
		log.Printf("⚠️ Erro ao gravar chave no Redis %s: %v", key, err)
	}
}

func (c *CacheService) Delete(ctx context.Context, keys ...string) {
	if c.rdb == nil || len(keys) == 0 {
		return
	}
	c.rdb.Del(ctx, keys...)
}

func (c *CacheService) InvalidatePrefix(ctx context.Context, prefix string) {
	if c.rdb == nil {
		return
	}
	iter := c.rdb.Scan(ctx, 0, prefix+"*", 0).Iterator()
	var keys []string
	for iter.Next(ctx) {
		keys = append(keys, iter.Val())
	}
	if err := iter.Err(); err != nil {
		log.Printf("⚠️ Erro ao listar chaves do Redis com prefixo %s: %v", prefix, err)
		return
	}
	if len(keys) > 0 {
		c.rdb.Del(ctx, keys...)
	}
}
