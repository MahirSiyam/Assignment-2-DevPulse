import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/auth';
import { AppError } from './AppError';
import type { JwtPayload } from '../modules/auth/auth.types';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtConfig.access.secret, {
    expiresIn: jwtConfig.access.expiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, jwtConfig.access.secret);

    if (!isJwtPayload(decoded)) {
      throw AppError.unauthorized('Invalid token');
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token has expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Invalid token');
    }

    throw AppError.unauthorized('Authentication failed');
  }
}

function isJwtPayload(decoded: unknown): decoded is JwtPayload {
  if (!decoded || typeof decoded !== 'object') return false;

  const payload = decoded as Record<string, unknown>;

  return (
    typeof payload['id'] === 'number' &&
    typeof payload['name'] === 'string' &&
    (payload['role'] === 'contributor' || payload['role'] === 'maintainer')
  );
}
