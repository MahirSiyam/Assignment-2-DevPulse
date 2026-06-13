import dotenv from 'dotenv';

// Local dev: load .env (skipped in production — platform env vars take precedence)
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function parseIntEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer`);
  }
  return parsed;
}

export const config = {
  env: optionalEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  port: parseIntEnv('PORT', 3000),
  app: {
    name: 'DevPulse API',
  },
  api: {
    prefix: '/api/v1',
  },
  db: {
    url: requireEnv('DATABASE_URL'),
    pool: {
      max: 10,
      idleTimeoutMs: 30_000,
      connectionTimeoutMs: 5_000,
    },
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    accessExpiresIn: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  bcrypt: {
    saltRounds: 12,
  },
  cors: {
    origin: 'http://localhost:5173',
  },
  log: {
    level: optionalEnv('LOG_LEVEL', 'debug') as 'debug' | 'info' | 'warn' | 'error',
  },
} as const;

export type Config = typeof config;
