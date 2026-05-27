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
npm ci
npm run build
pm2 restart turk-travel-be
pm2 status turk-travel-be
git rev-parse --short HEAD
EOF

echo "Deploy finished. Checking CORS for localhost:3001..."
curl -s -D - -o /dev/null "https://api.toursanatolia.com/tours" \
  -H "Origin: http://localhost:3001" | grep -i access-control-allow-origin || true
