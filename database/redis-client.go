package database

import (
	"context"
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/redis/go-redis/v9"
)

func SetRedisClient() []*redis.Client {
	RedisAddr := os.Getenv("REDIS_ADDR")
	RedisUsrname := os.Getenv("REDIS_USRNAME")
	RedisPasswd := os.Getenv("REDIS_PASSWD")

	rdb0 := redis.NewClient(&redis.Options{
		Addr:     RedisAddr,
		Username: RedisUsrname,
		Password: RedisPasswd,
		DB:       0,
	})

	rdb1 := redis.NewClient(&redis.Options{
		Addr:     RedisAddr,
		Username: RedisUsrname,
		Password: RedisPasswd,
		DB:       1,
	})

	rdb2 := redis.NewClient(&redis.Options{
		Addr:     RedisAddr,
		Username: RedisUsrname,
		Password: RedisPasswd,
		DB:       2,
	})

	if err := rdb0.Ping(context.Background()).Err(); err != nil {
		log.Fatal(err)
	}

	if err := rdb1.Ping(context.Background()).Err(); err != nil {
		log.Fatal(err)
	}
	if err := rdb2.Ping(context.Background()).Err(); err != nil {
		log.Fatal(err)
	}

	return []*redis.Client{rdb0, rdb1, rdb2}
}
