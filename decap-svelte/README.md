# DecapCMS + SvelteKit + PocketBase + SQLite

A fully self-contained CMS project — completely independent from the Directus and Sanity setups in the parent folder.

## Tech Stack

| Layer | Technology | Port |
|-------|-----------|------|
| **Frontend** | SvelteKit 5 + TypeScript | `5173` |
| **CMS Admin** | Decap CMS 3.x | `5173/admin/` |
| **Backend / API** | PocketBase | `8090` |
| **Database** | SQLite (embedded in PocketBase) | — |

## Project Structure

```
decap-svelte/
├── start.bat                    ← Run this to start everything
├── frontend/                    ← SvelteKit app
│   ├── src/
│   │   ├── lib/
│   │   │   └── pocketbase.ts   ← PocketBase client + types
│   │   └── routes/
│   │       ├── +layout.svelte  ← Navbar + footer layout
│   │       ├── +page.svelte    ← Homepage with stats + content
│   │       ├── posts/          ← Posts listing + detail
│   │       └── courses/        ← Courses listing
│   └── static/
│       └── admin/
│           ├── index.html      ← Decap CMS admin panel
│           └── config.yml      ← Decap CMS collections config
└── backend/
    ├── pocketbase.exe           ← Download this! (see below)
    ├── pb_schema.json           ← Collection schemas to import
    └── start-pocketbase.bat    ← Start PocketBase only
```

## Quick Start

### Step 1: Download PocketBase

Download the **Windows AMD64** binary from:  
👉 https://github.com/pocketbase/pocketbase/releases

Extract `pocketbase.exe` and place it in `decap-svelte/backend/`.

### Step 2: Start Everything

Double-click **`start.bat`** in the `decap-svelte/` folder.

This launches:
- PocketBase at `http://localhost:8090`
- SvelteKit at `http://localhost:5173`

### Step 3: Set Up PocketBase Admin

1. Open `http://localhost:8090/_/`
2. Create your admin account (first time only)
3. Import the schema: **Settings → Import collections** → paste `backend/pb_schema.json`
4. This creates the `posts`, `pages`, and `courses` collections

### Step 4: Open Decap CMS Admin

Navigate to `http://localhost:5173/admin/`

This is the Decap CMS editor — use it to create and manage:
- 📝 **Posts** — Blog articles with markdown body, tags, images
- 📄 **Pages** — Static pages (About, Contact, etc.)
- 🎓 **Courses** — Course listings with level, instructor, cover image

> **Note:** In local dev mode, Decap CMS uses `test-repo` backend — changes are saved locally in the `content/` folder as Markdown files. To sync these with PocketBase, you'll need to implement a sync script or switch to using PocketBase's own admin at `/_/`.

## Content Management Options

### Option A: Use Decap CMS (Git-based, local files)
- Edit content at `/admin/`
- Content saved as `.md` files in `frontend/content/`
- Use `+page.server.ts` to read local files at build time
- Best for: static sites, blogs

### Option B: Use PocketBase Admin (live database)
- Edit content at `http://localhost:8090/_/`
- Content stored in SQLite via REST API
- Frontend fetches live from PocketBase API
- Best for: dynamic apps, user-submitted content ✅ **(Currently active)**

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | SvelteKit frontend |
| `http://localhost:5173/admin/` | Decap CMS admin panel |
| `http://localhost:5173/posts` | Posts listing |
| `http://localhost:5173/courses` | Courses listing |
| `http://localhost:8090/_/` | PocketBase admin dashboard |
| `http://localhost:8090/api/` | PocketBase REST API |

## API Examples

```bash
# List published posts
GET http://localhost:8090/api/collections/posts/records?filter=status='published'

# Get a post by slug
GET http://localhost:8090/api/collections/posts/records?filter=slug='my-post'

# List published courses
GET http://localhost:8090/api/collections/courses/records?filter=published=true
```

## Relationship to Other CMS Projects

```
David/
├── David/          → Next.js 14 frontend (separate)
├── cms/            → Directus + PostgreSQL (separate)
├── sanity-cms/     → Sanity CMS (separate)
└── decap-svelte/   → THIS PROJECT ← Decap + SvelteKit + PocketBase + SQLite
```

All four are completely independent and can run simultaneously on different ports.
