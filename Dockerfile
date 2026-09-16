FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Install CMS dependencies ──
FROM base AS cms-deps
COPY cms/package.json cms/package-lock.json ./cms/
COPY package.json ./
RUN cd cms && npm ci

# ── Install Backend dependencies ──
FROM base AS backend-deps
COPY backend/package.json backend/package-lock.json ./backend/
COPY package.json ./
RUN cd backend && npm ci

# ── Install Frontend dependencies ──
FROM base AS frontend-deps
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY package.json ./
RUN cd frontend && npm ci

# ── Build Angular frontend for production ──
FROM frontend-deps AS frontend-build
COPY frontend/ ./frontend/
RUN cd frontend && npx ng build --configuration production

# ── Directus CMS runtime ──
FROM base AS directus
COPY --from=cms-deps /app/cms/node_modules ./cms/node_modules
COPY cms/ ./cms/
COPY scripts/ ./scripts/
COPY package.json ./
EXPOSE 8055
WORKDIR /app/cms
CMD ["npx", "directus", "bootstrap", "&&", "npx", "directus", "start"]

# ── Feathers backend runtime ──
FROM node:22-bookworm-slim AS backend
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/
COPY docker/ ./docker/
COPY package.json ./
RUN chmod +x /app/docker/*.sh
EXPOSE 3030
WORKDIR /app/backend
CMD ["node", "src/server.mjs"]

# ── Nginx frontend runtime ──
FROM nginx:alpine AS frontend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/frontend/dist/learning/browser /usr/share/nginx/html
EXPOSE 80

# ── Seed runner (one-shot) ──
FROM base AS seed
COPY --from=cms-deps /app/cms/node_modules ./cms/node_modules
COPY cms/ ./cms/
COPY scripts/ ./scripts/
COPY docker/ ./docker/
COPY package.json ./
RUN chmod +x /app/docker/*.sh
CMD ["/app/docker/seed-entrypoint.sh"]
