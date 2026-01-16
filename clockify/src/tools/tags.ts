import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerTagTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_tags',
    'List tags in a workspace',
    {
      workspaceId: z.string().describe('The workspace ID'),
      archived: z.boolean().optional().describe('Filter by archived status'),
      name: z.string().optional().describe('Filter by tag name'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
    },
    async ({ workspaceId, ...params }) => {
      const tags = await client.getTags(workspaceId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tags, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_tag',
    'Get details of a specific tag',
    {
      workspaceId: z.string().describe('The workspace ID'),
      tagId: z.string().describe('The tag ID'),
    },
    async ({ workspaceId, tagId }) => {
      const tag = await client.getTag(workspaceId, tagId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tag, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'create_tag',
    'Create a new tag',
    {
      workspaceId: z.string().describe('The workspace ID'),
      name: z.string().describe('Tag name'),
    },
    async ({ workspaceId, name }) => {
      const tag = await client.createTag(workspaceId, { name });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(tag, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'delete_tag',
    'Delete a tag',
    {
      workspaceId: z.string().describe('The workspace ID'),
      tagId: z.string().describe('The tag ID'),
    },
    async ({ workspaceId, tagId }) => {
      await client.deleteTag(workspaceId, tagId);
      return {
        content: [
          {
            type: 'text',
            text: `Tag ${tagId} deleted successfully`,
          },
        ],
      };
    }
  );
}
