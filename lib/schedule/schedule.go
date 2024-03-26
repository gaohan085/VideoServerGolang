package schedule

import (
	"go-fiber-react-ts/database"
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
		gocron.DurationJob(1*time.Minute),
		gocron.NewTask(RemoveErrorSerialNum),
	)

	schedule.NewJob(
		gocron.DurationJob(1*time.Minute),
		gocron.NewTask(database.StartConvert),
	)

	schedule.Start()

	return nil
}
