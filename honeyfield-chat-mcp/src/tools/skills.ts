import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getClient } from '../client.js';

export function registerSkillsTools(server: McpServer) {
  server.tool(
    'honeyfield_chat_skills_list',
    'List all skills for an organization',
    { organizationId: z.string().describe('Organization UUID') },
    async ({ organizationId }) => {
      const data = await getClient().get('/skills', { organizationId });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_get',
    'Get a skill by ID',
    { id: z.string().describe('Skill UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/skills/${id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_create',
    'Create a new skill',
    {
      organizationId: z.string().describe('Organization UUID'),
      name: z.string().describe('Skill name (max 100 chars)'),
      description: z.string().describe('What this skill does'),
      version: z.string().describe('Semantic version (e.g. "1.0.0")'),
      systemPrompt: z.string().describe('System prompt for the skill'),
      triggerDescription: z.string().describe('When this skill should be triggered'),
      triggerKeywords: z.array(z.string()).optional().describe('Keywords that trigger this skill'),
      fewShotExamples: z.array(z.object({
        user: z.string().describe('Example user message'),
        assistant: z.string().describe('Example assistant response'),
      })).optional().describe('Few-shot examples'),
      tools: z.array(z.object({
        name: z.string().describe('Tool name'),
        description: z.string().describe('Tool description'),
        parametersSchema: z.record(z.unknown()).describe('JSON Schema for parameters'),
      })).optional().describe('Tool definitions'),
      script: z.object({
        runtime: z.enum(['node', 'python']).describe('Script runtime'),
        code: z.string().describe('Script source code'),
        entryFunction: z.string().describe('Entry function name'),
        timeout: z.number().min(1).describe('Timeout in seconds'),
        envVars: z.record(z.string()).optional().describe('Environment variables'),
      }).optional().describe('Executable script definition'),
    },
    async (args) => {
      const data = await getClient().post('/skills', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_update',
    'Update a skill. All fields optional — send only what to change.',
    {
      id: z.string().describe('Skill UUID to update'),
      name: z.string().optional().describe('Skill name'),
      description: z.string().optional().describe('Skill description'),
      version: z.string().optional().describe('Version'),
      systemPrompt: z.string().optional().describe('System prompt'),
      triggerDescription: z.string().optional().describe('Trigger description'),
      triggerKeywords: z.array(z.string()).optional().describe('Trigger keywords'),
      fewShotExamples: z.array(z.object({
        user: z.string(),
        assistant: z.string(),
      })).optional().describe('Few-shot examples'),
      tools: z.array(z.object({
        name: z.string(),
        description: z.string(),
        parametersSchema: z.record(z.unknown()),
      })).optional().describe('Tool definitions'),
      script: z.object({
        runtime: z.enum(['node', 'python']),
        code: z.string(),
        entryFunction: z.string(),
        timeout: z.number().min(1),
        envVars: z.record(z.string()).optional(),
      }).optional().describe('Script definition'),
    },
    async ({ id, ...body }) => {
      const data = await getClient().put(`/skills/${id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_delete',
    'Delete a skill by ID',
    { id: z.string().describe('Skill UUID to delete') },
    async ({ id }) => {
      await getClient().delete(`/skills/${id}`);
      return { content: [{ type: 'text', text: `Skill ${id} deleted.` }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_list_files',
    'List files in a skill package',
    { id: z.string().describe('Skill UUID') },
    async ({ id }) => {
      const data = await getClient().get(`/skills/${id}/files`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_get_file',
    'Get the content of a specific file in a skill package',
    {
      id: z.string().describe('Skill UUID'),
      path: z.string().describe('File path within the skill package'),
    },
    async ({ id, path }) => {
      const data = await getClient().get(`/skills/${id}/files/${path}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_config_list',
    'List skills attached to a config',
    { configId: z.string().describe('Config UUID') },
    async ({ configId }) => {
      const data = await getClient().get(`/skills/config/${configId}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_config_attach',
    'Attach or update a skill on a config',
    {
      configId: z.string().describe('Config UUID'),
      skillId: z.string().describe('Skill UUID'),
      enabled: z.boolean().describe('Whether the skill is enabled'),
      priority: z.number().min(0).describe('Priority (higher = preferred)'),
    },
    async (args) => {
      const data = await getClient().post('/skills/config', args);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'honeyfield_chat_skills_config_detach',
    'Remove a skill from a config',
    {
      configId: z.string().describe('Config UUID'),
      skillId: z.string().describe('Skill UUID'),
    },
    async ({ configId, skillId }) => {
      await getClient().delete(`/skills/config/${configId}/${skillId}`);
      return { content: [{ type: 'text', text: `Skill ${skillId} detached from config ${configId}.` }] };
    },
  );
}
