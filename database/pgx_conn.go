package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var PgxPool *pgxpool.Pool
var Ctx = context.Background()

func PgxConnDatabase() error {
	url := os.Getenv("PGX_CONN")
	conn, err := pgxpool.New(context.Background(), url)
	if err != nil {
		log.Panic(err.Error())
	}

	PgxPool = conn
	CreateVideoInfoTable()
	CreateVideoConvertRecordTable()
	CreateVideoDetailedInfoTable()
	return nil
}
