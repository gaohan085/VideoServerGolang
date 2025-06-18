package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

func ApiQueryVideoByPublisher(c *fiber.Ctx) error {
	publisher, err := url.QueryUnescape(c.Params("publisher"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			&RespBody{
				StatusCode: fiber.StatusInternalServerError,
				Data:       err.Error(),
			},
		)
	}

	videos, err := database.QueryVideosByPublisher(publisher)
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
