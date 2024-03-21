package handlers

import (
	"go-fiber-react-ts/database"

	"github.com/gofiber/contrib/websocket"
)

var Wshandler = websocket.New(func(c *websocket.Conn) {
	if c.Locals("allowed").(bool) {
		for {
			_, _, err := c.ReadMessage()
			if err != nil {
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
