package handlers

import "github.com/gofiber/fiber/v2"

func IndexHandler(c *fiber.Ctx) error {
	return c.Render("dist/index", fiber.Map{})
}
