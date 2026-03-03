import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerComponentsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_components_list',
    'List custom UI components for a config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/configs/${configId}/components`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_components_create',
    'Create a custom UI component for a config',
    {
      configId: z.string().describe('Config UUID'),
      name: z.string().describe('Component name (max 100 chars)'),
      triggerKey: z.string().describe('Trigger key for the component (max 100 chars)'),
      jsx: z.string().describe('JSX source code for the component'),
      propsSchema: z.record(z.unknown()).describe('JSON Schema for component props'),
      description: z.string().describe('What this component does'),
      previewProps: z.record(z.unknown()).optional().describe('Example props for preview'),
    },
    async ({ configId, ...body }) => {
      const data = await getClient().post(`/configs/${configId}/components`, { configId, ...body });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_components_update',
    'Update a custom UI component. All fields optional.',
    {
      id: z.string().describe('Component UUID to update'),
      name: z.string().optional().describe('Component name'),
      triggerKey: z.string().optional().describe('Trigger key'),
      jsx: z.string().optional().describe('JSX source code'),
      propsSchema: z.record(z.unknown()).optional().describe('Props JSON Schema'),
      description: z.string().optional().describe('Description'),
      previewProps: z.record(z.unknown()).optional().describe('Preview props'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/components/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_components_delete',
    'Delete a custom UI component',
    { id: z.string().describe('Component UUID to delete') },
    async ({ id }) => {
      await getClient().delete(`/components/${id}`);
      return { content: [{ type: 'text', text: `Component ${id} deleted.` }] };
    },
  );
}
