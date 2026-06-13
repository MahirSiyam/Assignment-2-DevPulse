import type { CreateIssueInput, IssueSort, IssueStatus, IssueType, ListIssuesQuery, UpdateIssueInput } from './issues.types';

const VALID_TYPES: IssueType[] = ['bug', 'feature_request'];
const VALID_STATUSES: IssueStatus[] = ['open', 'in_progress', 'resolved'];
const VALID_SORTS: IssueSort[] = ['newest', 'oldest'];
const TITLE_MAX_LENGTH = 150;
const DESCRIPTION_MIN_LENGTH = 20;
const FORBIDDEN_UPDATE_FIELDS = ['reporter_id', 'status', 'id', 'created_at', 'updated_at'];

type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: Record<string, string> };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

export function validateListIssuesQuery(query: unknown): ValidationResult<ListIssuesQuery> {
  const errors: Record<string, string> = {};

  if (!query || typeof query !== 'object') {
    return { valid: true, data: { sort: 'newest' } };
  }

  const params = query as Record<string, unknown>;
  const sortValue = getQueryValue(params['sort']) ?? 'newest';
  const typeValue = getQueryValue(params['type']);
  const statusValue = getQueryValue(params['status']);

  if (!VALID_SORTS.includes(sortValue as IssueSort)) {
    errors['sort'] = 'Sort must be newest or oldest';
  }

  if (typeValue !== undefined && !VALID_TYPES.includes(typeValue as IssueType)) {
    errors['type'] = 'Type must be bug or feature_request';
  }

  if (statusValue !== undefined && !VALID_STATUSES.includes(statusValue as IssueStatus)) {
    errors['status'] = 'Status must be open, in_progress, or resolved';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const data: ListIssuesQuery = { sort: sortValue as IssueSort };

  if (typeValue !== undefined) {
    data.type = typeValue as IssueType;
  }

  if (statusValue !== undefined) {
    data.status = statusValue as IssueStatus;
  }

  return { valid: true, data };
}

export function validateIssueIdParam(params: unknown): ValidationResult<number> {
  const errors: Record<string, string> = {};

  if (!params || typeof params !== 'object') {
    return { valid: false, errors: { id: 'Issue ID is required' } };
  }

  const { id } = params as Record<string, unknown>;

  if (typeof id !== 'string' || id.trim() === '') {
    return { valid: false, errors: { id: 'Issue ID is required' } };
  }

  const parsedId = Number.parseInt(id, 10);

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    errors['id'] = 'Issue ID must be a valid positive integer';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: parsedId };
}

export function validateUpdateIssueInput(body: unknown): ValidationResult<UpdateIssueInput> {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body is required' } };
  }

  const input = body as Record<string, unknown>;

  for (const field of FORBIDDEN_UPDATE_FIELDS) {
    if (field in input) {
      errors[field] = `${field} cannot be updated`;
    }
  }

  const hasTitle = 'title' in input;
  const hasDescription = 'description' in input;
  const hasType = 'type' in input;

  if (!hasTitle && !hasDescription && !hasType) {
    errors['body'] = 'At least one field (title, description, type) is required';
  }

  if (hasTitle) {
    if (!isNonEmptyString(input['title'])) {
      errors['title'] = 'Title is required';
    } else if (input['title'].trim().length > TITLE_MAX_LENGTH) {
      errors['title'] = 'Title must not exceed 150 characters';
    }
  }

  if (hasDescription) {
    if (!isNonEmptyString(input['description'])) {
      errors['description'] = 'Description is required';
    } else if (input['description'].trim().length < DESCRIPTION_MIN_LENGTH) {
      errors['description'] = 'Description must be at least 20 characters';
    }
  }

  if (hasType) {
    if (!isNonEmptyString(input['type'])) {
      errors['type'] = 'Type is required';
    } else if (!VALID_TYPES.includes(input['type'] as IssueType)) {
      errors['type'] = 'Type must be bug or feature_request';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const data: UpdateIssueInput = {};

  if (hasTitle) {
    data.title = (input['title'] as string).trim();
  }

  if (hasDescription) {
    data.description = (input['description'] as string).trim();
  }

  if (hasType) {
    data.type = input['type'] as IssueType;
  }

  return { valid: true, data };
}

export function validateCreateIssueInput(body: unknown): ValidationResult<CreateIssueInput> {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body is required' } };
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input['title'])) {
    errors['title'] = 'Title is required';
  } else if (input['title'].trim().length > TITLE_MAX_LENGTH) {
    errors['title'] = 'Title must not exceed 150 characters';
  }

  if (!isNonEmptyString(input['description'])) {
    errors['description'] = 'Description is required';
  } else if (input['description'].trim().length < DESCRIPTION_MIN_LENGTH) {
    errors['description'] = 'Description must be at least 20 characters';
  }

  if (!isNonEmptyString(input['type'])) {
    errors['type'] = 'Type is required';
  } else if (!VALID_TYPES.includes(input['type'] as IssueType)) {
    errors['type'] = 'Type must be bug or feature_request';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: (input['title'] as string).trim(),
      description: (input['description'] as string).trim(),
      type: input['type'] as IssueType,
    },
  };
}
