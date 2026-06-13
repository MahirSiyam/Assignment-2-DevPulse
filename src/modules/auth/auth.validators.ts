import type { SignupInput, LoginInput, UserRole } from './auth.types';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const VALID_ROLES: UserRole[] = ['contributor', 'maintainer'];

type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: Record<string, string> };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateSignupInput(body: unknown): ValidationResult<SignupInput> {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body is required' } };
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input['name'])) {
    errors['name'] = 'Name is required';
  }

  if (!isNonEmptyString(input['email'])) {
    errors['email'] = 'Email is required';
  } else if (!EMAIL_REGEX.test(input['email'].trim())) {
    errors['email'] = 'Email must be a valid email address';
  }

  if (!isNonEmptyString(input['password'])) {
    errors['password'] = 'Password is required';
  } else if (input['password'].length < 6) {
    errors['password'] = 'Password must be at least 6 characters';
  }

  if (!isNonEmptyString(input['role'])) {
    errors['role'] = 'Role is required';
  } else if (!VALID_ROLES.includes(input['role'] as UserRole)) {
    errors['role'] = 'Role must be contributor or maintainer';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: (input['name'] as string).trim(),
      email: (input['email'] as string).trim().toLowerCase(),
      password: input['password'] as string,
      role: input['role'] as UserRole,
    },
  };
}

export function validateLoginInput(body: unknown): ValidationResult<LoginInput> {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body is required' } };
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input['email'])) {
    errors['email'] = 'Email is required';
  }

  if (!isNonEmptyString(input['password'])) {
    errors['password'] = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      email: (input['email'] as string).trim().toLowerCase(),
      password: input['password'] as string,
    },
  };
}
