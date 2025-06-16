package lib

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestGetVideoInfo(t *testing.T) {
	t.Run("START-284", func(t *testing.T) {
		var sourceUrl = "https://javdb.com/v/bKgAaP"

		releaseDate, _ := time.Parse("2006-01-02", "2025-04-10")
		expVideoDetailedInfo := VideoDetailedInfo{
			SerialNumber: "START-284",
			Title:        "デートをドタキャンし弟の看病をする事になった姉は超不機嫌になりながらアナル丸見えのデカ尻騎乗位プレスでヌキまくった MINAMO ",
			ReleaseDate:  releaseDate,
			Duration:     153,
			Director:     "坂井シベリア",
			Publisher:    "SOD Create",
			Rank:         "4.43",
			Tags:         []string{"素人作品", "4K", "戲劇", "乳交", "各種職業", "巨乳", "單體作品"},
			StarringInfo: Stars{Actress: []string{"MINAMO"}},
		}

		videoDetailedInfo, err := GetVideoDetailedInfo(sourceUrl)

		assert.Nil(t, err)
		assert.Equal(t, expVideoDetailedInfo, videoDetailedInfo)
	})

	t.Run("PPRED-771", func(t *testing.T) {
		sourceUrl := "https://javdb.com/v/gy4gMQ"
		releaseDte, _ := time.Parse("2006-01-02", "2025-05-20")

		exp := VideoDetailedInfo{
			SerialNumber: "PRED-771",
			Title:        "倒れたつむぎ先生を介抱して家に送ったら… 無防備美脚と美貌に勃起が止まらず朝まで何度も中出ししてしまった性欲モンスターなボク。 明里つむぎ ",
			ReleaseDate:  releaseDte,
			Duration:     120,
			Director:     "ZAMPA",
			Publisher:    "プレミアム",
			Series:       "倒れた○○先生を介抱して家に送ったら…",
			Rank:         "4.17",
			Tags:         []string{"女教師", "姐姐", "單體作品", "白天出軌", "中出", "口交"},
			StarringInfo: Stars{Actress: []string{"明里つむぎ"}, Actors: []string{"藍井優太"}},
		}

		info, err := GetVideoDetailedInfo(sourceUrl)

		assert.Nil(t, err)
		assert.Equal(t, exp, info)
	})
}
