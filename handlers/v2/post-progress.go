package v2

import (
	"fmt"
	"go-fiber-react-ts/database"
	"os"
	"os/exec"
	"strings"

	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
)

// FFmpeg Server post to main server
func PostProgress(ctx *fiber.Ctx) error {
	var video database.VideoConvert
	if err := ctx.BodyParser(&video); err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if err := video.Update(); err != nil {
		return ctx.SendStatus(fiber.StatusInternalServerError)
	}

	if video.Status == "done" {
		go func() {
			var rootDir = os.Getenv("ROOT_DIR")
			var downloadLink = os.Getenv("FFMPEG_DOWNLOAD_ADDR")
			var script = fmt.Sprintf(`wget %s -P %s%s/`, downloadLink+video.OutputName, rootDir, video.Path)
			cmd := exec.Command("bash")
			cmd.Stdin = strings.NewReader(script)

			cmd.Start()
			cmd.Wait()
			if cmd.ProcessState.Success() {
				return
			}
		}()
	}

	return ctx.SendStatus(fiber.StatusOK)
}
