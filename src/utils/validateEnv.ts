type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type NodeEnv = 'development' | 'production' | 'test';

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

function parseLogLevel(value: string): LogLevel {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  if (levels.includes(value as LogLevel)) {
    return value as LogLevel;
  }
  throw new Error(`LOG_LEVEL must be one of: ${levels.join(', ')}`);
}

function parseNodeEnv(value: string): NodeEnv {
  const envs: NodeEnv[] = ['development', 'production', 'test'];
  if (envs.includes(value as NodeEnv)) {
    return value as NodeEnv;
  }
  throw new Error(`NODE_ENV must be one of: ${envs.join(', ')}`);
}

export function validateEnv(): {
  env: NodeEnv;
  port: number;
  db: { url: string };
  jwt: {
    accessSecret: string;
    accessExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  log: { level: LogLevel };
} {
  return {
    env: parseNodeEnv(optionalEnv('NODE_ENV', 'development')),
    port: parseIntEnv('PORT', 3000),
    db: {
      url: requireEnv('DATABASE_URL'),
    },
    jwt: {
      accessSecret: requireEnv('JWT_ACCESS_SECRET'),
      accessExpiresIn: optionalEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
      refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
      refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
    },
    log: {
      level: parseLogLevel(optionalEnv('LOG_LEVEL', 'debug')),
    },
  };
}
