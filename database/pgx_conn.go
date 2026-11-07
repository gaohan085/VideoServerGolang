package database

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func PgxConnDatabase() (*pgxpool.Pool, error) {
	url := os.Getenv("PGX_CONN")
	conn, err := pgxpool.New(context.Background(), url)
	if err != nil {
		return nil, err
	}
	CreateVideoConvertRecordTable(conn, context.Background())
	CreateVideoDetailedInfoTable(conn, context.Background())
	return conn, nil
}
