package schedule

import (
	"fmt"
	"go-fiber-react-ts/database"
	"go-fiber-react-ts/lib"
	"net/http"
	"strings"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

func QueryVideoInfo() error {
	videos := []database.VideoInf{}

	if err := database.Db.Model(&database.VideoInf{}).Where("source_url = ?", "").Order("ID").Find(&videos).Error; err != nil {
		return err
	}

	if len(videos) != 0 {
		return videos[0].GetDetailInfo()
	}

	return nil
}

func DownloadVideoPoster() error {
	videos := []database.VideoInf{}

	if err := database.Db.Model(&database.VideoInf{}).Where("source_poster_url <> ? AND poster_name = ?", "", "").Order("ID").Find(&videos).Error; err != nil {
		return err
	}

	if len(videos) != 0 {
		return videos[0].DownloadPoster()
	}

	return nil
}

func GetActress() error {
	videos := []database.VideoInf{}

	if err := database.Db.Model(&database.VideoInf{}).Where("source_url <> ? AND play_src <> ? AND actress = ?", "", "", "").Order("ID").Find(&videos).Error; err != nil {
		return err
	}

	if len(videos) != 0 {
		return videos[0].GetActress()
	}
	return nil
}

func RemoveErrorSerialNum() error {
	videos := []database.VideoInf{}

	if err := database.Db.Model(&database.VideoInf{}).Order("ID").Find(&videos).Error; err != nil {
		return err
	}

	for _, video := range videos {
		if lib.GetSerialNumReg(video.SerialNumber) != strings.ToLower(video.SerialNumber) {
			video.Delete()
		}
	}

	return nil
}

func DownloadConvertedVideo() error {
	videoConverts := database.VideoConvert{}

	if err := database.Db.Model(&database.VideoConvert{}).Where("status = ? AND downloaded = ? ", "done", false).First(&videoConverts).Error; err != nil {
		return err
	}

	go videoConverts.DownloadConverted()

	return nil
}

func CheckVideoExists() error {
	var videos = []database.VideoInf{}
	fiberlog.Info("Check videos exists")

	if err := database.Db.Model(&database.VideoInf{}).Order("ID").Find(&videos).Error; err != nil {
		return err
	}

CheckVideoExists:
	for _, video := range videos {
		fiberlog.Info(fmt.Sprintf("Checking video %s exists or not", video.SerialNumber))

		if video.PlaySrc == "" {
			fiberlog.Warn(fmt.Sprintf("Video %s play source not exist.", video.SerialNumber))
			video.Delete()
			continue CheckVideoExists
		}

		client := http.Client{}
		req, _ := http.NewRequest("GET", video.PlaySrc, nil)
		res, _ := client.Do(req)

		if res.StatusCode == 404 {
			video.Delete()
		}
		continue CheckVideoExists
	}
	return nil
}
