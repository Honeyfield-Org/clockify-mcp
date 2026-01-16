# @honeyfield/clockify-mcp

MCP Server for Clockify Time Tracking API with full API coverage.

## Installation

```bash
npm install -g @honeyfield/clockify-mcp
```

Or use directly with npx:

```bash
npx @honeyfield/clockify-mcp
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLOCKIFY_API_KEY` | Yes | - | Your Clockify API key |
| `CLOCKIFY_REGION` | No | `euc1` | API region (see below) |
| `CLOCKIFY_WORKSPACE_ID` | No | - | Default workspace ID |

### Regions

| Region | Description |
|--------|-------------|
| `global` | Global (api.clockify.me) |
| `euc1` | EU (euc1.clockify.me) - Default |
| `use2` | USA (use2.clockify.me) |
| `euw2` | UK (euw2.clockify.me) |
| `apse2` | Australia (apse2.clockify.me) |

## Usage with Claude Desktop / Claude Code

Add to your Claude configuration:

```json
{
  "mcpServers": {
    "clockify": {
      "command": "npx",
      "args": ["@honeyfield/clockify-mcp"],
      "env": {
        "CLOCKIFY_API_KEY": "<your-api-key>",
        "CLOCKIFY_REGION": "euc1"
      }
    }
  }
}
```

## Available Tools (37 total)

### Workspaces (3 tools)

| Tool | Description |
|------|-------------|
| `list_workspaces` | List all workspaces |
| `get_workspace` | Get workspace details |
| `get_current_workspace` | Get current/default workspace |

### Time Entries (8 tools)

| Tool | Description |
|------|-------------|
| `list_time_entries` | List time entries with filters |
| `get_time_entry` | Get single time entry |
| `create_time_entry` | Create new time entry |
| `update_time_entry` | Update time entry |
| `delete_time_entry` | Delete time entry |
| `start_timer` | Start running timer |
| `stop_timer` | Stop running timer |
| `get_running_timer` | Get currently running timer |

### Projects (6 tools)

| Tool | Description |
|------|-------------|
| `list_projects` | List projects with filters |
| `get_project` | Get project details |
| `create_project` | Create new project |
| `update_project` | Update project |
| `delete_project` | Delete (archive) project |
| `add_project_member` | Add user to project |

### Tasks (5 tools)

| Tool | Description |
|------|-------------|
| `list_tasks` | List project tasks |
| `get_task` | Get task details |
| `create_task` | Create new task |
| `update_task` | Update task |
| `delete_task` | Delete task |

### Clients (4 tools)

| Tool | Description |
|------|-------------|
| `list_clients` | List clients |
| `get_client` | Get client details |
| `create_client` | Create new client |
| `delete_client` | Delete (archive) client |

### Tags (4 tools)

| Tool | Description |
|------|-------------|
| `list_tags` | List tags |
| `get_tag` | Get tag details |
| `create_tag` | Create new tag |
| `delete_tag` | Delete tag |

### Users (3 tools)

| Tool | Description |
|------|-------------|
| `get_current_user` | Get current user |
| `list_workspace_users` | List workspace members |
| `get_user` | Get user details |

### Reports (4 tools)

| Tool | Description |
|------|-------------|
| `get_detailed_report` | Get detailed time report |
| `get_summary_report` | Get summary report |
| `get_weekly_report` | Get weekly report |
| `list_shared_reports` | List shared reports |

## Getting Your API Key

1. Log in to Clockify
2. Go to Profile Settings
3. Navigate to "API" section
4. Click "Generate" to create a new API key

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run in development
npm run dev

# Test with MCP Inspector
npm run inspect
```

## License

MIT
