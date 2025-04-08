package handlers

import (
	"go-fiber-react-ts/lib"

	"github.com/gofiber/fiber/v2"
)

func ApiAppVersionHandler(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: fiber.StatusOK,
		Data:       lib.Version,
	})
}
