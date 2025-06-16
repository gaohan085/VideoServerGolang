package database

import (
	"testing"

	"github.com/go-faker/faker/v4"
	"github.com/stretchr/testify/assert"
)

func TestVideoNeedConvertedInQueue(t *testing.T) {

	t.Run("测试从空队列获取需要转换的视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{},
		}

		err := queue.VideoNeedConvertedInQueue()

		assert.Nil(t, err)
		assert.Nil(t, queue.VideoNeedConvert)
	})

	t.Run("测试从没有需要转换的视频队列获取视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
			},
		}

		err := queue.VideoNeedConvertedInQueue()

		assert.Nil(t, err)
		assert.Nil(t, queue.VideoNeedConvert)
	})

	t.Run("测试从需要转换的视频队列获取视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
			},
		}

		err := queue.VideoNeedConvertedInQueue()

		assert.Nil(t, err)
		assert.Equal(t, 2, len(queue.VideoNeedConvert))
	})
}

func TestGetVideoConverting(t *testing.T) {
	t.Run("测试从空队列获取正在转换的视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{},
		}

		video, err := queue.GetVideoConverting()

		assert.Nil(t, err)
		assert.Nil(t, video)
	})

	t.Run("测试从没有正在转换的队列获取正在转换的视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
			},
		}

		video, err := queue.GetVideoConverting()

		assert.Nil(t, err)
		assert.Nil(t, video)
	})

	t.Run("测试从有正在转换的队列获取正在转换的视频", func(t *testing.T) {
		var playSrc = faker.Word()

		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: playSrc,
					Status:     "converting",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
			},
		}

		video, err := queue.GetVideoConverting()

		assert.Nil(t, err)
		assert.Equal(t, playSrc, video.PlaySource)
	})
}

func TestGetNextConvertVideo(t *testing.T) {
	t.Run("从空队列获取下一个要转换的视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{},
		}

		video, err := queue.GetNextConvertVideo()

		assert.Equal(t, ErrNoVideoToConvert, err)
		assert.Nil(t, video)
	})

	t.Run("从全部已完成转换的队列获取下一个要转换的视频", func(t *testing.T) {
		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
			},
		}

		video, err := queue.GetNextConvertVideo()

		assert.Nil(t, video)
		assert.Equal(t, ErrNoVideoToConvert, err)
	})

	t.Run("从队列获取下一个要转换的视频", func(t *testing.T) {
		src := faker.Word()

		var queue = &VideoQueue{
			Queue: []VideoConvert{
				{
					PlaySource: faker.Word(),
					Status:     "done",
				},
				{
					PlaySource: src,
					Status:     "pending",
				},
				{
					PlaySource: faker.Word(),
					Status:     "pending",
				},
			},
		}

		video, err := queue.GetNextConvertVideo()

		assert.Equal(t, src, video.PlaySource)
		assert.Nil(t, err)
	})
}
