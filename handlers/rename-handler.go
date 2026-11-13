package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type RenameStruct struct {
	DirChildElem
	NewName string `json:"newName" form:"newName"`
}

func ApiRenameHandler(c *gin.Context) {
	var renameBody *RenameStruct
	if err := c.ShouldBind(&renameBody); err != nil {
		c.Error(err)
		return
	}

	rootDir /** 包含路径末尾斜杠 */ := os.Getenv("ROOT_DIR")

	if renameBody.CurrentPath == "/" {
		if err := os.Rename(rootDir+renameBody.Name, rootDir+renameBody.NewName); err != nil {
			c.Error(err)
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"data": "ok",
		})
		return
	}

	if err := os.Rename(rootDir+renameBody.CurrentPath+"/"+renameBody.Name, rootDir+renameBody.CurrentPath+"/"+renameBody.NewName); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": "ok",
	})
}
