package cp

import (
	"bufio"
	"log"
	"os/exec"
	"strconv"
	"strings"
)

// bash command: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal /home/gaohan/downloads/test/test.mp4
func GetVideoDuration(path /** Video Full Path*/ string) (duration string, err error) {
	var durationTimeStr string

	cmd := exec.Command("./get_duration.sh", path)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return "", err
	}

	if err := cmd.Start(); err != nil {
		return "", err
	}
	scanner := bufio.NewScanner(stdout)

	for scanner.Scan() {
		durationTimeStr = scanner.Text()
	}

	if err := cmd.Wait(); err != nil {
		log.Fatal(err)
	}

	return durationTimeStr, nil
}

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
