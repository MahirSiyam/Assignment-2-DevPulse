import type { UserRole } from '../auth/auth.types';

export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type IssueSort = 'newest' | 'oldest';

export interface CreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
}

export interface ListIssuesQuery {
  sort: IssueSort;
  type?: IssueType;
  status?: IssueStatus;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IssueReporter {
  id: number;
  name: string;
  role: UserRole;
}

export interface IssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  created_at: Date;
  updated_at: Date;
  reporter: IssueReporter;
}
