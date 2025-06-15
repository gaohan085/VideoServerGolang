package database

import (
	"testing"
	"time"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestCreateReturnID(t *testing.T) {
	t.Setenv("PGX_CONN", "postgres://gaohan:gh961004@192.168.1.199:5432/video_server_pgx_test")
	PgxConnDatabase()

	t.Run("测试创建视频详细信息表", func(t *testing.T) {
		err := CreateVideoDetailedInfoTable()

		assert.Nil(t, err)
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
		SerialNumber: "START-284",
		Title:        "デートをドタキャンし弟の看病をする事になった姉は超不機嫌になりながらアナル丸見えのデカ尻騎乗位プレスでヌキまくった MINAMO ",
		ReleaseDate:  releaseDate,
		Duration:     153,
		Director:     "坂井シベリア",
		Publisher:    "SOD Create",
		Rank:         "4.43",
		Tags:         []Tag{{Name: "素人作品"}, {Name: "4K"}, {Name: "戲劇"}},
		Actors:       []Actor{{Name: "MINAMO", Sex: "female"}},
		Series:       "aaaa",
	}

	t.Run("保存视频详细信息", func(t *testing.T) {

		assert.Nil(t, info.Create())
	})

	t.Run("使用序列号查询视频详细信息", func(t *testing.T) {
		video := &VideoDetailedInfo{}
		video.SerialNumber = info.SerialNumber

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
			SerialNumber: "START-285",
			Title:        "デートをドタキャンし弟の看病をする事になった姉は超不機嫌になりながらアナル丸見えのデカ尻騎乗位プレスでヌキまくった MINAMO ",
			ReleaseDate:  releaseDate,
			Duration:     153,
			Director:     "坂井シベリア",
			Publisher:    "SOD Create",
			Rank:         "4.43",
			Tags:         []Tag{{Name: "素人作品"}, {Name: "4K"}, {Name: "戲劇"}},
			Actors:       []Actor{{Name: "MINAMO", Sex: "female"}},
			Series:       "aaaa",
		}

		info2.Create()

		videos, err := QueryVideosByTag("戲劇")

		assert.Nil(t, err)
		assert.Len(t, videos, 2)
	})

	t.Run("使用演员名称查找视频", func(t *testing.T) {
		videos, err := QueryVideoByActor("MINAMO")

		assert.Nil(t, err)
		assert.Len(t, videos, 2, "查询结果包含2条视频信息")
	})
	t.Run("删除表", func(t *testing.T) {
		assert.Nil(t, DROPVideoDetailsTable())
	})
}
