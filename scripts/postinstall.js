#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Read version from package.json
const getVersion = () => {
  try {
    const packageJson = require(path.join(__dirname, '../package.json'));
    return packageJson.version;
  } catch (error) {
    return '2.6.2'; // Fallback version
  }
};

// Helper function to center text within box (67 chars wide inside border)
const centerInBox = (text) => {
  const boxWidth = 67;
  const strippedLength = text.replace(/\u001b\[[0-9;]*m/g, '').length; // Remove ANSI codes
  const totalPadding = boxWidth - strippedLength;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
};

// Determine if this is a global or local install
const isGlobalInstall = () => {
  const npmPrefix = process.env.npm_config_prefix || '';
  const localPath = process.env.npm_config_local_prefix || '';
  return npmPrefix && localPath && npmPrefix !== localPath;
};

// Check if we're in a git repository
const isGitRepo = () => {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Check if LEO is already initialized
const isLeoInitialized = () => {
  return fs.existsSync('.github/ISSUE_TEMPLATE') ||
         fs.existsSync('docs/specs') ||
         fs.existsSync('.github/copilot-instructions.md');
};

const version = getVersion();

// Golden gradient ASCII art for LEO_KIT
const leoLine1 = '  ' + chalk.hex('#FFD700')('██╗     ███████╗ ██████╗         ██╗  ██╗██╗████████╗') + '  ';
const leoLine2 = '  ' + chalk.hex('#FFC700')('██║     ██╔════╝██╔═══██╗        ██║ ██╔╝██║╚══██╔══╝') + '  ';
const leoLine3 = '  ' + chalk.hex('#FFB700')('██║     █████╗  ██║   ██║        █████╔╝ ██║   ██║   ') + '  ';
const leoLine4 = '  ' + chalk.hex('#FFA500')('██║     ██╔══╝  ██║   ██║        ██╔═██╗ ██║   ██║   ') + '  ';
const leoLine5 = '  ' + chalk.hex('#FF9500')('███████╗███████╗╚██████╔╝███████╗██║  ██╗██║   ██║   ') + '  ';
const leoLine6 = '  ' + chalk.hex('#FF8C00')('╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ') + '  ';

const simpleMessage = `
${chalk.yellow('╔═══════════════════════════════════════════════════════════════════╗')}
${chalk.yellow('║')}${centerInBox('')}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine1}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine2}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine3}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine4}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine5}${chalk.yellow('║')}
${chalk.yellow('║')}${leoLine6}${chalk.yellow('║')}
${chalk.yellow('║')}${centerInBox('')}${chalk.yellow('║')}
${chalk.yellow('║')}${centerInBox(chalk.cyan('🦁  GitHub Workflow Automation Toolkit  🦁'))}${chalk.yellow('║')}
${chalk.yellow('║')}${centerInBox(chalk.gray(`Version ${version}`))}${chalk.yellow('║')}
${chalk.yellow('║')}${centerInBox('')}${chalk.yellow('║')}
${chalk.yellow('╚═══════════════════════════════════════════════════════════════════╝')}

${chalk.green.bold('✨ Installation Complete! ✨')}

${chalk.white('Transform your development workflow with:')}
  ${chalk.cyan('•')} Spec-driven development methodology
  ${chalk.blue('•')} Automated GitHub Projects integration
  ${chalk.magenta('•')} Comprehensive issue & PR templates
  ${chalk.cyan('•')} Smart label management
  ${chalk.blue('•')} Enhanced Copilot instructions

${chalk.yellow('─────────────────────────────────────────────────────────────────────')}

${chalk.cyan.bold('🚀 Quick Start:')}

  ${chalk.white.bold('1.')} ${chalk.yellow('leo --version')}        ${chalk.gray('→ Verify installation')}
  ${chalk.white.bold('2.')} ${chalk.yellow('leo welcome')}          ${chalk.gray('→ View complete guide')}
  ${chalk.white.bold('3.')} ${chalk.yellow('cd your-project')}      ${chalk.gray('→ Navigate to project')}
  ${chalk.white.bold('4.')} ${chalk.yellow('leo init')}             ${chalk.gray('→ Initialize workflow')}

${chalk.yellow('─────────────────────────────────────────────────────────────────────')}

${chalk.gray('📚 Documentation:')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit')}
`;

try {
  // Always show installation message
  console.log(simpleMessage);

  const isGlobal = isGlobalInstall();
  const inGitRepo = isGitRepo();
  const alreadyInitialized = isLeoInitialized();

  // Create a marker file to indicate successful installation
  const homeDir = require('os').homedir();
  const configDir = path.join(homeDir, '.leo-workflow');

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const installFile = path.join(configDir, '.last-install');
  fs.writeFileSync(installFile, JSON.stringify({
    version: version,
    installedAt: new Date().toISOString(),
    installType: isGlobal ? 'global' : 'local'
  }, null, 2));

  // Check for auto-initialization flag
  const shouldAutoInit = process.env.LEO_AUTO_INIT === 'true';

  // Handle local install in a git repository
  if (!isGlobal && inGitRepo && !alreadyInitialized) {
    if (shouldAutoInit) {
      // Auto-initialize with non-interactive mode
      console.log(chalk.cyan.bold('\n🚀 Auto-initializing LEO Workflow...\n'));
      console.log(chalk.gray('This will set up:'));
      console.log(chalk.gray('  • Documentation structure (docs/specs/)'));
      console.log(chalk.gray('  • Issue & PR templates'));
      console.log(chalk.gray('  • GitHub Actions workflows'));
      console.log(chalk.gray('  • VS Code configuration'));
      console.log(chalk.gray('  • Copilot instructions'));
      console.log(chalk.gray('  • GitHub labels\n'));

      try {
        // Run leo init with non-interactive mode
        const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
        execSync(`node "${cliPath}" init --non-interactive --skip-project`, {
          stdio: 'inherit',
          env: { ...process.env, LEO_POSTINSTALL: 'true' }
        });

        console.log(chalk.green('\n✅ LEO Workflow initialized successfully!\n'));
        console.log(chalk.gray('Run ') + chalk.cyan('npx leo status') + chalk.gray(' to check your workflow\n'));
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Auto-initialization encountered an issue'));
        console.log(chalk.gray('You can manually initialize by running: ') + chalk.cyan('npx leo init\n'));
      }
    } else {
      // Show initialization prompt
      console.log(chalk.cyan.bold('\n🎯 Quick Setup Available!\n'));
      console.log(chalk.white('You installed LEO locally in a git repository.'));
      console.log(chalk.white('The workflow can be initialized automatically!\n'));
      console.log(chalk.gray('This will set up:'));
      console.log(chalk.gray('  • Documentation structure (docs/specs/)'));
      console.log(chalk.gray('  • Issue & PR templates'));
      console.log(chalk.gray('  • GitHub Actions workflows'));
      console.log(chalk.gray('  • VS Code configuration'));
      console.log(chalk.gray('  • Copilot instructions'));
      console.log(chalk.gray('  • GitHub labels\n'));

      console.log(chalk.yellow('Options:\n'));
      console.log(chalk.cyan('  1.') + chalk.white(' Initialize now: ') + chalk.cyan.bold('npx leo init'));
      console.log(chalk.cyan('  2.') + chalk.white(' Auto-initialize on install: ') + chalk.cyan.bold('LEO_AUTO_INIT=true npm install'));
      console.log(chalk.cyan('  3.') + chalk.white(' Initialize later in your project directory\n'));

      console.log(chalk.gray('💡 Tip: Add LEO_AUTO_INIT=true to your .npmrc or package.json scripts for automatic setup\n'));
    }
  } else if (!isGlobal && inGitRepo && alreadyInitialized) {
    console.log(chalk.green('\n✅ LEO Workflow already initialized in this project!\n'));
    console.log(chalk.gray('Run ') + chalk.cyan('npx leo status') + chalk.gray(' to check your workflow\n'));
  } else if (isGlobal) {
    // Global install - show standard message (already shown above)
  } else if (!inGitRepo) {
    console.log(chalk.yellow('\n⚠️  Not in a git repository'));
    console.log(chalk.gray('Navigate to your project and run: ') + chalk.cyan('leo init\n'));
  }

} catch (error) {
  // Silently fail if there are issues (e.g., during npm publish)
  console.error(chalk.yellow('Note: Could not complete post-install setup, but the CLI should still work.'));
}
