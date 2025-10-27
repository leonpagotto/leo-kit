const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Spec Extension Manager
 * Adds new requirements to existing specs
 */
class SpecExtendManager {
  constructor() {}

  /**
   * Extend an existing spec with new requirements
   * @param {number} issueNumber - GitHub issue number
   * @param {string} extension - Extension description
   * @param {object} options - Extension options
   * @returns {Promise<object>} Extension result
   */
  async extend(issueNumber, extension, options = {}) {
    console.log(chalk.cyan(`📝 Extending spec #${issueNumber}...\n`));

    // Step 1: Fetch current spec
    const currentSpec = await this._fetchSpec(issueNumber);

    if (!currentSpec) {
      console.log(chalk.red('❌ Failed to fetch spec'));
      return { success: false };
    }

    // Step 2: Parse current sections
    const sections = this._parseSections(currentSpec.body);

    // Step 3: Generate extension content based on description
    const extensionContent = await this._generateExtension(extension, options);

    // Step 4: Merge extension with existing spec
    const updatedSections = this._mergeSections(sections, extensionContent);

    // Step 5: Format updated spec body
    const updatedBody = this._formatSpecBody(updatedSections);

    // Step 6: Update issue body
    if (options.autoUpdate !== false) {
      await this._updateIssueBody(issueNumber, updatedBody);
      console.log(chalk.green(`✅ Spec #${issueNumber} extended successfully`));
    } else {
      console.log(chalk.yellow('\n📄 Preview (use --no-update to skip posting):\n'));
      console.log(updatedBody);
    }

    // Step 7: Create child issues for extensions (optional)
    let childIssues = [];
    if (options.createIssues) {
      childIssues = await this._createExtensionIssues(issueNumber, extensionContent, currentSpec.title);
    }

    // Step 8: Add extension comment with history
    if (options.autoUpdate !== false && options.trackHistory !== false) {
      await this._addExtensionComment(issueNumber, extension, extensionContent, childIssues);
    }

    return {
      success: true,
      extension: extensionContent,
      childIssues,
      updatedBody
    };
  }

  /**
   * Fetch current spec from GitHub
   * @private
   */
  async _fetchSpec(issueNumber) {
    try {
      const issueJson = execSync(
        `gh issue view ${issueNumber} --json body,title,labels`,
        { encoding: 'utf-8', cwd: process.cwd() }
      );
      const issue = JSON.parse(issueJson);

      // Verify it's a spec issue
      const hasSpecLabel = issue.labels.some(l => l.name === 'spec');
      if (!hasSpecLabel) {
        console.log(chalk.yellow(`⚠️  Issue #${issueNumber} doesn't have 'spec' label. Proceeding anyway...`));
      }

      return issue;
    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch spec:'), error.message);
      return null;
    }
  }

  /**
   * Parse spec sections from body
   * @private
   */
  _parseSections(body) {
    const sections = {
      context: '',
      requirements: [],
      userStories: [],
      acceptanceCriteria: [],
      technicalApproach: '',
      constraints: '',
      outOfScope: '',
      successMetrics: ''
    };

    if (!body) return sections;

    // Split by ## headers
    const lines = body.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          this._saveSection(sections, currentSection, currentContent.join('\n').trim());
        }

        // Start new section
        const header = line.replace('## ', '').trim().toLowerCase();
        currentSection = this._mapSectionName(header);
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      this._saveSection(sections, currentSection, currentContent.join('\n').trim());
    }

    return sections;
  }

  /**
   * Map section header to internal name
   * @private
   */
  _mapSectionName(header) {
    const mapping = {
      'context': 'context',
      'requirements': 'requirements',
      'user stories': 'userStories',
      'acceptance criteria': 'acceptanceCriteria',
      'technical approach': 'technicalApproach',
      'constraints': 'constraints',
      'out of scope': 'outOfScope',
      'success metrics': 'successMetrics'
    };
    return mapping[header] || header;
  }

  /**
   * Save section content
   * @private
   */
  _saveSection(sections, sectionName, content) {
    if (sectionName === 'requirements' || sectionName === 'userStories' || sectionName === 'acceptanceCriteria') {
      // Parse list items
      sections[sectionName] = content
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('['))
        .map(line => line.replace(/^[\s-•\[\]x ]+/, '').trim())
        .filter(item => item.length > 0);
    } else {
      sections[sectionName] = content;
    }
  }

  /**
   * Generate extension content from description
   * @private
   */
  async _generateExtension(description, options = {}) {
    const extension = {
      requirements: [],
      userStories: [],
      acceptanceCriteria: []
    };

    // Simple heuristic generation (can be enhanced with AI later)
    extension.requirements.push(description);
    extension.requirements.push('Error handling for new feature');
    extension.requirements.push('Tests added for extension');
    extension.requirements.push('Documentation updated');

    // Generate user story
    extension.userStories.push(`As a user, I want ${description.toLowerCase()} so that I can enhance functionality`);

    // Generate acceptance criteria
    extension.acceptanceCriteria.push(`Given ${description} is implemented, when tested, then all tests pass`);
    extension.acceptanceCriteria.push('Given the extension is complete, when reviewed, then it meets quality standards');

    return extension;
  }

  /**
   * Merge extension with existing sections
   * @private
   */
  _mergeSections(existingSections, extensionContent) {
    const merged = { ...existingSections };

    // Add new requirements
    if (extensionContent.requirements) {
      merged.requirements = [
        ...merged.requirements,
        ...extensionContent.requirements.filter(r => !merged.requirements.includes(r))
      ];
    }

    // Add new user stories
    if (extensionContent.userStories) {
      merged.userStories = [
        ...merged.userStories,
        ...extensionContent.userStories.filter(s => !merged.userStories.includes(s))
      ];
    }

    // Add new acceptance criteria
    if (extensionContent.acceptanceCriteria) {
      merged.acceptanceCriteria = [
        ...merged.acceptanceCriteria,
        ...extensionContent.acceptanceCriteria.filter(c => !merged.acceptanceCriteria.includes(c))
      ];
    }

    return merged;
  }

  /**
   * Format spec body from sections
   * @private
   */
  _formatSpecBody(sections) {
    let body = '';

    // Context
    if (sections.context) {
      body += '## Context\n\n';
      body += sections.context + '\n\n';
    }

    // Requirements
    if (sections.requirements && sections.requirements.length > 0) {
      body += '## Requirements\n\n';
      for (const req of sections.requirements) {
        body += `- [ ] ${req}\n`;
      }
      body += '\n';
    }

    // User Stories
    if (sections.userStories && sections.userStories.length > 0) {
      body += '## User Stories\n\n';
      for (const story of sections.userStories) {
        body += `• ${story}\n`;
      }
      body += '\n';
    }

    // Acceptance Criteria
    if (sections.acceptanceCriteria && sections.acceptanceCriteria.length > 0) {
      body += '## Acceptance Criteria\n\n';
      for (const criteria of sections.acceptanceCriteria) {
        body += `- [ ] ${criteria}\n`;
      }
      body += '\n';
    }

    // Technical Approach
    if (sections.technicalApproach) {
      body += '## Technical Approach\n\n';
      body += sections.technicalApproach + '\n\n';
    }

    // Constraints
    if (sections.constraints) {
      body += '## Constraints\n\n';
      body += sections.constraints + '\n\n';
    }

    // Out of Scope
    if (sections.outOfScope) {
      body += '## Out of Scope\n\n';
      body += sections.outOfScope + '\n\n';
    }

    // Success Metrics
    if (sections.successMetrics) {
      body += '## Success Metrics\n\n';
      body += sections.successMetrics + '\n\n';
    }

    // Footer
    body += '---\n\n';
    body += 'This spec was created using `leo spec new` and extended using `leo spec extend`\n';

    return body;
  }

  /**
   * Update issue body on GitHub
   * @private
   */
  async _updateIssueBody(issueNumber, newBody) {
    try {
      // Write body to temp file to avoid shell escaping issues
      const fs = require('fs').promises;
      const tmpFile = `/tmp/leo-spec-${issueNumber}.md`;
      await fs.writeFile(tmpFile, newBody, 'utf-8');

      execSync(
        `gh issue edit ${issueNumber} --body-file ${tmpFile}`,
        { encoding: 'utf-8', cwd: process.cwd(), stdio: 'pipe' }
      );

      // Clean up
      await fs.unlink(tmpFile);
    } catch (error) {
      console.error(chalk.red('❌ Failed to update issue:'), error.message);
      throw error;
    }
  }

  /**
   * Create child issues for extension work
   * @private
   */
  async _createExtensionIssues(parentIssue, extensionContent, parentTitle) {
    console.log(chalk.cyan('\n📝 Creating child issues for extension work...\n'));

    // Ensure extension label exists
    await this._ensureLabelsExist(['extension', 'spec-extension']);

    const childIssues = [];
    const allExtensionItems = [
      ...extensionContent.requirements.map(r => ({ type: 'requirement', text: r })),
      ...extensionContent.userStories.map(s => ({ type: 'user-story', text: s }))
    ];

    const fs = require('fs').promises;

    for (let i = 0; i < allExtensionItems.length; i++) {
      const item = allExtensionItems[i];
      try {
        const title = `[Extension] ${item.text.substring(0, 60)}${item.text.length > 60 ? '...' : ''}`;
        const body = `**Parent Spec:** #${parentIssue} - ${parentTitle}\n\n**Type:** ${item.type}\n\n## Description\n\n${item.text}\n\n---\n\nGenerated by \`leo spec extend #${parentIssue} --create-issues\``;

        // Write to temp files to avoid escaping issues
        const tmpTitle = `/tmp/leo-ext-title-${i}.txt`;
        const tmpBody = `/tmp/leo-ext-body-${i}.md`;
        await fs.writeFile(tmpTitle, title, 'utf-8');
        await fs.writeFile(tmpBody, body, 'utf-8');

        const result = execSync(
          `gh issue create --title "$(cat ${tmpTitle})" --body-file ${tmpBody} --label "extension,spec-extension"`,
          { encoding: 'utf-8', cwd: process.cwd() }
        );

        // Clean up temp files
        await fs.unlink(tmpTitle);
        await fs.unlink(tmpBody);

        const issueUrl = result.trim();
        const issueNumber = issueUrl.split('/').pop();
        childIssues.push({ number: issueNumber, title, type: item.type });

        console.log(chalk.green(`   ✓ Created #${issueNumber}: ${title.substring(0, 50)}...`));
      } catch (error) {
        console.error(chalk.red(`   ✗ Failed to create issue for: ${item.text.substring(0, 30)}...`));
        if (process.env.DEBUG) console.error(error);
      }
    }

    console.log(chalk.green(`\n✅ Created ${childIssues.length} child issues for extension\n`));
    return childIssues;
  }

  /**
   * Ensure labels exist for child issues
   * @private
   */
  async _ensureLabelsExist(labels) {
    const labelColors = {
      'extension': 'FBCA04',
      'spec-extension': '0E8A16'
    };

    for (const label of labels) {
      try {
        execSync(`gh label list --json name | grep '"name":"${label}"'`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        // Label doesn't exist, create it
        const color = labelColors[label] || '808080';
        const description = label === 'extension' ? 'Spec extension work' : 'Extended from spec';
        try {
          execSync(`gh label create "${label}" --description "${description}" --color "${color}"`, {
            encoding: 'utf-8',
            cwd: process.cwd(),
            stdio: 'pipe'
          });
        } catch (createError) {
          // Ignore if already exists
        }
      }
    }
  }

  /**
   * Add extension history comment
   * @private
   */
  async _addExtensionComment(issueNumber, description, extensionContent, childIssues = []) {
    const timestamp = new Date().toLocaleString();
    let comment = `## 🔧 Spec Extended\n\n**Date:** ${timestamp}\n\n**Extension:** ${description}\n\n`;

    comment += '**Added:**\n';
    comment += `- ${extensionContent.requirements.length} new requirement(s)\n`;
    comment += `- ${extensionContent.userStories.length} new user story/stories\n`;
    comment += `- ${extensionContent.acceptanceCriteria.length} new acceptance criteria\n\n`;

    if (childIssues.length > 0) {
      comment += '**Child Issues Created:**\n';
      for (const child of childIssues) {
        comment += `- #${child.number} - ${child.title}\n`;
      }
      comment += '\n';
    }

    comment += '---\n\n';
    comment += `Extended using \`leo spec extend ${issueNumber} "${description}"\``;

    try {
      execSync(
        `gh issue comment ${issueNumber} --body "${comment.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8', cwd: process.cwd(), stdio: 'pipe' }
      );
    } catch (error) {
      console.error(chalk.yellow('⚠️  Failed to add extension comment:'), error.message);
    }
  }
}

module.exports = SpecExtendManager;
