set -e

echo '# build'
docker-compose -f docker-compose.stage.yml build frontend
docker tag inventorymaterialweb_frontend:latest benning55/pos:latest
docker push benning55/pos:latest