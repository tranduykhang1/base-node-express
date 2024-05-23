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

unit:
	pnpm test

e2e:
	pnpm test:e2e

install:
	docker compose exec api pnpm i

mongo-init:
	sh ./mongo-setup/setup.sh