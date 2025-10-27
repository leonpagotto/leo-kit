const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { detectProjectType, formatProjectSummary } = require('../utils/project-detector');
const { validateDocs, isAllowedInRoot } = require('./organize-docs');

async function healthCheckCommand() {
  console.log(chalk.cyan('\n🏥 Running LEO workflow Health Check...\n'));

  const checks = [];
  let score = 0;
  const maxScore = 100;

  // 1. Check Git Setup (10 points)
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    checks.push({ category: 'Git', name: 'Git Repository', status: 'pass', points: 5 });
    score += 5;

    try {
      execSync('git remote get-url origin', { stdio: 'ignore' });
      checks.push({ category: 'Git', name: 'Remote Repository', status: 'pass', points: 5 });
      score += 5;
    } catch {
      checks.push({ category: 'Git', name: 'Remote Repository', status: 'fail', points: 0, fix: 'git remote add origin <url>' });
    }
  } catch {
    checks.push({ category: 'Git', name: 'Git Repository', status: 'fail', points: 0, fix: 'git init' });
  }

  // 2. Check GitHub CLI (10 points)
  try {
    execSync('gh --version', { stdio: 'ignore' });
    checks.push({ category: 'GitHub', name: 'GitHub CLI', status: 'pass', points: 5 });
    score += 5;

    try {
      execSync('gh auth status', { stdio: 'ignore' });
      checks.push({ category: 'GitHub', name: 'GitHub Auth', status: 'pass', points: 5 });
      score += 5;
    } catch {
      checks.push({ category: 'GitHub', name: 'GitHub Auth', status: 'fail', points: 0, fix: 'gh auth login' });
    }
  } catch {
    checks.push({ category: 'GitHub', name: 'GitHub CLI', status: 'fail', points: 0, fix: 'Install from https://cli.github.com/' });
  }

  // 3. Check Documentation Structure (20 points)
  const docDirs = ['docs', 'docs/specs', 'docs/guides', 'docs/setup', 'docs/development', 'docs/archive'];
  for (const dir of docDirs) {
    if (await fs.pathExists(dir)) {
      checks.push({ category: 'Documentation', name: `${dir}/`, status: 'pass', points: 3 });
      score += 3;
    } else {
      checks.push({ category: 'Documentation', name: `${dir}/`, status: 'warn', points: 1, fix: `mkdir -p ${dir}` });
      score += 1;
    }
  }

  // 3a. Check Documentation Organization (5 points)
  try {
    const rootFiles = await fs.readdir('.');
    const markdownFiles = rootFiles.filter(f => f.endsWith('.md') && !f.startsWith('.'));
    const extraMarkdownFiles = markdownFiles.filter(f => !isAllowedInRoot(f));
    
    if (extraMarkdownFiles.length === 0) {
      checks.push({ 
        category: 'Documentation', 
        name: 'Root Directory Clean', 
        status: 'pass', 
        points: 5,
        detail: `${markdownFiles.length} allowed files`
      });
      score += 5;
    } else {
      checks.push({ 
        category: 'Documentation', 
        name: 'Root Directory Clean', 
        status: 'warn', 
        points: 0,
        detail: `${extraMarkdownFiles.length} files need organization`,
        fix: 'leo organize-docs'
      });
    }
  } catch {
    checks.push({ 
      category: 'Documentation', 
      name: 'Root Directory Clean', 
      status: 'info', 
      points: 0 
    });
  }

  // 4. Check Issue Templates (15 points)
  const templateDir = '.github/ISSUE_TEMPLATE';
  if (await fs.pathExists(templateDir)) {
    const templates = await fs.readdir(templateDir);
    const templateCount = templates.filter(f => f.endsWith('.md')).length;
    
    if (templateCount >= 4) {
      checks.push({ category: 'Templates', name: 'Issue Templates', status: 'pass', points: 15, detail: `${templateCount} templates` });
      score += 15;
    } else if (templateCount > 0) {
      checks.push({ category: 'Templates', name: 'Issue Templates', status: 'warn', points: 7, detail: `${templateCount} templates`, fix: 'leo init to install all templates' });
      score += 7;
    }
  } else {
    checks.push({ category: 'Templates', name: 'Issue Templates', status: 'fail', points: 0, fix: 'leo init' });
  }

  // 5. Check PR Template (10 points)
  const prTemplatePaths = [
    '.github/pull_request_template.md',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'docs/pull_request_template.md'
  ];
  
  let prTemplateFound = false;
  for (const templatePath of prTemplatePaths) {
    if (await fs.pathExists(templatePath)) {
      checks.push({ category: 'Templates', name: 'PR Template', status: 'pass', points: 10 });
      score += 10;
      prTemplateFound = true;
      break;
    }
  }
  
  if (!prTemplateFound) {
    checks.push({ category: 'Templates', name: 'PR Template', status: 'warn', points: 0, fix: 'leo init to install PR template' });
  }

  // 6. Check VS Code Configuration (15 points)
  if (await fs.pathExists('.vscode/settings.json')) {
    checks.push({ category: 'VS Code', name: 'Settings', status: 'pass', points: 5 });
    score += 5;
  } else {
    checks.push({ category: 'VS Code', name: 'Settings', status: 'warn', points: 0, fix: 'leo vscode' });
  }

  if (await fs.pathExists('.vscode/extensions.json')) {
    checks.push({ category: 'VS Code', name: 'Extensions', status: 'pass', points: 5 });
    score += 5;
  } else {
    checks.push({ category: 'VS Code', name: 'Extensions', status: 'warn', points: 0, fix: 'leo vscode' });
  }

  const copilotPaths = [
    '.github/copilot-instructions.md',
    '.github/copilot-instructions.txt'
  ];
  
  let copilotFound = false;
  for (const copilotPath of copilotPaths) {
    if (await fs.pathExists(copilotPath)) {
      checks.push({ category: 'VS Code', name: 'Copilot Instructions', status: 'pass', points: 5 });
      score += 5;
      copilotFound = true;
      break;
    }
  }
  
  if (!copilotFound) {
    checks.push({ category: 'VS Code', name: 'Copilot Instructions', status: 'warn', points: 0, fix: 'leo vscode' });
  }

  // 7. Check GitHub Actions (10 points)
  if (await fs.pathExists('.github/workflows')) {
    const workflows = await fs.readdir('.github/workflows');
    const workflowCount = workflows.filter(f => f.endsWith('.yml') || f.endsWith('.yaml')).length;
    
    if (workflowCount > 0) {
      checks.push({ category: 'Automation', name: 'GitHub Actions', status: 'pass', points: 10, detail: `${workflowCount} workflows` });
      score += 10;
    }
  } else {
    checks.push({ category: 'Automation', name: 'GitHub Actions', status: 'info', points: 0, fix: 'Consider adding workflow automation' });
  }

  // 8. Detect Project Type (10 points - informational)
  const projectInfo = await detectProjectType();
  if (projectInfo.type !== 'unknown') {
    checks.push({ 
      category: 'Project', 
      name: 'Type Detection', 
      status: 'info', 
      points: 10, 
      detail: formatProjectSummary(projectInfo) 
    });
    score += 10;
  }

  // Display Results
  console.log(chalk.bold('Health Check Results:\n'));

  const categories = [...new Set(checks.map(c => c.category))];
  
  for (const category of categories) {
    console.log(chalk.cyan.bold(`\n${category}:`));
    
    const categoryChecks = checks.filter(c => c.category === category);
    
    for (const check of categoryChecks) {
      let icon, color;
      
      switch (check.status) {
        case 'pass':
          icon = '✓';
          color = chalk.green;
          break;
        case 'warn':
          icon = '⚠';
          color = chalk.yellow;
          break;
        case 'fail':
          icon = '✗';
          color = chalk.red;
          break;
        case 'info':
          icon = 'ℹ';
          color = chalk.blue;
          break;
      }
      
      let line = `  ${color(icon)} ${check.name}`;
      
      if (check.detail) {
        line += chalk.gray(` - ${check.detail}`);
      }
      
      if (check.points !== undefined && check.status !== 'info') {
        line += chalk.gray(` (${check.points} pts)`);
      }
      
      console.log(line);
      
      if (check.fix) {
        console.log(chalk.gray(`    → Fix: ${check.fix}`));
      }
    }
  }

  // Overall Score
  console.log(chalk.cyan('\n' + '─'.repeat(60)));
  
  const percentage = Math.round((score / maxScore) * 100);
  let scoreColor, grade, message;
  
  if (percentage >= 90) {
    scoreColor = chalk.green;
    grade = 'A';
    message = 'Excellent! Your workflow is fully optimized! 🎉';
  } else if (percentage >= 75) {
    scoreColor = chalk.cyan;
    grade = 'B';
    message = 'Great! Just a few improvements needed. 👍';
  } else if (percentage >= 60) {
    scoreColor = chalk.yellow;
    grade = 'C';
    message = 'Good start! Consider completing the setup. 💪';
  } else if (percentage >= 40) {
    scoreColor = chalk.yellow;
    grade = 'D';
    message = 'Needs improvement. Run leo init to get started. 🔧';
  } else {
    scoreColor = chalk.red;
    grade = 'F';
    message = 'Run leo init to set up your workflow. 🚀';
  }
  
  console.log(scoreColor.bold(`\n  Overall Score: ${score}/${maxScore} (${percentage}%) - Grade ${grade}`));
  console.log(chalk.white(`  ${message}`));
  console.log(chalk.cyan('\n' + '─'.repeat(60) + '\n'));

  // Recommendations
  const failed = checks.filter(c => c.status === 'fail');
  const warnings = checks.filter(c => c.status === 'warn');
  
  if (failed.length > 0 || warnings.length > 0) {
    console.log(chalk.cyan.bold('📋 Recommendations:\n'));
    
    if (failed.length > 0) {
      console.log(chalk.red.bold('  Critical Issues:'));
      failed.forEach(check => {
        if (check.fix) {
          console.log(chalk.white(`    • ${check.name}: ${chalk.yellow(check.fix)}`));
        }
      });
      console.log();
    }
    
    if (warnings.length > 0 && warnings.length <= 5) {
      console.log(chalk.yellow.bold('  Improvements:'));
      warnings.slice(0, 5).forEach(check => {
        if (check.fix) {
          console.log(chalk.white(`    • ${check.name}: ${chalk.gray(check.fix)}`));
        }
      });
      console.log();
    }
  }

  console.log(chalk.gray('💡 Run `leo welcome` for setup guidance\n'));
}

module.exports = healthCheckCommand;

