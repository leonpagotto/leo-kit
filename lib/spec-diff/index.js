const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Spec Diff Manager
 * Tracks and displays spec evolution over time
 */
class SpecDiffManager {
  constructor() {}

  /**
   * Show diff for a spec issue
   * @param {number} issueNumber - GitHub issue number
   * @param {object} options - Diff options
   * @returns {Promise<object>} Diff result
   */
  async diff(issueNumber, options = {}) {
    console.log(chalk.cyan(`📊 Analyzing spec evolution for issue #${issueNumber}...\n`));

    // Step 1: Fetch issue timeline (all edits)
    const timeline = await this._fetchIssueTimeline(issueNumber);

    if (timeline.length === 0) {
      console.log(chalk.yellow('⚠️  No edits found for this spec'));
      return { changes: [], timeline: [] };
    }

    // Step 2: Parse spec sections from each version
    const versions = await this._parseVersions(timeline);

    if (versions.length < 2) {
      console.log(chalk.yellow('⚠️  Spec has not been edited yet (only 1 version exists)'));
      return { changes: [], timeline: versions };
    }

    // Step 3: Apply version range filter if specified
    let filteredVersions = versions;
    if (options.from || options.to) {
      filteredVersions = this._filterVersionRange(versions, options.from, options.to);
    }

    // Step 4: Compare versions and generate diff
    const changes = await this._compareVersions(filteredVersions, options);

    // Step 5: Display diff in chosen format
    if (options.timeline) {
      this._displayTimeline(filteredVersions);
    } else if (options.summary) {
      this._displaySummary(changes, filteredVersions);
    } else {
      this._displayDiff(changes, filteredVersions, options);
    }

    return { changes, timeline: filteredVersions };
  }

  /**
   * Fetch issue timeline from GitHub
   * @private
   */
  async _fetchIssueTimeline(issueNumber) {
    try {
      // Fetch issue with body (original version)
      const issueJson = execSync(
        `gh issue view ${issueNumber} --json body,createdAt,author`,
        { encoding: 'utf-8', cwd: process.cwd() }
      );
      const issue = JSON.parse(issueJson);

      // Fetch all comments to find edit history
      const commentsJson = execSync(
        `gh api repos/:owner/:repo/issues/${issueNumber}/timeline --paginate`,
        { encoding: 'utf-8', cwd: process.cwd() }
      );
      const timelineEvents = JSON.parse(commentsJson);

      // Build timeline: original + edits
      const timeline = [
        {
          version: 1,
          timestamp: issue.createdAt,
          author: issue.author.login,
          body: issue.body,
          type: 'created'
        }
      ];

      // Add edit events
      let versionCount = 2;
      for (const event of timelineEvents) {
        if (event.event === 'renamed') {
          // Title changes
          timeline.push({
            version: versionCount++,
            timestamp: event.created_at,
            author: event.actor.login,
            type: 'title_change',
            from: event.rename.from,
            to: event.rename.to
          });
        } else if (event.body !== undefined && event.updated_at) {
          // Body edits
          timeline.push({
            version: versionCount++,
            timestamp: event.updated_at,
            author: event.user?.login || event.actor?.login || 'unknown',
            body: event.body,
            type: 'edited'
          });
        }
      }

      return timeline;
    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch issue timeline:'), error.message);
      return [];
    }
  }

  /**
   * Parse spec sections from each version
   * @private
   */
  async _parseVersions(timeline) {
    const versions = [];

    for (const entry of timeline) {
      if (entry.type === 'title_change') {
        // Track title changes separately
        continue;
      }

      const sections = this._parseSections(entry.body || '');
      versions.push({
        version: entry.version,
        timestamp: entry.timestamp,
        author: entry.author,
        type: entry.type,
        sections
      });
    }

    return versions;
  }

  /**
   * Parse markdown sections from spec body
   * @private
   */
  _parseSections(body) {
    const sections = {
      context: '',
      requirements: [],
      userStories: [],
      acceptanceCriteria: [],
      technicalNotes: '',
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
      'technical notes': 'technicalNotes',
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
   * Filter versions by range
   * @private
   */
  _filterVersionRange(versions, from, to) {
    const fromVersion = from ? parseInt(from) : 1;
    const toVersion = to ? parseInt(to) : versions[versions.length - 1].version;

    return versions.filter(v => v.version >= fromVersion && v.version <= toVersion);
  }

  /**
   * Compare versions and generate diff
   * @private
   */
  async _compareVersions(versions, options = {}) {
    const changes = [];

    for (let i = 1; i < versions.length; i++) {
      const prev = versions[i - 1];
      const curr = versions[i];

      const sectionChanges = this._compareSections(prev.sections, curr.sections, options.section);

      if (sectionChanges.length > 0) {
        changes.push({
          fromVersion: prev.version,
          toVersion: curr.version,
          timestamp: curr.timestamp,
          author: curr.author,
          changes: sectionChanges
        });
      }
    }

    return changes;
  }

  /**
   * Compare two section objects
   * @private
   */
  _compareSections(prevSections, currSections, filterSection = null) {
    const sectionChanges = [];

    // Check each section
    const allSections = new Set([
      ...Object.keys(prevSections),
      ...Object.keys(currSections)
    ]);

    for (const sectionName of allSections) {
      // Skip if filtering by section and this isn't it
      if (filterSection && sectionName !== filterSection) {
        continue;
      }

      const prevContent = prevSections[sectionName];
      const currContent = currSections[sectionName];

      if (Array.isArray(prevContent) && Array.isArray(currContent)) {
        // List comparison (requirements, user stories, acceptance criteria)
        const added = currContent.filter(item => !prevContent.includes(item));
        const removed = prevContent.filter(item => !currContent.includes(item));

        if (added.length > 0 || removed.length > 0) {
          sectionChanges.push({
            section: sectionName,
            type: 'list',
            added,
            removed
          });
        }
      } else {
        // Text comparison (context, technical notes, etc.)
        if (prevContent !== currContent) {
          sectionChanges.push({
            section: sectionName,
            type: 'text',
            from: prevContent,
            to: currContent
          });
        }
      }
    }

    return sectionChanges;
  }

  /**
   * Display summary statistics
   * @private
   */
  _displaySummary(changes, versions) {
    console.log(chalk.bold.cyan('📊 Spec Evolution Summary\n'));

    // Version stats
    console.log(chalk.bold.white('Versions:'));
    console.log(chalk.gray(`  Total versions: ${versions.length}`));
    console.log(chalk.gray(`  Original: ${new Date(versions[0].timestamp).toLocaleDateString()}`));
    console.log(chalk.gray(`  Latest: ${new Date(versions[versions.length - 1].timestamp).toLocaleDateString()}`));
    console.log('');

    // Change stats
    console.log(chalk.bold.white('Changes:'));
    console.log(chalk.gray(`  Total edits: ${changes.length}`));

    // Count changes by type
    let totalAdded = 0;
    let totalRemoved = 0;
    let sectionsModified = new Set();

    for (const change of changes) {
      for (const sectionChange of change.changes) {
        sectionsModified.add(sectionChange.section);
        if (sectionChange.type === 'list') {
          totalAdded += sectionChange.added.length;
          totalRemoved += sectionChange.removed.length;
        } else if (sectionChange.type === 'text') {
          if (sectionChange.to && !sectionChange.from) totalAdded++;
          if (sectionChange.from && !sectionChange.to) totalRemoved++;
        }
      }
    }

    console.log(chalk.green(`  Items added: ${totalAdded}`));
    console.log(chalk.red(`  Items removed: ${totalRemoved}`));
    console.log(chalk.yellow(`  Sections modified: ${sectionsModified.size}`));
    console.log('');

    // Most edited sections
    console.log(chalk.bold.white('Most Modified Sections:'));
    const sectionCounts = {};
    for (const change of changes) {
      for (const sectionChange of change.changes) {
        const title = this._formatSectionTitle(sectionChange.section);
        sectionCounts[title] = (sectionCounts[title] || 0) + 1;
      }
    }

    const sortedSections = Object.entries(sectionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [section, count] of sortedSections) {
      console.log(chalk.gray(`  ${section}: ${count} change${count > 1 ? 's' : ''}`));
    }
    console.log('');

    // Contributors
    const contributors = new Set(changes.map(c => c.author));
    console.log(chalk.bold.white('Contributors:'));
    console.log(chalk.gray(`  ${Array.from(contributors).map(c => `@${c}`).join(', ')}`));
    console.log('');
  }

  /**
   * Display timeline view
   * @private
   */
  _displayTimeline(versions) {
    console.log(chalk.bold.cyan('📅 Spec Evolution Timeline\n'));

    for (const version of versions) {
      const date = new Date(version.timestamp).toLocaleString();
      const emoji = version.type === 'created' ? '🆕' : '✏️';

      console.log(chalk.bold(`${emoji} Version ${version.version}`));
      console.log(chalk.gray(`   ${date} by @${version.author}`));

      // Show section summary
      const sectionCount = Object.values(version.sections).filter(s =>
        (Array.isArray(s) && s.length > 0) || (typeof s === 'string' && s.length > 0)
      ).length;
      console.log(chalk.gray(`   ${sectionCount} sections with content\n`));
    }
  }

  /**
   * Display diff view
   * @private
   */
  _displayDiff(changes, versions, options = {}) {
    if (changes.length === 0) {
      console.log(chalk.yellow('✅ No changes detected between versions\n'));
      return;
    }

    const versionRange = options.from || options.to
      ? ` (v${options.from || versions[0].version} → v${options.to || versions[versions.length - 1].version})`
      : '';

    console.log(chalk.bold.cyan(`📝 Spec Changes${versionRange} (${changes.length} edit${changes.length > 1 ? 's' : ''})\n`));

    for (const change of changes) {
      const date = new Date(change.timestamp).toLocaleString();
      console.log(chalk.bold.yellow(`\n━━━ Version ${change.fromVersion} → ${change.toVersion} ━━━`));
      console.log(chalk.gray(`${date} by @${change.author}\n`));

      for (const sectionChange of change.changes) {
        const sectionTitle = this._formatSectionTitle(sectionChange.section);
        console.log(chalk.bold.white(`  ${sectionTitle}:`));

        if (sectionChange.type === 'list') {
          // Show list changes
          if (sectionChange.added.length > 0) {
            for (const item of sectionChange.added) {
              console.log(chalk.green(`    + ${item}`));
            }
          }
          if (sectionChange.removed.length > 0) {
            for (const item of sectionChange.removed) {
              console.log(chalk.red(`    - ${item}`));
            }
          }
        } else {
          // Show text changes
          if (sectionChange.from) {
            console.log(chalk.red(`    - ${this._truncate(sectionChange.from, options.maxLength || 100)}`));
          }
          if (sectionChange.to) {
            console.log(chalk.green(`    + ${this._truncate(sectionChange.to, options.maxLength || 100)}`));
          }
        }
        console.log('');
      }
    }
  }

  /**
   * Format section name for display
   * @private
   */
  _formatSectionTitle(sectionName) {
    const titles = {
      context: 'Context',
      requirements: 'Requirements',
      userStories: 'User Stories',
      acceptanceCriteria: 'Acceptance Criteria',
      technicalNotes: 'Technical Notes',
      constraints: 'Constraints',
      outOfScope: 'Out of Scope',
      successMetrics: 'Success Metrics'
    };
    return titles[sectionName] || sectionName;
  }

  /**
   * Truncate long text for display
   * @private
   */
  _truncate(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

module.exports = SpecDiffManager;
