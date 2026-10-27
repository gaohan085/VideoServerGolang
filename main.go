package main

import (
	"embed"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/pprof"
	"github.com/gofiber/fiber/v3/middleware/proxy"
	"github.com/gofiber/template/html/v3"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"

	"go-fiber-react-ts/database"
)

//go:embed dist/*
var distContent embed.FS

// main usage -ffmpeg -pro

func Parseflag() {
	usage := flag.String("usage", "dev", "Web server usage, can be 'pro' 'dev' or 'ffmpeg'. Usage is to determine log output way. When usage set to dev, log will output to Console, log write to log file while set to pro. Default: dev")
	file := flag.String("file", "local", "Where to get file information, can be 'local' or 'remote'.File command is to determine where to get video file and poster. Default: local")

	flag.Parse()

	os.Setenv("USAGE", *usage)
	os.Setenv("FileLocation", *file)
}

func main() {
	Parseflag()
	database.PgxConnDatabase()
	database.SetRedisClient()
	proxy.WithSecurityPolicy(proxy.SecurityPolicy{AllowPrivateIPs: true})

	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	engine := html.NewFileSystem(http.FS(distContent), ".html")

	app := fiber.New(
		fiber.Config{
			Views: engine, ServerHeader: "Fiber",
			ErrorHandler: fiber.DefaultErrorHandler,
			AppName:      "Go Fiber React TypeScript",
			ProxyHeader:  fiber.HeaderXForwardedFor,
		},
	)

	app.Use(pprof.New())

	usage := os.Getenv("USAGE")
	LoggerRegister(app, usage)
	registerRoutes(app)

	log.Fatal(app.Listen("127.0.0.1:3000", fiber.ListenConfig{EnablePrefork: true, DisableStartupMessage: false}))
}
