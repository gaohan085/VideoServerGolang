package database

import "testing"

func InitTest(t *testing.T) {
	t.Setenv("DB_DESTN", "host=192.168.1.199 user=gaohan password=gh961004 dbname=video_server_test port=5432 sslmode=disable TimeZone=Asia/Shanghai")
	t.Setenv("ROOT_DIR", "/home/gaohan/downloads/")
	SetDB()
}

func DropTables() {
	Db.Migrator().DropTable(&VideoInf{}, &VideoConvert{})
}
