package database

import (
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestCreateReturnID(t *testing.T) {
	t.Setenv("PGX_CONN", "postgres://gaohan:gh961004@192.168.1.30:5432/video_server_pgx_test")
	PgxConnDatabase()

	t.Run("测试创建视频详细信息表", func(t *testing.T) {
		err := CreateVideoDetailedInfoTable()

		assert.Nil(t, err)
	})

	t.Run("测试查询不存在的视频记录返回错误", func(t *testing.T) {
		video := VideoDetailedInfo{SN: faker.Username()}

		err := video.Query()

		assert.True(t, errors.Is(ErrVideoNotFound, err))
	})

	t.Run("保存tag到数据库成功后tag.id不为空", func(t *testing.T) {
		tag := Tag{Name: faker.Username()}

		err := tag.Create()

		assert.Nil(t, err)
		assert.NotEqual(t, 0, tag.ID)
	})

	t.Run("创建演员信息成功后返回actor.id", func(t *testing.T) {
		actor := Actor{
			Name: faker.Username(),
			Sex:  "male",
		}

		assert.Nil(t, actor.Create())

		assert.NotEqual(t, 0, actor.ID)
	})

	releaseDate, _ := time.Parse("2006-01-02", "2025-04-10")
	info := VideoDetailedInfo{
		SN:          "START-284",
		Title:       "デートをドタキャンし弟の看病をする事になった姉は超不機嫌になりながらアナル丸見えのデカ尻騎乗位プレスでヌキまくった MINAMO ",
		ReleaseDate: releaseDate,
		Duration:    153,
		Director:    "坂井シベリア",
		Publisher:   "SOD Create",
		Rank:        4.43,
		Tags:        []Tag{{Name: "素人作品"}, {Name: "4K"}, {Name: "戲劇"}},
		Actors:      []Actor{{Name: "MINAMO", Sex: "female"}},
		Series:      "aaaa",
	}

	t.Run("保存视频详细信息", func(t *testing.T) {

		assert.Nil(t, info.Create())
	})

	t.Run("测试Update更新记录", func(t *testing.T) {
		info.Duration = 154
		assert.Nil(t, info.Update())

		t.Run("测试更新后从数据库读取", func(t *testing.T) {
			videoQ := VideoDetailedInfo{ID: info.ID}
			assert.Nil(t, videoQ.Query())
			assert.Equal(t, 154, videoQ.Duration)
			assert.Equal(t, info, videoQ)
		})
	})

	t.Run("使用序列号查询视频详细信息", func(t *testing.T) {
		video := &VideoDetailedInfo{}
		video.SN = info.SN

		assert.Nil(t, video.Query())

		assert.Equal(t, &info, video)
	})

	t.Run("使用id查询视频详细信息", func(t *testing.T) {
		video := &VideoDetailedInfo{}
		video.ID = info.ID

		assert.Nil(t, video.Query())

		assert.Equal(t, &info, video)
	})

	t.Run("使用tag名称查询视频", func(t *testing.T) {
		info2 := VideoDetailedInfo{
			SN:          "START-285",
			Title:       "デートをドタキャンし弟の看病をする事になった姉は超不機嫌になりながらアナル丸見えのデカ尻騎乗位プレスでヌキまくった MINAMO ",
			ReleaseDate: releaseDate,
			Duration:    153,
			Director:    "坂井シベリア",
			Publisher:   "SOD Create",
			Rank:        4.43,
			Tags:        []Tag{{Name: "素人作品"}, {Name: "4K"}, {Name: "戲劇"}},
			Actors:      []Actor{{Name: "MINAMO", Sex: "female"}},
			Series:      "aaaa",
		}

		info2.Create()

		videos, err := QueryVideosByTag("戲劇")

		assert.Nil(t, err)
		assert.Len(t, videos, 2)
		assert.NotEqual(t, "", videos[0].SN)
		assert.NotEqual(t, "", videos[1].SN)
	})

	t.Run("使用演员名称查找视频", func(t *testing.T) {
		videos, err := QueryVideoByActor("MINAMO")

		assert.Nil(t, err)
		assert.Len(t, videos, 2, "查询结果包含2条视频信息")
	})

	t.Run("测试下载Poster", func(t *testing.T) {
		video := VideoDetailedInfo{SN: "SONE-001"}

		assert.Nil(t, video.Create())

		err := video.DownloadPoster()
		assert.Nil(t, err)

		t.Run("下载Poster完成后能从数据库查询", func(t *testing.T) {
			videoQ := VideoDetailedInfo{ID: video.ID}

			assert.Nil(t, videoQ.Query())
			assert.Equal(t, video, videoQ)
		})
	})

	t.Run("获取源链接", func(t *testing.T) {
		testEx := []struct {
			SerialNum       string
			SourceUrl       string
			SourcePosterUrl string
			Title           string
		}{
			{
				SerialNum: "adn-187",
				SourceUrl: "https://javdb.com/v/deX99",
			},
			{
				SerialNum: "adn-087",
				SourceUrl: "https://javdb.com/v/kKKkJ",
			},
			{
				SerialNum: "royd-057",
				SourceUrl: "https://javdb.com/v/7nzxB",
			},
			{
				SerialNum: "stars-250",
				SourceUrl: "https://javdb.com/v/rz5eN",
			},
		}

		for _, test := range testEx {
			t.Run(fmt.Sprintf("测试获取%s源信息\n", test.SerialNum), func(t *testing.T) {
				video := &VideoDetailedInfo{SN: test.SerialNum}
				assert.Nil(t, video.Create())
				assert.Nil(t, video.GetSourceUrl())
				assert.Equal(t, test.SourceUrl, video.SourceUrl)

				t.Run("从数据查询数据", func(t *testing.T) {
					videoQ := &VideoDetailedInfo{SN: test.SerialNum}

					assert.Nil(t, videoQ.Query())
					assert.Equal(t, test.SourceUrl, videoQ.SourceUrl)
				})
			})
		}
	})

	t.Run("测试从源地址获取详细信息", func(t *testing.T) {
		releaseDate1, _ := time.Parse("2006-01-02", "2023-12-13")
		releaseDate2, _ := time.Parse("2006-01-02", "2025-06-11")
		details := []VideoDetailedInfo{
			{
				SN:          "SONE-001",
				Title:       "エロめっちゃ可愛い三田真鈴の初・体・験3本番 人生初めて尽くし！ 激イキしまくりスペシャル！ （ブルーレイディスク） 生写真3枚付き ",
				ReleaseDate: releaseDate1,
				Duration:    150,
				Director:    "嵐山みちる",
				Publisher:   "S1 NO.1 STYLE",
				Series:      "初体験○本番スペシャル",
				Rank:        4.4,
				SourceUrl:   "https://javdb.com/v/d421VQ",
				Tags:        []Tag{{Name: "巨乳"}, {Name: "多P"}, {Name: "單體作品"}, {Name: "玩具"}, {Name: "4K"}},
				Actors:      []Actor{{Name: "三田真鈴", Sex: "female"}, {Name: "小田切ジュン", Sex: "male"}, {Name: "トニー大木", Sex: "male"}, {Name: "矢野慎二", Sex: "male"}, {Name: "黒田悠斗", Sex: "male"}},
			},
			{
				SN:          "SONE-720",
				Title:       "【FANZA限定】最強ヒロインに会える風俗店 瀬戸環奈 （ブルーレイディスク） 生写真3枚付き ",
				ReleaseDate: releaseDate2,
				Duration:    190,
				Director:    "U吉",
				Publisher:   "S1 NO.1 STYLE",
				Rank:        4.4,
				SourceUrl:   "https://javdb.com/v/deROGe",
				Tags:        []Tag{{Name: "禮儀小姐"}, {Name: "巨乳"}, {Name: "單體作品"}, {Name: "偶像"}, {Name: "乳交"}, {Name: "顏射"}},
				Actors:      []Actor{{Name: "瀬戸環奈", Sex: "female"}, {Name: "小田切ジュン", Sex: "male"}, {Name: "鮫島", Sex: "male"}, {Name: "タイ", Sex: "male"}},
			},
		}

		for _, detail := range details {
			video := &VideoDetailedInfo{SN: detail.SN}

			assert.Nil(t, video.Create())
			assert.Nil(t, video.GetSourceUrl())
			assert.Nil(t, video.GetDetailInfo())
			assert.Equal(t, detail.Title, video.Title)
			assert.Equal(t, detail.ReleaseDate, video.ReleaseDate)
			assert.Equal(t, detail.Duration, video.Duration)
			assert.Equal(t, detail.Director, video.Director)
			assert.Equal(t, detail.Publisher, video.Publisher)
			assert.Equal(t, detail.Series, video.Series)
			assert.Equal(t, detail.Rank, video.Rank, "原网站评分不固定，或许会失败")
			assert.Equal(t, detail.SourceUrl, video.SourceUrl)
			assert.Equal(t, detail.Tags, video.Tags)
			assert.Equal(t, detail.Actors, video.Actors)

			t.Run(fmt.Sprintf("从数据库查询%s", detail.SN), func(t *testing.T) {
				videoQ := &VideoDetailedInfo{SN: detail.SN}

				assert.Nil(t, videoQ.Query())
				assert.Equal(t, detail.Title, videoQ.Title)
				assert.Equal(t, detail.ReleaseDate, videoQ.ReleaseDate)
				assert.Equal(t, detail.Duration, videoQ.Duration)
				assert.Equal(t, detail.Director, videoQ.Director)
				assert.Equal(t, detail.Publisher, videoQ.Publisher)
				assert.Equal(t, detail.Series, videoQ.Series)
				assert.Equal(t, detail.Rank, videoQ.Rank, "原网站评分不固定，或许会失败")
				assert.Equal(t, detail.SourceUrl, videoQ.SourceUrl)
				assert.Equal(t, detail.Tags, videoQ.Tags)
				assert.Equal(t, detail.Actors, videoQ.Actors)
			})
		}
	})

	t.Run("删除表", func(t *testing.T) {
		assert.Nil(t, DROPVideoDetailsTable())
	})
}
