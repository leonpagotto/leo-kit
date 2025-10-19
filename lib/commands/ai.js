const chalk = require('chalk');
const { AIInstructionsBuilder } = require('../ai-instructions');
const configManager = require('../utils/config-manager');

/**
 * AI Command - Manage AI assistant configurations
 * Subcommands: list, add, remove, sync, diff
 */

async function listAIs() {
  console.log(chalk.cyan.bold('\n📦 Configured AI Assistants:\n'));

  const config = configManager.get('ai-assistants') || { enabled: ['copilot'] };
  const builder = new AIInstructionsBuilder();

  // Check which files exist
  const existing = await builder.detectExistingAIs();
  const enabled = config.enabled || [];

  if (enabled.length === 0) {
    console.log(chalk.yellow('  No AI assistants configured.'));
    console.log(chalk.gray(`  Run ${chalk.cyan('leo ai add <ai-name>')} to add one.\n`));
    return;
  }

  // Show enabled AIs
  for (const aiName of enabled) {
    try {
      const adapter = builder.getAdapter(aiName);
      const filePath = adapter.getFilePath();
      const existsInfo = existing.find(e => e.ai === aiName);

      if (existsInfo) {
        console.log(chalk.green(`  ✓ ${adapter.getName()}`));
        console.log(chalk.gray(`    ${filePath}`));
      } else {
        console.log(chalk.yellow(`  ⚠ ${adapter.getName()}`));
        console.log(chalk.gray(`    ${filePath} (not generated)`));
      }
    } catch (error) {
      console.log(chalk.red(`  ✗ ${aiName} (invalid)`));
    }
  }

  // Show primary AI
  if (config.primary) {
    console.log(chalk.cyan(`\n  Primary AI: ${config.primary}`));
  }

  console.log('');
}

async function addAI(aiName) {
  if (!aiName) {
    const builder = new AIInstructionsBuilder();
    const availableAIs = builder.getAvailableAIs();

    console.log(chalk.red('\n✗ Please specify an AI assistant name\n'));
    console.log(chalk.gray('Available AIs: ' + availableAIs.join(', ')));
    console.log(chalk.gray('\nExample: ' + chalk.cyan('leo ai add cursor\n')));
    return;
  }

  const builder = new AIInstructionsBuilder();
  const availableAIs = builder.getAvailableAIs();

  if (!availableAIs.includes(aiName)) {
    console.log(chalk.red(`\n✗ Unknown AI assistant: ${aiName}\n`));
    console.log(chalk.gray('Available AIs: ' + availableAIs.join(', ') + '\n'));
    return;
  }

  // Check if already added
  const config = configManager.get('ai-assistants') || { enabled: [] };
  if (config.enabled && config.enabled.includes(aiName)) {
    console.log(chalk.yellow(`\n⚠ ${aiName} is already configured\n`));
    return;
  }

  try {
    // Generate instruction file
    const projectType = configManager.get('project-type') || 'auto';
    const result = await builder.generateForAI(aiName, projectType);

    // Write file
    await builder.writeInstructionFile(result);

    // Update config
    if (!config.enabled) {
      config.enabled = [];
    }
    config.enabled.push(aiName);

    // Set as primary if it's the first AI
    if (!config.primary) {
      config.primary = aiName;
    }

    configManager.set('ai-assistants', config);

    console.log(chalk.green(`\n✓ Added ${result.metadata.name}`));
    console.log(chalk.gray(`  Generated: ${result.filePath}\n`));
  } catch (error) {
    console.log(chalk.red(`\n✗ Failed to add ${aiName}:`), error.message + '\n');
  }
}

async function removeAI(aiName) {
  if (!aiName) {
    console.log(chalk.red('\n✗ Please specify an AI assistant name\n'));
    console.log(chalk.gray('Example: ' + chalk.cyan('leo ai remove cursor\n')));
    return;
  }

  const config = configManager.get('ai-assistants') || { enabled: [] };

  if (!config.enabled || !config.enabled.includes(aiName)) {
    console.log(chalk.yellow(`\n⚠ ${aiName} is not configured\n`));
    return;
  }

  try {
    const builder = new AIInstructionsBuilder();
    const adapter = builder.getAdapter(aiName);
    const fs = require('fs-extra');
    const path = require('path');

    // Remove file if it exists
    const filePath = path.join(process.cwd(), adapter.getFilePath());
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      console.log(chalk.green(`\n✓ Removed ${adapter.getFilePath()}`));
    }

    // Update config
    config.enabled = config.enabled.filter(ai => ai !== aiName);

    // Update primary if needed
    if (config.primary === aiName) {
      config.primary = config.enabled[0] || null;
    }

    configManager.set('ai-assistants', config);

    console.log(chalk.green(`✓ Removed ${aiName} from configuration\n`));
  } catch (error) {
    console.log(chalk.red(`\n✗ Failed to remove ${aiName}:`), error.message + '\n');
  }
}

async function syncAIs() {
  console.log(chalk.cyan.bold('\n🔄 Syncing AI instruction files...\n'));

  const config = configManager.get('ai-assistants') || { enabled: ['copilot'] };
  const enabled = config.enabled || ['copilot'];

  if (enabled.length === 0) {
    console.log(chalk.yellow('No AI assistants configured.\n'));
    return;
  }

  const builder = new AIInstructionsBuilder();
  const projectType = configManager.get('project-type') || 'auto';

  const summary = await builder.generateAndWrite(enabled, projectType);

  console.log(chalk.cyan.bold('📊 Summary:'));
  console.log(chalk.green(`  ✓ Success: ${summary.success.length}`));
  if (summary.failed.length > 0) {
    console.log(chalk.red(`  ✗ Failed: ${summary.failed.length}`));
  }
  console.log('');
}

async function diffAIs(ai1, ai2) {
  console.log(chalk.yellow('\n⚠ diff command coming soon!\n'));
  console.log(chalk.gray('This will compare instruction files between two AIs.\n'));
}

/**
 * Main AI command handler
 */
async function aiCommand(subcommand, ...args) {
  switch (subcommand) {
    case 'list':
    case 'ls':
      await listAIs();
      break;

    case 'add':
      await addAI(args[0]);
      break;

    case 'remove':
    case 'rm':
      await removeAI(args[0]);
      break;

    case 'sync':
      await syncAIs();
      break;

    case 'diff':
      await diffAIs(args[0], args[1]);
      break;

    default:
      // Show help
      console.log(chalk.cyan.bold('\n🤖 LEO AI Command\n'));
      console.log(chalk.white('Manage AI assistant configurations\n'));
      console.log(chalk.gray('Usage:'));
      console.log(chalk.cyan('  leo ai list') + chalk.gray('              # List configured AIs'));
      console.log(chalk.cyan('  leo ai add <ai-name>') + chalk.gray('    # Add AI assistant'));
      console.log(chalk.cyan('  leo ai remove <ai-name>') + chalk.gray(' # Remove AI assistant'));
      console.log(chalk.cyan('  leo ai sync') + chalk.gray('              # Regenerate all AI files'));
      console.log(chalk.cyan('  leo ai diff <ai1> <ai2>') + chalk.gray(' # Compare two AIs'));
      console.log('');

      // Show available AIs dynamically
      const builder = new AIInstructionsBuilder();
      const availableAIs = builder.getAvailableAIs();
      console.log(chalk.gray('Available AIs:'));
      for (const aiName of availableAIs) {
        try {
          const adapter = builder.getAdapter(aiName);
          const metadata = adapter.getMetadata();
          console.log(chalk.gray(`  • ${aiName.padEnd(10)} ${metadata.description || metadata.name}`));
        } catch (err) {
          console.log(chalk.gray(`  • ${aiName}`));
        }
      }

      console.log('');
      console.log(chalk.gray('Examples:'));
      console.log(chalk.gray('  leo ai add cursor'));
      console.log(chalk.gray('  leo ai add cline'));
      console.log(chalk.gray('  leo ai list'));
      console.log(chalk.gray('  leo ai sync\n'));
  }
}

module.exports = aiCommand;
