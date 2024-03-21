package database

import (
	"bufio"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetProgressFromLog(t *testing.T) {
	var script = `cat ./progress2.log`
	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)
	buf, _ := cmd.StdoutPipe()
	scanner := bufio.NewScanner(buf)
	var timeSlice []string
	cmd.Start()

	for scanner.Scan() {
		if regexp.MustCompile(`(out_time_us=)[\d]{5,}`).MatchString(scanner.Text()) {
			timeSlice = append(timeSlice, scanner.Text())
		}
	}
	assert.Equal(t, "out_time_us=189674667", timeSlice[len(timeSlice)-1])

	outTime := regexp.MustCompile(`[\d]{5,}`).FindString(timeSlice[len(timeSlice)-1])
	assert.Equal(t, "189674667", outTime)

	outTimeInus, err := strconv.ParseFloat(regexp.MustCompile(`[\d]{6,}`).FindString(outTime), 64)
	assert.Nil(t, err)
	assert.Equal(t, float64(189674667)/1000000, float64(outTimeInus/1000000))
}
