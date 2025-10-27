/**
 * LionPack Role Manager
 * Defines and manages the 4 specialized team roles
 *
 * 🦁 The Four Hunters:
 * - Requirements Hunter: Analyzes scope
 * - Spec Refiner: Designs architecture
 * - Implementation Hunter: Codes features
 * - QA Specialist: Validates quality
 */

/**
 * Role definitions with metadata and keyword triggers
 * @type {Object}
 */
const ROLES = {
  requirements: {
    id: 'requirements',
    name: 'Requirements Hunter',
    emoji: '🔍',
    color: '#FF6B6B',
    description: 'Analyzes requirements and defines scope',
    icon: 'search',

    gitHubLabel: 'role-requirements',
    aiAgent: 'requirements-analyzer',
    estimatedDuration: '2-4 hours',

    responsibilities: [
      'Analyze user needs and business requirements',
      'Define scope, constraints, and success criteria',
      'Identify edge cases and non-functional requirements',
      'Create initial problem statement',
      'Document assumptions and risks'
    ],

    keywordTriggers: [
      'user story',
      'requirement',
      'scope',
      'acceptance criteria',
      'feature request',
      'user need',
      'business requirement',
      'story',
      'analyze',
      'definition'
    ],

    sequenceOrder: 1
  },

  spec: {
    id: 'spec',
    name: 'Specification Refiner',
    emoji: '📋',
    color: '#4ECDC4',
    description: 'Creates specifications and prepares issues',
    icon: 'file-text',

    gitHubLabel: 'role-spec',
    aiAgent: 'spec-master',
    estimatedDuration: '4-8 hours',

    responsibilities: [
      'Take requirements and create detailed specifications',
      'Break down complex features into testable chunks',
      'Prepare focused GitHub issues for implementation',
      'Identify risks and dependencies',
      'Create implementation roadmap'
    ],

    keywordTriggers: [
      'specification',
      'spec',
      'design',
      'architecture',
      'breakdown',
      'task breakdown',
      'technical design',
      'interface',
      'api',
      'schema',
      'structure'
    ],

    sequenceOrder: 2
  },

  implementation: {
    id: 'implementation',
    name: 'Implementation Hunter',
    emoji: '🎯',
    color: '#45B7D1',
    description: 'Codes features based on specifications',
    icon: 'code',

    gitHubLabel: 'role-implementation',
    aiAgent: 'implementation-expert',
    estimatedDuration: '1-3 days per task',

    responsibilities: [
      'Code features based on specifications',
      'Implement according to acceptance criteria',
      'Make implementation decisions within spec boundaries',
      'Create commits with clear traceability',
      'Open pull requests with complete context'
    ],

    keywordTriggers: [
      'implement',
      'code',
      'feature',
      'component',
      'API',
      'backend',
      'frontend',
      'development',
      'build',
      'develop',
      'function'
    ],

    sequenceOrder: 3
  },

  testing: {
    id: 'testing',
    name: 'QA & Testing Specialist',
    emoji: '✅',
    color: '#96CEB4',
    description: 'Tests and validates implementation',
    icon: 'check-circle',

    gitHubLabel: 'role-testing',
    aiAgent: 'qa-expert',
    estimatedDuration: '2-4 hours per task',

    responsibilities: [
      'Test implementation against acceptance criteria',
      'Validate edge cases defined in requirements',
      'Verify no regressions',
      'Review code quality and test coverage',
      'Approve or request changes'
    ],

    keywordTriggers: [
      'test',
      'verify',
      'quality',
      'coverage',
      'regression',
      'QA',
      'testing',
      'validation',
      'validate',
      'check',
      'qa'
    ],

    sequenceOrder: 4
  },

  deploy: {
    id: 'deploy',
    name: 'Deployment Specialist',
    emoji: '🚀',
    color: '#FF6B35',
    description: 'Deploys and releases to production',
    icon: 'rocket',

    gitHubLabel: 'role-deploy',
    aiAgent: 'deploy-expert',
    estimatedDuration: '1-2 hours',

    responsibilities: [
      'Merge approved PRs to main branch',
      'Create release tags and notes',
      'Deploy to production environments',
      'Monitor deployment health',
      'Rollback if issues detected'
    ],

    keywordTriggers: [
      'deploy',
      'release',
      'production',
      'merge',
      'ship',
      'launch',
      'rollout'
    ],

    sequenceOrder: 5
  }
};

/**
 * Role Manager
 * Centralized management of team roles and routing
 */
class RoleManager {
  /**
   * Get all available roles
   * @returns {Object[]} Array of all roles
   */
  static getAllRoles() {
    return Object.values(ROLES).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  /**
   * Get role by ID
   * @param {string} roleId - requirements|spec|implementation|testing|deploy
   * @returns {Object|null} Role object or null if not found
   */
  static getRole(roleId) {
    return ROLES[roleId] || null;
  }

  /**
   * Get role by name (case-insensitive)
   * @param {string} name - Full role name
   * @returns {Object|null} Role object or null
   */
  static getRoleByName(name) {
    const lowerName = name.toLowerCase();
    return Object.values(ROLES).find(
      role => role.name.toLowerCase() === lowerName
    ) || null;
  }

  /**
   * Validate role exists
   * @param {string} roleId
   * @returns {boolean}
   */
  static validateRole(roleId) {
    if (!roleId || typeof roleId !== 'string') {
      return false;
    }
    return !!ROLES[roleId];
  }

  /**
   * Find role by keyword trigger (for AI routing)
   * @param {string} text - Text containing keywords
   * @returns {Object|null} Matching role or null
   */
  static findRoleByKeyword(text) {
    if (!text) return null;

    const lowerText = text.toLowerCase();
    const matches = [];

    // Find all matching roles and count matches
    for (const role of Object.values(ROLES)) {
      let exactMatches = 0;
      let partialMatches = 0;
      
      for (const trigger of role.keywordTriggers) {
        const lowerTrigger = trigger.toLowerCase();
        
        // Check for exact match (input equals trigger)
        if (lowerText === lowerTrigger) {
          exactMatches++;
          continue;
        }
        
        // Check for phrase match (input contains full trigger)
        if (lowerText.includes(lowerTrigger)) {
          partialMatches++;
          continue;
        }
        
        // Check for word match (trigger contains input as complete word)
        const escapedInput = lowerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`\\b${escapedInput}\\b`).test(lowerTrigger)) {
          partialMatches++;
        }
      }
      
      if (exactMatches > 0 || partialMatches > 0) {
        matches.push({ role, exactMatches, partialMatches });
      }
    }    if (matches.length === 0) return null;

    // Return role with most matches, prioritizing exact over partial
    // Sort by: exact matches desc, partial matches desc, sequence order asc
    matches.sort((a, b) => {
      if (b.exactMatches !== a.exactMatches) {
        return b.exactMatches - a.exactMatches;
      }
      if (b.partialMatches !== a.partialMatches) {
        return b.partialMatches - a.partialMatches;
      }
      return a.role.sequenceOrder - b.role.sequenceOrder;
    });

    return matches[0].role;
  }

  /**
   * Get previous role in hunt cycle sequence
   * @param {string} roleId
   * @returns {string|null} Previous role ID or null if first
   */
  static getPreviousRole(roleId) {
    const role = this.getRole(roleId);
    const sequence = this.getAllRoles();
    const index = sequence.findIndex(r => r.id === roleId);

    if (index <= 0) return null;
    return sequence[index - 1].id;
  }

  /**
   * Get next role in hunt cycle sequence
   * @param {string} roleId
   * @returns {string|null} Next role ID or null if last
   */
  static getNextRole(roleId) {
    const role = this.getRole(roleId);
    const sequence = this.getAllRoles();
    const index = sequence.findIndex(r => r.id === roleId);

    if (index >= sequence.length - 1) return null;
    return sequence[index + 1].id;
  }

  /**
   * Get role sequence (array of role IDs)
   * @returns {string[]} Role IDs in sequence order
   */
  static getSequence() {
    return this.getAllRoles().map(r => r.id);
  }

  /**
   * Check if roleA comes before roleB in sequence
   * @param {string} roleAId
   * @param {string} roleBId
   * @returns {boolean}
   */
  static isSequenceBefore(roleAId, roleBId) {
    const sequence = this.getSequence();
    const indexA = sequence.indexOf(roleAId);
    const indexB = sequence.indexOf(roleBId);

    if (indexA < 0 || indexB < 0) {
      throw new Error('Invalid role IDs');
    }

    return indexA < indexB;
  }

  /**
   * Get roles display string for UI
   * @returns {string} Formatted string with emojis and names
   */
  static getDisplayString() {
    return this.getAllRoles()
      .map(r => `${r.emoji} ${r.name}`)
      .join(' → ');
  }

  /**
   * Get role by emoji
   * @param {string} emoji
   * @returns {Object|null}
   */
  static getRoleByEmoji(emoji) {
    return Object.values(ROLES).find(r => r.emoji === emoji) || null;
  }

  /**
   * Format role for display
   * @param {string} roleId
   * @returns {string} Formatted: "🔍 Requirements Hunter"
   */
  static formatRole(roleId) {
    const role = this.getRole(roleId);
    return `${role.emoji} ${role.name}`;
  }

  /**
   * Check if role is first in sequence
   * @param {string} roleId
   * @returns {boolean}
   */
  static isFirstInSequence(roleId) {
    const sequence = this.getSequence();
    return sequence[0] === roleId;
  }

  /**
   * Check if role is last in sequence
   * @param {string} roleId
   * @returns {boolean}
   */
  static isLastInSequence(roleId) {
    const sequence = this.getSequence();
    return sequence[sequence.length - 1] === roleId;
  }

  /**
   * Check if transition from roleA to roleB is valid (sequential)
   * @param {string} roleAId
   * @param {string} roleBId
   * @returns {boolean}
   */
  static isValidTransition(roleAId, roleBId) {
    const nextRole = this.getNextRole(roleAId);
    return nextRole ? nextRole === roleBId : false;
  }
}

/**
 * Export for use throughout LionPack
 */
module.exports = {
  ROLES,
  RoleManager
};
