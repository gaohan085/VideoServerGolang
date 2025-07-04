package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

func ApiQueryVideoByDirector(c *fiber.Ctx) error {
	director, err := url.QueryUnescape(c.Params("director"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			&RespBody{
				StatusCode: fiber.StatusInternalServerError,
				Data:       err.Error(),
			},
		)
	}

	videos, err := database.QueryVideosByDirector(director)
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
