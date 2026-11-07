package handlers

import (
	"go-fiber-react-ts/database"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5/pgxpool"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")

		if origin == "" {
			return false
		}
		u, err := url.Parse(origin)
		if err != nil {
			return false
		}
		return strings.EqualFold(u.Host, r.Host)
	},
}

func WebsocketHandler(c *gin.Context) {
	pool := c.MustGet("PgxPool").(*pgxpool.Pool)
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.Error(err)
		return
	}

	defer conn.Close()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			c.Error(err)
			return
		}
		queue := database.VideoQueue{}
		if err := queue.Query(pool, c); err != nil {
			c.Error(err)
			return
		}
		if err := conn.WriteJSON(queue.Queue); err != nil {
			c.Error(err)
			return
		}
	}
}
