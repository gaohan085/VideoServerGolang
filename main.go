package main

import (
	"bytes"
	"embed"
	"encoding/json/jsontext"
	"encoding/json/v2"
	"fmt"
	"go-fiber-react-ts/database"
	"go-fiber-react-ts/handlers"
	"go-fiber-react-ts/lib"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/shirou/gopsutil/v3/disk"
	"gopkg.in/natefinch/lumberjack.v2"
)

//go:embed all:web_src/*
var htmlContent embed.FS

const (
	EnvDev        = "dev"
	EnvProduction = "production"
)

func IsProduction() bool {
	return os.Getenv("APP_ENV") == EnvProduction
}

func PrintBanner() {
	fmt.Println(`
   _____ _____ _   _
  / ____|_   _| \ | |
 | |  __  | | |  \| |
 | | |_ | | | | . ' |
 | |__| |_| |_| |\  |
  \_____|_____|_| \_|

	`)
	fmt.Printf("VERSION: %s\n", lib.Version)
	fmt.Printf("Environment: %s\n", os.Getenv("APP_ENV"))
}

func PgxDbMiddleware(pool *pgxpool.Pool) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Set("PgxPool", pool)
		ctx.Next()
	}
}

func RedisMiddleware(clients []*redis.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Set("redis0", clients[0])
		ctx.Set("redis1", clients[1])
		ctx.Set("redis2", clients[2])
	}
}

func ErrHandlerMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()

		if len(ctx.Errors) > 0 {
			err := ctx.Errors.Last().Err

			ctx.JSON(http.StatusInternalServerError, gin.H{
				"code": http.StatusInternalServerError,
				"data": err.Error(),
			})
		}
	}
}

func main() {
	PrintBanner()

	switch {
	case IsProduction():
		gin.DisableConsoleColor()
		gin.DefaultWriter = &lumberjack.Logger{
			Filename:   "access.log",
			MaxSize:    100,
			MaxBackups: 3,
			MaxAge:     28,
		}
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	pgxpool, err := database.PgxConnDatabase()
	if err != nil {
		log.Fatal(err)
	}
	redisClients := database.SetRedisClient()
	router.Use(PgxDbMiddleware(pgxpool))
	router.Use(RedisMiddleware(redisClients))
	router.Use(ErrHandlerMiddleware())

	router.Static("/assets", "./assets")
	subFS, err := fs.Sub(htmlContent, "web_src/dist")
	if err != nil {
		log.Fatal(err)
	}

	{
		api := router.Group("/api")
		api.GET("/ws", handlers.WebsocketHandler)
		api.GET("/diskusage", handlers.ApiDiskUsageHandler)
		api.POST("/delete", handlers.ApiDeleteHandler)
		api.POST("/rename", handlers.ApiRenameHandler)
		api.GET("/version", handlers.ApiAppVersionHandler)
		api.POST("/convert", handlers.ApiConvertHandler)
		api.POST("/refresh/sn/:sn", handlers.ApiRefreshVideoInfoBySN)
		{
			query := api.Group("/query")
			query.GET("/sn/:sn", handlers.ApiQueryVideoInfoBySN)
			query.GET("/tag/:tag", handlers.ApiQueryVideoByTag)
			query.GET("/director/:director", handlers.ApiQueryVideoByDirector)
			query.GET("/publisher/:publisher", handlers.ApiQueryVideoByPublisher)
			query.GET("/series/:series", handlers.ApiQueryVideoBySeries)
			query.GET("/actor/:actor", handlers.ApiGetVideosByActress)
		}
	}
	router.StaticFS("/dist", http.FS(subFS))
	router.LoadHTMLFS(http.FS(htmlContent), "web_src/*.html")
	router.NoRoute(func(ctx *gin.Context) {
		path := ctx.Request.URL.Path
		switch {
		case strings.HasPrefix(path, "/api/"):
			data, err := lib.ProxyDo(ctx, "http://localhost/video/"+strings.TrimPrefix(path, "/api/"))
			if err != nil {
				ctx.Error(err)
				return
			}
			var result jsontext.Value
			if err := json.Unmarshal(data, &result); err != nil {
				ctx.Error(err)
				return
			}
			ctx.JSON(http.StatusOK, gin.H{
				"code": http.StatusOK,
				"data": result,
			})

		default:
			cwd, err := os.Getwd()
			if err != nil {
				ctx.Error(err)
				return
			}
			usage, err := disk.Usage(cwd)
			if err != nil {
				ctx.Error(err)
				return
			}
			freedisk := float64(usage.Free) / (1024 * 1024 * 1024)
			manifest, err := htmlContent.ReadFile("web_src/dist/.vite/manifest.json")
			if err != nil {
				ctx.Error(err)
				return
			}
			chunk, err := lib.GetInjectChunk(bytes.NewReader(manifest))
			if err != nil {
				ctx.Error(err)
				return
			}

			ctx.HTML(http.StatusOK, "index.html", gin.H{
				"isProduction": IsProduction(),
				"Version":      lib.Version,
				"Freedisk":     fmt.Sprintf("%.2f", freedisk) + "GB",
				"Chunk":        &chunk,
			})
		}
	})

	http.ListenAndServe(":3000", router)
}
