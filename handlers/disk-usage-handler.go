package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/disk"
)

func DiskUsageHandler(c *fiber.Ctx) error {
	dir, err := os.Getwd()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	useageState, err := disk.Usage(dir)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(useageState)
}
