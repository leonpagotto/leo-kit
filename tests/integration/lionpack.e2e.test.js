/**
 * LionPack End-to-End Integration Tests
 * Full workflow: setup → hunt → transitions → completion
 */

const fs = require('fs-extra');
const path = require('path');
const { ConfigurationManager } = require('../../lib/team/config-manager');
const { RoleManager } = require('../../lib/team/roles');
const { HuntCycleTracker } = require('../../lib/team/tracker');
const { WorkflowMode } = require('../../lib/team/workflow-modes');
const { AnalyticsEngine } = require('../../lib/team/analytics');

describe('LionPack End-to-End Integration', () => {
  const testDir = path.join(__dirname, '../../.test-lionpack-e2e');

  beforeAll(async () => {
    await fs.ensureDir(testDir);
  });

  afterAll(async () => {
    await fs.remove(testDir);
  });

  describe('Solo Workflow (1 person)', () => {
    it('should complete full solo hunt cycle', async () => {
      const workDir = path.join(testDir, 'solo');
      await fs.ensureDir(workDir);

      // Initialize solo configuration
      const manager = new ConfigurationManager(workDir);
      const members = [{ username: 'leo', role: 'requirements' }];

      const config = {
        name: 'Solo Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 1,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(1, members)
      };

      await manager.initialize(config);

      // Verify configuration persisted
      const loaded = await manager.load();
      expect(loaded).toBeDefined();
      expect(loaded.teamSize).toBe(1);

      // Start hunt
      const tracker = await HuntCycleTracker.load(workDir);
      const hunt = await tracker.startHunt('Add Login Feature', 'Implement user authentication');

      expect(hunt).toBeDefined();
      expect(hunt.featureName).toBe('Add Login Feature');
      expect(hunt.status).toBe('active');
      expect(hunt.currentPhase).toBe('requirements');

      await tracker.save(workDir);

      // Verify saved
      const tracker2 = await HuntCycleTracker.load(workDir);
      const savedHunt = tracker2.getHunt(hunt.id);
      expect(savedHunt).toBeDefined();
    });
  });

  describe('Duo Workflow (2 people)', () => {
    it('should complete full duo hunt cycle with proper phase progression', async () => {
      const workDir = path.join(testDir, 'duo');
      await fs.ensureDir(workDir);

      // Initialize duo configuration
      const manager = new ConfigurationManager(workDir);
      const members = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'implementation' }
      ];

      const config = {
        name: 'Duo Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 2,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(2, members)
      };

      await manager.initialize(config);

      // Verify duo configuration
      const loaded = await manager.load();
      expect(loaded.teamSize).toBe(2);

      // Start hunt
      const tracker = await HuntCycleTracker.load(workDir);
      const hunt = await tracker.startHunt('Build API', 'Create REST API');

      expect(hunt.currentPhase).toBe('requirements');

      // Transition through phases
      const phases = ['spec', 'implementation', 'testing'];
      for (const phase of phases) {
        tracker.transitionHunt(hunt.id, phase, loaded.workflow.memberMapping[phase]);
        const updated = tracker.getHunt(hunt.id);
        expect(updated.currentPhase).toBe(phase);
      }

      await tracker.save(workDir);
      expect(tracker.getHunt(hunt.id).currentPhase).toBe('testing');
    });
  });

  describe('Trio Workflow (3 people)', () => {
    it('should complete full trio hunt cycle', async () => {
      const workDir = path.join(testDir, 'trio');
      await fs.ensureDir(workDir);

      // Initialize trio configuration
      const manager = new ConfigurationManager(workDir);
      const members = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'implementation' },
        { username: 'charlie', role: 'testing' }
      ];

      const config = {
        name: 'Trio Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 3,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(3, members)
      };

      await manager.initialize(config);

      // Verify trio configuration uses 4 columns
      const loaded = await manager.load();
      expect(loaded.teamSize).toBe(3);
      expect(loaded.workflow.columns).toHaveLength(4);

      // Start and progress hunt
      const tracker = await HuntCycleTracker.load(workDir);
      const hunt = await tracker.startHunt('Dashboard', 'Create admin dashboard');

      // Run through workflow
      const phases = ['spec', 'implementation', 'testing'];
      for (const phase of phases) {
        tracker.transitionHunt(hunt.id, phase, loaded.workflow.memberMapping[phase]);
        const updated = tracker.getHunt(hunt.id);
        expect(updated.currentPhase).toBe(phase);
      }

      await tracker.save(workDir);
    });
  });

  describe('Pack Workflow (4 people)', () => {
    it('should complete full pack hunt cycle', async () => {
      const workDir = path.join(testDir, 'pack');
      await fs.ensureDir(workDir);

      // Initialize pack configuration
      const manager = new ConfigurationManager(workDir);
      const members = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'spec' },
        { username: 'charlie', role: 'implementation' },
        { username: 'diana', role: 'testing' }
      ];

      const config = {
        name: 'Pack Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 4,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(4, members)
      };

      await manager.initialize(config);

      // Verify pack configuration uses 5 columns
      const loaded = await manager.load();
      expect(loaded.teamSize).toBe(4);
      expect(loaded.workflow.columns).toHaveLength(5);

      // Start hunt
      const tracker = await HuntCycleTracker.load(workDir);
      const hunt = await tracker.startHunt('Mobile App', 'Release iOS app');

      // Run through full workflow
      const phases = ['spec', 'implementation', 'testing', 'deploy'];
      for (const phase of phases) {
        tracker.transitionHunt(hunt.id, phase, loaded.workflow.memberMapping[phase]);
        const updated = tracker.getHunt(hunt.id);
        expect(updated.currentPhase).toBe(phase);
      }

      await tracker.save(workDir);
    });
  });

  describe('Multiple Hunts', () => {
    it('should manage multiple concurrent hunts at different phases', async () => {
      const workDir = path.join(testDir, 'multi-hunt');
      await fs.ensureDir(workDir);

      // Initialize configuration
      const manager = new ConfigurationManager(workDir);
      const members = [{ username: 'leo', role: 'requirements' }];

      const config = {
        name: 'Multi Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 1,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(1, members)
      };

      await manager.initialize(config);

      // Start multiple hunts
      const tracker = await HuntCycleTracker.load(workDir);
      const hunt1 = await tracker.startHunt('Feature 1', 'First feature');
      const hunt2 = await tracker.startHunt('Feature 2', 'Second feature');
      const hunt3 = await tracker.startHunt('Feature 3', 'Third feature');

      // Verify all unique
      expect(hunt1.id).not.toBe(hunt2.id);
      expect(hunt2.id).not.toBe(hunt3.id);

      // Progress hunts at different rates
      tracker.transitionHunt(hunt1.id, 'spec', 'leo');
      tracker.transitionHunt(hunt1.id, 'implementation', 'leo');
      tracker.transitionHunt(hunt2.id, 'spec', 'leo');
      // hunt3 stays at requirements

      await tracker.save(workDir);

      // Verify states
      const h1 = tracker.getHunt(hunt1.id);
      const h2 = tracker.getHunt(hunt2.id);
      const h3 = tracker.getHunt(hunt3.id);

      expect(h1.currentPhase).toBe('implementation');
      expect(h2.currentPhase).toBe('spec');
      expect(h3.currentPhase).toBe('requirements');

      // Active hunts
      const active = tracker.getActiveHunts();
      expect(active.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Analytics and Reporting', () => {
    it('should track metrics across hunts', async () => {
      const workDir = path.join(testDir, 'analytics');
      await fs.ensureDir(workDir);

      // Initialize
      const manager = new ConfigurationManager(workDir);
      const members = [{ username: 'leo', role: 'requirements' }];

      const config = {
        name: 'Analytics Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 1,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(1, members)
      };

      await manager.initialize(config);

      // Create and complete hunts
      const tracker = await HuntCycleTracker.load(workDir);
      for (let i = 0; i < 3; i++) {
        const hunt = await tracker.startHunt(`Feature ${i + 1}`, `Feature number ${i + 1}`);
      }
      await tracker.save(workDir);

      // Record metrics
      const analytics = await AnalyticsEngine.load('AnalyticsProject', workDir);

      // Record hunt metrics
      analytics.recordHuntMetrics({
        featureName: 'Feature 1',
        huntId: 'hunt-1',
        teamSize: 1,
        phaseDurations: {
          requirements: 30,
          spec: 45,
          implementation: 120,
          testing: 60
        },
        quality: 0.95
      });

      await analytics.save(workDir);

      // Verify metrics were recorded
      expect(analytics.metrics.length).toBeGreaterThan(0);
      expect(analytics.metrics[0].quality).toBe(0.95);
    });
  });

  describe('Configuration Persistence', () => {
    it('should persist and reload configuration correctly', async () => {
      const workDir = path.join(testDir, 'persistence');
      await fs.ensureDir(workDir);

      // Create initial configuration
      const manager = new ConfigurationManager(workDir);
      const members = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'implementation' }
      ];

      const config = {
        name: 'Persistence Project',
        org: 'test-org',
        repo: 'test-repo',
        teamSize: 2,
        members: members,
        workflow: WorkflowMode.getConfigByTeamSize(2, members)
      };

      await manager.initialize(config);

      // Reload and verify
      const manager2 = new ConfigurationManager(workDir);
      const loaded = await manager2.load();

      expect(loaded.name).toBe('Persistence Project');
      expect(loaded.teamSize).toBe(2);
      expect(loaded.members).toHaveLength(2);
      expect(loaded.workflow).toBeDefined();
    });
  });

  describe('Role Management', () => {
    it('should manage roles correctly', () => {
      const roleManager = new RoleManager();

      // Get all roles
      const roles = roleManager.getAllRoles();
      expect(roles).toHaveLength(4);

      // Get specific role
      const reqRole = roleManager.getRole('requirements');
      expect(reqRole).toBeDefined();
      expect(reqRole.name).toBe('requirements');

      // Find by keyword
      const byKeyword = roleManager.findRoleByKeyword('implement');
      expect(byKeyword).toBeDefined();
      expect(byKeyword.name).toBe('implementation');
    });
  });

  describe('Workflow Modes', () => {
    it('should provide correct configurations for each team size', () => {
      const members1 = [{ username: 'leo', role: 'requirements' }];
      const members2 = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'implementation' }
      ];
      const members3 = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'implementation' },
        { username: 'charlie', role: 'testing' }
      ];
      const members4 = [
        { username: 'alice', role: 'requirements' },
        { username: 'bob', role: 'spec' },
        { username: 'charlie', role: 'implementation' },
        { username: 'diana', role: 'testing' }
      ];

      // Solo: 3 columns
      const solo = WorkflowMode.getConfigByTeamSize(1, members1);
      expect(solo.columns).toHaveLength(3);

      // Duo: 3 columns
      const duo = WorkflowMode.getConfigByTeamSize(2, members2);
      expect(duo.columns).toHaveLength(3);

      // Trio: 4 columns
      const trio = WorkflowMode.getConfigByTeamSize(3, members3);
      expect(trio.columns).toHaveLength(4);

      // Pack: 5 columns
      const pack = WorkflowMode.getConfigByTeamSize(4, members4);
      expect(pack.columns).toHaveLength(5);
    });
  });

  describe('Hunt Cycle Tracking', () => {
    it('should properly track hunt lifecycle', async () => {
      const workDir = path.join(testDir, 'hunt-lifecycle');
      await fs.ensureDir(workDir);

      const tracker = await HuntCycleTracker.load(workDir);

      // Start hunt
      const hunt = await tracker.startHunt('Test Feature', 'Test description');
      expect(hunt.status).toBe('active');
      expect(hunt.currentPhase).toBe('requirements');

      // Get hunt
      const fetched = tracker.getHunt(hunt.id);
      expect(fetched).toBeDefined();
      expect(fetched.id).toBe(hunt.id);

      // Get active hunts
      const active = tracker.getActiveHunts();
      expect(active.length).toBeGreaterThan(0);
      expect(active[0].featureName).toBe('Test Feature');

      await tracker.save(workDir);
    });
  });
});
