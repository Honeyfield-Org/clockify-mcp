import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerWorkspaceTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_workspaces',
    'List all workspaces the current user has access to',
    {},
    async () => {
      const workspaces = await client.getWorkspaces();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspaces, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_workspace',
    'Get details of a specific workspace',
    {
      workspaceId: z.string().describe('The ID of the workspace'),
    },
    async ({ workspaceId }) => {
      const workspace = await client.getWorkspace(workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspace, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_current_workspace',
    'Get the current/default workspace for the user',
    {},
    async () => {
      const workspace = await client.getCurrentWorkspace();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspace, null, 2),
          },
        ],
      };
    }
  );
}
