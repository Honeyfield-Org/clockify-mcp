import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ClockifyClient } from '../clockify-client.js';

const filterEntitySchema = z
  .object({
    ids: z.array(z.string()).optional().describe('Array of IDs to filter'),
    contains: z
      .enum(['CONTAINS', 'DOES_NOT_CONTAIN'])
      .optional()
      .describe('Filter type'),
    status: z
      .enum(['ALL', 'ACTIVE', 'ARCHIVED'])
      .optional()
      .describe('Status filter'),
  })
  .optional();

export function registerReportTools(
  server: McpServer,
  client: ClockifyClient
): void {
  server.tool(
    'get_detailed_report',
    'Get a detailed time report',
    {
      workspaceId: z.string().describe('The workspace ID'),
      dateRangeStart: z.string().describe('Start date (ISO 8601 format)'),
      dateRangeEnd: z.string().describe('End date (ISO 8601 format)'),
      description: z.string().optional().describe('Filter by description'),
      rounding: z.boolean().optional().describe('Apply rounding'),
      sortOrder: z
        .enum(['ASCENDING', 'DESCENDING'])
        .optional()
        .describe('Sort order'),
      users: filterEntitySchema.describe('User filter'),
      clients: filterEntitySchema.describe('Client filter'),
      projects: filterEntitySchema.describe('Project filter'),
      tasks: filterEntitySchema.describe('Task filter'),
      tags: filterEntitySchema.describe('Tag filter'),
      billable: z
        .enum(['BOTH', 'BILLABLE', 'NOT_BILLABLE'])
        .optional()
        .describe('Billable filter'),
      page: z.number().optional().describe('Page number'),
      pageSize: z.number().optional().describe('Items per page'),
    },
    async ({ workspaceId, page, pageSize, ...params }) => {
      const report = await client.getDetailedReport(workspaceId, {
        ...params,
        detailedFilter: page !== undefined || pageSize !== undefined
          ? { page: page ?? 1, pageSize: pageSize ?? 50 }
          : undefined,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_summary_report',
    'Get a summary time report',
    {
      workspaceId: z.string().describe('The workspace ID'),
      dateRangeStart: z.string().describe('Start date (ISO 8601 format)'),
      dateRangeEnd: z.string().describe('End date (ISO 8601 format)'),
      groups: z
        .array(z.string())
        .optional()
        .describe('Grouping fields (e.g., ["USER", "PROJECT"])'),
      description: z.string().optional().describe('Filter by description'),
      rounding: z.boolean().optional().describe('Apply rounding'),
      sortOrder: z
        .enum(['ASCENDING', 'DESCENDING'])
        .optional()
        .describe('Sort order'),
      users: filterEntitySchema.describe('User filter'),
      clients: filterEntitySchema.describe('Client filter'),
      projects: filterEntitySchema.describe('Project filter'),
      tasks: filterEntitySchema.describe('Task filter'),
      tags: filterEntitySchema.describe('Tag filter'),
      billable: z
        .enum(['BOTH', 'BILLABLE', 'NOT_BILLABLE'])
        .optional()
        .describe('Billable filter'),
    },
    async ({ workspaceId, groups, ...params }) => {
      const report = await client.getSummaryReport(workspaceId, {
        ...params,
        summaryFilter: groups ? { groups } : undefined,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'get_weekly_report',
    'Get a weekly time report',
    {
      workspaceId: z.string().describe('The workspace ID'),
      dateRangeStart: z.string().describe('Start date (ISO 8601 format)'),
      dateRangeEnd: z.string().describe('End date (ISO 8601 format)'),
      group: z.string().optional().describe('Grouping field (e.g., "PROJECT")'),
      subgroup: z.string().optional().describe('Subgrouping field'),
      description: z.string().optional().describe('Filter by description'),
      rounding: z.boolean().optional().describe('Apply rounding'),
      users: filterEntitySchema.describe('User filter'),
      clients: filterEntitySchema.describe('Client filter'),
      projects: filterEntitySchema.describe('Project filter'),
      tasks: filterEntitySchema.describe('Task filter'),
      tags: filterEntitySchema.describe('Tag filter'),
      billable: z
        .enum(['BOTH', 'BILLABLE', 'NOT_BILLABLE'])
        .optional()
        .describe('Billable filter'),
    },
    async ({ workspaceId, group, subgroup, ...params }) => {
      const report = await client.getWeeklyReport(workspaceId, {
        ...params,
        weeklyFilter: group ? { group, subgroup } : undefined,
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    }
  );

  server.tool(
    'list_shared_reports',
    'List shared reports in a workspace',
    {
      workspaceId: z.string().describe('The workspace ID'),
    },
    async ({ workspaceId }) => {
      const reports = await client.getSharedReports(workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(reports, null, 2),
          },
        ],
      };
    }
  );
}
