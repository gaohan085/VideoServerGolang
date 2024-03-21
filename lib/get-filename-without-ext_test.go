package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetFilenameWithoutExt(t *testing.T) {
	tests := []struct {
		original string
		expect   string
	}{
		{
			original: "FamilyTherapyXXX.24.02.27.Alana.Rose.Spring.Break.At.Home.XXX.1080p.HEVC.x265.PRT.mkv",
			expect:   "FamilyTherapyXXX.24.02.27.Alana.Rose.Spring.Break.At.Home.XXX.1080p.HEVC.x265.PRT",
		},
		{
			original: "CAWD-623-C.mp4",
			expect:   "CAWD-623-C",
		},
	}

	for _, unit := range tests {
		assert.Equal(t, unit.expect, GetFilenameWithoutExt(unit.original))
	}
}
