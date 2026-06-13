import type { Request, Response, NextFunction } from 'express';
import { sendHttpError } from '../utils/errorResponse';
import { HTTP_STATUS } from '../constants/httpStatus';

interface SyntaxBodyError extends SyntaxError {
  body?: unknown;
}

function isJsonSyntaxError(err: Error): err is SyntaxBodyError {
  return err instanceof SyntaxError && 'body' in err;
}

export function jsonParseErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (isJsonSyntaxError(err)) {
    sendHttpError(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: 'Invalid JSON in request body',
      errors: { body: 'Malformed JSON' },
    });
    return;
  }

  next(err);
}
