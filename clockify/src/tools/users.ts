import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerUserTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'get_current_user',
    'Get the currently authenticated user',
    {},
    async () => {
      const user = await client.getCurrentUser();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'list_workspace_users',
    'List users in a workspace',
    {
      workspaceId: z.string().describe('The workspace ID'),
      email: z.string().optional().describe('Filter by email'),
      status: z.string().optional().describe('Filter by status (ACTIVE, PENDING, INACTIVE)'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
    },
    async ({ workspaceId, ...params }) => {
      const users = await client.getWorkspaceUsers(workspaceId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(users, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_user',
    'Get details of a specific user',
    {
      workspaceId: z.string().describe('The workspace ID'),
      userId: z.string().describe('The user ID'),
    },
    async ({ workspaceId, userId }) => {
      const user = await client.getUser(workspaceId, userId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }
  );
}
