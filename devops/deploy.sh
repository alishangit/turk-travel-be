#!/usr/bin/env bash
set -euo pipefail

HOST="${DEPLOY_HOST:-212.34.143.161}"
USER="${DEPLOY_USER:-root}"
APP_DIR="${DEPLOY_APP_DIR:-/root/turk-travel-be}"
COMPOSE_FILE="devops/docker-compose.prod.yml"

ssh "${USER}@${HOST}" bash -s <<EOF
set -euo pipefail
cd "${APP_DIR}"
git fetch origin main
git reset --hard origin/main
docker compose -f ${COMPOSE_FILE} build backend
docker compose -f ${COMPOSE_FILE} up -d backend
docker compose -f ${COMPOSE_FILE} ps
EOF

echo "Deploy finished. Checking CORS for localhost:3001..."
curl -s -D - -o /dev/null "https://api.toursanatolia.com/tours" \
  -H "Origin: http://localhost:3001" | grep -i access-control-allow-origin || true
