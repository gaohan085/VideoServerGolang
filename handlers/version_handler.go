package handlers

import (
	"go-fiber-react-ts/lib"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ApiAppVersionHandler(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": lib.Version,
	})
}
