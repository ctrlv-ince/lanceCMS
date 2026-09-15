# Directus learning project

## Interactive visual summaries

The existing topic cards keep their original appearance and open the full lessons at `/courses/:slug`. Each of the three full lessons adds a **View Interactive Summary** button that opens a separate visual overview:

- `http://127.0.0.1:4200/topics/microprocessor-history/summary` — selectable timeline eras, evolving CSS processor models, and a four-core illustration.
- `http://127.0.0.1:4200/topics/sap-1/summary` — component exploration, five opcode modules, and a step-by-step `LDA E → ADD F → OUT → HLT` demonstration with memory and register values.
- `http://127.0.0.1:4200/topics/sap-2/summary` — expanded architecture, capability cards, instruction families, and an 8-bit result demo showing sign and zero flags.

Each **Read Full Lesson** or **Back to Full Lesson** button opens the existing `/courses/:slug` page backed by Directus, including its presentation or complete course notes. **Back to Topics** returns to the course library. The earlier `/topics/:slug` summary URLs remain available for compatibility. Summary pages never render the CMS body, objectives, or slide viewer. They check the existing published-only course endpoint before displaying a summary; missing, unpublished, and offline lessons show an unavailable state with retry. The full lessons, original cards, navigation, footer, Directus content, and backend remain intact.

The implementation is in `frontend/src/app/topics`: shared CPU, architecture blocks/connections, data bus, summary cards, instruction modules, timeline, and motion directives. Short overview content lives in `topic-data.ts`, independently of the full reference in Directus. Processor models and diagrams are conceptual illustrations, and the SAP-1 trace is not a clock-accurate emulator. SAP-2's sign demo uses bit 7 and two’s complement; decrement wraps at eight bits.

Existing navigation and footer are reused. Components work with mouse, keyboard, and touch, layouts adapt to smaller screens, and animations respect reduced-motion preferences. No WebGL or new packages are required.

Start with `npm.cmd start` from the repository root. Validate with:

```powershell
npm.cmd run build
node frontend/verify-library.mjs
node frontend/verify-topics.mjs
```

The topic checks exercise publication failures, retry, cancellation when switching routes, register transfers through halt, and zero/sign boundary cases. The production build validates Angular templates. Visual browser QA remains manual when the Codex browser connection is unavailable; check all three topics on desktop and mobile, component focus/tap, the SAP-1 controls, timeline selection, the flag slider, and links to full lessons.

Historical milestones were checked against [Intel’s historical timeline](https://timeline.intel.com/). The SAP-2 flag behavior follows [University of Hawaiʻi teaching notes](https://esb.ics.hawaii.edu/2003fall.ics331/oct22.html).

This project uses all four requested technologies:

| Component | Folder | Local URL / port |
| --- | --- | --- |
| Angular 22 + Tailwind CSS 4 learning frontend | `frontend` | http://127.0.0.1:4200 |
| Feathers Core 5 REST backend | `backend` | http://127.0.0.1:3030/api/health |
| Directus 12 content administration | `cms` | http://127.0.0.1:8055 |
| PostgreSQL 18 database | `.directus-local/postgres` | `127.0.0.1:5433`, database `directus_learning` |

The Angular app calls `/api/courses` through its development proxy. Feathers reads published courses from PostgreSQL with a read-only database role. Directus manages the same `courses` table using its own account. Editing and publishing a course in Directus changes what appears when the Angular library is refreshed. Directus's own administration app is separate from the Angular student frontend.

## Start and stop

From this repository root in PowerShell:

```powershell
npm.cmd start
npm.cmd run status
npm.cmd run verify
npm.cmd stop
```

The startup script launches hidden background processes, stores their IDs, and checks readiness. Repeating start preserves course data and reuses running services. Stop only targets recorded project processes and this project's PostgreSQL cluster. Database files are preserved across restarts.

The original PostgreSQL Windows service on port 5432 is separate. This project uses installed PostgreSQL binaries to run its own cluster on 5433. Set `PG_BIN` if your PostgreSQL installation is in a different location.

For a fresh installation:

```powershell
npm.cmd install --prefix cms
npm.cmd install --prefix backend
npm.cmd install --prefix frontend
npm.cmd run setup
```

Node 22.23 or later and PostgreSQL 18 binaries are required for this configuration. Docker is not required.

## Directus login and content editing

- Email: `admin@example.com`
- Password: the generated `ADMIN_PASSWORD` value in `cms/.env`.
- Open **Content → Courses** in Directus.
- Edit the title, description, course notes, objectives, or category.
- Enable **Published**, save, and use **Refresh courses** in Angular.

The three courses now link to the corresponding PowerPoints in the shared **history 1 2** Drive folder. Microprocessor History uses `MICROPROCESSOR HISTORY (1).pptx`, SAP 1 uses `SAP-1 - GROUP 2.pptx`, and SAP 2 uses `Group 3_SAP 2.pptx`. Each topic page shows its original presentation in a Google Drive viewer, with a direct-link fallback. Starter notes remain available as a fallback for courses without presentation links.

The filename and Drive file ID are stored in the PostgreSQL course record and editable in Directus as **Presentation Title** and **Presentation Drive ID**. The file itself remains in Google Drive. Keep it shared with students. The import manifest is `scripts/data/directus-presentations.json`; `npm.cmd run import:presentations` fills missing links, and normal startup preserves subsequent Directus edits. This is an imported mapping, not continuous folder synchronization. Unpublished records are not exposed by Feathers.

After editing the Feathers source, use `npm.cmd run restart:api` to restart only the API.

Passwords are generated locally and kept in ignored environment files. No admin credentials are bundled into Angular. The services bind to the local machine. This is a local development setup, not a public production deployment.

## Checks and troubleshooting

```powershell
npm.cmd run build
npm.cmd --prefix backend run check
npm.cmd run verify
```

`verify` checks service health, Angular's API proxy, course reads, a temporary Directus create/publish/unpublish cycle, PostgreSQL persistence, draft visibility, and the backend's read-only database permissions. It deletes only its own temporary record.

Logs are in `.directus-local/angular.log`, `feathers.log`, `directus.log`, and `postgres.log`. A port conflict fails explicitly instead of terminating another application. Do not delete `.directus-local/postgres` unless you intentionally want to remove this project's database.

Reference documentation: [Directus CLI](https://docs.directus.io/self-hosted/cli), [Feathers Express transport](https://feathersjs.com/api/express), [Angular workspace configuration](https://angular.dev/reference/configs/workspace-config), [Tailwind with Angular](https://tailwindcss.com/docs/installation/framework-guides/angular).

## Enhanced course library

The existing Angular components now provide a collapsible desktop sidebar, a keyboard-accessible mobile drawer, collection statistics, category chips, searchable cards, loading skeletons, and retry/reset states. Routes and embedded PowerPoint viewers are preserved. No packages were added.

Run the focused component-state checks with:

```powershell
node frontend/verify-library.mjs
```

These exercise the real library component: title/description/category/filename search, combined filters, reset, concurrent refresh protection, error/retry, stable course numbering, optional timestamps, and image fallback. Use `npm.cmd run build` for Angular template/type validation and `npm.cmd run verify` for the live stack.

For manual UI checks, open http://127.0.0.1:4200 at desktop, tablet, and mobile widths. Check sidebar collapse, the mobile menu (including Escape and keyboard focus), Explore Courses scrolling, category/search combinations, Clear Search, Reset Filters, and each presentation. The automated browser connection timed out during this update, so visual verification remains manual.

Optional fields to add later in Directus **Courses**:

- `thumbnail`: a single image file relation to `directus_files`. The API builds a sized Directus asset URL. Grant public read access only to the intended course images; inaccessible images use the engineering artwork fallback.
- `thumbnail_alt`: image description for accessibility.
- `date_created` and `date_updated`: Directus creation/update timestamp fields. Latest Update uses the most recent available timestamp across the published courses; missing dates display Not available.
- Learner progress should live in a separate per-user course-progress collection with access controls. No progress is fabricated or displayed by this update.

The metadata mapping is optional: existing PostgreSQL records require no migration and remain editable as before. The frontend receives no Directus credentials.

If Angular's development watcher retains an old compilation error, run `node scripts/directus-stack.mjs restart-ui` to restart only the frontend while leaving Directus, Feathers, and PostgreSQL running.
