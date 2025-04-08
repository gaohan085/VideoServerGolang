package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/disk"
)

func ApiDiskUsageHandler(c *fiber.Ctx) error {
	dir, err := os.Getwd()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: 500,
			Data:       err.Error(),
		})
	}
	useageState, err := disk.Usage(dir)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: 500,
			Data:       err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data:       useageState,
	})
}
