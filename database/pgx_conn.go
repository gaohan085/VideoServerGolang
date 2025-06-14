package database

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var PgxPool *pgxpool.Pool
var Ctx, _ = context.WithTimeout(context.Background(), 120*time.Second)

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
