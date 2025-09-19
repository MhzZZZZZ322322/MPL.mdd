# Moldova Pro League (MPL)

A full-stack esports tournament & content platform for the Moldovan Counter-Strike 2 scene. Migrated from Replit to a containerized Node + Vite + Drizzle stack.

## ✨ Features
- Multi-stage tournament system (groups, Swiss, playoffs)
- Match results, standings, automatic bracket progression
- Player, team, event, FAQ, site content management
- CS2 server status monitoring (GameDig)
- Discord webhook notifications (registrations, news, reviews)
- Contact form + SendGrid integration
- React + Tailwind + Radix UI + shadcn/ui frontend
- Drizzle ORM + Neon serverless PostgreSQL backend

## 🗂 Project Structure
```
client/            React + Vite application (root set via vite.config.ts)
server/            Express API, routing, DB layer, tournament logic
shared/            Drizzle schema & shared types
public/            Static assets served by Express
attached_assets/   Imported image/media assets
```

## 🚀 Quick Start
Clone and install:
```bash
npm install
```
Create a `.env` from the provided template:
```bash
cp .env.example .env
```
Edit `.env` and set at minimum:
```
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME
DISCORD_WEBHOOK_URL=...
```
Build & run:
```bash
npm run build
npm run start
```
Development (backend + vite frontend separately):
```bash
# Backend (ESM tsx runtime)
npm run dev
# In another terminal: Vite (from repo root, vite root points to client/)
npx vite
```
Open: http://localhost:5173 (frontend) — API served from the same host base at runtime (e.g. /api/* routes when using built version).

## 🧪 Environment Variables
See `.env.example` for the complete list. Key ones:
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection (Neon/Supabase/self-hosted) |
| PORT | No (default 8080) | API server port |
| DISCORD_WEBHOOK_URL | Optional | Team registration notifications |
| DISCORD_WEBHOOK_URL_NEWS | Optional | News publish notifications |
| DISCORD_WEBHOOK_URL322 | Optional | Detailed team notifications |
| SENDGRID_API_KEY | Optional | Email sending |
| ADMIN_USERNAME / ADMIN_PASSWORD | Optional | Simple admin auth (depends on `verifyAdminCredentials`) |

The application fails fast if `DATABASE_URL` is missing to prevent silent misconfiguration.

## 🗄 Database (Drizzle + Neon)
- Schema defined in `shared/schema.ts`.
- Runtime connection in `server/db.ts` (Neon serverless Pool + Drizzle).
- Add new tables via schema file then generate migrations (future enhancement: migrations folder).

## 🔗 Discord Webhooks
Set relevant webhook URLs to enable notifications. If unset, the app logs a warning and skips sending.

## 🛠 Scripts
| Script | Purpose |
|--------|---------|
| dev | Run backend in development (tsx) |
| build | Build frontend (Vite) + bundle backend (esbuild) |
| start | Run production bundle from `dist/` |
| check | Typecheck with tsc |
| db:push | Drizzle push (requires DATABASE_URL) |

## 🧩 Architecture Notes
- ESM throughout (`"type": "module"`).
- Aliases: `@` -> client/src, `@shared` -> shared, `@assets` -> attached_assets.
- Server routes consolidated in `server/routes.ts` via `registerRoutes(app)`.
- Frontend build output emitted to `dist/public` and statically served by Express.

## 🪲 Common Issues & Fixes
| Symptom | Cause | Fix |
|---------|-------|-----|
| Error: DATABASE_URL must be set | Missing env variable | Create `.env`, set DATABASE_URL |
| Discord warnings | Webhook vars unset | Provide webhook URLs or ignore |
| 404 on refresh in prod build | Missing SPA fallback | `server/index.ts` already serves `index.html` for `*` |

## 🤖 Automated Agent Rules
See `AGENT_RULES.md` for detailed contribution policies (security, env vars, dependencies, DB changes, etc.).

## 🐳 Deployment Ideas
- Docker: multi-stage build (future) bundling frontend + backend.
- Cloud Run / Fly.io / Render: supply env vars, run `npm run build` then `npm run start`.
- Neon DB for serverless Postgres.

## 📄 License
MIT (see `package.json`).

## 🙌 Acknowledgments
- Radix UI & shadcn/ui for composable components.
- Drizzle ORM for type-safe database layer.
- Neon for serverless PostgreSQL connectivity.
- GameDig for CS2 server querying.

---
For questions or improvements open an issue or PR.
