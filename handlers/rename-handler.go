package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

type RenameStruct struct {
	DirChildElem
	NewName string `json:"newName"`
}

func ApiRenameHandler(c *fiber.Ctx) error {
	var renameBody *RenameStruct
	if err := c.BodyParser(&renameBody); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	rootDir /** 包含路径末尾斜杠 */ := os.Getenv("ROOT_DIR")

	if renameBody.CurrentPath == "/" {
		if err := os.Rename(rootDir+renameBody.Name, rootDir+renameBody.NewName); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}
		return c.Status(fiber.StatusOK).JSON(&RespBody{
			StatusCode: fiber.StatusOK,
			Data:       "ok",
		})
	}

	if err := os.Rename(rootDir+renameBody.CurrentPath+"/"+renameBody.Name, rootDir+renameBody.CurrentPath+"/"+renameBody.NewName); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: fiber.StatusOK,
		Data:       "ok",
	})
}
