package database

import (
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestVideoInfo(t *testing.T) {
	InitTest(t)

	t.Run("TEST CREATE VIDEO INFO", func(t *testing.T) {
		var video, videoResu *VideoInf
		faker.FakeData(&video)

		err := video.Create()
		Db.Model(&VideoInf{}).Where(&VideoInf{Name: video.Name}).Find(&videoResu)

		assert.Nil(t, err)
		assert.Equal(t, video.Name, videoResu.Name)
		assert.Equal(t, video.CoverSrc, videoResu.CoverSrc)
	})
}
