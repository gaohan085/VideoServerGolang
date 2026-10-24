package handlers

import (
	"errors"
	"go-fiber-react-ts/database"
	"sync"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/redis/go-redis/v9"
)

/*
	@Route /api/refresh/:sn<regex(([0-9]|[a-z]|[A-Z]){2,}-[0-9]{3,})>
	@Method POST

接受Post请求刷新SN对应视频信息

不接受Req Body

视频信息查找handler判断逻辑：

判断依据唯一：1. redis记录

如果redis记录显示获取视频信息流程pending，则标志着后台正在刷新视频信息，等待获取完成后重新读取数据库并返回

如果redis记录为空或者流程信息不为pending, 则重新获取视频信息
*/
func ApiRefreshVideoInfoBySN(c fiber.Ctx) error {
	video := &database.VideoDetailedInfo{SN: c.Params("sn")}
	status, err := video.GetInfoProcessStatus()
	wg := sync.WaitGroup{}
	videoBySN := &VideoBySn{}

	canStartGetInfoProcess := (err == redis.Nil || status != database.StatusPending)

	if canStartGetInfoProcess {
		wg.Go(func() {
			video.SetGetInfoProcessStatus(database.StatusPending)
			if err := video.GetDetailInfo(); err != nil {
				video.SetGetInfoProcessStatus(database.StatusFailed)
				return
			}
			video.SetGetInfoProcessStatus(database.StatusSuccess)
		})
	}
	wg.Wait()
	for status == database.StatusPending {
		time.Sleep(300 * time.Millisecond)

		status, _ := video.GetInfoProcessStatus()
		if status != database.StatusPending {
			break
		}
	}

	if err := video.Query(); err != nil {
		if errors.Is(err, database.ErrVideoNotFound) {
			return fiber.NewError(404, err.Error())
		}
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	videoBySN.MapDbData(video)

	return c.Status(fiber.StatusOK).JSON(&RespBody{
		StatusCode: fiber.StatusOK,
		Data:       videoBySN,
	})
}
