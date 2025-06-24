package main

import (
	"embed"
	"errors"
	"flag"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	fiberlog "github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/logger"
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

	//Global fiberlog
	file, _ := os.OpenFile("./log/record.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	iw := io.MultiWriter(os.Stdout, file)
	fiberlog.SetOutput(iw)

	app.Use(pprof.New())
	file, err := os.OpenFile("./log/access.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer file.Close()

	loggerConfigDev := logger.Config{
		Format:     "[INFO] | PID:${pid} | [${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path}\n",
		TimeFormat: "2006/Jan/02 15:04:05",
		TimeZone:   "Asia/Shanghai",
	}
	loggerConfigPro := logger.Config{
		Format:     "[${time}] | ${ip} | ${status} | ${latency} | ${method} | ${path} | ${ua}\n",
		TimeFormat: "2006/Jan/02 15:04:05",
		TimeZone:   "Asia/Shanghai",
		Output:     file,
	}

	switch usage {
	case "ffmpeg":
		app.Use(logger.New(loggerConfigDev))

	case "dev":
		app.Use(logger.New(loggerConfigDev))
		SetRoutes(app)

	default:
		app.Use(logger.New(loggerConfigPro))
		SetRoutes(app)
	}

	if err := app.Listen("127.0.0.1:3000"); err != nil {
		log.Fatal(err)
	}
}
