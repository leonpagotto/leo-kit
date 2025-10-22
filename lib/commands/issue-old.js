const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const ora = require('ora');

const TEMPLATES = {
  bug: {
    name: 'Bug Report',
    emoji: '🐛',
    labels: 'bug,P2'
  },
  feature: {
    name: 'Feature Request',
    emoji: '✨',
    labels: 'enhancement,P2'
  },
  docs: {
    name: 'Documentation',
    emoji: '📚',
    labels: 'documentation,P2'
  },
  deployment: {
    name: 'Deployment Task',
    emoji: '🚀',
    labels: 'deployment,P1'
  },
  integration: {
    name: 'Integration Task',
    emoji: '🔗',
    labels: 'integration,P1'
  },
  refactoring: {
    name: 'Refactoring',
    emoji: '♻️',
    labels: 'refactoring,P2'
  },
  testing: {
    name: 'Testing',
    emoji: '🧪',
    labels: 'testing,P2'
  },
  research: {
    name: 'Research Spike',
    emoji: '🔬',
    labels: 'research,P3'
  }
};

async function issueCommand(options) {
  console.log(chalk.cyan.bold('\n📝 Creating New Issue (Spec-Driven)\n'));

  // Check if in a git repository with GitHub remote
  try {
    execSync('gh repo view', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('\n❌ Error: Not in a GitHub repository or not authenticated'));
    console.log(chalk.yellow('Run: gh auth login\n'));
    process.exit(1);
  }

  let config = { ...options };

  // Interactive mode if no options provided
  if (options.interactive !== false) {
    // Select template
    if (!config.template) {
      const { template } = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select issue type:',
          choices: Object.keys(TEMPLATES).map(key => ({
            name: `${TEMPLATES[key].emoji} ${TEMPLATES[key].name}`,
            value: key
          }))
        }
      ]);
      config.template = template;
    }

    const templateInfo = TEMPLATES[config.template];

    // Get issue details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Issue title:',
        validate: input => input.length > 3 || 'Title must be at least 3 characters',
        when: !config.title
      },
      {
        type: 'editor',
        name: 'description',
        message: 'Description (opens editor):',
        default: getTemplateContent(config.template)
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: [
          { name: '🔴 P0 - Critical (blocking, production down)', value: 'P0' },
          { name: '🟠 P1 - High (important features, major bugs)', value: 'P1' },
          { name: '🟡 P2 - Medium (standard work)', value: 'P2' },
          { name: '🟢 P3 - Low (nice-to-have)', value: 'P3' }
        ],
        default: 2,
        when: !config.priority
      },
      {
        type: 'input',
        name: 'assignee',
        message: 'Assign to (GitHub username, or leave empty):',
        when: !config.assignee
      },
      {
        type: 'input',
        name: 'labels',
        message: 'Additional labels (comma-separated):',
        default: templateInfo.labels
      },
      {
        type: 'confirm',
        name: 'addToProject',
        message: 'Add to project board?',
        default: true
      }
    ]);

    config = { ...config, ...answers };
  }

  // Build issue body with spec-driven format
  const issueBody = buildIssueBody(config);

  // Create the issue
  const spinner = ora('Creating issue...').start();

  try {
    // Prepare labels
    let labels = config.labels || TEMPLATES[config.template].labels;
    if (config.priority && !labels.includes(config.priority)) {
      labels = `${config.priority},${labels}`;
    }

    // Create issue command
    let cmd = `gh issue create --title "${config.title}" --body "${issueBody}" --label "${labels}"`;
    
    if (config.assignee) {
      cmd += ` --assignee ${config.assignee}`;
    }

    const issueUrl = execSync(cmd, { encoding: 'utf8' }).trim();
    spinner.succeed('Issue created!');

    console.log(chalk.green(`\n✅ Issue created: ${issueUrl}\n`));

    // Add to project board if requested
    if (config.addToProject) {
      const projectSpinner = ora('Adding to project board...').start();
      try {
        // Try to get organization and project from config or environment
        // For now, we'll skip this if not configured
        projectSpinner.info('To add to project board, run: gh project item-add [PROJECT_NUM] --owner [ORG] --url [ISSUE_URL]');
      } catch (error) {
        projectSpinner.warn('Could not add to project board automatically');
      }
    }

    // Show next steps
    console.log(chalk.cyan('Next steps:\n'));
    console.log(chalk.white('  1. Review and refine the issue on GitHub'));
    console.log(chalk.white('  2. Update issue status to "In Progress" when starting'));
    console.log(chalk.white('  3. Reference issue in commits: "Relates to #X" or "Fixes #X"'));
    console.log(chalk.white('  4. Close issue when complete\n'));

  } catch (error) {
    spinner.fail('Failed to create issue');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function getTemplateContent(template) {
  // Return template-specific default content
  const templates = {
    bug: `**Priority:** P2

## Description
[Describe the bug]

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser/Device: 
- OS: 
- Version: 

## Tasks
- [ ] Reproduce bug in test environment
- [ ] Identify root cause
- [ ] Implement fix
- [ ] Add tests
- [ ] Verify fix in production

## Acceptance Criteria
- ✅ Bug is reproducible
- ✅ Root cause identified
- ✅ Fix implemented and tested
- ✅ No regression`,

    feature: `**Priority:** P2

## User Story
As a [type of user],
I want [goal/desire],
So that [benefit/value].

## Description
[Detailed feature description]

## Tasks
- [ ] Design solution
- [ ] Implement backend/API
- [ ] Implement frontend/UI
- [ ] Add tests
- [ ] Update documentation

## Acceptance Criteria
- ✅ Feature works as described
- ✅ Mobile responsive
- ✅ Accessibility compliant
- ✅ Tests passing`,

    docs: `**Priority:** P2

## Documentation Type
- [ ] User Guide
- [ ] API Documentation
- [ ] Developer Guide
- [ ] Setup Guide

## Description
[What needs to be documented?]

## Tasks
- [ ] Research and gather information
- [ ] Create outline
- [ ] Write first draft
- [ ] Review and edit
- [ ] Publish

## Acceptance Criteria
- ✅ Complete and accurate
- ✅ Clear and concise
- ✅ Examples included
- ✅ Published and accessible`,

    deployment: `**Priority:** P1

## Deployment Details
- Environment: [Production/Staging/Dev]
- Version: 
- Service: 

## Changes
- 
- 

## Pre-Deployment Checklist
- [ ] Tests passing
- [ ] Code review approved
- [ ] Documentation updated
- [ ] Backup created

## Deployment Steps
1. 
2. 
3. 

## Verification
- [ ] Service health check
- [ ] Smoke tests
- [ ] Monitoring active

## Rollback Plan
[Steps to rollback if needed]`,

    integration: `**Priority:** P1

## Integration Overview
[External service or system to integrate]

## Tasks
- [ ] Research API/service
- [ ] Design integration approach
- [ ] Implement authentication
- [ ] Implement data flow
- [ ] Add error handling
- [ ] Write tests
- [ ] Document integration

## Acceptance Criteria
- ✅ Integration working
- ✅ Error handling complete
- ✅ Tests passing
- ✅ Documentation complete`,

    refactoring: `**Priority:** P2

## Current State
[Describe current code/architecture]

## Proposed Changes
[What needs to be refactored?]

## Tasks
- [ ] Analyze current code
- [ ] Design better approach
- [ ] Refactor code
- [ ] Update tests
- [ ] Verify no regression

## Acceptance Criteria
- ✅ Code is cleaner/more maintainable
- ✅ Performance improved (if applicable)
- ✅ All tests passing
- ✅ No functionality broken`,

    testing: `**Priority:** P2

## Testing Scope
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

## Coverage Goals
Current: [X%]
Target: [Y%]

## Tasks
- [ ] Identify test gaps
- [ ] Write test cases
- [ ] Implement tests
- [ ] Verify coverage
- [ ] Document test approach

## Acceptance Criteria
- ✅ Coverage target met
- ✅ All tests passing
- ✅ CI/CD integrated`,

    research: `**Priority:** P3

## Research Questions
1. 
2. 
3. 

## Time Box
[How long to spend on this?]

## Deliverables
- [ ] Research findings document
- [ ] Recommendation/decision
- [ ] POC (if applicable)

## Acceptance Criteria
- ✅ Questions answered
- ✅ Recommendation provided
- ✅ Decision documented`
  };

  return templates[template] || templates.feature;
}

function buildIssueBody(config) {
  // Escape double quotes for shell command
  return config.description.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

module.exports = issueCommand;

