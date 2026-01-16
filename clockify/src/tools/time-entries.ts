import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient, getLocalISOString } from '../clockify-client.js';

export function registerTimeEntryTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_time_entries',
    'List time entries for a user with optional filters',
    {
      workspaceId: z.string().describe('The workspace ID'),
      userId: z.string().describe('The user ID'),
      description: z.string().optional().describe('Filter by description'),
      start: z.string().optional().describe('Start date (ISO 8601 format)'),
      end: z.string().optional().describe('End date (ISO 8601 format)'),
      project: z.string().optional().describe('Filter by project ID'),
      task: z.string().optional().describe('Filter by task ID'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
      inProgress: z.boolean().optional().describe('Filter only running entries'),
    },
    async (params) => {
      const { workspaceId, userId, inProgress, ...rest } = params;
      const entries = await client.getTimeEntries(workspaceId, userId, {
        ...rest,
        'in-progress': inProgress,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entries, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_time_entry',
    'Get a single time entry by ID',
    {
      workspaceId: z.string().describe('The workspace ID'),
      timeEntryId: z.string().describe('The time entry ID'),
    },
    async ({ workspaceId, timeEntryId }) => {
      const entry = await client.getTimeEntry(workspaceId, timeEntryId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'create_time_entry',
    'Create a new time entry',
    {
      workspaceId: z.string().describe('The workspace ID'),
      start: z.string().describe('Start time (ISO 8601 format)'),
      end: z.string().optional().describe('End time (ISO 8601 format)'),
      description: z.string().optional().describe('Description of the time entry'),
      projectId: z.string().optional().describe('Project ID'),
      taskId: z.string().optional().describe('Task ID'),
      tagIds: z.array(z.string()).optional().describe('Array of tag IDs'),
      billable: z.boolean().optional().describe('Whether the entry is billable'),
    },
    async ({ workspaceId, ...data }) => {
      const entry = await client.createTimeEntry(workspaceId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'update_time_entry',
    'Update an existing time entry',
    {
      workspaceId: z.string().describe('The workspace ID'),
      timeEntryId: z.string().describe('The time entry ID'),
      start: z.string().optional().describe('Start time (ISO 8601 format)'),
      end: z.string().optional().describe('End time (ISO 8601 format)'),
      description: z.string().optional().describe('Description of the time entry'),
      projectId: z.string().optional().describe('Project ID'),
      taskId: z.string().optional().describe('Task ID'),
      tagIds: z.array(z.string()).optional().describe('Array of tag IDs'),
      billable: z.boolean().optional().describe('Whether the entry is billable'),
    },
    async ({ workspaceId, timeEntryId, ...data }) => {
      const entry = await client.updateTimeEntry(workspaceId, timeEntryId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'delete_time_entry',
    'Delete a time entry',
    {
      workspaceId: z.string().describe('The workspace ID'),
      timeEntryId: z.string().describe('The time entry ID'),
    },
    async ({ workspaceId, timeEntryId }) => {
      await client.deleteTimeEntry(workspaceId, timeEntryId);
      return {
        content: [
          {
            type: 'text',
            text: `Time entry ${timeEntryId} deleted successfully`,
          },
        ],
      };
    }
  );

  server.tool(
    'start_timer',
    'Start a new running timer',
    {
      workspaceId: z.string().describe('The workspace ID'),
      description: z.string().optional().describe('Description of the time entry'),
      projectId: z.string().optional().describe('Project ID'),
      taskId: z.string().optional().describe('Task ID'),
      tagIds: z.array(z.string()).optional().describe('Array of tag IDs'),
      billable: z.boolean().optional().describe('Whether the entry is billable'),
    },
    async ({ workspaceId, ...data }) => {
      const entry = await client.startTimer(workspaceId, {
        start: getLocalISOString(),
        ...data,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'stop_timer',
    'Stop the currently running timer',
    {
      workspaceId: z.string().describe('The workspace ID'),
      userId: z.string().describe('The user ID'),
    },
    async ({ workspaceId, userId }) => {
      const entry = await client.stopTimer(workspaceId, userId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_running_timer',
    'Get the currently running timer for a user',
    {
      workspaceId: z.string().describe('The workspace ID'),
      userId: z.string().describe('The user ID'),
    },
    async ({ workspaceId, userId }) => {
      const entry = await client.getRunningTimer(workspaceId, userId);
      if (entry) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entry, null, 2),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: 'No running timer found',
          },
        ],
      };
    }
  );
}
