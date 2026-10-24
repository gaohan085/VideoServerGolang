package database

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
	"github.com/redis/go-redis/v9"
)

var (
	Rdb0 *redis.Client
	Rdb1 *redis.Client
	Rdb2 *redis.Client
)

func SetRedisClient() {
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

	if err := rdb0.Ping(Ctx).Err(); err != nil {
		log.Fatal(err)
	}

	if err := rdb1.Ping(Ctx).Err(); err != nil {
		log.Fatal(err)
	}
	if err := rdb2.Ping(Ctx).Err(); err != nil {
		log.Fatal(err)
	}

	Rdb0 = rdb0
	Rdb1 = rdb1
	Rdb2 = rdb2
}
