import { Router } from 'express';

/**
 * Central route aggregator.
 * Mount module routers here as features are implemented.
 *
 * Example:
 *   import { authRouter } from '../modules/auth/auth.routes';
 *   router.use('/auth', authRouter);
 */
export const apiRouter = Router();

// Module routes will be registered here
