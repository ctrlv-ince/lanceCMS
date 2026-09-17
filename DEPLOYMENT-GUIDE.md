# lanceCMS — Full Deployment & Operations Guide

> **Author:** Lance B. David  
> **Last Updated:** September 16, 2026  
> **Host OS:** Windows 10/11  
> **Server:** Ubuntu Server (VirtualBox VM)  
> **Deployment:** Docker Compose

---

\
\


## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [All Services & Ports](#all-services--ports)
3. [Credentials](#credentials)
4. [Prerequisites](#prerequisites)
5. [VirtualBox VM Setup](#virtualbox-vm-setup)
6. [First-Time Server Setup](#first-time-server-setup)
7. [Building & Starting Everything](#building--starting-everything)
8. [Port Forwarding (VirtualBox NAT)](#port-forwarding-virtualbox-nat)
9. [Day-to-Day Usage](#day-to-day-usage)
10. [Useful Docker Commands](#useful-docker-commands)
11. [Troubleshooting](#troubleshooting)
12. [File Structure Reference](#file-structure-reference)

---

## Architecture Overview

lanceCMS is a multi-CMS workspace that runs **9 Docker containers** inside an Ubuntu Server virtual machine on VirtualBox. The stack includes:

- **Directus CMS** — Headless CMS with PostgreSQL, Angular frontend, and Feathers.js backend
- **Sanity Studio** — Cloud-based structured content CMS
- **Decap CMS** — Git-based CMS with SvelteKit frontend and PocketBase backend
- **Projects Dashboard** — Next.js dashboard that links to all CMS projects

```
┌─────────────────────── Windows Host ───────────────────────┐
│                                                            │
│   Browser → http://localhost:<port>                        │
│       │                                                    │
│       ▼ (VirtualBox NAT Port Forwarding)                   │
│  ┌─────────────── Ubuntu VM (VirtualBox) ──────────────┐   │
│  │                                                      │   │
│  │  Docker Compose                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐                 │   │
│  │  │  PostgreSQL   │  │   Directus    │                 │   │
│  │  │  :5432        │◄─│   :8055       │                 │   │
│  │  └──────────────┘  └───────┬───────┘                 │   │
│  │                            │                          │   │
│  │  ┌──────────────┐  ┌──────┴────────┐  ┌───────────┐  │   │
│  │  │   Seed       │  │   Backend     │  │  Frontend  │  │   │
│  │  │  (one-shot)  │  │   :3030       │  │  :80       │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐                 │   │
│  │  │  Dashboard   │  │ Sanity Studio │                 │   │
│  │  │  :3000       │  │   :3333       │                 │   │
│  │  └──────────────┘  └───────────────┘                 │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌───────────────┐                 │   │
│  │  │ Decap Front  │  │  PocketBase   │                 │   │
│  │  │  :5173       │  │   :8090       │                 │   │
│  │  └──────────────┘  └───────────────┘                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## All Services & Ports

| Service | Container Name | Port | URL | Description |
|---|---|---|---|---|
| **PostgreSQL 18** | `lancecms-postgres-1` | `5433:5432` | — | Shared database for Directus & Backend |
| **Directus CMS** | `lancecms-directus-1` | `8055:8055` | http://localhost:8055 | Headless CMS admin panel |
| **Seed Runner** | `lancecms-seed-1` | — | — | One-shot container that creates admin user & imports data |
| **Feathers Backend** | `lancecms-backend-1` | `3030:3030` | http://localhost:3030/api/health | REST API for the Angular frontend |
| **Angular Frontend** | `lancecms-frontend-1` | `80:80` | http://localhost | Course learning application (Nginx) |
| **Projects Dashboard** | `lancecms-projects-dashboard-1` | `3000:3000` | http://localhost:3000 | Next.js CMS comparison dashboard |
| **Sanity Studio** | `lancecms-sanity-studio-1` | `3333:3333` | http://localhost:3333 | Sanity CMS editor |
| **Decap Frontend** | `lancecms-decap-frontend-1` | `5173:5173` | http://localhost:5173 | SvelteKit + Decap CMS |
| **PocketBase** | `lancecms-pocketbase-1` | `8090:8090` | http://localhost:8090/_/ | PocketBase admin & API |

---

## Credentials

| CMS | Email | Password | Notes |
|---|---|---|---|
| **Directus** | `admin@example.com` | `ADMIN_PASSWORD` from `.env` | Auto-created by seed container |
| **Sanity Studio** | *(your sanity.io account)* | *(your sanity.io password)* | Uses cloud auth (Google/GitHub/email) |
| **PocketBase** | *(you choose)* | *(you choose)* | Create admin on first visit to `/_/` |
| **Decap Frontend** | *(PocketBase account)* | *(PocketBase password)* | Uses PocketBase for authentication |

### How to view your Directus password:
```bash
# On the Ubuntu server:
source .env && echo $ADMIN_PASSWORD
```

### How to verify the password works (bypassing the browser):
```bash
source .env
curl -s -X POST http://localhost:8055/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"admin@example.com\",\"password\":\"${ADMIN_PASSWORD}\"}"
```
If you see `{"data":{"access_token":"..."}}`, the password is correct.

---

## Prerequisites

Install these on your **Windows** machine before starting:

1. **[VirtualBox](https://www.virtualbox.org/wiki/Downloads)** — Virtual machine hypervisor
2. **[Ubuntu Server ISO](https://ubuntu.com/download/server)** — For the VM guest OS
3. **[Git](https://git-scm.com/downloads)** — Version control
4. **[Node.js 22](https://nodejs.org/)** — (Optional, only if you want to run things locally on Windows too)

---

## VirtualBox VM Setup

### Create the Virtual Machine
1. Open VirtualBox → **New**
2. Name: `LanceCMS1`, Type: `Linux`, Version: `Ubuntu (64-bit)`
3. RAM: **4096 MB** (minimum 2048 MB)
4. Hard disk: **Create a virtual hard disk now** → VDI → Dynamically allocated → **40 GB** minimum
5. Mount the Ubuntu Server ISO to the optical drive
6. Install Ubuntu Server (follow the prompts, create user `Lance`)

### Enable SSH Access (Optional but recommended)
During Ubuntu install, check **"Install OpenSSH server"**. This lets you SSH into the VM from Windows instead of using the tiny VirtualBox console window.

---

## First-Time Server Setup

### 1. Add Swap Space (Critical for builds)
The Angular production build is very memory-hungry. Add swap space to prevent the build from hanging:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make it permanent (survives reboot):
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```
**Log out and log back in** for the group change to take effect.

### 3. Clone the Repository
```bash
git clone <your-repo-url> ~/lanceCMS
cd ~/lanceCMS
```

### 4. Generate the `.env` File
The automated setup script handles this, but you can also do it manually:
```bash
bash setup-docker.sh
```

This creates a `.env` file with random passwords:
```
PG_ADMIN_PASSWORD=<random-hex>
DB_PASSWORD=<random-hex>
API_DB_PASSWORD=<random-hex>
ADMIN_PASSWORD=<random-hex>
SECRET=<random-hex>
```

> [!CAUTION]
> The `.env` file is **gitignored** and contains all your secrets. If you delete the `.env` and rebuild, you'll get NEW passwords that don't match the old database. You must either keep the `.env` or wipe the database volumes too (`docker compose down -v`).

---

## Building & Starting Everything

### First Build (from scratch)
```bash
cd ~/lanceCMS
sudo docker compose up -d --build
```

This will:
1. Build all Docker images (Angular, Directus, Backend, Seed, Dashboard, Sanity, Decap)
2. Start PostgreSQL and wait for it to be healthy
3. Start Directus and run `npx directus bootstrap`
4. Run the Seed container (creates admin user, imports course data)
5. Start the Backend, Frontend, Dashboard, Sanity Studio, Decap, and PocketBase

**First build takes 10-20 minutes** depending on your internet speed and VM resources.

### Subsequent Starts (no rebuild needed)
```bash
sudo docker compose up -d
```

### Rebuild a Specific Service
```bash
sudo docker compose up -d --build <service-name>
# Example:
sudo docker compose up -d --build sanity-studio
```

### Full Clean Rebuild (wipes database!)
```bash
sudo docker compose down -v          # Stop everything and delete all data
sudo docker system prune -a -f       # Remove all cached images
sudo docker compose up -d --build    # Rebuild from scratch
```

> [!WARNING]
> `docker compose down -v` deletes all database volumes. Your Directus content, PocketBase data, and PostgreSQL databases will be permanently erased.

---

## Port Forwarding (VirtualBox NAT)

Since the VM uses NAT networking, you must create port forwarding rules so your Windows browser can reach the services inside the VM.

### Set Up All Port Forwarding Rules (run on Windows PowerShell)
```powershell
$vbm = "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
$vm  = "LanceCMS1"   # ← Change this to your actual VM name

& $vbm controlvm $vm natpf1 "ssh,tcp,,22,,22"
& $vbm controlvm $vm natpf1 "http,tcp,,80,,80"
& $vbm controlvm $vm natpf1 "directus,tcp,,8055,,8055"
& $vbm controlvm $vm natpf1 "backend,tcp,,3030,,3030"
& $vbm controlvm $vm natpf1 "dashboard,tcp,,3000,,3000"
& $vbm controlvm $vm natpf1 "sanity,tcp,,3333,,3333"
& $vbm controlvm $vm natpf1 "decap,tcp,,5173,,5173"
& $vbm controlvm $vm natpf1 "pocketbase,tcp,,8090,,8090"
& $vbm controlvm $vm natpf1 "pgdb,tcp,,5433,,5433"
```

> [!NOTE]
> You only need to run these **once**. The rules persist across VM restarts. If you get an error saying the rule already exists, that means it's already set up.

### Remove a Port Forwarding Rule (if needed)
```powershell
& $vbm controlvm $vm natpf1 delete "rulename"
```

### SSH Into the VM from Windows
```powershell
ssh Lance@localhost -p 22
```

---

## Day-to-Day Usage

### Starting Your Work Session
1. Open VirtualBox and start `LanceCMS1` (or resume from saved state)
2. All containers auto-start because they have `restart: unless-stopped`
3. Open your browser and go to any of the URLs listed in the ports table

### Ending Your Work Session
When closing the VM window, choose **"Save the machine state"**. This hibernates the VM and preserves everything exactly as-is. Next time you start it, all containers will still be running.

You can also save state from the command line:
```powershell
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" controlvm "LanceCMS1" savestate
```

### Pushing Code Changes from Windows to the Server
1. Make your changes on Windows
2. Commit and push to Git:
   ```powershell
   cd c:\lanceCMS
   git add -A && git commit -m "your message" && git push
   ```
3. Pull on the Ubuntu server:
   ```bash
   cd ~/lanceCMS && git pull
   ```
4. Rebuild the affected service:
   ```bash
   sudo docker compose up -d --build <service-name>
   ```

---

## Useful Docker Commands

```bash
# Check status of all containers
sudo docker compose ps -a

# View logs for a specific service (live follow)
sudo docker compose logs -f directus

# View last 50 lines of a service's logs
sudo docker compose logs --tail 50 seed

# Stop everything (keeps data)
sudo docker compose down

# Stop everything AND delete all data
sudo docker compose down -v

# Restart a single service
sudo docker compose restart directus

# Rebuild and restart a single service
sudo docker compose up -d --build backend

# Open a shell inside a running container
sudo docker compose exec directus sh

# Check disk usage by Docker
sudo docker system df

# Clean up unused Docker resources (images, caches)
sudo docker system prune -a -f
```

---

## Troubleshooting

### "No space left on device"
The VM's virtual hard disk is full. You need to expand it.

**Step 1 — Resize the VDI (on Windows PowerShell):**
```powershell
# First, shut down the VM
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" controlvm "LanceCMS1" poweroff

# Find your .vdi file
Get-ChildItem -Path "$env:USERPROFILE\VirtualBox VMs" -Recurse -Filter *.vdi

# Resize to 40GB (40960 MB) — adjust the path to your actual .vdi file
& "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" modifyhd "C:\Users\Lance\VirtualBox VMs\LanceCMS1\LanceCMS1.vdi" --resize 40960
```

**Step 2 — Expand the partition inside Ubuntu:**
```bash
sudo apt-get install -y cloud-guest-utils
sudo growpart /dev/sda 2
sudo resize2fs /dev/sda2

# Verify:
df -h /
```

---

### "GPG error: invalid signature" during Docker build
This happens when the VM's clock drifts out of sync (common after sleep/pause). The fix is to reboot:

```bash
sudo reboot
```

Then rebuild:
```bash
sudo docker compose up -d --build
```

---

### "Directus admin sign-in failed" / Wrong password
The password in the `.env` file doesn't match what's stored in the database. This usually happens when the `.env` was regenerated but the old database volume survived.

**Fix — Wipe the database and let the seed recreate it:**
```bash
sudo docker compose down -v
sudo docker compose up -d --build
```

**Verify the password works via curl:**
```bash
source .env
curl -s -X POST http://localhost:8055/auth/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"admin@example.com\",\"password\":\"${ADMIN_PASSWORD}\"}"
```

> [!TIP]
> If `curl` returns a token but the browser still rejects the password, try an **Incognito window**. Your browser may be auto-filling an old password or you may have trailing whitespace from copy-paste.

---

### Docker build hangs / takes forever
The Angular production build (`npx ng build`) consumes a lot of RAM. If the VM runs out of memory, the build will hang indefinitely.

**Fix — Add swap space:**
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

### Sanity Studio: "Unsupported engine" errors
Sanity's latest packages require **Node.js >= 22.12**. Make sure the Sanity Dockerfile uses `node:22-alpine`, not `node:20-alpine`.

---

### A service won't start / keeps restarting
```bash
# Check what's happening:
sudo docker compose logs <service-name> --tail 50

# Force recreate:
sudo docker compose up -d --force-recreate <service-name>
```

---

### Port forwarding not working
1. Verify the rule exists:
   ```powershell
   & "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" showvminfo "LanceCMS1" | Select-String "NIC"
   ```
2. Make sure nothing on Windows is already using that port:
   ```powershell
   netstat -ano | findstr ":8055"
   ```
3. If another process is using the port, kill it or change the host port in the forwarding rule.

---

## File Structure Reference

```
lanceCMS/
├── .dockerignore              # Files excluded from Docker build context
├── .env                       # Generated secrets (gitignored)
├── .env.docker.example        # Template for .env
├── Dockerfile                 # Multi-stage Dockerfile (Directus, Backend, Frontend, Seed)
├── docker-compose.yml         # All 9 services defined here
├── setup-docker.sh            # Automated Docker setup script
├── setup-ubuntu.sh            # Automated bare-metal Ubuntu setup script
│
├── docker/
│   ├── nginx.conf             # Nginx config for Angular frontend
│   ├── postgres/init.sh       # PostgreSQL initialization (creates DBs & users)
│   ├── seed-entrypoint.sh     # Seed script (admin user + course data import)
│   └── backend-entrypoint.sh  # Backend startup script
│
├── cms/                       # Directus CMS
├── backend/                   # Feathers.js REST API
├── frontend/                  # Angular + Tailwind frontend
├── scripts/                   # Setup & seed scripts (Node.js)
│
├── David/                     # Next.js Projects Dashboard
│   └── Dockerfile
│
├── sanity-cms/                # Sanity Studio
│   └── Dockerfile
│
└── decap-svelte/              # Decap CMS project
    ├── frontend/              # SvelteKit frontend
    │   └── Dockerfile
    └── backend/               # PocketBase (runs via Docker image, no Dockerfile needed)
```
