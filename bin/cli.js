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

// Check if this is the first run and show welcome message
if (isFirstRun()) {
  console.log(welcomeMessage);
  markFirstRunComplete();
  console.log(chalk.gray('\n───────────────────────────────────────────────────────────────\n'));
}

program
  .name('leo-workflow')
  .description('LEO Workflow Kit - CLI tool for setting up GitHub Projects workflow with spec-driven development')
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

// Issue command - Create new issue from template
program
  .command('issue')
  .alias('i')
  .description('Create a new issue from template (spec-driven)')
  .option('-t, --template <type>', 'Issue template type (bug, feature, docs, deployment)')
  .option('-T, --title <title>', 'Issue title')
  .option('-p, --priority <priority>', 'Priority (P0, P1, P2, P3)')
  .option('-a, --assignee <username>', 'Assign to user')
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

// Show banner on no command
if (process.argv.length === 2) {
  console.log(banner);
  program.help();
}

program.parse(process.argv);
