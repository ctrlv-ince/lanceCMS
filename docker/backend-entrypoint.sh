#!/bin/bash
# Generate backend .env from Docker environment variables, then start the server.
set -e

cat > /app/backend/.env <<EOF
PORT=${PORT:-3030}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DIRECTUS_URL=${DIRECTUS_URL}
EOF

# Patch the server to listen on 0.0.0.0 instead of 127.0.0.1 (required inside Docker)
sed -i 's/127\.0\.0\.1/0.0.0.0/g' /app/backend/src/server.mjs

exec node /app/backend/src/server.mjs
