import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerMcpServersTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_mcp_servers_list',
    'List all MCP servers for an organization',
    { organizationId: z.string().describe('Organization UUID') },
    async ({ organizationId }) => {
      const data = await getClient().get('/mcp-servers', { organizationId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_get',
    'Get an MCP server by ID',
    { id: z.string().describe('MCP server UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/mcp-servers/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_get_by_config',
    'List MCP servers linked to a specific config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/mcp-servers/by-config/${configId}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_create',
    'Create a new MCP server',
    {
      organizationId: z.string().describe('Organization UUID'),
      name: z.string().describe('Server name (max 255 chars)'),
      transportType: z.enum(['sse', 'http']).describe('Transport type'),
      url: z.string().url().describe('Server URL'),
      apiKey: z.string().optional().describe('API key for the server'),
      headers: z.record(z.string()).optional().describe('Custom headers'),
    },
    async (args) => {
      const data = await getClient().post('/mcp-servers', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_update',
    'Update an MCP server. All fields optional.',
    {
      id: z.string().describe('MCP server UUID to update'),
      name: z.string().optional().describe('Server name'),
      transportType: z.enum(['sse', 'http']).optional().describe('Transport type'),
      url: z.string().url().optional().describe('Server URL'),
      apiKey: z.string().optional().describe('API key'),
      headers: z.record(z.string()).optional().describe('Custom headers'),
      enabled: z.boolean().optional().describe('Whether server is enabled'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().patch(`/mcp-servers/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_delete',
    'Delete an MCP server',
    { id: z.string().describe('MCP server UUID to delete') },
    async ({ id }) => {
      await getClient().delete(`/mcp-servers/${id}`);
      return { content: [{ type: 'text', text: `MCP server ${id} deleted.` }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_link',
    'Link an MCP server to a config',
    {
      configId: z.string().describe('Config UUID'),
      mcpServerId: z.string().describe('MCP server UUID'),
    },
    async (args) => {
      const data = await getClient().post('/mcp-servers/link', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_mcp_servers_unlink',
    'Unlink an MCP server from a config',
    {
      configId: z.string().describe('Config UUID'),
      mcpServerId: z.string().describe('MCP server UUID'),
    },
    async (args) => {
      await getClient().delete('/mcp-servers/unlink', args);
      return { content: [{ type: 'text', text: 'MCP server unlinked from config.' }] };
    },
  );
}
