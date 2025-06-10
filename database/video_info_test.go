package database

import (
	"context"
	"os"
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestVideoInfo(t *testing.T) {
	// InitTest(t)
	PgxConnDatabase()
	t.Run("创建表", func(t *testing.T) {
		err := CreateVideoInfoTable()

		assert.Nil(t, err)
	})
	t.Run("测试创建文件信息", func(t *testing.T) {

		video := &VideoInf{
			SerialNumber:    faker.Username(),
			PosterName:      faker.Username(),
			SourceUrl:       faker.Username(),
			SourcePosterUrl: faker.Username(),
			Title:           faker.Username(),
			Actress:         faker.Username(),
			PlaySrc:         faker.Username(),
		}
		var videoResu VideoInf

		err := video.Create()
		// Db.Model(&VideoInf{}).Where(&VideoInf{SerialNumber: video.SerialNumber}).Find(&videoResu)
		videoResu.SerialNumber = video.SerialNumber
		errQ := videoResu.Query()

		assert.Nil(t, err)
		assert.Nil(t, errQ)
		assert.Equal(t, video.SerialNumber, videoResu.SerialNumber)
		assert.Equal(t, video.PosterName, videoResu.PosterName)
		assert.Equal(t, video.SourceUrl, videoResu.SourceUrl)
		assert.Equal(t, video.Title, videoResu.Title)
		assert.Equal(t, video.Actress, videoResu.Actress)
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

		errQ := videoResu.QueryByVideoSerialNum(video.SerialNumber)
		assert.Nil(t, errQ)

		assert.Equal(t, video, videoResu)
	})

	t.Run("测试通过文件名获取文件信息失败后，videoResu 变量是否为空", func(t *testing.T) {
		var video = new(VideoInf)
		var videoName = faker.Name()

		err := video.QueryByVideoSerialNum(videoName)
		assert.NotNil(t, err)
		assert.Equal(t, ErrVideoNotFound, err)
		assert.Equal(t, uint(0), video.ID)
	})

	t.Run("测试获取详情页链接和封面链接", func(t *testing.T) {
		testEx := []struct {
			SerialNum       string
			SourceUrl       string
			SourcePosterUrl string
			Title           string
		}{
			{
				SerialNum:       "adn-187",
				SourceUrl:       "https://javdb.com/v/deX99",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/de/deX99.jpg",
				Title:           "無防備な人妻 松下紗栄子",
			},
			{
				SerialNum:       "adn-087",
				SourceUrl:       "https://javdb.com/v/kKKkJ",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/kk/kKKkJ.jpg",
				Title:           "美人ホームヘルパー 背徳の性奉仕 夏目彩春",
			},
			{
				SerialNum:       "royd-057",
				SourceUrl:       "https://javdb.com/v/7nzxB",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/7n/7nzxB.jpg",
				Title:           "リピート確定！超可愛い新人エステ嬢はお触りNGでもすぐに手マンさせちゃう押しに弱過ぎ娘！イッても止めないエンドレスピストンにガクブル痙攣絶頂 朝比奈ななせ",
			},
			{
				SerialNum:       "stars-250",
				SourceUrl:       "https://javdb.com/v/rz5eN",
				SourcePosterUrl: "https://c0.jdbstatic.com/covers/rz/rz5eN.jpg",
				Title:           "大きな亀頭で子宮口ほじくり性交 朝比奈ななせ",
			},
		}

		for _, unit := range testEx {
			video := &VideoInf{
				SerialNumber: unit.SerialNum,
			}

			errCreate := video.Create()
			assert.Nil(t, errCreate)

			err := video.GetDetailInfo()
			assert.Nil(t, err)
			assert.Equal(t, unit.SourceUrl, video.SourceUrl)
			assert.Equal(t, unit.SourcePosterUrl, video.SourcePosterUrl)
			assert.Equal(t, unit.Title, video.Title)
		}

		t.Run("测试下载封面文件", func(t *testing.T) {
			cwd, _ := os.Getwd()
			video := &VideoInf{
				SerialNumber: "adn-187",
			}

			errG := video.GetDetailInfo()
			assert.Nil(t, errG)

			video.QueryByVideoSerialNum(video.SerialNumber)
			errD := video.DownloadPoster()

			assert.Nil(t, errD)
			assert.Equal(t, "deX99.jpg", video.PosterName)

			_, err := os.Stat(cwd + "/assets/poster/" + video.PosterName)
			assert.Nil(t, err)
		})
	})

	t.Run("测试获取演员名", func(t *testing.T) {

		testEx := []struct {
			SerialNum string
			PlaySrc   string
			Actress   string
		}{
			{
				SerialNum: "waaa-067",
				PlaySrc:   "http://192.168.1.31/video/白桃はな/waaa-067-C/waaa-067-C.mp4",
				Actress:   "白桃はな",
			},
			{
				SerialNum: "jul-139",
				PlaySrc:   "http://192.168.1.31/video/妃光莉/jul-139-C/jul-139-C.mp4",
				Actress:   "妃光莉",
			},
		}

		for _, unit := range testEx {
			video := &VideoInf{
				SerialNumber: unit.SerialNum,
				PlaySrc:      unit.PlaySrc,
			}

			err := video.GetActress()

			assert.Nil(t, err)
			assert.Equal(t, unit.Actress, video.Actress)
		}

	})

	DROPTABLE()
	defer PgxConn.Close(context.Background())
}
