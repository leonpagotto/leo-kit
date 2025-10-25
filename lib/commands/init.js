const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const COPILOT_INSTRUCTIONS = require('../copilot-instructions-template');

async function initCommand(options) {
  // Check if running in non-interactive mode (from postinstall or explicit flag)
  const isNonInteractive = options.nonInteractive || process.env.LEO_POSTINSTALL === 'true';

  console.log(chalk.yellow('\n🦁 ') + chalk.cyan.bold('Initializing LEO Workflow Kit') + chalk.yellow(' 🦁\n'));

  if (isNonInteractive) {
    console.log(chalk.gray('Running in non-interactive mode with default settings\n'));
  }

  // Check prerequisites
  const spinner = ora('Checking prerequisites...').start();

  try {
    execSync('gh --version', { stdio: 'ignore' });
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    spinner.succeed('Prerequisites check passed');
  } catch (error) {
    spinner.fail('Prerequisites check failed');
    console.log(chalk.red('\n❌ Error: GitHub CLI and Git are required'));
    console.log(chalk.yellow('Install GitHub CLI: https://cli.github.com/'));
    process.exit(1);
  }

  // Check GitHub authentication
  const authSpinner = ora('Checking GitHub authentication...').start();
  let isAuthenticated = false;

  try {
    execSync('gh auth status', { stdio: 'ignore' });
    authSpinner.succeed('GitHub authentication verified');
    isAuthenticated = true;
  } catch (error) {
    authSpinner.warn('GitHub CLI not authenticated');

    if (isNonInteractive) {
      console.log(chalk.yellow('\n⚠️  Skipping authentication in non-interactive mode'));
      console.log(chalk.gray('Run later: gh auth login'));
      console.log(chalk.gray('Note: Some features require authentication\n'));
    } else {
      console.log(chalk.yellow('\n🔐 GitHub authentication required for full functionality'));
      console.log(chalk.gray('This enables automatic issue creation and GitHub API access\n'));

      const { authenticate } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'authenticate',
          message: 'Would you like to authenticate with GitHub now?',
          default: true
        }
      ]);

      if (authenticate) {
        console.log(chalk.cyan('\n🔑 Starting GitHub authentication...\n'));
        try {
          execSync('gh auth login', { stdio: 'inherit' });
          console.log(chalk.green('\n✅ GitHub authentication successful!\n'));
          isAuthenticated = true;
        } catch (authError) {
          console.log(chalk.yellow('\n⚠️  Authentication failed or cancelled'));
          console.log(chalk.gray('You can authenticate later with: gh auth login\n'));
        }
      } else {
        console.log(chalk.yellow('\n⚠️  Skipping authentication'));
        console.log(chalk.gray('Run later: gh auth login'));
        console.log(chalk.gray('Note: Automatic issue creation requires authentication\n'));
      }
    }
  }

  // Get repository info
  let repoInfo;
  let isOrgRepo = false;
  let isNewRepo = false;

  try {
    const repoUrl = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
      encoding: 'utf8'
    }).trim();
    repoInfo = repoUrl;
    // Check if it's an organization repo (contains a slash and first part is not a user)
    const parts = repoInfo.split('/');
    isOrgRepo = parts.length === 2 && parts[0] !== '';
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  Not in a GitHub repository or not authenticated'));
    console.log(chalk.gray('Run: gh auth login\n'));
    process.exit(1);
  }

  console.log(chalk.gray(`Repository: ${repoInfo}\n`));

  // Interactive prompts if options not provided
  let config = { ...options };

  // In non-interactive mode, use defaults
  if (isNonInteractive) {
    console.log(chalk.gray('Using default configuration:\n'));
    console.log(chalk.gray(`  • Repository: ${repoInfo}`));
    console.log(chalk.gray('  • Project: Skip (can be configured later)'));
    console.log(chalk.gray('  • Labels: Install standard labels'));
    console.log(chalk.gray('  • VS Code: Configure with Copilot instructions\n'));

    // Set defaults for non-interactive mode
    config.skipProject = true;
    config.skipLabels = false;
    config.skipVscode = false;
    if (isOrgRepo) {
      config.org = repoInfo.split('/')[0];
    }
  } else {
    // Make organization optional - only prompt if not provided
    const questions = [];

    if (!config.org && isOrgRepo) {
      questions.push({
        type: 'input',
        name: 'org',
        message: 'GitHub organization name (leave empty for personal repo):',
        default: repoInfo.split('/')[0]
      });
    }

    // Ask if user wants to use existing project or create new one
    if (!config.project && !config.skipProject) {
      questions.push({
        type: 'list',
        name: 'projectChoice',
        message: 'GitHub Project setup:',
        choices: [
          { name: '📋 Use existing GitHub Project (enter project number)', value: 'existing' },
          { name: '✨ Create new GitHub Project', value: 'new' },
          { name: '⏭️  Skip project setup (I\'ll do it later)', value: 'skip' }
        ],
        default: 'existing'
      });
    }

    if (questions.length > 0) {
      const answers = await inquirer.prompt(questions);
      config = { ...config, ...answers };
    }
  }

  // Handle project setup based on choice
  if (config.projectChoice === 'existing') {
    const { projectNumber } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectNumber',
        message: 'Enter GitHub Project number:',
        validate: (input) => {
          if (!input || input.trim() === '') return 'Project number is required';
          if (isNaN(input)) return 'Please enter a valid project number';
          return true;
        }
      }
    ]);
    config.project = projectNumber;
  } else if (config.projectChoice === 'new') {
    const { projectName, projectDescription } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter new project name:',
        default: `${repoInfo.split('/')[1]} - LEO workflow`,
        validate: (input) => {
          if (!input || input.trim() === '') return 'Project name is required';
          return true;
        }
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Enter project description (optional):',
        default: 'Spec-driven development workflow with LEO Kit'
      }
    ]);
    config.newProjectName = projectName;
    config.newProjectDescription = projectDescription;
    isNewRepo = true;
  }

  // Confirm setup
  console.log(chalk.cyan('\n📋 Setup Configuration:\n'));
  console.log(`  Organization: ${chalk.white(config.org || 'N/A')}`);
  if (isNewRepo) {
    console.log(`  New Project: ${chalk.white(config.newProjectName)}`);
    console.log(`  Description: ${chalk.white(config.newProjectDescription || 'N/A')}`);
  } else {
    console.log(`  Project: ${chalk.white(config.project || 'Skip')}`);
  }
  console.log(`  Skip Labels: ${chalk.white(config.skipLabels ? 'Yes' : 'No')}`);
  console.log(`  Skip VS Code: ${chalk.white(config.skipVscode ? 'Yes' : 'No')}`);
  console.log();

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with setup?',
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\n❌ Setup cancelled\n'));
    process.exit(0);
  }

  // Step 1: Create documentation structure
  const docsSpinner = ora('Creating documentation structure...').start();
  try {
    await fs.ensureDir('docs/specs');
    await fs.ensureDir('docs/guides');
    await fs.ensureDir('docs/setup');
    await fs.ensureDir('docs/development');
    await fs.ensureDir('docs/archive');

    // Copy docs README
    const docsReadme = `# Project Documentation

All project documentation is organized here.

## Structure

- **specs/** - Specification files (planning phase - write detailed specs here)
- **guides/** - User guides and tutorials
- **setup/** - Installation and configuration guides
- **development/** - Development documentation and architecture
- **archive/** - Historical documentation and completed work

## LEO workflow

### Phase 1: Specification
Write detailed specification files in \`specs/\` folder. Include problem statement, solution approach, technical details, and acceptance criteria.

### Phase 2: Execution
Convert approved specs into GitHub issues. Track all work in GitHub Projects. Reference issues in all commits.

**Remember: Specifications are FILES. Tasks are GITHUB ISSUES.**

## Contributing

Keep documentation up to date as the project evolves.
`;
    await fs.writeFile('docs/README.md', docsReadme);

    // Create example spec file
    const exampleSpec = `# Feature Specification: [Feature Name]

> **Status:** Draft | Under Review | Approved
> **Priority:** P0 | P1 | P2 | P3
> **Created:** YYYY-MM-DD
> **Author:** Your Name

## Problem Statement

Describe the problem this feature solves. What pain point does it address?

## Proposed Solution

High-level description of the proposed solution.

## Technical Approach

### Architecture
- Component 1: Description
- Component 2: Description

### Dependencies
- Dependency 1
- Dependency 2

### Data Model Changes
If applicable, describe database or data structure changes.

## Implementation Plan

1. **Phase 1**: Description
2. **Phase 2**: Description
3. **Phase 3**: Description

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Testing Strategy

- Unit tests for X
- Integration tests for Y
- E2E tests for Z

## Risks & Mitigation

- **Risk 1**: Description → Mitigation strategy
- **Risk 2**: Description → Mitigation strategy

## Alternatives Considered

1. **Alternative 1**: Why rejected
2. **Alternative 2**: Why rejected

## Timeline Estimate

- Development: X days
- Testing: Y days
- Documentation: Z days

## Related Issues

Once approved, this spec will be broken down into GitHub issues:
- #TBD - Task 1
- #TBD - Task 2
- #TBD - Task 3
`;
    await fs.writeFile('docs/specs/EXAMPLE_SPEC.md', exampleSpec);

    docsSpinner.succeed('Documentation structure created with specs folder');
  } catch (error) {
    docsSpinner.fail('Failed to create documentation structure');
    console.error(chalk.red(error.message));
  }

  // Step 2: Copy issue templates and PR template
  const templatesSpinner = ora('Installing templates...').start();
  try {
    await fs.ensureDir('.github/ISSUE_TEMPLATE');

    // Copy issue templates from embedded templates
    const issueTemplatesDir = path.join(__dirname, '../../templates/github-workflow/issue-templates');
    await fs.copy(issueTemplatesDir, '.github/ISSUE_TEMPLATE');

    // Copy PR template
    const prTemplatePath = path.join(__dirname, '../../templates/github-workflow/pull-request-template.md');
    if (await fs.pathExists(prTemplatePath)) {
      await fs.copy(prTemplatePath, '.github/pull_request_template.md');
    }

    templatesSpinner.succeed('Issue and PR templates installed');
  } catch (error) {
    templatesSpinner.fail('Failed to install templates');
    console.error(chalk.red(error.message));
  }

  // Step 2.5: Install GitHub Actions workflows (optional)
  const workflowsAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installWorkflows',
      message: 'Install GitHub Actions workflows for automation? (auto-label, stale issues)',
      default: true
    }
  ]);

  if (workflowsAnswer.installWorkflows) {
    const workflowsSpinner = ora('Installing GitHub Actions workflows...').start();
    try {
      await fs.ensureDir('.github/workflows');

      const workflowsDir = path.join(__dirname, '../../templates/github-workflow/workflows');
      if (await fs.pathExists(workflowsDir)) {
        await fs.copy(workflowsDir, '.github/workflows');
        workflowsSpinner.succeed('GitHub Actions workflows installed');
        console.log(chalk.gray('  → Auto-label issues based on content'));
        console.log(chalk.gray('  → Manage stale issues and PRs'));
        console.log(chalk.gray('  → Auto-add items to project board'));
      } else {
        workflowsSpinner.info('Workflows not found in package');
      }
    } catch (error) {
      workflowsSpinner.fail('Failed to install workflows');
      console.error(chalk.red(error.message));
    }
  }

  // Step 3: Set up labels (if not skipped)
  if (!config.skipLabels) {
    const labelsSpinner = ora('Setting up GitHub labels...').start();
    try {
      require('./labels')({ clean: false });
      labelsSpinner.succeed('GitHub labels configured');
    } catch (error) {
      labelsSpinner.fail('Failed to set up labels');
      console.error(chalk.red(error.message));
    }
  }

  // Step 4: Set up VS Code (if not skipped)
  if (!config.skipVscode) {
    const vscodeSpinner = ora('Configuring VS Code...').start();
    try {
      await fs.ensureDir('.vscode');
      await fs.ensureDir('.github');

      // Create settings.json
      const settings = {
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll": true
        },
        "files.trimTrailingWhitespace": true,
        "files.insertFinalNewline": true
      };
      await fs.writeJson('.vscode/settings.json', settings, { spaces: 2 });

      // Create extensions.json
      const extensions = {
        "recommendations": [
          "GitHub.copilot",
          "GitHub.copilot-chat",
          "eamodio.gitlens",
          "esbenp.prettier-vscode"
        ]
      };
      await fs.writeJson('.vscode/extensions.json', extensions, { spaces: 2 });

      vscodeSpinner.succeed('VS Code configured');
    } catch (error) {
      vscodeSpinner.fail('Failed to configure VS Code');
      console.error(chalk.red(error.message));
    }
  }

  // Step 4.5: AI Assistant Configuration (NEW - v3.0.0)
  let selectedAIs = ['copilot']; // Default to Copilot for backward compatibility

  if (!isNonInteractive) {
    console.log(chalk.cyan('\n🤖 AI Assistant Configuration\n'));
    console.log(chalk.gray('LEO supports multiple AI coding assistants. Select the ones you use:\n'));

    const { aiAssistants } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'aiAssistants',
        message: 'Which AI assistants do you use? (Space to select, Enter to confirm)',
        choices: [
          {
            name: '🤖 GitHub Copilot - AI pair programmer from GitHub',
            value: 'copilot',
            checked: true
          },
          {
            name: '🎯 Cursor - Claude-powered IDE with Composer Mode',
            value: 'cursor'
          },
          {
            name: '🚀 Cline - Autonomous Claude-Dev VSCode extension',
            value: 'cline'
          },
          {
            name: '⚡ Codeium - Free AI code completion (70+ languages)',
            value: 'codeium'
          }
        ],
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Please select at least one AI assistant';
          }
          return true;
        }
      }
    ]);

    selectedAIs = aiAssistants;

    if (selectedAIs.length > 1) {
      const { primaryAI } = await inquirer.prompt([
        {
          type: 'list',
          name: 'primaryAI',
          message: 'Which AI assistant do you use most often? (Sets as primary)',
          choices: selectedAIs.map(ai => {
            const names = {
              copilot: '🤖 GitHub Copilot',
              cursor: '🎯 Cursor',
              cline: '🚀 Cline',
              codeium: '⚡ Codeium'
            };
            return { name: names[ai], value: ai };
          }),
          default: selectedAIs[0]
        }
      ]);
      config.primaryAI = primaryAI;
    } else {
      config.primaryAI = selectedAIs[0];
    }
  } else {
    // Non-interactive mode: default to Copilot only
    console.log(chalk.gray('  • AI Assistant: GitHub Copilot (default)'));
    config.primaryAI = 'copilot';
  }

  // Generate AI instruction files
  if (selectedAIs.length > 0) {
    const aiSpinner = ora('Generating AI instruction files...').start();
    try {
      const { AIInstructionsBuilder } = require('../ai-instructions');
      const { detectProjectType, getContextualInstructions } = require('../utils/project-detector');
      const { getRecommendedAgents } = require('../utils/config-manager');

      const builder = new AIInstructionsBuilder();
      const projectInfo = await detectProjectType();
      const projectType = projectInfo.framework || 'auto';

      // Get recommended agents for project type
      const recommendedAgents = getRecommendedAgents(projectType);

      // Agent selection (NEW - v4.0.0 Multi-Agent System)
      let enabledAgents = {};

      if (!isNonInteractive) {
        console.log(chalk.cyan('\n🎯 Multi-Agent Configuration\n'));
        console.log(chalk.gray('All specialized agents are enabled by default. Unselect any you don\'t need.\n'));
        console.log(chalk.gray(`For ${projectType} projects, we recommend all agents enabled.\n`));

        const { agentSelection } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'agentSelection',
            message: 'Keep these agents enabled (unselect to disable):',
            choices: [
              {
                name: '🎨 Frontend Agent - UI/UX, components, styling, accessibility',
                value: 'frontend',
                checked: true  // All enabled by default
              },
              {
                name: '⚙️  Backend Agent - APIs, databases, authentication, security',
                value: 'backend',
                checked: true  // All enabled by default
              },
              {
                name: '🚀 DevOps Agent - CI/CD, Docker, Kubernetes, monitoring',
                value: 'devops',
                checked: true  // All enabled by default
              },
              {
                name: '🧪 Testing Agent - Unit/integration/E2E tests, TDD, coverage',
                value: 'testing',
                checked: true  // All enabled by default
              },
              {
                name: '📚 Documentation Agent - README, API docs, guides, comments',
                value: 'documentation',
                checked: true  // All enabled by default
              }
            ]
          }
        ]);

        // Build enabled agents config - start with all enabled, then remove unchecked ones
        enabledAgents.orchestrator = { enabled: true }; // Always enabled
        const allAgents = ['frontend', 'backend', 'devops', 'testing', 'documentation'];
        allAgents.forEach(agent => {
          enabledAgents[agent] = { enabled: agentSelection.includes(agent) };
        });

        const disabledCount = allAgents.filter(a => !agentSelection.includes(a)).length;
        if (disabledCount === 0) {
          console.log(chalk.green(`\n✓ All agents enabled: orchestrator, ${allAgents.join(', ')}\n`));
        } else {
          const enabledAgentsList = allAgents.filter(a => agentSelection.includes(a)).join(', ');
          console.log(chalk.green(`\n✓ Enabled agents: orchestrator, ${enabledAgentsList}\n`));
        }
      } else {
        // Non-interactive: Enable all agents by default
        console.log(chalk.gray(`  • Agents: All agents enabled by default`));
        enabledAgents.orchestrator = { enabled: true };
        enabledAgents.frontend = { enabled: true };
        enabledAgents.backend = { enabled: true };
        enabledAgents.devops = { enabled: true };
        enabledAgents.testing = { enabled: true };
        enabledAgents.documentation = { enabled: true };
      }

      // Build config with agents
      const generationConfig = {
        'project-type': projectType,
        agents: enabledAgents,
        'primary-ai': config.primaryAI || 'copilot'
      };

      // Generate instruction files for all selected AIs with multi-agent support
      const results = await builder.generateForMultiple(selectedAIs, projectType, generationConfig);

      // Write all files
      for (const result of results) {
        if (result.success) {
          await builder.writeInstructionFile(result);
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        aiSpinner.succeed(`Generated ${successCount} AI instruction file${successCount > 1 ? 's' : ''}`);

        // Show enabled agents count
        const agentCount = Object.keys(enabledAgents).filter(k => enabledAgents[k].enabled).length;
        if (agentCount > 1) {
          console.log(chalk.gray(`  Multi-agent mode: ${agentCount} specialized agents enabled`));
        }
        // Show which files were created
        results.forEach(result => {
          if (result.success) {
            console.log(chalk.gray(`  → ${result.filePath}`));
          } else if (result.error) {
            console.log(chalk.red(`  ✗ ${result.ai}: ${result.error}`));
          }
        });
      } else {
        aiSpinner.fail('Failed to generate AI instruction files');
        results.forEach(result => {
          if (result.error) {
            console.log(chalk.red(`  ✗ ${result.ai}: ${result.error}`));
          }
        });
      }

      // Save AI configuration
      const configManager = require('../utils/config-manager');
      configManager.set('ai-assistants', {
        enabled: selectedAIs,
        primary: config.primaryAI,
        'sync-on-update': true
      });

      // Save agents configuration
      configManager.set('agents', enabledAgents);
      configManager.set('project-type', projectType);

      if (projectInfo.framework) {
        console.log(chalk.gray(`  → Detected ${projectInfo.framework} project`));
        console.log(chalk.gray(`  → Added ${projectInfo.framework}-specific guidelines`));
      }

      // Verification step
      if (successCount > 0) {
        console.log(chalk.cyan('\n✅ Verifying AI integration...'));

        // Check if Copilot instructions exist
        if (selectedAIs.includes('copilot')) {
          const copilotPath = '.github/copilot-instructions.md';
          if (await fs.pathExists(copilotPath)) {
            const stats = await fs.stat(copilotPath);
            const fileSizeKB = (stats.size / 1024).toFixed(1);
            console.log(chalk.green(`  ✓ Copilot instructions: ${fileSizeKB} KB`));
            console.log(chalk.gray(`    ${copilotPath}`));
          }
        }

        console.log(chalk.cyan('\n💡 Next steps for AI assistants:'));
        console.log(chalk.gray('  1. Reload VS Code window to ensure AI loads new instructions'));
        console.log(chalk.gray('     → Press ⌘+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)'));
        console.log(chalk.gray('     → Type "Reload Window" and press Enter'));
        console.log(chalk.gray('  2. Open Copilot Chat and check References section'));
        console.log(chalk.gray('  3. Look for .github/copilot-instructions.md in references\n'));
      }
    } catch (error) {
      aiSpinner.fail('Failed to generate AI instruction files');
      console.error(chalk.red('  Error: ' + error.message));
      console.log(chalk.yellow('\n💡 You can generate them later with: leo ai sync\n'));
    }
  }

  // Step 5: Create or link GitHub Project
  if (isNewRepo && config.newProjectName) {
    const projectSpinner = ora('Creating new GitHub Project...').start();
    try {
      const owner = config.org || repoInfo.split('/')[0];
      const ownerType = isOrgRepo ? 'org' : 'user';

      // Create new project with LEO workflow template
      let createProjectCmd = `gh project create --owner ${owner} --title "${config.newProjectName}"`;
      if (config.newProjectDescription) {
        createProjectCmd += ` --description "${config.newProjectDescription}"`;
      }

      const projectOutput = execSync(createProjectCmd, { encoding: 'utf8' });

      // Extract project number from output (URL format: https://github.com/orgs/OWNER/projects/NUMBER)
      const projectUrlMatch = projectOutput.match(/projects\/(\d+)/);
      if (projectUrlMatch) {
        const newProjectNumber = projectUrlMatch[1];
        config.project = newProjectNumber;

        // Set up project with LEO workflow columns
        const setupColumns = [
          '📋 Backlog',
          '🎯 Ready',
          '🚀 In Progress',
          '👀 Review',
          '✅ Done'
        ];

        // Add custom fields for priority and component
        try {
          execSync(
            `gh project field-create ${newProjectNumber} --owner ${owner} --name Priority --data-type SINGLE_SELECT --single-select-options "P0 Critical,P1 High,P2 Medium,P3 Low"`,
            { stdio: 'ignore' }
          );
          execSync(
            `gh project field-create ${newProjectNumber} --owner ${owner} --name Component --data-type SINGLE_SELECT --single-select-options "Frontend,Backend,Database,DevOps,Design,API"`,
            { stdio: 'ignore' }
          );
        } catch (fieldError) {
          // Fields might already exist, continue
        }

        projectSpinner.succeed(`Created GitHub Project #${newProjectNumber}: ${config.newProjectName}`);
        console.log(chalk.gray(`  View at: https://github.com/${ownerType === 'org' ? 'orgs/' : 'users/'}${owner}/projects/${newProjectNumber}`));
      } else {
        projectSpinner.warn('Project created but could not extract project number');
      }
    } catch (error) {
      projectSpinner.fail('Failed to create GitHub Project');
      console.error(chalk.red(error.message));
    }
  } else if (config.project) {
    const projectSpinner = ora('Adding repository to existing project...').start();
    try {
      const repoUrl = `https://github.com/${repoInfo}`;
      const owner = config.org || repoInfo.split('/')[0];
      execSync(
        `gh project item-add ${config.project} --owner ${owner} --url ${repoUrl}`,
        { stdio: 'ignore' }
      );
      projectSpinner.succeed(`Added to GitHub Project #${config.project}`);
    } catch (error) {
      projectSpinner.warn('Could not add to project board (may already exist or no permission)');
    }
  }

  // Step 6: Create initial commit
  const commitSpinner = ora('Creating initial commit...').start();
  try {
    execSync('git add .');
    const commitMessage = workflowsAnswer.installWorkflows
      ? 'chore: initialize LEO workflow with spec-driven development\n\n- Add documentation structure with specs/ folder\n- Install 8 issue templates + PR template\n- Add GitHub Actions workflows for automation\n- Configure VS Code with project-aware Copilot instructions\n- Set up 22+ GitHub labels\n- Add example specification template'
      : 'chore: initialize LEO workflow with spec-driven development\n\n- Add documentation structure with specs/ folder\n- Install 8 issue templates + PR template\n- Configure VS Code with project-aware Copilot instructions\n- Set up 22+ GitHub labels\n- Add example specification template';

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
    commitSpinner.succeed('Initial commit created');
  } catch (error) {
    commitSpinner.info('No changes to commit (may already be set up)');
  }

  // Success message
  console.log(chalk.yellow('\n🦁 ') + chalk.green.bold('LEO Workflow Kit initialized successfully!') + chalk.yellow(' 🦁\n'));
  console.log(chalk.cyan('Your project is now set up with:\n'));
  console.log(chalk.white('  ✅ Documentation structure with specs/ folder'));
  console.log(chalk.white('  ✅ 8 professional issue templates'));
  console.log(chalk.white('  ✅ Pull request template'));
  if (workflowsAnswer.installWorkflows) {
    console.log(chalk.white('  ✅ GitHub Actions workflows (automation)'));
  }
  console.log(chalk.white('  ✅ 22+ GitHub labels configured'));
  console.log(chalk.white('  ✅ VS Code settings'));

  // Show AI assistants configured
  if (selectedAIs.length > 0) {
    const aiNames = {
      copilot: 'GitHub Copilot',
      cursor: 'Cursor',
      cline: 'Cline',
      codeium: 'Codeium'
    };
    const aiList = selectedAIs.map(ai => aiNames[ai]).join(', ');
    console.log(chalk.white(`  ✅ AI Assistants: ${aiList}`));
    if (config.primaryAI) {
      console.log(chalk.gray(`     Primary: ${aiNames[config.primaryAI]}`));
    }
  }

  if (isNewRepo) {
    console.log(chalk.white(`  ✅ New GitHub Project created (#${config.project})`));
  } else if (config.project) {
    console.log(chalk.white(`  ✅ Connected to GitHub Project #${config.project}`));
  }
  console.log();

  console.log(chalk.cyan('🎯 The LEO workflow:\n'));
  console.log(chalk.yellow('  Phase 1: Specification (Planning)'));
  console.log(chalk.gray('    → Write detailed specs in docs/specs/'));
  console.log(chalk.gray('    → Review and discuss with team'));
  console.log(chalk.gray('    → Get approval before coding\n'));

  console.log(chalk.yellow('  Phase 2: Execution (GitHub Issues)'));
  console.log(chalk.gray('    → Convert approved specs into GitHub issues'));
  console.log(chalk.gray('    → Track work in GitHub Projects'));
  console.log(chalk.gray('    → Reference issues in all commits\n'));

  console.log(chalk.cyan('Next steps:\n'));
  console.log(chalk.white('  1. Write your first spec:'));
  console.log(chalk.gray('     See docs/specs/EXAMPLE_SPEC.md\n'));
  console.log(chalk.white('  2. Create issues from approved specs:'));
  console.log(chalk.gray('     leo issue\n'));
  console.log(chalk.white('  3. Manage AI assistants:'));
  console.log(chalk.gray('     leo ai list         # Show configured AIs'));
  console.log(chalk.gray('     leo ai add <name>   # Add more AIs'));
  console.log(chalk.gray('     leo ai sync         # Regenerate instructions\n'));
  console.log(chalk.white('  4. Check workflow status:'));
  console.log(chalk.gray('     leo status\n'));
  console.log(chalk.white('  5. View documentation:'));
  console.log(chalk.gray('     leo docs\n'));

  console.log(chalk.cyan('💡 Remember: ') + chalk.white('Specifications are FILES. Tasks are GITHUB ISSUES.\n'));

  // Optional: GitHub repository settings setup
  if (isAuthenticated && !isNonInteractive) {
    console.log(chalk.cyan('⚙️  GitHub Repository Settings\n'));

    const { setupGitHub } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'setupGitHub',
        message: 'Configure GitHub repository with LEO recommended settings?',
        default: false
      }
    ]);

    if (setupGitHub) {
      console.log(chalk.gray('\n💡 Running: leo github setup\n'));
      const githubCommand = require('./github');
      await githubCommand('setup', { yes: false });
    } else {
      console.log(chalk.gray('\n💡 You can configure GitHub settings later with:'));
      console.log(chalk.cyan('   leo github setup\n'));
    }
  }
}

module.exports = initCommand;

