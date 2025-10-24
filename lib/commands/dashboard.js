/**
 * LEO Dashboard Command
 * Start the real-time API server for dashboard access
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const APIServer = require('../team/api-server');
const { HuntCycleTracker } = require('../team/tracker');
const { ConfigurationManager } = require('../team/config-manager');

/**
 * Dashboard Commands Handler
 */
class DashboardCommands {
  /**
   * Start the dashboard API server
   * Usage: leo dashboard start
   */
  static async start(options = {}) {
    const port = options.port || process.env.LEO_API_PORT || 3000;
    const host = options.host || process.env.LEO_API_HOST || 'localhost';
    const projectPath = options.projectPath || '.';

    console.log(chalk.cyan.bold('\n🚀 LEO Dashboard API Server\n'));

    try {
      // Load project configuration
      console.log(chalk.gray('Loading project configuration...'));
      const configManager = new ConfigurationManager(projectPath);
      const config = await configManager.load();

      if (!config) {
        console.error(chalk.red('❌ No LEO configuration found. Run "leo init" first.'));
        console.log(chalk.yellow('   Or specify a project path with --project <path>\n'));
        process.exit(1);
      }

      // Load hunt tracker
      console.log(chalk.gray('Loading hunt data...'));
      const tracker = await HuntCycleTracker.load(projectPath);

      // Create API server with config and tracker
      const server = new APIServer({
        port,
        host,
        config,
        tracker,
        projectPath
      });

      // Setup event listeners for server lifecycle
      server.on('ready', () => {
        console.log(chalk.green.bold('✅ Dashboard API Server Started!\n'));
        console.log(chalk.cyan('📊 API Information:'));
        console.log(chalk.gray(`   URL: http://${host}:${port}`));
        console.log(chalk.gray(`   WebSocket: ws://${host}:${port}`));
        console.log(chalk.gray(`   Docs: http://${host}:${port}/api/docs\n`));

        console.log(chalk.cyan('📚 Available Endpoints:'));
        console.log(chalk.gray('   Team:'));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/team`));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/team/members`));
        console.log(chalk.gray('   Hunts:'));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/hunts`));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/hunts/:id`));
        console.log(chalk.gray(`     POST http://${host}:${port}/api/hunts`));
        console.log(chalk.gray('   Analytics:'));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/analytics`));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/analytics/hunts`));
        console.log(chalk.gray(`     GET  http://${host}:${port}/api/analytics/performance\n`));

        console.log(chalk.cyan('🔌 WebSocket Events:'));
        console.log(chalk.gray('   hunt:created - New hunt created'));
        console.log(chalk.gray('   hunt:updated - Hunt updated'));
        console.log(chalk.gray('   hunt:phase-changed - Hunt phase transitioned'));
        console.log(chalk.gray('   hunt:completed - Hunt completed\n'));

        console.log(chalk.yellow('Press Ctrl+C to stop the server\n'));
      });

      server.on('error', (error) => {
        console.error(chalk.red.bold('❌ Server Error:'));
        console.error(chalk.red(error.message));
        console.log(chalk.yellow('   Attempting restart...\n'));
      });

      server.on('hunt:created', (hunt) => {
        console.log(chalk.green(`✨ New hunt created: ${hunt.id} - ${hunt.name}`));
      });

      server.on('hunt:updated', (hunt) => {
        console.log(chalk.blue(`🔄 Hunt updated: ${hunt.id}`));
      });

      server.on('hunt:phase-changed', (hunt) => {
        console.log(chalk.cyan(`📍 Hunt phase changed: ${hunt.id} → ${hunt.currentPhase}`));
      });

      server.on('hunt:completed', (hunt) => {
        console.log(chalk.green.bold(`✅ Hunt completed: ${hunt.id} - ${hunt.name}`));
      });

      // Handle graceful shutdown
      const handleShutdown = async (signal) => {
        console.log(chalk.yellow(`\n\n📵 ${signal} received, shutting down gracefully...\n`));
        try {
          await server.stop();
          console.log(chalk.green('✅ Server stopped cleanly\n'));
          process.exit(0);
        } catch (error) {
          console.error(chalk.red(`Error during shutdown: ${error.message}\n`));
          process.exit(1);
        }
      };

      process.on('SIGINT', () => handleShutdown('SIGINT'));
      process.on('SIGTERM', () => handleShutdown('SIGTERM'));

      // Start the server
      await server.start();

      // Keep process running
      await new Promise(() => {});
    } catch (error) {
      console.error(chalk.red.bold('❌ Failed to start dashboard:\n'));
      console.error(chalk.red(`${error.message}\n`));

      if (error.stack && process.env.DEBUG) {
        console.error(chalk.gray(error.stack));
      }

      process.exit(1);
    }
  }

  /**
   * Stop the dashboard API server
   * Usage: leo dashboard stop
   */
  static async stop(options = {}) {
    console.log(chalk.yellow('Stopping dashboard API server...\n'));
    // This is handled by process signals above
    // This command is mainly for documentation
    console.log(chalk.cyan('To stop the running server, press Ctrl+C\n'));
  }

  /**
   * Show dashboard status
   * Usage: leo dashboard status
   */
  static async status(options = {}) {
    const port = options.port || process.env.LEO_API_PORT || 3000;
    const host = options.host || process.env.LEO_API_HOST || 'localhost';

    console.log(chalk.cyan.bold('\n📊 Dashboard Status\n'));

    try {
      const response = await fetch(`http://${host}:${port}/api/status`, {
        timeout: 5000
      });

      if (response.ok) {
        const status = await response.json();
        console.log(chalk.green.bold('✅ API Server is Running\n'));
        console.log(chalk.cyan('Status Information:'));
        console.log(chalk.gray(`   URL: http://${host}:${port}`));
        console.log(chalk.gray(`   Connected Clients: ${status.connectedClients || 0}`));
        console.log(chalk.gray(`   Hunts: ${status.hunts || 0}`));
        console.log(chalk.gray(`   Team Members: ${status.teamMembers || 0}`));
        console.log(chalk.gray(`   Uptime: ${status.uptime || 'unknown'}\n`));
      } else {
        console.error(chalk.red('❌ API Server not responding\n'));
      }
    } catch (error) {
      console.error(chalk.red.bold('❌ API Server is not running\n'));
      console.log(chalk.cyan('Start it with: leo dashboard start\n'));
    }
  }

  /**
   * Open dashboard in browser
   * Usage: leo dashboard open
   */
  static async open(options = {}) {
    const port = options.port || process.env.LEO_API_PORT || 3000;
    const host = options.host || process.env.LEO_API_HOST || 'localhost';
    const url = `http://${host}:${port}`;

    console.log(chalk.cyan.bold('\n🌐 Opening Dashboard\n'));

    try {
      // Try to check if server is running
      const response = await fetch(`${url}/api/status`, {
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error('Server not responding');
      }

      console.log(chalk.green(`✅ Dashboard API Server running at: ${url}\n`));

      // Try to open in browser
      const { exec } = require('child_process');
      const platform = process.platform;

      let command;
      if (platform === 'win32') {
        command = `start ${url}`;
      } else if (platform === 'darwin') {
        command = `open ${url}`;
      } else {
        command = `xdg-open ${url}`;
      }

      exec(command, (error) => {
        if (error) {
          console.log(chalk.cyan(`   Open your browser to: ${url}\n`));
        } else {
          console.log(chalk.gray(`   Opened in default browser\n`));
        }
      });
    } catch (error) {
      console.error(chalk.red.bold('❌ Dashboard API Server is not running\n'));
      console.log(chalk.cyan('Start it with: leo dashboard start\n'));
    }
  }

  /**
   * Generate OpenAPI documentation
   * Usage: leo dashboard docs
   */
  static async docs(options = {}) {
    console.log(chalk.cyan.bold('\n📚 Dashboard API Documentation\n'));

    const docsContent = `
# LEO Dashboard API Reference

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## REST Endpoints

### Team Endpoints

#### GET /api/team
Get team information

**Response:**
\`\`\`json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "members": [],
  "createdAt": "2025-10-24T00:00:00Z",
  "updatedAt": "2025-10-24T00:00:00Z"
}
\`\`\`

#### GET /api/team/members
Get all team members

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "currentHunt": "string|null",
    "joinedAt": "2025-10-24T00:00:00Z"
  }
]
\`\`\`

### Hunt Endpoints

#### GET /api/hunts
Get all hunts

**Query Parameters:**
- \`status\` (optional): Filter by status (active, completed, archived)
- \`owner\` (optional): Filter by owner ID

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "owner": "string",
    "status": "active|completed|archived",
    "currentPhase": "ideation|validation|implementation|release",
    "progress": 0-100,
    "createdAt": "2025-10-24T00:00:00Z",
    "updatedAt": "2025-10-24T00:00:00Z",
    "completedAt": "2025-10-24T00:00:00Z|null"
  }
]
\`\`\`

#### GET /api/hunts/:id
Get hunt details

**Response:** Single hunt object

#### GET /api/hunts/:id/phases
Get hunt phase information

**Response:**
\`\`\`json
{
  "huntId": "string",
  "phases": [
    {
      "phase": "ideation",
      "startedAt": "2025-10-24T00:00:00Z",
      "completedAt": "2025-10-24T00:00:00Z|null",
      "durationMs": 3600000
    }
  ]
}
\`\`\`

#### POST /api/hunts
Create new hunt

**Request Body:**
\`\`\`json
{
  "name": "string",
  "description": "string",
  "owner": "string",
  "priority": "Low|Medium|High|Critical"
}
\`\`\`

**Response:** Created hunt object

#### PUT /api/hunts/:id
Update hunt

**Request Body:**
\`\`\`json
{
  "name": "string|undefined",
  "description": "string|undefined",
  "status": "active|completed|archived|undefined"
}
\`\`\`

**Response:** Updated hunt object

#### POST /api/hunts/:id/phase-next
Advance hunt to next phase

**Response:** Updated hunt object with new phase

#### POST /api/hunts/:id/complete
Mark hunt as completed

**Response:** Completed hunt object

### Analytics Endpoints

#### GET /api/analytics
Get team analytics

**Response:**
\`\`\`json
{
  "totalHunts": 10,
  "activeHunts": 3,
  "completedHunts": 7,
  "totalDuration": 3600000,
  "averageHuntDuration": 360000,
  "teamMembers": 5,
  "successRate": 85
}
\`\`\`

#### GET /api/analytics/hunts
Get hunt-specific analytics

**Response:**
\`\`\`json
{
  "byStatus": {
    "active": 3,
    "completed": 7,
    "archived": 0
  },
  "byPhase": {
    "ideation": 1,
    "validation": 1,
    "implementation": 1,
    "release": 0
  },
  "byPriority": {
    "Low": 2,
    "Medium": 5,
    "High": 2,
    "Critical": 1
  }
}
\`\`\`

#### GET /api/analytics/performance
Get team performance metrics

**Response:**
\`\`\`json
{
  "members": [
    {
      "name": "string",
      "huntsCompleted": 5,
      "averageDuration": 360000,
      "successRate": 90
    }
  ],
  "trends": {
    "completionRate": 0.85,
    "avgPhaseTime": {
      "ideation": 86400000,
      "validation": 172800000,
      "implementation": 604800000,
      "release": 86400000
    }
  }
}
\`\`\`

## WebSocket Events

Connect to the WebSocket server at: \`ws://localhost:3000\`

### Incoming Events (from server)

#### hunt:created
Broadcast when a new hunt is created

**Data:**
\`\`\`json
{
  "id": "string",
  "name": "string",
  "owner": "string",
  "createdAt": "2025-10-24T00:00:00Z"
}
\`\`\`

#### hunt:updated
Broadcast when a hunt is updated

**Data:**
\`\`\`json
{
  "id": "string",
  "changes": {
    "field": "value"
  },
  "updatedAt": "2025-10-24T00:00:00Z"
}
\`\`\`

#### hunt:phase-changed
Broadcast when hunt phase changes

**Data:**
\`\`\`json
{
  "id": "string",
  "previousPhase": "string",
  "newPhase": "string",
  "changedAt": "2025-10-24T00:00:00Z"
}
\`\`\`

#### hunt:completed
Broadcast when hunt is completed

**Data:**
\`\`\`json
{
  "id": "string",
  "name": "string",
  "completedAt": "2025-10-24T00:00:00Z",
  "totalDuration": 3600000
}
\`\`\`

## Error Responses

All endpoints may return error responses:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
\`\`\`

### Common Error Codes
- \`INVALID_REQUEST\` - 400 Bad Request
- \`UNAUTHORIZED\` - 401 Unauthorized
- \`NOT_FOUND\` - 404 Not Found
- \`CONFLICT\` - 409 Conflict
- \`SERVER_ERROR\` - 500 Internal Server Error
`;

    console.log(docsContent);

    // Save to file if requested
    if (options.output) {
      fs.writeFileSync(options.output, docsContent);
      console.log(chalk.green(`✅ Documentation saved to: ${options.output}\n`));
    }
  }
}

module.exports = DashboardCommands;
