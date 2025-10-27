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

// Constitution command - Manage constitutional principles
program
  .command('constitution <action> [args...]')
  .description('Manage project constitutional principles (init, show, add, remove, update)')
  .option('-n, --non-interactive', 'Use default principles without prompts (for init)')
  .option('-f, --force', 'Force operation (overwrite existing)')
  .option('-j, --json', 'Output as JSON (for show)')
  .action(async (action, args, options) => {
    const { ConstitutionManager } = require('../lib/constitution');
    const manager = new ConstitutionManager();

    try {
      if (action === 'init') {
        const existing = await manager.load();
        if (existing && !options.force) {
          console.log(chalk.yellow('\n⚠️  Constitutional principles already exist'));
          console.log(chalk.gray('   Use --force to overwrite\n'));
          console.log('   View with: ' + chalk.cyan('leo constitution show'));
          return;
        }
        await manager.init({ interactive: !options.nonInteractive });
        console.log(chalk.green('\n🎉 Next steps:'));
        console.log(`   1. Review: ${chalk.cyan('docs/CONSTITUTION.md')}`);
        console.log(`   2. Share with team for feedback`);
        console.log(`   3. Start using: ${chalk.cyan('leo spec new')}`);
      } else if (action === 'show') {
        const constitution = await manager.load();
        if (!constitution) {
          console.log(chalk.yellow('\n⚠️  No constitutional principles found'));
          console.log(chalk.gray('   Initialize with: ') + chalk.cyan('leo constitution init\n'));
          return;
        }
        if (options.json) {
          console.log(JSON.stringify(constitution, null, 2));
          return;
        }
        console.log(chalk.cyan.bold('\n📜 Constitutional Principles\n'));
        console.log(chalk.gray(`Version: ${constitution.version}`));
        console.log(chalk.gray(`Last Updated: ${new Date(constitution.lastUpdated).toLocaleDateString()}\n`));
        constitution.principles.forEach((p, index) => {
          console.log(chalk.bold(`${index + 1}. ${p.name}`));
          console.log(chalk.gray(`   Rule: ${p.rule}`));
          console.log(chalk.gray(`   Enforcement: ${p.enforcement}`));
          console.log(chalk.gray(`   Rationale: ${p.rationale}\n`));
        });
        console.log(chalk.gray(`Total: ${constitution.principles.length} principles\n`));
      } else {
        console.log(chalk.red(`\n❌ Unknown action: ${action}`));
        console.log(chalk.gray('\nAvailable actions:'));
        console.log(chalk.gray('  init     - Initialize constitutional principles'));
        console.log(chalk.gray('  show     - Display current principles'));
        console.log(chalk.gray('  add      - Add a new principle'));
        console.log(chalk.gray('  remove   - Remove a principle'));
        console.log(chalk.gray('  update   - Update a principle\n'));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  });

// Spec command - Structured issue creation for specs (Phase 1: Spec Kit integration)
program
  .command('spec <action> [args...]')
  .description('Manage structured spec issues (new, list, show)')
  .option('-i, --interactive', 'Use interactive mode for section editing', true)
  .option('--no-interactive', 'Skip interactive prompts (auto-populate)')
  .option('-p, --priority <level>', 'Priority: high, medium, low (default: medium)', 'medium')
  .option('-t, --type <type>', 'Type: feature, bug, refactor, docs (default: feature)', 'feature')
  .option('--no-auto-populate', 'Disable AI auto-population')
  .action(async (action, args, options) => {
    const SpecManager = require('../lib/spec');
    const manager = new SpecManager();

    try {
      if (action === 'new') {
        // Create new spec issue
        const description = args.join(' ');
        if (!description) {
          console.log(chalk.red('\n❌ Please provide a description'));
          console.log(chalk.gray('\nUsage: ') + chalk.cyan('leo spec new <description>'));
          console.log(chalk.gray('\nExample: ') + chalk.cyan('leo spec new "Add OAuth2 authentication with Google and GitHub"'));
          return;
        }

        await manager.create(description, {
          interactive: options.interactive,
          priority: options.priority,
          type: options.type,
          autoPopulate: options.autoPopulate !== false
        });

      } else if (action === 'list') {
        // List spec issues
        const status = args[0] || 'all'; // open, closed, all
        const limit = parseInt(args[1]) || 30;
        await manager.list({ status, limit });

      } else if (action === 'show') {
        // Show specific spec issue
        const issueNumber = args[0];
        if (!issueNumber) {
          console.log(chalk.red('\n❌ Please provide an issue number'));
          console.log(chalk.gray('\nUsage: ') + chalk.cyan('leo spec show <issue-number>'));
          return;
        }
        await manager.show(issueNumber);

      } else {
        console.log(chalk.red(`\n❌ Unknown action: ${action}`));
        console.log(chalk.gray('\nAvailable actions:'));
        console.log(chalk.gray('  new <description>     - Create a new spec issue'));
        console.log(chalk.gray('  list [status] [limit] - List spec issues (default: all, 30)'));
        console.log(chalk.gray('  show <issue-number>   - Show spec issue details\n'));
        console.log(chalk.gray('\nExamples:'));
        console.log(chalk.cyan('  leo spec new "Add user authentication"'));
        console.log(chalk.cyan('  leo spec new "Refactor database layer" --type refactor --priority high'));
        console.log(chalk.cyan('  leo spec list open'));
        console.log(chalk.cyan('  leo spec show 42\n'));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  });

// Clarify command - Generate clarifying questions for spec (Phase 1: Spec Kit integration)
program
  .command('clarify <issue-number>')
  .description('Analyze spec and generate clarifying questions')
  .option('--no-post', 'Don\'t post comment to GitHub (just show questions)')
  .option('--no-label', 'Don\'t add needs-clarification label')
  .option('-c, --categories <list>', 'Focus on specific categories (comma-separated)')
  .option('--status', 'Show clarification status only (no questions)')
  .action(async (issueNumber, options) => {
    const ClarificationManager = require('../lib/clarify');
    const manager = new ClarificationManager();

    try {
      if (options.status) {
        // Show status only
        await manager.showStatus(issueNumber);
      } else {
        // Generate clarifying questions
        const categories = options.categories ? options.categories.split(',').map(c => c.trim().toUpperCase()) : null;

        const result = await manager.clarify(issueNumber, {
          autoPost: options.post !== false,
          addLabel: options.label !== false,
          categories
        });

        if (!options.post) {
          console.log(chalk.cyan('\n📝 Generated Questions:\n'));
          console.log(result.comment);
          console.log(chalk.gray('\nTo post these questions, run without --no-post flag'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  });

// Plan command - Generate implementation plan for spec (Phase 1: Spec Kit integration)
program
  .command('plan <issue-number>')
  .description('Generate detailed implementation plan for spec')
  .option('--no-post', 'Don\'t post plan to GitHub (just show it)')
  .option('--no-labels', 'Don\'t update labels')
  .option('-f, --focus <area>', 'Focus on specific area: architecture, api, data, testing, deployment')
  .action(async (issueNumber, options) => {
    const PlanManager = require('../lib/plan');
    const manager = new PlanManager();

    try {
      const result = await manager.plan(issueNumber, {
        autoPost: options.post !== false,
        updateLabels: options.labels !== false,
        focus: options.focus
      });

      if (!options.post) {
        console.log(chalk.cyan('\n📐 Generated Plan:\n'));
        console.log(result.comment);
        console.log(chalk.gray('\nTo post this plan, run without --no-post flag'));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  });

// Tasks command - Generate task checklists from plans (Phase 2: Task Management)
program
  .command('tasks <action> [issue-number]')
  .description('Manage implementation task checklists (create, status)')
  .option('--no-post', 'Don\'t post tasks to GitHub (just show them)')
  .option('--no-label', 'Don\'t add has-tasks label')
  .option('--no-tdd', 'Disable TDD mode (tests before implementation)')
  .option('--create-issues', 'Create child GitHub issues for each task (for full project board tracking)')
  .action(async (action, issueNumber, options) => {
    const TaskManager = require('../lib/tasks');
    const manager = new TaskManager();

    try {
      if (action === 'create') {
        if (!issueNumber) {
          console.log(chalk.red('\n❌ Please provide an issue number'));
          console.log(chalk.gray('\nUsage: ') + chalk.cyan('leo tasks create <issue-number>'));
          return;
        }

        const result = await manager.create(issueNumber, {
          autoPost: options.post !== false,
          addLabel: options.label !== false,
          tddMode: options.tdd !== false,
          createIssues: options.createIssues === true
        });

        if (!options.post) {
          console.log(chalk.cyan('\n📋 Generated Tasks:\n'));
          console.log(result.comment);
          console.log(chalk.gray('\nTo post these tasks, run without --no-post flag'));
        }

        if (options.createIssues && result.childIssues && result.childIssues.length > 0) {
          console.log(chalk.cyan(`\n✨ Created ${result.childIssues.length} child issues for GitHub Project tracking`));
        }

      } else if (action === 'status') {
        if (!issueNumber) {
          console.log(chalk.red('\n❌ Please provide an issue number'));
          console.log(chalk.gray('\nUsage: ') + chalk.cyan('leo tasks status <issue-number>'));
          return;
        }

        await manager.status(issueNumber);

      } else {
        console.log(chalk.red(`\n❌ Unknown action: ${action}`));
        console.log(chalk.gray('\nAvailable actions:'));
        console.log(chalk.gray('  create <issue>  - Generate task checklist from plan'));
        console.log(chalk.gray('  status <issue>  - Show task completion status\n'));
        console.log(chalk.gray('\nExamples:'));
        console.log(chalk.cyan('  leo tasks create 42                    # Simple checklist in comment'));
        console.log(chalk.cyan('  leo tasks create 42 --create-issues    # Create child issues for each task'));
        console.log(chalk.cyan('  leo tasks status 42\n'));
        console.log(chalk.gray('\nOptions:'));
        console.log(chalk.gray('  --create-issues    Create child GitHub issues (full project board tracking)'));
        console.log(chalk.gray('  --no-post          Preview without posting'));
        console.log(chalk.gray('  --no-tdd           Disable TDD mode\n'));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
    }
  });

// Spec Diff command - Track spec evolution over time (Phase 2: Spec Evolution Tracking)
program
  .command('spec-diff <issue-number>')
  .alias('diff')
  .description('Show how a spec has evolved over time')
  .option('--timeline', 'Show timeline view instead of diff')
  .option('--summary', 'Show summary statistics')
  .option('--from <version>', 'Start from specific version (e.g., --from 1)')
  .option('--to <version>', 'End at specific version (e.g., --to 5)')
  .option('--section <name>', 'Focus on specific section (context, requirements, userStories, acceptanceCriteria)')
  .option('--max-length <number>', 'Maximum length for text diffs (default: 100)')
  .action(async (issueNumber, options) => {
    const SpecDiffManager = require('../lib/spec-diff');
    const manager = new SpecDiffManager();

    try {
      await manager.diff(issueNumber, {
        timeline: options.timeline === true,
        summary: options.summary === true,
        from: options.from,
        to: options.to,
        section: options.section,
        maxLength: options.maxLength ? parseInt(options.maxLength) : 100
      });
    } catch (error) {
      console.error(chalk.red(`\n❌ Error:`, error.message));
      if (process.env.DEBUG) console.error(error);
      process.exit(1);
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
