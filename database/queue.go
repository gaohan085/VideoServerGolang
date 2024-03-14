package database

import "errors"

type VideoQueue struct {
	Queue []VideoConvert `json:"queue"`
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
		return errors.New("video is converting, cannot delete")
	}

	return Db.Model(&VideoConvert{}).Delete(&VideoConvert{PlaySource: v.PlaySource}).Error
}

func (qu *VideoQueue) VideoNeedConvertedInQueue() (videos []VideoConvert, err error) {

	if err := qu.Query(); err != nil {
		return nil, err
	}

	if len(qu.Queue) > 0 {
		for index, video := range qu.Queue {
			if video.Status == "pending" {
				return qu.Queue[index:], nil
			}
		}
	}
	return
}

func (qu *VideoQueue) GetVideoConverting() (video *VideoConvert, err error) {
	videoConverting := VideoConvert{}

	if err := Db.Where(&VideoConvert{Status: "converting"}).First(&videoConverting).Error; err != nil {
		return nil, err
	}
	return &videoConverting, nil
}

func (qu *VideoQueue) GetNextConvertVideo() (video *VideoConvert, err error) {
	videos, err := qu.VideoNeedConvertedInQueue()
	if err != nil {
		return nil, err
	}
	return &videos[0], nil
}

func StartConvert() error {
	queue := VideoQueue{}
	chDone, chInter := make(chan int, 1024), make(chan int, 1024)

	videoConverting, err := queue.GetVideoConverting()
	if err != nil {
		return err
	}

	if videoConverting == nil {
		video, err := queue.GetNextConvertVideo()
		if err != nil {
			return err
		}

		go video.Convert(chInter, chDone)
		go video.ReadLog(chInter, chDone)

	}

	return nil
}
