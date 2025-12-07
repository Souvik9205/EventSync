package main

import (
	"context"
	"eventSync-server/internal/env"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5"
)

type api struct {
	config config
	db *pgx.Conn
}

type config struct {
	addr string
	db dbConfig
}

type dbConfig struct {
	dsn string
}

func main() {
	ctx := context.Background()

	cfg := config {
		addr: ":8080",
		db: dbConfig{
			dsn: env.GetString("GOOSE_DBSTRING",  "host=localhost user=eventsync password=Test123? dbname=eventsync sslmode=disable"),
		},
	}

	//DB
	conn, err := pgx.Connect(ctx, cfg.db.dsn)
	if err != nil {
		panic(err)
	}
	defer conn.Close(ctx)

	slog.Info("connected to database", "dsn", cfg.db.dsn)

	api := api {
		config: cfg,
		db: conn,
	}

	if err := api.run(api.mount()); err != nil {
		slog.Error("Server has failed to start", "error", err)
		os.Exit(1)
	}
}