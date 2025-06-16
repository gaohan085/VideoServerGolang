package database

import (
	"errors"
)

var ErrVideoConverting = errors.New("video is converting, cannot delete")
var ErrNoVideoToConvert = errors.New("no video to convert")

type VideoQueue struct {
	Queue            []VideoConvert `json:"queue"`
	VideoNeedConvert []VideoConvert
}

func (qu *VideoQueue) Query() error {
	queue, err := GetAllVideoNeedConvert()
	if err != nil {
		return err
	}
	qu.Queue = queue
	return nil
}

func (qu *VideoQueue) Join(v *VideoConvert) error {
	v.Status = "pending"
	v.Create()
	return nil
}

func (qu *VideoQueue) LeaveQueue(v *VideoConvert) error {
	if err := v.Query(); err != nil {
		return err
	}
	if v.Status == "converting" {
		return ErrVideoConverting
	}

	return v.Delete()
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

		go func() error {

			chDone, chInter := make(chan int, 1024), make(chan int, 1024)
			if err := video.UpdateDuration(); err != nil {
				return err
			}

			go video.ConvertOnFFmpegServer(chInter, chDone)
			go video.ReadProgress(chInter, chDone)

			return nil
		}()
		return nil
	}
	return nil
}
