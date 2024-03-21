package lib

import "strings"

func GetFilenameWithoutExt(n string) string {
	return n[:strings.LastIndex(n, ".")]
}
