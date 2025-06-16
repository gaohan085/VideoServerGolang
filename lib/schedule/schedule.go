package schedule

import (
	"go-fiber-react-ts/database"
	"os"
	"time"

	"github.com/go-co-op/gocron/v2"
	fiberlog "github.com/gofiber/fiber/v2/log"
)

func Schedule() error {

	fiberlog.Info("Schedule Loaded Successfully.")

	schedule, err := gocron.NewScheduler()
	if err != nil {
		return err
	}

	switch os.Getenv("USAGE") {
	case "pro":
		schedule.NewJob(
			gocron.DurationJob(1*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start to get video info.")
				if err := QueryVideoInfo(); err != nil {
					fiberlog.Trace(err.Error())
				}
				if err := DownloadVideoPoster(); err != nil {
					fiberlog.Trace(err.Error())
				}
				if err := GetActress(); err != nil {
					fiberlog.Trace(err.Error())
				}
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(1*time.Minute),
			gocron.NewTask(func() {
				RemoveErrorSerialNum()
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(60*time.Second),
			gocron.NewTask(func() {
				DownloadConvertedVideo()
			}),
		)

		schedule.NewJob(
			gocron.DailyJob(1, gocron.NewAtTimes(gocron.NewAtTime(0, 0, 0))),
			gocron.NewTask(func() {
				CheckVideoExists()
			}),
		)

	case "ffmpeg":
		schedule.NewJob(
			gocron.DurationJob(30*time.Second),
			gocron.NewTask(func() {
				database.StartConvert()
			}),
		)
	default:
		return nil
	}

	schedule.Start()

	return nil
}
