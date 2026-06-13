import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { UserRole } from '../modules/auth/auth.types';
import { AppError } from '../utils/AppError';

export function authorize(...roles: UserRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw AppError.forbidden('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
