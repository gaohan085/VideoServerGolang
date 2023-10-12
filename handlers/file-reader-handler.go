package handlers

import (
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	_ "github.com/joho/godotenv/autoload"

	"go-fiber-react-ts/lib"
)

type Folder struct {
	ParentFolder string         `json:"parentFolder"`
	CurrentPath  string         `json:"currentPath"`
	ChildElem    []DirChildElem `json:"childElements"`
}

type DirChildElem struct {
	Name        string `json:"name"`
	IsFile      bool   `json:"isFile"`
	IsFolder    bool   `json:"isFolder"`
	ExtName     string `json:"extName"`
	PlaySrc     string `json:"playSrc"`
	CurrentPath string `json:"currentPath"`
}

func FileReaderHandlers(c *fiber.Ctx) error {
	path, err := url.QueryUnescape(c.Params("*"))
	switch os.Getenv("ENV") {
	case "production":
		rootDir := os.Getenv("ROOT_DIR")
		nginxServAddr := os.Getenv("NGINX_SERVE_ADDRESS")
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString(err.Error())
		}
		entries, err := os.ReadDir(rootDir + path)
		if err != nil {
			return c.Status(fiber.StatusNotFound).SendString(err.Error() + "ERROR OPEN" + " " + rootDir + c.Params("*"))
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
			elems[index] = DirChildElem{Name: entry.Name(), IsFile: !entry.IsDir(), IsFolder: entry.IsDir(), ExtName: extName, PlaySrc: playSrc, CurrentPath: path + "/"}
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
		return c.Status(fiber.StatusOK).JSON(&Folder{
			ParentFolder: parentFolder,
			CurrentPath:  currentPath,
			ChildElem:    elems,
		})
	default:
		return proxy.Do(c, "http://192.168.1.11/api/"+path)
	}

}
