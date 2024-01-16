package database

import (
	"os"
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

	t.Run("测试获取详情页链接和封面链接", func(t *testing.T) {
		testEx := []struct {
			SerialNum       string
			SourceUrl       string
			SourcePosterUrl string
		}{
			{
				SerialNum:       "adn-187",
				SourceUrl:       "https://javdb.com/v/deX99",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/de/deX99.jpg",
			},
			{
				SerialNum:       "adn-087",
				SourceUrl:       "https://javdb.com/v/kKKkJ",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/kk/kKKkJ.jpg",
			},
			{
				SerialNum:       "royd-057",
				SourceUrl:       "https://javdb.com/v/7nzxB",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/7n/7nzxB.jpg",
			},
			{
				SerialNum:       "stars-250",
				SourceUrl:       "https://javdb.com/v/rz5eN",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/rz/rz5eN.jpg",
			},
		}

		for _, unit := range testEx {
			video := &VideoInf{
				SerialNumber: unit.SerialNum,
			}

			err := video.GetDetailInfo()

			assert.Nil(t, err)
			assert.Equal(t, unit.SourceUrl, video.SourceUrl)
			assert.Equal(t, unit.SourcePosterUrl, video.SourcePosterUrl)
		}

		t.Run("测试下载封面文件", func(t *testing.T) {
			cwd, _ := os.Getwd()
			video := &VideoInf{
				SerialNumber: "adn-187",
			}

			video.QueryByVideoName(video.SerialNumber)
			errD := video.DownloadPoster()

			assert.Nil(t, errD)
			assert.Equal(t, "deX99.jpg", video.PosterName)

			_, err := os.Stat(cwd + "/assets/poster/" + video.PosterName)
			assert.Nil(t, err)
		})
	})

	DropTables()
}
