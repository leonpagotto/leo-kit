const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

/**
 * Setup GitHub Projects integration
 * - Detects available projects
 * - Interactive project selection
 * - Configures GitHub secrets (PROJECT_URL, GH_PROJECT_TOKEN)
 * - Updates auto-add-to-project.yml workflow
 */
async function githubProjectCommand(action = 'setup', options = {}) {
  if (action === 'setup') {
    return await setupGitHubProject(options);
  } else if (action === 'test') {
    return await testGitHubProject(options);
  } else {
    console.log(chalk.red(`\n❌ Unknown action: ${action}\n`));
    console.log(chalk.gray('Available actions:'));
    console.log(chalk.gray('  leo github project setup  - Configure project integration'));
    console.log(chalk.gray('  leo github project test   - Test project assignment\n'));
    process.exit(1);
  }
}

async function setupGitHubProject(options = {}) {
  console.log(chalk.cyan.bold('\n🔗 GitHub Projects Integration Setup\n'));

  // Step 1: Verify prerequisites
  const checkSpinner = ora('Checking prerequisites...').start();

  try {
    execSync('gh --version', { stdio: 'ignore' });
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    checkSpinner.succeed('Prerequisites check passed');
  } catch (error) {
    checkSpinner.fail('Prerequisites check failed');
    console.log(chalk.red('\n❌ Error: GitHub CLI and Git are required'));
    console.log(chalk.yellow('Install GitHub CLI: https://cli.github.com/'));
    process.exit(1);
  }

  // Step 2: Check GitHub authentication with project scope
  const authSpinner = ora('Checking GitHub authentication...').start();

  try {
    const authStatus = execSync('gh auth status 2>&1', { encoding: 'utf8' });
    
    // Check if project scope is present
    if (!authStatus.includes("'project'")) {
      authSpinner.fail('GitHub CLI missing project scope');
      console.log(chalk.yellow('\n⚠️  GitHub Projects requires the "project" scope'));
      console.log(chalk.gray('Run this command to add the scope:\n'));
      console.log(chalk.cyan('  gh auth refresh -s project\n'));
      
      const { addScope } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addScope',
          message: 'Add project scope now?',
          default: true
        }
      ]);

      if (addScope) {
        console.log(chalk.gray('\n🔑 Adding project scope...\n'));
        execSync('gh auth refresh -s project', { stdio: 'inherit' });
        console.log(chalk.green('\n✅ Project scope added!\n'));
      } else {
        console.log(chalk.red('\n❌ Cannot continue without project scope\n'));
        process.exit(1);
      }
    } else {
      authSpinner.succeed('GitHub authentication verified (project scope present)');
    }
  } catch (error) {
    authSpinner.fail('GitHub CLI not authenticated');
    console.log(chalk.yellow('\n⚠️  Please authenticate with GitHub CLI first:\n'));
    console.log(chalk.cyan('  gh auth login -s project\n'));
    process.exit(1);
  }

  // Step 3: Get repository info
  let repoInfo;
  let owner;
  let isOrgRepo = false;

  try {
    repoInfo = execSync('gh repo view --json nameWithOwner -q .nameWithOwner', {
      encoding: 'utf8'
    }).trim();
    
    const parts = repoInfo.split('/');
    owner = parts[0];
    
    // Check if it's an org repo
    const repoData = JSON.parse(execSync('gh repo view --json owner', { encoding: 'utf8' }));
    isOrgRepo = repoData.owner.type === 'Organization';
    
    console.log(chalk.gray(`Repository: ${repoInfo}`));
    console.log(chalk.gray(`Owner: ${owner} (${isOrgRepo ? 'Organization' : 'User'})\n`));
  } catch (error) {
    console.log(chalk.red('\n❌ Not in a GitHub repository or not authenticated\n'));
    process.exit(1);
  }

  // Step 4: List available projects
  const projectsSpinner = ora('Fetching GitHub Projects...').start();

  let projects = [];
  try {
    // Try to list projects using --owner flag (works for both org and user)
    const projectsOutput = execSync(`gh project list --owner ${owner} --format json --limit 50`, {
      encoding: 'utf8'
    });

    const projectsData = JSON.parse(projectsOutput);
    projects = projectsData.projects || [];

    if (projects.length === 0) {
      projectsSpinner.warn('No GitHub Projects found');
      console.log(chalk.yellow('\n⚠️  No projects found. Would you like to create one?\n'));
      
      const { createNew } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createNew',
          message: 'Create a new GitHub Project?',
          default: true
        }
      ]);

      if (createNew) {
        return await createNewProject(owner, repoInfo, isOrgRepo);
      } else {
        console.log(chalk.gray('\n💡 You can create a project manually at:'));
        console.log(chalk.cyan(`  https://github.com/${isOrgRepo ? 'orgs/' : 'users/'}${owner}/projects/new\n`));
        process.exit(0);
      }
    }

    projectsSpinner.succeed(`Found ${projects.length} project${projects.length > 1 ? 's' : ''}`);
  } catch (error) {
    projectsSpinner.fail('Failed to fetch projects');
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  // Step 5: Interactive project selection
  console.log(chalk.cyan('\n📋 Available Projects:\n'));
  
  const projectChoices = projects.map((project, index) => ({
    name: `${index + 1}. ${project.title} (Project #${project.number})`,
    value: project.number,
    short: `#${project.number}`
  }));

  projectChoices.push({
    name: '➕ Create new project',
    value: 'new',
    short: 'Create new'
  });

  const { selectedProject } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedProject',
      message: 'Select a project for auto-assignment:',
      choices: projectChoices,
      pageSize: 15
    }
  ]);

  if (selectedProject === 'new') {
    return await createNewProject(owner, repoInfo, isOrgRepo);
  }

  // Get selected project details
  const project = projects.find(p => p.number === selectedProject);
  const projectUrl = `https://github.com/${isOrgRepo ? 'orgs' : 'users'}/${owner}/projects/${selectedProject}`;

  console.log(chalk.gray(`\nSelected: ${project.title} (#${selectedProject})`));
  console.log(chalk.gray(`URL: ${projectUrl}\n`));

  // Step 6: Configure GitHub Secrets
  const secretsSpinner = ora('Configuring GitHub secrets...').start();

  try {
    // Set PROJECT_URL secret
    execSync(`gh secret set PROJECT_URL --body "${projectUrl}"`, { stdio: 'pipe' });
    
    secretsSpinner.text = 'Secrets configured (using GITHUB_TOKEN)';
    secretsSpinner.succeed('GitHub secrets configured');
    
    console.log(chalk.gray('  ✓ PROJECT_URL set'));
    console.log(chalk.gray('  ✓ Using GITHUB_TOKEN for authentication\n'));
  } catch (error) {
    secretsSpinner.fail('Failed to configure secrets');
    console.error(chalk.red(error.message));
    console.log(chalk.yellow('\n💡 You can set secrets manually:\n'));
    console.log(chalk.cyan(`  gh secret set PROJECT_URL --body "${projectUrl}"\n`));
  }

  // Step 7: Update workflow file to use GITHUB_TOKEN
  const workflowSpinner = ora('Updating GitHub Actions workflow...').start();

  try {
    const workflowPath = '.github/workflows/auto-add-to-project.yml';
    
    if (await fs.pathExists(workflowPath)) {
      const updatedWorkflow = `name: Auto Assign to Project

on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - name: Add to project
        uses: actions/add-to-project@v0.6.1
        with:
          project-url: \${{ secrets.PROJECT_URL }}
`;

      await fs.writeFile(workflowPath, updatedWorkflow);
      workflowSpinner.succeed('Workflow updated to use GITHUB_TOKEN');
      console.log(chalk.gray(`  → ${workflowPath}\n`));
    } else {
      workflowSpinner.warn('Workflow file not found (may need to run leo init first)');
    }
  } catch (error) {
    workflowSpinner.fail('Failed to update workflow');
    console.error(chalk.red(error.message));
  }

  // Step 8: Save configuration to .env
  const configSpinner = ora('Saving configuration...').start();

  try {
    const envPath = path.join(process.cwd(), '.env');
    const envConfig = `# GitHub Projects Configuration
# Generated by LEO Workflow Kit

GITHUB_PROJECT_NUMBER=${selectedProject}
GITHUB_PROJECT_URL=${projectUrl}
GITHUB_PROJECT_OWNER=${owner}
GITHUB_PROJECT_OWNER_TYPE=${isOrgRepo ? 'org' : 'user'}
`;

    await fs.writeFile(envPath, envConfig);
    configSpinner.succeed('Configuration saved to .env');
    console.log(chalk.gray(`  → .env\n`));
  } catch (error) {
    configSpinner.warn('Could not save .env file');
  }

  // Step 9: Verify setup
  console.log(chalk.green.bold('✅ GitHub Projects integration configured!\n'));
  console.log(chalk.cyan('Configuration:\n'));
  console.log(chalk.white(`  Project: ${project.title}`));
  console.log(chalk.white(`  Number: #${selectedProject}`));
  console.log(chalk.white(`  URL: ${projectUrl}`));
  console.log(chalk.white(`  Owner: ${owner} (${isOrgRepo ? 'org' : 'user'})\n`));

  console.log(chalk.cyan('Next steps:\n'));
  console.log(chalk.gray('  1. Test the integration:'));
  console.log(chalk.cyan('     leo github project test\n'));
  console.log(chalk.gray('  2. Create an issue to verify auto-assignment:'));
  console.log(chalk.cyan('     leo issue\n'));
  console.log(chalk.gray('  3. Check GitHub Actions runs:'));
  console.log(chalk.cyan('     gh run list --limit 5\n'));

  return { success: true, projectNumber: selectedProject, projectUrl };
}

async function createNewProject(owner, repoInfo, isOrgRepo) {
  console.log(chalk.cyan('\n✨ Create New GitHub Project\n'));

  const { projectName, projectDescription } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: `${repoInfo.split('/')[1]} - LEO Workflow`,
      validate: (input) => {
        if (!input || input.trim() === '') return 'Project name is required';
        return true;
      }
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'Project description (optional):',
      default: 'Spec-driven development workflow with LEO Kit'
    }
  ]);

  const createSpinner = ora('Creating GitHub Project...').start();

  try {
    // Use --owner flag (works for both org and user)
    let createCmd = `gh project create --owner ${owner} --title "${projectName}"`;
    
    if (projectDescription) {
      createCmd += ` --format "{url}"`;
    }

    const output = execSync(createCmd, { encoding: 'utf8' });
    
    // Extract project number from URL
    const projectUrlMatch = output.match(/projects\/(\d+)/);
    if (!projectUrlMatch) {
      createSpinner.fail('Project created but could not extract project number');
      console.log(chalk.gray(output));
      process.exit(1);
    }

    const projectNumber = projectUrlMatch[1];
    const projectUrl = `https://github.com/${isOrgRepo ? 'orgs' : 'users'}/${owner}/projects/${projectNumber}`;

    createSpinner.succeed(`Created GitHub Project #${projectNumber}: ${projectName}`);
    console.log(chalk.gray(`URL: ${projectUrl}\n`));

    // Configure the newly created project
    console.log(chalk.gray('Continuing with project configuration...\n'));

    // Set secrets
    execSync(`gh secret set PROJECT_URL --body "${projectUrl}"`, { stdio: 'pipe' });
    console.log(chalk.green('  ✓ Secrets configured\n'));

    // Update workflow
    const workflowPath = '.github/workflows/auto-add-to-project.yml';
    if (await fs.pathExists(workflowPath)) {
      const updatedWorkflow = `name: Auto Assign to Project

on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - name: Add to project
        uses: actions/add-to-project@v0.6.1
        with:
          project-url: \${{ secrets.PROJECT_URL }}
`;
      await fs.writeFile(workflowPath, updatedWorkflow);
      console.log(chalk.green('  ✓ Workflow configured\n'));
    }

    // Save to .env
    const envConfig = `# GitHub Projects Configuration
# Generated by LEO Workflow Kit

GITHUB_PROJECT_NUMBER=${projectNumber}
GITHUB_PROJECT_URL=${projectUrl}
GITHUB_PROJECT_OWNER=${owner}
GITHUB_PROJECT_OWNER_TYPE=${isOrgRepo ? 'org' : 'user'}
`;
    await fs.writeFile('.env', envConfig);
    console.log(chalk.green('  ✓ Configuration saved to .env\n'));

    console.log(chalk.green.bold('✅ GitHub Project created and configured!\n'));
    
    return { success: true, projectNumber, projectUrl };
  } catch (error) {
    createSpinner.fail('Failed to create project');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function testGitHubProject(options = {}) {
  console.log(chalk.cyan.bold('\n🧪 Testing GitHub Projects Integration\n'));

  // Check if .env exists
  const envPath = path.join(process.cwd(), '.env');
  if (!await fs.pathExists(envPath)) {
    console.log(chalk.yellow('⚠️  No .env file found. Run setup first:\n'));
    console.log(chalk.cyan('  leo github project setup\n'));
    process.exit(1);
  }

  // Read configuration
  const envContent = await fs.readFile(envPath, 'utf8');
  const projectNumberMatch = envContent.match(/GITHUB_PROJECT_NUMBER=(\d+)/);
  const projectUrlMatch = envContent.match(/GITHUB_PROJECT_URL=(.+)/);

  if (!projectNumberMatch || !projectUrlMatch) {
    console.log(chalk.red('❌ Invalid .env configuration\n'));
    process.exit(1);
  }

  const projectNumber = projectNumberMatch[1];
  const projectUrl = projectUrlMatch[1].trim();

  console.log(chalk.gray(`Project: #${projectNumber}`));
  console.log(chalk.gray(`URL: ${projectUrl}\n`));

  // Test 1: Check if PROJECT_URL secret exists
  const secretsSpinner = ora('Checking GitHub secrets...').start();
  
  try {
    const secretsList = execSync('gh secret list', { encoding: 'utf8' });
    
    if (secretsList.includes('PROJECT_URL')) {
      secretsSpinner.succeed('PROJECT_URL secret configured');
    } else {
      secretsSpinner.fail('PROJECT_URL secret not found');
      console.log(chalk.yellow('\n💡 Run setup again to configure secrets:\n'));
      console.log(chalk.cyan('  leo github project setup\n'));
      return;
    }
  } catch (error) {
    secretsSpinner.fail('Could not check secrets');
    console.error(chalk.red(error.message));
  }

  // Test 2: Check workflow file
  const workflowSpinner = ora('Checking workflow file...').start();
  
  const workflowPath = '.github/workflows/auto-add-to-project.yml';
  if (await fs.pathExists(workflowPath)) {
    const workflowContent = await fs.readFile(workflowPath, 'utf8');
    
    if (workflowContent.includes('PROJECT_URL') && workflowContent.includes('GITHUB_TOKEN')) {
      workflowSpinner.succeed('Workflow file configured correctly');
    } else {
      workflowSpinner.warn('Workflow file needs updates');
      console.log(chalk.yellow('\n💡 Run setup to update workflow:\n'));
      console.log(chalk.cyan('  leo github project setup\n'));
    }
  } else {
    workflowSpinner.fail('Workflow file not found');
    console.log(chalk.yellow('\n💡 Run leo init to install workflows\n'));
  }

  // Test 3: Check recent workflow runs
  const runsSpinner = ora('Checking recent workflow runs...').start();
  
  try {
    const runs = execSync('gh run list --workflow="Auto Assign to Project" --limit 5 --json status,conclusion,createdAt', {
      encoding: 'utf8'
    });

    const runsData = JSON.parse(runs);
    
    if (runsData.length === 0) {
      runsSpinner.info('No workflow runs yet (create an issue to test)');
    } else {
      const failedRuns = runsData.filter(r => r.conclusion === 'failure').length;
      const successRuns = runsData.filter(r => r.conclusion === 'success').length;
      
      if (failedRuns > 0) {
        runsSpinner.warn(`Found ${failedRuns} failed run(s), ${successRuns} successful`);
        console.log(chalk.yellow('\n💡 View failed runs with: gh run list --workflow="Auto Assign to Project"\n'));
      } else {
        runsSpinner.succeed(`All ${successRuns} recent run(s) successful!`);
      }
    }
  } catch (error) {
    runsSpinner.info('Could not check workflow runs');
  }

  console.log(chalk.green('\n✅ Integration test complete!\n'));
  console.log(chalk.cyan('Next steps:\n'));
  console.log(chalk.gray('  1. Create a test issue:'));
  console.log(chalk.cyan('     leo issue\n'));
  console.log(chalk.gray('  2. Check if it was added to the project:'));
  console.log(chalk.cyan(`     open ${projectUrl}\n`));
  console.log(chalk.gray('  3. View workflow run details:'));
  console.log(chalk.cyan('     gh run list --workflow="Auto Assign to Project"\n'));
}

module.exports = githubProjectCommand;
