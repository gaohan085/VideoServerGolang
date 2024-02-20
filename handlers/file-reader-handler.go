package handlers

import (
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"

	"go-fiber-react-ts/database"
	"go-fiber-react-ts/lib"
)

type Folder struct {
	ParentFolder string         `json:"parentFolder"`
	CurrentPath  string         `json:"currentPath"` //不含末尾 "/"
	ChildElem    []DirChildElem `json:"childElements"`
}

type DirChildElem struct {
	Name        string `json:"name"`
	IsFile      bool   `json:"isFile"`
	IsFolder    bool   `json:"isFolder"`
	ExtName     string `json:"extName"`
	PlaySrc     string `json:"playSrc"`
	CurrentPath string `json:"currentPath"` //不含末尾 "/"
	Poster      string `json:"poster"`
	Title       string `json:"title"`
	Actress     string `json:"actress"`
}

func FileReaderHandler(c *fiber.Ctx) error {
	path, err := url.QueryUnescape(c.Params("*"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: 500,
			Data:       err.Error(),
		})
	}

	rootDir := os.Getenv("ROOT_DIR")
	nginxServAddr := os.Getenv("NGINX_SERVE_ADDRESS")
	entries, err := os.ReadDir(rootDir + path)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(&RespBody{
			StatusCode: 404,
			Data:       err.Error(),
		})
	}

	var elems = make([]DirChildElem, len(entries))

	for index, entry := range entries {
		var extName string

		if strings.Contains(entry.Name(), ".") {
			extName = entry.Name()[strings.LastIndex(entry.Name(), "."):]
		}
		var playSrc string
		if lib.IsVideo(&extName) {
			playSrc = nginxServAddr + path + "/" + entry.Name()
		} else {
			playSrc = ""
		}

		//从数据库读取视频封面文件名
		video := new(database.VideoInf)
		serialNum := lib.GetSerialNumReg(entry.Name())
		if !entry.IsDir() && lib.IsVideo(&extName) && serialNum != "" {
			if err := video.QueryByVideoName(serialNum); err == database.ErrVideoNotFound {
				video.SerialNumber = serialNum
				video.Create()
			} else if video.PlaySrc == "" {
				video.PlaySrc = playSrc
				video.Update()
			}
		}

		elems[index] = DirChildElem{
			Name:        entry.Name(),
			IsFile:      !entry.IsDir(),
			IsFolder:    entry.IsDir(),
			ExtName:     extName,
			PlaySrc:     playSrc,
			CurrentPath: path,
			Poster:      video.PosterName,
			Title:       video.Title,
			Actress:     video.Actress,
		}
	}

	var parentFolder string
	var currentPath string
	if path == "" {
		parentFolder = ""
		currentPath = "/"
	} else if strings.Count(path, "/") == 0 {
		parentFolder = "/"
		currentPath = path
	} else {
		parentFolder = path[:strings.LastIndex(path, "/")]
		currentPath = path
	}

	time.Sleep(250 * time.Millisecond)
	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data: &Folder{
			ParentFolder: parentFolder,
			CurrentPath:  currentPath,
			ChildElem:    elems,
		},
	})

}
