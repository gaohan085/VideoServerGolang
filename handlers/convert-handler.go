package handlers

import (
	"go-fiber-react-ts/database"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
)

func ApiConvertHandler(ctx *fiber.Ctx) error {
	var videoInfo *DirChildElem
	var queue *database.VideoQueue

	ctx.BodyParser(&videoInfo)

	queue.Join(&database.VideoConvert{
		Path:       videoInfo.CurrentPath,
		FileName:   videoInfo.Name,
		PlaySource: videoInfo.PlaySrc,
	})

	return ctx.SendStatus(fiber.StatusOK)
}
