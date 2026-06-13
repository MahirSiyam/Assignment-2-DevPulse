import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import * as issuesService from './issues.service';
import { validateCreateIssueInput, validateIssueIdParam, validateListIssuesQuery, validateUpdateIssueInput } from './issues.validators';

export async function getIssue(req: Request, res: Response): Promise<void> {
  const validation = validateIssueIdParam(req.params);
  if (!validation.valid) {
    throw AppError.badRequest('Validation failed', validation.errors);
  }

  const issue = await issuesService.getIssueById(validation.data);

  sendResponse(res, {
    message: 'Issue fetched successfully',
    data: { issue },
  });
}

export async function listIssues(req: Request, res: Response): Promise<void> {
  const validation = validateListIssuesQuery(req.query);
  if (!validation.valid) {
    throw AppError.badRequest('Validation failed', validation.errors);
  }

  const issues = await issuesService.listIssues(validation.data);

  sendResponse(res, {
    message: 'Issues fetched successfully',
    data: { issues },
  });
}

export async function createIssue(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw AppError.unauthorized('Authentication required');
  }

  const validation = validateCreateIssueInput(req.body);
  if (!validation.valid) {
    throw AppError.badRequest('Validation failed', validation.errors);
  }

  const issue = await issuesService.createIssue(validation.data, req.user.id);

  sendResponse(res, {
    statusCode: 201,
    message: 'Issue created successfully',
    data: { issue },
  });
}

export async function updateIssue(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw AppError.unauthorized('Authentication required');
  }

  const idValidation = validateIssueIdParam(req.params);
  if (!idValidation.valid) {
    throw AppError.badRequest('Validation failed', idValidation.errors);
  }

  const bodyValidation = validateUpdateIssueInput(req.body);
  if (!bodyValidation.valid) {
    throw AppError.badRequest('Validation failed', bodyValidation.errors);
  }

  const issue = await issuesService.updateIssue(
    idValidation.data,
    bodyValidation.data,
    req.user,
  );

  sendResponse(res, {
    message: 'Issue updated successfully',
    data: { issue },
  });
}
