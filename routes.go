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

		api.Get("/diskusage", handlers.ApiDiskUsageHandler)
		api.Post("/delete", handlers.ApiDeleteHandler)
		api.Post("/rename", handlers.ApiRenameHandler)
		api.Get("/version", handlers.ApiAppVersionHandler)
		api.Post("/convert", handlers.ApiConvertHandler)

		query := api.Group("/query")
		query.Get("/sn/:sn<regex(([0-9]|[a-z]|[A-Z]){2,}-[0-9]{3,})>", handlers.ApiQueryVideoInfoBySN)
		query.Get("/tag/:tag", handlers.ApiQueryVideoByTag)
		query.Get("/director/:director", handlers.ApiQueryVideoByDirector)
		query.Get("/publisher/:publisher", handlers.ApiQueryVideoByPublisher)
		query.Get("/series/:series", handlers.ApiQueryVideoBySeries)
		query.Get("/actor/:name", handlers.ApiGetVideosByActress)

		api.Get("/*", handlers.ApiFileReaderHandler)
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
	app.Get("/*", handlers.IndexHtmlHandler)
}
