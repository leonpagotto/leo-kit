#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const { getBanner, welcomeMessage } = require('../lib/banner');
const { isFirstRun, markFirstRunComplete } = require('../lib/utils/first-run');

// Import commands
const initCommand = require('../lib/commands/init');
const issueCommand = require('../lib/commands/issue');
const labelsCommand = require('../lib/commands/labels');
const vscodeCommand = require('../lib/commands/vscode');
const configCommand = require('../lib/commands/config');
const aiCommand = require('../lib/commands/ai');
const agentCommand = require('../lib/commands/agent');
const githubCommand = require('../lib/commands/github');
const githubProjectCommand = require('../lib/commands/github-project');
const modelCommand = require('../lib/commands/model');
const DashboardCommands = require('../lib/commands/dashboard');
const PluginCommands = require('../lib/commands/plugin');
const { organizeDocs, validateDocs } = require('../lib/commands/organize-docs');

// Check if this is the first run and show welcome message
if (isFirstRun()) {
  console.log(welcomeMessage);
  markFirstRunComplete();
  console.log(chalk.gray('\n───────────────────────────────────────────────────────────────\n'));
}

program
  .name('leo-workflow')
  .description('LEO Workflow Kit - CLI tool for setting up GitHub Projects workflow with spec-driven development following spec-driven development workflow')
  .version(packageJson.version);

// Get responsive banner
const banner = getBanner();

// Init command - Set up complete workflow in current project
program
  .command('init')
  .description('Initialize LEO workflow in current project')
  .option('-o, --org <organization>', 'GitHub organization name (optional for personal repos)')
  .option('-p, --project <number>', 'GitHub project number (optional)')
  .option('--skip-project', 'Skip GitHub Project setup entirely')
  .option('--skip-labels', 'Skip label setup')
  .option('--skip-vscode', 'Skip VS Code configuration')
  .option('--non-interactive', 'Run in non-interactive mode with defaults (for CI/CD or postinstall)')
  .action((options) => {
    console.log(banner);
    initCommand(options);
  });

// Issue command - Create new issue with GitHub-native features (v4.1.0+)
program
  .command('issue')
  .alias('i')
  .description('Create a new issue with GitHub-native features (priorities, estimates, components)')
  .option('-t, --type <type>', 'Issue type (bug, enhancement, task, documentation)')
  .option('-T, --title <title>', 'Issue title')
  .option('-p, --priority <priority>', 'Priority (Critical, High, Medium, Low)')
  .option('-e, --estimate <points>', 'Story points (1, 2, 3, 5, 8, 13, 21)')
  .option('-c, --components <list>', 'Component labels (comma-separated: backend,frontend,database,devops,ux,documentation,api,infrastructure)')
  .option('-a, --assignee <username>', 'Assign to user')
  .option('--interactive', 'Use interactive mode (default: true)', true)
  .option('--no-interactive', 'Skip interactive prompts')
  .action((options) => {
    issueCommand(options);
  });

// Labels command - Set up GitHub labels
program
  .command('labels')
  .alias('l')
  .description('Set up GitHub labels for workflow')
  .option('--clean', 'Remove default GitHub labels')
  .action((options) => {
    labelsCommand(options);
  });

// VS Code command - Set up VS Code configuration
program
  .command('vscode')
  .alias('vs')
  .description('Set up VS Code with Copilot instructions')
  .option('--global', 'Install globally (user settings)')
  .option('--project', 'Install for project only')
  .action((options) => {
    vscodeCommand(options);
  });

// Config command - Manage workflow configuration
program
  .command('config')
  .alias('cfg')
  .description('Manage workflow configuration settings')
  .allowUnknownOption()
  .action(() => {
    // Get all arguments after 'config'
    const args = process.argv.slice(3);
    configCommand(args);
  });

// AI command - Manage AI assistant configurations
program
  .command('ai [subcommand] [args...]')
  .description('Manage AI assistant configurations (list, add, remove, sync)')
  .action((subcommand, args) => {
    aiCommand(subcommand, ...args);
  });

// Agent command - Manage specialized agents
program
  .command('agent <subcommand> [agent]')
  .description('Manage specialized agents (list, enable, disable, info, sync)')
  .option('--no-sync', 'Skip AI file sync when enabling/disabling')
  .action((subcommand, agent, options) => {
    agentCommand(subcommand, agent, options);
  });

// GitHub command - Configure repository settings
program
  .command('github <subcommand>')
  .description('Configure GitHub repository settings (setup, status)')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action((subcommand, options) => {
    githubCommand(subcommand, options);
  });

// GitHub Project command - Configure GitHub Projects integration
program
  .command('project <action>')
  .description('Configure GitHub Projects integration (setup, test)')
  .action((action, options) => {
    githubProjectCommand(action, options);
  });

// Model command - Manage AI model selection
program
  .command('model <subcommand> [args...]')
  .description('Manage AI model selection (list, status, enable, disable, budget, usage, reset, test)')
  .action((subcommand, args, options) => {
    modelCommand(subcommand, ...args);
  });

// Status command - Check workflow setup status (simple)
program
  .command('status')
  .alias('s')
  .description('Check workflow setup status')
  .action(() => {
    console.log(banner);
    console.log(chalk.cyan('\n📊 Checking workflow status...\n'));

    const checks = [
      { name: 'GitHub CLI', check: () => require('../lib/utils/checks').checkGitHubCLI() },
      { name: 'Git Repository', check: () => require('../lib/utils/checks').checkGitRepo() },
      { name: 'Issue Templates', check: () => require('../lib/utils/checks').checkIssueTemplates() },
      { name: 'Labels', check: () => require('../lib/utils/checks').checkLabels() },
      { name: 'VS Code Config', check: () => require('../lib/utils/checks').checkVSCode() },
    ];

    checks.forEach(({ name, check }) => {
      const result = check();
      const icon = result ? chalk.green('✓') : chalk.red('✗');
      console.log(`${icon} ${name}`);
    });

    console.log();
    console.log(chalk.gray('💡 Run `leo health` for comprehensive health check\n'));
  });

// Health command - Comprehensive workflow health check
program
  .command('health')
  .alias('h')
  .description('Run comprehensive workflow health check with scoring')
  .action(async () => {
    console.log(banner);
    const healthCheck = require('../lib/commands/health');
    await healthCheck();
  });

// Welcome command - Show welcome message again
program
  .command('welcome')
  .alias('w')
  .description('Show welcome message and quick start guide')
  .action(() => {
    console.log(welcomeMessage);
  });

// Docs command - Open documentation
program
  .command('docs')
  .description('Open workflow documentation')
  .action(() => {
    const { exec } = require('child_process');
    console.log(chalk.cyan('\n📚 Opening documentation...\n'));
    exec('open https://github.com/leonpagotto/leo-kit#readme');
  });

// Organize-docs command - Auto-organize documentation files
program
  .command('organize-docs')
  .alias('od')
  .description('Organize documentation files into proper directories')
  .option('--dry-run', 'Show what would be moved without moving files')
  .option('--validate', 'Check documentation organization without moving files')
  .action(async (options) => {
    if (options.validate) {
      await validateDocs();
    } else {
      await organizeDocs({ dryRun: options.dryRun });
    }
  });

// Hooks command - Manage Git hooks
program
  .command('hooks <action>')
  .description('Manage Git hooks (install, uninstall, status)')
  .action(async (action) => {
    const { installPreCommitHook, uninstallPreCommitHook, isHookInstalled } = require('../lib/utils/git-hooks');

    if (action === 'install') {
      console.log(chalk.cyan('\n🪝 Installing Git hooks...\n'));
      const result = await installPreCommitHook();
      if (result.installed && !result.skipped) {
        console.log(chalk.green('\n✅ Git hooks installed successfully!\n'));
      }
    } else if (action === 'uninstall') {
      console.log(chalk.cyan('\n🪝 Uninstalling Git hooks...\n'));
      await uninstallPreCommitHook();
    } else if (action === 'status') {
      console.log(chalk.cyan('\n🪝 Git Hooks Status\n'));
      const installed = await isHookInstalled();
      if (installed) {
        console.log(chalk.green('  ✓ Pre-commit hook: Installed'));
        console.log(chalk.gray('    Validates documentation organization before commit\n'));
      } else {
        console.log(chalk.yellow('  ✗ Pre-commit hook: Not installed'));
        console.log(chalk.gray('    Run: leo hooks install\n'));
      }
    } else {
      console.log(chalk.red('\n❌ Unknown action. Use: install, uninstall, or status\n'));
    }
  });

// Dashboard command - Start real-time API server
program
  .command('dashboard')
  .description('Start the real-time API server for dashboard access')
  .option('-p, --port <number>', 'Server port (default: 3000)')
  .option('--host <host>', 'Server host (default: localhost)')
  .option('--project <path>', 'Project path (default: current directory)')
  .action((options) => {
    const subCommand = process.argv[3];

    // Handle subcommands
    if (subCommand === 'start' || !subCommand || subCommand.startsWith('-')) {
      // Adjust for options if no explicit subcommand
      if (subCommand === 'start') {
        DashboardCommands.start(options);
      } else {
        DashboardCommands.start(options);
      }
    } else if (subCommand === 'stop') {
      DashboardCommands.stop(options);
    } else if (subCommand === 'status') {
      DashboardCommands.status(options);
    } else if (subCommand === 'open') {
      DashboardCommands.open(options);
    } else if (subCommand === 'docs') {
      DashboardCommands.docs(options);
    }
  });

// Plugin command - Manage dashboard plugins
program
  .command('plugin [subcommand] [arg]')
  .description('Manage LEO Dashboard plugins (list, info, install, start, stop, create)')
  .action((subcommand, arg, options) => {
    const cmd = subcommand || 'list';

    if (cmd === 'list') {
      PluginCommands.list(options);
    } else if (cmd === 'info' && arg) {
      PluginCommands.info(arg, options);
    } else if (cmd === 'install' && arg) {
      PluginCommands.install(arg, options);
    } else if (cmd === 'start' && arg) {
      PluginCommands.start(arg, options);
    } else if (cmd === 'stop' && arg) {
      PluginCommands.stop(arg, options);
    } else if (cmd === 'uninstall' && arg) {
      PluginCommands.uninstall(arg, options);
    } else if (cmd === 'create' && arg) {
      PluginCommands.create(arg, options);
    } else {
      console.log(chalk.cyan.bold('\n🔌 Plugin Commands\n'));
      console.log(chalk.gray('Usage: leo plugin [subcommand] [arg]\n'));
      console.log('Subcommands:');
      console.log(chalk.gray('  list                  - List all plugins'));
      console.log(chalk.gray('  info <name>           - Show plugin information'));
      console.log(chalk.gray('  install <package>     - Install plugin from npm'));
      console.log(chalk.gray('  start <name>          - Start a plugin'));
      console.log(chalk.gray('  stop <name>           - Stop a plugin'));
      console.log(chalk.gray('  uninstall <package>   - Uninstall plugin'));
      console.log(chalk.gray('  create <name>         - Create plugin template\n'));
    }
  });

// Show banner on no command
if (process.argv.length === 2) {
  console.log(banner);
  program.help();
}

program.parse(process.argv);
