package database

import (
	"context"

	"github.com/jackc/pgx/v5"
)

var PgxConn *pgx.Conn

func PgxConnDatabase() error {
	url := "postgres://gaohan:gh961004@192.168.1.199:5432/video_server_pgx_test"
	conn, err := pgx.Connect(context.Background(), url)
	if err != nil {
		return err
	}

	PgxConn = conn

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
