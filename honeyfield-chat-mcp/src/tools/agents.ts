import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerAgentsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_agents_list',
    'List all agents for a chat config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get('/agents', { configId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_agents_get',
    'Get an agent by ID',
    { id: z.string().describe('Agent UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/agents/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_agents_create',
    'Create a new agent for a chat config',
    {
      configId: z.string().describe('Config UUID'),
      type: z.string().describe('Agent type (max 50 chars)'),
      name: z.string().describe('Agent name (max 100 chars)'),
      systemPrompt: z.string().optional().describe('Agent system prompt'),
      routingHints: z.array(z.string()).optional().describe('Keywords for routing to this agent'),
      priority: z.number().min(0).optional().describe('Priority (higher = preferred)'),
      enabled: z.boolean().optional().describe('Whether agent is enabled'),
    },
    async (args) => {
      const data = await getClient().post('/agents', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_agents_update',
    'Update an existing agent. All fields optional — send only what to change.',
    {
      id: z.string().describe('Agent UUID to update'),
      type: z.string().optional().describe('Agent type'),
      name: z.string().optional().describe('Agent name'),
      systemPrompt: z.string().optional().describe('Agent system prompt'),
      routingHints: z.array(z.string()).optional().describe('Routing keywords'),
      priority: z.number().min(0).optional().describe('Priority'),
      enabled: z.boolean().optional().describe('Whether agent is enabled'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/agents/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_agents_delete',
    'Delete an agent by ID',
    { id: z.string().describe('Agent UUID to delete') },
    async ({ id }) => {
      await getClient().delete(`/agents/${id}`);
      return { content: [{ type: 'text', text: `Agent ${id} deleted.` }] };
    },
  );
}
