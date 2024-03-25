package v2

import (
	"go-fiber-react-ts/database"

	"github.com/gofiber/fiber/v2"
)

func ConvertVideo(ctx *fiber.Ctx) error {
	var video database.VideoConvert
	if err := ctx.BodyParser(&video); err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	go func() error {
		chDone, chInter := make(chan int, 1024), make(chan int, 1024)
		if err := video.UpdateDurationOnFFmpegServer(); err != nil {
			return err
		}

		go video.ConvertOnFFmpegServer(chInter, chDone)
		go video.ReadLogANDSendToMainServer(chInter, chDone)

		return nil
	}()
	return ctx.SendStatus(fiber.StatusOK)
}
