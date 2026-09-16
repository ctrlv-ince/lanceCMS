#!/bin/bash
set -e

echo "=== lanceCMS Ubuntu Setup ==="

# 1. Node.js 22
echo "Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. PostgreSQL 18
echo "Installing PostgreSQL 18..."
sudo apt-get install -y curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt-get update
sudo apt-get install -y postgresql-18

# 3. Build tools for native modules
echo "Installing build tools..."
sudo apt-get install -y build-essential python3

# 4. Set PG_BIN
export PG_BIN=/usr/lib/postgresql/18/bin
echo 'export PG_BIN=/usr/lib/postgresql/18/bin' >> ~/.bashrc

# 5. Install npm dependencies
echo "Installing npm dependencies..."
cd "$(dirname "$0")"
npm install --prefix cms
npm install --prefix backend
npm install --prefix frontend

# 6. Run project setup
echo "Running project setup..."
npm run setup

echo ""
echo "=== Setup complete! ==="
echo "Run: npm start"
echo "Frontend: http://127.0.0.1:4200"
echo "Directus: http://127.0.0.1:8055"
echo "API:      http://127.0.0.1:3030/api/health"
