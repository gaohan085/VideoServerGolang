package database

import (
	"bufio"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUpdateDuration(t *testing.T) {
	InitTest(t)
	video := VideoConvert{
		FileName:   "test.mp4",
		Path:       "test",
		PlaySource: "http://127.0.0.1/video/test/test.mp4",
	}

	t.Run("获取Duration", func(t *testing.T) {
		err := video.UpdateDuration()

		assert.Nil(t, err)
		assert.Equal(t, 596.962, video.Duration)

	})

	t.Run("转换视频", func(t *testing.T) {
		var wg sync.WaitGroup
		chInter, chDone := make(chan int, 1024), make(chan int, 1024)

		wg.Add(1)
		go func(chInter chan<- int, chDone chan<- int) {
			video.Convert(chInter, chDone)
			defer wg.Done()
		}(chInter, chDone)
		wg.Add(1)
		go func(chInter <-chan int, chDone <-chan int) {
			video.ReadLog(chInter, chDone)
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

	Db.Migrator().DropTable(&VideoConvert{})
}

func TestReduceLineReadFromCat(t *testing.T) {
	var script = "cat ./progress2.log | tail -n 24"

	cmd := exec.Command("bash")

	cmd.Stdin = strings.NewReader(script)
	pipe, _ := cmd.StdoutPipe()
	scanner := bufio.NewScanner(pipe)
	var timeSlice []string

	err := cmd.Start()

	for scanner.Scan() {
		if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
			timeSlice = append(timeSlice, scanner.Text())
		}
	}

	if len(timeSlice) > 0 {
		outTime := timeSlice[len(timeSlice)-1]
		outTimeInus, _ := strconv.ParseFloat(regexp.MustCompile(`[\d]{5,}`).FindString(outTime), 64)

		assert.Equal(t, float64(189674667), outTimeInus)
	}

	assert.Nil(t, err)

	cmd.Wait()
}
