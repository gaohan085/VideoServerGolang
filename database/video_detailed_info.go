package database

import (
	"time"

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
			serial_number,
			title,
			release_date,
			duration,
			director,
			publisher,
			series,
			rank
		FROM video_details
		WHERE id = $1 OR serial_number = $2;
	`, v.ID, v.SerialNumber).Scan(
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
			rank=$7
		WHERE 
			serial_number = $8
		RETURNING id
	`, v.Title,
		v.ReleaseDate,
		v.Duration,
		v.Publisher,
		v.Series,
		v.Rank,
		v.SerialNumber,
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
