import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import * as authService from './auth.service';
import { validateLoginInput, validateSignupInput } from './auth.validators';

export async function signup(req: Request, res: Response): Promise<void> {
  const validation = validateSignupInput(req.body);
  if (!validation.valid) {
    throw AppError.badRequest('Validation failed', validation.errors);
  }

  const user = await authService.signup(validation.data);

  sendResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: { user },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const validation = validateLoginInput(req.body);
  if (!validation.valid) {
    throw AppError.badRequest('Validation failed', validation.errors);
  }

  const result = await authService.login(validation.data);

  sendResponse(res, {
    message: 'Login successful',
    data: result,
  });
}
