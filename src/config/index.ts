import dotenv from 'dotenv';
import { validateEnv } from '../utils/validateEnv';

dotenv.config();

const env = validateEnv();

export const config = {
  env: env.env,
  port: env.port,
  app: {
    name: 'DevPulse API',
  },
  api: {
    prefix: '/api',
  },
  db: {
    url: env.db.url,
    pool: {
      max: 10,
      idleTimeoutMs: 30_000,
      connectionTimeoutMs: 5_000,
    },
  },
  jwt: {
    accessSecret: env.jwt.accessSecret,
    accessExpiresIn: env.jwt.accessExpiresIn,
    refreshSecret: env.jwt.refreshSecret,
    refreshExpiresIn: env.jwt.refreshExpiresIn,
  },
  bcrypt: {
    saltRounds: 10,
  },
  cors: {
    origin: 'http://localhost:5173',
  },
  log: {
    level: env.log.level,
  },
} as const;

export type Config = typeof config;
