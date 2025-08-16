package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func ApiDeleteHandler(c *fiber.Ctx) error {
	var fileinfo DirChildElem

	rootDir := os.Getenv("ROOT_DIR")

	if err := c.BodyParser(&fileinfo); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if err := os.RemoveAll(rootDir + fileinfo.CurrentPath + "/" + fileinfo.Name); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       "ok",
	})
}
