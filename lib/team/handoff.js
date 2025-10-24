/**
 * LionPack Handoff Engine
 * Manages automatic role-to-role transitions in hunt cycles
 */

const { RoleManager } = require('./roles');

/**
 * Handoff Engine
 * Orchestrates seamless transitions between hunt phases
 */
class HandoffEngine {
  /**
   * Execute handoff from one role to next
   * @param {HuntCycleTracker} tracker
   * @param {TeamPack} pack
   * @param {string} huntId
   * @param {string} fromRole
   * @param {string} toRole
   * @param {Object} context - Data to pass to next role
   */
  static async executeHandoff(tracker, pack, huntId, fromRole, toRole, context = {}) {
    // Validate handoff
    this.validateHandoff(fromRole, toRole);

    // Get target team member
    const toMember = pack.getMemberByRole(toRole);

    if (!toMember) {
      throw new Error(`No team member assigned to role: ${toRole}`);
    }

    // Get hunt
    const hunt = tracker.getHunt(huntId);
    if (!hunt) {
      throw new Error(`Hunt not found: ${huntId}`);
    }

    // Transition hunt
    await tracker.transitionHunt(huntId, toRole, toMember.username);

    // Create handoff record
    const handoff = {
      fromRole,
      toRole,
      fromMember: hunt.currentRole,
      toMember: toMember.username,
      timestamp: new Date().toISOString(),
      context
    };

    return handoff;
  }

  /**
   * Validate handoff is correct sequence
   */
  static validateHandoff(fromRole, toRole) {
    const nextExpected = RoleManager.getNextRole(fromRole);

    if (!nextExpected || nextExpected.id !== toRole) {
      throw new Error(
        `Invalid handoff: ${fromRole} → ${toRole}. Expected ${fromRole} → ${nextExpected?.id}`
      );
    }
  }

  /**
   * Format handoff notification
   */
  static formatHandoffNotification(fromRole, toRole, huntId, huntName) {
    const fromRoleInfo = RoleManager.getRole(fromRole);
    const toRoleInfo = RoleManager.getRole(toRole);

    return `
🤝 **Handoff: ${huntName}**

**From:** ${fromRoleInfo.emoji} ${fromRoleInfo.name}
**To:** ${toRoleInfo.emoji} ${toRoleInfo.name}

**Hunt:** #${huntId}

Your turn to hunt! 🦁
    `.trim();
  }

  /**
   * Generate handoff summary
   */
  static generateHandoffSummary(hunt, toRole) {
    const toRoleInfo = RoleManager.getRole(toRole);
    const prevPhase = hunt.phaseHistory[hunt.phaseHistory.length - 2];

    const summary = {
      title: `${toRoleInfo.emoji} Ready for ${toRoleInfo.name}`,
      huntId: hunt.id,
      feature: hunt.featureName,
      toRole: toRole,
      previousPhase: prevPhase?.phase,
      previousAssignee: prevPhase?.assignee,
      previousDuration: prevPhase?.duration
    };

    return summary;
  }

  /**
   * Get handoff workflow sequence
   * Returns the full sequence of handoffs needed
   */
  static getWorkflowSequence() {
    const sequence = RoleManager.getSequence();
    const handoffs = [];

    for (let i = 0; i < sequence.length - 1; i++) {
      handoffs.push({
        from: sequence[i],
        to: sequence[i + 1],
        fromRole: RoleManager.getRole(sequence[i]),
        toRole: RoleManager.getRole(sequence[i + 1])
      });
    }

    return handoffs;
  }

  /**
   * Check if hunt can proceed to next phase
   */
  static canProceedToNextPhase(hunt, nextRole) {
    // Hunt must be in-progress
    if (hunt.status !== 'in-progress') {
      return false;
    }

    // Current role must have completed work
    if (!hunt.currentPhase) {
      return false;
    }

    // Next role must be valid sequence
    try {
      this.validateHandoff(hunt.currentPhase, nextRole);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Simulate handoff without persisting
   * Useful for validation or testing
   */
  static simulateHandoff(hunt, toRole) {
    if (!this.canProceedToNextPhase(hunt, toRole)) {
      return {
        success: false,
        reason: 'Hunt cannot proceed to next phase'
      };
    }

    return {
      success: true,
      from: hunt.currentPhase,
      to: toRole,
      message: `Handoff ready: ${hunt.currentPhase} → ${toRole}`
    };
  }
}

module.exports = {
  HandoffEngine
};
