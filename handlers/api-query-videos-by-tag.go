package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

type VideoBriefInfo struct {
	SN         string `json:"sn"`
	Title      string `json:"title"`
	PosterUrl  string `json:"posterUrl"`
	PlaySource string `json:"playSource"`
}

func (v *VideoBriefInfo) MapDbData(dbvideo *database.VideoDetailedInfo) {
	v.SN = dbvideo.SN
	v.Title = dbvideo.Title
	v.PlaySource = dbvideo.PlaySource
	if dbvideo.PosterFileName != "" {
		v.PosterUrl = "/assets/poster/" + dbvideo.PosterFileName
	}
}

func ApiQueryVideoByTag(c *fiber.Ctx) error {
	tag, err := url.QueryUnescape(c.Params("tag"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			&RespBody{
				StatusCode: fiber.StatusInternalServerError,
				Data:       err.Error(),
			},
		)
	}
	videos, err := database.QueryVideosByTag(tag)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			&RespBody{
				StatusCode: fiber.StatusInternalServerError,
				Data:       err.Error(),
			},
		)
	}

	videosBrief := []VideoBriefInfo{}
	for _, video := range videos {
		videoBrief := VideoBriefInfo{}
		videoBrief.MapDbData(&video)
		videosBrief = append(videosBrief, videoBrief)
	}
	return c.Status(fiber.StatusOK).JSON(
		&RespBody{
			StatusCode: fiber.StatusOK,
			Data:       videosBrief,
		},
	)
}
