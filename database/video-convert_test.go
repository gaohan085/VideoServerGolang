package database

import (
	"bufio"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestVideoConvertCRUD(t *testing.T) {
	t.Setenv("PGX_CONN", "postgres://gaohan:gh961004@192.168.1.199:5432/video_server_pgx_test")
	PgxConnDatabase()
	t.Run("创建表", func(t *testing.T) {
		err := CreateVideoConvertRecordTable()

		assert.Nil(t, err)
	})

	t.Run("测试写入&读取记录", func(t *testing.T) {
		vc := &VideoConvert{
			FileName:   faker.Username(),
			Path:       faker.Username(),
			Status:     "pending",
			Duration:   598.99,
			Progress:   0.87,
			PlaySource: faker.Username(),
			OutputName: faker.Username(),
			Downloaded: false,
		}

		assert.Nil(t, vc.Create())

		vcq := &VideoConvert{}
		vcq.PlaySource = vc.PlaySource
		assert.Nil(t, vcq.Query())
		assert.Equal(t, vc, vcq)

	})

	t.Run("测试更新记录", func(t *testing.T) {
		vc := &VideoConvert{
			FileName:   faker.Username(),
			Path:       faker.Username(),
			Status:     "pending",
			Duration:   598.99,
			Progress:   0.87,
			PlaySource: faker.Username(),
			OutputName: faker.Username(),
			Downloaded: false,
		}

		assert.Nil(t, vc.Create())

		vc.Progress = 0.99

		assert.Nil(t, vc.Update())

		vcq := &VideoConvert{PlaySource: vc.PlaySource}
		assert.Nil(t, vcq.Query())

		assert.Equal(t, vc.Progress, vcq.Progress)
	})

	video := VideoConvert{
		FileName:   "test.mp4",
		Path:       "test",
		PlaySource: "http://127.0.0.1/video/test/test.mp4",
	}

	t.Run("获取Duration", func(t *testing.T) {
		assert.Nil(t, video.Create())

		// nginx 服务运行中测试能通过
		assert.Nil(t, video.UpdateDuration())
		assert.Equal(t, 596.961814, video.Duration)

	})

	DROPVideoConvertRecordTable()

	t.SkipNow()
	t.Run("转换视频", func(t *testing.T) {
		var wg sync.WaitGroup
		chInter, chDone := make(chan int, 1024), make(chan int, 1024)

		wg.Add(1)
		go func(chInter chan<- int, chDone chan<- int) {
			video.ConvertOnFFmpegServer(chInter, chDone)
			defer wg.Done()
		}(chInter, chDone)
		wg.Add(1)
		go func(chInter <-chan int, chDone <-chan int) {
			video.ReadProgress(chInter, chDone)
			defer wg.Done()
		}(chInter, chDone)
		wg.Wait()

		videoT := VideoConvert{}

		err := Db.Model(VideoConvert{}).Where(&VideoConvert{FileName: video.FileName, Path: videoT.Path}).First(&videoT).Error
		assert.Nil(t, err)
		assert.Equal(t, "done", videoT.Status)
		assert.Equal(t, float64(1), videoT.Progress)
		assert.NotNil(t, videoT.Duration)
	})

}

func TestReduceLineReadFromCat(t *testing.T) {
	t.SkipNow()
	t.Run("", func(t *testing.T) {
		var script = "cat ./progress2.log | tail -n 12"
		cmd := exec.Command("bash")

		cmd.Stdin = strings.NewReader(script)
		pipe, _ := cmd.StdoutPipe()
		scanner := bufio.NewScanner(pipe)
		var time float64

		err := cmd.Start()

		for scanner.Scan() {
			if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
				time, _ = strconv.ParseFloat(regexp.MustCompile(`[\d]{5,}`).FindString(scanner.Text()), 64)
			}
		}

		assert.Equal(t, float64(189674667), time)
		assert.Nil(t, err)

		cmd.Wait()
	})
}
