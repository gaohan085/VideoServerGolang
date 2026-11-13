package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VideoBriefInfo struct {
	SN         string           `json:"sn"`
	Title      string           `json:"title"`
	PosterUrl  string           `json:"posterUrl"`
	PlaySource string           `json:"playSrc"`
	Actors     []database.Actor `json:"actors"`
}

func (v *VideoBriefInfo) MapDbData(dbvideo *database.VideoDetailedInfo) {
	v.SN = dbvideo.SN
	v.Title = dbvideo.Title
	v.PlaySource = dbvideo.PlaySource
	if dbvideo.PosterFileName != "" {
		v.PosterUrl = "/assets/poster/" + dbvideo.PosterFileName
	}
	v.Actors = dbvideo.Actors

}

func ApiQueryVideoByTag(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	tag, err := url.QueryUnescape(c.Param("tag"))
	if err != nil {
		c.Error(err)
		return
	}
	videos, err := database.QueryVideosByTag(tag, pool, c)
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
