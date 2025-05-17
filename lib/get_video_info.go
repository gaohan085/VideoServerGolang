package lib

import (
	"time"
)

type Stars struct {
	Actress []string
	Actors  []string
}

type VideoDetailedInfo struct {
	SerialNumber string
	Title        string
	ReleaseDate  time.Time
	Duration     int
	Director     string
	Publisher    string
	Series       string
	Rank         string
	Tags         []string
	StarringInfo Stars
}

func GetVideoDetailedInfo(source string) (VideoDetailedInfo, error) {

	return ParseDocument(source)
}
