package database

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

var ErrVideoConverting = errors.New("video is converting, cannot delete")
var ErrNoVideoToConvert = errors.New("no video to convert")

type VideoQueue struct {
	Queue            []VideoConvert `json:"queue"`
	VideoNeedConvert []VideoConvert
}

func (qu *VideoQueue) Query() error {
	return Db.Model(&VideoConvert{}).Order("ID").Find(&qu.Queue).Error
}

func (qu *VideoQueue) Join(v *VideoConvert) error {
	v.Status = "pending"
	return v.Create()
}

func (qu *VideoQueue) LeaveQueue(v *VideoConvert) error {
	if err := v.Query(v.PlaySource); err != nil {
		return err
	}
	if v.Status == "converting" {
		return ErrVideoConverting
	}

	return Db.Model(&VideoConvert{}).Delete(&VideoConvert{PlaySource: v.PlaySource}).Error
}

func (qu *VideoQueue) VideoNeedConvertedInQueue() (err error) { // DONE ✔test
	if len(qu.Queue) > 0 {
		for index, video := range qu.Queue {
			if video.Status == "pending" {
				qu.VideoNeedConvert = qu.Queue[index:]
				return
			}
		}
	}
	return nil
}

func (qu *VideoQueue) GetVideoConverting() (video *VideoConvert, err error) { // DONE ✔test
	for _, video := range qu.Queue {
		if video.Status == "converting" {
			return &video, nil
		}
	}
	return
}

func (qu *VideoQueue) GetNextConvertVideo() (video *VideoConvert, err error) { // DONE ✔test
	if err := qu.VideoNeedConvertedInQueue(); err != nil {
		return nil, err
	}
	if len(qu.VideoNeedConvert) > 0 {
		return &qu.VideoNeedConvert[0], nil
	}

	return nil, ErrNoVideoToConvert
}

func StartConvert() error {
	queue := VideoQueue{}
	ffmpegServer := os.Getenv("FFMPEG_SERVER_ADDR")

	if err := queue.Query(); err != nil {
		return err
	}

	if err := queue.VideoNeedConvertedInQueue(); err != nil {
		return err
	}

	videoConverting, err := queue.GetVideoConverting()
	if err != nil {
		return err
	}

	if videoConverting == nil {
		video, err := queue.GetNextConvertVideo()
		if err != nil {
			return err
		}

		body, _ := json.Marshal(video)
		req, _ := http.NewRequest("POST", ffmpegServer+"/api/v2/convert", bytes.NewBuffer(body))
		http.DefaultClient.Do(req)

	}

	return nil
}
