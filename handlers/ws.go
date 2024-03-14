package handlers

import (
	"encoding/json"
	"log"

	ws "github.com/fasthttp/websocket"
	"github.com/gofiber/contrib/websocket"
)

var Wshandler = websocket.New(func(c *websocket.Conn) {
	log.Printf("%T\n", c.Locals("allowed"))

	if c.Locals("allowed").(bool) {
		for {
			msgType, msg, err := c.ReadMessage()
			if err != nil {
				log.Println(err.Error())
				break
			}
			log.Println(msg)

			user := struct {
				Username string `json:"username"`
			}{Username: "ponyamu"}

			userJSON, _ := json.Marshal(user)
			pm, _ := ws.NewPreparedMessage(msgType, userJSON)

			if err := c.WritePreparedMessage(pm); err != nil {
				break
			}
		}
	}
})
