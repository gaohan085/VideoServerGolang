package lib

import (
	"strings"
)

func RemoveFileExt(n string) string {
	if strings.Contains(n, ".mp4") {
		return n[:strings.LastIndex(n, ".mp4")]
	}
	return n
}

func RemoveSuffix(n string) string {
	if strings.Contains(n, "-c") {
		return n[:strings.LastIndex(n, "-c")]
	}
	return n
}

func RemovePrefix(n string) string {
	if strings.Contains(n, "hhd800.com@") {
		return n[strings.LastIndex(n, "@")+1:]
	}
	return n
}

func GetSerialNum(n string) string {
	return RemoveSuffix(RemovePrefix(RemoveFileExt(strings.ToLower(n))))
}
