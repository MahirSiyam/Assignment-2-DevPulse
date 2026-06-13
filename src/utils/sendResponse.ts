import type { Response } from 'express';
import type { SuccessResponse } from '../types/api';
import { sendHttpError, type ErrorResponseOptions } from './errorResponse';

interface SuccessOptions<T> {
  statusCode?: number;
  message?: string;
  data: T;
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

export function sendError(res: Response, options: ErrorResponseOptions): void {
  sendHttpError(res, options);
}
