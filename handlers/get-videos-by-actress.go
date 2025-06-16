package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

type VideoByActress struct {
	database.VideoInf
	PosterUrl string `json:"posterUrl"`
}

func (va *VideoByActress) SetPosterUrl() {
	va.PosterUrl = "/assets/poster/" + va.PosterName
}

// @router /api/actress/:name
func GetVideosByActress(c *fiber.Ctx) error {
	encodeURIname := c.Params("name")
	actressName, err := url.QueryUnescape(encodeURIname)
	if err != nil {
		return err
	}
	videos, err := database.GetVideosByActress(actressName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: fiber.StatusInternalServerError,
			Data:       err.Error(),
		})
	}
	if len(videos) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(&RespBody{
			StatusCode: 404,
			Data:       videos,
		})
	}

	videosByAct := []VideoByActress{}

	for _, video := range videos {
		videoByAct := VideoByActress{
			VideoInf:  video,
			PosterUrl: "",
		}
		videoByAct.SetPosterUrl()
		videosByAct = append(videosByAct, videoByAct)
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       videosByAct,
	})
}
