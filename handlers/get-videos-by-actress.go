package handlers

import (
	"go-fiber-react-ts/database"
	"net/url"
	"time"

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

	if err := database.Db.Model(&database.VideoInf{}).Where("actress = ?", actressName).Find(&videos).Error; err != nil {
		return err
	}

	time.Sleep(250 * time.Millisecond)
	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       videos,
	})
}
