package schedule

import (
	"go-fiber-react-ts/database"
	"go-fiber-react-ts/lib"
	"time"

	"github.com/go-co-op/gocron/v2"
)

func Schedule() error {
	schedule, err := gocron.NewScheduler()
	if err != nil {
		return err
	}

	schedule.NewJob(
		gocron.DurationJob(1*time.Minute),
		gocron.NewTask(QueryVideoInfo),
	)
	schedule.NewJob(
		gocron.DurationRandomJob(30*time.Second, 3*time.Minute),
		gocron.NewTask(DownloadVideoPoster),
	)
	schedule.NewJob(
		gocron.DurationJob(5*time.Second),
		gocron.NewTask(GetActress),
	)

	schedule.NewJob(
		gocron.DurationJob(24*time.Hour),
		gocron.NewTask(RemoveErrorSerialNum()),
	)

	schedule.Start()

	return nil
}

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
		if lib.GetSerialNumReg(video.SerialNumber) != video.SerialNumber {
			video.Delete()
		}
	}

	return nil
}
