init:
	@echo "--------------------- INSTALL GO DEPENDENCIES -----------------------"
	@echo
	go get -u github.com/gofiber/fiber/v2@latest
	go get -u github.com/gofiber/template/html/v2@latest
	go get -u github.com/joho/godotenv@latest
	go get -u github.com/shirou/gopsutil/v3@latest
	go get -u gorm.io/gorm@latest
	go get -u gorm.io/driver/postgres@latest
	go get -u github.com/PuerkitoBio/goquery@latest
	go get -u github.com/go-co-op/gocron/v2@latest
	@echo
	@echo "--------------------- INSTALL NPM DEPENDENCIES ----------------------"
	@echo
	pnpm install

build:
	@echo "--------------------- CLEAN OUTPUT FOLDER ---------------------------"
	rm .out/* -rf
	@echo 
	@echo "------------------------- PNPM BUILD --------------------------------"
	pnpm build
	@echo 
	@echo "-------------------------- GO BUILD ---------------------------------"
	@echo 
	CGO_ENABLED=0 GOOS=linux GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-linux-amd64 
	CGO_ENABLED=0 GOOS=windows GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-windows-amd64.exe 
