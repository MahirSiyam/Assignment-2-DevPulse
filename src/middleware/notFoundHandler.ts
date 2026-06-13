import type { Request, Response } from 'express';
import { sendHttpError } from '../utils/errorResponse';
import { HTTP_STATUS } from '../constants/httpStatus';

export function notFoundHandler(_req: Request, res: Response): void {
  sendHttpError(res, {
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: 'Route not found',
    errors: {},
  });
}
