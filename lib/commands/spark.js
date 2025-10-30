#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const { generateWithAI } = require('../ai/code-generator');
const { banner } = require('../banner');

const program = new Command();

/**
 * Ingvar Spark - Rapid App Generation
 *
 * Generate complete React apps from a single prompt using:
 * - GitHub Spark template (React + TypeScript + Vite)
 * - shadcn/ui components (40+ pre-built components)
 * - Ingvar AI code generation
 * - Modern tooling (Tailwind CSS v4, Framer Motion, etc.)
 */

program
  .name('spark')
  .description('🚀 Generate complete React apps from a single prompt using Spark template + Ingvar AI')
  .version('1.0.0');

program
  .command('create')
  .alias('c')
  .description('Create a new app from a prompt')
  .option('-p, --prompt <text>', 'Describe the app you want to build')
  .option('-n, --name <name>', 'App name (will be slugified)')
  .option('-d, --dir <directory>', 'Output directory', './spark-apps')
  .option('--no-install', 'Skip npm install')
  .option('--no-start', 'Skip starting dev server')
  .action(async (options) => {
    console.clear();
    banner();

    console.log(chalk.cyan('🚀 Ingvar Spark - Rapid App Generator\n'));

    try {
      // Get user input
      const answers = await getAppRequirements(options);

      // Generate app
      await generateSparkApp(answers);

    } catch (error) {
      console.error(chalk.red('❌ Error creating Spark app:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .alias('ls')
  .description('List available templates and components')
  .action(async () => {
    console.clear();
    banner();

    console.log(chalk.cyan('📦 Available Spark Resources\n'));

    // List UI components
    console.log(chalk.yellow('🎨 UI Components (40+ available):'));
    const components = [
      'Button', 'Card', 'Dialog', 'Form', 'Input', 'Table', 'Chart',
      'Navigation', 'Accordion', 'Alert', 'Avatar', 'Badge', 'Calendar',
      'Carousel', 'Checkbox', 'Command', 'Dropdown', 'Progress', 'Tabs',
      'Tooltip', 'Sidebar', 'Sheet', 'Select', 'Slider', 'Switch', 'and more...'
    ];

    console.log(components.map(c => `  • ${c}`).join('\n'));

    console.log(chalk.yellow('\n⚡ Features:'));
    console.log('  • React 19 + TypeScript');
    console.log('  • Vite (lightning fast)');
    console.log('  • Tailwind CSS v4');
    console.log('  • shadcn/ui components');
    console.log('  • Framer Motion animations');
    console.log('  • Form handling (react-hook-form)');
    console.log('  • State management (@tanstack/react-query)');
    console.log('  • Icons (Lucide, Heroicons, Phosphor)');
    console.log('  • Charts (Recharts)');
    console.log('  • 3D graphics (Three.js)');

    console.log(chalk.green('\n✨ Example prompts:'));
    console.log('  • "Create a todo app with dark mode"');
    console.log('  • "Build a dashboard with charts and tables"');
    console.log('  • "Make a landing page with hero section and pricing"');
    console.log('  • "Create a blog with markdown support"');
    console.log('  • "Build an e-commerce product catalog"');
  });

async function getAppRequirements(options) {
  const questions = [];

  if (!options.prompt) {
    questions.push({
      type: 'input',
      name: 'prompt',
      message: '🎯 Describe the app you want to build:',
      validate: input => input.length > 10 || 'Please provide a more detailed description (at least 10 characters)'
    });
  }

  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: '📛 App name:',
      default: (answers) => generateAppName(answers.prompt || options.prompt),
      validate: input => /^[a-zA-Z0-9-_]+$/.test(input) || 'Name must contain only letters, numbers, hyphens, and underscores'
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    prompt: options.prompt || answers.prompt,
    name: options.name || answers.name,
    directory: options.dir,
    install: options.install !== false,
    start: options.start !== false
  };
}

function generateAppName(prompt) {
  // Extract key words and create a name
  const words = prompt.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 3);

  return words.join('-') || 'spark-app';
}

async function generateSparkApp(config) {
  const { prompt, name, directory, install, start } = config;

  console.log(chalk.blue('🔧 Setting up Spark app...\n'));

  // 1. Copy template
  const templatePath = path.join(__dirname, '../../template-main');
  const appPath = path.join(process.cwd(), directory, name);

  console.log(`📁 Creating app directory: ${chalk.cyan(appPath)}`);
  await fs.ensureDir(appPath);
  await fs.copy(templatePath, appPath);

  // 2. Update package.json
  console.log('📦 Updating package.json...');
  const packageJsonPath = path.join(appPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = name;
  packageJson.description = `Generated by Ingvar Spark: ${prompt}`;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // 3. Generate AI code
  console.log(chalk.yellow('🤖 Generating app code with AI...\n'));

  const appCode = await generateAppCode(prompt, name);

  // 4. Write generated files
  await writeGeneratedFiles(appPath, appCode);

  // 5. Install dependencies
  if (install) {
    console.log(chalk.blue('📥 Installing dependencies...\n'));
    try {
      execSync('npm install', { cwd: appPath, stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.yellow('⚠️  Manual install required: cd ' + appPath + ' && npm install'));
    }
  }

  // 6. Success message
  console.log(chalk.green('\n🎉 Spark app created successfully!\n'));

  console.log(chalk.cyan('📍 Location:'), appPath);
  console.log(chalk.cyan('🚀 Next steps:'));
  console.log(`  cd ${path.relative(process.cwd(), appPath)}`);
  if (!install) console.log('  npm install');
  console.log('  npm run dev');

  // 7. Start dev server
  if (start && install) {
    console.log(chalk.blue('\n🌟 Starting development server...\n'));
    try {
      execSync('npm run dev', { cwd: appPath, stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.yellow('⚠️  Start manually: cd ' + appPath + ' && npm run dev'));
    }
  }
}

async function generateAppCode(prompt, appName) {
  const systemPrompt = `You are an expert React developer using the latest stack. Generate a complete React app based on the user's request.

TECH STACK:
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components (already available)
- Framer Motion for animations
- React Hook Form for forms
- @tanstack/react-query for state management

AVAILABLE UI COMPONENTS (import from @/components/ui/):
accordion, alert-dialog, alert, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

GUIDELINES:
1. Create a complete, working app
2. Use proper TypeScript types
3. Follow React best practices
4. Use shadcn/ui components extensively
5. Make it responsive with Tailwind
6. Add smooth animations with Framer Motion
7. Include proper error handling
8. Create reusable components
9. Use proper semantic HTML
10. Add loading states and skeleton UI

Generate:
1. App.tsx - Main application component
2. Additional components as needed
3. Types/interfaces
4. Sample data if needed
5. Styling with Tailwind classes

Make it production-ready and polished!`;

  try {
    const response = await generateWithAI(systemPrompt, `Create a ${prompt}`, {
      model: 'claude-3-sonnet-20241022',
      maxTokens: 4000
    });

    return parseAIResponse(response);
  } catch (error) {
    console.log(chalk.yellow('⚠️  AI generation failed, using fallback template'));
    return generateFallbackApp(prompt, appName);
  }
}

function parseAIResponse(response) {
  // Parse the AI response to extract different files
  const files = {};

  // Simple parsing - look for file markers
  const filePattern = /```(?:tsx?|typescript|jsx?)?\s*\/\/ ([\w\/.-]+)\n([\s\S]*?)```/g;
  let match;

  while ((match = filePattern.exec(response)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    files[filePath] = content;
  }

  // If no files found, treat entire response as App.tsx
  if (Object.keys(files).length === 0) {
    files['App.tsx'] = response.replace(/```[^`]*```/g, '').trim();
  }

  return files;
}

function generateFallbackApp(prompt, appName) {
  return {
    'App.tsx': `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            ${appName}
          </h1>
          <p className="text-xl text-muted-foreground">
            ${prompt}
          </p>
          <Badge variant="secondary">Generated by Ingvar Spark</Badge>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>🚀 Your App is Ready!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This is your generated Spark app. Start building amazing things!</p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;`
  };
}

async function writeGeneratedFiles(appPath, files) {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(appPath, 'src', filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(chalk.green('✅'), `Generated ${filePath}`);
  }
}

module.exports = program;
