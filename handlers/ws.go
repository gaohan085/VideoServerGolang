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

			queue := database.VideoQueue{}
			if err := queue.Query(); err != nil {
				break
			}

			if err := c.WriteJSON(queue.Queue); err != nil {
				break
			}

		}
	}
})
