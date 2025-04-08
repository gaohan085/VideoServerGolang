package handlers

import (
	"fmt"
	"go-fiber-react-ts/lib"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/disk"
)

func IndexHtmlHandler(c *fiber.Ctx) error {
	cwd, _ := os.Getwd()
	usage, _ := disk.Usage(cwd)
	freedisk := float64(usage.Free) / (1024 * 1024 * 1024)

	return c.Render("dist/index", fiber.Map{
		"Version":  lib.Version,
		"Freedisk": fmt.Sprintf("%.2f", freedisk) + "GB",
	})
}
