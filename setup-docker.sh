#!/bin/bash
set -e

echo "=== lanceCMS Docker Setup ==="

# 1. Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  echo "Docker installed. You may need to log out and back in for group changes."
fi

# 2. Generate .env with random passwords
if [ ! -f .env ]; then
  echo "Generating .env with random passwords..."
  cat > .env <<EOF
PG_ADMIN_PASSWORD=$(openssl rand -hex 24)
DB_PASSWORD=$(openssl rand -hex 24)
API_DB_PASSWORD=$(openssl rand -hex 24)
ADMIN_PASSWORD=$(openssl rand -hex 24)
SECRET=$(openssl rand -hex 24)
EOF
  chmod 600 .env
  echo "Created .env — save your ADMIN_PASSWORD if needed:"
  grep ADMIN_PASSWORD .env
fi

# 3. Build and start
echo "Building and starting containers..."
docker compose up -d --build

echo ""
echo "=== Setup complete! ==="
echo "Frontend:  http://<your-server-ip>"
echo "Directus:  http://<your-server-ip>:8055"
echo "API:       http://<your-server-ip>:3030/api/health"
echo ""
echo "Directus login: admin@example.com"
echo "Directus password: see ADMIN_PASSWORD in .env"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f        # view logs"
echo "  docker compose ps             # check status"
echo "  docker compose down           # stop all"
echo "  docker compose up -d          # restart"
