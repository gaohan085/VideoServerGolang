package main

import (
	"embed"
	"flag"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html/v2"
)

//go:embed dist/*
var content embed.FS

func main() {
	env := flag.String("env", "development", "environment")
	flag.Parse()
	os.Setenv("ENV", *env)

	engine := html.NewFileSystem(http.FS(content), ".html")

	app := fiber.New(
		fiber.Config{
			Views:        engine,
			Prefork:      true,
			ServerHeader: "Fiber",
		},
	)

	app.Use(logger.New(logger.Config{
		Format:     "[DEBUG] | PID:${pid} | [${time}] | ${status} | ${latency} | ${method} | ${path}\n",
		TimeFormat: "2006/Jan/02 Monday 15:04:05",
		TimeZone:   "Asia/Shanghai",
	}))

	app.Use("/dist", filesystem.New(filesystem.Config{
		Root:       http.FS(content),
		PathPrefix: "dist",
		Browse:     true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("dist/index", fiber.Map{})
	})

	app.Listen(":3000")
}
