const chalk = require('chalk');
const { execSync } = require('child_process');
const ora = require('ora');

const LABELS = [
  // Priority labels
  { name: 'P0', color: 'd73a4a', description: 'Critical - Blocking, production down, data loss' },
  { name: 'P1', color: 'ff6b6b', description: 'High - Important features, major bugs, security' },
  { name: 'P2', color: 'fbca04', description: 'Medium - Standard features, minor bugs' },
  { name: 'P3', color: '0e8a16', description: 'Low - Nice-to-have, enhancements, cleanup' },
  
  // Type labels
  { name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
  { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
  { name: 'documentation', color: '0075ca', description: 'Improvements or additions to documentation' },
  { name: 'deployment', color: '5319e7', description: 'Deployment and infrastructure tasks' },
  { name: 'integration', color: '1d76db', description: 'External service integration' },
  { name: 'refactoring', color: 'fbca04', description: 'Code improvement without new features' },
  { name: 'testing', color: 'd4c5f9', description: 'Test creation or improvement' },
  { name: 'research', color: 'e99695', description: 'Investigation, POC, or research spike' },
  
  // Status labels
  { name: 'blocked', color: 'd73a4a', description: 'Cannot proceed due to dependency' },
  { name: 'in-progress', color: '0e8a16', description: 'Actively being worked on' },
  { name: 'needs-review', color: 'fbca04', description: 'Waiting for code review' },
  { name: 'needs-testing', color: 'd4c5f9', description: 'Waiting for QA testing' },
  { name: 'on-hold', color: 'bfdadc', description: 'Paused temporarily' }
];

async function labelsCommand(options) {
  console.log(chalk.cyan.bold('\n🏷️  Setting up GitHub Labels\n'));

  const spinner = ora('Creating labels...').start();

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const label of LABELS) {
    try {
      execSync(
        `gh label create "${label.name}" --color "${label.color}" --description "${label.description}" --force`,
        { stdio: 'ignore' }
      );
      created++;
    } catch (error) {
      if (error.message.includes('already exists')) {
        skipped++;
      } else {
        errors++;
      }
    }
  }

  spinner.succeed(`Labels configured: ${created} created, ${skipped} already exist`);

  // Clean up default labels if requested
  if (options.clean) {
    const cleanSpinner = ora('Removing default GitHub labels...').start();
    const defaultLabels = ['good first issue', 'help wanted', 'invalid', 'question', 'wontfix', 'duplicate'];
    
    let removed = 0;
    for (const label of defaultLabels) {
      try {
        execSync(`gh label delete "${label}" --yes`, { stdio: 'ignore' });
        removed++;
      } catch (error) {
        // Label doesn't exist, ignore
      }
    }
    
    cleanSpinner.succeed(`Removed ${removed} default labels`);
  }

  console.log(chalk.green('\n✅ Label setup complete!\n'));
  console.log(chalk.gray('View labels: gh label list\n'));
}

module.exports = labelsCommand;

