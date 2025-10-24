/**
 * LEO Plugin Commands
 * CLI commands for plugin management
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const { PluginManager, PluginConfig, WebDashboardPlugin, VSCodeExtensionPlugin } = require('../plugins/manager');

/**
 * Plugin Commands Handler
 */
class PluginCommands {
  /**
   * List all plugins
   * Usage: leo plugin list
   */
  static async list(options = {}) {
    console.log(chalk.cyan.bold('\n🔌 LEO Plugins\n'));

    try {
      const manager = new PluginManager();

      // Register built-in plugins
      await manager.register('leo-web-dashboard', WebDashboardPlugin);
      await manager.register('leo-vscode-extension', VSCodeExtensionPlugin);

      const plugins = manager.list();

      if (plugins.length === 0) {
        console.log(chalk.yellow('No plugins registered\n'));
        return;
      }

      // Display plugins in table format
      console.log(chalk.cyan('Registered Plugins:\n'));
      console.log(chalk.gray('Name                         | Status   | Version'));
      console.log(chalk.gray('─────────────────────────────┼──────────┼─────────'));

      for (const plugin of plugins) {
        const statusIcon = plugin.status === 'active' ? chalk.green('●') : chalk.gray('○');
        const name = plugin.name.padEnd(27);
        const status = plugin.status.padEnd(8);
        console.log(`${name} | ${statusIcon} ${status} | ${plugin.version}`);
      }

      console.log();
    } catch (error) {
      console.error(chalk.red(`❌ Failed to list plugins: ${error.message}\n`));
    }
  }

  /**
   * Get plugin information
   * Usage: leo plugin info <name>
   */
  static async info(name, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Plugin Information\n'));

    try {
      const manager = new PluginManager();

      // Register built-in plugins
      await manager.register('leo-web-dashboard', WebDashboardPlugin);
      await manager.register('leo-vscode-extension', VSCodeExtensionPlugin);

      const plugin = manager.getInfo(name);

      if (!plugin) {
        console.error(chalk.red(`❌ Plugin "${name}" not found\n`));
        return;
      }

      console.log(chalk.cyan('Plugin Details:\n'));
      console.log(`  Name:        ${plugin.name}`);
      console.log(`  Version:     ${plugin.version}`);
      console.log(`  Status:      ${plugin.status === 'active' ? chalk.green('Active') : chalk.gray('Inactive')}`);
      console.log(`  Description: ${plugin.description}`);
      console.log(`  Author:      ${plugin.author}`);
      console.log(`  Type:        ${plugin.type}\n`);
    } catch (error) {
      console.error(chalk.red(`❌ Failed to get plugin info: ${error.message}\n`));
    }
  }

  /**
   * Install a plugin from npm
   * Usage: leo plugin install <package-name>
   */
  static async install(packageName, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Installing Plugin\n'));

    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      console.log(chalk.gray(`Installing ${packageName}...\n`));

      // Install npm package
      const { stdout } = await execAsync(`npm install ${packageName}`, {
        cwd: process.cwd()
      });

      console.log(chalk.green(`✅ Plugin installed: ${packageName}\n`));

      // Try to register the plugin
      try {
        const manager = new PluginManager();
        await manager.loadFromPackage(packageName);
        console.log(chalk.green(`✅ Plugin registered successfully\n`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Plugin installed but not registered: ${error.message}\n`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Failed to install plugin: ${error.message}\n`));
    }
  }

  /**
   * Start a plugin
   * Usage: leo plugin start <name>
   */
  static async start(name, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Starting Plugin\n'));

    try {
      const manager = new PluginManager();

      // Register built-in plugins
      await manager.register('leo-web-dashboard', WebDashboardPlugin);
      await manager.register('leo-vscode-extension', VSCodeExtensionPlugin);

      await manager.start(name);
      console.log(chalk.green(`✅ Plugin started: ${name}\n`));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to start plugin: ${error.message}\n`));
    }
  }

  /**
   * Stop a plugin
   * Usage: leo plugin stop <name>
   */
  static async stop(name, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Stopping Plugin\n'));

    try {
      const manager = new PluginManager();

      // Register built-in plugins
      await manager.register('leo-web-dashboard', WebDashboardPlugin);
      await manager.register('leo-vscode-extension', VSCodeExtensionPlugin);

      await manager.stop(name);
      console.log(chalk.green(`✅ Plugin stopped: ${name}\n`));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to stop plugin: ${error.message}\n`));
    }
  }

  /**
   * Uninstall a plugin
   * Usage: leo plugin uninstall <package-name>
   */
  static async uninstall(packageName, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Uninstalling Plugin\n'));

    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      console.log(chalk.gray(`Uninstalling ${packageName}...\n`));

      // Uninstall npm package
      await execAsync(`npm uninstall ${packageName}`, {
        cwd: process.cwd()
      });

      console.log(chalk.green(`✅ Plugin uninstalled: ${packageName}\n`));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to uninstall plugin: ${error.message}\n`));
    }
  }

/**
   * Create a plugin template
   * Usage: leo plugin create <name> [--template=web|basic]
   */
  static async create(name, options = {}) {
    console.log(chalk.cyan.bold('\n🔌 Creating Plugin Template\n'));

    try {
      const template = options.template || 'basic';

      if (template === 'web') {
        return await this._createWebPlugin(name, options);
      }

      return await this._createBasicPlugin(name, options);
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create plugin: ${error.message}\n`));
    }
  }

  /**
   * Create automated web plugin using WebPluginGenerator
   */
  static async _createWebPlugin(name, options = {}) {
    try {
      const WebPluginGenerator = require('../generators/web-plugin-generator');
      const targetDir = process.cwd();

      console.log(chalk.gray(`Generating automated web plugin "${name}"...\n`));

      const result = WebPluginGenerator.generatePlugin(name, targetDir, options);

      if (!result.success) {
        console.error(chalk.red(`❌ Generation failed:\n${result.errors.join('\n')}\n`));
        return;
      }

      const pluginDir = result.pluginDir;

      console.log(chalk.cyan(`Generated files: ${result.files.length}\n`));
      console.log(chalk.green('✅ Automated web plugin created successfully!\n'));
      console.log(chalk.cyan('Next steps:\n'));
      console.log(`  1. cd ${name}`);
      console.log(`  2. npm install`);
      console.log(`  3. npm run dev        # Start development server`);
      console.log(`  4. npm run build      # Build for production`);
      console.log(`  5. npm publish        # Publish to npm\n`);
      console.log(chalk.gray('Features:'));
      console.log(`  ✨ Auto-generated API client from OpenAPI spec`);
      console.log(`  ✨ Auto-generated UI components from data schemas`);
      console.log(`  ✨ Vite build system with hot reload`);
      console.log(`  ✨ Real-time WebSocket integration`);
      console.log(`  ✨ Fully responsive design`);
      console.log(`  ✨ Zero manual HTML/CSS required\n`);
    } catch (error) {
      console.error(chalk.red(`❌ Failed to create web plugin: ${error.message}\n`));
    }
  }

  /**
   * Create basic plugin template
   */
  static async _createBasicPlugin(name, options = {}) {
    try {
      const pluginDir = path.join(process.cwd(), name);

      // Check if directory exists
      try {
        await fs.access(pluginDir);
        console.error(chalk.red(`❌ Directory "${name}" already exists\n`));
        return;
      } catch {
        // Directory doesn't exist, continue
      }

      // Create directory structure
      await fs.mkdir(pluginDir, { recursive: true });
      await fs.mkdir(path.join(pluginDir, 'src'), { recursive: true });
      await fs.mkdir(path.join(pluginDir, 'tests'), { recursive: true });

      // Create package.json
      const packageJson = {
        name: `leo-plugin-${name}`,
        version: '1.0.0',
        description: `LEO Dashboard plugin: ${name}`,
        main: 'src/index.js',
        scripts: {
          test: 'jest'
        },
        keywords: ['leo', 'plugin', 'dashboard'],
        author: 'Your Name',
        license: 'MIT',
        peerDependencies: {
          'leo-workflow-kit': '^5.0.0'
        }
      };

      await fs.writeFile(
        path.join(pluginDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      // Create plugin template
      const pluginTemplate = `/**
 * ${name} Plugin
 * LEO Dashboard plugin template
 */

const { PluginInterface } = require('leo-workflow-kit/lib/plugins/manager');

class ${this._toCamelCase(name)}Plugin extends PluginInterface {
  async init(context) {
    this.context = context;
    this.apiServer = context.apiServer;
    console.log('Plugin initialized:', this.getMetadata().name);
  }

  getMetadata() {
    return {
      name: '${name}',
      version: '1.0.0',
      description: 'Your plugin description',
      author: 'Your Name',
      type: 'frontend' // or 'backend', 'integration', 'extension'
    };
  }

  async start() {
    console.log('Plugin started');
    // Initialize your plugin
  }

  async stop() {
    console.log('Plugin stopped');
    // Cleanup resources
  }

  onEvent(event, data) {
    // Handle API server events
    console.log('Event received:', event, data);
  }
}

module.exports = ${this._toCamelCase(name)}Plugin;
`;

      await fs.writeFile(
        path.join(pluginDir, 'src', 'index.js'),
        pluginTemplate
      );

      // Create README
      const readme = `# Leo Plugin: ${name}

## Description

Your plugin description here.

## Installation

\`\`\`bash
npm install leo-plugin-${name}
\`\`\`

## Usage

\`\`\`bash
leo plugin install leo-plugin-${name}
leo plugin start ${name}
\`\`\`

## Development

\`\`\`bash
npm test
\`\`\`

## License

MIT
`;

      await fs.writeFile(
        path.join(pluginDir, 'README.md'),
        readme
      );

      console.log(chalk.green(`✅ Plugin template created in: ${pluginDir}\n`));
      console.log(chalk.cyan('Next steps:\n'));
      console.log(`  1. cd ${name}`);
      console.log(`  2. Edit src/index.js to implement your plugin`);
      console.log(`  3. Run: npm install`);
      console.log(`  4. Publish to npm: npm publish\n`);
    } catch (error) {
      throw error;
    }
  }  /**
   * Helper: Convert kebab-case to camelCase
   */
  static _toCamelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }
}

module.exports = PluginCommands;
