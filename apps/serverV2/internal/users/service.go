package users

import (
	"context"
	repo "eventSync-server/internal/adapters/sqlc"
)

type Service interface {
	ListUsers(ctx context.Context) ([]repo.ListUsersRow, error)
}

type svc struct {
	repo repo.Querier
}

func NewService(repo repo.Querier) Service{
	return &svc{repo: repo}
}

func (s *svc) ListUsers(ctx context.Context) ([]repo.ListUsersRow, error) {
	return s.repo.ListUsers(ctx)
}
