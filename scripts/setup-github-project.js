#!/usr/bin/env node

/**
 * GitHub Projects v2 Auto-Setup Script
 * 
 * Automatically detects and configures GitHub Projects fields for LEO Workflow Kit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

async function setup() {
  console.log(chalk.cyan.bold('\n🔧 GitHub Projects v2 Auto-Setup\n'));

  // Check authentication
  const authSpinner = ora('Checking GitHub authentication...').start();
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    authSpinner.succeed('Authenticated with GitHub');
  } catch {
    authSpinner.fail('Not authenticated with GitHub');
    console.log(chalk.yellow('\n📝 Run: gh auth login -s project\n'));
    process.exit(1);
  }

  // Check project scope
  const scopeCheck = execSync('gh auth status 2>&1', { encoding: 'utf8' });
  if (!scopeCheck.includes('project')) {
    console.log(chalk.yellow('\n⚠️  Missing "project" scope for automation'));
    console.log(chalk.white('Run: gh auth refresh -s project\n'));
    
    const answer = await question('Refresh authentication now? (y/N): ');
    if (answer.toLowerCase() === 'y') {
      execSync('gh auth refresh -s project', { stdio: 'inherit' });
    } else {
      console.log(chalk.gray('\nYou can still use basic features without automation.\n'));
    }
  }

  // Get repository info
  const repoSpinner = ora('Getting repository information...').start();
  let owner, repo;
  try {
    const repoInfo = execSync('gh repo view --json owner,name', { encoding: 'utf8' });
    const parsed = JSON.parse(repoInfo);
    owner = parsed.owner.login;
    repo = parsed.name;
    repoSpinner.succeed(`Repository: ${owner}/${repo}`);
  } catch (error) {
    repoSpinner.fail('Failed to get repository info');
    console.log(chalk.red('Make sure you\'re in a GitHub repository directory\n'));
    process.exit(1);
  }

  // List projects
  const projectSpinner = ora('Scanning GitHub Projects...').start();
  let projects;
  try {
    const result = execSync(`gh project list --owner ${owner} --format json`, { encoding: 'utf8' });
    projects = JSON.parse(result).projects;
    
    if (!projects || projects.length === 0) {
      projectSpinner.warn('No projects found');
      console.log(chalk.yellow('\n📋 Create a project first:'));
      console.log(chalk.white('   https://github.com/users/' + owner + '/projects/new\n'));
      process.exit(0);
    }
    
    projectSpinner.succeed(`Found ${projects.length} project(s)`);
  } catch (error) {
    projectSpinner.fail('Failed to list projects');
    console.log(chalk.red(error.message));
    process.exit(1);
  }

  // Select project
  console.log(chalk.cyan('\n📊 Available Projects:\n'));
  projects.forEach((p, i) => {
    console.log(chalk.white(`  ${i + 1}. ${p.title} (#${p.number})`));
  });
  
  const projectIndex = await question('\nSelect project number (1-' + projects.length + '): ');
  const selectedProject = projects[parseInt(projectIndex) - 1];
  
  if (!selectedProject) {
    console.log(chalk.red('\nInvalid selection\n'));
    process.exit(1);
  }

  console.log(chalk.green(`\n✓ Selected: ${selectedProject.title} (#${selectedProject.number})\n`));

  // Get project fields
  const fieldsSpinner = ora('Fetching project fields...').start();
  let fields;
  try {
    const query = {
      query: `
        query {
          user(login: "${owner}") {
            projectV2(number: ${selectedProject.number}) {
              id
              fields(first: 20) {
                nodes {
                  ... on ProjectV2Field {
                    id
                    name
                    dataType
                  }
                  ... on ProjectV2SingleSelectField {
                    id
                    name
                    dataType
                    options {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `
    };
    
    // Write query to temp file to avoid PowerShell escaping issues
    const tempFile = path.join(process.cwd(), '.gh-query.json');
    fs.writeFileSync(tempFile, JSON.stringify(query));
    
    const result = execSync(`gh api graphql --input "${tempFile}"`, { encoding: 'utf8' });
    
    // Clean up temp file
    try { fs.unlinkSync(tempFile); } catch (e) {}
    const data = JSON.parse(result);
    fields = data.data.user.projectV2.fields.nodes;
    const projectId = data.data.user.projectV2.id;
    
    fieldsSpinner.succeed(`Found ${fields.length} field(s)`);
    
    // Display fields
    console.log(chalk.cyan('\n📝 Project Fields:\n'));
    fields.forEach(f => {
      console.log(chalk.white(`  - ${f.name} (${f.dataType})`));
      if (f.options) {
        f.options.forEach(opt => {
          console.log(chalk.gray(`    • ${opt.name}`));
        });
      }
    });

    // Map fields
    const config = {
      GH_PROJECT_NUMBER: selectedProject.number,
      GH_PROJECT_ID: projectId
    };

    // Find Status field
    const statusField = fields.find(f => f.name.toLowerCase() === 'status');
    if (statusField) {
      config.GH_PROJECT_FIELD_STATUS = statusField.id;
      const todoOpt = statusField.options?.find(o => o.name.toLowerCase().includes('todo'));
      const inProgressOpt = statusField.options?.find(o => o.name.toLowerCase().includes('progress'));
      const doneOpt = statusField.options?.find(o => o.name.toLowerCase().includes('done'));
      
      if (todoOpt) config.GH_PROJECT_OPTION_TODO = todoOpt.id;
      if (inProgressOpt) config.GH_PROJECT_OPTION_IN_PROGRESS = inProgressOpt.id;
      if (doneOpt) config.GH_PROJECT_OPTION_DONE = doneOpt.id;
    }

    // Find Priority field
    const priorityField = fields.find(f => f.name.toLowerCase() === 'priority');
    if (priorityField) {
      config.GH_PROJECT_FIELD_PRIORITY = priorityField.id;
    } else {
      console.log(chalk.yellow('\n⚠️  No "Priority" field found. Create one in project settings.'));
    }

    // Find Estimate field
    const estimateField = fields.find(f => 
      f.name.toLowerCase().includes('estimate') || 
      f.name.toLowerCase().includes('points')
    );
    if (estimateField) {
      config.GH_PROJECT_FIELD_ESTIMATE = estimateField.id;
    } else {
      console.log(chalk.yellow('⚠️  No "Estimate" field found. Create one in project settings.'));
    }

    // Save to .env
    const envPath = path.join(process.cwd(), '.env');
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';
    
    fs.writeFileSync(envPath, envContent);
    
    console.log(chalk.green('\n✅ Configuration saved to .env\n'));
    console.log(chalk.cyan('📄 Generated config:\n'));
    console.log(chalk.gray(envContent));

    // Test issue creation
    console.log(chalk.cyan('\n🧪 Test issue creation? (This will create a real issue)\n'));
    const testAnswer = await question('Create test issue? (y/N): ');
    
    if (testAnswer.toLowerCase() === 'y') {
      console.log(chalk.white('\nCreating test issue...\n'));
      execSync('node bin/cli.js issue --title "Test: GitHub Projects Integration" --type task --priority medium --estimate 1', { stdio: 'inherit' });
    }

    console.log(chalk.green('\n✨ Setup complete!\n'));
    console.log(chalk.white('You can now use:'));
    console.log(chalk.cyan('  leo issue --interactive'));
    console.log(chalk.cyan('  leo issue --title "New feature" --type enhancement --priority high --estimate 5\n'));

  } catch (error) {
    fieldsSpinner.fail('Failed to fetch fields');
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question(chalk.white(prompt), (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

// Run setup
setup().catch(error => {
  console.error(chalk.red('\n❌ Setup failed:'), error.message);
  process.exit(1);
});
