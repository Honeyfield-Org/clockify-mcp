import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerApiKeysTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_api_keys_list',
    'List all active API keys for an organization',
    { organizationId: z.string().describe('Organization UUID') },
    async ({ organizationId }) => {
      const data = await getClient().get('/api-keys', { organizationId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_api_keys_create',
    'Create a new API key. Returns the plaintext key ONCE — store it securely.',
    {
      organizationId: z.string().describe('Organization UUID'),
      name: z.string().describe('Descriptive name for the key (e.g. "CI/CD Pipeline")'),
    },
    async (args) => {
      const data = await getClient().post('/api-keys', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_api_keys_revoke',
    'Revoke an API key (soft-delete, cannot be undone)',
    { id: z.string().describe('API key UUID to revoke') },
    async ({ id }) => {
      await getClient().delete(`/api-keys/${id}`);
      return { content: [{ type: 'text', text: `API key ${id} revoked.` }] };
    },
  );
}
