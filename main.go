package main

import (
	"embed"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html/v2"
	_ "github.com/joho/godotenv/autoload"

	"go-fiber-react-ts/handlers"
)

//go:embed dist/*
var content embed.FS

func main() {
	env := flag.String("env", "production", "environment")
	flag.Parse()
	os.Setenv("ENV", *env)
	engine := html.NewFileSystem(http.FS(content), ".html")

	app := fiber.New(
		fiber.Config{
			Views:        engine,
			Prefork:      true,
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
		},
	)

	switch *env {
	case "production":
		file, err := os.OpenFile("./access.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
		if err != nil {
			log.Fatalf("error opening file: %v", err)
		}
		// defer file.Close()
		app.Use(logger.New(logger.Config{
			Format:     "[${time}] ${ip} ${status} ${latency} ${method} ${path} - ${ua}\n",
			TimeFormat: "2006/Jan/02 Monday 15:04:05",
			TimeZone:   "Asia/Shanghai",
			Output:     file,
		}))

	default:
		app.Use(logger.New(logger.Config{
			Format:     "[DEBUG] | PID:${pid} | [${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path}\n",
			TimeFormat: "2006/Jan/02 Monday 15:04:05",
			TimeZone:   "Asia/Shanghai",
		}))
	}

	app.Use("/dist", filesystem.New(filesystem.Config{
		Root:       http.FS(content),
		PathPrefix: "dist",
		Browse:     true,
	}))

	app.Get("/", handlers.IndexHandler)

	api := app.Group("/api")

	api.Get("/disk", handlers.DiskUsageHandler)
	api.Post("/delete", handlers.DeleteHandler)
	api.Post("/rename", handlers.RenameHandler)
	api.Get("/version", handlers.VersionHandler)
	api.Get("/*", handlers.FileReaderHandlers)

	app.Listen(":3000")
}
