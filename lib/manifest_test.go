package lib

import (
	"bytes"
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_GetInjectChunk(t *testing.T) {
	t.Run("测试解析manifest.json文件", func(t *testing.T) {
		file, err := os.ReadFile("./manifest_test.json")
		assert.Nil(t, err)

		injectChunk, err := GetInjectChunk(bytes.NewReader(file))
		assert.Nil(t, err)
		fmt.Println(injectChunk)
	})
}
