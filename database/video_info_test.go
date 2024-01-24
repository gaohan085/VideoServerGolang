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

			video.QueryByVideoName(video.SerialNumber)
			errD := video.DownloadPoster()

			assert.Nil(t, errD)
			assert.Equal(t, "deX99.jpg", video.PosterName)

			_, err := os.Stat(cwd + "/assets/poster/" + video.PosterName)
			assert.Nil(t, err)
		})
	})

	t.Run("测试获取演员名", func(t *testing.T) {

		testEx := []struct {
			SerialNum       string
			SourceUrl       string
			SourcePosterUrl string
			Title           string
			Actress         string
		}{
			{
				SerialNum: "STARS-300",
				SourceUrl: "https://javdb.com/v/8WrMd",
				Actress:   "朝比奈ななせ",
			},
			{
				SerialNum: "STARS-290",
				SourceUrl: "https://javdb.com/v/JzymR",
				Actress:   "朝比奈ななせ",
			},
			{
				SerialNum: "MUKC-016",
				SourceUrl: "https://javdb.com/v/0wr8a",
				Actress:   "朝比奈ななせ",
			},
		}

		for _, unit := range testEx {
			video := &VideoInf{
				SerialNumber: unit.SerialNum,
				SourceUrl:    unit.SourceUrl,
			}

			err := video.GetActress()

			assert.Nil(t, err)
			assert.Equal(t, unit.Actress, video.Actress)
		}

	})

	DropTables()
}
