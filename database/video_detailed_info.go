package database

import (
	"time"

	"github.com/jackc/pgx/v5"
)

type Tag struct {
	ID      int
	TagName string `json:"tag"`
}

func (t *Tag) Create() error {
	query := `
		INSERT INTO tags (
			name
		)
		VALUES (
			$1
		)
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
		RETURNING id;
	`
	return PgxPool.QueryRow(Ctx, query, t.TagName).Scan(&t.ID)
}

type Actor struct {
	ID        int
	ActorName string `json:"actorName"`
	Sex       string `json:"sex"`
}

func (ac *Actor) Create() error {
	query := `
		INSERT INTO actors (
			name, sex
		)
		VALUES (
			$1, $2
		)
		ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
		RETURNING id;
	`

	return PgxPool.QueryRow(Ctx, query, ac.ActorName, ac.Sex).Scan(&ac.ID)
}

type VideoDetailedInfo struct {
	ID           int
	SerialNumber string
	Title        string
	ReleaseDate  time.Time
	Duration     int //数据源自外部网站，数字单位为分钟
	Director     string
	Publisher    string
	Series       string
	Rank         string
	Tags         []Tag
	Actors       []Actor
}

func CreateVideoDetailedInfoTable() error {
	batch := &pgx.Batch{}

	batch.Queue(
		`
		CREATE TABLE IF NOT EXISTS video_details (
			id SERIAL PRIMARY KEY,
			serial_number TEXT UNIQUE NOT NULL,
			title TEXT,
			release_date DATE,
			duration NUMERIC(4,0),
			director TEXT,
			publisher TEXT,
			series TEXT,
			rank NUMERIC(3,2)
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
			serial_number,
			title,
			release_date,
			duration,
			director,
			publisher,
			series,
			rank
		)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (serial_number) DO UPDATE SET serial_number = EXCLUDED.serial_number
		RETURNING id;
	`

	if err := PgxPool.QueryRow(Ctx, queryVideoCreate,
		v.SerialNumber,
		v.Title,
		v.ReleaseDate,
		v.Duration,
		v.Director,
		v.Publisher,
		v.Series,
		v.Rank,
	).Scan(&v.ID); err != nil {
		return err
	}

	for _, tag := range v.Tags {
		tag.Create()

		_, err := PgxPool.Exec(Ctx, `
			INSERT INTO video_tags (video_id, tag_id) VALUES ($1, $2)
		`, v.ID, tag.ID)
		if err != nil {
			return err
		}
	}

	for _, actor := range v.Actors {
		actor.Create()

		_, err := PgxPool.Exec(Ctx,
			`
			INSERT INTO video_actors (video_id, actor_id) VALUES ($1, $2)
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

	query := `
		SELECT 
			id,
			serial_number,
			title,
			release_date,
			duration,
			director,
			publisher,
			series,
			rank
		FROM video_details
		WHERE serial_number = $1;
	`
	if err := PgxPool.QueryRow(Ctx, query, v.SerialNumber).Scan(
		&v.ID,
		&v.SerialNumber,
		&v.Title,
		&v.ReleaseDate,
		&v.Duration,
		&v.Director,
		&v.Publisher,
		&v.Series,
		&v.Rank,
	); err != nil {
		return err
	}

	queryTags := `
		SELECT t.name
		FROM tags t
		JOIN video_tags vt ON t.id = vt.tag_id
		WHERE vt.video_id = $1;
	`
	tagRows, err := PgxPool.Query(Ctx, queryTags, v.ID)
	if err != nil {
		return err
	}

	for tagRows.Next() {
		tag := Tag{}
		if err := tagRows.Scan(&tag.TagName); err != nil {
			return err
		}
		v.Tags = append(v.Tags, tag)
	}

	queryActors := `
		SELECT a.name, a.sex
		FROM actors a
		JOIN video_actors va ON a.id = va.actor_id
		WHERE va.video_id = $1;
	`
	actorRows, err := PgxPool.Query(Ctx, queryActors, v.ID)
	if err != nil {
		return err
	}
	for actorRows.Next() {
		actor := Actor{}
		if err := actorRows.Scan(&actor.ActorName, &actor.Sex); err != nil {
			return err
		}
		v.Actors = append(v.Actors, actor)
	}

	return nil
}
