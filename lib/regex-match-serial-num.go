package lib

import "regexp"

func GetSerialNumReg(n string) string {
	re := regexp.MustCompile(`([0-9]|[a-z]|[A-Z]){3,}-[0-9]{3,}`)

	return re.FindString(n)
}
