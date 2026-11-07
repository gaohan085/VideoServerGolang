package lib

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProxyDo(
	c *gin.Context,
	target string,
) ([]byte, error) {
	req, err := http.NewRequestWithContext(
		c.Request.Context(),
		c.Request.Method,
		target,
		c.Request.Body,
	)
	if err != nil {
		return nil, err
	}
	req.URL.RawQuery = c.Request.URL.RawQuery
	req.Header = c.Request.Header.Clone()
	res, err := http.DefaultClient.Do(req)

	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	return io.ReadAll(res.Body)
}
