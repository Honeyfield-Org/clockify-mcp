import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerConversationsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_conversations_list_sessions',
    'List chat sessions with pagination and filters',
    {
      organizationId: z.string().describe('Organization UUID'),
      configId: z.string().optional().describe('Filter by config UUID'),
      userIdentifier: z.string().optional().describe('Filter by user identifier'),
      dateFrom: z.string().optional().describe('Filter from date (ISO string)'),
      dateTo: z.string().optional().describe('Filter to date (ISO string)'),
      page: z.number().min(1).optional().describe('Page number (default 1)'),
      limit: z.number().min(1).max(100).optional().describe('Items per page (default 20, max 100)'),
    },
    async (args) => {
      const data = await getClient().get('/conversations/sessions', args as Record<string, string | number | undefined>);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_conversations_get_session',
    'Get full session detail with messages and agent timeline',
    {
      id: z.string().describe('Session UUID'),
      organizationId: z.string().describe('Organization UUID'),
    },
    async ({ id, organizationId }) => {
      const data = await getClient().get(`/conversations/sessions/${id}`, { organizationId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
}
