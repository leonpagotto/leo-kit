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

// Golden gradient ASCII art for INGVAR_KIT (IKEA Blue & Yellow)
const ingvarLine1 = '  ' + chalk.hex('#0051BA')('██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗         ██╗  ██╗██╗████████╗') + '  ';
const ingvarLine2 = '  ' + chalk.hex('#0058D6')('██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗        ██║ ██╔╝██║╚══██╔══╝') + '  ';
const ingvarLine3 = '  ' + chalk.hex('#0066FF')('██║██╔██╗ ██║██║  ███╗██║   ██║███████║██████╔╝        █████╔╝ ██║   ██║   ') + '  ';
const ingvarLine4 = '  ' + chalk.hex('#FFCC00')('██║██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║██╔══██╗        ██╔═██╗ ██║   ██║   ') + '  ';
const ingvarLine5 = '  ' + chalk.hex('#FFDB00')('██║██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║██║  ██║███████╗██║  ██╗██║   ██║   ') + '  ';
const ingvarLine6 = '  ' + chalk.hex('#FFE44D')('╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ') + '  ';

const simpleMessage = `
${chalk.hex('#0051BA')('╔═══════════════════════════════════════════════════════════════════════════════╗')}
${chalk.hex('#0051BA')('║')}${centerInBox('')}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine1}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine2}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine3}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine4}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine5}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${ingvarLine6}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${centerInBox('')}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${centerInBox(chalk.hex('#0051BA')('�  Ingka GitHub Workflow Automation Toolkit  🇸🇪'))}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${centerInBox(chalk.gray(`Version ${version}`))}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('║')}${centerInBox('')}${chalk.hex('#0051BA')('║')}
${chalk.hex('#0051BA')('╚═══════════════════════════════════════════════════════════════════════════════╝')}

${chalk.green.bold('✨ Installation Complete! ✨')}

${chalk.white('Transform your development workflow with Ingka Way of Working:')}
  ${chalk.hex('#0051BA')('•')} Multi-AI support (Copilot, Cursor, Cline, Codeium)
  ${chalk.hex('#FFDB00')('•')} Spec-driven development methodology
  ${chalk.hex('#0051BA')('•')} Automated GitHub Projects integration
  ${chalk.hex('#FFDB00')('•')} Comprehensive issue & PR templates
  ${chalk.hex('#0051BA')('•')} Smart label management
  ${chalk.hex('#FFDB00')('•')} AI-optimized workflow instructions

${chalk.hex('#0051BA')('─────────────────────────────────────────────────────────────────────')}

${chalk.hex('#0051BA').bold('🚀 Quick Start:')}

  ${chalk.white.bold('1.')} ${chalk.hex('#FFDB00')('ingvar --version')}        ${chalk.gray('→ Verify installation')}
  ${chalk.white.bold('2.')} ${chalk.hex('#FFDB00')('ingvar welcome')}          ${chalk.gray('→ View complete guide')}
  ${chalk.white.bold('3.')} ${chalk.hex('#FFDB00')('cd your-project')}      ${chalk.gray('→ Navigate to project')}
  ${chalk.white.bold('4.')} ${chalk.hex('#FFDB00')('ingvar init')}             ${chalk.gray('→ Initialize workflow')}

${chalk.hex('#0051BA')('─────────────────────────────────────────────────────────────────────')}

${chalk.gray('📚 Documentation:')} ${chalk.blue.underline('https://github.com/ingka-group/ingvar-kit')}
`;

try {
  // Always show installation message
  console.log(simpleMessage);

  const isGlobal = isGlobalInstall();
  const inGitRepo = isGitRepo();
  const alreadyInitialized = isLeoInitialized();

  // Create a marker file to indicate successful installation
  const homeDir = require('os').homedir();
  const configDir = path.join(homeDir, '.ingvar-workflow');

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
  const shouldAutoInit = process.env.INGVAR_AUTO_INIT === 'true';

  // Handle local install in a git repository
  if (!isGlobal && inGitRepo && !alreadyInitialized) {
    if (shouldAutoInit) {
      // Auto-initialize with non-interactive mode
      console.log(chalk.cyan.bold('\n🚀 Auto-initializing Ingvar Workflow...\n'));
      console.log(chalk.gray('This will set up:'));
      console.log(chalk.gray('  • Documentation structure (docs/specs/)'));
      console.log(chalk.gray('  • Issue & PR templates'));
      console.log(chalk.gray('  • GitHub Actions workflows'));
      console.log(chalk.gray('  • VS Code configuration'));
      console.log(chalk.gray('  • AI assistant instructions (Copilot by default)'));
      console.log(chalk.gray('  • GitHub labels\n'));

      try {
        // Run leo init with non-interactive mode
        const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
        execSync(`node "${cliPath}" init --non-interactive --skip-project`, {
          stdio: 'inherit',
          env: { ...process.env, INGVAR_POSTINSTALL: 'true' }
        });

        console.log(chalk.green('\n✅ Ingvar Workflow initialized successfully!\n'));
        console.log(chalk.gray('Run ') + chalk.cyan('npx ingvar status') + chalk.gray(' to check your workflow\n'));
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Auto-initialization encountered an issue'));
        console.log(chalk.gray('You can manually initialize by running: ') + chalk.cyan('npx ingvar init\n'));
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
      console.log(chalk.gray('  • AI assistant instructions (Copilot, Cursor, Cline, Codeium)'));
      console.log(chalk.gray('  • GitHub labels\n'));

      console.log(chalk.yellow('Options:\n'));
      console.log(chalk.cyan('  1.') + chalk.white(' Initialize now: ') + chalk.cyan.bold('npx ingvar init'));
      console.log(chalk.cyan('  2.') + chalk.white(' Auto-initialize on install: ') + chalk.cyan.bold('INGVAR_AUTO_INIT=true npm install'));
      console.log(chalk.cyan('  3.') + chalk.white(' Initialize later in your project directory\n'));

      console.log(chalk.gray('💡 Tip: Add INGVAR_AUTO_INIT=true to your .npmrc or package.json scripts for automatic setup\n'));
    }
  } else if (!isGlobal && inGitRepo && alreadyInitialized) {
    console.log(chalk.green('\n✅ Ingvar Workflow already initialized in this project!\n'));
    console.log(chalk.gray('Run ') + chalk.cyan('npx ingvar status') + chalk.gray(' to check your workflow\n'));
  } else if (isGlobal) {
    // Global install - show standard message (already shown above)
  } else if (!inGitRepo) {
    console.log(chalk.yellow('\n⚠️  Not in a git repository'));
    console.log(chalk.gray('Navigate to your project and run: ') + chalk.cyan('ingvar init\n'));
  }

} catch (error) {
  // Silently fail if there are issues (e.g., during npm publish)
  console.error(chalk.yellow('Note: Could not complete post-install setup, but the CLI should still work.'));
}

