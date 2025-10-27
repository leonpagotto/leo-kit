/**
 * Task Management - Generate actionable task checklists from implementation plans
 *
 * Part of Phase 2: Task Management (Day 8-9)
 * This module converts implementation plans into structured task checklists
 * with dependencies and TDD workflow support.
 *
 * Key Features:
 * - Parse implementation plan from issue comments
 * - Extract phases and tasks
 * - Add task dependencies (TDD: tests before implementation)
 * - Generate checklist with parallel/sequential markers
 * - Post tasks as GitHub issue comment
 * - Label management (add 'has-tasks')
 *
 * @module lib/tasks
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

/**
 * Task dependency types
 */
const DEPENDENCY_TYPES = {
  PARALLEL: 'Parallel', // Tasks can run simultaneously
  SEQUENTIAL: 'Sequential', // Tasks must run in order
  BLOCKED: 'Blocked' // Tasks blocked by other phases
};

/**
 * TaskManager - Main class for task management
 */
class TaskManager {
  constructor() {
    this.dependencyTypes = DEPENDENCY_TYPES;
  }

  /**
   * Generate task checklist from implementation plan
   *
   * @param {number|string} issueNumber - GitHub issue number
   * @param {Object} options - Task generation options
   * @param {boolean} options.autoPost - Automatically post tasks as comment
   * @param {boolean} options.addLabel - Add 'has-tasks' label
   * @param {boolean} options.tddMode - Enforce TDD (tests before implementation)
   * @returns {Promise<Object>} Task generation results
   */
  async create(issueNumber, options = {}) {
    const {
      autoPost = true,
      addLabel = true,
      tddMode = true
    } = options;

    console.log(chalk.blue(`📋 Generating task checklist for issue #${issueNumber}...`));

    // Step 1: Load issue and comments
    const issue = await this._loadIssue(issueNumber);
    const comments = await this._loadComments(issueNumber);

    // Step 2: Find implementation plan in comments
    const plan = this._findImplementationPlan(comments);
    if (!plan) {
      console.log(chalk.yellow('\n⚠️  No implementation plan found'));
      console.log(chalk.gray('   Run `leo plan ' + issueNumber + '` first to generate a plan\n'));
      throw new Error('No implementation plan found');
    }

    // Step 3: Parse plan sections
    const phases = this._parsePlanPhases(plan);

    // Step 4: Generate task checklist
    const tasks = this._generateTaskChecklist(phases, { tddMode });

    // Step 5: Format as comment
    const comment = this._formatTasksComment(tasks, issueNumber);

    // Step 6: Post to GitHub (if autoPost)
    if (autoPost) {
      await this._postComment(issueNumber, comment);
      console.log(chalk.green(`✅ Posted task checklist to issue #${issueNumber}`));
    }

    // Step 7: Add label (if addLabel)
    if (addLabel) {
      await this._addLabel(issueNumber, 'has-tasks');
    }

    return {
      issueNumber,
      taskCount: tasks.reduce((sum, phase) => sum + phase.tasks.length, 0),
      phaseCount: tasks.length,
      tasks,
      comment
    };
  }

  /**
   * Load issue from GitHub
   */
  async _loadIssue(issueNumber) {
    try {
      const command = `gh issue view ${issueNumber} --json number,title,body,labels`;
      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      return JSON.parse(output);
    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to load issue: ${error.message}`));
      throw error;
    }
  }

  /**
   * Load issue comments
   */
  async _loadComments(issueNumber) {
    try {
      const command = `gh api /repos/{owner}/{repo}/issues/${issueNumber}/comments`;
      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      return JSON.parse(output);
    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to load comments: ${error.message}`));
      throw error;
    }
  }

  /**
   * Find implementation plan in comments
   * Looks for comment with "# 📐 Implementation Plan" header
   */
  _findImplementationPlan(comments) {
    for (const comment of comments) {
      if (comment.body && comment.body.includes('# 📐 Implementation Plan')) {
        return comment.body;
      }
    }
    return null;
  }

  /**
   * Parse plan phases from plan content
   *
   * Looks for sections like:
   * ## Implementation Phases
   * **Phase 1: Foundation** (Day 1-2)
   * - [ ] Task 1
   * - [ ] Task 2
   */
  _parsePlanPhases(plan) {
    const phases = [];

    // Find "Implementation Phases" section
    const phasesMatch = plan.match(/## Implementation Phases\s+([\s\S]*?)(?=\n##|\n---|$)/);
    if (!phasesMatch) {
      console.log(chalk.yellow('⚠️  Could not find "Implementation Phases" section'));
      return phases;
    }

    const phasesSection = phasesMatch[1];

    // Parse each phase
    const phaseRegex = /\*\*Phase (\d+): (.+?)\*\*[^\n]*\n((?:- \[ \] .+\n?)*)/g;
    let match;

    while ((match = phaseRegex.exec(phasesSection)) !== null) {
      const phaseNumber = parseInt(match[1], 10);
      const phaseName = match[2].trim();
      const tasksText = match[3];

      // Extract tasks
      const taskMatches = tasksText.matchAll(/- \[ \] (.+)/g);
      const tasks = Array.from(taskMatches).map(m => m[1].trim());

      phases.push({
        number: phaseNumber,
        name: phaseName,
        tasks,
        dependencies: this._inferDependencies(phaseNumber, phaseName)
      });
    }

    return phases;
  }

  /**
   * Infer phase dependencies based on phase number and name
   */
  _inferDependencies(phaseNumber, phaseName) {
    const name = phaseName.toLowerCase();

    // Phase 1 (Foundation/Setup) is always parallel
    if (phaseNumber === 1 || name.includes('foundation') || name.includes('setup')) {
      return {
        type: 'Parallel',
        blockedBy: null
      };
    }

    // Tests phase is sequential (TDD)
    if (name.includes('test')) {
      return {
        type: 'Sequential',
        blockedBy: null
      };
    }

    // Implementation phase is blocked by tests (TDD)
    if (name.includes('implementation') || name.includes('core') || name.includes('feature')) {
      return {
        type: 'Parallel',
        blockedBy: phaseNumber - 1 // Usually blocked by previous phase (tests)
      };
    }

    // Final phase (Polish/Deploy) is sequential and blocked
    if (name.includes('polish') || name.includes('deploy') || name.includes('final')) {
      return {
        type: 'Sequential',
        blockedBy: phaseNumber - 1
      };
    }

    // Default: parallel, no blocking
    return {
      type: 'Parallel',
      blockedBy: null
    };
  }

  /**
   * Generate task checklist with dependencies
   */
  _generateTaskChecklist(phases, options = {}) {
    const { tddMode = true } = options;

    return phases.map(phase => {
      const tasks = phase.tasks.map(task => {
        let taskText = task;

        // Add dependency markers if blocked
        if (phase.dependencies.blockedBy) {
          const blockingPhase = phases.find(p => p.number === phase.dependencies.blockedBy);
          if (blockingPhase) {
            taskText = `[BLOCKED: Phase ${blockingPhase.number}] ${task}`;
          }
        }

        return taskText;
      });

      return {
        number: phase.number,
        name: phase.name,
        type: phase.dependencies.type,
        blockedBy: phase.dependencies.blockedBy,
        tasks
      };
    });
  }

  /**
   * Format tasks as GitHub comment (Markdown)
   */
  _formatTasksComment(tasks, issueNumber) {
    let comment = '## ✅ Implementation Tasks\n\n';
    comment += `**Generated from plan for issue #${issueNumber}**\n\n`;
    comment += '---\n\n';

    // Add each phase
    tasks.forEach(phase => {
      let phaseHeader = `### Phase ${phase.number}: ${phase.name}`;

      // Add dependency info
      const dependencies = [];
      if (phase.type) dependencies.push(phase.type);
      if (phase.blockedBy) dependencies.push(`after Phase ${phase.blockedBy}`);

      if (dependencies.length > 0) {
        phaseHeader += ` [${dependencies.join(', ')}]`;
      }

      comment += `${phaseHeader}\n\n`;

      // Add tasks
      phase.tasks.forEach(task => {
        comment += `- [ ] ${task}\n`;
      });

      comment += '\n';
    });

    comment += '---\n\n';
    comment += '**Task Execution Guide:**\n\n';
    comment += '- **[Parallel]** - Tasks can be worked on simultaneously\n';
    comment += '- **[Sequential]** - Tasks must be completed in order\n';
    comment += '- **[BLOCKED: Phase X]** - Cannot start until Phase X is complete\n\n';
    comment += '**TDD Workflow:**\n';
    comment += '1. Write tests first (Phase 2)\n';
    comment += '2. Run tests (they should fail)\n';
    comment += '3. Implement features (Phase 3)\n';
    comment += '4. Run tests (they should pass)\n';
    comment += '5. Refactor and repeat\n\n';
    comment += '_Generated by `leo tasks create`_\n';

    return comment;
  }

  /**
   * Post comment to GitHub issue
   */
  async _postComment(issueNumber, comment) {
    try {
      const commentFile = path.join('/tmp', `leo-tasks-${Date.now()}.md`);
      await fs.writeFile(commentFile, comment, 'utf-8');

      execSync(`gh issue comment ${issueNumber} --body-file "${commentFile}"`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

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
        const color = '1D76DB'; // Blue
        execSync(`gh label create "${label}" --description "Issue has task checklist" --color "${color}"`, {
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
   * Show task status for an issue (how many tasks completed)
   */
  async status(issueNumber) {
    console.log(chalk.blue(`📊 Checking task status for issue #${issueNumber}...`));

    const comments = await this._loadComments(issueNumber);

    // Find tasks comment
    let tasksComment = null;
    for (const comment of comments) {
      if (comment.body && comment.body.includes('## ✅ Implementation Tasks')) {
        tasksComment = comment.body;
        break;
      }
    }

    if (!tasksComment) {
      console.log(chalk.yellow('\n⚠️  No task checklist found'));
      console.log(chalk.gray('   Run `leo tasks create ' + issueNumber + '` to generate tasks\n'));
      return;
    }

    // Count tasks
    const totalTasks = (tasksComment.match(/- \[[ x]\]/g) || []).length;
    const completedTasks = (tasksComment.match(/- \[x\]/g) || []).length;
    const remainingTasks = totalTasks - completedTasks;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    console.log(chalk.cyan(`\n📋 Task Progress: ${completedTasks}/${totalTasks} (${progressPercent}%)\n`));

    if (progressPercent === 100) {
      console.log(chalk.green('✅ All tasks complete!'));
    } else if (progressPercent >= 75) {
      console.log(chalk.green('🎯 Almost done!'));
    } else if (progressPercent >= 50) {
      console.log(chalk.yellow('⚡ Making progress'));
    } else if (progressPercent >= 25) {
      console.log(chalk.yellow('🏃 Getting started'));
    } else {
      console.log(chalk.gray('📝 Just beginning'));
    }

    console.log(chalk.gray(`\n   Completed: ${completedTasks} tasks`));
    console.log(chalk.gray(`   Remaining: ${remainingTasks} tasks\n`));

    return {
      total: totalTasks,
      completed: completedTasks,
      remaining: remainingTasks,
      progress: progressPercent
    };
  }
}

module.exports = TaskManager;
