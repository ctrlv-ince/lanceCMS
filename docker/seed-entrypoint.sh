#!/bin/bash
# Seed script that runs inside the seed container.
# Waits for Directus, then runs seed + presentation import + grants.
set -e

cd /app

# Patch seed scripts to use Docker service hostname instead of localhost
sed -i 's|http://127\.0\.0\.1:8055|http://directus:8055|g' scripts/seed-directus.mjs
sed -i 's|http://127\.0\.0\.1:8055|http://directus:8055|g' scripts/import-directus-presentations.mjs

# Wait for Directus to be fully ready
/app/docker/wait-for-url.sh http://directus:8055/server/ping 120

echo "Directus is ready. Running seed scripts..."

# Seed courses collection and starter data
node scripts/seed-directus.mjs

echo "Seeding complete."
