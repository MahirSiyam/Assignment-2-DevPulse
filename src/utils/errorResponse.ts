import type { Response } from 'express';
import type { ErrorResponse } from '../types/api';
import { HTTP_ERROR_MESSAGES } from '../constants/httpStatus';

export interface ErrorResponseOptions {
  statusCode: number;
  message?: string;
  errors?: Record<string, string | string[]>;
}

export function buildErrorResponse(options: ErrorResponseOptions): ErrorResponse {
  return {
    success: false,
    message: options.message ?? HTTP_ERROR_MESSAGES[options.statusCode] ?? 'An error occurred',
    errors: options.errors ?? {},
  };
}

export function sendHttpError(res: Response, options: ErrorResponseOptions): void {
  const body = buildErrorResponse(options);
  res.status(options.statusCode).json(body);
}
