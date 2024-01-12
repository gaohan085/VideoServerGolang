package database

import (
	"errors"

	"gorm.io/gorm"
)

var (
	ErrVideoNotFound = errors.New("video info not found")
)

type VideoInf struct {
	ID              uint           `gorm:"primaryKey" faker:"-"`
	CreateAt        int            `faker:"-"`
	UpdateAt        int            `faker:"-"`
	DeleteAt        gorm.DeletedAt `gorm:"index" faker:"-"`
	SerialNumber    string         `json:"SerialNumber" gorm:"unique"` //视频文件名
	PosterName      string         `json:"coverSrc"`                   //封面图片本地链接
	SourceUrl       string         `json:"sourceUrl"`                  //来源网站信息
	SourcePosterUrl string         `json:"sourceCoverUrl"`
	Title           string         `json:"title"`
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

func (v *VideoInf) QueryByVideoName(n string) (err error) {
	if err := Db.Model(&VideoInf{}).Where(&VideoInf{SerialNumber: n}).First(&v).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return ErrVideoNotFound
		}
		return err
	}
	return
}
