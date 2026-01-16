import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

export function registerClientTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'list_clients',
    'List clients in a workspace',
    {
      workspaceId: z.string().describe('The workspace ID'),
      archived: z.boolean().optional().describe('Filter by archived status'),
      name: z.string().optional().describe('Filter by client name'),
      page: z.number().optional().describe('Page number for pagination'),
      pageSize: z.number().optional().describe('Number of items per page'),
    },
    async ({ workspaceId, ...params }) => {
      const clients = await client.getClients(workspaceId, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clients, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_client',
    'Get details of a specific client',
    {
      workspaceId: z.string().describe('The workspace ID'),
      clientId: z.string().describe('The client ID'),
    },
    async ({ workspaceId, clientId }) => {
      const clientData = await client.getClient(workspaceId, clientId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientData, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'create_client',
    'Create a new client',
    {
      workspaceId: z.string().describe('The workspace ID'),
      name: z.string().describe('Client name'),
      email: z.string().optional().describe('Client email'),
      address: z.string().optional().describe('Client address'),
      note: z.string().optional().describe('Client note'),
    },
    async ({ workspaceId, ...data }) => {
      const clientData = await client.createClient(workspaceId, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(clientData, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'delete_client',
    'Delete (archive) a client',
    {
      workspaceId: z.string().describe('The workspace ID'),
      clientId: z.string().describe('The client ID'),
    },
    async ({ workspaceId, clientId }) => {
      await client.deleteClient(workspaceId, clientId);
      return {
        content: [
          {
            type: 'text',
            text: `Client ${clientId} deleted successfully`,
          },
        ],
      };
    }
  );
}
