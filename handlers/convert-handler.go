package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/joho/godotenv/autoload"
)

type Folder struct {
	ParentFolder string         `json:"parentFolder"`
	CurrentPath  string         `json:"currentPath"` //不含末尾 "/"
	ChildElem    []DirChildElem `json:"childElements"`
}

type DirChildElem struct {
	Name        string `json:"name"`
	Sn          string `json:"sn"`
	IsFile      bool   `json:"isFile"`
	IsFolder    bool   `json:"isFolder"`
	IsVideo     bool   `json:"isVideo"`
	ExtName     string `json:"extName"`
	PlaySrc     string `json:"playSrc"`
	CurrentPath string `json:"currentPath"` //不含末尾 "/"
	PosterUrl   string `json:"posterUrl"`
}

func ApiConvertHandler(c *gin.Context) {
	var videoInfo *DirChildElem
	var queue *database.VideoQueue
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)

	if err := c.ShouldBind(&videoInfo); err != nil {
		c.Error(err)
		return
	}

	if err := queue.Join(&database.VideoConvert{
		Path:       videoInfo.CurrentPath,
		FileName:   videoInfo.Name,
		PlaySource: videoInfo.PlaySrc,
	}, pool, c); err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"data": "Video joined convert queue successfully!",
	})
}
