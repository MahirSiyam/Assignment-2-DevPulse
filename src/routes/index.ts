import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { issuesRouter } from '../modules/issues/issues.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/issues', issuesRouter);
