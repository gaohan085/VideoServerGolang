package database

import "gorm.io/gorm"

type VideoInf struct {
	ID             uint           `gorm:"primaryKey" faker:"-"`
	CreateAt       int            `faker:"-"`
	UpdateAt       int            `faker:"-"`
	DeleteAt       gorm.DeletedAt `gorm:"index" faker:"-"`
	Name           string         `json:"name" gorm:"unique"` //视频文件名
	CoverSrc       string         `json:"coverSrc"`
	SourceUrl      string         `json:"sourceUrl"` //来源网站信息
	SourceCoverUrl string         `json:"sourceCoverUrl"`
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
