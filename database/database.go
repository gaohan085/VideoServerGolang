package database

import (
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Db *gorm.DB

func SetDB() {
	var loggerConfig *logger.Config
	dest := os.Getenv("DB_DESTN")
	switch os.Getenv("ENV") {
	case "production":
		loggerConfig = &logger.Config{
			SlowThreshold:             time.Second,  // 慢 SQL 阈值
			LogLevel:                  logger.Error, // 日志级别
			IgnoreRecordNotFoundError: true,         // 忽略ErrRecordNotFound（记录未找到）错误
			Colorful:                  false,        // 禁用彩色打印
		}
	default:
		loggerConfig = &logger.Config{
			LogLevel:                  logger.Warn,
			IgnoreRecordNotFoundError: false,
			Colorful:                  true,
		}
	}

	db, err := gorm.Open(postgres.Open(dest), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            true,
		Logger:                 logger.New(log.New(os.Stdout, "\r\n", log.LstdFlags), *loggerConfig),
	})

	if err != nil {
		log.Fatal(err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal(err)
	}

	if err = sqlDB.Ping(); err != nil {
		sqlDB.Close()
		log.Fatal(err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxIdleTime(time.Hour)

	db.AutoMigrate(&VideoInf{}, &VideoConvert{})

	Db = db
}
