/**
 * RoleManager Tests
 * Tests role definitions, sequences, and keyword routing
 */

const { RoleManager } = require('../../lib/team/roles');

describe('RoleManager', () => {
  describe('Role Definitions', () => {
    test('should have 5 roles defined', () => {
      const roles = RoleManager.getAllRoles();
      expect(roles).toHaveLength(5);
    });

    test('should have requirements role', () => {
      const role = RoleManager.getRole('requirements');
      expect(role).toBeDefined();
      expect(role.id).toBe('requirements');
      expect(role.name).toContain('Requirements');
    });

    test('should have spec role', () => {
      const role = RoleManager.getRole('spec');
      expect(role).toBeDefined();
      expect(role.id).toBe('spec');
      expect(role.name).toContain('Spec');
    });

    test('should have implementation role', () => {
      const role = RoleManager.getRole('implementation');
      expect(role).toBeDefined();
      expect(role.id).toBe('implementation');
      expect(role.name).toContain('Implement');
    });

    test('should have testing role', () => {
      const role = RoleManager.getRole('testing');
      expect(role).toBeDefined();
      expect(role.id).toBe('testing');
      expect(role.name).toContain('Test');
    });

    test('role should have required properties', () => {
      const role = RoleManager.getRole('requirements');
      expect(role).toHaveProperty('id');
      expect(role).toHaveProperty('name');
      expect(role).toHaveProperty('emoji');
      expect(role).toHaveProperty('color');
      expect(role).toHaveProperty('aiAgent');
      expect(role).toHaveProperty('keywordTriggers');
      expect(role).toHaveProperty('responsibilities');
      expect(role).toHaveProperty('sequenceOrder');
    });

    test('should return null for invalid role', () => {
      const role = RoleManager.getRole('invalid-role');
      expect(role).toBeNull();
    });
  });

  describe('Role Sequences', () => {
    test('should return ordered sequence of roles', () => {
      const sequence = RoleManager.getSequence();
      expect(sequence).toEqual([
        'requirements',
        'spec',
        'implementation',
        'testing',
        'deploy'
      ]);
    });

    test('should get next role in sequence', () => {
      const next = RoleManager.getNextRole('requirements');
      expect(next).toBe('spec');

      const nextNext = RoleManager.getNextRole('spec');
      expect(nextNext).toBe('implementation');

      const nextNextNext = RoleManager.getNextRole('implementation');
      expect(nextNextNext).toBe('testing');

      const lastNext = RoleManager.getNextRole('testing');
      expect(lastNext).toBe('deploy');
    });

    test('should return null for last role in sequence', () => {
      const next = RoleManager.getNextRole('deploy');
      expect(next).toBeNull();
    });

    test('should get previous role in sequence', () => {
      const prev = RoleManager.getPreviousRole('testing');
      expect(prev).toBe('implementation');

      const prevPrev = RoleManager.getPreviousRole('implementation');
      expect(prevPrev).toBe('spec');
    });

    test('should return null for first role in sequence', () => {
      const prev = RoleManager.getPreviousRole('requirements');
      expect(prev).toBeNull();
    });
  });

  describe('Keyword Routing', () => {
    test('should find role by requirements keywords', () => {
      const keywords = [
        'requirements',
        'scope',
        'criteria',
        'acceptance',
        'analyze',
        'definition'
      ];

      keywords.forEach(keyword => {
        const role = RoleManager.findRoleByKeyword(keyword);
        expect(role).toBeDefined();
        expect(role.id).toBe('requirements');
      });
    });

    test('should find role by spec keywords', () => {
      const keywords = [
        'specification',
        'design',
        'architecture',
        'api',
        'schema',
        'structure'
      ];

      keywords.forEach(keyword => {
        const role = RoleManager.findRoleByKeyword(keyword);
        expect(role).toBeDefined();
        expect(role.id).toBe('spec');
      });
    });

    test('should find role by implementation keywords', () => {
      const keywords = [
        'implement',
        'code',
        'build',
        'develop',
        'function',
        'feature'
      ];

      keywords.forEach(keyword => {
        const role = RoleManager.findRoleByKeyword(keyword);
        expect(role).toBeDefined();
        expect(role.id).toBe('implementation');
      });
    });

    test('should find role by testing keywords', () => {
      const keywords = [
        'test',
        'verify',
        'validate',
        'check',
        'qa',
        'quality'
      ];

      keywords.forEach(keyword => {
        const role = RoleManager.findRoleByKeyword(keyword);
        expect(role).toBeDefined();
        expect(role.id).toBe('testing');
      });
    });

    test('should match keywords case-insensitively', () => {
      const role1 = RoleManager.findRoleByKeyword('REQUIREMENTS');
      const role2 = RoleManager.findRoleByKeyword('Requirements');
      const role3 = RoleManager.findRoleByKeyword('requirements');

      expect(role1.id).toBe('requirements');
      expect(role2.id).toBe('requirements');
      expect(role3.id).toBe('requirements');
    });

    test('should return null for non-matching keyword', () => {
      const role = RoleManager.findRoleByKeyword('xyz-invalid-keyword');
      expect(role).toBeNull();
    });

    test('should find best match for text with multiple keywords', () => {
      const text = 'We need to test and validate the implementation';
      const role = RoleManager.findRoleByKeyword(text);
      expect(role).toBeDefined();
      expect(role.id).toBe('testing');
    });
  });

  describe('Role Validation', () => {
    test('should validate correct role', () => {
      expect(RoleManager.validateRole('requirements')).toBe(true);
      expect(RoleManager.validateRole('spec')).toBe(true);
      expect(RoleManager.validateRole('implementation')).toBe(true);
      expect(RoleManager.validateRole('testing')).toBe(true);
    });

    test('should reject invalid role', () => {
      expect(RoleManager.validateRole('invalid')).toBe(false);
      expect(RoleManager.validateRole('')).toBe(false);
      expect(RoleManager.validateRole(null)).toBe(false);
    });
  });

  describe('Sequence Navigation', () => {
    test('should check if role is first in sequence', () => {
      expect(RoleManager.isFirstInSequence('requirements')).toBe(true);
      expect(RoleManager.isFirstInSequence('spec')).toBe(false);
      expect(RoleManager.isFirstInSequence('testing')).toBe(false);
    });

    test('should check if role is last in sequence', () => {
      expect(RoleManager.isLastInSequence('deploy')).toBe(true);
      expect(RoleManager.isLastInSequence('testing')).toBe(false);
      expect(RoleManager.isLastInSequence('requirements')).toBe(false);
      expect(RoleManager.isLastInSequence('implementation')).toBe(false);
    });

    test('should check if transition is valid', () => {
      expect(RoleManager.isValidTransition('requirements', 'spec')).toBe(true);
      expect(RoleManager.isValidTransition('spec', 'implementation')).toBe(true);
      expect(RoleManager.isValidTransition('spec', 'requirements')).toBe(false);
      expect(RoleManager.isValidTransition('requirements', 'testing')).toBe(false);
    });
  });

  describe('Role Properties', () => {
    test('each role should have emoji', () => {
      RoleManager.getSequence().forEach(roleId => {
        const role = RoleManager.getRole(roleId);
        expect(role.emoji).toBeDefined();
        expect(role.emoji.length).toBeGreaterThan(0);
      });
    });

    test('each role should have color', () => {
      RoleManager.getSequence().forEach(roleId => {
        const role = RoleManager.getRole(roleId);
        expect(role.color).toBeDefined();
        expect(role.color.match(/^#?[0-9A-Fa-f]{6}$/)).toBeTruthy();
      });
    });

    test('each role should have AI agent', () => {
      RoleManager.getSequence().forEach(roleId => {
        const role = RoleManager.getRole(roleId);
        expect(role.aiAgent).toBeDefined();
        expect(role.aiAgent.length).toBeGreaterThan(0);
      });
    });

    test('each role should have keyword triggers', () => {
      RoleManager.getSequence().forEach(roleId => {
        const role = RoleManager.getRole(roleId);
        expect(Array.isArray(role.keywordTriggers)).toBe(true);
        expect(role.keywordTriggers.length).toBeGreaterThan(0);
      });
    });

    test('each role should have responsibilities', () => {
      RoleManager.getSequence().forEach(roleId => {
        const role = RoleManager.getRole(roleId);
        expect(Array.isArray(role.responsibilities)).toBe(true);
        expect(role.responsibilities.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getAllRoles', () => {
    test('should return all 5 roles in sequence', () => {
      const roles = RoleManager.getAllRoles();
      expect(roles).toHaveLength(5);
      expect(roles[0].id).toBe('requirements');
      expect(roles[1].id).toBe('spec');
      expect(roles[2].id).toBe('implementation');
      expect(roles[3].id).toBe('testing');
      expect(roles[4].id).toBe('deploy');
    });

    test('all returned roles should be valid', () => {
      const roles = RoleManager.getAllRoles();
      roles.forEach(role => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('name');
        expect(role).toHaveProperty('sequenceOrder');
        expect(RoleManager.validateRole(role.id)).toBe(true);
      });
    });
  });
});
