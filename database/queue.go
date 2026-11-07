package database

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrVideoConverting = errors.New("video is converting, cannot delete")
var ErrNoVideoToConvert = errors.New("no video to convert")

type VideoQueue struct {
	Queue            []VideoConvert `json:"queue"`
	VideoNeedConvert []VideoConvert
}

func (qu *VideoQueue) Query(pool *pgxpool.Pool, ctx context.Context) error {
	queue, err := GetAllVideoNeedConvert(pool, ctx)
	if err != nil {
		return err
	}
	qu.Queue = queue
	return nil
}

func (qu *VideoQueue) Join(v *VideoConvert, pool *pgxpool.Pool, ctx context.Context) error {
	v.Status = "pending"
	v.Create(pool, ctx)
	return nil
}

func (qu *VideoQueue) LeaveQueue(v *VideoConvert, pool *pgxpool.Pool, ctx context.Context) error {
	if err := v.Query(pool, ctx); err != nil {
		return err
	}
	if v.Status == "converting" {
		return ErrVideoConverting
	}

	return v.Delete(pool, ctx)
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

func StartConvert(pool *pgxpool.Pool, ctx context.Context) error {
	queue := VideoQueue{}

	if err := queue.Query(pool, ctx); err != nil {
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
			if err := video.UpdateDuration(pool, ctx); err != nil {
				return err
			}

			go video.ConvertOnFFmpegServer(chInter, chDone, pool, ctx)
			go video.ReadProgress(chInter, chDone, pool, ctx)

			return nil
		}()
		return nil
	}
	return nil
}
