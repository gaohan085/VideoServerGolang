package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ApiQueryVideoBySeries(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	series, err := url.QueryUnescape(c.Param("series"))
	if err != nil {
		c.Error(err)
		return
	}

	videos, err := database.QueryVideosBySeries(series, pool, c)
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
		"code": http.StatusOK,
		"data": videosBrief,
	})
}
