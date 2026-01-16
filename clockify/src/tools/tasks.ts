import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerTaskTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_tasks',
    'List tasks for a project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      isActive: z.boolean().optional().describe('Filter by active status'),
      name: z.string().optional().describe('Filter by task name'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
    },
    async ({ workspaceId, projectId, isActive, ...params }) => {
      const tasks = await client.getTasks(workspaceId, projectId, {
        ...params,
        'is-active': isActive,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tasks, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_task',
    'Get details of a specific task',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      taskId: z.string().describe('The task ID'),
    },
    async ({ workspaceId, projectId, taskId }) => {
      const task = await client.getTask(workspaceId, projectId, taskId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'create_task',
    'Create a new task in a project',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      name: z.string().describe('Task name'),
      assigneeIds: z.array(z.string()).optional().describe('Array of assignee user IDs'),
      estimate: z.string().optional().describe('Time estimate (ISO 8601 duration format, e.g., PT1H30M)'),
      status: z.enum(['ACTIVE', 'DONE']).optional().describe('Task status'),
      billable: z.boolean().optional().describe('Whether the task is billable'),
      hourlyRate: z
        .object({
          amount: z.number().describe('Hourly rate amount'),
          currency: z.string().optional().describe('Currency code'),
        })
        .optional()
        .describe('Hourly rate for the task'),
    },
    async ({ workspaceId, projectId, ...data }) => {
      const task = await client.createTask(workspaceId, projectId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'update_task',
    'Update an existing task',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      taskId: z.string().describe('The task ID'),
      name: z.string().optional().describe('Task name'),
      assigneeIds: z.array(z.string()).optional().describe('Array of assignee user IDs'),
      estimate: z.string().optional().describe('Time estimate (ISO 8601 duration format)'),
      status: z.enum(['ACTIVE', 'DONE']).optional().describe('Task status'),
      billable: z.boolean().optional().describe('Whether the task is billable'),
      hourlyRate: z
        .object({
          amount: z.number().describe('Hourly rate amount'),
          currency: z.string().optional().describe('Currency code'),
        })
        .optional()
        .describe('Hourly rate for the task'),
    },
    async ({ workspaceId, projectId, taskId, ...data }) => {
      const task = await client.updateTask(workspaceId, projectId, taskId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'delete_task',
    'Delete a task',
    {
      workspaceId: z.string().describe('The workspace ID'),
      projectId: z.string().describe('The project ID'),
      taskId: z.string().describe('The task ID'),
    },
    async ({ workspaceId, projectId, taskId }) => {
      await client.deleteTask(workspaceId, projectId, taskId);
      return {
        content: [
          {
            type: 'text',
            text: `Task ${taskId} deleted successfully`,
          },
        ],
      };
    }
  );
}
