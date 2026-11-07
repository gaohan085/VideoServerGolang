package handlers

import (
	"errors"
	"go-fiber-react-ts/database"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"
)

type VideoBySn struct {
	SN          string    `json:"sn"`
	Title       string    `json:"title"`
	ReleaseDate time.Time `json:"releaseDate"`
	Duration    int       `json:"duration"` //数据源自外部网站，数字单位为分钟
	Director    string    `json:"director"`
	Publisher   string    `json:"publisher"`
	Series      string    `json:"series"`
	Rank        float64   `json:"rank"`
	SourceUrl   string    `json:"sourceUrl"`
	Tags        []string  `json:"tags"`
	Actors      []struct {
		Name string `json:"name"`
		Sex  string `json:"sex"`
	} `json:"actors"`
}

func (v *VideoBySn) MapDbData(dbvideo *database.VideoDetailedInfo) {
	v.SN = dbvideo.SN
	v.Title = dbvideo.Title
	v.ReleaseDate = dbvideo.ReleaseDate
	v.Duration = dbvideo.Duration
	v.Director = dbvideo.Director
	v.Publisher = dbvideo.Publisher
	v.Series = dbvideo.Series
	v.Rank = dbvideo.Rank
	v.SourceUrl = dbvideo.SourceUrl

	for _, tag := range dbvideo.Tags {
		v.Tags = append(v.Tags, tag.Name)
	}

	for _, actor := range dbvideo.Actors {
		mapActor := struct {
			Name string `json:"name"`
			Sex  string `json:"sex"`
		}{
			Name: actor.Name,
			Sex:  actor.Sex,
		}
		v.Actors = append(v.Actors, mapActor)
	}
}

/*
	@route /api/query/:sn<regex(([0-9]|[a-z]|[A-Z]){2,}-[0-9]{3,})>
	@Method GET

从数据库查询SN码对应视频信息，如果查询为空则返回404。

	Notes:接受Body为{playsrc: string}的请求，用于更新video的play source.

如果需要服务端查询视频信息，Post请求 "/api/refresh/:sn?playsrc=...."
*/
func ApiQueryVideoInfoBySN(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	video := &database.VideoDetailedInfo{SN: strings.ToLower(c.Param("sn"))}
	videoBySn := &VideoBySn{}

	playSrc := c.Query("playsrc")

	if err := video.Query(pool, c); err != nil {
		if errors.Is(err, database.ErrVideoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"code": http.StatusNotFound,
				"data": err.Error(),
			})
		}
		return
	}

	if playSrc != video.PlaySource {
		video.PlaySource = playSrc

		if err := video.Update(pool, c); err != nil {
			c.Error(err)
			return
		}
	}

	videoBySn.MapDbData(video)

	c.JSON(http.StatusOK, gin.H{
		"code": fiber.StatusOK,
		"data": videoBySn,
	})
}
