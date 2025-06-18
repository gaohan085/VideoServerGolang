package database

import (
	"fmt"
	"go-fiber-react-ts/lib"
	"io"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	fiberlog "github.com/gofiber/fiber/v2/log"
	"github.com/jackc/pgx/v5"
)

type Tag struct {
	ID   int
	Name string `json:"tag"`
}

func (t *Tag) Create() error {
	return PgxPool.QueryRow(Ctx, `
		INSERT INTO tags (
			name
		)
		VALUES (
			$1
		)
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
		RETURNING id;
	`, t.Name).Scan(&t.ID)
}

func (t *Tag) Query() error {
	return PgxPool.QueryRow(Ctx, `
		SELECT id, name
		FROM tags 
		WHERE name = $1 OR id = $2;
	`, t.Name, t.ID).Scan(&t.ID, &t.Name)
}

type Actor struct {
	ID   int
	Name string `json:"actorName"`
	Sex  string `json:"sex"`
}

func (ac *Actor) Create() error {
	return PgxPool.QueryRow(Ctx, `
		INSERT INTO actors (
			name, sex
		)
		VALUES (
			$1, $2
		)
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
		RETURNING id;
	`, ac.Name, ac.Sex).Scan(&ac.ID)
}

func (ac *Actor) Query() error {
	return PgxPool.QueryRow(Ctx, `
		SELECT id, name, sex
		FROM actors
		WHERE id = $1 OR name = $2;
	`, ac.ID, ac.Name).Scan(&ac.ID, &ac.Name, &ac.Sex)
}

type VideoDetailedInfo struct {
	ID             int
	SN             string
	Title          string
	ReleaseDate    time.Time
	Duration       int //数据源自外部网站，数字单位为分钟
	Director       string
	Publisher      string
	Series         string
	Rank           float64
	PosterUrl      string
	SourceUrl      string
	PosterFileName string
	Tags           []Tag
	Actors         []Actor
}

func CreateVideoDetailedInfoTable() error {
	batch := &pgx.Batch{}

	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS video_details (
			id SERIAL PRIMARY KEY,
			sn TEXT UNIQUE NOT NULL,
			title TEXT,
			release_date DATE,
			duration NUMERIC(4,0),
			director TEXT,
			publisher TEXT,
			series TEXT,
			rank NUMERIC(3,2),
			poster_url TEXT,
			source_url TEXT,
			poster_file_name TEXT
		);`,
	)
	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS tags (
			id SERIAL PRIMARY KEY,
			name TEXT UNIQUE NOT NULL
		);`,
	)
	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS video_tags (
			video_id INT REFERENCES video_details(id),
			tag_id INT REFERENCES tags(id),
			PRIMARY KEY (video_id, tag_id)
		);`,
	)
	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS actors (
			id SERIAL PRIMARY KEY,	
			name TEXT UNIQUE NOT NULL,
			sex TEXT
		);`,
	)
	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS video_actors (
			video_id INT REFERENCES video_details(id),
			actor_id INT REFERENCES actors(id),
			PRIMARY KEY (video_id, actor_id)
		);`,
	)

	_, err := PgxPool.SendBatch(Ctx, batch).Exec()
	return err
}

func DROPVideoDetailsTable() error {
	_, err := PgxPool.Exec(Ctx,
		`DROP TABLE IF EXISTS video_details, tags, actors, video_tags, video_actors CASCADE`,
	)
	return err
}

func (v *VideoDetailedInfo) Create() error { //TODO Test
	queryVideoCreate := `
		INSERT INTO video_details (
			sn,
			title,
			release_date,
			duration,
			director,
			publisher,
			series,
			rank,
			poster_url,
			source_url,
			poster_file_name
		)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		ON CONFLICT (sn) DO UPDATE SET sn = EXCLUDED.sn
		RETURNING id;
	`

	if err := PgxPool.QueryRow(Ctx, queryVideoCreate,
		v.SN,
		v.Title,
		v.ReleaseDate,
		v.Duration,
		v.Director,
		v.Publisher,
		v.Series,
		v.Rank,
		v.PosterUrl,
		v.SourceUrl,
		v.PosterFileName,
	).Scan(&v.ID); err != nil {
		return err
	}

	for _, tag := range v.Tags {
		tag.Create()

		_, err := PgxPool.Exec(Ctx, `
			INSERT INTO video_tags (
			video_id, tag_id
			) 
			VALUES ($1, $2)
			ON CONFLICT (video_id,tag_id) DO NOTHING;
		`, v.ID, tag.ID)
		if err != nil {
			return err
		}
	}

	for _, actor := range v.Actors {
		actor.Create()

		_, err := PgxPool.Exec(Ctx,
			`
			INSERT INTO video_actors (
			video_id, actor_id
			) 
			VALUES ($1, $2)
			ON CONFLICT (video_id,actor_id) DO NOTHING;
		`,
			v.ID, actor.ID,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func (v *VideoDetailedInfo) Query() error {
	if err := PgxPool.QueryRow(Ctx, `
		SELECT 
			id,
			sn,
			title,
			release_date,
			duration,
			director,
			publisher,
			series,
			rank,
			poster_url,
			source_url,
			poster_file_name
		FROM video_details
		WHERE id = $1 OR sn = $2;
	`, v.ID, v.SN).Scan(
		&v.ID,
		&v.SN,
		&v.Title,
		&v.ReleaseDate,
		&v.Duration,
		&v.Director,
		&v.Publisher,
		&v.Series,
		&v.Rank,
		&v.PosterUrl,
		&v.SourceUrl,
		&v.PosterFileName,
	); err != nil {
		if err == pgx.ErrNoRows { //DONE test
			return ErrVideoNotFound
		}
		return err
	}

	tagRows, err := PgxPool.Query(Ctx, `
		SELECT t.name
		FROM tags t
		JOIN video_tags vt ON t.id = vt.tag_id
		WHERE vt.video_id = $1;
	`, v.ID)
	if err != nil {
		return err
	}
	for tagRows.Next() {
		tag := Tag{}
		if err := tagRows.Scan(&tag.Name); err != nil {
			return err
		}
		v.Tags = append(v.Tags, tag)
	}

	actorRows, err := PgxPool.Query(Ctx, `
		SELECT a.name, a.sex
		FROM actors a
		JOIN video_actors va ON a.id = va.actor_id
		WHERE va.video_id = $1;
	`, v.ID)
	if err != nil {
		return err
	}
	for actorRows.Next() {
		actor := Actor{}
		if err := actorRows.Scan(&actor.Name, &actor.Sex); err != nil {
			return err
		}
		v.Actors = append(v.Actors, actor)
	}

	return nil
}

func (v *VideoDetailedInfo) Update() error {
	if err := PgxPool.QueryRow(Ctx, `
		UPDATE video_details
		SET
			title = $1,
			release_date = $2,
			duration=$3,
			director=$4,
			publisher=$5,
			series=$6,
			rank=$7,
			poster_url = $8,
			source_url = $9,
			poster_file_name = $10
		WHERE 
			sn = $11 OR id = $12
		RETURNING id;
	`, v.Title,
		v.ReleaseDate,
		v.Duration,
		v.Director,
		v.Publisher,
		v.Series,
		v.Rank,
		v.PosterUrl,
		v.SourceUrl,
		v.PosterFileName,
		v.SN,
		v.ID,
	).Scan(&v.ID); err != nil {
		return err
	}

	for _, tag := range v.Tags {
		tag.Create()

		_, err := PgxPool.Exec(Ctx, `
			INSERT INTO video_tags (
			video_id, tag_id
			) 
			VALUES ($1, $2)
			ON CONFLICT (video_id,tag_id) DO NOTHING;
		`, v.ID, tag.ID)
		if err != nil {
			return err
		}
	}

	for _, actor := range v.Actors {
		actor.Create()

		_, err := PgxPool.Exec(Ctx,
			`
			INSERT INTO video_actors (
			video_id, actor_id
			) 
			VALUES ($1, $2)
			ON CONFLICT (video_id,actor_id) DO NOTHING;
		`,
			v.ID, actor.ID,
		)
		if err != nil {
			return err
		}
	}

	return nil
}

func (v *VideoDetailedInfo) DownloadPoster() error {
	v.PosterUrl = lib.GetPosterLinkFromSN(v.SN)
	v.PosterFileName = fmt.Sprintf("%s%s.jpg", strings.Split(v.SN, "-")[0], strings.Split(v.SN, "-")[1])

	//获取当前路径
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}
	//如果存放图片文件夹不存在，则创建文件夹
	if _, err := os.Stat(cwd + "/assets/poster/"); os.IsNotExist(err) {
		if err := os.MkdirAll(cwd+"/assets/poster/", 0777); err != nil {
			return err
		}
	}

	file, err := os.Create(cwd + "/assets/poster/" + v.PosterFileName)
	if err != nil {
		return err
	}
	defer file.Close()

	fiberlog.Info("Downloading Video " + v.SN + " Poster.")
	res, err := lib.DoHttpProxyRequest(v.PosterUrl)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	//将res.body 写入文件
	io.Copy(file, res.Body)

	return v.Update()
}

func (v *VideoDetailedInfo) GetSourceUrl() error {
	fiberlog.Info(fmt.Sprintf("Getting Video '%s' source url.", v.SN))

	url := "https://javdb.com/search?q=" + v.SN + "&f=all"
	res, err := lib.DoHttpProxyRequest(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		return ErrQueryVideoFail
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return err
	}

	selection := doc.Find("body > section > div > div.movie-list.h.cols-4.vcols-8 > div:nth-child(1) > a")

	valSrc, _ := selection.Attr("href")
	v.SourceUrl = "https://javdb.com" + valSrc

	return v.Update()
}

func (v *VideoDetailedInfo) GetDetailInfo() error {
	res, err := lib.DoHttpProxyRequest(v.SourceUrl)
	if err != nil {
		return err
	}

	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return err
	}

	v.Title = doc.Find("body > section > div > div.video-detail > h2 > strong.current-title").Text()

	detailedInfoSelection := doc.Find("body > section > div > div.video-detail > div.video-meta-panel > div > div:nth-child(2) > nav").Children()

	detailedInfoSelection.Each(func(i int, s *goquery.Selection) {
		switch s.Find("div > strong").Text() {
		case "番號:":
			v.SN = s.Find("div>span").Text()
		case "日期:":
			v.ReleaseDate, err = time.Parse("2006-01-02", s.Find("div>span.value").Text())
		case "時長:":
			v.Duration, err = strconv.Atoi(s.Find("div>span").Text()[:3])
		case "導演:":
			v.Director = s.Find("div>span>a").Text()
		case "片商:":
			v.Publisher = s.Find("div>span>a").Text()
		case "系列:":
			v.Series = s.Find("div>span>a").Text()
		case "評分:":
			text := s.Find("div>span").Text()
			rankText := strings.Split(text, "分")[0][2:]
			v.Rank, err = strconv.ParseFloat(rankText, 64)
		case "類別:":
			s.Find("div>span.value>a").Each(func(ii int, ss *goquery.Selection) {
				v.Tags = append(v.Tags, Tag{Name: ss.Text()})
			})
		case "演員:":
			namelist, sexlist := []string{}, []string{}
			s.Find("div>span.value>a").Each(func(ii int, ss *goquery.Selection) {
				namelist = append(namelist, ss.Text())
			})
			s.Find("div>span.value>strong").Each(func(ii int, ss *goquery.Selection) {
				if ss.Text() == "♀" {
					sexlist = append(sexlist, "female")
				}
				if ss.Text() == "♂" {
					sexlist = append(sexlist, "male")
				}
			})
			for index, sex := range sexlist {
				if sex == "male" {
					v.Actors = append(v.Actors, Actor{Name: namelist[index], Sex: "male"})
				}
				if sex == "female" {
					v.Actors = append(v.Actors, Actor{Name: namelist[index], Sex: "female"})
				}
			}
		}
	})

	return v.Update()
}

func QueryVideosByTag(name string) ([]VideoDetailedInfo, error) {
	videos := []VideoDetailedInfo{}

	tag := &Tag{Name: name}
	if err := tag.Query(); err != nil {
		return nil, err
	}

	rows, err := PgxPool.Query(Ctx, `
		SELECT video.id
		FROM video_details video
		JOIN video_tags vt ON video.id = vt.video_id
		WHERE vt.tag_id = $1;
	`, tag.ID)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		video := &VideoDetailedInfo{}

		if err := rows.Scan(&video.ID); err != nil {
			return nil, err
		}

		if err := video.Query(); err != nil {
			return nil, err
		}

		videos = append(videos, *video)
	}

	return videos, nil
}

func QueryVideoByActor(name string) ([]VideoDetailedInfo, error) {
	videos := []VideoDetailedInfo{}

	actor := &Actor{Name: name}
	if err := actor.Query(); err != nil {
		return nil, err
	}

	rows, err := PgxPool.Query(Ctx, `
		SELECT video.id
		FROM video_details video
		JOIN video_actors va ON video.id = va.video_id
		WHERE va.actor_id = $1;
	`, actor.ID)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		video := &VideoDetailedInfo{}

		if err := rows.Scan(&video.ID); err != nil {
			return nil, err
		}

		if err := video.Query(); err != nil {
			return nil, err
		}

		videos = append(videos, *video)
	}
	return videos, nil
}

func QueryVideosByDirector(director string) ([]VideoDetailedInfo, error) {
	videos := []VideoDetailedInfo{}
	rows, err := PgxPool.Query(Ctx, `
		SELECT 
			sn, title, poster_file_name
		FROM
			video_details
		WHERE
			director = $1
		ORDER BY id;
	`, director)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		video := VideoDetailedInfo{}

		if err := rows.Scan(
			&video.SN,
			&video.Title,
			&video.PosterFileName,
		); err != nil {
			return nil, err
		}
		videos = append(videos, video)
	}
	return videos, nil
}
func QueryVideosByPublisher(publisher string) ([]VideoDetailedInfo, error) {
	videos := []VideoDetailedInfo{}
	rows, err := PgxPool.Query(Ctx, `
		SELECT 
			sn, title, poster_file_name
		FROM
			video_details
		WHERE
			publisher = $1
		ORDER BY id;
	`, publisher)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		video := VideoDetailedInfo{}

		if err := rows.Scan(
			&video.SN,
			&video.Title,
			&video.PosterFileName,
		); err != nil {
			return nil, err
		}
		videos = append(videos, video)
	}
	return videos, nil
}
