package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetSerialName(t *testing.T) {
	t.Run("Remove Preffix", func(t *testing.T) {
		testName := "hhd800.com@hmn-003"

		assert.Equal(t, "hmn-003", RemovePrefix(testName))
	})

	t.Run("Remove Suffix", func(t *testing.T) {
		testName := "hmn-003-c"

		assert.Equal(t, "hmn-003", RemoveSuffix(testName))
	})

	t.Run("Get Serial Number from name", func(t *testing.T) {
		testNames := []struct {
			orginal string
			expect  string
		}{
			{
				orginal: "hmn-003",
				expect:  "hmn-003",
			},
			{
				orginal: "hhd800.com@HMN-003",
				expect:  "hmn-003",
			},
			{
				orginal: "hmn-003-c",
				expect:  "hmn-003",
			},
			{
				orginal: "hhd800.com@HMN-003-C",
				expect:  "hmn-003",
			},
			{
				orginal: "hhd800.com@Cjod-067-c",
				expect:  "cjod-067",
			},
			{
				orginal: "hmn-003.mp4",
				expect:  "hmn-003",
			},
			{
				orginal: "hhd800.com@HMN-003.mp4",
				expect:  "hmn-003",
			},
			{
				orginal: "hmn-003-c.mp4",
				expect:  "hmn-003",
			},
		}

		for _, name := range testNames {
			t.Run(name.orginal, func(t *testing.T) {
				assert.Equal(t, name.expect, GetSerialNum(name.orginal))
			})
		}
	})
}
