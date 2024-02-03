package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func DeleteHandler(c *fiber.Ctx) error {
	var fileinfo DirChildElem

	rootDir := os.Getenv("ROOT_DIR")

	c.BodyParser(&fileinfo)

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
