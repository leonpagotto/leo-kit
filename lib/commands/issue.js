const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const ora = require('ora');

// Component labels (keep these as labels)
const COMPONENTS = ['backend', 'frontend', 'database', 'devops', 'ux', 'documentation', 'api', 'infrastructure'];

// GitHub native issue types
const ISSUE_TYPES = {
  bug: {
    name: 'Bug',
    emoji: '🐛',
    ghType: 'Bug'
  },
  enhancement: {
    name: 'Enhancement',
    emoji: '✨',
    ghType: 'Enhancement'
  },
  task: {
    name: 'Task',
    emoji: '📋',
    ghType: 'Task'
  },
  documentation: {
    name: 'Documentation',
    emoji: '📚',
    ghType: 'Documentation'
  }
};

// GitHub native priority levels
const PRIORITIES = {
  critical: { name: '🔴 Critical', value: '🔴 Critical', number: 4 },
  high: { name: '🟠 High', value: '🟠 High', number: 3 },
  medium: { name: '🟡 Medium', value: '🟡 Medium', number: 2 },
  low: { name: '🟢 Low', value: '🟢 Low', number: 1 }
};

// Story point options (Fibonacci sequence)
const STORY_POINTS = [
  { name: '1 - Trivial (< 1 hour)', value: 1 },
  { name: '2 - Simple (1-2 hours)', value: 2 },
  { name: '3 - Small (2-4 hours)', value: 3 },
  { name: '5 - Medium (1 day)', value: 5 },
  { name: '8 - Large (2-3 days)', value: 8 },
  { name: '13 - Very Large (1 week)', value: 13 },
  { name: '21 - Epic (2+ weeks - should break down)', value: 21 }
];

async function issueCommand(options) {
  console.log(chalk.cyan.bold('\n🎯 Creating New Issue (GitHub Native Fields)\n'));

  // Check GitHub authentication
  try {
    execSync('gh repo view', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('\n❌ Error: Not in a GitHub repository or not authenticated'));
    console.log(chalk.yellow('Run: gh auth login\n'));
    process.exit(1);
  }

  let config = { ...options };

  // Interactive mode
  if (options.interactive !== false) {
    // Select issue type
    if (!config.type) {
      const { type } = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Issue type:',
          choices: Object.keys(ISSUE_TYPES).map(key => ({
            name: `${ISSUE_TYPES[key].emoji} ${ISSUE_TYPES[key].name}`,
            value: key
          }))
        }
      ]);
      config.type = type;
    }

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
        type: 'list',
        name: 'priority',
        message: 'Priority:',
        choices: Object.values(PRIORITIES).map(p => ({ name: p.name, value: p.value })),
        default: PRIORITIES.medium.value,
        when: !config.priority
      },
      {
        type: 'list',
        name: 'estimate',
        message: 'Effort estimate (story points):',
        choices: STORY_POINTS,
        default: 2,
        when: !config.estimate
      },
      {
        type: 'checkbox',
        name: 'components',
        message: 'Components affected (select all that apply):',
        choices: COMPONENTS,
        when: !config.components
      },
      {
        type: 'editor',
        name: 'description',
        message: 'Description (opens editor):',
        default: getTemplateContent(config.type)
      },
      {
        type: 'input',
        name: 'assignee',
        message: 'Assign to (GitHub username, or leave empty):',
        when: !config.assignee
      }
    ]);

    config = { ...config, ...answers };
  }

  // Build issue body
  const issueBody = buildIssueBody(config);

  // Create the issue
  const spinner = ora('Creating issue...').start();

  try {
    // Build component labels
    const componentLabels = Array.isArray(config.components) 
      ? config.components.join(',') 
      : config.components || '';

    // Write body to temp file to avoid escaping issues
    const fs = require('fs');
    const path = require('path');
    const tempFile = path.join(process.cwd(), '.gh-issue-body.md');
    fs.writeFileSync(tempFile, issueBody, 'utf8');

    // Create issue with GitHub CLI
    let cmd = `gh issue create --title "${config.title}" --body-file "${tempFile}"`;
    
    // Add component labels
    if (componentLabels) {
      cmd += ` --label "${componentLabels}"`;
    }

    // Add assignee
    if (config.assignee) {
      cmd += ` --assignee "${config.assignee}"`;
    }

    const issueUrl = execSync(cmd, { encoding: 'utf8' }).trim();
    const issueNumber = issueUrl.match(/#(\d+)$/)?.[1] || issueUrl.split('/').pop();

    // Clean up temp file
    try { fs.unlinkSync(tempFile); } catch (e) {}

    spinner.succeed('Issue created!');
    console.log(chalk.green(`\n✅ Issue created: ${issueUrl}\n`));

    // Add to project and set custom fields
    await addToProjectAndSetFields(issueNumber, config);

    // Show next steps
    showNextSteps();

  } catch (error) {
    spinner.fail('Failed to create issue');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function addToProjectAndSetFields(issueNumber, config) {
  const spinner = ora('Adding to project board and setting fields...').start();

  try {
    // Get repository info
    const repoInfo = execSync('gh repo view --json owner,name', { encoding: 'utf8' });
    const { owner, name } = JSON.parse(repoInfo);

    // Get project info from config or environment
    // For now, we'll use a configurable approach
    const projectNumber = process.env.GH_PROJECT_NUMBER || config.projectNumber;

    if (!projectNumber) {
      spinner.info('No project configured. Set GH_PROJECT_NUMBER env var to auto-add issues to project.');
      return;
    }

    // Add to project using GraphQL
    const mutation = `
      mutation {
        addProjectV2ItemByNumber(
          input: {
            projectId: "${projectNumber}"
            contentId: "${issueNumber}"
          }
        ) {
          item {
            id
          }
        }
      }
    `;

    execSync(`gh api graphql -f query='${mutation}'`, { stdio: 'ignore' });

    // Set custom fields (Priority, Estimate, Status)
    await setProjectFields(projectNumber, issueNumber, config);

    spinner.succeed('Added to project board with custom fields!');

  } catch (error) {
    spinner.warn(`Could not add to project: ${error.message}`);
    console.log(chalk.yellow('\n💡 Tip: Configure GH_PROJECT_NUMBER environment variable for automatic project integration\n'));
  }
}

async function setProjectFields(projectNumber, itemId, config) {
  // This will set custom fields like Priority, Estimate, and Status in GitHub Projects v2
  // Implementation depends on your project's custom field IDs
  
  // Example GraphQL mutation (you'll need to get actual field IDs from your project)
  const mutations = [];

  if (config.priority) {
    mutations.push(`
      updateProjectV2ItemFieldValue(
        input: {
          projectId: "${projectNumber}"
          itemId: "${itemId}"
          fieldId: "PRIORITY_FIELD_ID"
          value: {
            text: "${config.priority}"
          }
        }
      )
    `);
  }

  if (config.estimate) {
    mutations.push(`
      updateProjectV2ItemFieldValue(
        input: {
          projectId: "${projectNumber}"
          itemId: "${itemId}"
          fieldId: "ESTIMATE_FIELD_ID"
          value: {
            number: ${config.estimate}
          }
        }
      )
    `);
  }

  // Set initial status to "Todo"
  mutations.push(`
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "${projectNumber}"
        itemId: "${itemId}"
        fieldId: "STATUS_FIELD_ID"
        value: {
          singleSelectOptionId: "TODO_OPTION_ID"
        }
      }
    )
  `);

  // Execute mutations (if project is configured)
  // This requires project setup with custom fields
}

function getTemplateContent(type) {
  const templates = {
    bug: `## Description
[Describe the bug clearly and concisely]

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

## Screenshots/Logs
[If applicable]

## Acceptance Criteria
- [ ] Bug is reproducible
- [ ] Root cause identified
- [ ] Fix implemented and tested
- [ ] No regression in related features`,

    enhancement: `## User Story
As a [type of user],
I want [goal/desire],
So that [benefit/value].

## Description
[Detailed feature description]

## Design/Mockups
[Links or attachments if applicable]

## Technical Approach
[How will this be implemented?]

## Acceptance Criteria
- [ ] Feature works as described
- [ ] Mobile responsive (if applicable)
- [ ] Accessibility compliant
- [ ] Tests added
- [ ] Documentation updated`,

    task: `## Objective
[What needs to be done?]

## Context
[Why is this needed?]

## Steps
- [ ] 
- [ ] 
- [ ] 

## Dependencies
[Any blockers or dependencies?]

## Acceptance Criteria
- [ ] All steps completed
- [ ] Changes tested
- [ ] Documentation updated (if needed)`,

    documentation: `## Documentation Type
- [ ] User Guide
- [ ] API Documentation
- [ ] Developer Guide
- [ ] Architecture Documentation

## What Needs Documentation?
[Describe what should be documented]

## Target Audience
[Who will read this?]

## Outline
1. 
2. 
3. 

## Acceptance Criteria
- [ ] Content is complete and accurate
- [ ] Clear and easy to understand
- [ ] Examples/code samples included
- [ ] Reviewed and published`
  };

  return templates[type] || templates.task;
}

function buildIssueBody(config) {
  // Build body with metadata
  let body = '';

  // Add priority badge
  if (config.priority) {
    body += `**Priority:** ${config.priority}\n`;
  }

  // Add estimate
  if (config.estimate) {
    body += `**Estimate:** ${config.estimate} story points\n`;
  }

  // Add components
  if (config.components && config.components.length > 0) {
    const components = Array.isArray(config.components) ? config.components : [config.components];
    body += `**Components:** ${components.join(', ')}\n`;
  }

  body += `\n---\n\n`;
  body += config.description;

  // Don't escape - let gh CLI handle it
  return body;
}

function showNextSteps() {
  console.log(chalk.cyan('\n📋 Workflow:\n'));
  console.log(chalk.white('  1. Issue is now in "Todo" status'));
  console.log(chalk.white('  2. When you start work, it will auto-move to "In Progress"'));
  console.log(chalk.white('  3. Reference in commits: "Relates to #X" or "Fixes #X"'));
  console.log(chalk.white('  4. When PR merges, issue auto-moves to "Done"\n'));
  
  console.log(chalk.gray('💡 Tip: AI assistants will auto-update status based on your work\n'));
}

module.exports = issueCommand;
