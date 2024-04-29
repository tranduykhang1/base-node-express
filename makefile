dev:
	pnpm run dev

prod:
	pnpm run start

build:
	pnpm run build

lint:
	pnpm run lint

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-build:
	docker compose up -d --build

docker-logs:
	docker logs demo-api -f --tail 10000

docker-install:
	docker compose exec api pnpm i
