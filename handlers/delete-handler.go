package handlers

import (
	"os"
	"strings"

	"go-fiber-react-ts/database"
	"go-fiber-react-ts/lib"

	"github.com/gofiber/fiber/v2"
)

func DeleteHandler(c *fiber.Ctx) error {
	var fileinfo DirChildElem

	rootDir := os.Getenv("ROOT_DIR")

	c.BodyParser(&fileinfo)

	// 从数据库删除视频信息
	serialNum := lib.GetSerialNumReg(strings.ToLower(fileinfo.Name))
	if err := database.Db.Delete(&database.VideoInf{}, "serial_number = ?", serialNum).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			&RespBody{
				StatusCode: 500,
				Data:       err.Error(),
			},
		)
	}

	err := os.RemoveAll(rootDir + fileinfo.CurrentPath + "/" + fileinfo.Name)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: 500,
			Data:       err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       "ok",
	})
}
