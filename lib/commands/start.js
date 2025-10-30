const chalk = require('chalk');
const { execSync } = require('child_process');
const ora = require('ora');

/**
 * Start work on a GitHub issue
 * - Fetches issue details
 * - Creates a conventional branch name
 * - Checks out the new branch
 * - Updates issue status to "In Progress"
 * - Displays issue context
 */
async function startCommand(issueNumber, options = {}) {
  console.log(chalk.cyan.bold('\n🚀 Starting work on issue\n'));

  // Validate issue number
  if (!issueNumber) {
    console.log(chalk.red('❌ Error: Issue number required'));
    console.log(chalk.yellow('Usage: leo start <issue-number>'));
    console.log(chalk.gray('Example: leo start 123\n'));
    process.exit(1);
  }

  // Extract issue number from URL if provided
  const issueMatch = String(issueNumber).match(/\/issues\/(\d+)/);
  const issueNum = issueMatch ? issueMatch[1] : issueNumber;

  // Check GitHub authentication
  try {
    execSync('gh repo view', { stdio: 'ignore' });
  } catch (error) {
    console.log(chalk.red('❌ Error: Not in a GitHub repository or not authenticated'));
    console.log(chalk.yellow('Run: gh auth login\n'));
    process.exit(1);
  }

  let spinner = ora('Fetching issue details...').start();

  try {
    // Fetch issue details from GitHub
    const issueJson = execSync(
      `gh issue view ${issueNum} --json number,title,body,labels,state,assignees`,
      { encoding: 'utf8' }
    );
    const issue = JSON.parse(issueJson);

    spinner.succeed(`Issue #${issue.number}: ${issue.title}`);

    // Check if issue is already closed
    if (issue.state === 'CLOSED') {
      console.log(chalk.yellow(`\n⚠️  Warning: Issue #${issue.number} is already closed`));
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      await new Promise((resolve) => {
        readline.question('Continue anyway? (y/N): ', (answer) => {
          readline.close();
          if (answer.toLowerCase() !== 'y') {
            console.log(chalk.gray('\nCancelled.\n'));
            process.exit(0);
          }
          resolve();
        });
      });
    }

    // Check if already assigned
    if (issue.assignees && issue.assignees.length > 0 && !options.force) {
      console.log(chalk.yellow(`\n⚠️  Issue is already assigned to: ${issue.assignees.map(a => a.login).join(', ')}`));
    }

    // Generate branch name from issue title
    spinner = ora('Creating branch...').start();
    
    const branchName = generateBranchName(issue);
    
    // Check if branch already exists
    try {
      execSync(`git rev-parse --verify ${branchName}`, { stdio: 'ignore' });
      spinner.warn(`Branch '${branchName}' already exists`);
      
      // Checkout existing branch
      execSync(`git checkout ${branchName}`, { stdio: 'ignore' });
      console.log(chalk.green(`✓ Checked out existing branch: ${branchName}`));
    } catch {
      // Branch doesn't exist, create it
      try {
        // Make sure we're up to date with main
        const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        const mainBranch = getMainBranchName();
        
        if (currentBranch !== mainBranch) {
          spinner.text = `Switching to ${mainBranch}...`;
          execSync(`git checkout ${mainBranch}`, { stdio: 'ignore' });
        }
        
        // Fetch latest
        spinner.text = 'Fetching latest changes...';
        execSync('git fetch origin', { stdio: 'ignore' });
        
        // Create and checkout new branch
        execSync(`git checkout -b ${branchName}`, { stdio: 'ignore' });
        spinner.succeed(`Created branch: ${chalk.green(branchName)}`);
      } catch (error) {
        spinner.fail('Failed to create branch');
        console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
        process.exit(1);
      }
    }

    // Update issue status to "In Progress" if using GitHub Projects
    spinner = ora('Updating issue status...').start();
    try {
      // Try to move issue to "In Progress" status
      execSync(
        `gh issue edit ${issueNum} --add-label "status: in progress"`,
        { stdio: 'ignore' }
      );
      spinner.succeed('Issue status updated to In Progress');
    } catch (error) {
      // Silently fail if status update doesn't work (project might not be set up)
      spinner.info('Issue status update skipped (no project configured)');
    }

    // Display issue context
    console.log(chalk.cyan('\n📋 Issue Details:\n'));
    console.log(chalk.bold(`  Title: ${issue.title}`));
    console.log(chalk.gray(`  Number: #${issue.number}`));
    console.log(chalk.gray(`  Labels: ${issue.labels.map(l => l.name).join(', ') || 'none'}`));
    
    if (issue.body) {
      console.log(chalk.cyan('\n📝 Description:\n'));
      // Show first 500 chars of body
      const description = issue.body.length > 500 
        ? issue.body.substring(0, 500) + '...' 
        : issue.body;
      console.log(chalk.gray(description));
    }

    console.log(chalk.green('\n✓ Ready to code!\n'));
    console.log(chalk.gray(`View full issue: gh issue view ${issueNum}`));
    console.log(chalk.gray(`Branch: ${branchName}\n`));

  } catch (error) {
    spinner.fail('Failed to start work on issue');
    
    if (error.message.includes('Could not resolve to an Issue')) {
      console.log(chalk.red(`\n❌ Error: Issue #${issueNum} not found\n`));
    } else {
      console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
    }
    process.exit(1);
  }
}

/**
 * Generate a conventional branch name from issue details
 * Format: <type>/issue-<number>-<title-slug>
 */
function generateBranchName(issue) {
  // Determine branch type from labels
  let type = 'feat'; // default
  
  const labels = issue.labels.map(l => l.name.toLowerCase());
  
  if (labels.some(l => l.includes('bug') || l.includes('fix'))) {
    type = 'fix';
  } else if (labels.some(l => l.includes('doc'))) {
    type = 'docs';
  } else if (labels.some(l => l.includes('refactor'))) {
    type = 'refactor';
  } else if (labels.some(l => l.includes('test'))) {
    type = 'test';
  } else if (labels.some(l => l.includes('chore'))) {
    type = 'chore';
  }
  
  // Create slug from title (max 50 chars)
  const slug = issue.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .substring(0, 50); // Limit length
  
  return `${type}/issue-${issue.number}-${slug}`;
}

/**
 * Get the name of the main branch (main or master)
 */
function getMainBranchName() {
  try {
    const branches = execSync('git branch -r', { encoding: 'utf8' });
    if (branches.includes('origin/main')) {
      return 'main';
    } else if (branches.includes('origin/master')) {
      return 'master';
    }
  } catch {
    // Default to main
  }
  return 'main';
}

module.exports = startCommand;
