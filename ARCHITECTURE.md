# DevPulse API — Architecture

Production-ready Node.js + TypeScript + Express + PostgreSQL backend with modular architecture and raw SQL only.

---

## 1. Folder Structure

```
DevPulse/
├── src/
│   ├── app.ts                   # Express application factory
│   ├── server.ts                # HTTP server bootstrap & graceful shutdown
│   ├── config/
│   │   ├── index.ts             # Environment variable loading & validation
│   │   ├── database.ts          # pg Pool + query() helper
│   │   └── auth.ts              # JWT & bcrypt configuration constants
│   ├── database/
│   │   ├── schema.sql             # PostgreSQL schema (run via Neon SQL Editor)
│   │   └── seeds/
│   │       └── dev.sql            # Development seed data
│   ├── middleware/
│   │   ├── index.ts             # Middleware barrel exports
│   │   ├── asyncHandler.ts      # Async route error wrapper
│   │   ├── auth.ts              # JWT authentication guard (placeholder)
│   │   ├── errorHandler.ts      # Global error handler + ApiError class
│   │   ├── notFoundHandler.ts   # 404 handler
│   │   └── validate.ts          # Request validation middleware (placeholder)
│   ├── modules/
│   │   └── _template/           # Copy this when adding a new domain module
│   │       ├── README.md
│   │       ├── index.ts
│   │       ├── template.routes.ts
│   │       ├── template.controller.ts
│   │       ├── template.service.ts
│   │       ├── template.repository.ts
│   │       ├── template.types.ts
│   │       └── template.validators.ts
│   ├── routes/
│   │   └── index.ts             # Central API router — mounts module routes
│   ├── types/
│   │   ├── express.d.ts         # Express Request augmentation
│   │   └── index.ts             # Shared application types
│   └── utils/
│       ├── index.ts             # Utility barrel exports
│       └── logger.ts            # Structured JSON logger
├── .env.example                 # Environment variable template
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 2. File Structure & Responsibilities

### Entry Points

| File | Responsibility |
|------|----------------|
| `src/server.ts` | Starts HTTP server, wires graceful shutdown (SIGTERM/SIGINT), drains DB pool |
| `src/app.ts` | Creates Express app: security middleware, parsers, health check, routes, error handlers |

### `config/`

| File | Responsibility |
|------|----------------|
| `index.ts` | Loads `.env`, validates required vars, exports typed `config` object |
| `database.ts` | Creates `pg` connection pool, exports `pool` and typed `query()` wrapper |
| `auth.ts` | Exports JWT and bcrypt config derived from environment |

### `middleware/`

| File | Responsibility |
|------|----------------|
| `asyncHandler.ts` | Wraps async route handlers to forward errors to `errorHandler` |
| `auth.ts` | Verifies JWT tokens, attaches `userId` to request (to be implemented) |
| `errorHandler.ts` | Catches all errors, returns consistent JSON error responses |
| `notFoundHandler.ts` | Returns 404 for unmatched routes |
| `validate.ts` | Validates request body/params/query against schemas (to be implemented) |

### `modules/`

Each feature domain lives in its own folder (copy `_template/`). Layers:

| Layer | File | Responsibility |
|-------|------|----------------|
| Routes | `*.routes.ts` | Defines HTTP endpoints, applies middleware |
| Controller | `*.controller.ts` | Parses request, calls service, sends response |
| Service | `*.service.ts` | Business logic, orchestration, no SQL |
| Repository | `*.repository.ts` | **Only layer that touches the database** via `pool.query()` |
| Types | `*.types.ts` | Interfaces, DTOs, DB row shapes |
| Validators | `*.validators.ts` | Input validation schemas per endpoint |

### `routes/`

| File | Responsibility |
|------|----------------|
| `index.ts` | Aggregates all module routers under `API_PREFIX` (e.g. `/api/v1`) |

### `utils/`

| File | Responsibility |
|------|----------------|
| `logger.ts` | Structured JSON logging with configurable log level |
| `index.ts` | Re-exports shared utilities |

### `database/`

| File | Responsibility |
|------|----------------|
| `schema.sql` | Full PostgreSQL schema — run manually in Neon SQL Editor |
| `seeds/dev.sql` | Development seed data — run manually after schema |

### `types/`

| File | Responsibility |
|------|----------------|
| `express.d.ts` | Augments Express `Request` with `userId` etc. |
| `index.ts` | Shared types: `ApiResponse`, `PaginatedResult`, etc. |

---

## 3. Request Flow

```
HTTP Request
    │
    ▼
server.ts ──► app.ts
                │
                ├── helmet, cors, body parsers
                │
                ▼
            routes/index.ts
                │
                ▼
            module/*.routes.ts
                │
                ├── middleware (auth, validate)
                │
                ▼
            module/*.controller.ts
                │
                ▼
            module/*.service.ts
                │
                ▼
            module/*.repository.ts
                │
                ▼
            pool.query() ──► PostgreSQL
                │
                ▼
            JSON Response ◄── errorHandler (on failure)
```

---

## 4. Environment Variables

**No `.env` file is used.** Secrets are read from system/platform environment variables only.
`.env.example` is a reference — do not copy it to `.env`.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | HTTP server port |
| `DATABASE_URL` | **Yes** | — | Neon PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Access token signing secret |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token TTL |
| `JWT_REFRESH_SECRET` | **Yes** | — | Refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token TTL |
| `NODE_ENV` | No | `development` | Set by platform in production |
| `LOG_LEVEL` | No | `debug` | `debug` \| `info` \| `warn` \| `error` |

Non-secret values (`API_PREFIX`, `CORS_ORIGIN`, `BCRYPT_SALT_ROUNDS`, pool settings) are hardcoded in `config/index.ts`.

---

## 5. Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP framework |
| `pg` | PostgreSQL client (raw SQL via `pool.query()`) |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT creation & verification |
| `cors` | Cross-origin resource sharing |
| `helmet` | Security HTTP headers |

---

## 6. Dev Dependencies

| Package | Purpose |
|---------|---------|
| `typescript` | TypeScript compiler |
| `tsx` | Dev-time TS execution & watch mode |
| `@types/node` | Node.js type definitions |
| `@types/express` | Express type definitions |
| `@types/pg` | pg type definitions |
| `@types/bcrypt` | bcrypt type definitions |
| `@types/jsonwebtoken` | jsonwebtoken type definitions |
| `@types/cors` | cors type definitions |
| `eslint` + `@typescript-eslint/*` | Linting |
| `prettier` | Code formatting |
| `rimraf` | Cross-platform `rm -rf` for clean script |

---

## 7. npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `tsx watch src/server.ts` | Start dev server with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/server.js` | Run compiled production build |
| `start:prod` | `NODE_ENV=production node dist/server.js` | Run with production env |
| `typecheck` | `tsc --noEmit` | Type-check without emitting files |
| `lint` | `eslint src --ext .ts` | Lint source files |
| `lint:fix` | `eslint src --ext .ts --fix` | Auto-fix lint issues |
| `format` | `prettier --write "src/**/*.ts"` | Format all source files |
| `format:check` | `prettier --check "src/**/*.ts"` | Check formatting |
| `clean` | `rimraf dist` | Remove build output |

---

## 8. Design Principles

- **No ORM** — all database access through `pool.query()` in repository files
- **Strict TypeScript** — `strict: true` with additional safety flags enabled
- **Modular** — each domain is a self-contained vertical slice under `modules/`
- **Separation of concerns** — routes → controller → service → repository
- **Config centralization** — all env vars validated once in `config/index.ts`
- **Graceful shutdown** — server drains connections and closes DB pool on SIGTERM/SIGINT

---

## 9. Getting Started

Set environment variables in your shell or platform (Neon dashboard, VS Code launch config, etc.):

```bash
# PowerShell example
$env:DATABASE_URL="postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require"
$env:JWT_ACCESS_SECRET="your_access_secret"
$env:JWT_REFRESH_SECRET="your_refresh_secret"
$env:PORT="3000"

npm install
npm run dev
```

**Database setup** — run SQL files in Neon SQL Editor:
1. `src/database/schema.sql`
2. `src/database/seeds/dev.sql` (optional, for dev data)

Health check: `GET http://localhost:3000/health`
