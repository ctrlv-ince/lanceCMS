-- Create roles and database for the lanceCMS stack.
-- This runs automatically when the PostgreSQL container starts for the first time.

-- Passwords are injected via environment variables in docker-compose.yml.
-- PostgreSQL's initdb scripts don't support env vars directly in SQL,
-- so we use the POSTGRES_USER as the superuser and create roles via
-- the entrypoint script instead. See init.sh for role creation.
