docker exec -it demo_mongo sh ./scripts/rs-init.sh

sleep 1

docker restart demo_api
