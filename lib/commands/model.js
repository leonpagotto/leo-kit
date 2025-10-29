/**
 * Model Selection CLI Command
 * Manage AI model selection, budgets, and usage tracking
 */

const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const ModelSelector = require('../model-selection');
const ModelConfigManager = require('../utils/model-config');

async function modelCommand(subcommand, ...args) {
  const configManager = new ModelConfigManager();

  switch (subcommand) {
    case 'list':
      await listModels();
      break;
    case 'status':
      await showStatus(configManager);
      break;
    case 'enable':
      await enableModelSelection(configManager);
      break;
    case 'disable':
      await disableModelSelection(configManager);
      break;
    case 'budget':
      await manageBudget(configManager, args);
      break;
    case 'usage':
      await showUsage();
      break;
    case 'reset':
      await resetUsage();
      break;
    case 'test':
      await testSelection(args);
      break;
    default:
      showHelp();
      break;
  }
}

/**
 * List available models
 */
async function listModels() {
  console.log(chalk.cyan.bold('\n📋 Available AI Models\n'));

  // Load config from .leorc.json to check for verbose settings
  const fs = require('fs-extra');
  const path = require('path');
  let verboseConfig = {};
  try {
    const leorc = await fs.readJSON(path.join(process.cwd(), '.leorc.json'));
    verboseConfig = leorc['model-selection'] || {};
  } catch (error) {
    // No config file, use defaults
  }

  const selector = new ModelSelector(verboseConfig);
  const models = selector.listModels();

  models.forEach(modelId => {
    const info = selector.getModelInfo(modelId);
    const tierColor = {
      premium: 'red',
      standard: 'yellow',
      economy: 'green'
    }[info.tier] || 'white';

    console.log(chalk[tierColor](`\n● ${modelId}`));
    console.log(chalk.gray(`  Provider:  ${info.provider}`));
    console.log(chalk.gray(`  Tier:      ${info.tier}`));
    console.log(chalk.gray(`  Cost:      ${info.cost}`));
    console.log(chalk.gray(`  Speed:     ${info.speed}`));
    console.log(chalk.gray(`  Strengths: ${info.strengths.join(', ')}`));
  });

  console.log(chalk.cyan('\n💡 Filter models:\n'));
  console.log(chalk.gray('  leo model list --tier=premium'));
  console.log(chalk.gray('  leo model list --provider=openai'));
  console.log(chalk.gray('  leo model list --cost=low\n'));
}

/**
 * Show model selection status
 */
async function showStatus(configManager) {
  console.log(chalk.cyan.bold('\n⚙️  Model Selection Status\n'));

  const config = configManager.getModelSelectionConfig();
  const validation = configManager.validate();
  const selector = new ModelSelector(config);
  const usageStats = selector.getUsageStats();

  // Feature status
  const statusIcon = config.enabled ? chalk.green('✓ Enabled') : chalk.yellow('○ Disabled');
  console.log(`Feature: ${statusIcon}`);
  console.log(`Strategy: ${chalk.white(config.strategy || 'auto')}\n`);

  // Budgets
  console.log(chalk.cyan('💰 Budgets:\n'));
  console.log(`  Daily:     $${config.budgets.daily.toFixed(2)}`);
  console.log(`  Monthly:   $${config.budgets.monthly.toFixed(2)}`);
  console.log(`  Per Agent: $${config.budgets.perAgent.toFixed(2)}\n`);

  // Current usage
  console.log(chalk.cyan('📊 Current Usage:\n'));

  const dailyPercent = usageStats.daily.percentUsed.toFixed(1);
  const dailyColor = usageStats.daily.percentUsed > 80 ? 'red' : usageStats.daily.percentUsed > 50 ? 'yellow' : 'green';
  console.log(`  Daily:   $${usageStats.daily.cost.toFixed(2)} / $${usageStats.daily.budget.toFixed(2)} ${chalk[dailyColor](`(${dailyPercent}%)`)}`);

  const monthlyPercent = usageStats.monthly.percentUsed.toFixed(1);
  const monthlyColor = usageStats.monthly.percentUsed > 80 ? 'red' : usageStats.monthly.percentUsed > 50 ? 'yellow' : 'green';
  console.log(`  Monthly: $${usageStats.monthly.cost.toFixed(2)} / $${usageStats.monthly.budget.toFixed(2)} ${chalk[monthlyColor](`(${monthlyPercent}%)`)}\n`);

  // Providers
  console.log(chalk.cyan('🔌 Providers:\n'));
  Object.keys(config.providers || {}).forEach(provider => {
    const providerConfig = config.providers[provider];
    const statusIcon = providerConfig.enabled ? chalk.green('✓') : chalk.gray('○');
    const keyStatus = providerConfig.apiKey ? chalk.green('API key set') : chalk.yellow('No API key');
    console.log(`  ${statusIcon} ${provider}: ${keyStatus}`);
  });

  // Validation
  if (!validation.valid) {
    console.log(chalk.red('\n⚠️  Configuration Issues:\n'));
    validation.errors.forEach(error => {
      console.log(chalk.red(`  ✗ ${error}`));
    });
  }

  if (validation.warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  Warnings:\n'));
    validation.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ! ${warning}`));
    });
  }

  console.log();
}

/**
 * Enable model selection
 */
async function enableModelSelection(configManager) {
  const spinner = ora('Enabling model selection...').start();

  try {
    await configManager.enable();
    spinner.succeed('Model selection enabled!');

    console.log(chalk.cyan('\n💡 Next steps:\n'));
    console.log(chalk.gray('  1. Configure budgets: leo model budget'));
    console.log(chalk.gray('  2. Set API keys: export OPENAI_API_KEY=...'));
    console.log(chalk.gray('  3. Check status: leo model status\n'));
  } catch (error) {
    spinner.fail('Failed to enable model selection');
    console.error(chalk.red(error.message));
  }
}

/**
 * Disable model selection
 */
async function disableModelSelection(configManager) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Disable model selection? (Will use default models)',
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Cancelled\n'));
    return;
  }

  const spinner = ora('Disabling model selection...').start();

  try {
    await configManager.disable();
    spinner.succeed('Model selection disabled');
  } catch (error) {
    spinner.fail('Failed to disable model selection');
    console.error(chalk.red(error.message));
  }
}

/**
 * Manage budgets
 */
async function manageBudget(configManager, args) {
  if (args.length === 0) {
    // Show current budgets
    const budgets = configManager.getBudgets();
    console.log(chalk.cyan.bold('\n💰 Current Budgets\n'));
    console.log(`  Daily:     $${budgets.daily.toFixed(2)}`);
    console.log(`  Monthly:   $${budgets.monthly.toFixed(2)}`);
    console.log(`  Per Agent: $${budgets.perAgent.toFixed(2)}\n`);

    console.log(chalk.gray('💡 Set budgets:\n'));
    console.log(chalk.gray('  leo model budget daily 10'));
    console.log(chalk.gray('  leo model budget monthly 100'));
    console.log(chalk.gray('  leo model budget perAgent 20\n'));
    return;
  }

  // Set budget
  const [type, amount] = args;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount < 0) {
    console.log(chalk.red('\n❌ Invalid amount. Must be a positive number.\n'));
    return;
  }

  const validTypes = ['daily', 'monthly', 'perAgent'];
  if (!validTypes.includes(type)) {
    console.log(chalk.red(`\n❌ Invalid budget type. Use: ${validTypes.join(', ')}\n`));
    return;
  }

  const spinner = ora(`Setting ${type} budget to $${numAmount.toFixed(2)}...`).start();

  try {
    await configManager.setBudget(type, numAmount);
    spinner.succeed(`${type} budget set to $${numAmount.toFixed(2)}`);
  } catch (error) {
    spinner.fail('Failed to set budget');
    console.error(chalk.red(error.message));
  }
}

/**
 * Show usage statistics
 */
async function showUsage() {
  console.log(chalk.cyan.bold('\n📊 Usage Statistics\n'));

  const selector = new ModelSelector();
  const stats = selector.getUsageStats();

  // Daily usage
  console.log(chalk.cyan('Daily Usage:\n'));
  console.log(`  Cost:      $${stats.daily.cost.toFixed(2)}`);
  console.log(`  Budget:    $${stats.daily.budget.toFixed(2)}`);
  console.log(`  Remaining: $${stats.daily.remaining.toFixed(2)}`);
  console.log(`  Used:      ${stats.daily.percentUsed.toFixed(1)}%\n`);

  // Monthly usage
  console.log(chalk.cyan('Monthly Usage:\n'));
  console.log(`  Cost:      $${stats.monthly.cost.toFixed(2)}`);
  console.log(`  Budget:    $${stats.monthly.budget.toFixed(2)}`);
  console.log(`  Remaining: $${stats.monthly.remaining.toFixed(2)}`);
  console.log(`  Used:      ${stats.monthly.percentUsed.toFixed(1)}%\n`);

  // By agent
  if (stats.agents.length > 0) {
    console.log(chalk.cyan('By Agent:\n'));
    stats.agents.forEach(agent => {
      console.log(`  ${chalk.white(agent.name.padEnd(15))} $${agent.cost.toFixed(2)} (${agent.requestCount} requests)`);
    });
    console.log();
  }

  // By model
  if (stats.models.length > 0) {
    console.log(chalk.cyan('By Model:\n'));
    stats.models.forEach(model => {
      console.log(`  ${chalk.white(model.name.padEnd(20))} $${model.cost.toFixed(2)} (${model.requestCount} requests)`);
    });
    console.log();
  }

  console.log(chalk.gray(`Last reset: ${stats.lastReset}\n`));
}

/**
 * Reset usage tracking
 */
async function resetUsage() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Reset all usage data? (Cannot be undone)',
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Cancelled\n'));
    return;
  }

  const spinner = ora('Resetting usage data...').start();

  try {
    const selector = new ModelSelector();
    await selector.resetUsage();
    spinner.succeed('Usage data reset');
  } catch (error) {
    spinner.fail('Failed to reset usage');
    console.error(chalk.red(error.message));
  }
}

/**
 * Test model selection
 */
async function testSelection(args) {
  console.log(chalk.cyan.bold('\n🧪 Testing Model Selection\n'));

  const agent = args[0] || 'frontend';
  const complexity = args[1] || 'moderate';

  console.log(chalk.gray(`Agent:      ${agent}`));
  console.log(chalk.gray(`Complexity: ${complexity}\n`));

  // Load config from .leorc.json to check for verbose settings
  const fs = require('fs-extra');
  const path = require('path');
  let verboseConfig = { verbose: true, showReasoning: true }; // Always verbose for test command
  try {
    const leorc = await fs.readJSON(path.join(process.cwd(), '.leorc.json'));
    verboseConfig = { ...verboseConfig, ...(leorc['model-selection'] || {}) };
  } catch (error) {
    // No config file, use defaults
  }

  const selector = new ModelSelector(verboseConfig);

  try {
    const model = await selector.selectModel(agent, { type: 'test' }, complexity);
    const modelInfo = selector.getModelInfo(model);

    console.log(chalk.green(`✓ Selected: ${chalk.white(model)}\n`));
    console.log(chalk.gray('Model Info:\n'));
    console.log(`  Provider:  ${modelInfo.provider}`);
    console.log(`  Tier:      ${modelInfo.tier}`);
    console.log(`  Cost:      ${modelInfo.cost}`);
    console.log(`  Speed:     ${modelInfo.speed}\n`);
  } catch (error) {
    console.log(chalk.red(`✗ Selection failed: ${error.message}\n`));
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log(chalk.cyan.bold('\n🤖 Model Selection Commands\n'));
  console.log(chalk.white('Usage: leo model <command> [options]\n'));

  console.log(chalk.cyan('Commands:\n'));
  console.log('  list              List available models');
  console.log('  status            Show model selection status');
  console.log('  enable            Enable model selection');
  console.log('  disable           Disable model selection');
  console.log('  budget [type]     View/set budgets');
  console.log('  usage             Show usage statistics');
  console.log('  reset             Reset usage data');
  console.log('  test [agent]      Test model selection\n');

  console.log(chalk.cyan('Examples:\n'));
  console.log(chalk.gray('  leo model list'));
  console.log(chalk.gray('  leo model status'));
  console.log(chalk.gray('  leo model budget daily 10'));
  console.log(chalk.gray('  leo model test frontend complex\n'));
}

module.exports = modelCommand;
