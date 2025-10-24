/**
 * WorkflowMode Tests
 * Tests adaptive workflow for different team sizes
 */

const { WorkflowMode } = require('../../lib/team/workflow-modes');

describe('WorkflowMode', () => {
  describe('Configuration by Team Size', () => {
    test('should get solo config for team size 1', () => {
      const config = WorkflowMode.getConfigByTeamSize(1);
      expect(config.teamSize).toBe(1);
      expect(config.mode).toBe('solo');
      expect(config.columns).toHaveLength(3);
    });

    test('should get team of 2 config', () => {
      const config = WorkflowMode.getConfigByTeamSize(2);
      expect(config.teamSize).toBe(2);
      expect(config.mode).toBe('team');
      expect(config.columns).toHaveLength(3);
    });

    test('should get team of 3 config', () => {
      const config = WorkflowMode.getConfigByTeamSize(3);
      expect(config.teamSize).toBe(3);
      expect(config.mode).toBe('team');
      expect(config.columns).toHaveLength(4);
    });

    test('should get team of 4 config', () => {
      const config = WorkflowMode.getConfigByTeamSize(4);
      expect(config.teamSize).toBe(4);
      expect(config.mode).toBe('team');
      expect(config.columns.length).toBeGreaterThanOrEqual(4);
    });

    test('should throw error for invalid team size', () => {
      expect(() => WorkflowMode.getConfigByTeamSize(0)).toThrow();
      expect(() => WorkflowMode.getConfigByTeamSize(5)).toThrow();
      expect(() => WorkflowMode.getConfigByTeamSize(-1)).toThrow();
    });
  });

  describe('Column Management', () => {
    test('solo mode should have 3 columns', () => {
      const columns = WorkflowMode.getColumns(1);
      expect(columns).toHaveLength(3);
    });

    test('team of 2 should have 3 columns', () => {
      const columns = WorkflowMode.getColumns(2);
      expect(columns).toHaveLength(3);
    });

    test('team of 3 should have 4 columns', () => {
      const columns = WorkflowMode.getColumns(3);
      expect(columns).toHaveLength(4);
    });

    test('team of 4 should have at least 4 columns', () => {
      const columns = WorkflowMode.getColumns(4);
      expect(columns.length).toBeGreaterThanOrEqual(4);
    });

    test('each column should have required properties', () => {
      const columns = WorkflowMode.getColumns(3);
      columns.forEach(col => {
        expect(col).toHaveProperty('id');
        expect(col).toHaveProperty('name');
        expect(col).toHaveProperty('emoji');
        expect(col).toHaveProperty('roles');
        expect(col).toHaveProperty('position');
      });
    });
  });

  describe('Column Sequences', () => {
    test('solo mode sequence', () => {
      const sequence = WorkflowMode.getColumnSequence(1);
      expect(sequence).toEqual(['design', 'implement', 'merge']);
    });

    test('team of 2 sequence', () => {
      const sequence = WorkflowMode.getColumnSequence(2);
      expect(sequence).toHaveLength(3);
    });

    test('team of 3 sequence', () => {
      const sequence = WorkflowMode.getColumnSequence(3);
      expect(sequence).toContain('requirements');
      expect(sequence).toContain('spec');
      expect(sequence).toContain('implement');
      expect(sequence).toContain('testing');
    });

    test('sequence should be ordered by position', () => {
      for (let teamSize = 1; teamSize <= 4; teamSize++) {
        const columns = WorkflowMode.getColumns(teamSize);
        const positions = columns.map(c => c.position);
        for (let i = 0; i < positions.length - 1; i++) {
          expect(positions[i]).toBeLessThan(positions[i + 1]);
        }
      }
    });
  });

  describe('Role Mapping to Columns', () => {
    test('should get roles for requirements column in team of 3', () => {
      const roles = WorkflowMode.getRolesForColumn(3, 'requirements');
      expect(roles).toContain('requirements');
    });

    test('should get roles for spec column', () => {
      const roles = WorkflowMode.getRolesForColumn(3, 'spec');
      expect(roles).toContain('spec');
    });

    test('solo mode should have merged roles in design column', () => {
      const roles = WorkflowMode.getRolesForColumn(1, 'design');
      expect(roles).toContain('requirements');
      expect(roles).toContain('spec');
    });

    test('should throw error for non-existent column', () => {
      expect(() => {
        WorkflowMode.getRolesForColumn(3, 'invalid-column');
      }).toThrow();
    });
  });

  describe('Member to Column Mapping', () => {
    const members = [
      { username: 'alice', role: 'requirements' },
      { username: 'bob', role: 'spec' },
      { username: 'carol', role: 'implementation' },
      { username: 'dave', role: 'testing' }
    ];

    test('should map members to columns for team of 3', () => {
      const threeMembers = members.slice(0, 3);
      const mapping = WorkflowMode.mapMembersToColumns(3, threeMembers);

      expect(mapping.requirements).toBe('alice');
      expect(mapping.spec).toBe('bob');
      expect(mapping.implement).toBe('carol');
    });

    test('should map all 4 members for full pack', () => {
      const mapping = WorkflowMode.mapMembersToColumns(4, members);

      expect(mapping.requirements).toBe('alice');
      expect(mapping.spec).toBe('bob');
      expect(mapping.implement).toBe('carol');
      expect(mapping.testing).toBe('dave');
    });

    test('should throw error if member count does not match team size', () => {
      const twoMembers = members.slice(0, 2);
      expect(() => {
        WorkflowMode.mapMembersToColumns(3, twoMembers);
      }).toThrow();
    });
  });

  describe('Next Column Navigation', () => {
    test('should get next column in sequence', () => {
      const next = WorkflowMode.getNextColumn(3, 'requirements');
      expect(next).toBe('spec');

      const nextNext = WorkflowMode.getNextColumn(3, 'spec');
      expect(nextNext).toBe('implement');
    });

    test('should return null for last column', () => {
      const next = WorkflowMode.getNextColumn(3, 'testing');
      expect(next).toBeNull();
    });

    test('should throw error for invalid column', () => {
      expect(() => {
        WorkflowMode.getNextColumn(3, 'invalid-column');
      }).toThrow();
    });
  });

  describe('Column Details', () => {
    test('should get column by ID', () => {
      const column = WorkflowMode.getColumn(3, 'spec');
      expect(column).toBeDefined();
      expect(column.id).toBe('spec');
      expect(column.name).toBeDefined();
    });

    test('should return null for non-existent column', () => {
      const column = WorkflowMode.getColumn(3, 'invalid');
      expect(column).toBeUndefined();
    });

    test('each column should have description', () => {
      const columns = WorkflowMode.getColumns(3);
      columns.forEach(col => {
        expect(col.description).toBeDefined();
        expect(col.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Recommendations', () => {
    test('should get recommendations for solo mode', () => {
      const recs = WorkflowMode.getRecommendations(1);
      expect(recs).toHaveProperty('teamSize', 1);
      expect(recs).toHaveProperty('mode', 'solo');
      expect(recs).toHaveProperty('recommendations');
      expect(Array.isArray(recs.recommendations)).toBe(true);
    });

    test('should get recommendations for team of 2', () => {
      const recs = WorkflowMode.getRecommendations(2);
      expect(recs.teamSize).toBe(2);
      expect(recs.recommendations.length).toBeGreaterThan(0);
    });

    test('should get recommendations for team of 3', () => {
      const recs = WorkflowMode.getRecommendations(3);
      expect(recs.teamSize).toBe(3);
      expect(recs.recommendations.length).toBeGreaterThan(0);
    });

    test('should get recommendations for team of 4', () => {
      const recs = WorkflowMode.getRecommendations(4);
      expect(recs.teamSize).toBe(4);
      expect(recs.recommendations.length).toBeGreaterThan(0);
    });

    test('recommendations should include column count', () => {
      const recs = WorkflowMode.getRecommendations(3);
      expect(recs).toHaveProperty('columnCount');
      expect(recs.columnCount).toBe(4);
    });
  });

  describe('GitHub Setup Instructions', () => {
    const members = [
      { username: 'alice', role: 'requirements' },
      { username: 'bob', role: 'spec' },
      { username: 'carol', role: 'implementation' },
      { username: 'dave', role: 'testing' }
    ];

    test('should generate setup instructions for team of 3', () => {
      const threeMembers = members.slice(0, 3);
      const instructions = WorkflowMode.getGitHubSetupInstructions(
        3,
        threeMembers
      );

      expect(instructions.teamSize).toBe(3);
      expect(instructions.columnCount).toBe(4);
      expect(Array.isArray(instructions.columns)).toBe(true);
      expect(Array.isArray(instructions.setup)).toBe(true);
    });

    test('setup should include member assignments', () => {
      const threeMembers = members.slice(0, 3);
      const instructions = WorkflowMode.getGitHubSetupInstructions(
        3,
        threeMembers
      );

      const setupStr = instructions.setup.join('\n');
      expect(setupStr).toContain('alice');
      expect(setupStr).toContain('bob');
      expect(setupStr).toContain('carol');
    });

    test('should include column names in setup', () => {
      const instructions = WorkflowMode.getGitHubSetupInstructions(
        3,
        members.slice(0, 3)
      );

      const setupStr = instructions.setup.join('\n');
      expect(setupStr).toContain('Requirements');
      expect(setupStr).toContain('Specification');
    });
  });

  describe('Mode Constants', () => {
    test('should have MODES object', () => {
      expect(WorkflowMode.MODES).toBeDefined();
      expect(WorkflowMode.MODES.SOLO).toBe('solo');
      expect(WorkflowMode.MODES.TEAM).toBe('team');
    });
  });

  describe('Parallelizable Phases', () => {
    test('solo mode should identify merged roles', () => {
      const config = WorkflowMode.getConfigByTeamSize(1);
      const merged = config.columns.filter(c => c.merged);
      expect(merged.length).toBeGreaterThan(0);
    });

    test('should identify columns with multiple roles', () => {
      const config = WorkflowMode.getConfigByTeamSize(1);
      const multiRole = config.columns.filter(
        c => Array.isArray(c.roles) && c.roles.length > 1
      );
      expect(multiRole.length).toBeGreaterThan(0);
    });
  });
});
