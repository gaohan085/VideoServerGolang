package handlers

import (
	"go-fiber-react-ts/lib"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v3"
)

func ApiAppVersionHandler(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"code": fiber.StatusOK,
		"data": lib.Version,
	})
}
