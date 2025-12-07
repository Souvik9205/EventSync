package users

import (
	"eventSync-server/internal/json"
	"log"
	"net/http"
)

type handler struct {
	service Service 
}

func NewHandler(service Service) *handler {
	return  &handler{
		service: service,
	}
}

func (h *handler) ListUsers(w http.ResponseWriter, r * http.Request) {
	users, err := h.service.ListUsers(r.Context())

	if err != nil {
		log.Panicln(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.Write(w, http.StatusOK, users)
}