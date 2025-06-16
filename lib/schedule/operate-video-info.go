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
	video, err := database.GetVideoToGetInfo()
	if err != nil {
		return err
	}
	return video.GetDetailInfo()
}

func DownloadVideoPoster() error {
	video, err := database.GetVideoToDownloadPoster()
	if err != nil {
		return err
	}
	return video.DownloadPoster()
}

func RemoveErrorSerialNum() error {
	videos, err := database.GetAllVideosRecord()
	if err != nil {
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
	videoConverts, err := database.GetVideoNeedDownload()
	if err != nil {
		return err
	}

	go videoConverts.DownloadConverted()

	return nil
}

func CheckVideoExists() error {
	videos, err := database.GetAllVideosRecord()
	if err != nil {
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
