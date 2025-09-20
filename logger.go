package main

import (
	"io"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	fiberlog "github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func LoggerRegister(app *fiber.App, usage string) {
	logFile, err := os.OpenFile("./log/access.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer logFile.Close()
	//Global fiberlog
	file, _ := os.OpenFile("./log/record.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	iw := io.MultiWriter(os.Stdout, file)
	fiberlog.SetOutput(iw)

	loggerConfigDev := logger.Config{
		Format:     "[INFO] | PID:${pid} | [${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path}\n",
		TimeFormat: "2006/Jan/02 15:04:05",
		TimeZone:   "Asia/Shanghai",
	}
	loggerConfigPro := logger.Config{
		Format:     "[${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path} | ${ua}\n",
		TimeFormat: "2006/Jan/02 15:04:05",
		TimeZone:   "Asia/Shanghai",
		Output:     logFile,
	}

	switch usage {
	case "ffmpeg":
		app.Use(logger.New(loggerConfigDev))
	case "dev":
		app.Use(logger.New(loggerConfigDev))
	default:
		app.Use(logger.New(loggerConfigPro))
	}
}
