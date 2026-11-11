package handlers

import (
	"fmt"
	"go-fiber-react-ts/database"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

/*
	@Route /api/refresh/:sn
	@Method POST

接受Post请求刷新SN对应视频信息

不接受Req Body

视频信息查找handler判断逻辑：

判断依据唯一：1. redis记录

如果redis记录显示获取视频信息流程pending，则标志着后台正在刷新视频信息，等待获取完成返回status 200

如果redis记录为空或者流程信息不为pending, 则重新获取视频信息
*/
func ApiRefreshVideoInfoBySN(c *gin.Context) {
	redis0 := c.MustGet("redis0").(*redis.Client)
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	video := &database.VideoDetailedInfo{SN: strings.ToLower(c.Param("sn"))}
	status, err := video.GetInfoProcessStatus(redis0, c)
	wg := sync.WaitGroup{}

	canStartGetInfoProcess := (err == redis.Nil || status != database.StatusPending)

	ctx := c.Request.Context()
	if canStartGetInfoProcess {
		wg.Go(func() {
			for {
				select {
				case <-ctx.Done():
					video.SetGetInfoProcessStatus(database.StatusFailed, redis0, c.Copy())
					return
				default:
					video.SetGetInfoProcessStatus(database.StatusPending, redis0, c.Copy())
					if err := video.Create(pool, c.Copy()); err != nil {
						fmt.Println(err.Error())
						video.SetGetInfoProcessStatus(database.StatusFailed, redis0, c.Copy())
						return
					}
					if err := video.GetSourceUrl(pool, c.Copy()); err != nil {
						fmt.Println(err.Error())
						video.SetGetInfoProcessStatus(database.StatusFailed, redis0, c.Copy())
						return
					}
					if err := video.GetDetailInfo(pool, c.Copy()); err != nil {
						fmt.Println(err.Error())
						video.SetGetInfoProcessStatus(database.StatusFailed, redis0, c.Copy())
						return
					}
					video.SetGetInfoProcessStatus(database.StatusSuccess, redis0, c.Copy())
					video.DownloadPoster(pool, c.Copy())
					return
				}
			}
		})
		wg.Wait()
	}
	for status == database.StatusPending {
		time.Sleep(300 * time.Millisecond)

		status, _ := video.GetInfoProcessStatus(redis0, c)
		if status != database.StatusPending {
			break
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"code": fiber.StatusOK,
		"data": "Done for refreshing Video info. Please Use '/api/query/sn/:sn to get new video info.",
	})
}
