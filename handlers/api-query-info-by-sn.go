package handlers

import (
	"errors"
	"go-fiber-react-ts/database"
	"time"

	"github.com/gofiber/fiber/v2"
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

// @route /api/query/:sn<regex(([0-9]|[a-z]|[A-Z]){3,}-[0-9]{3,})>
func ApiQueryVideoInfoBySN(c *fiber.Ctx) error {
	video := &database.VideoDetailedInfo{SN: c.Params("sn")}
	videoBySn := &VideoBySn{}

	if err := video.Query(); err != nil {
		if errors.Is(err, database.ErrVideoNotFound) {
			return fiber.NewError(404, err.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if video.SN != "" && video.Title == "" {
		video.GetSourceUrl()
		video.GetDetailInfo()
	}

	videoBySn.MapDbData(video)

	return c.Status(fiber.StatusOK).JSON(
		&RespBody{
			StatusCode: fiber.StatusOK,
			Data:       videoBySn,
		},
	)
}
