package lib

import (
	"strconv"
	"strings"
)

func DurationInSeconds(d string) (float64, error) {
	slice := strings.Split(d, ":")

	durNumHour, err := strconv.ParseInt(slice[0], 10, 32)
	if err != nil {
		return 0, err
	}

	durNumMin, err := strconv.ParseInt(slice[1], 10, 32)
	if err != nil {
		return 0, err
	}

	durNumSec, err := strconv.ParseFloat(slice[2], 64)
	if err != nil {
		return 0, err
	}

	return float64(durNumHour*3600+durNumMin*60) + durNumSec, nil
}
