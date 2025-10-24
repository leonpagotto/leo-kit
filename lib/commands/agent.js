const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const {
  getEnabledAgents,
  enableAgent,
  disableAgent,
  getAgentConfig,
  getProjectType,
  getRecommendedAgents,
  getAll
} = require('../utils/config-manager');
const { AIInstructionsBuilder } = require('../ai-instructions');

/**
 * Agent Command - Manage specialized agents
 *
 * Subcommands:
 * - list: Show all agents and their status
 * - enable <agent>: Enable a specialized agent
 * - disable <agent>: Disable a specialized agent
 * - info <agent>: Show agent details
 * - sync: Regenerate AI instruction files with current agents
 */

async function agentCommand(subcommand, agentName, options = {}) {
  switch (subcommand) {
    case 'list':
      return await listAgents(options);

    case 'enable':
      if (!agentName) {
        console.log(chalk.red('Error: Agent name required'));
        console.log(chalk.gray('Usage: leo agent enable <agent>'));
        process.exit(1);
      }
      return await enableAgentCommand(agentName, options);

    case 'disable':
      if (!agentName) {
        console.log(chalk.red('Error: Agent name required'));
        console.log(chalk.gray('Usage: leo agent disable <agent>'));
        process.exit(1);
      }
      return await disableAgentCommand(agentName, options);

    case 'info':
      if (!agentName) {
        console.log(chalk.red('Error: Agent name required'));
        console.log(chalk.gray('Usage: leo agent info <agent>'));
        process.exit(1);
      }
      return await showAgentInfo(agentName, options);

    case 'sync':
      return await syncAgents(options);

    default:
      showHelp();
      process.exit(1);
  }
}

/**
 * List all agents and their status
 */
async function listAgents(options) {
  console.log(chalk.cyan('\n🎯 LEO Multi-Agent System\n'));

  const config = getAll();
  const agents = config.agents || {};
  const projectType = getProjectType();
  const recommendedAgents = getRecommendedAgents(projectType);

  console.log(chalk.gray(`Project Type: ${projectType}\n`));

  // Orchestrator (always enabled)
  console.log(chalk.bold('🎛️  Orchestrator Agent') + chalk.green(' ✓ ENABLED'));
  console.log(chalk.gray('   Routes tasks to specialized agents'));
  console.log(chalk.gray('   Status: Always active (core routing layer)\n'));

  // List all available agents
  const agentInfo = {
    frontend: {
      emoji: '🎨',
      name: 'Frontend Agent',
      description: 'UI/UX, components, styling, accessibility, responsive design'
    },
    backend: {
      emoji: '⚙️ ',
      name: 'Backend Agent',
      description: 'APIs, databases, authentication, security, performance'
    },
    devops: {
      emoji: '🚀',
      name: 'DevOps Agent',
      description: 'CI/CD, Docker, Kubernetes, monitoring, deployment'
    },
    testing: {
      emoji: '🧪',
      name: 'Testing Agent',
      description: 'Unit/integration/E2E tests, TDD, code coverage'
    },
    documentation: {
      emoji: '📚',
      name: 'Documentation Agent',
      description: 'README, API docs, guides, tutorials, code comments'
    }
  };

  for (const [key, info] of Object.entries(agentInfo)) {
    const agentConfig = agents[key] || {};
    const isEnabled = agentConfig.enabled === true;
    const isRecommended = recommendedAgents.some(r => r.agent === key);

    const status = isEnabled
      ? chalk.green(' ✓ ENABLED')
      : chalk.gray(' ○ DISABLED');

    const recommended = isRecommended
      ? chalk.yellow(' (recommended)')
      : '';

    console.log(chalk.bold(`${info.emoji}  ${info.name}`) + status + recommended);
    console.log(chalk.gray(`   ${info.description}`));
    console.log();
  }

  // Show enabled count
  const enabledCount = Object.values(agents).filter(a => a.enabled === true).length + 1; // +1 for orchestrator
  console.log(chalk.cyan(`Total: ${enabledCount} agent${enabledCount > 1 ? 's' : ''} enabled\n`));

  // Show commands
  console.log(chalk.gray('Commands:'));
  console.log(chalk.gray('  leo agent enable <agent>   Enable a specialized agent'));
  console.log(chalk.gray('  leo agent disable <agent>  Disable a specialized agent'));
  console.log(chalk.gray('  leo agent info <agent>     Show detailed agent information'));
  console.log(chalk.gray('  leo agent sync             Regenerate AI instruction files\n'));
}

/**
 * Enable a specialized agent
 */
async function enableAgentCommand(agentName, options) {
  const validAgents = ['frontend', 'backend', 'devops', 'testing', 'documentation'];

  if (agentName === 'orchestrator') {
    console.log(chalk.yellow('\n⚠️  Orchestrator agent is always enabled (core routing layer)\n'));
    return;
  }

  if (!validAgents.includes(agentName)) {
    console.log(chalk.red(`\n❌ Unknown agent: ${agentName}\n`));
    console.log(chalk.gray('Valid agents:'), validAgents.join(', '));
    process.exit(1);
  }

  // Check if already enabled
  const currentConfig = getAgentConfig(agentName);
  if (currentConfig && currentConfig.enabled === true) {
    console.log(chalk.yellow(`\n⚠️  ${agentName} agent is already enabled\n`));
    return;
  }

  const spinner = ora(`Enabling ${agentName} agent...`).start();

  try {
    // Enable the agent
    enableAgent(agentName, { enabled: true }, false);

    spinner.succeed(`${agentName} agent enabled`);

    // Ask if user wants to sync AI files
    if (!options.noSync) {
      const { shouldSync } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldSync',
          message: 'Regenerate AI instruction files with new agent?',
          default: true
        }
      ]);

      if (shouldSync) {
        await syncAgents({ silent: true });
      } else {
        console.log(chalk.gray('\n💡 Run'), chalk.cyan('leo agent sync'), chalk.gray('later to update AI files\n'));
      }
    }
  } catch (error) {
    spinner.fail(`Failed to enable ${agentName} agent`);
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Disable a specialized agent
 */
async function disableAgentCommand(agentName, options) {
  const validAgents = ['frontend', 'backend', 'devops', 'testing', 'documentation'];

  if (agentName === 'orchestrator') {
    console.log(chalk.red('\n❌ Cannot disable orchestrator agent (core routing layer)\n'));
    return;
  }

  if (!validAgents.includes(agentName)) {
    console.log(chalk.red(`\n❌ Unknown agent: ${agentName}\n`));
    console.log(chalk.gray('Valid agents:'), validAgents.join(', '));
    process.exit(1);
  }

  // Check if already disabled
  const currentConfig = getAgentConfig(agentName);
  if (!currentConfig || currentConfig.enabled !== true) {
    console.log(chalk.yellow(`\n⚠️  ${agentName} agent is already disabled\n`));
    return;
  }

  const spinner = ora(`Disabling ${agentName} agent...`).start();

  try {
    // Disable the agent
    disableAgent(agentName, false);

    spinner.succeed(`${agentName} agent disabled`);

    // Ask if user wants to sync AI files
    if (!options.noSync) {
      const { shouldSync } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldSync',
          message: 'Regenerate AI instruction files without this agent?',
          default: true
        }
      ]);

      if (shouldSync) {
        await syncAgents({ silent: true });
      } else {
        console.log(chalk.gray('\n💡 Run'), chalk.cyan('leo agent sync'), chalk.gray('later to update AI files\n'));
      }
    }
  } catch (error) {
    spinner.fail(`Failed to disable ${agentName} agent`);
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Show detailed agent information
 */
async function showAgentInfo(agentName, options) {
  const agentDetails = {
    orchestrator: {
      emoji: '🎛️ ',
      name: 'Orchestrator Agent',
      description: 'Primary routing and coordination layer',
      responsibilities: [
        'Analyze user requests to identify task type',
        'Route to appropriate specialized agent(s)',
        'Coordinate multi-agent tasks',
        'Enforce LEO workflow rules',
        'Handle cross-cutting concerns'
      ],
      triggers: ['ALL tasks - analyzes and routes everything'],
      alwaysEnabled: true
    },
    frontend: {
      emoji: '🎨',
      name: 'Frontend Agent',
      description: 'UI/UX development specialist',
      responsibilities: [
        'Component-first architecture (atomic design)',
        'Accessibility (WCAG 2.1 AA compliance)',
        'Responsive design (mobile-first)',
        'Performance optimization',
        'SEO best practices'
      ],
      triggers: [
        'Keywords: component, UI, style, design, responsive, button, form',
        'Files: *.jsx, *.tsx, *.vue, *.css, *.scss'
      ]
    },
    backend: {
      emoji: '⚙️ ',
      name: 'Backend Agent',
      description: 'API and server-side specialist',
      responsibilities: [
        'RESTful API design',
        'Database modeling and optimization',
        'Authentication & authorization',
        'Security best practices',
        'Error handling & validation'
      ],
      triggers: [
        'Keywords: API, endpoint, database, schema, authentication, server',
        'Files: *.controller.js, *.service.js, *.model.js, *.route.js'
      ]
    },
    devops: {
      emoji: '🚀',
      name: 'DevOps Agent',
      description: 'Deployment and infrastructure specialist',
      responsibilities: [
        'CI/CD pipeline configuration',
        'Docker & Kubernetes',
        'Infrastructure as Code',
        'Monitoring & logging',
        'Deployment strategies'
      ],
      triggers: [
        'Keywords: deploy, CI/CD, Docker, Kubernetes, pipeline, monitoring',
        'Files: Dockerfile, docker-compose.yml, .github/workflows/*, k8s/*'
      ]
    },
    testing: {
      emoji: '🧪',
      name: 'Testing Agent',
      description: 'Quality assurance specialist',
      responsibilities: [
        'Unit testing (AAA pattern)',
        'Integration testing',
        'E2E testing (Playwright, Cypress)',
        'TDD workflow',
        'Code coverage analysis'
      ],
      triggers: [
        'Keywords: test, testing, unit test, E2E, coverage, mock',
        'Files: *.test.js, *.spec.js, __tests__/*, e2e/*'
      ]
    },
    documentation: {
      emoji: '📚',
      name: 'Documentation Agent',
      description: 'Technical writing specialist',
      responsibilities: [
        'README best practices',
        'API documentation (JSDoc, OpenAPI)',
        'User guides & tutorials',
        'Architecture Decision Records',
        'Code comments'
      ],
      triggers: [
        'Keywords: docs, documentation, README, API docs, guide, tutorial',
        'Files: README.md, *.md, docs/*, openapi.yaml'
      ]
    }
  };

  const info = agentDetails[agentName];

  if (!info) {
    console.log(chalk.red(`\n❌ Unknown agent: ${agentName}\n`));
    console.log(chalk.gray('Valid agents: orchestrator, frontend, backend, devops, testing, documentation\n'));
    process.exit(1);
  }

  const config = getAgentConfig(agentName);
  const isEnabled = info.alwaysEnabled || (config && config.enabled === true);

  console.log(chalk.cyan(`\n${info.emoji}  ${info.name}\n`));
  console.log(chalk.bold('Description:'));
  console.log(`  ${info.description}\n`);

  console.log(chalk.bold('Status:'));
  if (info.alwaysEnabled) {
    console.log(chalk.green('  ✓ ALWAYS ENABLED') + chalk.gray(' (core routing layer)'));
  } else {
    console.log(isEnabled ? chalk.green('  ✓ ENABLED') : chalk.gray('  ○ DISABLED'));
  }
  console.log();

  console.log(chalk.bold('Responsibilities:'));
  info.responsibilities.forEach(resp => {
    console.log(chalk.gray(`  • ${resp}`));
  });
  console.log();

  console.log(chalk.bold('Routing Triggers:'));
  info.triggers.forEach(trigger => {
    console.log(chalk.gray(`  • ${trigger}`));
  });
  console.log();

  if (!info.alwaysEnabled) {
    if (isEnabled) {
      console.log(chalk.gray('Commands:'));
      console.log(chalk.gray(`  leo agent disable ${agentName}  Disable this agent`));
    } else {
      console.log(chalk.gray('Commands:'));
      console.log(chalk.gray(`  leo agent enable ${agentName}   Enable this agent`));
    }
    console.log();
  }
}

/**
 * Sync AI instruction files with current agent configuration
 */
async function syncAgents(options = {}) {
  const spinner = options.silent
    ? null
    : ora('Regenerating AI instruction files...').start();

  try {
    const config = getAll();
    const aiAssistants = config['ai-assistants'] || {};
    const selectedAIs = aiAssistants.enabled || ['copilot'];
    const projectType = getProjectType();

    // Build generation config
    const generationConfig = {
      'project-type': projectType,
      agents: config.agents || {},
      'primary-ai': aiAssistants.primary || 'copilot'
    };

    // Generate instruction files
    const builder = new AIInstructionsBuilder();
    const results = await builder.generateForMultiple(selectedAIs, projectType, generationConfig);

    // Write all files
    for (const result of results) {
      if (result.success) {
        await builder.writeInstructionFile(result);
      }
    }

    const successCount = results.filter(r => r.success).length;

    if (spinner) {
      spinner.succeed(`Regenerated ${successCount} AI instruction file${successCount > 1 ? 's' : ''}`);
    } else {
      console.log(chalk.green(`\n✓ Regenerated ${successCount} AI instruction file${successCount > 1 ? 's' : ''}`));
    }

    // Show agent count
    const enabledAgents = Object.values(config.agents || {}).filter(a => a.enabled === true).length + 1;
    console.log(chalk.gray(`  Multi-agent mode: ${enabledAgents} specialized agent${enabledAgents > 1 ? 's' : ''} enabled\n`));

  } catch (error) {
    if (spinner) {
      spinner.fail('Failed to regenerate AI instruction files');
    }
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Show help for agent command
 */
function showHelp() {
  console.log(chalk.cyan('\n🎯 LEO Agent Command\n'));
  console.log(chalk.bold('Usage:'));
  console.log('  leo agent <subcommand> [agent] [options]\n');

  console.log(chalk.bold('Subcommands:'));
  console.log('  list                   List all agents and their status');
  console.log('  enable <agent>         Enable a specialized agent');
  console.log('  disable <agent>        Disable a specialized agent');
  console.log('  info <agent>           Show detailed agent information');
  console.log('  sync                   Regenerate AI instruction files\n');

  console.log(chalk.bold('Available Agents:'));
  console.log('  orchestrator           Core routing layer (always enabled)');
  console.log('  frontend               UI/UX, components, styling');
  console.log('  backend                APIs, databases, authentication');
  console.log('  devops                 CI/CD, Docker, deployment');
  console.log('  testing                Unit/integration/E2E tests');
  console.log('  documentation          README, API docs, guides\n');

  console.log(chalk.bold('Examples:'));
  console.log(chalk.gray('  leo agent list'));
  console.log(chalk.gray('  leo agent enable frontend'));
  console.log(chalk.gray('  leo agent disable devops'));
  console.log(chalk.gray('  leo agent info backend'));
  console.log(chalk.gray('  leo agent sync\n'));
}

module.exports = agentCommand;

