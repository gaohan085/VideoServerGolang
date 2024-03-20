package handlers

import (
	"go-fiber-react-ts/database"
	"log"

	"github.com/gofiber/contrib/websocket"
)

var Wshandler = websocket.New(func(c *websocket.Conn) {
	if c.Locals("allowed").(bool) {
		for {
			_, _, err := c.ReadMessage()
			if err != nil {
				log.Println(err.Error())
				break
			}

			queue := database.VideoQueue{
				Queue: []database.VideoConvert{
					{
						PlaySource: "http://192.168.1.199/video/栗宮ふたば/cawd-630/cawd-630.mp4",
						Status:     "done",
					},
					{
						PlaySource: "http://192.168.1.199/video/今井えみ/bacj-100/bacj-100.mp4",
						Status:     "converting",
						Progress:   0.23456,
					},
					{
						PlaySource: "http://192.168.1.199/video/今井えみ/200GANA-2966/200GANA-2966.mp4",
						Status:     "pending",
					},
				},
			}
			// if err := queue.Query(); err != nil {
			// 	break
			// }

			if err := c.WriteJSON(queue.Queue); err != nil {
				break
			}

		}
	}
})
