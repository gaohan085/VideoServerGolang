package database

import (
	"errors"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"gorm.io/gorm"
)

var (
	ErrVideoNotFound        = errors.New("video info not found")
	ErrQueryVideoFail       = errors.New("query remote video fail")
	ErrQueryVideoUrlFail    = errors.New("query video source url fail")
	ErrQueryVideoPosterFail = errors.New("query video poster fail")
	ErrGetVideoSource       = errors.New("get video source url fail")
)

type VideoInf struct {
	ID              uint           `gorm:"primaryKey" faker:"-" json:"id"`
	CreatedAt       int            `faker:"-" json:"createdAt"`
	UpdatedAt       int            `faker:"-" json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" faker:"-" json:"deletedAt"`
	Title           string         `json:"title"`
	SerialNumber    string         `json:"serialNumber"` //视频文件名
	SourceUrl       string         `json:"sourceUrl"`    //来源网站信息
	PosterName      string         `json:"posterName"`   //封面图片本地链接
	SourcePosterUrl string         `json:"sourcePosterUrl"`
	Actress         string         `json:"actress"`
	PlaySrc         string         `json:"playSrc"`
}

func (v *VideoInf) Create() error {
	return Db.Create(&v).Error
}

func (v *VideoInf) Update() error {
	return Db.Save(&v).Error
}

func (v *VideoInf) Delete() error {
	return Db.Delete(&v).Error
}

func (v *VideoInf) QueryByVideoName(n string) error {
	if err := Db.Model(&VideoInf{}).Where(&VideoInf{SerialNumber: n}).First(&v).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return ErrVideoNotFound
		}
		return err
	}
	return nil
}

func (v *VideoInf) GetDetailInfo() error {
	client := &http.Client{}
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

	//下载封面文件
	client := &http.Client{}
	req, _ := http.NewRequest("GET", v.SourcePosterUrl, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	//将res.body 写入文件
	io.Copy(file, res.Body)
	defer file.Close()

	return v.Update()
}

func (v *VideoInf) GetActress() error {
	v.Actress = strings.Split(v.PlaySrc, "/")[4]
	return v.Update()
}
