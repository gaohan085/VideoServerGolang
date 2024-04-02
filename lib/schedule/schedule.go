package schedule

import (
	"go-fiber-react-ts/database"
	"os"
	"time"

	"github.com/go-co-op/gocron/v2"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

func Schedule() error {
	schedule, err := gocron.NewScheduler()
	if err != nil {
		return err
	}

	switch os.Getenv("USAGE") {
	case "main":
		schedule.NewJob(
			gocron.DurationJob(1*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'QueryVideoInfo'")
				QueryVideoInfo()
			}),
		)
		schedule.NewJob(
			gocron.DurationRandomJob(30*time.Second, 3*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'DownloadVideoPoster'")
				DownloadVideoPoster()
			}),
		)
		schedule.NewJob(
			gocron.DurationJob(5*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'GetActress'")
				GetActress()
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(1*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'RemoveErrorSerialNum'")
				RemoveErrorSerialNum()
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(60*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'DownloadConvertedVideo'")
				DownloadConvertedVideo()
			}),
		)

	case "ffmpeg":
		schedule.NewJob(
			gocron.DurationJob(30*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start task 'database.StartConvert'")
				database.StartConvert()
			}),
		)
	default:
		return nil
	}

	schedule.Start()

	return nil
}
