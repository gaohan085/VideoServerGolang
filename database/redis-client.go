package database

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func SetRedisClient() {
	RedisAddr := os.Getenv("REDIS_ADDR")
	RedisUsrname := os.Getenv("REDIS_USRNAME")
	RedisPasswd := os.Getenv("REDIS_PASSWD")

	rdb := redis.NewClient(&redis.Options{
		Addr:     RedisAddr,
		Username: RedisUsrname,
		Password: RedisPasswd,
		DB:       1,
	})

	if err := rdb.Ping(Ctx).Err(); err != nil {
		log.Fatal(err)
	}

	if err := rdb.Set(Ctx, "key", "value", 0).Err(); err != nil {
		log.Fatal(err)
	}

	RedisClient = rdb
}
