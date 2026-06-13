import type { Request, Response } from 'express';
import { sendError } from '../utils/sendResponse';

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, {
    statusCode: 404,
    message: 'Route not found',
    errors: {},
  });
}
