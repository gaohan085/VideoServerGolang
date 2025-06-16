package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetSerialNumByRegex(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{
			input:    "hhd800.com@MIAA-515.mp4",
			expected: "MIAA-515",
		},
		{
			input:    "[7sht.me]ipx-228",
			expected: "ipx-228",
		},
		{
			input:    "[7sht.me]ipx-128-c",
			expected: "ipx-128",
		},
		{
			input:    "498DDH-102.mp4",
			expected: "498DDH-102",
		},
		{
			input:    "2FEB553BFE432956B73D56DC6AEBE2EAECD1F067.torrent",
			expected: "",
		},
		{
			input:    "stars-094【中文字幕】【古川いおり】【下大暴雨的夜晚公司就剩下我和喜欢的上司2人 做爱到天明】2019-07-11",
			expected: "stars-094",
		},
		{
			input:    "2048社区 - big2048.com@【ai高清2k修复】2020-9-4 男爵全国探花约了个极品性感包臀裙妹子啪啪穿上黑丝骑乘猛操",
			expected: "",
		},
		{
			input:    "teensloveblackcocks.23.12.02.leana.lovings.teach.me.hard",
			expected: "",
		},
		{
			input:    "kcf9.com-ntr骚妻白皙性感极品崇黑讨黑bbc【martha】最新福利，约炮黑猩猩各种暴力啪啪，床上干到室外1",
			expected: "",
		},
		{
			input:    "4k2.com@cawd-623",
			expected: "cawd-623",
		},
		{
			input:    "",
			expected: "",
		},
	}

	for _, c := range cases {
		assert.Equal(t, c.expected, GetSerialNumReg(c.input))
	}
}
