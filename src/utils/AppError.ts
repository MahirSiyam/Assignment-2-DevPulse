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
    message: string,
    errors: Record<string, string | string[]> = {},
  ): AppError {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(403, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string, errors: Record<string, string | string[]> = {}): AppError {
    return new AppError(409, message, errors);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, message, {}, false);
  }
}
