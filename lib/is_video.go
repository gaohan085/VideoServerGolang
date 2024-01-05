package lib

import "slices"

func IsVideo(s *string) bool {
	return slices.Contains([]string{
		".wmv",
		".asf",
		".asx",
		".rm",
		".rmvb",
		".mp4",
		".3gp",
		".mov",
		".m4v",
		".avi",
		".dat",
		".mkv",
		".flv",
		".vob",
		".mpg",
		".mpeg",
		".ts",
	}, *s)
}
