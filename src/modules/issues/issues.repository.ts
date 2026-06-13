import { query, queryOne } from '../../utils/databaseHelper';
import { AppError } from '../../utils/AppError';
import type { UserRole } from '../auth/auth.types';
import type { CreateIssueInput, Issue, ListIssuesQuery, UpdateIssueInput } from './issues.types';

export interface ReporterRow {
  id: number;
  name: string;
  role: UserRole;
}

export async function createIssue(
  input: CreateIssueInput,
  reporterId: number,
): Promise<Issue> {
  const { rows } = await query<Issue>(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [input.title, input.description, input.type, reporterId],
  );

  const issue = rows[0];
  if (!issue) {
    throw AppError.internal('Failed to create issue');
  }

  return issue;
}

export async function findIssues(filters: ListIssuesQuery): Promise<Issue[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.type !== undefined) {
    params.push(filters.type);
    conditions.push(`type = $${params.length}`);
  }

  if (filters.status !== undefined) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderClause = filters.sort === 'oldest' ? 'ASC' : 'DESC';

  const { rows } = await query<Issue>(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     ${whereClause}
     ORDER BY created_at ${orderClause}`,
    params,
  );

  return rows;
}

export async function findIssueById(id: number): Promise<Issue | null> {
  return queryOne<Issue>(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues
     WHERE id = $1`,
    [id],
  );
}

export async function findReporterById(id: number): Promise<ReporterRow | null> {
  return queryOne<ReporterRow>(
    `SELECT id, name, role
     FROM users
     WHERE id = $1`,
    [id],
  );
}

export async function findReportersByIds(ids: number[]): Promise<ReporterRow[]> {
  if (ids.length === 0) return [];

  const placeholders = ids.map((_, index) => `$${index + 1}`).join(', ');

  const { rows } = await query<ReporterRow>(
    `SELECT id, name, role
     FROM users
     WHERE id IN (${placeholders})`,
    ids,
  );

  return rows;
}

export async function updateIssue(id: number, input: UpdateIssueInput): Promise<Issue | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (input.title !== undefined) {
    params.push(input.title);
    setClauses.push(`title = $${params.length}`);
  }

  if (input.description !== undefined) {
    params.push(input.description);
    setClauses.push(`description = $${params.length}`);
  }

  if (input.type !== undefined) {
    params.push(input.type);
    setClauses.push(`type = $${params.length}`);
  }

  setClauses.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const { rows } = await query<Issue>(
    `UPDATE issues
     SET ${setClauses.join(', ')}
     WHERE id = $${params.length}
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    params,
  );

  return rows[0] ?? null;
}
