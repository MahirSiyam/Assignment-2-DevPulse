import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/sendResponse';
import { config } from '../config/index';
import { logger } from '../utils/logger';

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (config.env === 'development') {
    logger.error(err.message, { stack: err.stack });
  } else {
    logger.error(err.message);
  }

  sendError(res, {
    statusCode: 500,
    message: 'Internal server error',
    errors: {},
  });
}
