/**
 * Install Git Hooks for LEO Workflow
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Install pre-commit hook for documentation organization
 */
async function installPreCommitHook() {
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  const preCommitPath = path.join(hooksDir, 'pre-commit');
  const sourcePath = path.join(__dirname, '..', '..', 'scripts', 'pre-commit-docs');

  try {
    // Ensure .git/hooks directory exists
    await fs.ensureDir(hooksDir);

    // Check if pre-commit hook already exists
    if (await fs.pathExists(preCommitPath)) {
      const content = await fs.readFile(preCommitPath, 'utf8');
      
      // Check if it's our hook
      if (content.includes('LEO Workflow Kit - Pre-commit Hook')) {
        console.log(chalk.gray('  ✓ Pre-commit hook already installed'));
        return { installed: true, skipped: true };
      }

      // Existing hook from another tool - append our check
      console.log(chalk.yellow('  ⚠ Existing pre-commit hook found'));
      console.log(chalk.gray('    Adding LEO documentation check...'));

      const ourHook = await fs.readFile(sourcePath, 'utf8');
      const appendedContent = content + '\n\n' + ourHook;
      await fs.writeFile(preCommitPath, appendedContent);
      await fs.chmod(preCommitPath, 0o755);

      console.log(chalk.green('  ✓ LEO check appended to existing hook'));
      return { installed: true, skipped: false, appended: true };
    }

    // Copy our pre-commit hook
    await fs.copy(sourcePath, preCommitPath);
    await fs.chmod(preCommitPath, 0o755);

    console.log(chalk.green('  ✓ Pre-commit hook installed'));
    return { installed: true, skipped: false };

  } catch (error) {
    console.log(chalk.red(`  ✗ Failed to install pre-commit hook: ${error.message}`));
    return { installed: false, error: error.message };
  }
}

/**
 * Uninstall pre-commit hook
 */
async function uninstallPreCommitHook() {
  const preCommitPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');

  try {
    if (await fs.pathExists(preCommitPath)) {
      const content = await fs.readFile(preCommitPath, 'utf8');
      
      if (content.includes('LEO Workflow Kit - Pre-commit Hook')) {
        await fs.remove(preCommitPath);
        console.log(chalk.green('  ✓ Pre-commit hook removed'));
        return { uninstalled: true };
      } else {
        console.log(chalk.yellow('  ⚠ Pre-commit hook exists but is not from LEO'));
        return { uninstalled: false, reason: 'not-leo-hook' };
      }
    } else {
      console.log(chalk.gray('  ℹ No pre-commit hook found'));
      return { uninstalled: false, reason: 'not-found' };
    }
  } catch (error) {
    console.log(chalk.red(`  ✗ Failed to uninstall hook: ${error.message}`));
    return { uninstalled: false, error: error.message };
  }
}

/**
 * Check if pre-commit hook is installed
 */
async function isHookInstalled() {
  const preCommitPath = path.join(process.cwd(), '.git', 'hooks', 'pre-commit');
  
  try {
    if (await fs.pathExists(preCommitPath)) {
      const content = await fs.readFile(preCommitPath, 'utf8');
      return content.includes('LEO Workflow Kit - Pre-commit Hook');
    }
    return false;
  } catch {
    return false;
  }
}

module.exports = {
  installPreCommitHook,
  uninstallPreCommitHook,
  isHookInstalled
};
