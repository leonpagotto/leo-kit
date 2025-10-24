# 🔌 LEO Plugin Architecture (Phase 3 Week 3 - Day 8)

**Phase 3 Week 3 - Day 8: Plugin Architecture Setup**

> Extensible plugin system for building custom frontends and integrations with the LEO Dashboard API

---

## 📋 Overview

The LEO Plugin System enables developers to build **custom frontends** and **integrations** that consume the LEO Dashboard API without modifying the core package.

### Key Features

✅ **Plugin Interface** - Standard interface for all plugins  
✅ **Plugin Manager** - Register, load, start, and stop plugins  
✅ **Event System** - Real-time event propagation to plugins  
✅ **CLI Integration** - Easy plugin management via CLI commands  
✅ **Template Generator** - Create new plugins from templates  
✅ **Built-in Examples** - Web and VS Code extension examples  

---

## 🎯 Plugin Types

### Frontend Plugins

Web-based frontends for hunt tracking and team visualization.

**Examples:**
- Web Dashboard (React, Vue, Svelte, etc.)
- Mobile App (React Native, Flutter, etc.)
- Desktop App (Electron, Tauri, etc.)

### Extension Plugins

IDE and editor extensions.

**Examples:**
- VS Code Extension
- IntelliJ IDEA Plugin
- Sublime Text Plugin

### Integration Plugins

Third-party service integrations.

**Examples:**
- Slack Integration
- GitHub Integration
- Jira Integration
- Webhook Integrations

### Backend Plugins

Backend services and middleware.

**Examples:**
- Database Adapters
- Authentication Providers
- Caching Layers
- Monitoring Services

---

## 🏗️ Plugin Interface

All plugins must implement the `PluginInterface`:

```javascript
const { PluginInterface } = require('leo-workflow-kit/lib/plugins/manager');

class MyPlugin extends PluginInterface {
  /**
   * Initialize plugin
   * @param {Object} context - Plugin context
   *   - apiServer: APIServer instance
   *   - config: Project configuration
   *   - pluginDir: Plugin directory path
   */
  async init(context) {
    this.context = context;
    this.apiServer = context.apiServer;
  }

  /**
   * Get plugin metadata
   * @returns {Object} Plugin information
   */
  getMetadata() {
    return {
      name: 'My Plugin',
      version: '1.0.0',
      description: 'My custom plugin',
      author: 'Your Name',
      type: 'frontend' // or 'extension', 'integration', 'backend'
    };
  }

  /**
   * Start plugin
   */
  async start() {
    console.log('Plugin started');
    // Initialize resources
  }

  /**
   * Stop plugin
   */
  async stop() {
    console.log('Plugin stopped');
    // Cleanup resources
  }

  /**
   * Handle API server event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  onEvent(event, data) {
    console.log(`Event: ${event}`, data);
  }
}

module.exports = MyPlugin;
```

---

## 🛠️ CLI Commands

### List Plugins

```bash
leo plugin list
```

**Output:**
```
🔌 LEO Plugins

Registered Plugins:

Name                         | Status   | Version
─────────────────────────────┼──────────┼─────────
leo-web-dashboard            | ○ inactive | 1.0.0
leo-vscode-extension         | ○ inactive | 1.0.0
```

---

### Get Plugin Info

```bash
leo plugin info leo-web-dashboard
```

**Output:**
```
🔌 Plugin Information

Plugin Details:

  Name:        leo-web-dashboard
  Version:     1.0.0
  Status:      Inactive
  Description: Web-based dashboard for hunt tracking
  Author:      LEO Team
  Type:        frontend
```

---

### Install Plugin

```bash
leo plugin install leo-dashboard-web
```

Installs a plugin from npm and registers it.

---

### Start Plugin

```bash
leo plugin start leo-web-dashboard
```

Starts a plugin and connects it to the API server.

**Output:**
```
🔌 Starting Plugin

🌐 Web Dashboard initializing...
✅ Plugin started: leo-web-dashboard
```

---

### Stop Plugin

```bash
leo plugin stop leo-web-dashboard
```

Stops a running plugin and cleanup resources.

---

### Uninstall Plugin

```bash
leo plugin uninstall leo-dashboard-web
```

Removes the plugin npm package.

---

### Create Plugin Template

```bash
leo plugin create my-dashboard
```

Generates a new plugin template with:
- Directory structure
- `package.json`
- `src/index.js` (plugin class)
- `README.md`
- Test directory

---

## 📦 Plugin Structure

### Minimal Plugin

```
my-plugin/
├── package.json
├── src/
│   └── index.js
└── README.md
```

### Full Plugin

```
my-plugin/
├── package.json
├── README.md
├── LICENSE
├── src/
│   ├── index.js          - Main plugin class
│   ├── api-client.js     - API utilities
│   ├── event-handler.js  - Event handlers
│   └── utils/
│       └── helpers.js
├── tests/
│   ├── plugin.test.js
│   └── integration.test.js
├── examples/
│   └── usage.js
└── dist/
    └── index.js          - Built plugin
```

---

## 📝 Creating a Plugin

### Step 1: Generate Template

```bash
leo plugin create my-awesome-plugin
cd my-awesome-plugin
```

### Step 2: Edit Plugin

**`package.json`:**
```json
{
  "name": "leo-plugin-my-awesome-plugin",
  "version": "1.0.0",
  "description": "Awesome dashboard plugin for LEO",
  "main": "src/index.js",
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "leo-workflow-kit": "^5.0.0"
  }
}
```

**`src/index.js`:**
```javascript
const { PluginInterface } = require('leo-workflow-kit/lib/plugins/manager');

class MyAwesomePlugin extends PluginInterface {
  async init(context) {
    this.context = context;
    this.apiServer = context.apiServer;
  }

  getMetadata() {
    return {
      name: 'My Awesome Plugin',
      version: '1.0.0',
      description: 'Awesome dashboard plugin',
      author: 'Your Name',
      type: 'frontend'
    };
  }

  async start() {
    console.log('🎉 My Awesome Plugin started!');

    // Listen to hunt events
    this.apiServer.on('hunt:created', (hunt) => {
      console.log('🎯 New hunt created:', hunt.title);
      this.onEvent('hunt:created', hunt);
    });

    this.apiServer.on('hunt:completed', (hunt) => {
      console.log('✅ Hunt completed:', hunt.title);
      this.onEvent('hunt:completed', hunt);
    });
  }

  async stop() {
    console.log('Stopping...');
    // Cleanup
  }

  onEvent(event, data) {
    // Handle events from API server
  }
}

module.exports = MyAwesomePlugin;
```

### Step 3: Test Plugin

```bash
npm install
npm test
```

### Step 4: Publish to npm

```bash
npm publish
```

### Step 5: Install Plugin

```bash
leo plugin install leo-plugin-my-awesome-plugin
leo plugin start my-awesome-plugin
```

---

## 🌐 Example: Web Dashboard Plugin

### Structure

```
leo-dashboard-web/
├── package.json
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── responsive.css
│   │   └── dark-mode.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       └── websocket.js
├── src/
│   └── index.js
└── dist/
    └── ...
```

### Implementation

```javascript
const { PluginInterface } = require('leo-workflow-kit/lib/plugins/manager');
const express = require('express');
const path = require('path');

class WebDashboardPlugin extends PluginInterface {
  async init(context) {
    this.context = context;
    this.apiServer = context.apiServer;
    this.webServer = null;
  }

  getMetadata() {
    return {
      name: 'Web Dashboard',
      version: '1.0.0',
      description: 'Web-based dashboard for hunt tracking',
      author: 'LEO Team',
      type: 'frontend'
    };
  }

  async start() {
    // Create Express app for serving frontend
    const app = express();

    // Serve static files
    const publicDir = path.join(__dirname, '../public');
    app.use(express.static(publicDir));

    // Start web server on port 3001
    this.webServer = app.listen(3001, () => {
      console.log('Web Dashboard running on http://localhost:3001');
    });

    // Connect to API server WebSocket for real-time updates
    this._setupWebSocketListener();
  }

  async stop() {
    if (this.webServer) {
      this.webServer.close();
    }
  }

  _setupWebSocketListener() {
    // Listen to hunt events and forward to frontend
    this.apiServer.on('hunt:created', (hunt) => {
      console.log('Broadcasting hunt:created to frontend');
    });

    this.apiServer.on('hunt:completed', (hunt) => {
      console.log('Broadcasting hunt:completed to frontend');
    });
  }

  onEvent(event, data) {
    // Handle events from API server
  }
}

module.exports = WebDashboardPlugin;
```

---

## 💜 Example: VS Code Extension Plugin

### Structure

```
leo-vscode-extension/
├── package.json
├── src/
│   ├── extension.js
│   ├── panels/
│   │   └── DashboardPanel.js
│   └── webview/
│       ├── index.html
│       ├── style.css
│       └── script.js
└── media/
    └── icon.png
```

### Implementation

```javascript
const { PluginInterface } = require('leo-workflow-kit/lib/plugins/manager');
const vscode = require('vscode');

class VSCodeExtensionPlugin extends PluginInterface {
  async init(context) {
    this.context = context;
    this.apiServer = context.apiServer;
    this.statusBar = null;
  }

  getMetadata() {
    return {
      name: 'LEO VS Code Extension',
      version: '1.0.0',
      description: 'VS Code extension for hunt management',
      author: 'LEO Team',
      type: 'extension'
    };
  }

  async start() {
    // Create status bar item
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );

    this.statusBar.text = '$(loading~spin) LEO Dashboard';
    this.statusBar.command = 'leo.openDashboard';
    this.statusBar.show();

    // Listen to hunt events and update VS Code UI
    this.apiServer.on('hunt:created', (hunt) => {
      this.statusBar.text = `$(check) ${hunt.title} created`;
    });

    this.apiServer.on('hunt:completed', (hunt) => {
      this.statusBar.text = `$(verified) ${hunt.title} completed`;
    });
  }

  async stop() {
    if (this.statusBar) {
      this.statusBar.dispose();
    }
  }

  onEvent(event, data) {
    // Handle events
  }
}

module.exports = VSCodeExtensionPlugin;
```

---

## 🔄 Event System

### Available Events

Plugins receive these events from the API server:

- **hunt:created** - New hunt created
- **hunt:updated** - Hunt updated
- **hunt:phase-changed** - Hunt phase transitioned
- **hunt:completed** - Hunt completed

### Event Data

```javascript
// hunt:created
{
  id: "hunt-001",
  title: "Add Dark Mode",
  owner: "Alice",
  createdAt: "2025-10-24T15:30:00.000Z"
}

// hunt:phase-changed
{
  id: "hunt-001",
  previousPhase: "ideation",
  newPhase: "validation",
  changedAt: "2025-10-24T15:40:00.000Z"
}

// hunt:completed
{
  id: "hunt-001",
  name: "Add Dark Mode",
  completedAt: "2025-10-24T16:00:00.000Z",
  totalDuration: 360000
}
```

### Example: Listening to Events

```javascript
async start() {
  this.apiServer.on('hunt:created', (hunt) => {
    console.log('✨ New hunt:', hunt.title);
    this.onEvent('hunt:created', hunt);
  });

  this.apiServer.on('hunt:phase-changed', (hunt) => {
    console.log(`📍 Phase: ${hunt.previousPhase} → ${hunt.newPhase}`);
    this.onEvent('hunt:phase-changed', hunt);
  });

  this.apiServer.on('hunt:completed', (hunt) => {
    console.log(`✅ Completed: ${hunt.name}`);
    this.onEvent('hunt:completed', hunt);
  });
}

onEvent(event, data) {
  // Process event in your plugin
}
```

---

## 🌍 Accessing the API Server

Plugins have access to the APIServer instance:

```javascript
async start() {
  const apiServer = this.context.apiServer;

  // Access API methods
  const hunts = await apiServer.getHunts();
  const team = await apiServer.getTeam();
  const analytics = await apiServer.getAnalytics();

  // Listen to WebSocket broadcasts
  const io = apiServer.io;
  io.on('connection', (socket) => {
    socket.on('hunt:created', (data) => {
      console.log('Broadcast received:', data);
    });
  });
}
```

---

## 📚 Best Practices

### 1. Clean Initialization

```javascript
async init(context) {
  this.context = context;
  this.apiServer = context.apiServer;
  this.config = context.config;
  // Validate dependencies
  if (!this.apiServer) {
    throw new Error('API server not available');
  }
}
```

### 2. Proper Error Handling

```javascript
async start() {
  try {
    // Initialize resources
  } catch (error) {
    console.error('Failed to start plugin:', error);
    throw error;
  }
}
```

### 3. Resource Cleanup

```javascript
async stop() {
  // Close connections
  if (this.webServer) this.webServer.close();
  if (this.connection) this.connection.close();
  // Remove event listeners
  this.apiServer.removeAllListeners();
}
```

### 4. Logging

```javascript
getMetadata() {
  return {
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Clear description of functionality',
    author: 'Your Name',
    type: 'frontend'
  };
}
```

### 5. Documentation

Include comprehensive README.md with:
- Installation instructions
- Usage examples
- Configuration options
- Troubleshooting guide

---

## 🚀 Publishing Plugin to npm

### 1. Create npm Account

```bash
npm adduser
```

### 2. Update package.json

```json
{
  "name": "leo-plugin-your-plugin",
  "version": "1.0.0",
  "description": "Your awesome LEO plugin",
  "main": "src/index.js",
  "keywords": ["leo", "plugin", "dashboard"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/leo-plugin-your-plugin"
  },
  "peerDependencies": {
    "leo-workflow-kit": "^5.0.0"
  }
}
```

### 3. Publish

```bash
npm publish
```

### 4. Install

```bash
leo plugin install leo-plugin-your-plugin
```

---

## 📋 Plugin Checklist

Before publishing your plugin:

- [ ] Implements `PluginInterface`
- [ ] Has `getMetadata()` method
- [ ] Implements `start()` and `stop()`
- [ ] Handles events with `onEvent()`
- [ ] Includes error handling
- [ ] Cleans up resources on stop
- [ ] Has comprehensive README
- [ ] Includes examples
- [ ] Has tests
- [ ] Validated with `leo plugin create`
- [ ] Published to npm
- [ ] Tagged with "leo" and "plugin" keywords

---

## 🐛 Troubleshooting

### Plugin Won't Load

```bash
# Check plugin metadata
leo plugin info plugin-name

# Review initialization
npm test
```

### Events Not Received

```javascript
// Verify API server is running
// Verify event listeners are registered
this.apiServer.on('hunt:created', (data) => {
  console.log('Received event:', data);
});
```

### Plugin Crash on Stop

```javascript
// Ensure proper cleanup
async stop() {
  try {
    // Remove listeners first
    this.apiServer?.removeAllListeners();
    // Then close servers/connections
    this.webServer?.close();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}
```

---

## 📞 Support & Resources

- **Documentation:** https://github.com/osp-group/leo-workflow-kit/wiki
- **GitHub Issues:** https://github.com/osp-group/leo-workflow-kit/issues
- **Examples:** https://github.com/osp-group/leo-plugins

---

**Last Updated:** October 24, 2025  
**Plugin Architecture Version:** 1.0.0  
**Status:** Production Ready
