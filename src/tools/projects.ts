import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerProjectTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_projects',
    'List projects in a workspace with optional filters',
    {
      workspaceId: z.string().describe('The workspace ID'),
      archived: z.boolean().optional().describe('Filter by archived status'),
      name: z.string().optional().describe('Filter by project name'),
      clientId: z.string().optional().describe('Filter by client ID'),
      billable: z.boolean().optional().describe('Filter by billable status'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
    },
    async ({ workspaceId, ...params }) => {
      const projects = await client.getProjects(workspaceId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_project',
    'Get details of a specific project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
    },
    async ({ workspaceId, projectId }) => {
      const project = await client.getProject(workspaceId, projectId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'create_project',
    'Create a new project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      name: z.string().describe('Project name'),
      clientId: z.string().optional().describe('Client ID'),
      isPublic: z.boolean().optional().describe('Whether the project is public'),
      billable: z.boolean().optional().describe('Whether the project is billable'),
      color: z.string().optional().describe('Project color (hex code)'),
      note: z.string().optional().describe('Project note/description'),
      hourlyRate: z
        .object({
          amount: z.number().describe('Hourly rate amount'),
          currency: z.string().optional().describe('Currency code'),
        })
        .optional()
        .describe('Hourly rate for the project'),
    },
    async ({ workspaceId, ...data }) => {
      const project = await client.createProject(workspaceId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'update_project',
    'Update an existing project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      name: z.string().optional().describe('Project name'),
      clientId: z.string().optional().describe('Client ID'),
      isPublic: z.boolean().optional().describe('Whether the project is public'),
      billable: z.boolean().optional().describe('Whether the project is billable'),
      color: z.string().optional().describe('Project color (hex code)'),
      note: z.string().optional().describe('Project note/description'),
      archived: z.boolean().optional().describe('Whether the project is archived'),
      hourlyRate: z
        .object({
          amount: z.number().describe('Hourly rate amount'),
          currency: z.string().optional().describe('Currency code'),
        })
        .optional()
        .describe('Hourly rate for the project'),
    },
    async ({ workspaceId, projectId, ...data }) => {
      const project = await client.updateProject(workspaceId, projectId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'delete_project',
    'Delete (archive) a project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
    },
    async ({ workspaceId, projectId }) => {
      await client.deleteProject(workspaceId, projectId);
      return {
        content: [
          {
            type: 'text',
            text: `Project ${projectId} deleted successfully`,
          },
        ],
      };
    }
  );

  server.tool(
    'add_project_member',
    'Add a user to a project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      userId: z.string().describe('The user ID to add'),
      hourlyRate: z
        .object({
          amount: z.number().describe('Hourly rate amount'),
          currency: z.string().optional().describe('Currency code'),
        })
        .optional()
        .describe('Hourly rate for the member'),
      membershipType: z
        .enum(['PROJECT', 'MANAGER'])
        .optional()
        .describe('Type of membership'),
      membershipStatus: z
        .enum(['ACTIVE', 'INACTIVE'])
        .optional()
        .describe('Status of membership'),
    },
    async ({ workspaceId, projectId, ...data }) => {
      const project = await client.addProjectMember(workspaceId, projectId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    }
  );
}
