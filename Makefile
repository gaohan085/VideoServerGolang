init:
	@echo "--------------------- INSTALL GO DEPENDENCIES -----------------------"
	@echo
	go mod
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
	CGO_ENABLED=1 GOOS=linux GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-linux-amd64 
	CGO_ENABLED=1 GOOS=windows GOACH=amd64 go build -ldflags="-X 'go-fiber-react-ts/lib.Version=`git tag --sort=-version:refname | head -n 1`'" -o .out/videoserver-windows-amd64.exe 
