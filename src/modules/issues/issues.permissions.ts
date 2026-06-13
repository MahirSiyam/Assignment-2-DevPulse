import type { JwtPayload } from '../auth/auth.types';
import { AppError } from '../../utils/AppError';
import type { Issue } from './issues.types';

export function assertCanUpdateIssue(issue: Issue, user: JwtPayload): void {
  if (user.role === 'maintainer') {
    return;
  }

  if (issue.reporter_id !== user.id) {
    throw AppError.forbidden('You can only update your own issues');
  }

  if (issue.status !== 'open') {
    throw AppError.forbidden('You can only update issues with open status');
  }
}
