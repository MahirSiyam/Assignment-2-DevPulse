import * as issuesRepository from './issues.repository';
import type { ReporterRow } from './issues.repository';
import { AppError } from '../../utils/AppError';
import { assertCanUpdateIssue } from './issues.permissions';
import type { JwtPayload } from '../auth/auth.types';
import type {
  CreateIssueInput,
  Issue,
  IssueWithReporter,
  ListIssuesQuery,
  UpdateIssueInput,
} from './issues.types';

function mergeIssueWithReporter(issue: Issue, reporter: ReporterRow | null): IssueWithReporter {
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    reporter: {
      id: reporter?.id ?? issue.reporter_id,
      name: reporter?.name ?? 'Unknown',
      role: reporter?.role ?? 'contributor',
    },
  };
}

export async function createIssue(
  input: CreateIssueInput,
  reporterId: number,
): Promise<Issue> {
  return issuesRepository.createIssue(input, reporterId);
}

export async function listIssues(query: ListIssuesQuery): Promise<IssueWithReporter[]> {
  const issues = await issuesRepository.findIssues(query);

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
  const reporters = await issuesRepository.findReportersByIds(reporterIds);

  const reporterMap = new Map(reporters.map((reporter) => [reporter.id, reporter]));

  return issues.map((issue) => mergeIssueWithReporter(issue, reporterMap.get(issue.reporter_id) ?? null));
}

export async function getIssueById(id: number): Promise<IssueWithReporter> {
  const issue = await issuesRepository.findIssueById(id);

  if (!issue) {
    throw AppError.notFound('Issue not found');
  }

  const reporter = await issuesRepository.findReporterById(issue.reporter_id);

  return mergeIssueWithReporter(issue, reporter);
}

export async function updateIssue(
  id: number,
  input: UpdateIssueInput,
  user: JwtPayload,
): Promise<IssueWithReporter> {
  const existingIssue = await issuesRepository.findIssueById(id);

  if (!existingIssue) {
    throw AppError.notFound('Issue not found');
  }

  assertCanUpdateIssue(existingIssue, user);

  const updatedIssue = await issuesRepository.updateIssue(id, input);

  if (!updatedIssue) {
    throw AppError.internal('Failed to update issue');
  }

  const reporter = await issuesRepository.findReporterById(updatedIssue.reporter_id);

  return mergeIssueWithReporter(updatedIssue, reporter);
}

export async function deleteIssue(id: number): Promise<void> {
  const existingIssue = await issuesRepository.findIssueById(id);

  if (!existingIssue) {
    throw AppError.notFound('Issue not found');
  }

  const deleted = await issuesRepository.deleteIssueById(id);

  if (!deleted) {
    throw AppError.internal('Failed to delete issue');
  }
}
