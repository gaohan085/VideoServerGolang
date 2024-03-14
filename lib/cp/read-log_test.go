package cp

import (
	"bufio"
	"fmt"
	"go-fiber-react-ts/lib"
	"log"
	"os"
	"regexp"
	"testing"
	"time"
)

func ReadFromFile(path string) float64 {
	var progressline string
	progressReg := regexp.MustCompile(`(time=)([\d]{2}(:||[^\s])){4}`)

	for {
		file, err := os.OpenFile(path, os.O_RDONLY, 0000)
		if err != nil && err != os.ErrNotExist {
			log.Fatal(err)
			break
		} else if err == os.ErrNotExist {
			fmt.Println("Continue")
			continue
		}

		scanner := bufio.NewScanner(file)

		for scanner.Scan() {
			if progressReg.MatchString(scanner.Text()) {
				progressline = scanner.Text()
			}
		}

		proTimeSlice := progressReg.FindAllString(progressline, -1)
		if len(proTimeSlice) != 0 {
			proTimeStr := (proTimeSlice[len(proTimeSlice)-1])
			progressTime := regexp.MustCompile(`([\d]{2}(:||[^\s])){4}`).FindString(proTimeStr)
			proInSeconds, _ := lib.DurationInSeconds(progressTime)
			fmt.Println(proInSeconds)
		}

		file.Close()
		time.Sleep(3 * time.Second)
	}

	return 0
}

func TestReadFromFile(t *testing.T) {
	path := "./convert.log"

	ReadFromFile(path)
}
