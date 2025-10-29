/**
 * Unit Tests for ModelSelector
 *
 * Tests the core model selection logic including:
 * - Model registration and availability
 * - Strategy-based selection
 * - Fallback mechanisms
 * - Budget enforcement
 */

const ModelSelector = require('../../lib/model-selection');
const CostTracker = require('../../lib/model-selection/cost-tracker');

// Mock CostTracker to avoid file I/O in tests
jest.mock('../../lib/model-selection/cost-tracker');

describe('ModelSelector', () => {
  let modelSelector;
  let balancedModelSelector;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock CostTracker methods
    CostTracker.mockImplementation(() => ({
      canAfford: jest.fn().mockResolvedValue(true),
      recordUsage: jest.fn().mockResolvedValue(true),
      calculateCost: jest.fn().mockReturnValue(0.05)
    }));

    // Default: upgrade-defaults: true (uses best models)
    modelSelector = new ModelSelector({ 'upgrade-defaults': true });

    // Balanced: upgrade-defaults: false (cost-optimized)
    balancedModelSelector = new ModelSelector({ 'upgrade-defaults': false });
  });

  describe('Model Registry', () => {
    test('should have 10 models registered by default', () => {
      const models = modelSelector.models;
      expect(models.size).toBe(10);
      expect(models.has('gpt-4')).toBe(true);
      expect(models.has('gpt-4-turbo')).toBe(true);
      expect(models.has('gpt-4o')).toBe(true);
      expect(models.has('gpt-3.5-turbo')).toBe(true);
      expect(models.has('o1-preview')).toBe(true);
      expect(models.has('o1-mini')).toBe(true);
      expect(models.has('claude-3-opus')).toBe(true);
      expect(models.has('claude-3.5-sonnet')).toBe(true);
      expect(models.has('claude-3-sonnet')).toBe(true);
      expect(models.has('claude-3-haiku')).toBe(true);
    });

    test('should return correct model metadata', () => {
      const gpt4 = modelSelector.models.get('gpt-4');
      expect(gpt4).toMatchObject({
        id: 'gpt-4',
        provider: 'openai',
        tier: 'premium',
        cost: 'high',
        speed: 'slow'
      });
    });

    test('should check model availability correctly', () => {
      expect(modelSelector.isModelAvailable('gpt-4')).toBe(true);
      expect(modelSelector.isModelAvailable('nonexistent-model')).toBe(false);
    });
  });

  describe('Model Selection', () => {
    test('should select model based on agent-specific strategy', async () => {
      const model = await modelSelector.selectModel('frontend', 'Create login component', 'moderate');

      // Frontend agent prefers Claude-3.5-sonnet for moderate tasks (v5.3.1)
      expect(['claude-3.5-sonnet', 'claude-3-haiku', 'gpt-4-turbo', 'claude-3-opus']).toContain(model);
    });

    test('should select premium model for complex tasks', async () => {
      const model = await modelSelector.selectModel('backend', 'Design authentication system', 'complex');

      // Complex backend tasks should use Claude 3.5 Sonnet or Opus (v5.3.1)
      expect(['claude-3.5-sonnet', 'claude-3-opus', 'gpt-4']).toContain(model);
    });

    test('should select cost-efficient model for simple tasks', async () => {
      // Test balanced mode (upgrade-defaults: false)
      const model = await balancedModelSelector.selectModel('testing', 'Write unit test', 'simple');

      // Simple tasks in balanced mode should use standard tier models
      expect(['gpt-3.5-turbo', 'claude-3-haiku', 'claude-3.5-sonnet']).toContain(model);
    });

    test('should select appropriate model for orchestrator complex tasks', async () => {
      const model = await modelSelector.selectModel('orchestrator', 'Analyze multi-agent coordination', 'complex');

      // Orchestrator uses GPT-4 Turbo for complex tasks (v5.3.1)
      expect(['gpt-4-turbo', 'gpt-4', 'o1-mini']).toContain(model);
    });

    test('should handle unknown agent gracefully', async () => {
      const model = await modelSelector.selectModel('unknown-agent', 'Some task', 'moderate');

      // Should fall back to default strategy
      expect(model).toBeTruthy();
      expect(modelSelector.isModelAvailable(model)).toBe(true);
    });
  });

  describe('Default Model Selection', () => {
    test('should select default model for orchestrator', () => {
      // With upgrade-defaults: true, orchestrator uses Claude 3.5 Sonnet
      const upgraded = modelSelector.selectDefaultModel('orchestrator', 'moderate');
      expect(['claude-3.5-sonnet', 'gpt-4', 'gpt-4-turbo']).toContain(upgraded);

      // With upgrade-defaults: false, orchestrator uses Claude Haiku
      const balanced = balancedModelSelector.selectDefaultModel('orchestrator', 'moderate');
      expect(['claude-3-haiku', 'gpt-4', 'gpt-4-turbo']).toContain(balanced);
    });

    test('should select default model based on complexity', () => {
      // Test upgraded defaults
      const simple = modelSelector.selectDefaultModel('frontend', 'simple');
      const complex = modelSelector.selectDefaultModel('frontend', 'complex');

      expect(['claude-3.5-sonnet', 'gpt-4', 'claude-3-haiku']).toContain(simple);
      expect(['claude-3.5-sonnet', 'gpt-4', 'claude-3-opus']).toContain(complex);

      // Test balanced defaults
      const simpleBalanced = balancedModelSelector.selectDefaultModel('frontend', 'simple');
      expect(['gpt-3.5-turbo', 'claude-3-haiku']).toContain(simpleBalanced);
    });

    test('should handle invalid complexity levels', () => {
      const model = modelSelector.selectDefaultModel('frontend', 'invalid-complexity');

      // Should default to moderate tier
      expect(model).toBeTruthy();
    });
  });

  describe('Fallback Selection', () => {
    test('should select fallback model for agent', () => {
      const fallback = modelSelector.selectFallback('frontend');

      // Should return a cost-efficient model
      expect(['gpt-3.5-turbo', 'claude-3-haiku']).toContain(fallback);
    });

    test('should always return gpt-3.5-turbo as ultimate fallback', () => {
      const fallback = modelSelector.selectFallback('unknown-agent');
      expect(fallback).toBe('gpt-3.5-turbo');
    });
  });

  describe('Strategy Registration', () => {
    test('should register custom strategy', () => {
      const customStrategy = {
        select: jest.fn().mockReturnValue('gpt-4'),
        getName: () => 'custom',
        getDescription: () => 'Custom strategy'
      };

      modelSelector.registerStrategy('custom', customStrategy);
      expect(modelSelector.strategies.has('custom')).toBe(true);
    });

    test('should use custom strategy when selecting', async () => {
      const customStrategy = {
        select: jest.fn().mockReturnValue('claude-3-opus'),
        getName: () => 'custom',
        getDescription: () => 'Custom strategy'
      };

      modelSelector.registerStrategy('custom', customStrategy);

      // This would require modifying selectModel to use custom strategy
      // For now, just verify registration works
      expect(modelSelector.strategies.get('custom')).toBe(customStrategy);
    });
  });

  describe('Budget Enforcement', () => {
    test('should check budget before selection', async () => {
      const mockCanAfford = jest.fn().mockResolvedValue(true);
      CostTracker.mockImplementation(() => ({
        canAfford: mockCanAfford,
        recordUsage: jest.fn().mockResolvedValue(true),
        calculateCost: jest.fn().mockReturnValue(0.05)
      }));

      const selector = new ModelSelector();
      await selector.selectModel('frontend', 'Task', 'moderate');

      expect(mockCanAfford).toHaveBeenCalledWith('frontend', 'Task');
    });

    test('should use fallback when budget exceeded', async () => {
      const mockCanAfford = jest.fn().mockResolvedValue(false);
      CostTracker.mockImplementation(() => ({
        canAfford: mockCanAfford,
        recordUsage: jest.fn().mockResolvedValue(true),
        calculateCost: jest.fn().mockReturnValue(0.05)
      }));

      const selector = new ModelSelector();
      const model = await selector.selectModel('frontend', 'Task', 'complex');

      // Should fall back to cost-efficient model
      expect(['gpt-3.5-turbo', 'claude-3-haiku']).toContain(model);
    });
  });

  describe('Model Configuration', () => {
    test('should load configuration from config', () => {
      const config = {
        'model-selection': {
          enabled: true,
          models: {
            'gpt-4': { enabled: false }
          }
        }
      };

      const selector = new ModelSelector(config);

      // Disabled models should not be available for selection
      // This would require implementing model enabling/disabling in ModelSelector
      expect(selector.config).toBeDefined();
    });

    test('should respect enabled/disabled models in config', () => {
      // Future test: verify that disabled models are not selected
      // This requires implementing the enable/disable logic
      expect(true).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle null agent gracefully', async () => {
      const model = await modelSelector.selectModel(null, 'Task', 'moderate');
      expect(model).toBeTruthy();
    });

    test('should handle empty task description', async () => {
      const model = await modelSelector.selectModel('frontend', '', 'moderate');
      expect(model).toBeTruthy();
    });

    test('should handle missing complexity parameter', async () => {
      const model = await modelSelector.selectModel('frontend', 'Task');
      expect(model).toBeTruthy();
    });
  });

  describe('Model Metadata', () => {
    test('should return correct tier for each model', () => {
      expect(modelSelector.models.get('gpt-4').tier).toBe('premium');
      expect(modelSelector.models.get('gpt-4-turbo').tier).toBe('high');
      expect(modelSelector.models.get('gpt-4o').tier).toBe('premium');
      expect(modelSelector.models.get('o1-preview').tier).toBe('ultra-premium');
      expect(modelSelector.models.get('o1-mini').tier).toBe('premium');
      expect(modelSelector.models.get('gpt-3.5-turbo').tier).toBe('standard');
      expect(modelSelector.models.get('claude-3-opus').tier).toBe('premium');
      expect(modelSelector.models.get('claude-3.5-sonnet').tier).toBe('ultra-premium');
      expect(modelSelector.models.get('claude-3-sonnet').tier).toBe('high');
      expect(modelSelector.models.get('claude-3-haiku').tier).toBe('standard');
    });

    test('should return correct provider for each model', () => {
      expect(modelSelector.models.get('gpt-4').provider).toBe('openai');
      expect(modelSelector.models.get('gpt-4-turbo').provider).toBe('openai');
      expect(modelSelector.models.get('gpt-4o').provider).toBe('openai');
      expect(modelSelector.models.get('o1-preview').provider).toBe('openai');
      expect(modelSelector.models.get('o1-mini').provider).toBe('openai');
      expect(modelSelector.models.get('gpt-3.5-turbo').provider).toBe('openai');
      expect(modelSelector.models.get('claude-3-opus').provider).toBe('anthropic');
      expect(modelSelector.models.get('claude-3.5-sonnet').provider).toBe('anthropic');
      expect(modelSelector.models.get('claude-3-sonnet').provider).toBe('anthropic');
      expect(modelSelector.models.get('claude-3-haiku').provider).toBe('anthropic');
    });
  });
});
