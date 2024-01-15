package database

import (
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestVideoInfo(t *testing.T) {
	InitTest(t)
	t.Run("测试创建文件信息", func(t *testing.T) {

		video := &VideoInf{
			SerialNumber:    faker.Username(),
			PosterName:      faker.Username(),
			SourceUrl:       faker.Username(),
			SourcePosterUrl: faker.Username(),
			Title:           faker.Username(),
		}
		var videoResu VideoInf

		err := video.Create()
		Db.Model(&VideoInf{}).Where(&VideoInf{SerialNumber: video.SerialNumber}).Find(&videoResu)

		assert.Nil(t, err)
		assert.Equal(t, video.SerialNumber, videoResu.SerialNumber)

		assert.Equal(t, video.PosterName, videoResu.PosterName)
	})

	t.Run("测试通过文件名读取文件信息", func(t *testing.T) {
		var video, videoResu = &VideoInf{
			SerialNumber:    faker.Username(),
			PosterName:      faker.Username(),
			SourceUrl:       faker.Username(),
			SourcePosterUrl: faker.Username(),
			Title:           faker.Username(),
		}, new(VideoInf)
		err := video.Create()
		assert.Nil(t, err)

		errQ := videoResu.QueryByVideoName(video.SerialNumber)
		assert.Nil(t, errQ)

		assert.Equal(t, video, videoResu)
	})

	t.Run("测试通过文件名获取文件信息失败后，videoResu 变量是否为空", func(t *testing.T) {
		var video = new(VideoInf)
		var videoName = faker.Name()

		err := video.QueryByVideoName(videoName)
		assert.NotNil(t, err)
		assert.Equal(t, ErrVideoNotFound, err)
		assert.Equal(t, uint(0), video.ID)
	})

	// DropTables()
}
