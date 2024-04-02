package schedule

import (
	"go-fiber-react-ts/database"
	"go-fiber-react-ts/lib"
	"strings"
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

	if err := database.Db.Model(&database.VideoConvert{}).Where("downloaded = ? ", false).First(&videoConverts).Error; err != nil {
		return err
	}

	go videoConverts.DownloadConverted()

	return nil
}
