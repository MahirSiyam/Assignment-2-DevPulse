import { Pool } from 'pg';
import { config } from './index';

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
  await pool.query('SELECT 1');
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await pool.query<T>(text, params);
  return { rows: result.rows, rowCount: result.rowCount };
}
