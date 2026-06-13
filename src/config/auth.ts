import { config } from './index';

export const jwtConfig = {
  access: {
    secret: config.jwt.accessSecret,
    expiresIn: config.jwt.accessExpiresIn,
  },
  refresh: {
    secret: config.jwt.refreshSecret,
    expiresIn: config.jwt.refreshExpiresIn,
  },
} as const;

export const bcryptConfig = {
  saltRounds: config.bcrypt.saltRounds,
} as const;
