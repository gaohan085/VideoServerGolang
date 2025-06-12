package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
)

var PgxConn *pgx.Conn

func PgxConnDatabase() error {
	url := os.Getenv("PGX_CONN")
	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		log.Panic(err.Error())
	}

	PgxConn = conn
	CreateVideoInfoTable()
	return nil
}

func CreateVideoInfoTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS video_infos (
		id SERIAL PRIMARY KEY,
		serial_num TEXT NOT NULL UNIQUE,
		title TEXT,
		source_url TEXT,
		poster_name TEXT,
		source_poster_url TEXT,
		actress TEXT,
		play_src TEXT
	);
	`
	_, err := PgxConn.Exec(context.Background(), query)
	return err
}

// ⚠ ⚠ ⚠ 只能在测试环境中使用
func DROPTABLE() error {
	query := `
		DROP TABLE
			video_infos;
	`
	_, err := PgxConn.Exec(context.Background(), query)
	return err
}
