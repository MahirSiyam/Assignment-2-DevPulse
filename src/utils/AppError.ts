import { HTTP_STATUS, HTTP_ERROR_MESSAGES } from '../constants/httpStatus';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors: Record<string, string | string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors: Record<string, string | string[]> = {},
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST] ?? 'Bad request',
    errors: Record<string, string | string[]> = {},
  ): AppError {
    return new AppError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.UNAUTHORIZED] ?? 'Unauthorized',
  ): AppError {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.FORBIDDEN] ?? 'Forbidden',
  ): AppError {
    return new AppError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.NOT_FOUND] ?? 'Not found',
  ): AppError {
    return new AppError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.CONFLICT] ?? 'Conflict',
    errors: Record<string, string | string[]> = {},
  ): AppError {
    return new AppError(HTTP_STATUS.CONFLICT, message, errors);
  }

  static internal(
    message = HTTP_ERROR_MESSAGES[HTTP_STATUS.INTERNAL_SERVER_ERROR] ?? 'Internal server error',
  ): AppError {
    return new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, {}, false);
  }
}
