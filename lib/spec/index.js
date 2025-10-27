/**
 * Spec Management - Structured issue creation and management
 *
 * Part of Phase 1: Spec Kit Integration
 * This module provides the "spec-first" workflow inspired by GitHub's Spec Kit
 * but adapted for LEO's GitHub-centric approach.
 *
 * Key Features:
 * - Structured GitHub issue templates for specs
 * - AI-powered description parsing
 * - Auto-populated sections (Context, Requirements, User Stories, Acceptance Criteria)
 * - Integration with constitutional principles
 * - Label management (spec, needs-planning, needs-clarification)
 *
 * @module lib/spec
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

/**
 * Spec issue template sections
 * Follows a structured format for clear requirements gathering
 */
const SPEC_TEMPLATE = {
  sections: [
    {
      name: 'Context',
      description: 'What problem are we solving? Why is this needed?',
      placeholder: 'Describe the background and motivation for this feature...',
      required: true
    },
    {
      name: 'Requirements',
      description: 'What must this feature do?',
      placeholder: '- [ ] Functional requirement 1\n- [ ] Functional requirement 2\n- [ ] Non-functional requirement 1',
      required: true
    },
    {
      name: 'User Stories',
      description: 'Who benefits and how?',
      placeholder: '- As a [user type], I want to [action] so that [benefit]\n- As a [user type], I want to [action] so that [benefit]',
      required: false
    },
    {
      name: 'Acceptance Criteria',
      description: 'How do we know it\'s done?',
      placeholder: '- [ ] Given [context] when [action] then [outcome]\n- [ ] Given [context] when [action] then [outcome]',
      required: true
    },
    {
      name: 'Technical Approach',
      description: 'Initial technical ideas (optional, can be added during planning)',
      placeholder: '- Architecture considerations\n- Tech stack choices\n- Data model ideas\n- API contracts',
      required: false
    },
    {
      name: 'Dependencies',
      description: 'What else needs to be done first?',
      placeholder: '- Blocking issue: #123\n- Related issue: #456\n- External dependency: X',
      required: false
    },
    {
      name: 'Success Metrics',
      description: 'How will we measure success?',
      placeholder: '- Performance: < 200ms response time\n- Coverage: > 80% test coverage\n- User satisfaction: > 4.5/5 rating',
      required: false
    }
  ],

  labels: {
    default: ['spec', 'needs-planning'],
    priority: {
      high: 'priority: high',
      medium: 'priority: medium',
      low: 'priority: low'
    },
    type: {
      feature: 'type: feature',
      bug: 'type: bug',
      refactor: 'type: refactor',
      docs: 'type: docs'
    }
  }
};

/**
 * SpecManager - Main class for spec creation and management
 */
class SpecManager {
  constructor() {
    this.template = SPEC_TEMPLATE;
  }

  /**
   * Create a new spec issue from a description
   *
   * @param {string} description - Brief description of the feature/work
   * @param {Object} options - Creation options
   * @param {boolean} options.interactive - Use interactive prompts for sections
   * @param {string} options.priority - Priority level (high, medium, low)
   * @param {string} options.type - Issue type (feature, bug, refactor, docs)
   * @param {boolean} options.autoPopulate - Use AI to auto-populate sections from description
   * @returns {Promise<Object>} Created issue details (number, url)
   */
  async create(description, options = {}) {
    console.log(chalk.blue('📝 Creating new spec issue...'));

    const {
      interactive = true,
      priority = 'medium',
      type = 'feature',
      autoPopulate = true
    } = options;

    // Step 1: Generate spec content
    let specContent;
    if (interactive) {
      specContent = await this._interactiveSpecCreation(description);
    } else if (autoPopulate) {
      specContent = await this._autoPopulateSpec(description);
    } else {
      specContent = this._defaultSpecContent(description);
    }

    // Step 2: Validate against constitutional principles (if available)
    await this._validateAgainstPrinciples(specContent);

    // Step 3: Format as GitHub issue body
    const issueBody = this._formatIssueBody(specContent);

    // Step 4: Determine labels
    const labels = this._determineLabels(priority, type);

    // Step 5: Create GitHub issue
    const issue = await this._createGitHubIssue(description, issueBody, labels);

    console.log(chalk.green(`\n✅ Spec issue created: #${issue.number}`));
    console.log(chalk.gray(`   URL: ${issue.url}`));
    console.log(chalk.gray(`   Labels: ${labels.join(', ')}`));

    return issue;
  }

  /**
   * Interactive spec creation with prompts
   */
  async _interactiveSpecCreation(description) {
    console.log(chalk.cyan('\n📋 Let\'s create a structured spec...\n'));

    const spec = { title: description, sections: {} };

    for (const section of this.template.sections) {
      if (!section.required) {
        const { includeSection } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'includeSection',
            message: `Include "${section.name}" section?`,
            default: true
          }
        ]);

        if (!includeSection) continue;
      }

      const { content } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'content',
          message: `${section.name}: ${section.description}`,
          default: section.placeholder,
          waitUserInput: false
        }
      ]);

      spec.sections[section.name] = content.trim();
    }

    return spec;
  }

  /**
   * Auto-populate spec sections from description using AI/heuristics
   *
   * In a full implementation, this would use AI (GPT-4, Claude, etc.)
   * to analyze the description and generate structured sections.
   *
   * For now, we use intelligent defaults and keyword extraction.
   */
  async _autoPopulateSpec(description) {
    console.log(chalk.cyan('🤖 Auto-populating spec sections from description...'));

    const spec = { title: description, sections: {} };

    // Context - Extract from description
    spec.sections['Context'] = this._extractContext(description);

    // Requirements - Convert description to requirements
    spec.sections['Requirements'] = this._extractRequirements(description);

    // User Stories - Generate user stories
    spec.sections['User Stories'] = this._generateUserStories(description);

    // Acceptance Criteria - Generate acceptance criteria
    spec.sections['Acceptance Criteria'] = this._generateAcceptanceCriteria(description);

    // Optional sections - only if keywords detected
    if (this._hasArchitectureKeywords(description)) {
      spec.sections['Technical Approach'] = this._extractTechnicalApproach(description);
    }

    if (this._hasDependencyKeywords(description)) {
      spec.sections['Dependencies'] = this._extractDependencies(description);
    }

    console.log(chalk.green('✅ Spec sections auto-populated\n'));

    return spec;
  }

  /**
   * Default spec content (minimal)
   */
  _defaultSpecContent(description) {
    return {
      title: description,
      sections: {
        'Context': `This feature will ${description.toLowerCase()}`,
        'Requirements': '- [ ] To be defined',
        'Acceptance Criteria': '- [ ] Feature works as described\n- [ ] Tests pass\n- [ ] Documentation updated'
      }
    };
  }

  /**
   * Extract context from description
   */
  _extractContext(description) {
    // Simple heuristic: use description as context
    // In production, use AI to expand context
    const contextIntro = 'We need to ';
    const context = description.toLowerCase().startsWith('add')
      ? description.replace(/^add/i, 'We need to add')
      : `${contextIntro}${description.toLowerCase()}`;

    return context + '\n\nThis will improve the system by providing [benefit].';
  }

  /**
   * Extract requirements from description
   */
  _extractRequirements(description) {
    // Convert description to requirement format
    const mainRequirement = `- [ ] ${description}`;

    return `${mainRequirement}
- [ ] Error handling implemented
- [ ] Tests added (unit + integration)
- [ ] Documentation updated`;
  }

  /**
   * Generate user stories from description
   */
  _generateUserStories(description) {
    // Extract action from description
    const action = description.toLowerCase();

    return `- As a user, I want to ${action} so that I can accomplish my goals more efficiently
- As a developer, I want clear documentation so that I can maintain this feature`;
  }

  /**
   * Generate acceptance criteria
   */
  _generateAcceptanceCriteria(description) {
    const feature = description.toLowerCase();

    return `- [ ] Given a user wants to use this feature, when they access it, then it works as expected
- [ ] Given the feature is ${feature}, when tested, then all tests pass
- [ ] Given the implementation is complete, when reviewed, then it meets code quality standards`;
  }

  /**
   * Check if description has architecture keywords
   */
  _hasArchitectureKeywords(description) {
    const keywords = ['api', 'database', 'architecture', 'design', 'system', 'service', 'component'];
    return keywords.some(kw => description.toLowerCase().includes(kw));
  }

  /**
   * Check if description has dependency keywords
   */
  _hasDependencyKeywords(description) {
    const keywords = ['depends', 'require', 'after', 'before', 'integration', 'external'];
    return keywords.some(kw => description.toLowerCase().includes(kw));
  }

  /**
   * Extract technical approach
   */
  _extractTechnicalApproach(description) {
    return `Technical approach will be determined during planning phase.

Initial considerations:
- Architecture pattern: [TBD]
- Tech stack: [TBD]
- Data model: [TBD]
- API contracts: [TBD]`;
  }

  /**
   * Extract dependencies
   */
  _extractDependencies(description) {
    return `Dependencies will be identified during planning phase.

Potential dependencies:
- [ ] Identify blocking issues
- [ ] Identify related issues
- [ ] Check external dependencies`;
  }

  /**
   * Validate spec against constitutional principles
   */
  async _validateAgainstPrinciples(specContent) {
    try {
      // Check if constitutional principles are configured
      const configPath = path.join(process.cwd(), '.leorc.json');
      const configExists = await fs.access(configPath).then(() => true).catch(() => false);

      if (!configExists) {
        console.log(chalk.yellow('⚠️  No constitutional principles configured (skipping validation)'));
        return;
      }

      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      const constitution = config.constitution;

      if (!constitution || !constitution.principles || constitution.principles.length === 0) {
        console.log(chalk.yellow('⚠️  No constitutional principles configured (skipping validation)'));
        return;
      }

      console.log(chalk.cyan('🔍 Validating spec against constitutional principles...'));

      // Basic validation checks
      const validationResults = [];

      // Check for TDD principle
      const tddPrinciple = constitution.principles.find(p => p.name.includes('Test'));
      if (tddPrinciple && tddPrinciple.enabled) {
        const hasTestRequirement = specContent.sections['Requirements']?.toLowerCase().includes('test');
        validationResults.push({
          principle: 'Test-First Development',
          passed: hasTestRequirement,
          message: hasTestRequirement
            ? '✅ Test requirements included'
            : '⚠️  Consider adding test requirements'
        });
      }

      // Check for documentation principle
      const docPrinciple = constitution.principles.find(p => p.name.includes('Documentation'));
      if (docPrinciple && docPrinciple.enabled) {
        const hasDocRequirement = specContent.sections['Requirements']?.toLowerCase().includes('documentation');
        validationResults.push({
          principle: 'Documentation Required',
          passed: hasDocRequirement,
          message: hasDocRequirement
            ? '✅ Documentation requirements included'
            : '⚠️  Consider adding documentation requirements'
        });
      }

      // Display validation results
      validationResults.forEach(result => {
        console.log(chalk.gray(`   ${result.message}`));
      });

      console.log(chalk.green('✅ Constitutional validation complete\n'));

    } catch (error) {
      console.log(chalk.yellow(`⚠️  Constitutional validation skipped: ${error.message}`));
    }
  }

  /**
   * Format spec as GitHub issue body (Markdown)
   */
  _formatIssueBody(specContent) {
    let body = '';

    // Add each section
    for (const [sectionName, sectionContent] of Object.entries(specContent.sections)) {
      body += `## ${sectionName}\n\n${sectionContent}\n\n`;
    }

    // Add footer
    body += `---\n\n`;
    body += `_This spec was created using \`leo spec new\`_\n`;
    body += `_Next step: \`leo clarify <issue>\` to identify questions, then \`leo plan <issue>\` to create implementation plan_\n`;

    return body;
  }

  /**
   * Determine labels for the issue
   */
  _determineLabels(priority, type) {
    const labels = [...this.template.labels.default];

    // Add priority label
    if (this.template.labels.priority[priority]) {
      labels.push(this.template.labels.priority[priority]);
    }

    // Add type label
    if (this.template.labels.type[type]) {
      labels.push(this.template.labels.type[type]);
    }

    return labels;
  }

  /**
   * Ensure labels exist, create if missing
   */
  async _ensureLabelsExist(labels) {
    const labelColors = {
      'spec': '0E8A16',
      'needs-planning': 'FBCA04',
      'needs-clarification': 'D93F0B',
      'priority: high': 'D73A4A',
      'priority: medium': 'FBCA04',
      'priority: low': '0E8A16',
      'type: feature': '0075CA',
      'type: bug': 'D73A4A',
      'type: refactor': '7057FF',
      'type: docs': '0075CA'
    };

    for (const label of labels) {
      try {
        // Check if label exists
        execSync(`gh label list --json name | grep '"name":"${label}"'`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        // Label doesn't exist, create it
        const color = labelColors[label] || '808080';
        const description = label.replace(/:/g, ' -');
        try {
          execSync(`gh label create "${label}" --description "${description}" --color "${color}"`, {
            encoding: 'utf-8',
            cwd: process.cwd(),
            stdio: 'pipe'
          });
          console.log(chalk.gray(`   Created label: ${label}`));
        } catch (createError) {
          console.log(chalk.yellow(`   ⚠️  Could not create label: ${label}`));
        }
      }
    }
  }

  /**
   * Create GitHub issue via gh CLI
   */
  async _createGitHubIssue(title, body, labels) {
    try {
      // Ensure all labels exist
      await this._ensureLabelsExist(labels);

      // Escape body for shell
      const bodyFile = path.join('/tmp', `leo-spec-${Date.now()}.md`);
      await fs.writeFile(bodyFile, body, 'utf-8');

      // Create issue with gh CLI
      const labelArgs = labels.map(l => `--label "${l}"`).join(' ');
      const command = `gh issue create --title "${title}" --body-file "${bodyFile}" ${labelArgs}`;

      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

      // Parse issue URL from output
      const urlMatch = output.match(/https:\/\/github\.com\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : '';

      // Extract issue number from URL
      const numberMatch = url.match(/\/(\d+)$/);
      const number = numberMatch ? parseInt(numberMatch[1], 10) : null;

      // Clean up temp file
      await fs.unlink(bodyFile);

      return { number, url };

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to create GitHub issue: ${error.message}`));
      throw error;
    }
  }  /**
   * List all spec issues (issues with "spec" label)
   */
  async list(options = {}) {
    const { status = 'all', limit = 30 } = options;

    console.log(chalk.blue(`📋 Listing spec issues (status: ${status})...`));

    try {
      const stateArg = status === 'open' ? '--state open' : status === 'closed' ? '--state closed' : '--state all';
      const command = `gh issue list --label spec ${stateArg} --limit ${limit} --json number,title,state,labels,url`;

      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      const issues = JSON.parse(output);

      if (issues.length === 0) {
        console.log(chalk.yellow('\n📭 No spec issues found'));
        return [];
      }

      console.log(chalk.green(`\n✅ Found ${issues.length} spec issue(s):\n`));

      issues.forEach(issue => {
        const stateIcon = issue.state === 'OPEN' ? '🟢' : '✅';
        const labels = issue.labels.map(l => l.name).filter(l => l !== 'spec').join(', ');

        console.log(`${stateIcon} #${issue.number} - ${issue.title}`);
        console.log(chalk.gray(`   Labels: ${labels || 'none'}`));
        console.log(chalk.gray(`   URL: ${issue.url}\n`));
      });

      return issues;

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to list spec issues: ${error.message}`));
      throw error;
    }
  }

  /**
   * Show details of a specific spec issue
   */
  async show(issueNumber) {
    console.log(chalk.blue(`📄 Loading spec issue #${issueNumber}...`));

    try {
      const command = `gh issue view ${issueNumber} --json number,title,body,state,labels,url,createdAt,updatedAt`;
      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      const issue = JSON.parse(output);

      console.log(chalk.green(`\n✅ Spec Issue #${issue.number}\n`));
      console.log(chalk.bold(issue.title));
      console.log(chalk.gray(`State: ${issue.state}`));
      console.log(chalk.gray(`Labels: ${issue.labels.map(l => l.name).join(', ')}`));
      console.log(chalk.gray(`Created: ${new Date(issue.createdAt).toLocaleString()}`));
      console.log(chalk.gray(`Updated: ${new Date(issue.updatedAt).toLocaleString()}`));
      console.log(chalk.gray(`URL: ${issue.url}\n`));
      console.log(chalk.cyan('Body:'));
      console.log(issue.body);

      return issue;

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to load spec issue: ${error.message}`));
      throw error;
    }
  }
}

module.exports = SpecManager;
