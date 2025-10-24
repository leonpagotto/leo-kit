/**
 * LionPack Hunt Cycle Tracker
 * Tracks pack hunts through their complete lifecycle
 */

const fs = require('fs-extra');
const path = require('path');
const { RoleManager } = require('./roles');

/**
 * Hunt Cycle Model
 */
class HuntCycle {
  constructor(id, featureName, description, packName) {
    this.id = id;
    this.featureName = featureName;
    this.description = description;
    this.packName = packName;

    // Lifecycle
    this.status = 'pending'; // pending, in-progress, completed, blocked
    this.currentPhase = null; // requirements, spec, implementation, testing
    this.currentRole = null; // username

    // Timing
    this.startedAt = new Date().toISOString();
    this.completedAt = null;

    // Tracking
    this.phaseHistory = [];
    this.issueLinks = [];
    this.pullRequestLinks = [];

    // Metrics
    this.metrics = {
      totalDuration: 0,
      testCoverage: 0,
      qualityScore: 0,
      bugsFound: 0
    };
  }

  /**
   * Add phase to history
   */
  addPhase(phase, assignee, startTime = new Date().toISOString()) {
    this.phaseHistory.push({
      phase,
      assignee,
      startTime,
      endTime: null,
      duration: null
    });

    this.currentPhase = phase;
    this.currentRole = assignee;
  }

  /**
   * Complete current phase
   */
  completePhase(endTime = new Date().toISOString()) {
    if (this.phaseHistory.length === 0) {
      throw new Error('No phase to complete');
    }

    const currentPhase = this.phaseHistory[this.phaseHistory.length - 1];
    currentPhase.endTime = endTime;

    const start = new Date(currentPhase.startTime);
    const end = new Date(endTime);
    currentPhase.duration = Math.round((end - start) / 1000 / 60); // in minutes
  }

  /**
   * Get total hunt duration so far
   */
  getTotalDuration() {
    const startTime = new Date(this.startedAt);
    const endTime = this.completedAt ? new Date(this.completedAt) : new Date();
    return Math.round((endTime - startTime) / 1000 / 60); // in minutes
  }

  /**
   * Convert to GitHub issue body
   */
  toGitHubIssue() {
    const phases = [
      '🔍 Requirements',
      '📋 Specification',
      '🎯 Implementation',
      '✅ Testing'
    ];

    const phaseStatus = phases.map(phase => {
      const phaseData = this.phaseHistory.find(
        p => p.phase === phase.split(' ')[1].toLowerCase()
      );
      if (!phaseData) {
        return `- [ ] ${phase} - Pending`;
      }
      const duration = phaseData.duration ? `(${phaseData.duration}m)` : '';
      return `- [x] ${phase} - ${phaseData.assignee} ${duration}`;
    });

    return `
# 🦁 Hunt: ${this.featureName}

## Description
${this.description}

## Pack Hunt Tracking
- **Hunt ID:** ${this.id}
- **Status:** ${this.status}
- **Started:** ${this.startedAt}

## Phase Progress
${phaseStatus.join('\n')}

## Acceptance Criteria
- [ ] Feature complete
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Deployed to production

---

*Managed by LionPack - Team-based workflow automation*
*Pack: ${this.packName}*
    `.trim();
  }

  /**
   * Mark hunt as blocked
   */
  block(reason) {
    this.status = 'blocked';
    this.blockedReason = reason;
  }

  /**
   * Unblock hunt
   */
  unblock() {
    this.status = 'in-progress';
    this.blockedReason = null;
  }
}

/**
 * Hunt Cycle Tracker
 * Manages all hunts for a pack
 */
class HuntCycleTracker {
  constructor(packName) {
    this.packName = packName;
    this.hunts = [];
  }

  /**
   * Load hunts from storage
   */
  static async load(packName, projectPath = '.') {
    const tracker = new HuntCycleTracker(packName);

    // Try to load from file
    const huntsPath = path.join(projectPath, '.lionpack', 'hunts.json');

    try {
      const data = await fs.readJson(huntsPath);
      tracker.hunts = data.map(h => {
        const hunt = new HuntCycle(
          h.id,
          h.featureName,
          h.description,
          h.packName
        );

        // Restore state
        hunt.status = h.status;
        hunt.currentPhase = h.currentPhase;
        hunt.currentRole = h.currentRole;
        hunt.startedAt = h.startedAt;
        hunt.completedAt = h.completedAt;
        hunt.phaseHistory = h.phaseHistory;
        hunt.metrics = h.metrics;

        return hunt;
      });
    } catch (error) {
      // No hunts file yet, start fresh
      if (error.code !== 'ENOENT') {
        console.warn('Could not load hunts:', error.message);
      }
    }

    return tracker;
  }

  /**
   * Start new hunt cycle
   */
  startHunt(featureName, description) {
    const hunt = new HuntCycle(
      `hunt-${Date.now()}`,
      featureName,
      description,
      this.packName
    );

    hunt.status = 'in-progress';
    this.hunts.push(hunt);

    return hunt;
  }

  /**
   * Get hunt by ID
   */
  getHunt(huntId) {
    return this.hunts.find(h => h.id === huntId);
  }

  /**
   * Get active hunts
   */
  getActiveHunts() {
    return this.hunts.filter(h => h.status !== 'completed');
  }

  /**
   * Get completed hunts
   */
  getCompletedHunts() {
    return this.hunts.filter(h => h.status === 'completed');
  }

  /**
   * Get hunts by status
   */
  getHuntsByStatus(status) {
    return this.hunts.filter(h => h.status === status);
  }

  /**
   * Transition hunt to next phase
   */
  async transitionHunt(huntId, nextPhase, nextAssignee) {
    const hunt = this.getHunt(huntId);
    if (!hunt) {
      throw new Error(`Hunt not found: ${huntId}`);
    }

    // Validate phase transition
    const sequence = RoleManager.getSequence();
    const phaseIndex = sequence.indexOf(nextPhase);

    if (phaseIndex < 0) {
      throw new Error(`Invalid phase: ${nextPhase}`);
    }

    // Complete current phase if exists
    if (hunt.currentPhase) {
      hunt.completePhase();
    }

    // Start new phase
    hunt.addPhase(nextPhase, nextAssignee);

    await this.save();
  }

  /**
   * Complete hunt cycle
   */
  async completeHunt(huntId) {
    const hunt = this.getHunt(huntId);
    if (!hunt) {
      throw new Error(`Hunt not found: ${huntId}`);
    }

    // Complete last phase
    hunt.completePhase();

    hunt.status = 'completed';
    hunt.completedAt = new Date().toISOString();

    await this.save();

    return hunt;
  }

  /**
   * Save hunts to storage
   */
  async save(projectPath = '.') {
    const huntsPath = path.join(projectPath, '.lionpack', 'hunts.json');

    await fs.ensureDir(path.dirname(huntsPath));

    const data = this.hunts.map(h => ({
      id: h.id,
      featureName: h.featureName,
      description: h.description,
      packName: h.packName,
      status: h.status,
      currentPhase: h.currentPhase,
      currentRole: h.currentRole,
      startedAt: h.startedAt,
      completedAt: h.completedAt,
      phaseHistory: h.phaseHistory,
      metrics: h.metrics
    }));

    await fs.writeJson(huntsPath, data, { spaces: 2 });
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const completed = this.getCompletedHunts();
    const active = this.getActiveHunts();

    const totalDuration = completed.reduce(
      (sum, h) => sum + h.getTotalDuration(),
      0
    );
    const avgDuration =
      completed.length > 0 ? totalDuration / completed.length : 0;

    return {
      total: this.hunts.length,
      completed: completed.length,
      active: active.length,
      totalDuration,
      averageDuration: Math.round(avgDuration),
      blocked: this.getHuntsByStatus('blocked').length
    };
  }

  /**
   * Format hunt for display
   */
  formatHunt(hunt) {
    const role = RoleManager.getRole(hunt.currentPhase);
    const roleEmoji = role ? role.emoji : '❓';

    return `${roleEmoji} Hunt #${hunt.id}: ${hunt.featureName}`;
  }
}

module.exports = {
  HuntCycle,
  HuntCycleTracker
};
