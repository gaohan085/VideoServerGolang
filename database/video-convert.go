package database

import (
	"bufio"
	"fmt"
	"go-fiber-react-ts/lib"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type VideoConvert struct {
	ID         uint           `gorm:"primaryKey" faker:"-" json:"-"`
	CreatedAt  time.Time      `faker:"-" json:"-"`
	UpdatedAt  time.Time      `faker:"-" json:"-"`
	DeletedAt  gorm.DeletedAt `gorm:"index" faker:"-" json:"-"`
	FileName   string         `json:"fileName"`
	Path       string         `json:"path"`
	Status     string         `json:"status"` // "pending" || "converting" || "done"
	Duration   float64        `json:"duration"`
	Progress   float64        `json:"progress"`
	PlaySource string         `gorm:"unique" json:"playSource"`
	OutputName string         `json:"outputName"`
	Downloaded bool           `json:"downloaded"`
}

func (v *VideoConvert) Create() error {
	return Db.Create(&v).Error
}

func (v *VideoConvert) Update() error {
	return Db.Model(&VideoConvert{}).Where("play_source = ?", v.PlaySource).Updates(&v).Error
}

func (v *VideoConvert) Query(s string) error {
	return Db.Where(&VideoConvert{PlaySource: s}).First(&v).Error
}

func (v *VideoConvert) UpdateDuration() error { //DONE TEST
	var script = fmt.Sprintf(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal %s`, v.PlaySource)

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	if err := cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(stdout)

	for scanner.Scan() {
		line := scanner.Text()
		duration, err := lib.DurationInSeconds(line)
		if err != nil {
			return err
		}

		v.Duration = duration
	}

	if err := cmd.Wait(); err != nil {
		return err
	}

	fiberlog.Info(fmt.Sprintf("Get video duration %s", v.FileName))
	return v.Update()
}

// This function should only execute in ffmpeg server
func (v *VideoConvert) ConvertOnFFmpegServer(chInter chan<- int, chDone chan<- int) error {
	v.OutputName = lib.GetFilenameWithoutExt(v.FileName) + "_cvt.mp4"
	var script = fmt.Sprintf(`
	rm -f ffreport.log &&
	wget %s &&
	taskset -c 0,1,2 ffmpeg -y -progress ffreport.log -stats_period 2 -i %s -movflags faststart -acodec copy -vcodec libx264 %s
		`, v.PlaySource, v.FileName, v.OutputName)

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)
	if err := cmd.Start(); err != nil {
		chInter <- 0
		return err
	}

	v.Status = "converting"
	v.Update()
	fiberlog.Info(fmt.Sprintf("Start converting video %s", v.FileName))

	if err := cmd.Wait(); err != nil {
		chInter <- 0
		return err
	}

	if cmd.ProcessState.Success() {
		chDone <- 0
		fiberlog.Info(fmt.Sprintf("Finish converting video %s", v.FileName))
		return nil
	}
	return nil
}

// This function should only execute in ffmpeg server
func (v *VideoConvert) ReadProgress(chInter <-chan int, chDone <-chan int) error {
	script := `cat ffreport.log | tail -n 12`

	for {
		select {
		case <-chDone:
			v.Progress = 1
			v.Status = "done"
			return v.Update()
		case <-chInter:
			return nil
		default:
			cmd := exec.Command("bash")
			cmd.Stdin = strings.NewReader(script)
			buf, _ := cmd.StdoutPipe()
			scanner := bufio.NewScanner(buf)
			cmd.Start()

			for scanner.Scan() {
				if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
					outTimeInus, _ := strconv.ParseFloat(regexp.MustCompile(`[\d]{5,}`).FindString(scanner.Text()), 64)
					v.Progress = (outTimeInus / 1000000) / v.Duration
					v.Update()
				}
			}

			cmd.Wait()
		}
		time.Sleep(3 * time.Second)
	}
}

func (v *VideoConvert) DownloadConverted() error {
	downloadLink := os.Getenv("FFMPEG_DOWNLOAD_ADDR")
	rootDir := os.Getenv("ROOT_DIR")
	var script = fmt.Sprintf(`wget -nc %s -P %s%s/`, downloadLink+v.OutputName, rootDir, v.Path)

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)

	if err := cmd.Start(); err != nil {
		return err
	}

	fiberlog.Info(fmt.Sprintf("Downloading video %s from %s", v.OutputName, downloadLink+v.OutputName))

	if err := cmd.Wait(); err != nil {
		return err
	}

	if cmd.ProcessState.Success() {
		v.Downloaded = true
		fiberlog.Info(fmt.Sprintf("Finish download video %s", v.OutputName))
		return v.Update()
	}

	return nil
}
