import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import * as authController from './auth.controller';

export const authRouter = Router();

authRouter.post('/signup', catchAsync(authController.signup));
authRouter.post('/login', catchAsync(authController.login));
