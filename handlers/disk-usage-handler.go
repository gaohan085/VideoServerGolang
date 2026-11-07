package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/disk"
)

func ApiDiskUsageHandler(c *gin.Context) {
	dir, err := os.Getwd()
	if err != nil {
		c.Error(err)
		return
	}
	useageState, err := disk.Usage(dir)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": useageState,
	})
}
