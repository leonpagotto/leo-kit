const chalk = require('chalk');
const path = require('path');

// Read version from package.json
const getVersion = () => {
  try {
    const packageJson = require(path.join(__dirname, '../package.json'));
    return packageJson.version;
  } catch (error) {
    return '5.0.0'; // Fallback version
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

/**
 * ASCII Gradient Effects
 * Creates beautiful color gradients for terminal output
 */
class ASCIIGradientBanner {
  /**
   * Create a gradient line effect
   */
  static gradientLine(text, startRGB, endRGB, steps = 6) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const ratio = i / Math.max(lines.length - 1, 1);
      const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * ratio);
      const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * ratio);
      const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * ratio);
      return chalk.rgb(r, g, b)(line);
    }).join('\n');
  }

  /**
   * Create rainbow gradient
   */
  static rainbowGradient(text) {
    const lines = text.split('\n');
    const colors = [
      [255, 100, 100], // Red
      [255, 165, 0],   // Orange
      [255, 255, 0],   // Yellow
      [0, 255, 0],     // Green
      [100, 150, 255], // Blue
      [200, 100, 255]  // Purple
    ];

    return lines.map((line, i) => {
      const color = colors[i % colors.length];
      return chalk.rgb(color[0], color[1], color[2])(line);
    }).join('\n');
  }

  /**
   * Create fire gradient (red to orange to yellow)
   */
  static fireGradient(text) {
    return this.gradientLine(text, [255, 0, 0], [255, 200, 0]);
  }

  /**
   * Create ocean gradient (blue to cyan)
   */
  static oceanGradient(text) {
    return this.gradientLine(text, [0, 100, 200], [100, 200, 255]);
  }

  /**
   * Create forest gradient (dark green to light green)
   */
  static forestGradient(text) {
    return this.gradientLine(text, [34, 139, 34], [144, 238, 144]);
  }

  /**
   * Create purple gradient
   */
  static purpleGradient(text) {
    return this.gradientLine(text, [128, 0, 128], [200, 100, 255]);
  }
}

// Function to create the main banner with gradient-like effects (v5.0.0 - Enhanced)
function getBanner() {
  const version = getVersion();
  const versionText = `Version ${version}  •  Made with ❤️  by Leo Pagotto`;

  const logo = `
            ██╗     ███████╗ ██████╗         ██╗  ██╗██╗████████╗
            ██║     ██╔════╝██╔═══██╗        ██║ ██╔╝██║╚══██╔══╝
            ██║     █████╗  ██║   ██║        █████╔╝ ██║   ██║
            ██║     ██╔══╝  ██║   ██║        ██╔═██╗ ██║   ██║
            ███████╗███████╗╚██████╔╝███████╗██║  ██╗██║   ██║
            ╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝
  `;

  // Apply fire gradient to logo
  const gradientLogo = ASCIIGradientBanner.fireGradient(logo);

  const title = centerText(chalk.bold('🦁  Specification-Driven Development Toolkit  🦁'), 77);
  const subtitle = centerText(chalk.cyan('✨ AI-Powered Code Generation with Claude  ✨'), 77);
  const features = centerText(chalk.white('⚡ Spec → Plan → Generate → Deploy'), 77);
  const version_line = centerText(chalk.gray(versionText), 77);

  return `
${gradientLogo}

${title}

${subtitle}

${features}

${version_line}
`;
}

/**
 * Create v5.0.0 AI integration banner
 */
function getAIBanner() {
  const aiText = `
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║          🤖  AI CODE GENERATOR WITH CLAUDE  🤖           ║
    ║                                                            ║
    ║  📊 Supported Models:                                     ║
    ║    • Claude 3.5 Sonnet (Balanced)                        ║
    ║    • Claude 4 (Opus - Advanced)                          ║
    ║    • Claude 4.5 (Opus - Maximum)                         ║
    ║    • Claude 3 Haiku (Fast & Lightweight)                 ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
  `;

  return ASCIIGradientBanner.purpleGradient(aiText);
}

/**
 * Create feature showcase banner
 */
function getFeaturesBanner() {
  const header = `
    ╔════════════════════════════════════════════════════════════╗
    ║          ✨  LEO KIT 5.0.0 - NEW FEATURES  ✨            ║
    ╚════════════════════════════════════════════════════════════╝
  `;

  const features = `
    🏗️  SPEC-DRIVEN DEVELOPMENT
       Constitution → Specification → Plan → Tasks → Code Generation

    🤖  MULTI-MODEL AI SUPPORT
       Claude 3.5 Sonnet • Claude 4 • Claude 4.5 • Haiku

    ⚙️  CONSTITUTIONAL GOVERNANCE
       Define project principles and auto-enforce across teams

    🎨  BEAUTIFUL ASCII STYLING
       Gradient effects and professional terminal output

    🔄  EVENT-DRIVEN ARCHITECTURE
       Real-time updates with Node.js EventEmitter

    ⚡  REST API & WEBSOCKETS
       Express.js + Socket.io for real-time communication

    🧩  PLUGIN ECOSYSTEM
       Extensible architecture for custom functionality

    🎯  E2E TESTING
       26 comprehensive tests covering all workflows
  `;

  return ASCIIGradientBanner.oceanGradient(header + features);
}

// Compact banner for smaller displays
function getCompactBanner() {
  return `
${chalk.yellow('    🦁')}  ${chalk.yellow.bold('LEO-KIT 5.0.0')}
    ${chalk.gray('Specification-Driven Development Toolkit')}
    ${chalk.cyan('with AI-Powered Code Generation')}
`;
}

// Welcome message for installation
function getWelcomeMessage() {
  return `
${chalk.yellow('    ╔═══════════════════════════════════════════════════════════════╗')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ║                  ')}${chalk.yellow('🦁  ')}${chalk.yellow.bold('LEO-KIT 5.0.0')}${chalk.yellow('  🦁')}${chalk.yellow('                    ║')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ║')}   ${chalk.white.bold('Specification-Driven Development Toolkit')}    ${chalk.yellow('║')}
${chalk.yellow('    ║')}      ${chalk.cyan.bold('with AI-Powered Code Generation')}         ${chalk.yellow('║')}
${chalk.yellow('    ║                                                               ║')}
${chalk.yellow('    ╚═══════════════════════════════════════════════════════════════╝')}

    ${chalk.green.bold('✨ Successfully installed LEO Workflow Kit v5.0.0! ✨')}

    ${chalk.white('Transform your development workflow with:')}
    ${chalk.cyan('  •')} ${chalk.white('Specification-driven development methodology')}
    ${chalk.blue('  •')} ${chalk.white('Multi-model AI code generation (Claude 3.5-4.5)')}
    ${chalk.magenta('  •')} ${chalk.white('Constitutional governance framework')}
    ${chalk.cyan('  •')} ${chalk.white('Automated GitHub Projects integration')}
    ${chalk.blue('  •')} ${chalk.white('Event-driven architecture & plugins')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('🚀 Quick Start Guide:')}

    ${chalk.white.bold('Step 1:')} Navigate to your project
       ${chalk.gray('$')} ${chalk.yellow('cd your-project')}

    ${chalk.white.bold('Step 2:')} Initialize LEO workflow (one-time setup)
       ${chalk.gray('$')} ${chalk.yellow('leo init')}
       ${chalk.gray('   → Sets up docs, templates, labels, and VS Code config')}

    ${chalk.white.bold('Step 3:')} Create your first spec-driven issue
       ${chalk.gray('$')} ${chalk.yellow('leo spec init my-feature')}
       ${chalk.gray('   → Create specification-driven feature')}

    ${chalk.white.bold('Step 4:')} Generate code from specification
       ${chalk.gray('$')} ${chalk.yellow('leo spec generate --model claude-4-5')}
       ${chalk.gray('   → AI generates production code')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('📦 Core Features:')}

       ${chalk.yellow.bold('Spec System')}
          ${chalk.gray('→')} Define constitution, specification, plan, and tasks
          ${chalk.gray('→')} AI auto-generates code with optional model selection

       ${chalk.yellow.bold('AI Models')}
          ${chalk.gray('→')} ${chalk.white('Claude 3.5 Sonnet')} ${chalk.gray('- Balanced performance & cost')}
          ${chalk.gray('→')} ${chalk.white('Claude 4 Opus')} ${chalk.gray('- Advanced reasoning')}
          ${chalk.gray('→')} ${chalk.white('Claude 4.5 Opus')} ${chalk.gray('- Maximum capabilities')}
          ${chalk.gray('→')} ${chalk.white('Claude Haiku')} ${chalk.gray('- Fast & lightweight')}

       ${chalk.yellow.bold('Constitutional Governance')}
          ${chalk.gray('→')} Define project principles once
          ${chalk.gray('→')} Auto-enforce across all code generation
          ${chalk.gray('→')} Ensure consistency and quality

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.cyan.bold('📚 Learn More:')}

    ${chalk.white('Documentation:')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit#readme')}
    ${chalk.white('Spec Guide:     ')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit/wiki/Spec-First-Decision-Making')}
    ${chalk.white('Report Issues:  ')} ${chalk.blue.underline('https://github.com/leonpagotto/leo-kit/issues')}

${chalk.yellow('    ═══════════════════════════════════════════════════════════════')}

    ${chalk.green.bold('🎉 Ready to transform your workflow!')} ${chalk.gray('Start with')} ${chalk.yellow('leo init')}

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
  getBanner: getResponsiveBanner,
  getAIBanner,
  getFeaturesBanner,
  ASCIIGradientBanner
};
