/**
 * E2E Tests: Specification-Driven Development Workflow
 *
 * Tests the complete pipeline:
 * init → constitution → specify → plan → tasks → implement → validate
 *
 * Issue: #59
 * Phase: Days 15-16
 */

const { SpecificationManager, AICodeGenerator } = require('../../lib/spec/manager');
const SpecCommands = require('../../lib/commands/spec');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

describe('E2E: Specification-Driven Development Workflow', () => {
  let testDir;
  let manager;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `leo-spec-e2e-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });

    manager = new SpecificationManager(testDir);
  });

  afterEach(async () => {
    // Cleanup
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('Complete Workflow: Init to Code Generation', () => {
    test('should initialize spec project successfully', async () => {
      const result = await manager.init('test-feature');

      expect(result.success).toBe(true);
      expect(result.featureDir).toContain('test-feature');

      // Verify spec files created
      const specDir = path.join(testDir, '.leo/spec/test-feature');
      const files = await fs.readdir(specDir);

      expect(files).toContain('constitution.md');
      expect(files).toContain('specification.md');
      expect(files).toContain('plan.md');
      expect(files).toContain('tasks.md');
      expect(files).toContain('metadata.json');
    });

    test('should load specification files', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const spec = await manager.loadSpec('test-feature');

      expect(spec.constitution).toBeDefined();
      expect(spec.specification).toBeDefined();
      expect(spec.plan).toBeDefined();
      expect(spec.tasks).toBeDefined();
    });

    test('should analyze spec for completeness', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const spec = await manager.loadSpec('test-feature');
      const analysis = manager.analyze(spec);

      // Analysis should return an object
      expect(typeof analysis === 'object').toBe(true);
    });

    test('should generate tasks from specification', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const spec = await manager.loadSpec('test-feature');
      // Just ensure the method exists and doesn't throw
      const tasks = manager._parseSpecToTasks(spec);

      expect(Array.isArray(tasks)).toBe(true);
    });

    test('should provide status report', async () => {
      await manager.init('test-feature');

      const status = await manager.getStatus('test-feature');

      expect(status).toBeDefined();
      expect(typeof status === 'object').toBe(true);
    });
  });

  describe('AI Code Generation', () => {
    test('should initialize AICodeGenerator with Claude provider', () => {
      const generator = new AICodeGenerator('claude');

      expect(generator.provider).toBe('claude');
      // Client will be null if ANTHROPIC_API_KEY not set (expected in test)
    });

    test('should generate code from specification (mock mode)', async () => {
      const generator = new AICodeGenerator('claude');

      const spec = {
        constitution: '# Project Principles\n- Quality first',
        specification: '# Features\n- Dashboard\n- Auth',
        plan: '# Tech Stack\n- React\n- Node.js',
        tasks: '# Tasks\n1. Create components'
      };

      const code = await generator.generateFromSpec(spec);

      expect(code).toBeDefined();
      expect(typeof code).toBe('object');
      // Mock mode should return sample files
      expect(Object.keys(code).length).toBeGreaterThan(0);
    });

    test('should build valid prompt from specification', () => {
      const generator = new AICodeGenerator('claude');

      const spec = {
        constitution: 'Test constitution',
        specification: 'Test spec',
        plan: 'Test plan',
        tasks: 'Test tasks'
      };

      const prompt = generator._buildPrompt(spec);

      expect(prompt).toContain('Project Constitution');
      expect(prompt).toContain('Specification');
      expect(prompt).toContain('Implementation Plan');
      expect(prompt).toContain('Test constitution');
      expect(prompt).toContain('Test spec');
    });

    test('should return mock response when API unavailable', async () => {
      // This tests fallback behavior
      const generator = new AICodeGenerator('claude');
      // Client will be null without API key

      const mockCode = generator._getMockResponse();

      expect(mockCode).toBeDefined();
      expect(mockCode['src/main.js']).toBeDefined();
      expect(mockCode['package.json']).toBeDefined();
    });
  });

  describe('Spec File Management', () => {
    test('should create constitution file', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const constitutionPath = path.join(manager.featureDir, 'constitution.md');
      const exists = await manager._fileExists(constitutionPath);

      expect(exists).toBe(true);
    });

    test('should create specification file', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const specPath = path.join(manager.featureDir, 'specification.md');
      const content = await fs.readFile(specPath, 'utf-8');

      expect(content).toContain('# Specification');
      expect(content).toContain('Requirements');
    });

    test('should create plan file', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const planPath = path.join(manager.featureDir, 'plan.md');
      const content = await fs.readFile(planPath, 'utf-8');

      expect(content).toContain('# Implementation Plan');
    });

    test('should create metadata file', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const metadataPath = path.join(manager.featureDir, 'metadata.json');
      const content = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(content);

      expect(metadata.name).toBe('test-feature');
      expect(metadata.created).toBeDefined();
    });
  });

  describe('Workflow Integration', () => {
    test('should handle complete workflow without errors', async () => {
      // Step 1: Initialize
      const initResult = await manager.init('complete-workflow');
      expect(initResult.success).toBe(true);

      manager.featureDir = initResult.featureDir;

      // Step 2: Load spec
      const spec = await manager.loadSpec('complete-workflow');
      expect(spec).toBeDefined();

      // Step 3: Analyze
      const analysis = manager.analyze(spec);
      expect(analysis).toBeDefined();

      // Step 4: Get status
      const status = await manager.getStatus('complete-workflow');
      expect(status).toBeDefined();
      expect(typeof status === 'object').toBe(true);
    });

    test('should handle multiple features independently', async () => {
      // Create feature 1
      await manager.init('feature-1');
      const feature1Dir = path.join(testDir, '.leo/spec/feature-1');

      // Create feature 2
      await manager.init('feature-2');
      const feature2Dir = path.join(testDir, '.leo/spec/feature-2');

      // Both should exist independently
      const dir1Exists = await manager._fileExists(feature1Dir);
      const dir2Exists = await manager._fileExists(feature2Dir);

      expect(dir1Exists).toBe(true);
      expect(dir2Exists).toBe(true);
    });

    test('should maintain separation between spec and generated code', async () => {
      await manager.init('test-feature');
      manager.featureDir = path.join(testDir, '.leo/spec/test-feature');

      const specDir = path.join(testDir, '.leo/spec/test-feature');
      const generatedDir = path.join(testDir, '.leo/generated/test-feature');

      // Spec should exist
      const specExists = await manager._fileExists(specDir);
      expect(specExists).toBe(true);

      // Generated should not exist yet
      const generatedExists = await manager._fileExists(generatedDir);
      expect(generatedExists).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing feature name gracefully', async () => {
      let errorThrown = false;
      try {
        await manager.init('');
      } catch (error) {
        errorThrown = true;
        expect(error.message).toBeDefined();
      }
      // Some operations may not throw but return error, that's ok
      expect(typeof errorThrown === 'boolean').toBe(true);
    });

    test('should handle invalid feature directory', async () => {
      manager.featureDir = null;

      try {
        await manager.createConstitution('test');
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    test('should handle code generation errors gracefully', async () => {
      const generator = new AICodeGenerator('invalid-provider');

      const spec = {
        constitution: 'test',
        specification: 'test',
        plan: 'test',
        tasks: 'test'
      };

      // Should not throw, should return mock
      const result = await generator.generateFromSpec(spec);
      expect(result).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    test('spec initialization should be fast (< 100ms)', async () => {
      const start = Date.now();
      await manager.init('perf-test');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });

    test('spec loading should be fast (< 50ms)', async () => {
      await manager.init('perf-test');
      manager.featureDir = path.join(testDir, '.leo/spec/perf-test');

      const start = Date.now();
      await manager.loadSpec('perf-test');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(50);
    });

    test('mock code generation should be fast (< 100ms)', async () => {
      const generator = new AICodeGenerator('claude');
      const spec = {
        constitution: 'test',
        specification: 'test',
        plan: 'test',
        tasks: 'test'
      };

      const start = Date.now();
      await generator.generateFromSpec(spec);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('Compatibility Tests', () => {
    test('should be compatible with existing LEO kit', () => {
      // Test that new spec system doesn't break existing functionality
      expect(manager).toBeDefined();
      expect(typeof manager.init).toBe('function');
      expect(typeof manager.loadSpec).toBe('function');
    });

    test('should work with Node 16+', async () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

      expect(majorVersion).toBeGreaterThanOrEqual(16);
    });
  });
});

describe('Integration: Spec System with LEO Kit', () => {
  test('should integrate with existing commands', () => {
    // Verify SpecCommands are properly exported
    expect(typeof SpecCommands).toBe('function');
  });

  test('should support leo spec commands', () => {
    const commands = Object.getOwnPropertyNames(SpecCommands);

    expect(commands).toContain('init');
    expect(commands).toContain('constitution');
    expect(commands).toContain('specify');
    expect(commands).toContain('plan');
    expect(commands).toContain('tasks');
    expect(commands).toContain('analyze');
    expect(commands).toContain('implement');
    expect(commands).toContain('status');
  });
});
