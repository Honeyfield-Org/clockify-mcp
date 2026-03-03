import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerConfigsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_configs_list',
    'List all chat configs for an organization',
    { organizationId: z.string().describe('Organization UUID') },
    async ({ organizationId }) => {
      const data = await getClient().get('/configs', { organizationId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_configs_get',
    'Get a chat config by ID',
    { id: z.string().describe('Config UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/configs/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_configs_create',
    'Create a new chat config. Requires all fields for theme, widgetUx, rag, orchestrator, persistence.',
    {
      organizationId: z.string().describe('Organization UUID'),
      name: z.string().describe('Config name (max 100 chars)'),
      slug: z.string().describe('URL-friendly slug (max 100 chars)'),
      model: z.string().describe('LLM model ID (e.g. "gpt-4o")'),
      systemPrompt: z.string().describe('System prompt for the chat'),
      temperature: z.number().min(0).max(2).describe('Temperature (0-2)'),
      maxTokens: z.number().min(1).describe('Max tokens per response'),
      theme: z.object({
        primaryColor: z.string().describe('Hex color, e.g. "#6366f1"'),
        logo: z.string().optional().describe('Logo URL'),
        welcomeMessage: z.string().describe('Welcome message'),
        chatTitle: z.string().describe('Chat window title'),
        inputPlaceholder: z.string().describe('Input placeholder text'),
        darkMode: z.enum(['auto', 'light', 'dark']).describe('Dark mode setting'),
      }).describe('Theme configuration'),
      widgetUx: z.object({
        starterQuestions: z.array(z.string()).describe('Suggested starter questions'),
        showAgentStatus: z.boolean().describe('Show which agent is responding'),
        showSourceAttribution: z.boolean().describe('Show RAG source links'),
        enableFeedback: z.boolean().describe('Allow thumbs up/down'),
        enableCopyButton: z.boolean().describe('Allow copy message'),
        enableNewChat: z.boolean().describe('Show new chat button'),
        widgetMode: z.enum(['embedded', 'floating', 'fullscreen']).describe('Widget display mode'),
        locale: z.enum(['de', 'en']).describe('Widget language'),
        fallbackContactUrl: z.string().optional().describe('Fallback contact URL'),
      }).describe('Widget UX configuration'),
      rag: z.object({
        enabled: z.boolean().describe('Enable RAG'),
        topK: z.number().min(1).max(20).describe('Number of chunks to retrieve'),
        similarityThreshold: z.number().min(0).max(1).describe('Min similarity score'),
        embeddingModel: z.string().describe('Embedding model ID'),
        chunkSize: z.number().min(100).describe('Chunk size in tokens'),
        chunkOverlap: z.number().min(0).describe('Chunk overlap in tokens'),
      }).describe('RAG configuration'),
      orchestrator: z.object({
        routingStrategy: z.enum(['single', 'keyword', 'llm', 'hybrid']).describe('Agent routing strategy'),
        routingPrompt: z.string().optional().describe('Custom routing prompt'),
        fallbackAgent: z.string().describe('Fallback agent ID'),
        maxDelegations: z.number().min(1).max(10).describe('Max agent delegations per turn'),
      }).describe('Orchestrator configuration'),
      persistence: z.object({
        enabled: z.boolean().describe('Enable conversation persistence'),
        retentionDays: z.number().nullable().describe('Days to retain (null = forever)'),
        anonymize: z.boolean().describe('Anonymize stored data'),
      }).describe('Persistence configuration'),
      limits: z.object({
        maxSessionsPerDay: z.number().optional().describe('Max sessions per day'),
        maxTokensPerSession: z.number().optional().describe('Max tokens per session'),
        monthlyBudgetUsd: z.number().optional().describe('Monthly budget in USD'),
        alertEmail: z.string().optional().describe('Alert email address'),
      }).optional().describe('Usage limits (optional)'),
      deploymentStatus: z.enum(['draft', 'deployed', 'paused']).describe('Deployment status'),
      allowedDomains: z.array(z.string()).describe('Allowed widget embed domains'),
    },
    async (args) => {
      const data = await getClient().post('/configs', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_configs_update',
    'Update a chat config. All fields are optional — only send what you want to change.',
    {
      id: z.string().describe('Config UUID to update'),
      name: z.string().optional().describe('Config name'),
      slug: z.string().optional().describe('URL-friendly slug'),
      model: z.string().optional().describe('LLM model ID'),
      systemPrompt: z.string().optional().describe('System prompt'),
      temperature: z.number().min(0).max(2).optional().describe('Temperature'),
      maxTokens: z.number().min(1).optional().describe('Max tokens'),
      theme: z.object({
        primaryColor: z.string().optional(),
        logo: z.string().optional(),
        welcomeMessage: z.string().optional(),
        chatTitle: z.string().optional(),
        inputPlaceholder: z.string().optional(),
        darkMode: z.enum(['auto', 'light', 'dark']).optional(),
      }).optional().describe('Theme configuration (partial)'),
      widgetUx: z.object({
        starterQuestions: z.array(z.string()).optional(),
        showAgentStatus: z.boolean().optional(),
        showSourceAttribution: z.boolean().optional(),
        enableFeedback: z.boolean().optional(),
        enableCopyButton: z.boolean().optional(),
        enableNewChat: z.boolean().optional(),
        widgetMode: z.enum(['embedded', 'floating', 'fullscreen']).optional(),
        locale: z.enum(['de', 'en']).optional(),
        fallbackContactUrl: z.string().optional(),
      }).optional().describe('Widget UX configuration (partial)'),
      rag: z.object({
        enabled: z.boolean().optional(),
        topK: z.number().min(1).max(20).optional(),
        similarityThreshold: z.number().min(0).max(1).optional(),
        embeddingModel: z.string().optional(),
        chunkSize: z.number().min(100).optional(),
        chunkOverlap: z.number().min(0).optional(),
      }).optional().describe('RAG configuration (partial)'),
      orchestrator: z.object({
        routingStrategy: z.enum(['single', 'keyword', 'llm', 'hybrid']).optional(),
        routingPrompt: z.string().optional(),
        fallbackAgent: z.string().optional(),
        maxDelegations: z.number().min(1).max(10).optional(),
      }).optional().describe('Orchestrator configuration (partial)'),
      persistence: z.object({
        enabled: z.boolean().optional(),
        retentionDays: z.number().nullable().optional(),
        anonymize: z.boolean().optional(),
      }).optional().describe('Persistence configuration (partial)'),
      limits: z.object({
        maxSessionsPerDay: z.number().optional(),
        maxTokensPerSession: z.number().optional(),
        monthlyBudgetUsd: z.number().optional(),
        alertEmail: z.string().optional(),
      }).optional().describe('Usage limits (partial)'),
      deploymentStatus: z.enum(['draft', 'deployed', 'paused']).optional(),
      allowedDomains: z.array(z.string()).optional(),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/configs/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_configs_delete',
    'Delete a chat config by ID',
    { id: z.string().describe('Config UUID to delete') },
    async ({ id }) => {
      await getClient().delete(`/configs/${id}`);
      return { content: [{ type: 'text', text: `Config ${id} deleted.` }] };
    },
  );

  server.tool(
    'honeyfield_chat_configs_deploy',
    'Deploy a chat config (publish it live)',
    { id: z.string().describe('Config UUID to deploy') },
    async ({ id }) => {
      const data = await getClient().post(`/configs/${id}/deploy`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );
}
