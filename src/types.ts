// Clockify API Types

export type Region = 'global' | 'euc1' | 'use2' | 'euw2' | 'apse2';

export interface ClockifyConfig {
  apiKey: string;
  region: Region;
  workspaceId?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  memberships: Membership[];
  profilePicture: string;
  activeWorkspace: string;
  defaultWorkspace: string;
  settings: UserSettings;
  status: string;
  customFields?: CustomFieldValue[];
}

export interface UserSettings {
  weekStart: string;
  timeZone: string;
  timeFormat: string;
  dateFormat: string;
  sendNewsletter: boolean;
  dashboardSelection: string;
  dashboardViewType: string;
  dashboardPin: boolean;
  projectListCollapse: number;
  collapseAllProjectLists: boolean;
  groupSimilarEntriesDisabled: boolean;
  isCompactViewOn: boolean;
  longRunning: boolean;
  scheduledReports: boolean;
  timeTrackingManual: boolean;
  summaryReportSettings: SummaryReportSettings;
  alerts: boolean;
  onboarding: boolean;
  showOnlyWorkingDays: boolean;
  lang: string;
  multiFactorEnabled: boolean;
  theme: string;
  myStartOfDay: string;
}

export interface SummaryReportSettings {
  group: string;
  subgroup: string;
}

export interface Membership {
  userId: string;
  hourlyRate: HourlyRate | null;
  costRate: CostRate | null;
  targetId: string;
  membershipType: string;
  membershipStatus: string;
}

export interface HourlyRate {
  amount: number;
  currency: string;
}

export interface HourlyRateInput {
  amount: number;
  currency?: string;
}

export interface CostRate {
  amount: number;
  currency: string;
}

export interface CostRateInput {
  amount: number;
  currency?: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  hourlyRate: HourlyRate | null;
  memberships: Membership[];
  workspaceSettings: WorkspaceSettings;
  imageUrl: string;
  featureSubscriptionType: string;
  costRate?: CostRate | null;
}

export interface WorkspaceSettings {
  timeRoundingInReports: boolean;
  onlyAdminsSeeBillableRates: boolean;
  onlyAdminsCreateProject: boolean;
  onlyAdminsSeeDashboard: boolean;
  defaultBillableProjects: boolean;
  lockTimeEntries: string | null;
  round: RoundSettings;
  projectFavorites: boolean;
  canSeeTimeSheet: boolean;
  canSeeTracker: boolean;
  projectPickerSpecialFilter: boolean;
  forceProjects: boolean;
  forceTasks: boolean;
  forceTags: boolean;
  forceDescription: boolean;
  onlyAdminsSeeAllTimeEntries: boolean;
  onlyAdminsSeePublicProjectsEntries: boolean;
  trackTimeDownToSecond: boolean;
  projectGroupingLabel: string;
  adminOnlyPages: string[];
  automaticLock: AutomaticLock | null;
  onlyAdminsCreateTag: boolean;
  onlyAdminsCreateTask: boolean;
  timeTrackingMode: string;
  isProjectPublicByDefault: boolean;
  canSeeEstimates?: boolean;
  currencyFormat?: string;
  currency?: string;
}

export interface RoundSettings {
  round: string;
  minutes: string;
}

export interface AutomaticLock {
  changeDay: string;
  dayOfMonth: number;
  firstDay: string;
  olderThanPeriod: string;
  olderThanValue: number;
  type: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  hourlyRate: HourlyRate | null;
  clientId: string;
  clientName?: string;
  workspaceId: string;
  billable: boolean;
  memberships: Membership[];
  color: string;
  estimate: Estimate | null;
  archived: boolean;
  duration: string;
  note: string;
  costRate?: CostRate | null;
  timeEstimate?: TimeEstimate;
  budgetEstimate?: BudgetEstimate | null;
  template: boolean;
  public: boolean;
}

export interface Estimate {
  estimate: string;
  type: string;
}

export interface TimeEstimate {
  estimate: string;
  type: string;
  resetOption: string | null;
  active: boolean;
  includeNonBillable: boolean;
}

export interface BudgetEstimate {
  estimate: number;
  type: string;
  resetOption: string | null;
  active: boolean;
}

// Task Types
export interface Task {
  id: string;
  name: string;
  projectId: string;
  assigneeIds: string[];
  assigneeId: string | null;
  userGroupIds: string[];
  estimate: string;
  status: TaskStatus;
  duration: string;
  billable: boolean;
  hourlyRate: HourlyRate | null;
  costRate: CostRate | null;
}

export type TaskStatus = 'ACTIVE' | 'DONE';

// Client Types
export interface Client {
  id: string;
  name: string;
  email?: string;
  workspaceId: string;
  archived: boolean;
  address?: string;
  note?: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  workspaceId: string;
  archived: boolean;
}

// Time Entry Types
export interface TimeEntry {
  id: string;
  description: string;
  tagIds: string[];
  userId: string;
  billable: boolean;
  taskId: string | null;
  projectId: string | null;
  workspaceId: string;
  timeInterval: TimeInterval;
  customFieldValues?: CustomFieldValue[];
  type: string;
  kioskId?: string | null;
  isLocked?: boolean;
}

export interface TimeInterval {
  start: string;
  end: string | null;
  duration: string | null;
}

export interface CustomFieldValue {
  customFieldId: string;
  timeEntryId?: string;
  value: string;
  name?: string;
  type?: string;
}

// Time Entry Input Types
export interface CreateTimeEntryInput {
  start: string;
  end?: string;
  description?: string;
  projectId?: string;
  taskId?: string;
  tagIds?: string[];
  billable?: boolean;
  customFields?: CustomFieldValue[];
}

export interface UpdateTimeEntryInput {
  start?: string;
  end?: string;
  description?: string;
  projectId?: string;
  taskId?: string;
  tagIds?: string[];
  billable?: boolean;
  customFields?: CustomFieldValue[];
}

// Report Types
export interface DetailedReportRequest {
  dateRangeStart: string;
  dateRangeEnd: string;
  detailedFilter?: DetailedFilter;
  sortOrder?: 'ASCENDING' | 'DESCENDING';
  description?: string;
  rounding?: boolean;
  withoutDescription?: boolean;
  amountShown?: 'HIDE_AMOUNT' | 'EARNED' | 'COST' | 'PROFIT';
  users?: FilterEntity;
  clients?: FilterEntity;
  projects?: FilterEntity;
  tasks?: FilterEntity;
  tags?: FilterEntity;
  billable?: 'BOTH' | 'BILLABLE' | 'NOT_BILLABLE';
  invoicingState?: 'BOTH' | 'INVOICED' | 'UNINVOICED';
  approvalState?: 'BOTH' | 'APPROVED' | 'UNAPPROVED';
  sortColumn?: string;
  page?: number;
  pageSize?: number;
  exportType?: 'JSON' | 'CSV' | 'XLSX' | 'PDF';
}

export interface DetailedFilter {
  page: number;
  pageSize: number;
  sortColumn?: string;
  auditFilter?: AuditFilter;
  quickbooksSelectType?: string;
}

export interface AuditFilter {
  userSetId?: string;
}

export interface FilterEntity {
  ids?: string[];
  contains?: 'CONTAINS' | 'DOES_NOT_CONTAIN';
  status?: 'ALL' | 'ACTIVE' | 'ARCHIVED';
}

export interface SummaryReportRequest {
  dateRangeStart: string;
  dateRangeEnd: string;
  summaryFilter?: SummaryFilter;
  sortOrder?: 'ASCENDING' | 'DESCENDING';
  users?: FilterEntity;
  clients?: FilterEntity;
  projects?: FilterEntity;
  tasks?: FilterEntity;
  tags?: FilterEntity;
  billable?: 'BOTH' | 'BILLABLE' | 'NOT_BILLABLE';
  invoicingState?: 'BOTH' | 'INVOICED' | 'UNINVOICED';
  approvalState?: 'BOTH' | 'APPROVED' | 'UNAPPROVED';
  description?: string;
  rounding?: boolean;
  withoutDescription?: boolean;
  amountShown?: 'HIDE_AMOUNT' | 'EARNED' | 'COST' | 'PROFIT';
  userLocale?: string;
  customFields?: CustomFieldFilter[];
  exportType?: 'JSON' | 'CSV' | 'XLSX' | 'PDF';
}

export interface SummaryFilter {
  groups: string[];
  sortColumn?: string;
}

export interface CustomFieldFilter {
  id: string;
  value: string;
}

export interface WeeklyReportRequest {
  dateRangeStart: string;
  dateRangeEnd: string;
  users?: FilterEntity;
  clients?: FilterEntity;
  projects?: FilterEntity;
  tasks?: FilterEntity;
  tags?: FilterEntity;
  billable?: 'BOTH' | 'BILLABLE' | 'NOT_BILLABLE';
  description?: string;
  rounding?: boolean;
  withoutDescription?: boolean;
  userLocale?: string;
  weeklyFilter?: WeeklyFilter;
  exportType?: 'JSON' | 'CSV' | 'XLSX' | 'PDF';
}

export interface WeeklyFilter {
  group: string;
  subgroup?: string;
}

export interface SharedReport {
  id: string;
  name: string;
  workspaceId: string;
  userId: string;
  filter: Record<string, unknown>;
  reportType: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportResponse {
  totals?: ReportTotals[];
  groupOne?: ReportGroup[];
  timeentries?: TimeEntryReport[];
}

export interface ReportTotals {
  totalTime: number;
  totalBillableTime: number;
  entriesCount: number;
  totalAmount?: number;
}

export interface ReportGroup {
  _id: string;
  name: string;
  duration: number;
  amount?: number;
  children?: ReportGroup[];
}

export interface TimeEntryReport {
  _id: string;
  description: string;
  userId: string;
  userName: string;
  userEmail?: string;
  billable: boolean;
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  clientId?: string;
  clientName?: string;
  taskId?: string;
  taskName?: string;
  tagIds?: string[];
  tagNames?: string[];
  timeInterval: TimeInterval;
  isLocked?: boolean;
  customFieldValues?: CustomFieldValue[];
  amount?: number;
  rate?: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Project Member Input
export interface AddProjectMemberInput {
  userId: string;
  hourlyRate?: HourlyRateInput;
  costRate?: CostRateInput;
  membershipType?: 'PROJECT' | 'MANAGER';
  membershipStatus?: 'ACTIVE' | 'INACTIVE';
}

// API Response wrapper for errors
export interface ClockifyError {
  message: string;
  code: number;
}
