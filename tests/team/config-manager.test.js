/**
 * ConfigurationManager Tests
 * Tests team setup, member management, and workflow adaptation
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { ConfigurationManager } = require('../../lib/team/config-manager');

describe('ConfigurationManager', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `leo-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
  });

  afterEach(async () => {
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }
  });

  describe('Initialization', () => {
    test('should initialize solo configuration', async () => {
      const manager = new ConfigurationManager(tempDir);
      const config = await manager.initialize({
        name: 'Solo Project',
        org: 'my-org',
        repo: 'my-repo',
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      expect(config.teamSize).toBe(1);
      expect(config.mode).toBe('solo');
      expect(config.members).toHaveLength(1);
    });

    test('should initialize team configuration', async () => {
      const manager = new ConfigurationManager(tempDir);
      const config = await manager.initialize({
        name: 'Team Project',
        org: 'my-org',
        repo: 'my-repo',
        teamSize: 3,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      expect(config.teamSize).toBe(3);
      expect(config.mode).toBe('team');
      expect(config.members).toHaveLength(3);
    });

    test('should throw error if team size is invalid', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(
        manager.initialize({
          teamSize: 5,
          members: []
        })
      ).rejects.toThrow();
    });

    test('should throw error if member count does not match team size', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(
        manager.initialize({
          teamSize: 3,
          members: [
            { username: 'alice', role: 'requirements' },
            { username: 'bob', role: 'spec' }
          ]
        })
      ).rejects.toThrow();
    });

    test('should throw error if member has no username', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(
        manager.initialize({
          teamSize: 1,
          members: [{ role: 'requirements' }]
        })
      ).rejects.toThrow();
    });

    test('should throw error if member has invalid role', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(
        manager.initialize({
          teamSize: 1,
          members: [{ username: 'alice', role: 'invalid-role' }]
        })
      ).rejects.toThrow();
    });
  });

  describe('Configuration Persistence', () => {
    test('should save configuration to .leo.json', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        name: 'Test Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      const configPath = path.join(tempDir, '.leo.json');
      const exists = await fs.pathExists(configPath);
      expect(exists).toBe(true);
    });

    test('should load existing configuration', async () => {
      const manager1 = new ConfigurationManager(tempDir);
      await manager1.initialize({
        name: 'Test Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 2,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' }
        ]
      });

      const manager2 = new ConfigurationManager(tempDir);
      const config = await manager2.load();

      expect(config).toBeDefined();
      expect(config.teamSize).toBe(2);
      expect(config.members).toHaveLength(2);
    });

    test('should return null when loading non-existent config', async () => {
      const manager = new ConfigurationManager(tempDir);
      const config = await manager.load();
      expect(config).toBeNull();
    });

    test('should have version in saved config', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        name: 'Test',
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      const config = manager.getConfig();
      expect(config.version).toBe('1.0.0');
    });
  });

  describe('Member Management', () => {
    test('should add member to team', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      const members = await manager.addMember('bob', 'spec');
      expect(members).toHaveLength(2);
      expect(members[1].username).toBe('bob');
      expect(members[1].role).toBe('spec');
    });

    test('should throw error if adding more than 4 members', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 4,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      await expect(manager.addMember('eve', 'requirements')).rejects.toThrow();
    });

    test('should throw error if adding duplicate member', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      await expect(
        manager.addMember('alice', 'spec')
      ).rejects.toThrow();
    });

    test('should throw error if adding duplicate role', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      await expect(
        manager.addMember('bob', 'requirements')
      ).rejects.toThrow();
    });

    test('should remove member from team', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 2,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' }
        ]
      });

      const members = await manager.removeMember('bob');
      expect(members).toHaveLength(1);
      expect(members[0].username).toBe('alice');
    });

    test('should throw error when removing non-existent member', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      await expect(manager.removeMember('eve')).rejects.toThrow();
    });

    test('should get member by role', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 2,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' }
        ]
      });

      const member = manager.getMemberByRole('requirements');
      expect(member).toBeDefined();
      expect(member.username).toBe('alice');
    });

    test('should return undefined for non-existent role', () => {
      const manager = new ConfigurationManager(tempDir);
      const member = manager.getMemberByRole('testing');
      expect(member).toBeUndefined();
    });

    test('should get all members', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 2,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' }
        ]
      });

      const members = manager.getMembers();
      expect(members).toHaveLength(2);
    });
  });

  describe('Workflow Adaptation', () => {
    test('should adapt workflow when adding member', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      expect(manager.getConfig().workflow.columns).toHaveLength(3);

      await manager.addMember('bob', 'spec');

      expect(manager.getConfig().workflow.columns).toHaveLength(3);
    });

    test('should update team size when adding member', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      await manager.addMember('bob', 'spec');

      expect(manager.getConfig().teamSize).toBe(2);
    });

    test('should switch from solo to team mode', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      expect(manager.getConfig().mode).toBe('solo');

      await manager.addMember('bob', 'spec');

      expect(manager.getConfig().mode).toBe('team');
    });
  });

  describe('Column and Navigation', () => {
    test('should get column for role', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 3,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      const column = manager.getColumnForRole('spec');
      expect(column).toBeDefined();
      expect(column.roles).toContain('spec');
    });

    test('should get next column in workflow', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 3,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      const next = manager.getNextColumn('requirements');
      expect(next).toBe('spec');
    });

    test('should return null for last column', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 3,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      const next = manager.getNextColumn('testing');
      expect(next).toBeNull();
    });
  });

  describe('Recommendations', () => {
    test('should get recommendations for solo mode', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      const recs = manager.getRecommendations();
      expect(recs).toBeDefined();
      expect(recs.teamSize).toBe(1);
      expect(Array.isArray(recs.recommendations)).toBe(true);
    });

    test('should get recommendations for team of 3', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 3,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' },
          { username: 'carol', role: 'implementation' },
          { username: 'dave', role: 'testing' }
        ]
      });

      const recs = manager.getRecommendations();
      expect(recs.teamSize).toBe(3);
      expect(recs.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('GitHub Configuration', () => {
    test('should set GitHub project info', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      await manager.setGitHubProjectInfo(1, 'PVT_abc123', {
        requirements: 'col_1'
      });

      const config = manager.getConfig();
      expect(config.github.projectNumber).toBe(1);
      expect(config.github.projectId).toBe('PVT_abc123');
    });

    test('should mark labels as created', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        teamSize: 1,
        members: [{ username: 'alice', role: 'requirements' }]
      });

      expect(manager.getConfig().github.labelsCreated).toBe(false);

      await manager.markLabelsCreated();

      expect(manager.getConfig().github.labelsCreated).toBe(true);
    });
  });

  describe('Summary', () => {
    test('should generate configuration summary', async () => {
      const manager = new ConfigurationManager(tempDir);
      await manager.initialize({
        name: 'Test Project',
        teamSize: 2,
        members: [
          { username: 'alice', role: 'requirements' },
          { username: 'bob', role: 'spec' }
        ]
      });

      const summary = manager.getSummary();

      expect(summary.name).toBe('Test Project');
      expect(summary.teamSize).toBe(2);
      expect(summary.mode).toBe('team');
      expect(Array.isArray(summary.members)).toBe(true);
      expect(summary.columns).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should throw error when adding member without loading config', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(manager.addMember('alice', 'requirements')).rejects.toThrow();
    });

    test('should throw error when saving without config', async () => {
      const manager = new ConfigurationManager(tempDir);
      await expect(manager.save()).rejects.toThrow();
    });

    test('should throw error when getting next column without config', () => {
      const manager = new ConfigurationManager(tempDir);
      const next = manager.getNextColumn('requirements');
      expect(next).toBeNull();
    });
  });
});
