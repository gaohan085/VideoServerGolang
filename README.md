# [Golang](https://go.dev/) Video Server Writen in [fiber framework](https://gofiber.io/) with [React](https://react.dev/)

## 👉[Release Page](https://github.com/gaohan085/VideoServerGolang/tags)

## 👉 Build Yourself

### 👉 requirement [Nodejs](https://nodejs.org/) [Go](https://go.dev/) [FFMPEG](https://ffmpeg.org/)

```bash
make && make build
```

#### Usage

```bash
videoserver-0.7.0.1-linux-amd64 -usage=ffmpeg # As ffmpeg server in production mode
```

```bash
videoserver-0.7.0.1-linux-amd64 -usage=pro # As main video server in production mode
```

```bash
videoserver-0.7.0.1-linux-amd64 -usage=dev -file=remote # As main video server in development mode and get file information from remote server
```
```bash
videoserver-0.7.0.1-linux-amd64 -usage=dev -file=local # As main video server in development mode and get file information from local path
```
