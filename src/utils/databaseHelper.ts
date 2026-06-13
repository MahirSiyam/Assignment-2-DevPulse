import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { config } from '../config/index';
import { AppError } from './AppError';

export const pool = new Pool({
  connectionString: config.db.url,
  ssl: { rejectUnauthorized: false },
  max: config.db.pool.max,
  idleTimeoutMillis: config.db.pool.idleTimeoutMs,
  connectionTimeoutMillis: config.db.pool.connectionTimeoutMs,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected PostgreSQL pool error', err);
});

export async function testConnection(): Promise<void> {
  try {
    await pool.query('SELECT 1');
  } catch {
    throw AppError.internal('Database connection failed');
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number | null }> {
  try {
    const result = await pool.query<T>(text, params);
    return { rows: result.rows, rowCount: result.rowCount };
  } catch (error) {
    throw mapDatabaseError(error);
  }
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const { rows } = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw mapDatabaseError(error);
  } finally {
    client.release();
  }
}

function mapDatabaseError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isPgError(error)) {
    if (error.code === '23505') {
      return AppError.conflict('Duplicate record', { field: 'unique constraint violated' });
    }
    if (error.code === '23503') {
      return AppError.badRequest('Referenced record does not exist');
    }
    if (error.code === '23514') {
      return AppError.badRequest('Data violates database constraints');
    }
  }

  return AppError.internal('Database operation failed');
}

interface PgError extends Error {
  code: string;
}

function isPgError(error: unknown): error is PgError {
  return error instanceof Error && 'code' in error && typeof error.code === 'string';
}
