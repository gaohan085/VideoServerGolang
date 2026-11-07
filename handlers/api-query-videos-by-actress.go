package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"
)

// @router /api/query/actor/:name
func ApiGetVideosByActress(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	name := c.Param("actor")
	if name == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"code": http.StatusNotFound,
			"data": "Please provide actor name.",
		})
		return
	}
	videos, err := database.QueryVideoByActor(name, pool, c)
	if err != nil {
		c.Error(err)
		return
	}

	videosBrief := []VideoBriefInfo{}
	for _, video := range videos {
		videoBrief := VideoBriefInfo{}
		if video.IsVideoFileExist() {
			videoBrief.MapDbData(&video)
			videosBrief = append(videosBrief, videoBrief)
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"code": fiber.StatusOK,
		"data": videosBrief,
	})
}
