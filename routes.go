package main

import (
	"go-fiber-react-ts/handlers"
	"net/http"
	"net/url"
	"os"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func SetRoutes(app *fiber.App) {
	app.Use("/api/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/api/ws", handlers.Wshandler)

	api := app.Group("/api")
	switch os.Getenv("FileLocation") {
	case "local":
		app.Static("/assets", "./assets/")

		api.Get("/disk", handlers.DiskUsageHandler)
		api.Post("/delete", handlers.DeleteHandler)
		api.Post("/rename", handlers.RenameHandler)
		api.Get("/version", handlers.VersionHandler)
		api.Get("/actress/:name", handlers.GetVideosByActress)
		api.Post("/convert", handlers.ConvertHandler)
		api.Get("/*", handlers.FileReaderHandler)
	default:
		app.Get("/assets/*", func(c *fiber.Ctx) error {
			path, err := url.QueryUnescape(c.Params("*"))
			if err != nil {
				return err
			}

			return proxy.Do(c, "http://192.168.1.199/assets/"+path)
		})

		api.Get("/*", func(c *fiber.Ctx) error {
			path, err := url.QueryUnescape(c.Params("*"))
			if err != nil {
				return err
			}

			return proxy.Do(c, "http://192.168.1.199/api/"+path)
		})

	}

	app.Use("/dist", filesystem.New(filesystem.Config{
		Root:       http.FS(content),
		PathPrefix: "dist",
		Browse:     true,
	}))
	app.Get("/*", handlers.IndexHandler)
}
