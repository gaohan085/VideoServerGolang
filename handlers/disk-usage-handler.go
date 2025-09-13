package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/disk"
)

func ApiDiskUsageHandler(c *fiber.Ctx) error {
	dir, err := os.Getwd()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}
	useageState, err := disk.Usage(dir)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       useageState,
	})
}
