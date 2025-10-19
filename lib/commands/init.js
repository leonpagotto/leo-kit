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
        default: `${repoInfo.split('/')[1]} - LEO Workflow`,
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

## LEO Workflow

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

      // Create Copilot instructions with project-aware enhancements
      const { detectProjectType, getContextualInstructions } = require('../utils/project-detector');
      const projectInfo = await detectProjectType();
      const contextualInstructions = getContextualInstructions(projectInfo);

      const enhancedInstructions = COPILOT_INSTRUCTIONS + contextualInstructions;
      await fs.writeFile('.github/copilot-instructions.md', enhancedInstructions);

      vscodeSpinner.succeed('VS Code configured with Copilot instructions');

      if (projectInfo.framework) {
        console.log(chalk.gray(`  → Detected ${projectInfo.framework} project`));
        console.log(chalk.gray(`  → Added ${projectInfo.framework}-specific guidelines`));
      }
    } catch (error) {
      vscodeSpinner.fail('Failed to configure VS Code');
      console.error(chalk.red(error.message));
    }
  }

  // Step 5: Create or link GitHub Project
  if (isNewRepo && config.newProjectName) {
    const projectSpinner = ora('Creating new GitHub Project...').start();
    try {
      const owner = config.org || repoInfo.split('/')[0];
      const ownerType = isOrgRepo ? 'org' : 'user';

      // Create new project with LEO Workflow template
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
  console.log(chalk.white('  ✅ VS Code settings & project-aware Copilot instructions'));
  if (isNewRepo) {
    console.log(chalk.white(`  ✅ New GitHub Project created (#${config.project})`));
  } else if (config.project) {
    console.log(chalk.white(`  ✅ Connected to GitHub Project #${config.project}`));
  }
  console.log();

  console.log(chalk.cyan('🎯 The LEO Workflow:\n'));
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
  console.log(chalk.white('  3. Check workflow status:'));
  console.log(chalk.gray('     leo status\n'));
  console.log(chalk.white('  4. View documentation:'));
  console.log(chalk.gray('     leo docs\n'));

  console.log(chalk.cyan('💡 Remember: ') + chalk.white('Specifications are FILES. Tasks are GITHUB ISSUES.\n'));
}

module.exports = initCommand;
