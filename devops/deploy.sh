#!/usr/bin/env bash
set -euo pipefail

HOST="${DEPLOY_HOST:-212.34.143.161}"
USER="${DEPLOY_USER:-root}"
APP_DIR="${DEPLOY_APP_DIR:-/opt/turk-travel-be}"

ssh "${USER}@${HOST}" bash -s <<EOF
set -euo pipefail
cd "${APP_DIR}"
git fetch origin main
git reset --hard origin/main

docker compose -f devops/docker-compose.prod.yml up -d --build --remove-orphans

docker compose -f devops/docker-compose.prod.yml ps
git rev-parse --short HEAD
EOF

echo "Deploy finished. Checking API..."
curl -s -o /dev/null -w "%{http_code}" https://api.toursanatolia.com/health || true
echo ""
