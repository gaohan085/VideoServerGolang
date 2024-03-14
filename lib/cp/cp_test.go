package cp

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetVideoDuration(t *testing.T) {
	var videoPath = "/home/gaohan/downloads/test/test.mp4"

	duration, err := GetVideoDuration(videoPath)

	assert.Nil(t, err)
	assert.Equal(t, "0:09:56.962000", duration)
}
