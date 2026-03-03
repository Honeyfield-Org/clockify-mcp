#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerConfigsTools } from './tools/configs.js';
import { registerAgentsTools } from './tools/agents.js';
import { registerSkillsTools } from './tools/skills.js';
import { registerDocumentsTools } from './tools/documents.js';
import { registerComponentsTools } from './tools/components.js';
import { registerMcpServersTools } from './tools/mcp-servers.js';
import { registerApiKeysTools } from './tools/api-keys.js';
import { registerConversationsTools } from './tools/conversations.js';
import { registerUsageTools } from './tools/usage.js';
import { registerEvalTools } from './tools/eval.js';

// Validate environment
if (!process.env.HONEYFIELD_API_KEY) {
  console.error('Error: HONEYFIELD_API_KEY environment variable is required');
  console.error('  export HONEYFIELD_API_KEY=hf_your_key_here');
  process.exit(1);
}

// Create MCP server
const server = new McpServer({
  name: 'honeyfield-chat-mcp',
  version: '1.0.0',
});

// Register all tools
registerConfigsTools(server);
registerAgentsTools(server);
registerSkillsTools(server);
registerDocumentsTools(server);
registerComponentsTools(server);
registerMcpServersTools(server);
registerApiKeysTools(server);
registerConversationsTools(server);
registerUsageTools(server);
registerEvalTools(server);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Honeyfield Chat MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
