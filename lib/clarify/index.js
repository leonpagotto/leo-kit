/**
 * Spec Clarification - AI-driven question generation
 *
 * Part of Phase 1: Spec Kit Integration (Day 5-6)
 * This module analyzes spec issues and generates clarifying questions
 * to help identify gaps, ambiguities, and missing requirements.
 *
 * Key Features:
 * - Parse spec issue content (sections extraction)
 * - Identify ambiguities and missing details
 * - Generate clarifying questions
 * - Post questions as GitHub issue comments
 * - Label management (add needs-clarification)
 *
 * @module lib/clarify
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Question categories for structured clarification
 */
const QUESTION_CATEGORIES = {
  REQUIREMENTS: 'Requirements Clarification',
  USER_STORIES: 'User Stories & Use Cases',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria',
  TECHNICAL: 'Technical Approach',
  EDGE_CASES: 'Edge Cases & Error Handling',
  DEPENDENCIES: 'Dependencies & Integration',
  PERFORMANCE: 'Performance & Scale',
  SECURITY: 'Security & Privacy',
  UX: 'User Experience',
  TESTING: 'Testing Strategy'
};

/**
 * ClarificationManager - Main class for spec clarification
 */
class ClarificationManager {
  constructor() {
    this.categories = QUESTION_CATEGORIES;
  }

  /**
   * Analyze a spec issue and generate clarifying questions
   *
   * @param {number|string} issueNumber - GitHub issue number
   * @param {Object} options - Clarification options
   * @param {boolean} options.autoPost - Automatically post questions as comment
   * @param {boolean} options.addLabel - Add needs-clarification label
   * @param {string[]} options.categories - Specific categories to focus on
   * @returns {Promise<Object>} Analysis results with questions
   */
  async clarify(issueNumber, options = {}) {
    const {
      autoPost = true,
      addLabel = true,
      categories = null // null = all categories
    } = options;

    console.log(chalk.blue(`🔍 Analyzing spec issue #${issueNumber}...`));

    // Step 1: Load spec issue
    const spec = await this._loadSpecIssue(issueNumber);

    // Step 2: Parse spec sections
    const sections = this._parseSpecSections(spec.body);

    // Step 3: Analyze each section for gaps/ambiguities
    const analysis = this._analyzeSpec(sections, spec);

    // Step 4: Generate clarifying questions
    const questions = this._generateQuestions(analysis, categories);

    // Step 5: Format questions as comment
    const comment = this._formatQuestionsComment(questions, analysis);

    // Step 6: Post to GitHub (if autoPost)
    if (autoPost) {
      await this._postComment(issueNumber, comment);
      console.log(chalk.green(`✅ Posted ${questions.length} clarifying questions to issue #${issueNumber}`));
    }

    // Step 7: Add label (if addLabel)
    if (addLabel) {
      await this._addLabel(issueNumber, 'needs-clarification');
    }

    return {
      issueNumber,
      questionCount: questions.length,
      questions,
      analysis,
      comment
    };
  }

  /**
   * Load spec issue from GitHub
   */
  async _loadSpecIssue(issueNumber) {
    try {
      const command = `gh issue view ${issueNumber} --json number,title,body,labels`;
      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      const issue = JSON.parse(output);

      // Verify it's a spec issue
      const hasSpecLabel = issue.labels.some(l => l.name === 'spec');
      if (!hasSpecLabel) {
        console.log(chalk.yellow(`⚠️  Issue #${issueNumber} doesn't have 'spec' label - analyzing anyway`));
      }

      return issue;

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to load issue: ${error.message}`));
      throw error;
    }
  }

  /**
   * Parse spec sections from issue body
   *
   * Extracts sections like:
   * ## Context
   * content...
   * ## Requirements
   * content...
   */
  _parseSpecSections(body) {
    const sections = {};
    const sectionRegex = /^## (.+?)$/gm;

    let match;
    let lastIndex = 0;
    let lastSection = null;

    while ((match = sectionRegex.exec(body)) !== null) {
      if (lastSection) {
        // Extract content from last section
        const content = body.substring(lastIndex, match.index).trim();
        sections[lastSection] = content;
      }
      lastSection = match[1];
      lastIndex = match.index + match[0].length;
    }

    // Get last section content
    if (lastSection) {
      const content = body.substring(lastIndex).trim();
      sections[lastSection] = content;
    }

    return sections;
  }

  /**
   * Analyze spec for gaps, ambiguities, and missing details
   */
  _analyzeSpec(sections, spec) {
    const analysis = {
      completeness: {},
      ambiguities: [],
      gaps: [],
      strengths: [],
      score: 0,
      issueNumber: spec.number
    };

    // Analyze Context
    if (sections['Context']) {
      const context = sections['Context'];
      if (context.length < 50) {
        analysis.gaps.push({
          category: 'REQUIREMENTS',
          section: 'Context',
          issue: 'Context is too brief',
          detail: 'Needs more background on why this is needed'
        });
      } else {
        analysis.strengths.push('Well-defined context');
      }

      if (!context.toLowerCase().includes('problem') && !context.toLowerCase().includes('need')) {
        analysis.ambiguities.push({
          category: 'REQUIREMENTS',
          section: 'Context',
          issue: 'Problem statement unclear',
          detail: 'Should clearly state what problem is being solved'
        });
      }
    } else {
      analysis.gaps.push({
        category: 'REQUIREMENTS',
        section: 'Context',
        issue: 'Missing context section',
        detail: 'No background provided'
      });
    }

    // Analyze Requirements
    if (sections['Requirements']) {
      const requirements = sections['Requirements'];
      const checkboxCount = (requirements.match(/- \[ \]/g) || []).length;

      analysis.completeness['Requirements'] = checkboxCount;

      if (checkboxCount < 3) {
        analysis.gaps.push({
          category: 'REQUIREMENTS',
          section: 'Requirements',
          issue: 'Too few requirements',
          detail: `Only ${checkboxCount} requirement(s) listed`
        });
      }

      // Check for specific requirement types
      if (!requirements.toLowerCase().includes('test')) {
        analysis.gaps.push({
          category: 'TESTING',
          section: 'Requirements',
          issue: 'No testing requirements',
          detail: 'Should specify testing requirements'
        });
      }

      if (!requirements.toLowerCase().includes('error') && !requirements.toLowerCase().includes('validation')) {
        analysis.gaps.push({
          category: 'EDGE_CASES',
          section: 'Requirements',
          issue: 'No error handling requirements',
          detail: 'Should specify error handling approach'
        });
      }

      if (!requirements.toLowerCase().includes('documentation') && !requirements.toLowerCase().includes('docs')) {
        analysis.gaps.push({
          category: 'REQUIREMENTS',
          section: 'Requirements',
          issue: 'No documentation requirements',
          detail: 'Should specify documentation needs'
        });
      }
    } else {
      analysis.gaps.push({
        category: 'REQUIREMENTS',
        section: 'Requirements',
        issue: 'Missing requirements section',
        detail: 'Core requirements not defined'
      });
    }

    // Analyze User Stories
    if (sections['User Stories']) {
      const stories = sections['User Stories'];
      const storyCount = (stories.match(/- As a/gi) || []).length;

      analysis.completeness['User Stories'] = storyCount;

      if (storyCount === 0) {
        analysis.gaps.push({
          category: 'USER_STORIES',
          section: 'User Stories',
          issue: 'No proper user stories',
          detail: 'Should use "As a [user], I want to [action] so that [benefit]" format'
        });
      }

      if (storyCount < 2) {
        analysis.ambiguities.push({
          category: 'USER_STORIES',
          section: 'User Stories',
          issue: 'Limited user stories',
          detail: 'Consider multiple user perspectives'
        });
      }
    } else {
      analysis.gaps.push({
        category: 'USER_STORIES',
        section: 'User Stories',
        issue: 'Missing user stories',
        detail: 'Who will use this and why?'
      });
    }

    // Analyze Acceptance Criteria
    if (sections['Acceptance Criteria']) {
      const criteria = sections['Acceptance Criteria'];
      const criteriaCount = (criteria.match(/- \[ \]/g) || []).length;

      analysis.completeness['Acceptance Criteria'] = criteriaCount;

      if (criteriaCount < 3) {
        analysis.gaps.push({
          category: 'ACCEPTANCE_CRITERIA',
          section: 'Acceptance Criteria',
          issue: 'Too few acceptance criteria',
          detail: `Only ${criteriaCount} criteria listed`
        });
      }

      if (!criteria.toLowerCase().includes('given') || !criteria.toLowerCase().includes('when') || !criteria.toLowerCase().includes('then')) {
        analysis.ambiguities.push({
          category: 'ACCEPTANCE_CRITERIA',
          section: 'Acceptance Criteria',
          issue: 'Criteria not in BDD format',
          detail: 'Should use "Given [context] when [action] then [outcome]" format'
        });
      }
    } else {
      analysis.gaps.push({
        category: 'ACCEPTANCE_CRITERIA',
        section: 'Acceptance Criteria',
        issue: 'Missing acceptance criteria',
        detail: 'How will we know when it\'s done?'
      });
    }

    // Analyze Technical Approach (optional but good to have)
    if (!sections['Technical Approach']) {
      analysis.ambiguities.push({
        category: 'TECHNICAL',
        section: 'Technical Approach',
        issue: 'No technical approach specified',
        detail: 'Consider adding architecture/tech stack notes'
      });
    }

    // Analyze Dependencies
    if (!sections['Dependencies']) {
      analysis.ambiguities.push({
        category: 'DEPENDENCIES',
        section: 'Dependencies',
        issue: 'Dependencies not specified',
        detail: 'Are there blocking issues or external dependencies?'
      });
    }

    // Check for security/performance considerations
    const fullText = JSON.stringify(sections).toLowerCase();
    if (!fullText.includes('security') && !fullText.includes('auth') && !fullText.includes('permission')) {
      analysis.gaps.push({
        category: 'SECURITY',
        section: 'General',
        issue: 'No security considerations',
        detail: 'Should consider security implications'
      });
    }

    if (!fullText.includes('performance') && !fullText.includes('scale') && !fullText.includes('load')) {
      analysis.gaps.push({
        category: 'PERFORMANCE',
        section: 'General',
        issue: 'No performance considerations',
        detail: 'Should consider performance/scale requirements'
      });
    }

    // Calculate completeness score (0-100)
    const totalGaps = analysis.gaps.length;
    const totalAmbiguities = analysis.ambiguities.length;
    const maxScore = 100;
    const gapPenalty = 10;
    const ambiguityPenalty = 5;

    analysis.score = Math.max(0, maxScore - (totalGaps * gapPenalty) - (totalAmbiguities * ambiguityPenalty));

    return analysis;
  }

  /**
   * Generate clarifying questions based on analysis
   */
  _generateQuestions(analysis, categoriesFilter = null) {
    const questions = [];

    // Process gaps (critical questions)
    analysis.gaps.forEach(gap => {
      if (categoriesFilter && !categoriesFilter.includes(gap.category)) {
        return; // Skip if not in filter
      }

      const question = this._generateQuestionForGap(gap);
      questions.push({
        category: gap.category,
        priority: 'high',
        question,
        context: gap.detail,
        section: gap.section
      });
    });

    // Process ambiguities (clarification questions)
    analysis.ambiguities.forEach(ambiguity => {
      if (categoriesFilter && !categoriesFilter.includes(ambiguity.category)) {
        return; // Skip if not in filter
      }

      const question = this._generateQuestionForAmbiguity(ambiguity);
      questions.push({
        category: ambiguity.category,
        priority: 'medium',
        question,
        context: ambiguity.detail,
        section: ambiguity.section
      });
    });

    // Sort by priority (high first)
    questions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return questions;
  }

  /**
   * Generate question text for a gap
   */
  _generateQuestionForGap(gap) {
    const templates = {
      'Context': 'What is the background and motivation for this feature? Why is it needed now?',
      'Requirements': 'Can you provide more detailed functional requirements? What specific capabilities are needed?',
      'User Stories': 'Who are the target users for this feature? What specific actions do they need to perform?',
      'Acceptance Criteria': 'How will we verify this feature works correctly? What are the specific success criteria?',
      'Technical Approach': 'What technical approach should we take? Are there any architectural constraints?',
      'Dependencies': 'Are there any blocking issues or external dependencies we should be aware of?'
    };

    // Category-specific questions
    if (gap.category === 'TESTING') {
      return 'What testing strategy should we use? Unit tests, integration tests, E2E tests?';
    }
    if (gap.category === 'EDGE_CASES') {
      return 'How should we handle errors and edge cases? What validation is needed?';
    }
    if (gap.category === 'SECURITY') {
      return 'Are there any security considerations? Authentication, authorization, data protection?';
    }
    if (gap.category === 'PERFORMANCE') {
      return 'What are the performance requirements? Expected load, response times, scale?';
    }

    return templates[gap.section] || `Can you clarify the ${gap.section}? ${gap.detail}`;
  }

  /**
   * Generate question text for an ambiguity
   */
  _generateQuestionForAmbiguity(ambiguity) {
    if (ambiguity.issue.includes('BDD format')) {
      return 'Can you rewrite the acceptance criteria in BDD format (Given/When/Then)?';
    }
    if (ambiguity.issue.includes('user stories')) {
      return 'Can you provide more user stories covering different user types and scenarios?';
    }
    if (ambiguity.issue.includes('problem statement')) {
      return 'Can you clarify the specific problem this feature solves?';
    }
    if (ambiguity.issue.includes('technical approach')) {
      return 'Do you have any preferences for the technical implementation approach?';
    }

    return `${ambiguity.detail} - Can you provide more details?`;
  }

  /**
   * Format questions as GitHub comment (Markdown)
   */
  _formatQuestionsComment(questions, analysis) {
    let comment = '## 🔍 Clarification Questions\n\n';
    comment += `I've analyzed this spec and identified **${questions.length} questions** to help clarify the requirements.\n\n`;
    comment += `**Spec Completeness Score:** ${analysis.score}/100\n\n`;

    if (analysis.score >= 80) {
      comment += '✅ **Well-defined spec** - Just a few minor clarifications needed\n\n';
    } else if (analysis.score >= 60) {
      comment += '⚠️ **Good foundation** - Some important details need clarification\n\n';
    } else {
      comment += '🔴 **Needs significant clarification** - Several critical gaps to address\n\n';
    }

    comment += '---\n\n';

    // Group questions by category
    const categorized = {};
    questions.forEach(q => {
      if (!categorized[q.category]) {
        categorized[q.category] = [];
      }
      categorized[q.category].push(q);
    });

    // Output each category
    Object.entries(categorized).forEach(([category, qs]) => {
      const categoryName = this.categories[category] || category;
      comment += `### ${categoryName}\n\n`;

      qs.forEach((q, index) => {
        const priorityIcon = q.priority === 'high' ? '🔴' : q.priority === 'medium' ? '🟡' : '🟢';
        comment += `${priorityIcon} **Q${index + 1}:** ${q.question}\n`;
        if (q.context) {
          comment += `   *${q.context}*\n`;
        }
        comment += '\n';
      });
    });

    comment += '---\n\n';
    comment += '**Next Steps:**\n';
    comment += '1. Answer the questions above (reply to this comment or edit the spec)\n';
    comment += '2. Once clarified, run `leo plan ' + analysis.issueNumber + '` to generate implementation plan\n\n';
    comment += '_Generated by `leo clarify`_\n';

    return comment;
  }

  /**
   * Post comment to GitHub issue
   */
  async _postComment(issueNumber, comment) {
    try {
      // Write comment to temp file
      const fs = require('fs').promises;
      const path = require('path');
      const commentFile = path.join('/tmp', `leo-clarify-${Date.now()}.md`);
      await fs.writeFile(commentFile, comment, 'utf-8');

      // Post comment
      execSync(`gh issue comment ${issueNumber} --body-file "${commentFile}"`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      // Clean up
      await fs.unlink(commentFile);

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to post comment: ${error.message}`));
      throw error;
    }
  }

  /**
   * Add label to issue
   */
  async _addLabel(issueNumber, label) {
    try {
      // Check if label exists
      try {
        execSync(`gh label list --json name | grep '"name":"${label}"'`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        // Create label
        const color = 'D93F0B'; // Red-orange
        execSync(`gh label create "${label}" --description "Spec requires clarification" --color "${color}"`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
        console.log(chalk.gray(`   Created label: ${label}`));
      }

      // Add label to issue
      execSync(`gh issue edit ${issueNumber} --add-label "${label}"`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      console.log(chalk.green(`✅ Added label: ${label}`));

    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not add label: ${error.message}`));
    }
  }

  /**
   * Show clarification status for an issue
   */
  async showStatus(issueNumber) {
    console.log(chalk.blue(`📊 Checking clarification status for issue #${issueNumber}...`));

    const spec = await this._loadSpecIssue(issueNumber);
    const sections = this._parseSpecSections(spec.body);
    const analysis = this._analyzeSpec(sections, spec);

    console.log(chalk.cyan(`\n📋 Spec Completeness: ${analysis.score}/100\n`));

    if (analysis.score >= 80) {
      console.log(chalk.green('✅ Well-defined spec - Ready for planning'));
    } else if (analysis.score >= 60) {
      console.log(chalk.yellow('⚠️  Good foundation - Some clarification needed'));
    } else {
      console.log(chalk.red('🔴 Needs clarification - Run leo clarify ' + issueNumber));
    }

    console.log(chalk.gray(`\n📊 Analysis:`));
    console.log(chalk.gray(`   Gaps: ${analysis.gaps.length} (critical)`));
    console.log(chalk.gray(`   Ambiguities: ${analysis.ambiguities.length} (clarification needed)`));
    console.log(chalk.gray(`   Strengths: ${analysis.strengths.length}\n`));

    if (analysis.gaps.length > 0) {
      console.log(chalk.red(`🔴 Critical Gaps:`));
      analysis.gaps.forEach(gap => {
        console.log(chalk.gray(`   - ${gap.section}: ${gap.issue}`));
      });
      console.log('');
    }

    return analysis;
  }
}

module.exports = ClarificationManager;
