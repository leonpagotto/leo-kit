/**
 * LionPack Hunt Commands
 * Interactive CLI commands for hunt management
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const { HuntCycleTracker } = require('../lib/team/tracker');
const { ConfigurationManager } = require('../lib/team/config-manager');
const { AnalyticsEngine } = require('../lib/team/analytics');

/**
 * Hunt Commands Handler
 */
class HuntCommands {
  /**
   * Start a new hunt
   */
  static async start(options = {}) {
    console.log(chalk.cyan.bold('\n🦁 Starting New Hunt\n'));

    try {
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "lionpack team init" first.'));
        return;
      }

      // Get hunt details
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'featureName',
          message: 'Feature name:',
          validate: name => (name.length > 0 ? true : 'Feature name required')
        },
        {
          type: 'input',
          name: 'description',
          message: 'Feature description:',
          default: 'Add new feature'
        },
        {
          type: 'confirm',
          name: 'createIssues',
          message: 'Create GitHub issues for this hunt?',
          default: true
        }
      ]);

      // Start hunt
      const tracker = await HuntCycleTracker.load('.');
      const hunt = await tracker.startHunt(answers.featureName, answers.description);

      await tracker.save('.');

      console.log(chalk.green.bold('\n✅ Hunt started successfully!\n'));
      this._displayHuntStatus(hunt, config);

      // Display next steps
      console.log(chalk.cyan('📋 Next Steps:\n'));
      const firstColumn = config.workflow.columns[0];
      const assignee = config.workflow.memberMapping[firstColumn.id];
      console.log(chalk.dim(`   1. Assign to: @${assignee}`));
      console.log(chalk.dim(`   2. Add to column: ${firstColumn.name}`));
      console.log(chalk.dim(`   3. Track progress with: lionpack hunt status ${hunt.id}\n`));

      return hunt;
    } catch (error) {
      console.error(chalk.red.bold('❌ Error starting hunt:'), error.message);
      throw error;
    }
  }

  /**
   * Show hunt status
   */
  static async status(huntId, options = {}) {
    try {
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "lionpack team init" first.'));
        return;
      }

      const tracker = await HuntCycleTracker.load('.');

      if (!huntId) {
        // Show all active hunts
        const activeHunts = tracker.getActiveHunts();

        if (activeHunts.length === 0) {
          console.log(chalk.yellow('ℹ️  No active hunts\n'));
          return;
        }

        console.log(chalk.cyan.bold('\n📊 Active Hunts\n'));

        activeHunts.forEach((hunt, index) => {
          console.log(
            chalk.bold(`${index + 1}. ${hunt.featureName} (${hunt.id})`)
          );
          console.log(chalk.dim(`   Status: ${hunt.status}`));
          console.log(chalk.dim(`   Current phase: ${hunt.currentPhase}`));
          console.log(chalk.dim(`   Duration: ${hunt.getTotalDuration()} minutes\n`));
        });
      } else {
        // Show specific hunt
        const hunt = tracker.getHunt(huntId);

        if (!hunt) {
          console.error(chalk.red(`❌ Hunt not found: ${huntId}`));
          return;
        }

        this._displayHuntStatus(hunt, config);
      }
    } catch (error) {
      console.error(chalk.red.bold('❌ Error getting hunt status:'), error.message);
      throw error;
    }
  }

  /**
   * List all hunts
   */
  static async list(options = {}) {
    try {
      const tracker = await HuntCycleTracker.load('.');
      const allHunts = tracker._hunts || [];

      if (allHunts.length === 0) {
        console.log(chalk.yellow('ℹ️  No hunts found\n'));
        return;
      }

      console.log(chalk.cyan.bold('\n📊 All Hunts\n'));

      const completed = allHunts.filter(h => h.status === 'completed');
      const active = allHunts.filter(h => h.status === 'active');

      if (active.length > 0) {
        console.log(chalk.yellow('🔄 Active:\n'));
        active.forEach(hunt => {
          console.log(
            chalk.dim(`   ${hunt.featureName} (${hunt.id}) - Phase: ${hunt.currentPhase}`)
          );
        });
        console.log();
      }

      if (completed.length > 0) {
        console.log(chalk.green('✅ Completed:\n'));
        completed.forEach(hunt => {
          console.log(chalk.dim(`   ${hunt.featureName} (${hunt.id})`));
        });
        console.log();
      }
    } catch (error) {
      console.error(chalk.red.bold('❌ Error listing hunts:'), error.message);
      throw error;
    }
  }

  /**
   * Transition hunt to next phase
   */
  static async nextPhase(huntId, options = {}) {
    try {
      const manager = new ConfigurationManager('.');
      const config = await manager.load();

      if (!config) {
        console.error(chalk.red('❌ No LionPack configuration found. Run "lionpack team init" first.'));
        return;
      }

      const tracker = await HuntCycleTracker.load('.');
      const hunt = tracker.getHunt(huntId);

      if (!hunt) {
        console.error(chalk.red(`❌ Hunt not found: ${huntId}`));
        return;
      }

      // Get current and next phase
      const currentIndex = config.workflow.sequence.indexOf(hunt.currentPhase);
      if (currentIndex === -1 || currentIndex === config.workflow.sequence.length - 1) {
        console.error(chalk.red('❌ Hunt cannot transition further'));
        return;
      }

      const nextPhaseId = config.workflow.sequence[currentIndex + 1];
      const nextMember = config.workflow.memberMapping[nextPhaseId];

      // Transition hunt
      tracker.transitionHunt(huntId, nextPhaseId, nextMember);
      await tracker.save('.');

      console.log(chalk.green.bold('\n✅ Hunt transitioned!\n'));
      console.log(chalk.dim(`   Moving to: ${nextPhaseId}`));
      console.log(chalk.dim(`   Assigned to: @${nextMember}\n`));

      this._displayHuntStatus(hunt, config);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error transitioning hunt:'), error.message);
      throw error;
    }
  }

  /**
   * Complete hunt
   */
  static async complete(huntId, options = {}) {
    try {
      const tracker = await HuntCycleTracker.load('.');
      const hunt = tracker.getHunt(huntId);

      if (!hunt) {
        console.error(chalk.red(`❌ Hunt not found: ${huntId}`));
        return;
      }

      tracker.completeHunt(huntId);
      await tracker.save('.');

      console.log(chalk.green.bold('\n✅ Hunt completed!\n'));
      console.log(chalk.dim(`   ${hunt.featureName} finished`));
      console.log(chalk.dim(`   Total duration: ${hunt.getTotalDuration()} minutes\n`));
    } catch (error) {
      console.error(chalk.red.bold('❌ Error completing hunt:'), error.message);
      throw error;
    }
  }

  /**
   * Show hunt analytics
   */
  static async analytics(options = {}) {
    try {
      const engine = await AnalyticsEngine.load('LionPack', '.');

      if (!engine || engine.metrics.length === 0) {
        console.log(chalk.yellow('ℹ️  No hunt metrics available yet\n'));
        return;
      }

      const report = engine.generateTeamReport();
      const markdown = engine.formatReportAsMarkdown(report);

      console.log(chalk.cyan.bold('\n📊 Team Analytics\n'));
      console.log(markdown);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error getting analytics:'), error.message);
      throw error;
    }
  }

  /**
   * Display hunt status
   */
  static _displayHuntStatus(hunt, config) {
    const currentPhaseIndex = config.workflow.sequence.indexOf(hunt.currentPhase);
    const phasePercentage = Math.round(((currentPhaseIndex + 1) / config.workflow.sequence.length) * 100);

    console.log(chalk.cyan.bold('═══════════════════════════════════════════════'));
    console.log(chalk.cyan.bold(`  🦁 ${hunt.featureName}`));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

    console.log(chalk.bold('Hunt Details:\n'));
    console.log(chalk.dim(`   ID: ${hunt.id}`));
    console.log(chalk.dim(`   Status: ${hunt.status}`));
    console.log(chalk.dim(`   Current Phase: ${hunt.currentPhase}`));
    console.log(chalk.dim(`   Progress: ${phasePercentage}% (${currentPhaseIndex + 1}/${config.workflow.sequence.length})`));
    console.log(chalk.dim(`   Duration: ${hunt.getTotalDuration()} minutes\n`));

    // Phase timeline
    console.log(chalk.bold('Phase Timeline:\n'));
    config.workflow.sequence.forEach((phaseId, index) => {
      const isComplete = index < currentPhaseIndex;
      const isCurrent = index === currentPhaseIndex;
      const column = config.workflow.columns.find(c => c.id === phaseId);

      if (isComplete) {
        console.log(chalk.green(`   ✓ ${column.name}`));
      } else if (isCurrent) {
        console.log(chalk.yellow(`   ▶ ${column.name}`));
      } else {
        console.log(chalk.dim(`   ○ ${column.name}`));
      }
    });

    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════\n'));
  }
}

module.exports = {
  HuntCommands
};
