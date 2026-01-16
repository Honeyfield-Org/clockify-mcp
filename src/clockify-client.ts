import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Region,
  ClockifyConfig,
  User,
  Workspace,
  Project,
  Task,
  Client,
  Tag,
  TimeEntry,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
  DetailedReportRequest,
  SummaryReportRequest,
  WeeklyReportRequest,
  SharedReport,
  ReportResponse,
  PaginationParams,
  AddProjectMemberInput,
  TaskStatus,
  Membership,
} from './types.js';

const API_REGIONS: Record<Region, string> = {
  global: 'https://api.clockify.me/api/v1',
  euc1: 'https://euc1.clockify.me/api/v1',
  use2: 'https://use2.clockify.me/api/v1',
  euw2: 'https://euw2.clockify.me/api/v1',
  apse2: 'https://apse2.clockify.me/api/v1',
};

const REPORTS_REGIONS: Record<Region, string> = {
  global: 'https://reports.api.clockify.me/v1',
  euc1: 'https://euc1.reports.api.clockify.me/v1',
  use2: 'https://use2.reports.api.clockify.me/v1',
  euw2: 'https://euw2.reports.api.clockify.me/v1',
  apse2: 'https://apse2.reports.api.clockify.me/v1',
};

export class ClockifyClient {
  private api: AxiosInstance;
  private reportsApi: AxiosInstance;
  private config: ClockifyConfig;

  constructor(config: ClockifyConfig) {
    this.config = config;
    const baseURL = API_REGIONS[config.region];
    const reportsBaseURL = REPORTS_REGIONS[config.region];

    this.api = axios.create({
      baseURL,
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    this.reportsApi = axios.create({
      baseURL: reportsBaseURL,
      headers: {
        'X-Api-Key': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = this.extractErrorMessage(error);
        throw new Error(`Clockify API Error: ${message}`);
      }
    );

    this.reportsApi.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = this.extractErrorMessage(error);
        throw new Error(`Clockify Reports API Error: ${message}`);
      }
    );
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response) {
      const data = error.response.data as Record<string, unknown>;
      if (data && typeof data.message === 'string') {
        return `${error.response.status} - ${data.message}`;
      }
      return `${error.response.status} - ${error.response.statusText}`;
    }
    return error.message;
  }

  // User Methods
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/user');
    return response.data;
  }

  async getUser(workspaceId: string, userId: string): Promise<User> {
    const response = await this.api.get<User>(
      `/workspaces/${workspaceId}/users/${userId}`
    );
    return response.data;
  }

  async getWorkspaceUsers(
    workspaceId: string,
    params?: PaginationParams & { email?: string; status?: string }
  ): Promise<User[]> {
    const response = await this.api.get<User[]>(
      `/workspaces/${workspaceId}/users`,
      { params }
    );
    return response.data;
  }

  // Workspace Methods
  async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.api.get<Workspace[]>('/workspaces');
    return response.data;
  }

  async getWorkspace(workspaceId: string): Promise<Workspace> {
    const response = await this.api.get<Workspace>(
      `/workspaces/${workspaceId}`
    );
    return response.data;
  }

  async getCurrentWorkspace(): Promise<Workspace> {
    if (this.config.workspaceId) {
      return this.getWorkspace(this.config.workspaceId);
    }
    const user = await this.getCurrentUser();
    return this.getWorkspace(user.activeWorkspace || user.defaultWorkspace);
  }

  // Project Methods
  async getProjects(
    workspaceId: string,
    params?: PaginationParams & {
      archived?: boolean;
      name?: string;
      clientId?: string;
      'contains-client'?: boolean;
      'client-status'?: 'ACTIVE' | 'ARCHIVED';
      'contains-task'?: boolean;
      'task-status'?: 'ACTIVE' | 'DONE';
      billable?: boolean;
    }
  ): Promise<Project[]> {
    const response = await this.api.get<Project[]>(
      `/workspaces/${workspaceId}/projects`,
      { params }
    );
    return response.data;
  }

  async getProject(workspaceId: string, projectId: string): Promise<Project> {
    const response = await this.api.get<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}`
    );
    return response.data;
  }

  async createProject(
    workspaceId: string,
    data: {
      name: string;
      clientId?: string;
      isPublic?: boolean;
      billable?: boolean;
      color?: string;
      note?: string;
      memberships?: Membership[];
      hourlyRate?: { amount: number; currency?: string };
      estimate?: { estimate: string; type: string };
    }
  ): Promise<Project> {
    const response = await this.api.post<Project>(
      `/workspaces/${workspaceId}/projects`,
      data
    );
    return response.data;
  }

  async updateProject(
    workspaceId: string,
    projectId: string,
    data: {
      name?: string;
      clientId?: string;
      isPublic?: boolean;
      billable?: boolean;
      color?: string;
      note?: string;
      archived?: boolean;
      hourlyRate?: { amount: number; currency?: string };
      estimate?: { estimate: string; type: string };
    }
  ): Promise<Project> {
    const response = await this.api.put<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}`,
      data
    );
    return response.data;
  }

  async deleteProject(workspaceId: string, projectId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  }

  async addProjectMember(
    workspaceId: string,
    projectId: string,
    data: AddProjectMemberInput
  ): Promise<Project> {
    const response = await this.api.post<Project>(
      `/workspaces/${workspaceId}/projects/${projectId}/memberships`,
      data
    );
    return response.data;
  }

  // Task Methods
  async getTasks(
    workspaceId: string,
    projectId: string,
    params?: PaginationParams & {
      'is-active'?: boolean;
      name?: string;
      strict?: boolean;
    }
  ): Promise<Task[]> {
    const response = await this.api.get<Task[]>(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      { params }
    );
    return response.data;
  }

  async getTask(
    workspaceId: string,
    projectId: string,
    taskId: string
  ): Promise<Task> {
    const response = await this.api.get<Task>(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  }

  async createTask(
    workspaceId: string,
    projectId: string,
    data: {
      name: string;
      assigneeIds?: string[];
      estimate?: string;
      status?: TaskStatus;
      billable?: boolean;
      hourlyRate?: { amount: number; currency?: string };
    }
  ): Promise<Task> {
    const response = await this.api.post<Task>(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
      data
    );
    return response.data;
  }

  async updateTask(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: {
      name?: string;
      assigneeIds?: string[];
      estimate?: string;
      status?: TaskStatus;
      billable?: boolean;
      hourlyRate?: { amount: number; currency?: string };
    }
  ): Promise<Task> {
    const response = await this.api.put<Task>(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data;
  }

  async deleteTask(
    workspaceId: string,
    projectId: string,
    taskId: string
  ): Promise<void> {
    await this.api.delete(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  }

  // Client Methods
  async getClients(
    workspaceId: string,
    params?: PaginationParams & { archived?: boolean; name?: string }
  ): Promise<Client[]> {
    const response = await this.api.get<Client[]>(
      `/workspaces/${workspaceId}/clients`,
      { params }
    );
    return response.data;
  }

  async getClient(workspaceId: string, clientId: string): Promise<Client> {
    const response = await this.api.get<Client>(
      `/workspaces/${workspaceId}/clients/${clientId}`
    );
    return response.data;
  }

  async createClient(
    workspaceId: string,
    data: { name: string; email?: string; address?: string; note?: string }
  ): Promise<Client> {
    const response = await this.api.post<Client>(
      `/workspaces/${workspaceId}/clients`,
      data
    );
    return response.data;
  }

  async deleteClient(workspaceId: string, clientId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/clients/${clientId}`);
  }

  // Tag Methods
  async getTags(
    workspaceId: string,
    params?: PaginationParams & { archived?: boolean; name?: string }
  ): Promise<Tag[]> {
    const response = await this.api.get<Tag[]>(
      `/workspaces/${workspaceId}/tags`,
      { params }
    );
    return response.data;
  }

  async getTag(workspaceId: string, tagId: string): Promise<Tag> {
    const response = await this.api.get<Tag>(
      `/workspaces/${workspaceId}/tags/${tagId}`
    );
    return response.data;
  }

  async createTag(workspaceId: string, data: { name: string }): Promise<Tag> {
    const response = await this.api.post<Tag>(
      `/workspaces/${workspaceId}/tags`,
      data
    );
    return response.data;
  }

  async deleteTag(workspaceId: string, tagId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/tags/${tagId}`);
  }

  // Time Entry Methods
  async getTimeEntries(
    workspaceId: string,
    userId: string,
    params?: PaginationParams & {
      description?: string;
      start?: string;
      end?: string;
      project?: string;
      task?: string;
      tags?: string[];
      'project-required'?: boolean;
      'task-required'?: boolean;
      hydrated?: boolean;
      'in-progress'?: boolean;
    }
  ): Promise<TimeEntry[]> {
    const response = await this.api.get<TimeEntry[]>(
      `/workspaces/${workspaceId}/user/${userId}/time-entries`,
      { params }
    );
    return response.data;
  }

  async getTimeEntry(
    workspaceId: string,
    timeEntryId: string
  ): Promise<TimeEntry> {
    const response = await this.api.get<TimeEntry>(
      `/workspaces/${workspaceId}/time-entries/${timeEntryId}`
    );
    return response.data;
  }

  async createTimeEntry(
    workspaceId: string,
    data: CreateTimeEntryInput
  ): Promise<TimeEntry> {
    const response = await this.api.post<TimeEntry>(
      `/workspaces/${workspaceId}/time-entries`,
      data
    );
    return response.data;
  }

  async updateTimeEntry(
    workspaceId: string,
    timeEntryId: string,
    data: UpdateTimeEntryInput
  ): Promise<TimeEntry> {
    const response = await this.api.put<TimeEntry>(
      `/workspaces/${workspaceId}/time-entries/${timeEntryId}`,
      data
    );
    return response.data;
  }

  async deleteTimeEntry(
    workspaceId: string,
    timeEntryId: string
  ): Promise<void> {
    await this.api.delete(
      `/workspaces/${workspaceId}/time-entries/${timeEntryId}`
    );
  }

  async startTimer(
    workspaceId: string,
    data: {
      start: string;
      description?: string;
      projectId?: string;
      taskId?: string;
      tagIds?: string[];
      billable?: boolean;
    }
  ): Promise<TimeEntry> {
    const response = await this.api.post<TimeEntry>(
      `/workspaces/${workspaceId}/time-entries`,
      {
        ...data,
        end: null,
      }
    );
    return response.data;
  }

  async stopTimer(workspaceId: string, userId: string): Promise<TimeEntry> {
    const end = new Date().toISOString();
    const response = await this.api.patch<TimeEntry>(
      `/workspaces/${workspaceId}/user/${userId}/time-entries`,
      { end }
    );
    return response.data;
  }

  async getRunningTimer(
    workspaceId: string,
    userId: string
  ): Promise<TimeEntry | null> {
    const entries = await this.getTimeEntries(workspaceId, userId, {
      'in-progress': true,
    });
    return entries.length > 0 ? entries[0] : null;
  }

  // Report Methods
  async getDetailedReport(
    workspaceId: string,
    data: DetailedReportRequest
  ): Promise<ReportResponse> {
    const response = await this.reportsApi.post<ReportResponse>(
      `/workspaces/${workspaceId}/reports/detailed`,
      data
    );
    return response.data;
  }

  async getSummaryReport(
    workspaceId: string,
    data: SummaryReportRequest
  ): Promise<ReportResponse> {
    const response = await this.reportsApi.post<ReportResponse>(
      `/workspaces/${workspaceId}/reports/summary`,
      data
    );
    return response.data;
  }

  async getWeeklyReport(
    workspaceId: string,
    data: WeeklyReportRequest
  ): Promise<ReportResponse> {
    const response = await this.reportsApi.post<ReportResponse>(
      `/workspaces/${workspaceId}/reports/weekly`,
      data
    );
    return response.data;
  }

  async getSharedReports(workspaceId: string): Promise<SharedReport[]> {
    const response = await this.reportsApi.get<SharedReport[]>(
      `/workspaces/${workspaceId}/shared-reports`
    );
    return response.data;
  }
}

export function createClockifyClient(): ClockifyClient {
  const apiKey = process.env.CLOCKIFY_API_KEY;
  if (!apiKey) {
    throw new Error('CLOCKIFY_API_KEY environment variable is required');
  }

  const region = (process.env.CLOCKIFY_REGION || 'euc1') as Region;
  const workspaceId = process.env.CLOCKIFY_WORKSPACE_ID;

  return new ClockifyClient({
    apiKey,
    region,
    workspaceId,
  });
}
