/**
 * LEO Plugin System
 *
 * Extensible plugin architecture for LEO Dashboard
 * Allows third-party frontends and integrations
 */

const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk');

/**
 * Plugin interface definition
 */
class PluginInterface {
  /**
   * Initialize plugin
   * @param {Object} context - Plugin context with APIServer and configuration
   */
  async init(context) {
    throw new Error('Plugin must implement init(context)');
  }

  /**
   * Get plugin metadata
   * @returns {Object} Plugin information
   */
  getMetadata() {
    throw new Error('Plugin must implement getMetadata()');
  }

  /**
   * Start plugin
   */
  async start() {
    throw new Error('Plugin must implement start()');
  }

  /**
   * Stop plugin
   */
  async stop() {
    throw new Error('Plugin must implement stop()');
  }

  /**
   * Handle API server event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  onEvent(event, data) {
    // Optional: override for event handling
  }
}

/**
 * Plugin Manager
 * Manages plugin lifecycle and registration
 */
class PluginManager {
  constructor(config = {}) {
    this.plugins = new Map();
    this.config = config;
    this.context = null;
    this.apiServer = null;
  }

  /**
   * Set API server context
   */
  setAPIServer(apiServer) {
    this.apiServer = apiServer;
    this.context = {
      apiServer,
      config: this.config,
      pluginDir: this.config.pluginDir || path.join(process.cwd(), '.leo-plugins')
    };
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {PluginInterface} PluginClass - Plugin class
   */
  async register(name, PluginClass) {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already registered`);
    }

    try {
      const plugin = new PluginClass();
      await plugin.init(this.context);

      this.plugins.set(name, {
        name,
        instance: plugin,
        metadata: plugin.getMetadata(),
        active: false
      });

      console.log(chalk.green(`✅ Plugin registered: ${name}`));
    } catch (error) {
      throw new Error(`Failed to register plugin "${name}": ${error.message}`);
    }
  }

  /**
   * Load plugin from npm package
   * @param {string} packageName - npm package name
   */
  async loadFromPackage(packageName) {
    try {
      // Try to require the package
      const PluginClass = require(packageName);

      // Validate plugin interface
      const plugin = new PluginClass();
      if (!plugin.getMetadata || !plugin.start || !plugin.stop) {
        throw new Error('Invalid plugin: missing required methods');
      }

      await this.register(packageName, PluginClass);
    } catch (error) {
      throw new Error(`Failed to load plugin "${packageName}": ${error.message}`);
    }
  }

  /**
   * Start plugin
   * @param {string} name - Plugin name
   */
  async start(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }

    if (plugin.active) {
      console.log(chalk.yellow(`⚠️  Plugin "${name}" is already running`));
      return;
    }

    try {
      await plugin.instance.start();
      plugin.active = true;

      // Setup event listeners
      if (this.apiServer) {
        this.apiServer.on('hunt:created', (data) => plugin.instance.onEvent('hunt:created', data));
        this.apiServer.on('hunt:updated', (data) => plugin.instance.onEvent('hunt:updated', data));
        this.apiServer.on('hunt:phase-changed', (data) => plugin.instance.onEvent('hunt:phase-changed', data));
        this.apiServer.on('hunt:completed', (data) => plugin.instance.onEvent('hunt:completed', data));
      }

      console.log(chalk.green(`✅ Plugin started: ${name}`));
    } catch (error) {
      throw new Error(`Failed to start plugin "${name}": ${error.message}`);
    }
  }

  /**
   * Stop plugin
   * @param {string} name - Plugin name
   */
  async stop(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin "${name}" not found`);
    }

    if (!plugin.active) {
      console.log(chalk.yellow(`⚠️  Plugin "${name}" is not running`));
      return;
    }

    try {
      await plugin.instance.stop();
      plugin.active = false;
      console.log(chalk.green(`✅ Plugin stopped: ${name}`));
    } catch (error) {
      throw new Error(`Failed to stop plugin "${name}": ${error.message}`);
    }
  }

  /**
   * Start all plugins
   */
  async startAll() {
    for (const [name] of this.plugins) {
      await this.start(name);
    }
  }

  /**
   * Stop all plugins
   */
  async stopAll() {
    for (const [name] of this.plugins) {
      await this.stop(name);
    }
  }

  /**
   * List all plugins
   */
  list() {
    const plugins = [];
    for (const [name, data] of this.plugins) {
      plugins.push({
        name,
        status: data.active ? 'active' : 'inactive',
        version: data.metadata.version,
        description: data.metadata.description
      });
    }
    return plugins;
  }

  /**
   * Get plugin info
   */
  getInfo(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return null;
    }

    return {
      name,
      status: plugin.active ? 'active' : 'inactive',
      ...plugin.metadata
    };
  }
}

/**
 * Built-in plugin: Web Dashboard
 * Example plugin showing how to build a frontend plugin
 */
class WebDashboardPlugin extends PluginInterface {
  async init(context) {
    this.context = context;
  }

  getMetadata() {
    return {
      name: 'Leo Dashboard Web',
      version: '1.0.0',
      description: 'Web-based dashboard for hunt tracking',
      author: 'LEO Team',
      type: 'frontend'
    };
  }

  async start() {
    console.log(chalk.blue('   🌐 Web Dashboard initializing...'));
    // Start web server, serve frontend assets, etc.
  }

  async stop() {
    console.log(chalk.blue('   🌐 Web Dashboard shutting down...'));
    // Cleanup resources
  }

  onEvent(event, data) {
    // Forward events to connected clients via WebSocket
    // or update frontend state
  }
}

/**
 * Built-in plugin: VS Code Extension
 * Example plugin showing how to build a VS Code extension plugin
 */
class VSCodeExtensionPlugin extends PluginInterface {
  async init(context) {
    this.context = context;
  }

  getMetadata() {
    return {
      name: 'Leo VS Code Extension',
      version: '1.0.0',
      description: 'VS Code extension for hunt management and status',
      author: 'LEO Team',
      type: 'extension'
    };
  }

  async start() {
    console.log(chalk.purple('   💜 VS Code Extension initializing...'));
    // Connect to API server, update VS Code UI, etc.
  }

  async stop() {
    console.log(chalk.purple('   💜 VS Code Extension shutting down...'));
    // Cleanup resources
  }

  onEvent(event, data) {
    // Update VS Code UI based on events
  }
}

/**
 * Plugin Configuration Manager
 */
class PluginConfig {
  static async load(configPath) {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return {};
    }
  }

  static async save(configPath, config) {
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }
}

module.exports = {
  PluginInterface,
  PluginManager,
  WebDashboardPlugin,
  VSCodeExtensionPlugin,
  PluginConfig
};
