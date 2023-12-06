installDep:
	echo "Make Installation"
	go get -u github.com/gofiber/fiber/v2@latest
	go get -u github.com/gofiber/template/html/v2@latest
	go get -u github.com/joho/godotenv@latest
	go get -u github.com/shirou/gopsutil/v3@latest
	pnpm install

build: install
	rm .out/* -r
	pnpm build
	GOOS=linux GOACH=amd64 go build -o .out/videoserver-linux-amd64 main.go
	GOOS=windows GOACH=amd64 go build -o .out/videoserver-windows-amd64.exe main.go