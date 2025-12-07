package main

import (
	repo "eventSync-server/internal/adapters/sqlc"
	"eventSync-server/internal/users"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *api) mount() http.Handler{
	r := chi.NewRouter()

	//middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("All good"))
	})

	userService := users.NewService(repo.New(app.db))
	userHandler := users.NewHandler(userService)

	r.Get("/users", userHandler.ListUsers)

	return r
}

func (app *api) run(h http.Handler) error {
	srv := &http.Server{
		Addr: app.config.addr,
		Handler: h,
		WriteTimeout: time.Second * 30,
		ReadTimeout: time.Second * 10,
		IdleTimeout: time.Minute,
	}

	log.Printf("Server has stated at addr %s", app.config.addr)
	return srv.ListenAndServe()
}
