package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

// @router /api/query/actor/:name
func ApiGetVideosByActress(c *fiber.Ctx) error {
	encodeURIname := c.Params("name")
	actressName, err := url.QueryUnescape(encodeURIname)
	if err != nil {
		return err
	}
	videos, err := database.QueryVideoByActor(actressName)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
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
