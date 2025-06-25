package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsVideo(t *testing.T) {
	t.Run("测试通过文件名判断文件是否为视频", func(t *testing.T) {
		name := "juy-618.mp4.bt.xltd"

		assert.False(t, IsVideo(&name))
	})
}
