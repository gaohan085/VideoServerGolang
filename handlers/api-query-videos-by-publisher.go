package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func ApiQueryVideoByPublisher(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)

	publisher, err := url.QueryUnescape(c.Param("publisher"))
	if err != nil {
		c.Error(err)
		return
	}

	videos, err := database.QueryVideosByPublisher(strings.TrimPrefix(publisher, "/"), pool, c)
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
