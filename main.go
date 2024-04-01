package main

import (
	"embed"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/pprof"
	"github.com/gofiber/template/html/v2"
	_ "github.com/joho/godotenv/autoload"

	"go-fiber-react-ts/database"
	"go-fiber-react-ts/handlers"
	"go-fiber-react-ts/lib/schedule"
)

//go:embed dist/*
var content embed.FS

func main() {
	env := flag.String("env", "production", "environment")
	flag.Parse()
	os.Setenv("ENV", *env)
	engine := html.NewFileSystem(http.FS(content), ".html")

	database.SetDB()
	go schedule.Schedule()

	app := fiber.New(
		fiber.Config{
			Views:        engine,
			Prefork:      false,
			ServerHeader: "Fiber",
			ErrorHandler: func(ctx *fiber.Ctx, err error) error {
				var e *fiber.Error
				if errors.As(err, &e) {
					return ctx.Status(e.Code).JSON(&handlers.RespBody{
						StatusCode: e.Code,
						Data:       e.Error(),
					})
				}
				return nil
			},
			DisableStartupMessage: false,
			AppName:               "Go Fiber React TypeScript",
			ProxyHeader:           fiber.HeaderXForwardedFor,
		},
	)

	app.Use(pprof.New())
	file, err := os.OpenFile("./log/access.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer file.Close()

	loggerConfigDev := logger.Config{
		Format:     "[DEBUG] | PID:${pid} | [${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path}\n",
		TimeFormat: "2006/Jan/02 Monday 15:04:05",
		TimeZone:   "Asia/Shanghai",
	}
	loggerConfigPro := logger.Config{
		Format:     "[${time}] ${ip} ${status} ${latency} ${method} ${path} - ${ua}\n",
		TimeFormat: "2006/Jan/02 Monday 15:04:05",
		TimeZone:   "Asia/Shanghai",
		Output:     file,
	}

	switch *env {
	case "production":
		app.Use(logger.New(loggerConfigPro))
	default:
		app.Use(logger.New(loggerConfigDev))
	}

	SetRoutes(app)

	if err := app.Listen("127.0.0.1:3000"); err != nil {
		log.Fatal(err)
	}
}
