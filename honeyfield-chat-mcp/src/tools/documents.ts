import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerDocumentsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_documents_list',
    'List documents for a config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/configs/${configId}/documents`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_documents_delete',
    'Delete a document and its chunks',
    { id: z.string().describe('Document UUID') },
    async ({ id }) => {
      await getClient().delete(`/documents/${id}`);
      return { content: [{ type: 'text', text: `Document ${id} deleted.` }] };
    },
  );

  server.tool(
    'honeyfield_chat_documents_ingest',
    'Trigger document ingestion (re-process into chunks)',
    { id: z.string().describe('Document UUID') },
    async ({ id }) => {
      const data = await getClient().post(`/documents/${id}/ingest`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
}
