const chalk = require('chalk');
const config = require('../utils/config-manager');

/**
 * LEO Config Command
 * Manage workflow configuration settings
 */

async function configCommand(args) {
  const subcommand = args[0];

  if (!subcommand || subcommand === 'help') {
    showHelp();
    return;
  }

  try {
    switch (subcommand) {
      case 'get':
        handleGet(args.slice(1));
        break;
      case 'set':
        handleSet(args.slice(1));
        break;
      case 'list':
        handleList();
        break;
      case 'remove':
      case 'delete':
        handleRemove(args.slice(1));
        break;
      case 'init':
        handleInit();
        break;
      default:
        console.log(chalk.red(`Unknown subcommand: ${subcommand}`));
        console.log('Run ' + chalk.cyan('leo config help') + ' for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Get a configuration value
 */
function handleGet(args) {
  const key = args[0];
  const isGlobal = args.includes('--global') || args.includes('-g');

  if (!key) {
    console.log(chalk.red('Error: Missing configuration key'));
    console.log('Usage: ' + chalk.cyan('leo config get <key> [--global]'));
    process.exit(1);
  }

  const value = config.get(key, isGlobal);

  if (value === undefined) {
    console.log(chalk.yellow(`Configuration key "${key}" not found`));
  } else {
    console.log(chalk.green(`${key} = ${value}`));
  }
}

/**
 * Set a configuration value
 */
function handleSet(args) {
  let key, value;
  let isGlobal = false;

  // Parse arguments
  const filteredArgs = args.filter(arg => {
    if (arg === '--global' || arg === '-g') {
      isGlobal = true;
      return false;
    }
    return true;
  });

  key = filteredArgs[0];
  value = filteredArgs[1];

  if (!key || value === undefined) {
    console.log(chalk.red('Error: Missing configuration key or value'));
    console.log('Usage: ' + chalk.cyan('leo config set <key> <value> [--global]'));
    console.log('');
    console.log('Available keys:');
    console.log('  ' + chalk.cyan('auto-resolve') + '  - Automatically work on created issues (true/false)');
    console.log('  ' + chalk.cyan('auto-init') + '     - Auto-initialize on npm install (true/false)');
    console.log('  ' + chalk.cyan('project-type') + '  - Project type for smart instructions (auto/frontend/backend/etc)');
    process.exit(1);
  }

  // Validate known keys and values
  if (key === 'auto-resolve' || key === 'auto-init') {
    if (value !== 'true' && value !== 'false') {
      console.log(chalk.red(`Error: ${key} must be "true" or "false"`));
      process.exit(1);
    }
  }

  config.set(key, value, isGlobal);

  const scope = isGlobal ? 'global' : 'local';
  console.log(chalk.green('✓') + ` Set ${chalk.cyan(key)} = ${chalk.yellow(value)} (${scope})`);

  if (key === 'auto-resolve' && value === 'false') {
    console.log('');
    console.log(chalk.yellow('Note:') + ' Copilot will now create issues but wait for your review before working on them.');
    console.log('To enable auto-resolution again, run: ' + chalk.cyan('leo config set auto-resolve true'));
  }
}

/**
 * List all configuration values
 */
function handleList() {
  const configList = config.list();

  console.log(chalk.bold('\n📋 Configuration Settings\n'));

  Object.entries(configList).forEach(([key, { value, source }]) => {
    const sourceColor = source === 'local' ? 'green' : source === 'global' ? 'blue' : 'gray';
    const sourceLabel = source === 'local' ? '[local]' : source === 'global' ? '[global]' : '[default]';

    console.log(
      chalk.cyan(key.padEnd(15)) +
      ' = ' +
      chalk.yellow(String(value).padEnd(10)) +
      ' ' +
      chalk[sourceColor](sourceLabel)
    );
  });

  console.log('');
  console.log(chalk.gray('Local config:  ') + config.getLocalConfigPath());
  console.log(chalk.gray('Global config: ') + config.GLOBAL_CONFIG_PATH);
  console.log('');
}

/**
 * Remove a configuration key
 */
function handleRemove(args) {
  const key = args[0];
  const isGlobal = args.includes('--global') || args.includes('-g');

  if (!key) {
    console.log(chalk.red('Error: Missing configuration key'));
    console.log('Usage: ' + chalk.cyan('leo config remove <key> [--global]'));
    process.exit(1);
  }

  const removed = config.remove(key, isGlobal);

  if (removed) {
    const scope = isGlobal ? 'global' : 'local';
    console.log(chalk.green('✓') + ` Removed ${chalk.cyan(key)} from ${scope} configuration`);
  } else {
    console.log(chalk.yellow(`Configuration key "${key}" not found`));
  }
}

/**
 * Initialize a new local config file
 */
function handleInit() {
  try {
    const configPath = config.init();
    console.log(chalk.green('✓') + ' Created configuration file: ' + chalk.cyan(configPath));
    console.log('');
    console.log('Default settings:');
    Object.entries(config.DEFAULT_CONFIG).forEach(([key, value]) => {
      console.log(`  ${chalk.cyan(key)}: ${chalk.yellow(value)}`);
    });
    console.log('');
    console.log('Use ' + chalk.cyan('leo config set <key> <value>') + ' to customize settings');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(chalk.yellow('⚠') + ' Configuration file already exists');
      console.log('Use ' + chalk.cyan('leo config list') + ' to view current settings');
    } else {
      throw error;
    }
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(chalk.bold('\n🔧 LEO Config - Manage Workflow Configuration\n'));

  console.log(chalk.cyan('Usage:'));
  console.log('  leo config <command> [options]\n');

  console.log(chalk.cyan('Commands:'));
  console.log('  ' + chalk.yellow('get <key> [--global]') + '        Get a configuration value');
  console.log('  ' + chalk.yellow('set <key> <value> [--global]') + ' Set a configuration value');
  console.log('  ' + chalk.yellow('list') + '                         List all configuration values');
  console.log('  ' + chalk.yellow('remove <key> [--global]') + '      Remove a configuration key');
  console.log('  ' + chalk.yellow('init') + '                         Create a new local config file');
  console.log('  ' + chalk.yellow('help') + '                         Show this help message\n');

  console.log(chalk.cyan('Available Configuration Keys:'));
  console.log('  ' + chalk.yellow('auto-resolve') + '  - Automatically work on created issues (true/false)');
  console.log('                   Default: true');
  console.log('                   When false, Copilot creates issues but waits for review\n');

  console.log('  ' + chalk.yellow('auto-init') + '     - Auto-initialize on npm install (true/false)');
  console.log('                   Default: false');
  console.log('                   When true, LEO_AUTO_INIT env var not needed\n');

  console.log('  ' + chalk.yellow('project-type') + '  - Project type for smart instructions');
  console.log('                   Default: auto');
  console.log('                   Options: auto, frontend, backend, fullstack, cli, mobile, library\n');

  console.log(chalk.cyan('Flags:'));
  console.log('  ' + chalk.yellow('--global, -g') + '  Set/get/remove from global config (~/.leorc.json)');
  console.log('                   Without this flag, operates on local project config\n');

  console.log(chalk.cyan('Examples:'));
  console.log('  ' + chalk.gray('# Disable auto-resolution for current project'));
  console.log('  leo config set auto-resolve false\n');

  console.log('  ' + chalk.gray('# Enable auto-resolution globally'));
  console.log('  leo config set auto-resolve true --global\n');

  console.log('  ' + chalk.gray('# Check current auto-resolve setting'));
  console.log('  leo config get auto-resolve\n');

  console.log('  ' + chalk.gray('# List all settings with their sources'));
  console.log('  leo config list\n');

  console.log('  ' + chalk.gray('# Set project type'));
  console.log('  leo config set project-type frontend\n');

  console.log(chalk.cyan('Configuration Priority:'));
  console.log('  Local config > Global config > Default values\n');
}

module.exports = configCommand;

