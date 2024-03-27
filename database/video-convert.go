package database

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"go-fiber-react-ts/lib"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"

	_ "github.com/joho/godotenv/autoload"
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
}

func (v *VideoConvert) Create() error {
	return Db.Create(&v).Error
}

func (v *VideoConvert) Update() error {
	return Db.Model(&VideoConvert{}).Where("play_source = ?", v.PlaySource).Updates(&v).Error
}

func (v *VideoConvert) UpdateStatus(s string) error {
	return Db.Model(&VideoConvert{}).Where(&VideoConvert{PlaySource: v.PlaySource}).Update("status", s).Error
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

	return Db.Save(&v).Error
}

func (v *VideoConvert) UpdateProgress(p float64) error {
	return Db.Model(&VideoConvert{}).Where("play_source = ?", v.PlaySource).Update("progress", p).Error
}

func (v *VideoConvert) Convert(chInter chan<- int, chDone chan<- int) error {

	rootDir := os.Getenv("ROOT_DIR")
	var inputVideoPath = fmt.Sprintf("%s%s/%s", rootDir, v.Path, v.FileName)
	var outputVideoPath = fmt.Sprintf("%s%s/%s", rootDir, v.Path, lib.GetFilenameWithoutExt(v.FileName)+"_cvt.mp4")
	var script = fmt.Sprintf(`
		taskset -c 0,1 ffmpeg -y -progress ffreport.log -i %s -movflags faststart -acodec copy -vcodec copy %s
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
	script := `cat ffreport.log`

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
			cmd := exec.Command("bash")
			cmd.Stdin = strings.NewReader(script)
			buf, _ := cmd.StdoutPipe()
			scanner := bufio.NewScanner(buf)
			var timeSlice []string
			cmd.Start()

			for scanner.Scan() {
				if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
					timeSlice = append(timeSlice, scanner.Text())
				}
			}

			if len(timeSlice) > 0 {
				outTime := timeSlice[len(timeSlice)-1]
				outTimeInus, _ := strconv.ParseFloat(regexp.MustCompile(`[\d]{5,}`).FindString(outTime), 64)
				if err := v.UpdateProgress((outTimeInus / 1000000) / v.Duration); err != nil {
					return err
				}
			}

			cmd.Wait()
			time.Sleep(3 * time.Second)
		}
	}
}

// This function should only execute in ffmpeg server
func (v *VideoConvert) ConvertOnFFmpegServer(chInter chan<- int, chDone chan<- int) error {
	v.OutputName = lib.GetFilenameWithoutExt(v.FileName) + "_cvt.mp4"
	var script = fmt.Sprintf(`
	taskset -c 0,1,2 ffmpeg -y -progress ffreport.log -stats_period 2 -i %s -movflags faststart -acodec copy -vcodec libx264 %s
		`, v.PlaySource, v.OutputName)

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)
	if err := cmd.Start(); err != nil {
		chInter <- 0
		return err
	}

	v.Status = "converting"
	v.PostVideoData()

	if err := cmd.Wait(); err != nil {
		chInter <- 0
		return err
	}

	if cmd.ProcessState.Success() {
		chDone <- 0
	}
	return nil
}

// This function should only execute in ffmpeg server
func (v *VideoConvert) ReadLogANDSendToMainServer(chInter <-chan int, chDone <-chan int) error {
	script := `cat ffreport.log`

	for {
		select {
		case <-chDone:
			v.Progress = 1
			v.Status = "done"
			v.PostVideoData()

			return nil
		case <-chInter:
			return nil
		default:
			cmd := exec.Command("bash")
			cmd.Stdin = strings.NewReader(script)
			buf, _ := cmd.StdoutPipe()
			scanner := bufio.NewScanner(buf)
			var timeSlice []string
			cmd.Start()

			for scanner.Scan() {
				if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
					timeSlice = append(timeSlice, scanner.Text())
				}
			}

			if len(timeSlice) > 0 {
				outTime := timeSlice[len(timeSlice)-1]
				outTimeInus, _ := strconv.ParseFloat(regexp.MustCompile(`[\d]{5,}`).FindString(outTime), 64)

				v.Progress = (outTimeInus / 1000000) / v.Duration
				v.PostVideoData()
			}

			cmd.Wait()
			time.Sleep(3 * time.Second)
		}
	}
}

// This function should only execute in ffmpeg server
func (v *VideoConvert) PostVideoData() {
	mainServer := os.Getenv("MAIN_SERVER")

	bodyByte, _ := json.Marshal(&v)
	req, _ := http.NewRequest("POST", mainServer+"/api/v2/progress", bytes.NewBuffer(bodyByte))
	req.Header.Set("Content-Type", "application/json")
	http.DefaultClient.Do(req)
}

func (v *VideoConvert) UpdateDurationOnFFmpegServer() error { //DONE TEST
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

	return cmd.Wait()
}
