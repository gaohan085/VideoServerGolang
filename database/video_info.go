package database

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/jackc/pgx/v5"

	fiberlog "github.com/gofiber/fiber/v2/log"
)

var (
	ErrVideoNotFound        = errors.New("video info not found")
	ErrQueryVideoFail       = errors.New("query remote video fail")
	ErrQueryVideoUrlFail    = errors.New("query video source url fail")
	ErrQueryVideoPosterFail = errors.New("query video poster fail")
	ErrGetVideoSource       = errors.New("get video source url fail")
)

type VideoInf struct {
	ID              uint   `faker:"-" json:"id"`
	Title           string `json:"title"`
	SerialNumber    string `json:"serialNumber"`    //视频文件名
	SourceUrl       string `json:"sourceUrl"`       //Info来源地址
	PosterName      string `json:"posterName"`      //封面图片本地链接
	SourcePosterUrl string `json:"sourcePosterUrl"` //封面图片来源地址
	Actress         string `json:"actress"`
	PlaySrc         string `json:"playSrc"` //本地播放连接
}

func CreateVideoInfoTable() error { //DONE test
	query := `
	CREATE TABLE IF NOT EXISTS video_infos (
		id SERIAL PRIMARY KEY,
		serial_num TEXT NOT NULL UNIQUE,
		title TEXT,
		source_url TEXT,
		poster_name TEXT,
		source_poster_url TEXT,
		actress TEXT,
		play_src TEXT
	);
	`
	_, err := PgxPool.Exec(Ctx, query)
	return err
}

// ⚠ ⚠ ⚠ 只能在测试环境中使用
func DROPVideoInfoTable() error {
	query := `
		DROP TABLE IF EXISTS
			video_infos;
	`
	_, err := PgxPool.Exec(Ctx, query)
	return err
}

func (v *VideoInf) Create() error {
	query := `
		INSERT INTO video_infos (
			serial_num,
			title,
			source_url,
			poster_name,
			source_poster_url,
			actress,
			play_src
		)
		VALUES
		($1, $2, $3, $4, $5, $6, $7);
	`
	_, err := PgxPool.Exec(Ctx, query,
		v.SerialNumber, v.Title, v.SourceUrl, v.PosterName, v.SourcePosterUrl, v.Actress, v.PlaySrc,
	)
	return err
}

func (v *VideoInf) Query() error {
	query := `
		SELECT 
			serial_num,
			title,
			source_url,
			poster_name,
			source_poster_url,
			actress,
			play_src
		FROM 
			video_infos 
		WHERE 
			serial_num = $1;
	`
	err := PgxPool.QueryRow(Ctx, query, v.SerialNumber).Scan(
		&v.SerialNumber,
		&v.Title,
		&v.SourceUrl,
		&v.PosterName,
		&v.SourcePosterUrl,
		&v.Actress,
		&v.PlaySrc,
	)
	if err == pgx.ErrNoRows {
		return ErrVideoNotFound
	}

	return err
}

func (v *VideoInf) Update() error {
	query := `
		UPDATE video_infos
		SET 
			title = $1,
			source_url = $2,
			poster_name = $3,
			source_poster_url = $4,
			actress = $5,
			play_src = $6		
		WHERE
			serial_num = $7;
	`
	_, err := PgxPool.Exec(Ctx, query, v.Title, v.SourceUrl, v.PosterName, v.SourcePosterUrl, v.Actress, v.PlaySrc, v.SerialNumber)
	return err
}

func (v *VideoInf) Delete() error {
	query := `
		DELETE FROM TABLE 
			video_infos
		WHERE
			serial_num = $1;	
	`
	_, err := PgxPool.Exec(Ctx, query, v.SerialNumber)
	return err
}

func (v *VideoInf) QueryByVideoSerialNum(n string) error {
	v.SerialNumber = n
	return v.Query()
}

func (v *VideoInf) GetDetailInfo() error {
	proxyUrl, err := url.Parse("http://192.168.1.199:10809")
	if err != nil {
		return err
	}

	fiberlog.Info(fmt.Sprintf("Getting Video '%s' Info.", v.SerialNumber))
	client := &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}
	req, _ := http.NewRequest("GET", "https://javdb.com/search?q="+v.SerialNumber+"&f=all", nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return ErrQueryVideoFail
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return err
	}

	selection := doc.Find("body > section > div > div.movie-list.h.cols-4.vcols-8 > div:nth-child(1) > a")

	valSrc, _ := selection.Attr("href")
	valTitle, exists := selection.Attr("title")
	if !exists {
		v.SourceUrl = "-"
		v.SourcePosterUrl = ""
		v.Title = "-"
		return v.Update()
	}
	v.SourceUrl = "https://javdb.com" + valSrc
	v.Title = valTitle

	valPoster, exists := doc.Find("body > section > div > div.movie-list.h.cols-4.vcols-8 > div:nth-child(1) > a > div > img").Attr("src")
	if !exists {
		return ErrQueryVideoPosterFail
	}
	v.SourcePosterUrl = valPoster
	return v.Update()
}

func (v *VideoInf) DownloadPoster() error {
	//获取当前路径
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}

	//如果存放图片文件夹不存在，则创建文件夹
	if _, err := os.Stat(cwd + "/assets/poster/"); os.IsNotExist(err) {
		if err := os.MkdirAll(cwd+"/assets/poster/", 0777); err != nil {
			return err
		}
	}

	//获取封面文件名称
	if v.SourceUrl == "-" {
		v.PosterName = ""
		return v.Update()
	}
	segments := strings.Split(v.SourcePosterUrl, "/")
	v.PosterName = segments[len(segments)-1]

	//创建封面文件
	file, err := os.Create(cwd + "/assets/poster/" + v.PosterName)
	if err != nil {
		return err
	}
	defer file.Close()

	//下载封面文件
	fiberlog.Info("Downloading Video " + v.SerialNumber + " Poster.")
	proxyUrl, err := url.Parse("http://192.168.1.199:10809")
	if err != nil {
		return err
	}
	client := &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}
	req, _ := http.NewRequest("GET", v.SourcePosterUrl, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	//将res.body 写入文件
	io.Copy(file, res.Body)

	return v.Update()
}

func (v *VideoInf) GetActress() error {
	fiberlog.Info("Getting Actress for " + v.SerialNumber)
	v.Actress = strings.Split(v.PlaySrc, "/")[4]
	return v.Update()
}

func GetVideosToGetInfo() ([]VideoInf, error) { //DONE test
	videos := []VideoInf{}

	query := `
		SELECT 
			serial_num,
			title,
			source_url,
			poster_name,
			source_poster_url,
			actress,
			play_src
		FROM 
			video_infos
		WHERE
			source_url = ''
		OR
			source_url IS NULL;
	`

	rows, err := PgxPool.Query(Ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		video := VideoInf{}
		rows.Scan(
			&video.SerialNumber,
			&video.Title,
			&video.SourceUrl,
			&video.PosterName,
			&video.SourcePosterUrl,
			&video.Actress,
			&video.PlaySrc,
		)

		videos = append(videos, video)
	}

	return videos, nil
}

func GetVideosToDownloadPoster() ([]VideoInf, error) { //DONE test
	videos := []VideoInf{}

	query := `
		SELECT 
			serial_num,
			title,
			source_url,
			poster_name,
			source_poster_url,
			actress,
			play_src
		FROM 
			video_infos
		WHERE
			source_poster_url IS NOT NULL
		AND
			(poster_name = '' OR poster_name IS NULL);
	`

	rows, err := PgxPool.Query(Ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		video := VideoInf{}
		rows.Scan(
			&video.SerialNumber,
			&video.Title,
			&video.SourceUrl,
			&video.PosterName,
			&video.SourcePosterUrl,
			&video.Actress,
			&video.PlaySrc,
		)

		videos = append(videos, video)
	}

	return videos, nil
}

func GetAllVideosRecord() ([]VideoInf, error) { //DONE test
	videos := []VideoInf{}

	query := `
		SELECT
			serial_num,
			title,
			source_url,
			poster_name,
			source_poster_url,
			actress,
			play_src
		FROM 
			video_infos;
	`

	rows, err := PgxPool.Query(Ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		video := VideoInf{}
		rows.Scan(
			&video.SerialNumber,
			&video.Title,
			&video.SourceUrl,
			&video.PosterName,
			&video.SourcePosterUrl,
			&video.Actress,
			&video.PlaySrc,
		)

		videos = append(videos, video)
	}

	return videos, nil
}
