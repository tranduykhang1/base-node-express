.PHONY: help lint up down build api-logs test-unit test-e2e install mongo-init seed seed-refresh

GREEN := \033[0;32m
NC := \033[0m 

help:
	@echo "Available commands:"
	@echo "$(GREEN)  lint        $(NC)- Run linting"
	@echo "$(GREEN)  up          $(NC)- (Docker) Start all services in detached mode"
	@echo "$(GREEN)  down        $(NC)- (Docker) Stop all services"
	@echo "$(GREEN)  build       $(NC)- (Docker) Build and start all services in detached mode"
	@echo "$(GREEN)  api-logs    $(NC)- (Docker) Tail logs for the demo_api container"
	@echo "$(GREEN)  unit-test   $(NC)- Run unit tests"
	@echo "$(GREEN)  e2e-test    $(NC)- Run end-to-end tests"
	@echo "$(GREEN)  install     $(NC)- Install dependencies inside the api container"
	@echo "$(GREEN)  mongo-init  $(NC)- Initialize MongoDB using the setup script"
	@echo "$(GREEN)  seed        $(NC)- Seed the database (default seeding)"
	@echo "$(GREEN)  seed-refresh$(NC)- Refresh the database (removes all data and re-seeds)"

lint:
	pnpm run lint

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

api-logs:
	docker logs demo_api -f --tail 10000

test-unit:
	pnpm test

test-e2e:
	pnpm test:e2e

install:
	docker compose exec api pnpm i

mongo-init:
	sh ./mongo-setup/setup.sh

seed:
	pnpm seed

seed-refresh:
	pnpm seed:refresh
