package main

import (
	"go-fiber-react-ts/handlers"
	"net/http"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
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

	app.Static("/assets", "./assets/")

	api := app.Group("/api")
	api.Get("/disk", handlers.DiskUsageHandler)
	api.Post("/delete", handlers.DeleteHandler)
	api.Post("/rename", handlers.RenameHandler)
	api.Get("/version", handlers.VersionHandler)
	api.Get("/actress/:name", handlers.GetVideosByActress)
	api.Post("/convert", handlers.ConvertHandler)
	api.Get("/*", handlers.FileReaderHandler)

	app.Use("/dist", filesystem.New(filesystem.Config{
		Root:       http.FS(content),
		PathPrefix: "dist",
		Browse:     true,
	}))
	app.Get("/*", handlers.IndexHandler)

}
