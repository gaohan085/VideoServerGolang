package cp

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
	"strings"
	"testing"
)

func TestRunBashScriptFromString(t *testing.T) {
	script := `
		echo "Hello World!"
	`

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		fmt.Println("1")
		log.Fatal(err)
	}

	if err := cmd.Start(); err != nil {
		fmt.Println("2")
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(stdout)

	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println("StdOut: " + line)
	}

	if err := cmd.Wait(); err != nil {
		fmt.Println("3")
		log.Fatal(err)
	}
}

func TestRunVideoConvertFromBashString(t *testing.T) {
	script := `
	rm ./ffreport.log && FFREPORT=file=ffreport.log:level=32 taskset -c 0 ffmpeg -y -i /home/gaohan/downloads/test/test.mp4 -vcodec copy /home/gaohan/downloads/test/test-cv.mp4
	`

	cmd := exec.Command("bash")
	cmd.Stdin = strings.NewReader(script)

	// stdout, err := cmd.StdoutPipe()
	// if err != nil {
	// 	fmt.Println("1")
	// 	log.Fatal(err)
	// }

	if err := cmd.Start(); err != nil {
		fmt.Println("2")
		log.Fatal(err)
	}

	ReadFromFile("./ffreport.log")

	// 	scanner := bufio.NewScanner(stdout)
	//
	// 	for scanner.Scan() {
	// 		line := scanner.Text()
	// 		fmt.Println("StdOut: " + line)
	// 	}

	if err := cmd.Wait(); err != nil {
		fmt.Println("3")
		log.Fatal(err)
	}
}
