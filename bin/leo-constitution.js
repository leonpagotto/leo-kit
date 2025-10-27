/**
 * Constitution Command
 * Manages project constitutional principles
 * 
 * Commands:
 *   leo constitution init       - Initialize constitutional principles
 *   leo constitution show       - Display current principles
 *   leo constitution add        - Add a new principle
 *   leo constitution remove     - Remove a principle
 *   leo constitution update     - Update a principle
 */

const { Command } = require('commander');
const chalk = require('chalk');
const { ConstitutionManager } = require('../lib/constitution');

const program = new Command();

program
  .name('leo constitution')
  .description('Manage project constitutional principles')
  .version('1.0.0');

// leo constitution init
program
  .command('init')
  .description('Initialize constitutional principles for your project')
  .option('-n, --non-interactive', 'Use default principles without prompts')
  .option('-f, --force', 'Overwrite existing constitution')
  .action(async (options) => {
    try {
      const manager = new ConstitutionManager();

      // Check if constitution already exists
      const existing = await manager.load();

      if (existing && !options.force) {
        console.log(chalk.yellow('\n⚠️  Constitutional principles already exist'));
        console.log(chalk.gray('   Use --force to overwrite\n'));
        console.log('   View with: ' + chalk.cyan('leo constitution show'));
        console.log('   Update with: ' + chalk.cyan('leo constitution update'));
        return;
      }

      await manager.init({
        interactive: !options.nonInteractive
      });

      console.log(chalk.green('\n🎉 Next steps:'));
      console.log(`   1. Review: ${chalk.cyan('docs/CONSTITUTION.md')}`);
      console.log(`   2. Share with team for feedback`);
      console.log(`   3. Start using: ${chalk.cyan('leo spec new')}`);
      console.log('');
    } catch (error) {
      console.error(chalk.red('\n❌ Error initializing constitution:'), error.message);
      process.exit(1);
    }
  });

// leo constitution show
program
  .command('show')
  .description('Display current constitutional principles')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      const manager = new ConstitutionManager();
      const constitution = await manager.load();

      if (!constitution) {
        console.log(chalk.yellow('\n⚠️  No constitutional principles found'));
        console.log(chalk.gray('   Initialize with: ') + chalk.cyan('leo constitution init\n'));
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(constitution, null, 2));
        return;
      }

      console.log(chalk.cyan.bold('\n📜 Constitutional Principles\n'));
      console.log(chalk.gray(`Version: ${constitution.version}`));
      console.log(chalk.gray(`Last Updated: ${new Date(constitution.lastUpdated).toLocaleDateString()}`));
      console.log('');

      constitution.principles.forEach((p, index) => {
        console.log(chalk.bold(`${index + 1}. ${p.name}`));
        console.log(chalk.gray(`   Rule: ${p.rule}`));
        console.log(chalk.gray(`   Enforcement: ${p.enforcement}`));
        console.log(chalk.gray(`   Rationale: ${p.rationale}`));
        console.log('');
      });

      console.log(chalk.gray(`Total: ${constitution.principles.length} principles\n`));
    } catch (error) {
      console.error(chalk.red('\n❌ Error loading constitution:'), error.message);
      process.exit(1);
    }
  });

// leo constitution add
program
  .command('add')
  .description('Add a new constitutional principle')
  .option('-n, --name <name>', 'Principle name')
  .option('-r, --rule <rule>', 'Principle rule')
  .option('-e, --enforcement <enforcement>', 'How it will be enforced')
  .option('--rationale <rationale>', 'Why this principle matters')
  .action(async (options) => {
    try {
      const manager = new ConstitutionManager();

      // If no options provided, use interactive mode
      if (!options.name || !options.rule) {
        const customPrinciples = await manager.addCustomPrinciples();
        
        for (const principle of customPrinciples) {
          await manager.addPrinciple(principle);
        }

        console.log(chalk.green(`\n✅ Added ${customPrinciples.length} principle(s)\n`));
        return;
      }

      const principle = {
        name: options.name,
        rule: options.rule,
        enforcement: options.enforcement || 'Code review',
        rationale: options.rationale || 'Improves code quality'
      };

      await manager.addPrinciple(principle);
    } catch (error) {
      console.error(chalk.red('\n❌ Error adding principle:'), error.message);
      process.exit(1);
    }
  });

// leo constitution remove
program
  .command('remove <name>')
  .description('Remove a constitutional principle')
  .alias('rm')
  .action(async (name) => {
    try {
      const manager = new ConstitutionManager();
      await manager.removePrinciple(name);
    } catch (error) {
      console.error(chalk.red('\n❌ Error removing principle:'), error.message);
      process.exit(1);
    }
  });

// leo constitution update
program
  .command('update <name>')
  .description('Update a constitutional principle')
  .option('-r, --rule <rule>', 'New rule')
  .option('-e, --enforcement <enforcement>', 'New enforcement method')
  .option('--rationale <rationale>', 'New rationale')
  .action(async (name, options) => {
    try {
      const manager = new ConstitutionManager();

      const updates = {};
      if (options.rule) updates.rule = options.rule;
      if (options.enforcement) updates.enforcement = options.enforcement;
      if (options.rationale) updates.rationale = options.rationale;

      if (Object.keys(updates).length === 0) {
        console.log(chalk.yellow('\n⚠️  No updates provided'));
        console.log(chalk.gray('   Use --rule, --enforcement, or --rationale flags\n'));
        return;
      }

      await manager.updatePrinciple(name, updates);
    } catch (error) {
      console.error(chalk.red('\n❌ Error updating principle:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
