package handlers

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

type DelBody struct {
	Path string `json:"path"`
	Name string `json:"name"`
}

func ApiDeleteHandler(c fiber.Ctx) error {
	var fileinfo DelBody

	rootDir := os.Getenv("ROOT_DIR")

	if err := c.Bind().Body(&fileinfo); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	if fileinfo.Name == "" || fileinfo.Path == "" {
		return c.Status(fiber.StatusForbidden).JSON(&RespBody{
			StatusCode: fiber.StatusForbidden,
			Data:       "Please Provide PATH And NAME To Delete!",
		})
	}

	if err := os.RemoveAll(rootDir + fileinfo.Path + fileinfo.Name); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       "Delete Compeleted! Please mutate data!",
	})
}
