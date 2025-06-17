package lib

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPosterUrl(t *testing.T) {
	t.Run("获取封面文件url", func(t *testing.T) {
		tests := []struct {
			sn        string
			expPoster string
		}{
			{
				sn:        "START-002",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/1start002/1start002pl.jpg",
			},
			{
				sn:        "SONE-002",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/sone002/sone002pl.jpg",
			},
			{
				sn:        "SONE-001",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/sone001/sone001pl.jpg",
			},
			{
				sn:        "adn-287",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/adn287/adn287pl.jpg",
			},
			{
				sn:        "stars-288",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/1stars288/1stars288pl.jpg",
			},
			{
				sn:        "fsdss-889",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/1fsdss889/1fsdss889pl.jpg",
			},
			{
				sn:        "abw-007",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/118abw007/118abw007pl.jpg",
			},
			{
				sn:        "cjod-067",
				expPoster: "https://p.dmm.co.jp/mono/movie/adult/cjod067/cjod067pl.jpg",
			},
		}

		for _, test := range tests {
			t.Run(fmt.Sprintf("Get Poster Url for %s", test.sn), func(t *testing.T) {
				assert.Equal(t, test.expPoster, GetPosterLinkFromSN(test.sn))
			})
		}
	})
}
