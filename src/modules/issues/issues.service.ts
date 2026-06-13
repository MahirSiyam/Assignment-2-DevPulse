import * as issuesRepository from './issues.repository';
import type {
  CreateIssueInput,
  Issue,
  IssueWithReporter,
  ListIssuesQuery,
} from './issues.types';

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

  return issues.map((issue) => {
    const reporter = reporterMap.get(issue.reporter_id);

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
  });
}
