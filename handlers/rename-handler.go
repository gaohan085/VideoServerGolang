package handlers

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

type RenameStruct struct {
	DirChildElem
	NewName string `json:"newName"`
}

func renameErrHandler(e error, c *fiber.Ctx) error {
	if e != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(e.Error())
	}
	return c.Status(fiber.StatusOK).SendString("ok")
}

func RenameHandler(c *fiber.Ctx) error {
	var renameBody *RenameStruct
	if err := c.BodyParser(&renameBody); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	rootDir /** 包含路径末尾斜杠 */ := os.Getenv("ROOT_DIR")
	fmt.Printf("%v\n", renameBody)

	if renameBody.CurrentPath == "/" {
		err := os.Rename(rootDir+renameBody.Name, rootDir+renameBody.NewName)
		return renameErrHandler(err, c)
	}

	return renameErrHandler(os.Rename(rootDir+renameBody.CurrentPath+renameBody.Name, rootDir+renameBody.CurrentPath+renameBody.NewName), c)
}
