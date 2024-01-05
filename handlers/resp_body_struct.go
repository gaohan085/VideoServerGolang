package handlers

type RespBody struct {
	StatusCode int         `json:"code"`
	Data       interface{} `json:"data"`
}
