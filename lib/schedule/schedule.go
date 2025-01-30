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
				fiberlog.Info("Start schedule 'QueryVideoInfo'.")
				QueryVideoInfo()
			}),
		)
		schedule.NewJob(
			gocron.DurationRandomJob(30*time.Second, 3*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'DownloadVideoPoster'.")
				DownloadVideoPoster()
			}),
		)
		schedule.NewJob(
			gocron.DurationJob(5*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'GetActress'.")
				GetActress()
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(1*time.Minute),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'RemoveErrorSerialNum'.")
				RemoveErrorSerialNum()
			}),
		)

		schedule.NewJob(
			gocron.DurationJob(60*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'DownloadConvertedVideo'.")
				DownloadConvertedVideo()
			}),
		)

		schedule.NewJob(
			gocron.DailyJob(1, gocron.NewAtTimes(gocron.NewAtTime(0, 0, 0))),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'CheckVideoExist'.")
				CheckVideoExists()
			}),
		)

	case "ffmpeg":
		schedule.NewJob(
			gocron.DurationJob(30*time.Second),
			gocron.NewTask(func() {
				fiberlog.Info("Start schedule 'ConvertVideo'.")
				database.StartConvert()
			}),
		)
	default:
		return nil
	}

	schedule.Start()

	return nil
}
