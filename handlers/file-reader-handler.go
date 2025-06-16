package handlers

import (
	"net/url"
	"os"
	"strings"

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
	Sn          string `json:"sn"`
	IsFile      bool   `json:"isFile"`
	IsFolder    bool   `json:"isFolder"`
	IsVideo     bool   `json:"isVideo"`
	ExtName     string `json:"extName"`
	PlaySrc     string `json:"playSrc"`
	CurrentPath string `json:"currentPath"` //不含末尾 "/"
	PosterUrl   string `json:"posterUrl"`
	Title       string `json:"title"`
	Actress     string `json:"actress"`
	SourceUrl   string `json:"sourceUrl"`
}

// 只设置 Name, IsFile, IsFolder, ExtName
func (d *DirChildElem) SetValueFromfsEntry(entry os.DirEntry) {
	d.Name = entry.Name()
	d.IsFile = !entry.IsDir()
	d.IsFolder = entry.IsDir()
	if d.IsFile {
		d.ExtName = entry.Name()[strings.LastIndex(entry.Name(), "."):]
	}
	d.IsVideo = lib.IsVideo(&d.ExtName)
}

func (d *DirChildElem) SetPlaySrcANDCurrentPath(path string) {
	nginx := os.Getenv("NGINX_SERVE_ADDRESS")
	d.CurrentPath = path
	d.PlaySrc = nginx + path + "/" + d.Name
}

func (d *DirChildElem) SetFieldValueFromDB() error {
	d.Sn = strings.ToLower(lib.GetSerialNumReg(d.Name))
	if d.Sn != "" {
		video := database.VideoInf{SerialNumber: d.Sn}
		err := video.Query()
		if err == database.ErrVideoNotFound {
			video.PlaySrc = d.PlaySrc
			//数据库中无记录，应先创建再获取actress
			video.Create()
			return video.GetActress()
		}
		if video.PlaySrc != d.PlaySrc {
			video.PlaySrc = d.PlaySrc
			video.GetActress()
			return video.Update()
		}
		d.PosterUrl = "/assets/poster/" + video.PosterName
		d.Title = video.Title
		d.Actress = video.Actress
		d.SourceUrl = video.SourceUrl
	}

	return nil
}

func ApiFileReaderHandler(c *fiber.Ctx) error {
	path, err := url.QueryUnescape(c.Params("*"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(&RespBody{
			StatusCode: 500,
			Data:       err.Error(),
		})
	}

	rootDir := os.Getenv("ROOT_DIR")
	entries, err := os.ReadDir(rootDir + path)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(&RespBody{
			StatusCode: 404,
			Data:       err.Error(),
		})
	}

	var elems = []DirChildElem{}

	for _, entry := range entries {
		elem := DirChildElem{}
		elem.SetValueFromfsEntry(entry)
		if !entry.IsDir() {
			elem.SetPlaySrcANDCurrentPath(path)
			elem.SetFieldValueFromDB()
		} else {
			elem.CurrentPath = path
		}

		elems = append(elems, elem)
	}

	var parentFolder, currentPath string
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

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: 200,
		Data: &Folder{
			ParentFolder: parentFolder,
			CurrentPath:  currentPath,
			ChildElem:    elems,
		},
	})
}
