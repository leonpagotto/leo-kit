const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

/**
 * GitHub Repository Settings Command
 *
 * Configure GitHub repository settings to match Ingvar Workflow Kit best practices
 * Includes safety checks to prevent accidental deletions
 */

async function githubCommand(subcommand, options = {}) {
  switch (subcommand) {
    case 'setup':
      return await setupGitHubSettings(options);

    case 'status':
      return await showGitHubStatus(options);

    default:
      showHelp();
      process.exit(1);
  }
}

/**
 * Configure GitHub repository settings
 */
async function setupGitHubSettings(options) {
  console.log(chalk.cyan('\n⚙️  GitHub Repository Settings Setup\n'));

  // Check if gh CLI is available
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('❌ GitHub CLI not found. Please install gh CLI first:'));
    console.log(chalk.gray('   https://cli.github.com/'));
    process.exit(1);
  }

  // Get current repository
  let repoInfo;
  try {
    const repoOutput = execSync('gh repo view --json nameWithOwner,owner', { encoding: 'utf8' });
    repoInfo = JSON.parse(repoOutput);
  } catch (error) {
    console.log(chalk.red('❌ Not in a GitHub repository or not authenticated'));
    console.log(chalk.gray('   Run: gh auth login'));
    process.exit(1);
  }

  console.log(chalk.gray(`Repository: ${repoInfo.nameWithOwner}\n`));

  // Get current settings
  const spinner = ora('Fetching current repository settings...').start();
  let currentSettings;

  try {
    const settingsOutput = execSync(
      'gh repo view --json hasIssuesEnabled,hasProjectsEnabled,hasWikiEnabled,hasDiscussionsEnabled,mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed,deleteBranchOnMerge,isBlankIssuesEnabled',
      { encoding: 'utf8' }
    );
    currentSettings = JSON.parse(settingsOutput);
    spinner.succeed('Current settings fetched');
  } catch (error) {
    spinner.fail('Failed to fetch settings');
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  // Show current settings
  console.log(chalk.bold('\n📊 Current Settings:\n'));
  console.log(`  Issues:              ${formatBoolean(currentSettings.hasIssuesEnabled)}`);
  console.log(`  Projects:            ${formatBoolean(currentSettings.hasProjectsEnabled)}`);
  console.log(`  Wiki:                ${formatBoolean(currentSettings.hasWikiEnabled)}`);
  console.log(`  Discussions:         ${formatBoolean(currentSettings.hasDiscussionsEnabled)}`);
  console.log(`  Delete branch on merge: ${formatBoolean(currentSettings.deleteBranchOnMerge)}`);
  console.log(`  Allow merge commits: ${formatBoolean(currentSettings.mergeCommitAllowed)}`);
  console.log(`  Allow squash merge:  ${formatBoolean(currentSettings.squashMergeAllowed)}`);
  console.log(`  Allow rebase merge:  ${formatBoolean(currentSettings.rebaseMergeAllowed)}`);

  // Recommended settings (Ingvar Workflow Kit best practices)
  const recommendedSettings = {
    hasIssuesEnabled: true,
    hasProjectsEnabled: true,
    hasWikiEnabled: true,
    hasDiscussionsEnabled: true,
    deleteBranchOnMerge: true,
    mergeCommitAllowed: true,
    squashMergeAllowed: true,
    rebaseMergeAllowed: true
  };

  console.log(chalk.bold('\n✨ Recommended Settings (Ingvar Workflow Kit):\n'));
  console.log(`  Issues:              ${formatBoolean(recommendedSettings.hasIssuesEnabled)} ${chalk.gray('(for issue tracking)')}`);
  console.log(`  Projects:            ${formatBoolean(recommendedSettings.hasProjectsEnabled)} ${chalk.gray('(for project boards)')}`);
  console.log(`  Wiki:                ${formatBoolean(recommendedSettings.hasWikiEnabled)} ${chalk.gray('(for documentation)')}`);
  console.log(`  Discussions:         ${formatBoolean(recommendedSettings.hasDiscussionsEnabled)} ${chalk.gray('(for community)')}`);
  console.log(`  Delete branch on merge: ${formatBoolean(recommendedSettings.deleteBranchOnMerge)} ${chalk.gray('(keep repo clean)')}`);
  console.log(`  Allow merge commits: ${formatBoolean(recommendedSettings.mergeCommitAllowed)} ${chalk.gray('(preserve history)')}`);
  console.log(`  Allow squash merge:  ${formatBoolean(recommendedSettings.squashMergeAllowed)} ${chalk.gray('(clean commits)')}`);
  console.log(`  Allow rebase merge:  ${formatBoolean(recommendedSettings.rebaseMergeAllowed)} ${chalk.gray('(linear history)')}`);

  // Calculate changes
  const changes = [];

  for (const [key, recommendedValue] of Object.entries(recommendedSettings)) {
    if (currentSettings[key] !== recommendedValue) {
      changes.push({
        setting: key,
        current: currentSettings[key],
        recommended: recommendedValue
      });
    }
  }

  if (changes.length === 0) {
    console.log(chalk.green('\n✅ Repository already configured with recommended settings!\n'));
    return;
  }

  console.log(chalk.yellow(`\n⚠️  ${changes.length} setting(s) need to be updated:\n`));

  changes.forEach(change => {
    const settingName = formatSettingName(change.setting);
    console.log(`  ${settingName}:`);
    console.log(`    Current: ${formatBoolean(change.current)}`);
    console.log(`    Recommended: ${formatBoolean(change.recommended)}`);
    console.log();
  });

  // Ask for confirmation
  if (!options.yes) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Apply recommended settings?',
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.gray('\n❌ Cancelled. No changes made.\n'));
      return;
    }
  }

  // Apply settings
  console.log();
  const updateSpinner = ora('Updating repository settings...').start();

  try {
    // Build gh repo edit command
    const editArgs = [];

    // Note: Not all settings can be changed via CLI, we'll do what we can
    if (changes.some(c => c.setting === 'deleteBranchOnMerge')) {
      editArgs.push(recommendedSettings.deleteBranchOnMerge ? '--delete-branch-on-merge' : '--delete-branch-on-merge=false');
    }

    if (changes.some(c => c.setting === 'hasIssuesEnabled')) {
      editArgs.push(recommendedSettings.hasIssuesEnabled ? '--enable-issues' : '--enable-issues=false');
    }

    if (changes.some(c => c.setting === 'hasProjectsEnabled')) {
      editArgs.push(recommendedSettings.hasProjectsEnabled ? '--enable-projects' : '--enable-projects=false');
    }

    if (changes.some(c => c.setting === 'hasWikiEnabled')) {
      editArgs.push(recommendedSettings.hasWikiEnabled ? '--enable-wiki' : '--enable-wiki=false');
    }

    if (changes.some(c => c.setting === 'mergeCommitAllowed')) {
      editArgs.push(recommendedSettings.mergeCommitAllowed ? '--enable-merge-commit' : '--enable-merge-commit=false');
    }

    if (changes.some(c => c.setting === 'squashMergeAllowed')) {
      editArgs.push(recommendedSettings.squashMergeAllowed ? '--enable-squash-merge' : '--enable-squash-merge=false');
    }

    if (changes.some(c => c.setting === 'rebaseMergeAllowed')) {
      editArgs.push(recommendedSettings.rebaseMergeAllowed ? '--enable-rebase-merge' : '--enable-rebase-merge=false');
    }

    if (editArgs.length > 0) {
      execSync(`gh repo edit ${editArgs.join(' ')}`, { stdio: 'pipe' });
    }

    // Discussions require separate API call (not available in gh repo edit)
    if (changes.some(c => c.setting === 'hasDiscussionsEnabled')) {
      try {
        // Note: Enabling discussions requires GraphQL API
        console.log(chalk.yellow('\n⚠️  Note: Discussions must be enabled manually via GitHub web UI'));
        console.log(chalk.gray('   Settings → General → Features → Discussions'));
      } catch (error) {
        // Non-critical, just log
      }
    }

    updateSpinner.succeed('Repository settings updated');

    // Show summary
    console.log(chalk.green('\n✅ Settings applied successfully!\n'));

    const manualSteps = [];
    if (changes.some(c => c.setting === 'hasDiscussionsEnabled' && !currentSettings.hasDiscussionsEnabled)) {
      manualSteps.push('Enable Discussions in GitHub web UI (Settings → General → Features)');
    }

    if (manualSteps.length > 0) {
      console.log(chalk.yellow('📝 Manual steps required:\n'));
      manualSteps.forEach((step, i) => {
        console.log(`  ${i + 1}. ${step}`);
      });
      console.log();
    }

    console.log(chalk.gray('💡 Run'), chalk.cyan('leo github status'), chalk.gray('to verify changes\n'));

  } catch (error) {
    updateSpinner.fail('Failed to update settings');
    console.error(chalk.red('\n❌ Error:'), error.message);
    console.log(chalk.gray('\nYou may need admin permissions for this repository.'));
    console.log(chalk.gray('Visit: https://github.com/' + repoInfo.nameWithOwner + '/settings\n'));
    process.exit(1);
  }
}

/**
 * Show current GitHub repository settings
 */
async function showGitHubStatus(options) {
  console.log(chalk.cyan('\n📊 GitHub Repository Settings\n'));

  // Check if gh CLI is available
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('❌ GitHub CLI not found'));
    process.exit(1);
  }

  // Get repository info
  let repoInfo;
  try {
    const repoOutput = execSync('gh repo view --json nameWithOwner,owner,url', { encoding: 'utf8' });
    repoInfo = JSON.parse(repoOutput);
  } catch (error) {
    console.log(chalk.red('❌ Not in a GitHub repository'));
    process.exit(1);
  }

  console.log(chalk.gray(`Repository: ${repoInfo.nameWithOwner}`));
  console.log(chalk.gray(`URL: ${repoInfo.url}\n`));

  // Get settings
  const spinner = ora('Fetching settings...').start();

  try {
    const settingsOutput = execSync(
      'gh repo view --json hasIssuesEnabled,hasProjectsEnabled,hasWikiEnabled,hasDiscussionsEnabled,mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed,deleteBranchOnMerge,defaultBranchRef,visibility',
      { encoding: 'utf8' }
    );
    const settings = JSON.parse(settingsOutput);
    spinner.succeed('Settings fetched');

    console.log(chalk.bold('\n⚙️  Repository Settings:\n'));
    console.log(`  Visibility:          ${settings.visibility}`);
    console.log(`  Default branch:      ${settings.defaultBranchRef.name}`);
    console.log();
    console.log(chalk.bold('Features:\n'));
    console.log(`  Issues:              ${formatBoolean(settings.hasIssuesEnabled)}`);
    console.log(`  Projects:            ${formatBoolean(settings.hasProjectsEnabled)}`);
    console.log(`  Wiki:                ${formatBoolean(settings.hasWikiEnabled)}`);
    console.log(`  Discussions:         ${formatBoolean(settings.hasDiscussionsEnabled)}`);
    console.log();
    console.log(chalk.bold('Merge Settings:\n'));
    console.log(`  Delete branch on merge: ${formatBoolean(settings.deleteBranchOnMerge)}`);
    console.log(`  Allow merge commits: ${formatBoolean(settings.mergeCommitAllowed)}`);
    console.log(`  Allow squash merge:  ${formatBoolean(settings.squashMergeAllowed)}`);
    console.log(`  Allow rebase merge:  ${formatBoolean(settings.rebaseMergeAllowed)}`);
    console.log();

    console.log(chalk.gray('💡 Run'), chalk.cyan('leo github setup'), chalk.gray('to configure recommended settings\n'));

  } catch (error) {
    spinner.fail('Failed to fetch settings');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Format boolean value with color
 */
function formatBoolean(value) {
  return value
    ? chalk.green('✓ Enabled')
    : chalk.gray('○ Disabled');
}

/**
 * Format setting name for display
 */
function formatSettingName(key) {
  const names = {
    hasIssuesEnabled: 'Issues',
    hasProjectsEnabled: 'Projects',
    hasWikiEnabled: 'Wiki',
    hasDiscussionsEnabled: 'Discussions',
    deleteBranchOnMerge: 'Delete branch on merge',
    mergeCommitAllowed: 'Allow merge commits',
    squashMergeAllowed: 'Allow squash merge',
    rebaseMergeAllowed: 'Allow rebase merge'
  };

  return names[key] || key;
}

/**
 * Show help for github command
 */
function showHelp() {
  console.log(chalk.cyan('\n⚙️  LEO GitHub Settings Command\n'));
  console.log(chalk.bold('Usage:'));
  console.log('  leo github <subcommand> [options]\n');

  console.log(chalk.bold('Subcommands:'));
  console.log('  setup                  Configure repository with recommended settings');
  console.log('  status                 Show current repository settings\n');

  console.log(chalk.bold('Options:'));
  console.log('  --yes, -y              Skip confirmation prompts\n');

  console.log(chalk.bold('Recommended Settings:'));
  console.log('  ✓ Issues enabled       - For issue tracking');
  console.log('  ✓ Projects enabled     - For project boards');
  console.log('  ✓ Wiki enabled         - For documentation');
  console.log('  ✓ Discussions enabled  - For community');
  console.log('  ✓ Delete branch on merge - Keep repository clean');
  console.log('  ✓ All merge types      - Flexibility in workflows\n');

  console.log(chalk.bold('Examples:'));
  console.log(chalk.gray('  leo github status'));
  console.log(chalk.gray('  leo github setup'));
  console.log(chalk.gray('  leo github setup --yes\n'));
}

module.exports = githubCommand;

