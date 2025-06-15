package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"

	"github.com/gofiber/fiber/v2"
)

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
	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       videos,
	})
}
