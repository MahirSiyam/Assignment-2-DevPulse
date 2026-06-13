import { query, queryOne } from '../../utils/databaseHelper';
import { AppError } from '../../utils/AppError';
import type { PublicUser, UserRow } from './auth.types';

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    `SELECT id, name, email, password, role, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email],
  );
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
  role: string,
): Promise<PublicUser> {
  const { rows } = await query<PublicUser>(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, hashedPassword, role],
  );

  const user = rows[0];
  if (!user) {
    throw AppError.internal('Failed to create user');
  }

  return user;
}

export async function emailExists(email: string): Promise<boolean> {
  const result = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) AS exists`,
    [email],
  );
  return result?.exists ?? false;
}
