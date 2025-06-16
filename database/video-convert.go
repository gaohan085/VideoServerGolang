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

	fiberlog "github.com/gofiber/fiber/v2/log"
)

type VideoConvert struct {
	FileName   string  `json:"fileName"`
	Path       string  `json:"path"`
	Status     string  `json:"status"` // "pending" || "converting" || "done"
	Duration   float64 `json:"duration"`
	Progress   float64 `json:"progress"`
	PlaySource string  `json:"playSource"`
	OutputName string  `json:"outputName"`
	Downloaded bool    `json:"downloaded"`
}

func CreateVideoConvertRecordTable() error { //TODO test
	query := `
		CREATE TABLE IF NOT EXISTS video_converts (
			id SERIAL PRIMARY KEY,
			filename TEXT,
			path TEXT,
			status TEXT,
			duration NUMERIC(12,6),
			progress NUMERIC(4,3),
			play_source TEXT UNIQUE,
			output_name TEXT,
			downloaded BOOL NOT NULL DEFAULT 'false'
		);
	`

	_, err := PgxPool.Exec(Ctx, query)
	if err != nil {
		return err
	}
	return nil
}

func DROPVideoConvertRecordTable() error {
	query := `
		DROP TABLE IF EXISTS
			video_converts;
	`
	_, err := PgxPool.Exec(Ctx, query)
	if err != nil {
		return err
	}
	return nil
}

func (v *VideoConvert) Create() error {
	query := `
		INSERT INTO video_converts (
			filename,
			path,
			status,
			duration,
			progress,
			play_source,
			output_name,
			downloaded
		)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8)
		ON CONFLICT (play_source) DO UPDATE SET play_source = EXCLUDED.play_source;
	`
	_, err := PgxPool.Exec(Ctx, query,
		v.FileName,
		v.Path,
		v.Status,
		v.Duration,
		v.Progress,
		v.PlaySource,
		v.OutputName,
		v.Downloaded,
	)
	return err
}

func (v *VideoConvert) Update() error {
	query := `
		UPDATE
			video_converts
		SET 
			filename = $1,
			path = $2,
			status = $3,
			duration = $4,
			progress = $5,
			output_name = $6,
			downloaded = $7
		WHERE
			play_source = $8
	`
	_, err := PgxPool.Exec(Ctx, query,
		v.FileName,
		v.Path,
		v.Status,
		v.Duration,
		v.Progress,
		v.OutputName,
		v.Downloaded,
		v.PlaySource,
	)

	return err
}

// Query 方法不传入任何参数，应先初始化一个VideoConvert实例，
// 给videocvt.PlaySource 赋值后使用query方法
//
//	videoconvert := &VideoConvert{}
//	videoconvert.Playsource = "somes_string_play_source"
//	videoconvert.Query()
func (v *VideoConvert) Query() error {
	query := `
		SELECT
			filename,
			path,
			status,
			duration,
			progress,
			play_source,
			output_name,
			downloaded
		FROM
			video_converts
		WHERE
			play_source = $1;
	`

	return PgxPool.QueryRow(Ctx, query, v.PlaySource).Scan(
		&v.FileName,
		&v.Path,
		&v.Status,
		&v.Duration,
		&v.Progress,
		&v.PlaySource,
		&v.OutputName,
		&v.Downloaded,
	)
}

func (v *VideoConvert) UpdateDuration() error { //DONE TEST
	// omit flag '-sexagesimal' then script can generate duration in seconds
	var script = fmt.Sprintf(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 %s`, v.PlaySource)

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
		v.Duration, err = strconv.ParseFloat(line, 64)
		if err != nil {
			return err
		}
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
	wget -nc %s &&
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
	fiberlog.Info("Downloading Converted Video " + v.FileName)
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

func (v *VideoConvert) Delete() error {
	_, err := PgxPool.Exec(Ctx, `
		DELETE FROM video_converts
		WHERE play_source = $1;
	`, v.PlaySource)
	return err
}

func GetAllVideoNeedConvert() ([]VideoConvert, error) {
	videos := []VideoConvert{}
	rows, err := PgxPool.Query(Ctx, `
		SELECT 
			filename,
			path,
			status,
			duration,
			progress,
			play_source,
			output_name,
			downloaded
		FROM video_converts 
		ORDER BY id;
	`)
	if err != nil {
		return []VideoConvert{}, err
	}

	for rows.Next() {
		video := VideoConvert{}

		if err := rows.Scan(
			&video.FileName,
			video.Path,
			video.Status,
			video.Duration,
			video.Progress,
			video.PlaySource,
			video.OutputName,
			video.Downloaded,
		); err != nil {
			return []VideoConvert{}, err
		}

		videos = append(videos, video)
	}

	return videos, nil
}

func GetVideoNeedDownload() (*VideoConvert, error) {
	video := VideoConvert{}

	query := `
		SELECT
			filename,
			path,
			status,
			duration,
			progress,
			play_source,
			output_name,
			downloaded
		FROM
			video_converts
		WHERE
			status = $1 AND downloaded = $2
		ORDER BY id
		LIMIT 1;
	`

	if err := PgxPool.QueryRow(Ctx, query, "done", false).Scan(
		&video.FileName,
		&video.Path,
		&video.Status,
		&video.Duration,
		&video.Progress,
		&video.PlaySource,
		&video.OutputName,
		&video.Downloaded,
	); err != nil {
		return nil, err
	}

	return &video, nil
}
