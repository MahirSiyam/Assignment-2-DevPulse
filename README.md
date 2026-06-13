# DevPulse API

A modular REST API for issue tracking built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL** (Neon). Uses raw SQL via `pg` — no ORM, no query builder, no SQL JOINs.

---

## Tech Stack

- Node.js + TypeScript (strict mode)
- Express.js
- PostgreSQL (Neon)
- `pg` — raw SQL with `pool.query()`
- bcrypt — password hashing
- jsonwebtoken — JWT authentication

---

## Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts              # Server bootstrap
├── config/                # Environment config
├── constants/             # HTTP status codes
├── database/
│   ├── schema.sql         # PostgreSQL schema
│   └── seeds/dev.sql      # Sample data
├── middleware/            # Auth, authorize, error handlers
├── modules/
│   ├── auth/              # Signup & login
│   └── issues/            # Issue CRUD
├── routes/                # Route aggregator
├── types/                 # Shared TypeScript types
└── utils/                 # Helpers (JWT, DB, errors)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database (Neon recommended)

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
PORT=5000

DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require

JWT_ACCESS_SECRET=your_access_token_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Database setup

Run these SQL files in your Neon SQL Editor (in order):

1. `src/database/schema.sql` — creates tables
2. `src/database/seeds/dev.sql` — inserts sample data (optional)

### 4. Start the server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

Server ready when you see:

```
Database successfully connected
Port is 5000
```

Health check: `GET http://localhost:5000/health`

---

## Seed Users

| Name  | Email               | Password        | Role        |
|-------|---------------------|-----------------|-------------|
| Alice | alice@devpulse.io   | `Password123!`  | contributor |
| Bob   | bob@devpulse.io     | `AdminPass456!` | maintainer  |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | `/auth/signup`     | No   | Register new user  |
| POST   | `/auth/login`      | No   | Login, get JWT     |

### Issues

| Method | Endpoint        | Auth | Who Can Access              |
|--------|-----------------|------|-----------------------------|
| GET    | `/issues`       | No   | Public                      |
| GET    | `/issues/:id`   | No   | Public                      |
| POST   | `/issues`       | Yes  | contributor, maintainer     |
| PATCH  | `/issues/:id`   | Yes  | contributor*, maintainer    |
| DELETE | `/issues/:id`   | Yes  | maintainer only             |

\* Contributor can only update **own** issues with status **open**.

### Query Parameters (GET /issues)

| Param    | Values                                      | Default  |
|----------|---------------------------------------------|----------|
| `sort`   | `newest`, `oldest`                          | `newest` |
| `type`   | `bug`, `feature_request`                    | —        |
| `status` | `open`, `in_progress`, `resolved`           | —        |

---

## Authentication

Protected routes require the JWT in the Authorization header:

```
Authorization: <your_jwt_token>
```

JWT payload:

```json
{
  "id": 1,
  "name": "Alice",
  "role": "contributor"
}
```

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Issue fetched successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required"
  }
}
```

### HTTP Status Codes

| Code | Meaning              |
|------|----------------------|
| 400  | Validation error     |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not found            |
| 409  | Conflict             |
| 500  | Internal server error|

---

## Example Requests

### Signup

```bash
POST /api/auth/signup
```

```json
{
  "name": "Rahim",
  "email": "rahim@devpulse.io",
  "password": "Password123!",
  "role": "contributor"
}
```

### Login

```bash
POST /api/auth/login
```

```json
{
  "email": "alice@devpulse.io",
  "password": "Password123!"
}
```

### Create Issue

```bash
POST /api/issues
Authorization: <token>
```

```json
{
  "title": "App crashes on startup",
  "description": "The app crashes immediately after launch on Android 13.",
  "type": "bug"
}
```

### List Issues (with filters)

```bash
GET /api/issues?sort=newest&type=bug&status=open
```

### Update Issue

```bash
PATCH /api/issues/1
Authorization: <token>
```

```json
{
  "title": "Updated title here",
  "description": "Updated description with at least twenty characters."
}
```

### Delete Issue (maintainer only)

```bash
DELETE /api/issues/1
Authorization: <bob_token>
```

---

## Permission Rules

| Action        | Maintainer | Contributor                |
|---------------|------------|----------------------------|
| Create issue  | Yes        | Yes                        |
| View issues   | Yes        | Yes (public)               |
| Update issue  | Any issue  | Own issue, status = open   |
| Delete issue  | Yes        | No                         |

---

## Scripts

| Command           | Description                    |
|-------------------|--------------------------------|
| `npm run dev`     | Start dev server (hot reload)  |
| `npm run build`   | Compile TypeScript             |
| `npm start`       | Run production build           |
| `npm run typecheck` | Type-check without emit      |
| `npm run lint`    | Lint source files              |

---

## Architecture Notes

- **Modular** — each feature is a self-contained module (routes → controller → service → repository)
- **Raw SQL only** — all queries use `pool.query()`, no ORM
- **No SQL JOINs** — reporter data fetched separately and merged in the service layer
- **Centralized errors** — `AppError` + `globalErrorHandler` for consistent responses
- **Strict TypeScript** — full type safety across the codebase

---

## License

MIT
