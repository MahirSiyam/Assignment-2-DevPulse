import type { Response } from 'express';
import type { ErrorResponse, SuccessResponse } from '../types/api';

interface SuccessOptions<T> {
  statusCode?: number;
  message?: string;
  data: T;
}

interface ErrorOptions {
  statusCode?: number;
  message: string;
  errors?: Record<string, string | string[]>;
}

export function sendResponse<T = Record<string, unknown>>(
  res: Response,
  options: SuccessOptions<T>,
): void {
  const body: SuccessResponse<T> = {
    success: true,
    message: options.message ?? '',
    data: options.data,
  };

  res.status(options.statusCode ?? 200).json(body);
}

export function sendError(res: Response, options: ErrorOptions): void {
  const body: ErrorResponse = {
    success: false,
    message: options.message,
    errors: options.errors ?? {},
  };

  res.status(options.statusCode ?? 400).json(body);
}
