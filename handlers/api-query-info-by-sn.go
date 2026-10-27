package handlers

import (
	"errors"
	"fmt"
	"go-fiber-react-ts/database"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
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

	Notes:

如果需要服务端查询视频信息，Post请求 "/api/refresh/:sn"
*/
func ApiQueryVideoInfoBySN(c fiber.Ctx) error {
	video := &database.VideoDetailedInfo{SN: strings.ToLower(c.Params("sn"))}
	videoBySn := &VideoBySn{}

	if err := video.Query(); err != nil {
		if errors.Is(err, database.ErrVideoNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(&RespBody{
				StatusCode: fiber.StatusNotFound,
				Data:       fmt.Sprintf("Video information for %s not found.", video.SN),
			})
		}
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	videoBySn.MapDbData(video)

	return c.Status(fiber.StatusOK).JSON(
		&RespBody{
			StatusCode: fiber.StatusOK,
			Data:       videoBySn,
		},
	)
}
