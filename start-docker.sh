#!/bin/bash

# 1. If an IP address is explicitly passed as first argument, use it
if [ -n "$1" ] && [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    export HOST_IP="$1"
    shift
fi

# 2. If HOST_IP is not set, auto-detect the real LAN IP
if [ -z "$HOST_IP" ]; then
    echo "Detecting local network IP address..."

    # Priority 1: Check for 192.168.* address (home/LAN)
    for ip in $(hostname -I); do
        if [[ "$ip" =~ ^192\.168\. ]]; then
            HOST_IP="$ip"
            break
        fi
    done

    # Priority 2: Any non-NAT (skip 10.0.2.15), non-Docker, non-loopback IP
    if [ -z "$HOST_IP" ]; then
        for ip in $(hostname -I); do
            if [[ ! "$ip" =~ ^127\. ]] && [[ ! "$ip" =~ ^10\.0\.2\. ]] && [[ ! "$ip" =~ ^172\.(1[6-9]|2[0-9]|3[0-1])\. ]] && [[ ! "$ip" =~ ^169\.254\. ]]; then
                HOST_IP="$ip"
                break
            fi
        done
    fi

    # Priority 3: Fallback to first IP or localhost
    if [ -z "$HOST_IP" ]; then
        HOST_IP=$(hostname -I | awk '{print $1}')
    fi
fi

if [ -z "$HOST_IP" ]; then
    echo "Could not detect IP address. Defaulting to localhost."
    export HOST_IP="localhost"
else
    echo "Using HOST_IP: $HOST_IP"
fi

# Bring down old containers if they exist
sudo docker compose down

# Pass any remaining arguments (like --build) to docker compose
sudo docker compose up -d "$@"

echo ""
echo "=================================================="
echo " Stack is up! Access from other devices using:"
echo " Directus / Angular:  http://$HOST_IP"
echo " Directus CMS Admin:  http://$HOST_IP:8055"
echo " Projects Dashboard:  http://$HOST_IP:3000"
echo " Sanity Studio:       http://$HOST_IP:3333"
echo " Decap Frontend:      http://$HOST_IP:5173"
echo "=================================================="
echo ""
