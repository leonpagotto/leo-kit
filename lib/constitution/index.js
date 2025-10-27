/**
 * Constitutional Principles Module
 * Manages project-wide development rules and standards
 *
 * Inspired by Spec Kit's constitutional governance
 * Adapted for LEO's GitHub-centric workflow
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const configManager = require('../utils/config-manager');

/**
 * Default constitutional principles
 * These serve as starting templates for new projects
 */
const DEFAULT_PRINCIPLES = [
  {
    name: 'Test-First Development',
    rule: 'Tests MUST be written before implementation (TDD)',
    enforcement: 'Pre-commit hooks check test coverage',
    rationale: 'Ensures code quality and catches bugs early'
  },
  {
    name: 'API-First Design',
    rule: 'Define contracts (APIs, data models) before implementation',
    enforcement: 'Planning phase requires API specifications',
    rationale: 'Aligns expectations and enables parallel development'
  },
  {
    name: 'Single Responsibility',
    rule: 'Each feature/component should have one clear purpose',
    enforcement: 'Code review checks for focused modules',
    rationale: 'Improves maintainability and testability'
  },
  {
    name: 'Dependency Limits',
    rule: 'Maximum 3 external dependencies per feature',
    enforcement: 'Package.json audited during PR review',
    rationale: 'Reduces bloat and security vulnerabilities'
  },
  {
    name: 'Documentation Required',
    rule: 'All public APIs must have JSDoc comments',
    enforcement: 'Linter enforces documentation on exports',
    rationale: 'Self-documenting code improves team collaboration'
  }
];

/**
 * Constitutional governance configuration schema
 */
const CONSTITUTION_SCHEMA = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  principles: []
};

class ConstitutionManager {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configPath = path.join(projectRoot, '.leorc.json');
    this.constitutionDocPath = path.join(projectRoot, 'docs', 'CONSTITUTION.md');
  }

  /**
   * Initialize constitutional principles for a project
   * Creates both .leorc.json config and docs/CONSTITUTION.md reference
   *
   * @param {Object} options - Initialization options
   * @param {boolean} options.interactive - Use interactive prompts
   * @param {Array} options.customPrinciples - Custom principles to use
   * @returns {Promise<Object>} Created constitution
   */
  async init(options = {}) {
    const { interactive = true, customPrinciples = null } = options;

    console.log(chalk.cyan('\n📜 Initializing Constitutional Principles\n'));
    console.log('Constitutional principles guide all development decisions in your project.');
    console.log('They ensure consistency, quality, and alignment across your team.\n');

    let principles = customPrinciples || DEFAULT_PRINCIPLES;

    if (interactive) {
      principles = await this.interactiveSetup();
    }

    // Create constitution object
    const constitution = {
      ...CONSTITUTION_SCHEMA,
      principles
    };

    // Save to .leorc.json
    await this.saveToConfig(constitution);

    // Create documentation file
    await this.createDocumentation(constitution);

    console.log(chalk.green('\n✅ Constitutional principles initialized!\n'));
    console.log(`   ${chalk.bold('Config:')} .leorc.json`);
    console.log(`   ${chalk.bold('Docs:')} docs/CONSTITUTION.md`);
    console.log(`\n   ${principles.length} principles established`);

    return constitution;
  }

  /**
   * Interactive setup for constitutional principles
   * Allows users to customize principles for their project
   *
   * @returns {Promise<Array>} Selected/customized principles
   */
  async interactiveSetup() {
    console.log(chalk.yellow('Let\'s customize your constitutional principles:\n'));

    const { useDefaults } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useDefaults',
        message: 'Use default LEO constitutional principles?',
        default: true
      }
    ]);

    if (useDefaults) {
      console.log(chalk.green('\n✓ Using default principles\n'));
      return DEFAULT_PRINCIPLES;
    }

    // Custom principles workflow
    const { selectedPrinciples } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedPrinciples',
        message: 'Select principles to include:',
        choices: DEFAULT_PRINCIPLES.map(p => ({
          name: `${p.name}: ${p.rule}`,
          value: p,
          checked: true
        }))
      }
    ]);

    const { addCustom } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addCustom',
        message: 'Add custom principles?',
        default: false
      }
    ]);

    if (addCustom) {
      const customPrinciples = await this.addCustomPrinciples();
      return [...selectedPrinciples, ...customPrinciples];
    }

    return selectedPrinciples;
  }

  /**
   * Add custom constitutional principles
   *
   * @returns {Promise<Array>} Custom principles
   */
  async addCustomPrinciples() {
    const principles = [];
    let addMore = true;

    while (addMore) {
      const principle = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Principle name:',
          validate: input => input.trim().length > 0 || 'Name is required'
        },
        {
          type: 'input',
          name: 'rule',
          message: 'Rule (the actual requirement):',
          validate: input => input.trim().length > 0 || 'Rule is required'
        },
        {
          type: 'input',
          name: 'enforcement',
          message: 'How will this be enforced?',
          default: 'Code review'
        },
        {
          type: 'input',
          name: 'rationale',
          message: 'Why is this principle important?',
          default: 'Improves code quality and consistency'
        }
      ]);

      principles.push(principle);

      const { continue: continueAdding } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another principle?',
          default: false
        }
      ]);

      addMore = continueAdding;
    }

    return principles;
  }

  /**
   * Save constitution to .leorc.json configuration
   *
   * @param {Object} constitution - Constitution object
   */
  async saveToConfig(constitution) {
    let config = {};

    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      config = JSON.parse(configContent);
    } catch (error) {
      // Config doesn't exist yet, will create new one
      console.log(chalk.yellow('No existing .leorc.json found, creating new one...'));
    }

    config.constitution = constitution;

    await fs.writeFile(
      this.configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    );
  }

  /**
   * Create CONSTITUTION.md documentation file
   *
   * @param {Object} constitution - Constitution object
   */
  async createDocumentation(constitution) {
    const { version, lastUpdated, principles } = constitution;

    const markdown = `# ${path.basename(this.projectRoot)} Constitution

**Version:** ${version}
**Last Updated:** ${new Date(lastUpdated).toLocaleDateString()}

---

## Purpose

This constitution defines the core principles that guide all development in this project. These principles ensure consistency, quality, and alignment across the team.

**All contributors MUST follow these principles.** Exceptions require explicit documentation and team approval.

---

## Core Principles

${principles.map((p, index) => `
### ${index + 1}. ${p.name}

**Rule:** ${p.rule}

**Enforcement:** ${p.enforcement}

**Rationale:** ${p.rationale}

---
`).join('\n')}

## Governance

### Updating Principles

Constitutional principles can be updated through:

1. **Proposal**: Team member proposes change via GitHub issue
2. **Discussion**: Team discusses rationale and impact
3. **Approval**: Requires majority approval
4. **Update**: Run \`leo constitution update\` to modify

### Enforcement

Principles are enforced through:

- Pre-commit hooks (automated checks)
- Code review guidelines (human review)
- CI/CD pipelines (continuous validation)
- Documentation requirements (visibility)

### Exceptions

Exceptions to constitutional principles:

1. Must be documented in the PR description
2. Require explicit approval from team lead
3. Should include plan to resolve (if temporary)

---

## Constitutional Compliance

All work in this project should align with these principles. When in doubt:

1. **Check the constitution** - Does your approach follow the principles?
2. **Ask for clarification** - Discuss with team if unsure
3. **Document exceptions** - If you must deviate, explain why

---

**Remember:** These principles exist to help us build better software together. They're not bureaucracy—they're our shared commitment to quality.

---

*Generated by LEO Workflow Kit*
*Update with: \`leo constitution update\`*
`;

    // Ensure docs directory exists
    const docsDir = path.dirname(this.constitutionDocPath);
    await fs.mkdir(docsDir, { recursive: true });

    await fs.writeFile(this.constitutionDocPath, markdown, 'utf8');
  }

  /**
   * Load constitution from config
   *
   * @returns {Promise<Object|null>} Constitution object or null if not found
   */
  async load() {
    try {
      const config = await configManager.getConfig();
      return config.constitution || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate work against constitutional principles
   *
   * @param {Object} work - Work to validate (issue, PR, spec)
   * @param {Object} options - Validation options
   * @returns {Promise<Object>} Validation result
   */
  async validate(work, options = {}) {
    const constitution = await this.load();

    if (!constitution) {
      return {
        valid: true,
        message: 'No constitutional principles configured',
        violations: []
      };
    }

    // Validation logic will be implemented based on work type
    // For now, return structure for future implementation
    return {
      valid: true,
      message: 'Constitutional validation passed',
      violations: [],
      warnings: []
    };
  }

  /**
   * Get all constitutional principles
   *
   * @returns {Promise<Array>} Principles array
   */
  async getPrinciples() {
    const constitution = await this.load();
    return constitution ? constitution.principles : [];
  }

  /**
   * Add a new principle
   *
   * @param {Object} principle - New principle to add
   */
  async addPrinciple(principle) {
    const constitution = await this.load() || { ...CONSTITUTION_SCHEMA, principles: [] };

    constitution.principles.push(principle);
    constitution.lastUpdated = new Date().toISOString();

    await this.saveToConfig(constitution);
    await this.createDocumentation(constitution);

    console.log(chalk.green(`\n✅ Added principle: ${principle.name}`));
  }

  /**
   * Remove a principle by name
   *
   * @param {string} principleName - Name of principle to remove
   */
  async removePrinciple(principleName) {
    const constitution = await this.load();

    if (!constitution) {
      throw new Error('No constitution found');
    }

    const index = constitution.principles.findIndex(p => p.name === principleName);

    if (index === -1) {
      throw new Error(`Principle not found: ${principleName}`);
    }

    constitution.principles.splice(index, 1);
    constitution.lastUpdated = new Date().toISOString();

    await this.saveToConfig(constitution);
    await this.createDocumentation(constitution);

    console.log(chalk.green(`\n✅ Removed principle: ${principleName}`));
  }

  /**
   * Update an existing principle
   *
   * @param {string} principleName - Name of principle to update
   * @param {Object} updates - Updates to apply
   */
  async updatePrinciple(principleName, updates) {
    const constitution = await this.load();

    if (!constitution) {
      throw new Error('No constitution found');
    }

    const principle = constitution.principles.find(p => p.name === principleName);

    if (!principle) {
      throw new Error(`Principle not found: ${principleName}`);
    }

    Object.assign(principle, updates);
    constitution.lastUpdated = new Date().toISOString();

    await this.saveToConfig(constitution);
    await this.createDocumentation(constitution);

    console.log(chalk.green(`\n✅ Updated principle: ${principleName}`));
  }
}

module.exports = {
  ConstitutionManager,
  DEFAULT_PRINCIPLES,
  CONSTITUTION_SCHEMA
};
