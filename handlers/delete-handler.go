package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func DeleteHandler(c *fiber.Ctx) error {
	var fileinfo DirChildElem

	rootDir := os.Getenv("ROOT_DIR")

	c.BodyParser(&fileinfo)

	err := os.RemoveAll(rootDir + fileinfo.CurrentPath + fileinfo.Name)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendStatus(fiber.StatusOK)
}
