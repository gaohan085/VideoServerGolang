init:
	echo "go install"
	@go get -u github.com/gofiber/fiber/v2@latest
	@go get -u github.com/gofiber/template/html/v2@latest
	@go get -u github.com/joho/godotenv@latest
	@go get -u github.com/shirou/gopsutil/v3@latest
	@go get -u gorm.io/gorm@latest
	@go get -u gorm.io/driver/postgres@latest
	@pnpm install

build:
	rm .out/* -r
	pnpm build
	GOOS=linux GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-linux-amd64 main.go
	GOOS=windows GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-windows-amd64.exe main.go