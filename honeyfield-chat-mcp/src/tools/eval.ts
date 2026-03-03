import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerEvalTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_eval_list',
    'List eval configs for a chat config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/configs/${configId}/evals`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_eval_get',
    'Get an eval config by ID',
    { id: z.string().describe('Eval config UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/evals/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_eval_create',
    'Create an eval config with promptfoo YAML',
    {
      configId: z.string().describe('Config UUID'),
      promptfooYaml: z.string().describe('Promptfoo YAML configuration'),
    },
    async ({ configId, promptfooYaml }) => {
      const data = await getClient().post(`/configs/${configId}/evals`, { configId, promptfooYaml });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_eval_update',
    'Update an eval config',
    {
      id: z.string().describe('Eval config UUID'),
      promptfooYaml: z.string().optional().describe('Promptfoo YAML configuration'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/evals/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_eval_delete',
    'Delete an eval config',
    { id: z.string().describe('Eval config UUID') },
    async ({ id }) => {
      await getClient().delete(`/evals/${id}`);
      return { content: [{ type: 'text', text: `Eval config ${id} deleted.` }] };
    },
  );

  server.tool(
    'honeyfield_chat_eval_run',
    'Trigger a promptfoo eval run against a config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().post(`/configs/${configId}/evals/run`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
}
