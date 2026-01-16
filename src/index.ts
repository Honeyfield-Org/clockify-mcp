#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClockifyClient } from './clockify-client.js';
import { registerWorkspaceTools } from './tools/workspaces.js';
import { registerTimeEntryTools } from './tools/time-entries.js';
import { registerProjectTools } from './tools/projects.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerClientTools } from './tools/clients.js';
import { registerTagTools } from './tools/tags.js';
import { registerUserTools } from './tools/users.js';
import { registerReportTools } from './tools/reports.js';

async function main(): Promise<void> {
  const server = new McpServer({
    name: 'clockify-mcp',
    version: '1.0.0',
  });

  let client;
  try {
    client = createClockifyClient();
  } catch (error) {
    console.error('Failed to initialize Clockify client:', error);
    process.exit(1);
  }

  registerWorkspaceTools(server, client);
  registerTimeEntryTools(server, client);
  registerProjectTools(server, client);
  registerTaskTools(server, client);
  registerClientTools(server, client);
  registerTagTools(server, client);
  registerUserTools(server, client);
  registerReportTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
