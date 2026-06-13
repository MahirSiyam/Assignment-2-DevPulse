import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendHttpError } from '../utils/errorResponse';
import { HTTP_STATUS, HTTP_ERROR_MESSAGES } from '../constants/httpStatus';
import { config } from '../config/index';
import { logger } from '../utils/logger';

function resolveClientMessage(err: AppError): string {
  if (err.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR && config.env === 'production') {
    return HTTP_ERROR_MESSAGES[HTTP_STATUS.INTERNAL_SERVER_ERROR] ?? 'Internal server error';
  }

  return err.message;
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (!err.isOperational || err.statusCode >= 500) {
      logger.error(err.message, config.env === 'development' ? { stack: err.stack } : undefined);
    }

    sendHttpError(res, {
      statusCode: err.statusCode,
      message: resolveClientMessage(err),
      errors: err.errors,
    });
    return;
  }

  logger.error(err.message, config.env === 'development' ? { stack: err.stack } : undefined);

  sendHttpError(res, {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: HTTP_ERROR_MESSAGES[HTTP_STATUS.INTERNAL_SERVER_ERROR] ?? 'Internal server error',
    errors: {},
  });
}
