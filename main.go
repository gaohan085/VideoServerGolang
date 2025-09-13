package main

import (
	"embed"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/pprof"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"

	"go-fiber-react-ts/database"
	"go-fiber-react-ts/handlers"
)

//go:embed dist/*
var content embed.FS

// main usage -ffmpeg -pro

func Parseflag() {
	usage := flag.String("usage", "dev", "Web server usage, can be 'pro' 'dev' or 'ffmpeg'. Default: dev")
	file := flag.String("file", "local", "Where to get file information, can be 'local' or 'remote'. Default: local")

	flag.Parse()

	os.Setenv("USAGE", *usage)
	os.Setenv("FileLocation", *file)
}

func main() {
	Parseflag()
	database.PgxConnDatabase()

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	usage := os.Getenv("USAGE")
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

	LoggerRegister(app, usage)

	switch usage {
	case "ffmpeg":
	case "dev":
		SetRoutes(app)
	default:
		SetRoutes(app)
	}

	log.Fatal(app.Listen("127.0.0.1:3000"))
}
