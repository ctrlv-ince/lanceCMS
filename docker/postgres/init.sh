#!/bin/bash
set -e

# Create application roles and database.
# This script runs once when the postgres container is first initialized.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
  CREATE ROLE directus_app LOGIN PASSWORD '${DB_PASSWORD}';
  CREATE ROLE learning_reader LOGIN PASSWORD '${API_DB_PASSWORD}';
  CREATE DATABASE directus_learning OWNER directus_app;
  GRANT CONNECT ON DATABASE directus_learning TO learning_reader;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname directus_learning <<-EOSQL
  GRANT USAGE ON SCHEMA public TO learning_reader;
EOSQL

echo "Database roles and grants created."
