init:
	echo "go install"
	go get -u github.com/gofiber/fiber/v2@latest
	go get -u github.com/gofiber/template/html/v2@latest
	go get -u github.com/joho/godotenv@latest
	go get -u github.com/shirou/gopsutil/v3@latest
	go get -u gorm.io/gorm@latest
	go get -u gorm.io/driver/postgres@latest
	go get -u github.com/PuerkitoBio/goquery@latest
	go get -u github.com/go-co-op/gocron/v2@latest
	
	@pnpm install

build:
	pnpm build
	go build
