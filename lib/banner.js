const chalk = require('chalk');
const path = require('path');

// Read version from package.json
const getVersion = () => {
  try {
    const packageJson = require(path.join(__dirname, '../package.json'));
    return packageJson.version;
  } catch (error) {
    return '2.6.2'; // Fallback version
  }
};

// Helper function to center text within a given width
const centerText = (text, width) => {
  const strippedLength = text.replace(/\u001b\[[0-9;]*m/g, '').length; // Remove ANSI codes for length calculation
  const totalPadding = width - strippedLength;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  return ' '.repeat(leftPadding) + text + ' '.repeat(rightPadding);
};

// Function to create the main banner with gradient-like effects
function getBanner() {
  const version = getVersion();
  const versionText = `Version ${version}  •  Made with ❤️  by Leo Pagotto`;

  return `
${chalk.hex('#FFD700')('            ██╗     ███████╗ ██████╗         ██╗  ██╗██╗████████╗')}
${chalk.hex('#FFC700')('            ██║     ██╔════╝██╔═══██╗        ██║ ██╔╝██║╚══██╔══╝')}
${chalk.hex('#FFB700')('            ██║     █████╗  ██║   ██║        █████╔╝ ██║   ██║   ')}
${chalk.hex('#FFA500')('            ██║     ██╔══╝  ██║   ██║        ██╔═██╗ ██║   ██║   ')}
${chalk.hex('#FF9500')('            ███████╗███████╗╚██████╔╝███████╗██║  ██╗██║   ██║   ')}
${chalk.hex('#FF8C00')('            ╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ')}

${centerText(chalk.cyan('🦁  GitHub Workflow Automation Toolkit  🦁'), 77)}

${centerText(chalk.white('⚡ Initialize  •  🎯 Issues  •  📋 Labels  •  🔄 Automation'), 77)}

${centerText(chalk.gray(versionText), 77)}
`;
}// Compact banner for smaller displays
function getCompactBanner() {
  return `
${chalk.yellow('    🦁')}  ${chalk.yellow.bold('LEO-KIT')}
    ${chalk.gray('GitHub Workflow Automation Toolkit')}
`;
}

// Welcome message for installation
function getWelcomeMessage() {
  return `
${chalk.yellow('    ╔═══════════════════════════════════════════════════════════════╗')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ║                  ')}${chalk.yellow('🦁  ')}${chalk.yellow.bold('LEO-KIT')}${chalk.yellow('  🦁')}${chalk.yellow('                       ║')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ║')}        ${chalk.white.bold('Complete GitHub Workflow Automation Toolkit')}        ${chalk.yellow('║')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ╚═══════════════════════════════════════════════════════════════╝')}

    ${chalk.green.bold('✨ Successfully installed LEO Workflow Kit! ✨')}

    ${chalk.white('Transform your development workflow with:')}
    ${chalk.cyan('  •')} ${chalk.white('Spec-driven development methodology')}
    ${chalk.blue('  •')} ${chalk.white('Automated GitHub Projects integration')}
    ${chalk.magenta('  •')} ${chalk.white('Comprehensive issue templates')}
    ${chalk.cyan('  •')} ${chalk.white('Smart label management')}
    ${chalk.blue('  •')} ${chalk.white('VS Code Copilot integration')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('🚀 Quick Start Guide:')}

    ${chalk.white.bold('Step 1:')} Navigate to your project
       ${chalk.gray('$')} ${chalk.yellow('cd your-project')}

    ${chalk.white.bold('Step 2:')} Initialize LEO workflow (one-time setup)
       ${chalk.gray('$')} ${chalk.yellow('leo init')}
       ${chalk.gray('   → Sets up docs, templates, labels, and VS Code config')}

    ${chalk.white.bold('Step 3:')} Create your first spec-driven issue
       ${chalk.gray('$')} ${chalk.yellow('leo issue')}
       ${chalk.gray('   → Choose from 8 professional templates')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('📦 Available Commands:')}

       ${chalk.yellow.bold('leo init')}        ${chalk.gray('→')} ${chalk.white('Set up complete workflow in current project')}
       ${chalk.yellow.bold('leo issue')}       ${chalk.gray('→')} ${chalk.white('Create spec-driven issue from templates')}
       ${chalk.yellow.bold('leo labels')}      ${chalk.gray('→')} ${chalk.white('Configure GitHub labels (P0-P3, types, status)')}
       ${chalk.yellow.bold('leo vscode')}      ${chalk.gray('→')} ${chalk.white('Install VS Code Copilot instructions')}
       ${chalk.yellow.bold('leo status')}      ${chalk.gray('→')} ${chalk.white('Check workflow setup status')}
       ${chalk.yellow.bold('leo docs')}        ${chalk.gray('→')} ${chalk.white('Open documentation in browser')}

    ${chalk.gray('Aliases:')} ${chalk.yellow('leo i')} ${chalk.gray('(issue),')} ${chalk.yellow('leo l')} ${chalk.gray('(labels),')} ${chalk.yellow('leo vs')} ${chalk.gray('(vscode),')} ${chalk.yellow('leo s')} ${chalk.gray('(status)')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('📚 Learn More:')}

    ${chalk.white('Documentation:')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit#readme')}
    ${chalk.white('Report Issues:  ')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit/issues')}
    ${chalk.white('GitHub Profile: ')} ${chalk.blue.underline('https://github.com/leonpagotto')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.green.bold('🎉 Ready to streamline your workflow!')} ${chalk.gray('Start with')} ${chalk.yellow('leo init')}

`;
}

// Small inline logo for command outputs
const smallLogo = chalk.yellow('🦁');

// Get appropriate banner based on terminal width
function getResponsiveBanner() {
  const terminalWidth = process.stdout.columns || 80;
  return terminalWidth < 70 ? getCompactBanner() : getBanner();
}

// Export all banners
module.exports = {
  banner: getBanner(),
  compactBanner: getCompactBanner(),
  welcomeMessage: getWelcomeMessage(),
  smallLogo,
  getBanner: getResponsiveBanner
};
