package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDurationInSeconds(t *testing.T) {
	var units = []struct {
		durStr string
		durNum float64
	}{
		{
			durStr: "0:09:56.962000",
			durNum: 596.962,
		},
		{
			durStr: "02:53:06.82",
			durNum: 10386.82,
		},
		{
			durStr: "02:08:47.79",
			durNum: 7727.79,
		},
	}

	for _, unit := range units {
		durTNum, err := DurationInSeconds(unit.durStr)

		assert.Nil(t, err)
		assert.Equal(t, unit.durNum, durTNum)
	}
}
