#!/bin/bash

echo "Detecting local IP address..."
export HOST_IP=$(hostname -I | awk '{print $1}')

if [ -z "$HOST_IP" ]; then
    echo "Could not detect IP address. Defaulting to localhost."
    export HOST_IP="localhost"
else
    echo "Starting Docker with HOST_IP: $HOST_IP"
fi

# Bring down old containers if they exist
sudo docker compose down

# Pass any additional arguments (like --build) to docker compose
sudo docker compose up -d "$@"

echo ""
echo "Directus is accessible at: http://$HOST_IP:8055"
echo "Angular Frontend is at:    http://$HOST_IP"
echo "Projects Dashboard is at:  http://$HOST_IP:3000"
echo ""
