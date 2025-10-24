/**
 * LionPack Workflow Modes
 * Manages solo vs team mode workflows with adaptive phases
 * Adapts workflow complexity based on team size (1-4 people)
 */

/**
 * WorkflowMode
 * Defines workflow configurations for different team sizes
 */
class WorkflowMode {
  static MODES = {
    SOLO: 'solo',
    TEAM: 'team'
  };

  // SOLO MODE: 1 person, 3 phases (roles merged for speed)
  static SOLO_CONFIG = {
    mode: 'solo',
    teamSize: 1,
    description: 'Single developer - roles merged for speed',
    columns: [
      {
        id: 'design',
        name: '📋 Design & Requirements',
        emoji: '📋',
        roles: ['requirements', 'spec'],
        merged: true,
        description: 'Define requirements and design simultaneously',
        position: 1
      },
      {
        id: 'implement',
        name: '🎯 Implementation',
        emoji: '🎯',
        roles: ['implementation'],
        merged: false,
        description: 'Code feature with full test coverage',
        position: 2
      },
      {
        id: 'merge',
        name: '✅ Testing & Merge',
        emoji: '✅',
        roles: ['testing'],
        merged: true,
        description: 'Run tests and merge to main',
        position: 3
      }
    ]
  };

  // TEAM OF 2: Minimal split, focus on parallel work
  static TEAM_OF_2_CONFIG = {
    mode: 'team',
    teamSize: 2,
    description: 'Two developers - split specialized work',
    columns: [
      {
        id: 'requirements',
        name: '🔍 Requirements',
        emoji: '🔍',
        roles: ['requirements'],
        merged: false,
        description: 'Analyze scope and acceptance criteria',
        position: 1
      },
      {
        id: 'spec-impl',
        name: '📋 Design & Implement',
        emoji: '📋',
        roles: ['spec', 'implementation'],
        merged: true,
        description: 'Design architecture and code feature',
        position: 2
      },
      {
        id: 'testing',
        name: '✅ Testing & Merge',
        emoji: '✅',
        roles: ['testing'],
        merged: false,
        description: 'Validate and merge to main',
        position: 3
      }
    ]
  };

  // TEAM OF 3: Balanced workflow, three distinct phases
  static TEAM_OF_3_CONFIG = {
    mode: 'team',
    teamSize: 3,
    description: 'Three developers - specialized roles',
    columns: [
      {
        id: 'requirements',
        name: '🔍 Requirements',
        emoji: '🔍',
        roles: ['requirements'],
        merged: false,
        description: 'Analyze scope and acceptance criteria',
        position: 1
      },
      {
        id: 'spec',
        name: '📋 Specification',
        emoji: '📋',
        roles: ['spec'],
        merged: false,
        description: 'Design architecture and break tasks',
        position: 2
      },
      {
        id: 'implement',
        name: '🎯 Implementation',
        emoji: '🎯',
        roles: ['implementation'],
        merged: false,
        description: 'Code features with test coverage',
        position: 3
      },
      {
        id: 'testing',
        name: '✅ Testing & Merge',
        emoji: '✅',
        roles: ['testing'],
        merged: false,
        description: 'Validate quality and merge',
        position: 4
      }
    ]
  };

  // TEAM OF 4: Full pack - all four specialized roles
  static TEAM_OF_4_CONFIG = {
    mode: 'team',
    teamSize: 4,
    description: 'Full pack - all specialized roles',
    columns: [
      {
        id: 'requirements',
        name: '🔍 Requirements',
        emoji: '🔍',
        roles: ['requirements'],
        merged: false,
        description: 'Analyze scope and acceptance criteria',
        position: 1
      },
      {
        id: 'spec',
        name: '📋 Specification',
        emoji: '📋',
        roles: ['spec'],
        merged: false,
        description: 'Design architecture and break tasks',
        position: 2
      },
      {
        id: 'implement',
        name: '🎯 Implementation',
        emoji: '🎯',
        roles: ['implementation'],
        merged: false,
        description: 'Code features with full coverage',
        position: 3
      },
      {
        id: 'testing',
        name: '✅ Testing & Review',
        emoji: '✅',
        roles: ['testing'],
        merged: false,
        description: 'Validate quality and approvals',
        position: 4
      },
      {
        id: 'deploy',
        name: '🚀 Deploy',
        emoji: '🚀',
        roles: null,
        merged: false,
        optional: true,
        description: 'Final merge and deployment',
        position: 5
      }
    ]
  };

  /**
   * Get workflow config by team size
   */
  static getConfigByTeamSize(teamSize) {
    const configs = {
      1: this.SOLO_CONFIG,
      2: this.TEAM_OF_2_CONFIG,
      3: this.TEAM_OF_3_CONFIG,
      4: this.TEAM_OF_4_CONFIG
    };

    if (!configs[teamSize]) {
      throw new Error('Team size must be 1-4 people');
    }

    return configs[teamSize];
  }

  /**
   * Get all columns for workflow
   */
  static getColumns(teamSize) {
    const config = this.getConfigByTeamSize(teamSize);
    return config.columns;
  }

  /**
   * Get column sequence (ordered list of column IDs)
   */
  static getColumnSequence(teamSize) {
    const config = this.getConfigByTeamSize(teamSize);
    return config.columns
      .sort((a, b) => a.position - b.position)
      .map(c => c.id);
  }

  /**
   * Get roles for a specific column
   */
  static getRolesForColumn(teamSize, columnId) {
    const config = this.getConfigByTeamSize(teamSize);
    const column = config.columns.find(c => c.id === columnId);

    if (!column) {
      throw new Error(`Column ${columnId} not found for team size ${teamSize}`);
    }

    if (!column.roles) return [];
    if (Array.isArray(column.roles)) return column.roles;
    return [column.roles];
  }

  /**
   * Get next column in sequence
   */
  static getNextColumn(teamSize, currentColumnId) {
    const sequence = this.getColumnSequence(teamSize);
    const currentIndex = sequence.indexOf(currentColumnId);

    if (currentIndex === -1) {
      throw new Error(`Column ${currentColumnId} not found in sequence`);
    }

    if (currentIndex === sequence.length - 1) {
      return null; // Reached end
    }

    return sequence[currentIndex + 1];
  }

  /**
   * Get column by ID
   */
  static getColumn(teamSize, columnId) {
    const config = this.getConfigByTeamSize(teamSize);
    return config.columns.find(c => c.id === columnId);
  }

  /**
   * Map team members to columns by role
   * Returns { [columnId]: assignee }
   */
  static mapMembersToColumns(teamSize, members) {
    const config = this.getConfigByTeamSize(teamSize);

    // Validate member count matches team size
    if (members.length !== teamSize) {
      throw new Error(`Member count (${members.length}) does not match team size (${teamSize})`);
    }

    const mapping = {};

    config.columns.forEach(column => {
      if (!column.roles) return;

      // Find member with matching role
      const assignedRoles = Array.isArray(column.roles)
        ? column.roles
        : [column.roles];

      const assignee = members.find(m => assignedRoles.includes(m.role));

      if (assignee) {
        mapping[column.id] = assignee.username;
      }
    });

    return mapping;
  }

  /**
   * Get team recommendations
   */
  static getRecommendations(teamSize) {
    const config = this.getConfigByTeamSize(teamSize);

    return {
      teamSize,
      mode: config.mode,
      columnCount: config.columns.length,
      description: config.description,
      parallelizable: this._getParallelPhases(config.columns),
      recommendations: this._generateRecommendations(teamSize, config)
    };
  }

  /**
   * Get GitHub board setup instructions
   */
  static getGitHubSetupInstructions(teamSize, members) {
    const config = this.getConfigByTeamSize(teamSize);
    const mapping = this.mapMembersToColumns(teamSize, members);

    const instructions = {
      teamSize,
      mode: config.mode,
      columnCount: config.columns.length,
      columns: config.columns.map(col => ({
        name: col.name,
        description: col.description,
        assignee: mapping[col.id] || 'Unassigned',
        roles: col.roles || [],
        optional: col.optional || false
      })),
      setup: [
        `1. Create GitHub Project board for your repository`,
        `2. Create ${config.columns.length} columns with these names:`,
        ...config.columns.map(c => `   - ${c.name}`),
        `3. Set column automation:`,
        ...config.columns.map(c => `   - ${c.id}: Move to column on workflow change`),
        `4. Assign team members to columns:`,
        ...Object.entries(mapping).map(([colId, member]) => {
          const col = config.columns.find(c => c.id === colId);
          return `   - ${col.name}: ${member}`;
        })
      ]
    };

    return instructions;
  }

  // Private helper methods

  static _getParallelPhases(columns) {
    return columns
      .filter(c => Array.isArray(c.roles) && c.roles.length > 1)
      .map(c => c.name);
  }

  static _generateRecommendations(teamSize, config) {
    const recs = [];

    if (teamSize === 1) {
      recs.push('✓ Solo mode: Merged roles for maximum speed');
      recs.push('✓ Minimum columns: Focus on delivery');
      recs.push('→ Can upgrade to team mode as you grow');
    } else if (teamSize === 2) {
      recs.push('✓ Efficient pair: Clear role separation');
      recs.push('✓ Daily sync recommended');
      recs.push('→ Critical: Spec-to-Implementation handoff');
    } else if (teamSize === 3) {
      recs.push('✓ Balanced pack: Good parallelization');
      recs.push('✓ Typical bottleneck: Implementation phase');
      recs.push('→ Consider adding fourth member for faster delivery');
    } else if (teamSize === 4) {
      recs.push('✓ Full pack: All specializations active');
      recs.push('✓ Maximum parallelization achieved');
      recs.push('→ Optimal for complex features');
    }

    return recs;
  }
}

module.exports = {
  WorkflowMode
};
