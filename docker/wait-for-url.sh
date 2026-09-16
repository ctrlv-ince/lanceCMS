#!/bin/bash
# Wait for a service to respond on a URL.
# Usage: wait-for-it.sh <url> <timeout_seconds>
set -e

URL="$1"
TIMEOUT="${2:-90}"
ELAPSED=0

echo "Waiting for $URL (timeout: ${TIMEOUT}s)..."

while [ $ELAPSED -lt $TIMEOUT ]; do
  if curl -sf --max-time 3 "$URL" > /dev/null 2>&1; then
    echo "$URL is ready."
    exit 0
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

echo "Timed out waiting for $URL after ${TIMEOUT}s"
exit 1
