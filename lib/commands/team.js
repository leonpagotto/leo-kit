/**
 * LionPack Team Commands
 * Interactive CLI commands for team setup and management
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const { ConfigurationManager } = require('../team/config-manager');
const { RoleManager } = require('../team/roles');
const { WorkflowMode } = require('../team/workflow-modes');
const { GitHubProjectBuilder } = require('../team/github-project-builder');
const GitHubAuth = require('../team/github-auth');
const GitHubAPI = require('../team/github-api');

/**
 * Team Commands Handler
 */
class TeamCommands {
  /**
   * Initialize new LionPack team
   */
  static async init(options = {}) {
    console.log(chalk.cyan.bold('\n🦁 LionPack Team Initialization\n'));

    try {
      // Get project details
      const projectAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project name:',
          default: 'My Awesome Project'
        },
        {
          type: 'input',
          name: 'org',
          message: 'GitHub organization:',
          default: 'my-org'
        },
        {
          type: 'input',
          name: 'repo',
          message: 'GitHub repository:',
          default: 'my-repo'
        },
        {
          type: 'list',
          name: 'teamSize',
          message: 'Team size:',
          choices: [
            { name: '👤 Solo (1 person)', value: 1 },
            { name: '👥 Duo (2 people)', value: 2 },
            { name: '👥 Trio (3 people)', value: 3 },
            { name: '🦁 Pack (4 people)', value: 4 }
          ]
        }
      ]);

      const teamSize = projectAnswers.teamSize;
      console.log(
        chalk.yellow(`\nSetting up ${['Solo', 'Duo', 'Trio', 'Pack'][teamSize - 1]} mode...\n`)
      );

      // Get team members
      const members = [];
      const roles = RoleManager.getSequence();

      for (let i = 0; i < teamSize; i++) {
        const memberAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'username',
            message: `Member ${i + 1}/${teamSize} GitHub username:`,
            validate: username => (username.length > 0 ? true : 'Username required')
          },
          {
            type: 'list',
            name: 'role',
            message: `${members[i - 1]?.username || `Member ${i + 1}`}'s role:`,
            choices: roles
              .filter(roleId => !members.find(m => m.role === roleId))
              .map(roleId => {
                const role = RoleManager.getRole(roleId);
                return {
                  name: `${role.emoji} ${role.name}`,
                  value: roleId
                };
              })
          }
        ]);

        members.push({
          username: memberAnswers.username,
          role: memberAnswers.role
        });
      }

      // Initialize configuration
      const manager = new ConfigurationManager('.');
      await manager.initialize({
        name: projectAnswers.name,
        org: projectAnswers.org,
        repo: projectAnswers.repo,
        teamSize,
        members
      });

      // Display success
      console.log(chalk.green.bold('\n✅ Team initialized successfully!\n'));
      this._displayTeamSummary(manager);

      // Offer to create GitHub board
      const setupBoardAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'setupBoard',
          message: 'Setup GitHub project board now?',
          default: true
        }
      ]);

      if (setupBoardAnswers.setupBoard) {
        await this.setupBoard(projectAnswers.org, projectAnswers.repo, teamSize, members);
      }

      return manager.getConfig();
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error initializing team:'), error.message);
      throw error;
    }
  }

  /**
   * Add team member
   */
  static async add(options = {}) {
    try {
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "lionpack team init" first.'));
        return;
      }

      const currentTeamSize = manager.getMembers().length;
      if (currentTeamSize >= 4) {
        console.error(chalk.red('❌ Maximum team size is 4 members'));
        return;
      }

      const availableRoles = RoleManager.getSequence().filter(
        roleId => !manager.getMemberByRole(roleId)
      );

      if (availableRoles.length === 0) {
        console.error(chalk.red('❌ All roles are already assigned'));
        return;
      }

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'New member GitHub username:',
          validate: username => (username.length > 0 ? true : 'Username required')
        },
        {
          type: 'list',
          name: 'role',
          message: 'New member role:',
          choices: availableRoles.map(roleId => {
            const role = RoleManager.getRole(roleId);
            return {
              name: `${role.emoji} ${role.name}`,
              value: roleId
            };
          })
        }
      ]);

      await manager.addMember(answers.username, answers.role);

      console.log(chalk.green.bold('\n✅ Member added successfully!\n'));
      this._displayTeamSummary(manager);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error adding member:'), error.message);
      throw error;
    }
  }

  /**
   * List team members and workflow
   */
  static async list() {
    try {
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "lionpack team init" first.'));
        return;
      }

      this._displayTeamSummary(manager);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error listing team:'), error.message);
      throw error;
    }
  }

  /**
   * Setup GitHub project board
   */
  static async setupBoard(org, repo, teamSize, members) {
    try {
      console.log(chalk.cyan.bold('\n📊 Setting up GitHub Project Board...\n'));

      const builder = new GitHubProjectBuilder(org, repo, teamSize);

      // Save configuration
      await builder.saveConfiguration('.', members);

      // Display instructions
      const instructions = WorkflowMode.getGitHubSetupInstructions(teamSize, members);

      console.log(chalk.green('✅ Project board files created:\n'));
      console.log(chalk.dim('  .lionpack/board.json - Board configuration'));
      console.log(chalk.dim('  .lionpack/setup-board.sh - Setup script'));
      console.log(chalk.dim('  LIONPACK_BOARD.md - Board documentation\n'));

      console.log(chalk.yellow('📋 Setup Instructions:\n'));
      instructions.setup.forEach(line => {
        console.log(chalk.dim(line));
      });

      console.log(
        chalk.cyan(`\n🔗 To create the board, run: bash .lionpack/setup-board.sh\n`)
      );

      return instructions;
    } catch (error) {
      console.error(chalk.red.bold('❌ Error setting up board:'), error.message);
      throw error;
    }
  }

  /**
   * Setup GitHub project board with real API
   * Connects to GitHub and creates project board
   */
  static async setupGitHub(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🔗 GitHub Integration Setup\n'));

      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "leo team init" first.'));
        return;
      }

      // Get GitHub token
      let token = null;
      const tokenAnswers = await inquirer.prompt([
        {
          type: 'password',
          name: 'token',
          message: 'GitHub Personal Access Token (PAT):',
          mask: '*',
          validate: token => (token.length > 0 ? true : 'Token required')
        }
      ]);

      token = tokenAnswers.token;

      // Save token
      try {
        GitHubAuth.saveToken(token);
        console.log(chalk.green('✅ Token saved securely'));
      } catch (error) {
        console.error(chalk.red('❌ Failed to save token:'), error.message);
        return;
      }

      // Validate token
      console.log(chalk.dim('Validating token...\n'));
      const auth = new GitHubAuth(token);

      let user;
      try {
        user = await auth.validateToken();
        console.log(chalk.green(`✅ Authenticated as @${user.login}\n`));
      } catch (error) {
        console.error(chalk.red('❌ Token validation failed:'), error.message);
        GitHubAuth.deleteToken();
        return;
      }

      // Create project board
      console.log(chalk.dim('Creating GitHub project board...\n'));

      const api = new GitHubAPI(auth);
      const boardName = `${config.name}-hunts`;
      const columns = WorkflowMode.getColumns(config.teamSize).map(col => col.name);

      let project;
      try {
        project = await api.createProjectBoard(boardName, columns);
        console.log(chalk.green(`✅ Project board created: ${boardName}\n`));
      } catch (error) {
        console.error(chalk.red('❌ Failed to create project board:'), error.message);
        return;
      }

      // Save GitHub config
      config.github = {
        enabled: true,
        token: 'stored-in-.lionpack',
        projectId: project.id,
        projectName: project.name,
        columns: project.columns.map(col => ({
          id: col.id,
          name: col.name
        })),
        setupDate: new Date().toISOString()
      };

      await manager.save(config);
      console.log(chalk.green('✅ Configuration saved\n'));

      // Display summary
      console.log(chalk.cyan.bold('═══════════════════════════════════════════════'));
      console.log(chalk.cyan.bold('  ✨ GitHub Integration Ready!'));
      console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

      console.log(chalk.dim(`Board Name: ${boardName}`));
      console.log(chalk.dim(`Columns: ${columns.join(' → ')}`));
      console.log(chalk.dim(`Owner: @${user.login}\n`));

      console.log(chalk.yellow('📋 Next steps:\n'));
      console.log(chalk.dim('   1. Create hunts with: leo hunt start'));
      console.log(chalk.dim('   2. Hunts will auto-create GitHub issues'));
      console.log(chalk.dim('   3. Phase transitions will update the board\n'));

      console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

      return project;
    } catch (error) {
      console.error(chalk.red.bold('❌ Error setting up GitHub:'), error.message);
      throw error;
    }
  }

  /**
   * Check GitHub connection status
   */
  static async checkGitHub(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🔗 Checking GitHub Connection\n'));

      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config || !config.github?.enabled) {
        console.log(chalk.yellow('⚠️  GitHub integration not configured'));
        console.log(chalk.dim('Run: leo team setupGitHub\n'));
        return;
      }

      // Try to load token and validate
      try {
        const token = GitHubAuth.loadToken();
        const auth = new GitHubAuth(token);
        const user = await auth.validateToken();

        console.log(chalk.green('✅ GitHub connection active\n'));
        console.log(chalk.dim(`Authenticated as: @${user.login}`));
        console.log(chalk.dim(`Project: ${config.github.projectName}`));
        console.log(chalk.dim(`Rate limit: ${auth.getRateLimit().remaining} remaining\n`));
      } catch (error) {
        console.log(chalk.red('❌ GitHub connection failed\n'));
        console.log(chalk.dim(`Error: ${error.message}\n`));
        console.log(chalk.yellow('💡 Solution: Run leo team setupGitHub\n'));
      }
    } catch (error) {
      console.error(chalk.red.bold('❌ Error checking GitHub:'), error.message);
      throw error;
    }
  }

  /**
   * Disconnect GitHub integration
   */
  static async disconnectGitHub(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🔗 Disconnect GitHub\n'));

      const confirmAnswers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure? This will remove GitHub integration.',
          default: false
        }
      ]);

      if (!confirmAnswers.confirm) {
        console.log(chalk.yellow('Cancelled\n'));
        return;
      }

      // Delete token
      GitHubAuth.deleteToken();

      // Update config
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (config) {
        config.github = {
          enabled: false,
          disconnectedDate: new Date().toISOString()
        };
        await manager.save(config);
      }

      console.log(chalk.green('✅ GitHub integration disconnected\n'));
    } catch (error) {
      console.error(chalk.red.bold('❌ Error disconnecting GitHub:'), error.message);
      throw error;
    }
  }

  /**
   * Display team summary
   */
  static _displayTeamSummary(manager) {
    const config = manager.getConfig();
    const members = manager.getMembers();
    const recommendations = manager.getRecommendations();

    console.log(chalk.cyan.bold('═══════════════════════════════════════════════'));
    console.log(chalk.cyan.bold(`  🦁 ${config.name} - ${config.mode.toUpperCase()} Mode`));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

    // Team composition
    console.log(chalk.bold('👥 Team Members:\n'));
    members.forEach(member => {
      const role = RoleManager.getRole(member.role);
      console.log(chalk.dim(`   ${role.emoji} @${member.username} - ${role.name}`));
    });

    // Workflow
    console.log(chalk.bold('\n📊 Workflow Columns:\n'));
    const columns = WorkflowMode.getColumns(config.teamSize);
    const mapping = WorkflowMode.mapMembersToColumns(config.teamSize, members);

    columns.forEach((col, index) => {
      const assignee = mapping[col.id] || 'Unassigned';
      console.log(chalk.dim(`   ${index + 1}. ${col.name} → @${assignee}`));
    });

    // Recommendations
    if (recommendations.recommendations.length > 0) {
      console.log(chalk.bold('\n💡 Recommendations:\n'));
      recommendations.recommendations.forEach(rec => {
        console.log(chalk.dim(`   • ${rec}`));
      });
    }

    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════\n'));
  }
}

module.exports = {
  TeamCommands
};
