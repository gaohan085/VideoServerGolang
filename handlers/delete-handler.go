package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type DelBody struct {
	Path string `json:"path" form:"name,default="`
	Name string `json:"name" form:"name,default="`
}

func ApiDeleteHandler(c *gin.Context) {
	var fileinfo DelBody

	rootDir := os.Getenv("ROOT_DIR")

	if err := c.ShouldBind(&fileinfo); err != nil {
		c.Error(err)
		return
	}

	if fileinfo.Name == "" || fileinfo.Path == "" {
		c.JSON(http.StatusForbidden, gin.H{
			"code": http.StatusForbidden,
			"data": "Please Provide PATH And NAME To Delete!",
		})
		return
	}

	if err := os.RemoveAll(rootDir + fileinfo.Path + fileinfo.Name); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": "Delete Compeleted! Please mutate data!",
	})
}
