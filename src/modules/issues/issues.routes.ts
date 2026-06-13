import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { catchAsync } from '../../utils/catchAsync';
import * as issuesController from './issues.controller';

export const issuesRouter = Router();

issuesRouter.get('/', catchAsync(issuesController.listIssues));

issuesRouter.post(
  '/',
  authenticate,
  authorize('contributor', 'maintainer'),
  catchAsync(issuesController.createIssue),
);
