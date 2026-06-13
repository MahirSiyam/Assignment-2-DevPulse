import bcrypt from 'bcrypt';
import { AppError } from '../../utils/AppError';
import { signAccessToken } from '../../utils/jwtHelper';
import * as authRepository from './auth.repository';
import type { JwtPayload, LoginInput, LoginResponse, PublicUser, SignupInput } from './auth.types';

const BCRYPT_SALT_ROUNDS = 10;

export async function signup(input: SignupInput): Promise<PublicUser> {
  const exists = await authRepository.emailExists(input.email);
  if (exists) {
    throw AppError.conflict('Email already in use', { email: 'Email must be unique' });
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

  return authRepository.createUser(input.name, input.email, hashedPassword, input.role);
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const user = await authRepository.findUserByEmail(input.email);

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = signAccessToken(payload);

  return { token };
}
