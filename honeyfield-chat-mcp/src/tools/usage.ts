import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerUsageTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_usage_cards',
    'Get usage summary cards (today + month) for a config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/configs/${configId}/usage`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_usage_daily',
    'Get daily usage chart data for a config',
    {
      configId: z.string().describe('Config UUID'),
      days: z.number().optional().describe('Number of days (default 30)'),
    },
    async ({ configId, days }) => {
      const data = await getClient().get('/usage/daily', { configId, days });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_usage_summary',
    'Get aggregated usage summary with daily, model, and agent breakdowns',
    {
      organizationId: z.string().describe('Organization UUID'),
      days: z.number().optional().describe('Number of days for current period (default 30)'),
      configId: z.string().optional().describe('Optional config filter'),
    },
    async ({ organizationId, days, configId }) => {
      const data = await getClient().get('/usage/summary', { organizationId, days, configId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_pricing_list',
    'Get the model pricing table',
    {},
    async () => {
      const data = await getClient().get('/pricing');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_pricing_update',
    'Update a model pricing entry',
    {
      id: z.string().describe('Pricing entry UUID'),
      modelId: z.string().optional().describe('Model identifier'),
      provider: z.string().optional().describe('Provider name'),
      displayName: z.string().optional().describe('Display name'),
      inputPricePer1m: z.number().min(0).optional().describe('Input price per 1M tokens'),
      outputPricePer1m: z.number().min(0).optional().describe('Output price per 1M tokens'),
      effectiveFrom: z.string().optional().describe('Effective from date (ISO string)'),
      effectiveUntil: z.string().optional().describe('Effective until date (ISO string)'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/pricing/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
}
