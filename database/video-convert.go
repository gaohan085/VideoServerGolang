package database

import (
	"bufio"
	"fmt"
	"go-fiber-react-ts/lib"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"

	"gorm.io/gorm"

	_ "github.com/joho/godotenv/autoload"
)

type VideoConvert struct {
	gorm.Model
	FileName   string  `json:"fileName"`
	Path       string  `json:"path"`
	Status     string  `json:"status"` // "pending" || "converting" || "done"
	Duration   float64 `json:"duration"`
	Progress   float64 `json:"progress"`
	PlaySource string  `gorm:"unique" json:"playSource"`
}

func (v *VideoConvert) Create() error {
	return Db.Create(&v).Error
}

func (v *VideoConvert) Update() error {
	return Db.Save(&v).Error
}

func (v *VideoConvert) UpdateStatus(s string) error {
	v.Status = s

	return Db.Save(&v).Error
}

func (v *VideoConvert) Query(s string) error {
	return Db.Where(&VideoConvert{PlaySource: s}).First(&v).Error
}

func (v *VideoConvert) UpdateDuration() error { //DONE TEST
	rootDir := os.Getenv("ROOT_DIR")
	var script = fmt.Sprintf(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal %s`, fmt.Sprintf("%s%s/%s", rootDir, v.Path, v.FileName))

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

	return Db.Save(&v).Error
}

func (v *VideoConvert) UpdateProgress(p float64) error {
	v.Progress = p

	return Db.Save(&v).Error
}

func (v *VideoConvert) Convert(chInter chan<- int, chDone chan<- int) error {

	rootDir := os.Getenv("ROOT_DIR")
	var inputVideoPath = fmt.Sprintf("%s%s/%s", rootDir, v.Path, v.FileName)
	var outputVideoPath = fmt.Sprintf("%s%s/%s", rootDir, v.Path, "converted-"+v.FileName)
	var script = fmt.Sprintf(`
		FFREPORT=file=ffreport.log:level=32 taskset -c 0 ffmpeg -y -i %s -vcodec copy %s
		`, inputVideoPath, outputVideoPath)

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)
	if err := cmd.Start(); err != nil {
		chInter <- 0
		return err
	}

	v.Status = "converting"
	if err := v.Update(); err != nil {
		chInter <- 0
		return err
	}

	if err := cmd.Wait(); err != nil {
		chInter <- 0
		return err
	}

	if cmd.ProcessState.Success() {
		v.Status = "done"
		chDone <- 0
		return v.Update()
	}
	return nil
}

func (v *VideoConvert) ReadLog(chInter <-chan int, chDone <-chan int) error { //DONE TEST
	var progressline string
	progressReg := regexp.MustCompile(`(time=)([\d]{2}(:||[^\s])){4}`)

	for {
		select {
		case <-chDone:
			if err := v.UpdateProgress(1); err != nil {
				return err
			}
			return nil
		case <-chInter:
			return nil
		default:
			file, err := os.OpenFile("./ffreport.log", os.O_RDONLY, 0000)
			if err != nil && err != os.ErrNotExist {
				defer file.Close()
				return err
			} else if err == os.ErrNotExist {
				continue
			}

			scanner := bufio.NewScanner(file)

			for scanner.Scan() {
				if progressReg.MatchString(scanner.Text()) {
					progressline = scanner.Text()
				}
			}

			proTimeSlice := progressReg.FindAllString(progressline, -1)
			if len(proTimeSlice) != 0 {
				proTimeStr := (proTimeSlice[len(proTimeSlice)-1])
				progressTime := regexp.MustCompile(`([\d]{2}(:||[^\s])){4}`).FindString(proTimeStr)
				proInSeconds, err := lib.DurationInSeconds(progressTime)
				if err != nil {
					defer file.Close()
					return err
				}
				if err := v.UpdateProgress(proInSeconds / v.Duration); err != nil {
					defer file.Close()
					return err
				}
			}

			file.Close()
			time.Sleep(1 * time.Second)
		}
	}
}
