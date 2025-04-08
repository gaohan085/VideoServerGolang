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
	var videos []database.VideoInf

	if err := database.Db.Model(&database.VideoInf{}).Where("actress = ? AND poster_name <> ?", actressName, "").Find(&videos).Error; err != nil {
		return err
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
