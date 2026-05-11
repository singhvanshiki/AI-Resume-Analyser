SHELL := /bin/bash

ENV_FILE ?= .env
ifeq ($(wildcard $(ENV_FILE)),)
ENV_FILE := .env.example
endif
export ENV_FILE

.PHONY: up down logs ps migrate test clean

up:
	docker compose --env-file $(ENV_FILE) up --build -d
	docker compose --env-file $(ENV_FILE) run --rm migrations

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

ps:
	docker compose ps

migrate:
	docker compose --env-file $(ENV_FILE) run --rm migrations

test:
	docker compose --env-file $(ENV_FILE) run --rm auth-service sh -c "uv sync --frozen --active && pytest -q"
	docker compose --env-file $(ENV_FILE) run --rm resume-service sh -c "uv sync --frozen --active && pytest -q"
	docker compose --env-file $(ENV_FILE) run --rm analysis-service sh -c "uv sync --frozen --active && pytest -q"
	docker compose --env-file $(ENV_FILE) run --rm ranking-service sh -c "uv sync --frozen --active && pytest -q"
	docker compose --env-file $(ENV_FILE) run --rm api-gateway sh -c "uv sync --frozen --active && pytest -q"

clean:
	docker compose down -v --remove-orphans
	docker system prune -f
