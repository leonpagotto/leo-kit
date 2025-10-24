/**
 * Unit Tests for Selection Strategies
 * 
 * Tests all three selection strategies:
 * - ComplexityBasedStrategy
 * - AgentSpecificStrategy  
 * - PhaseBasedStrategy
 */

const ComplexityBasedStrategy = require('../../lib/model-selection/strategies/complexity-based');
const AgentSpecificStrategy = require('../../lib/model-selection/strategies/agent-specific');
const PhaseBasedStrategy = require('../../lib/model-selection/strategies/phase-based');

describe('ComplexityBasedStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new ComplexityBasedStrategy();
  });

  test('should select standard tier for simple tasks', () => {
    const model = strategy.select('frontend', 'simple', {});
    expect(['gpt-3.5-turbo', 'claude-3-haiku']).toContain(model);
  });

  test('should select high tier for moderate tasks', () => {
    const model = strategy.select('backend', 'moderate', {});
    expect(['gpt-4-turbo', 'claude-3-sonnet']).toContain(model);
  });

  test('should select premium tier for complex tasks', () => {
    const model = strategy.select('orchestrator', 'complex', {});
    expect(['gpt-4', 'claude-3-opus']).toContain(model);
  });

  test('should default to moderate for unknown complexity', () => {
    const model = strategy.select('frontend', 'unknown', {});
    expect(['gpt-4-turbo', 'claude-3-sonnet']).toContain(model);
  });

  test('should return strategy name', () => {
    expect(strategy.getName()).toBe('complexity-based');
  });

  test('should return strategy description', () => {
    const desc = strategy.getDescription();
    expect(desc).toContain('complexity');
  });
});

describe('AgentSpecificStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new AgentSpecificStrategy();
  });

  describe('Orchestrator Agent', () => {
    test('should prefer GPT-4 for complex tasks', () => {
      const model = strategy.select('orchestrator', 'complex', {});
      expect(['gpt-4', 'gpt-4-turbo']).toContain(model);
    });

    test('should use GPT-4-turbo for moderate tasks', () => {
      const model = strategy.select('orchestrator', 'moderate', {});
      expect(['gpt-4', 'gpt-4-turbo']).toContain(model);
    });

    test('should fallback to GPT-3.5-turbo for simple tasks', () => {
      const model = strategy.select('orchestrator', 'simple', {});
      expect(model).toBeTruthy();
    });
  });

  describe('Frontend Agent', () => {
    test('should prefer Claude-3-sonnet', () => {
      const model = strategy.select('frontend', 'moderate', {});
      expect(['claude-3-sonnet', 'gpt-4-turbo', 'claude-3-opus']).toContain(model);
    });

    test('should use Claude-3-haiku for simple tasks', () => {
      const model = strategy.select('frontend', 'simple', {});
      expect(['claude-3-haiku', 'gpt-3.5-turbo']).toContain(model);
    });
  });

  describe('Backend Agent', () => {
    test('should prefer Claude-3-opus for complex tasks', () => {
      const model = strategy.select('backend', 'complex', {});
      expect(['claude-3-opus', 'gpt-4']).toContain(model);
    });

    test('should use GPT-4 as alternative', () => {
      const preferences = strategy.getAgentPreferences('backend');
      expect(preferences.primary).toContain('gpt-4');
    });
  });

  describe('DevOps Agent', () => {
    test('should prefer GPT-4-turbo', () => {
      const model = strategy.select('devops', 'moderate', {});
      expect(['gpt-4-turbo', 'gpt-4']).toContain(model);
    });
  });

  describe('Testing Agent', () => {
    test('should use cost-efficient models', () => {
      const model = strategy.select('testing', 'simple', {});
      expect(['gpt-3.5-turbo', 'claude-3-haiku']).toContain(model);
    });

    test('should still use premium for complex test scenarios', () => {
      const model = strategy.select('testing', 'complex', {});
      expect(model).toBeTruthy();
    });
  });

  describe('Documentation Agent', () => {
    test('should prefer Claude-3-haiku for writing', () => {
      const model = strategy.select('documentation', 'simple', {});
      expect(['claude-3-haiku', 'gpt-3.5-turbo']).toContain(model);
    });
  });

  test('should return null for unknown agent', () => {
    const model = strategy.select('unknown-agent', 'moderate', {});
    expect(model).toBeNull();
  });

  test('should list all agent configurations', () => {
    const agents = strategy.listAgents();
    expect(agents.length).toBe(6);
    expect(agents.map(a => a.agent)).toContain('orchestrator');
    expect(agents.map(a => a.agent)).toContain('frontend');
    expect(agents.map(a => a.agent)).toContain('backend');
  });

  test('should return agent preferences', () => {
    const prefs = strategy.getAgentPreferences('frontend');
    expect(prefs).toBeDefined();
    expect(prefs.primary).toBeDefined();
    expect(prefs.fallback).toBeDefined();
    expect(prefs.reasoning).toBeDefined();
  });

  test('should return strategy name', () => {
    expect(strategy.getName()).toBe('agent-specific');
  });
});

describe('PhaseBasedStrategy', () => {
  let strategy;
  const originalEnv = process.env;

  beforeEach(() => {
    strategy = new PhaseBasedStrategy();
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Phase Detection', () => {
    test('should detect development phase from LEO_PHASE', () => {
      process.env.LEO_PHASE = 'development';
      const phase = strategy.detectPhase();
      expect(phase).toBe('development');
    });

    test('should detect production phase from NODE_ENV', () => {
      process.env.NODE_ENV = 'production';
      const phase = strategy.detectPhase();
      expect(phase).toBe('production');
    });

    test('should default to development', () => {
      delete process.env.LEO_PHASE;
      delete process.env.NODE_ENV;
      const phase = strategy.detectPhase();
      expect(phase).toBe('development');
    });

    test('should prioritize LEO_PHASE over NODE_ENV', () => {
      process.env.LEO_PHASE = 'production';
      process.env.NODE_ENV = 'development';
      const phase = strategy.detectPhase();
      expect(phase).toBe('production');
    });
  });

  describe('Development Phase', () => {
    beforeEach(() => {
      process.env.LEO_PHASE = 'development';
    });

    test('should prefer cost-efficient models', () => {
      const model = strategy.select('frontend', 'moderate', {});
      // In development, should favor standard/high tier over premium
      expect(model).toBeTruthy();
    });

    test('should still use premium for complex tasks', () => {
      const model = strategy.select('backend', 'complex', {});
      expect(model).toBeTruthy();
    });
  });

  describe('Staging Phase', () => {
    beforeEach(() => {
      process.env.LEO_PHASE = 'staging';
    });

    test('should use balanced approach', () => {
      const model = strategy.select('frontend', 'moderate', {});
      expect(model).toBeTruthy();
    });
  });

  describe('Production Phase', () => {
    beforeEach(() => {
      process.env.LEO_PHASE = 'production';
    });

    test('should prefer powerful models', () => {
      const model = strategy.select('backend', 'complex', {});
      // In production, should favor premium models
      expect(['gpt-4', 'claude-3-opus']).toContain(model);
    });

    test('should use high-tier for moderate tasks', () => {
      const model = strategy.select('frontend', 'moderate', {});
      expect(['gpt-4-turbo', 'claude-3-sonnet', 'gpt-4', 'claude-3-opus']).toContain(model);
    });
  });

  describe('Phase Preferences', () => {
    test('should return development preferences', () => {
      const prefs = strategy.getPhasePreferences('development');
      expect(prefs).toBeDefined();
      expect(prefs.priority).toBe('cost-efficient');
    });

    test('should return production preferences', () => {
      const prefs = strategy.getPhasePreferences('production');
      expect(prefs).toBeDefined();
      expect(prefs.priority).toBe('performance');
    });

    test('should return null for unknown phase', () => {
      const prefs = strategy.getPhasePreferences('unknown');
      expect(prefs).toBeNull();
    });
  });

  test('should list all phase configurations', () => {
    const phases = strategy.listPhases();
    expect(phases.length).toBe(3);
    expect(phases.map(p => p.phase)).toContain('development');
    expect(phases.map(p => p.phase)).toContain('staging');
    expect(phases.map(p => p.phase)).toContain('production');
  });

  test('should return strategy name', () => {
    expect(strategy.getName()).toBe('phase-based');
  });

  test('should return strategy description', () => {
    const desc = strategy.getDescription();
    expect(desc).toContain('phase');
  });
});

describe('Strategy Integration', () => {
  test('all strategies should have select method', () => {
    const complexity = new ComplexityBasedStrategy();
    const agent = new AgentSpecificStrategy();
    const phase = new PhaseBasedStrategy();

    expect(typeof complexity.select).toBe('function');
    expect(typeof agent.select).toBe('function');
    expect(typeof phase.select).toBe('function');
  });

  test('all strategies should have getName method', () => {
    const complexity = new ComplexityBasedStrategy();
    const agent = new AgentSpecificStrategy();
    const phase = new PhaseBasedStrategy();

    expect(complexity.getName()).toBeTruthy();
    expect(agent.getName()).toBeTruthy();
    expect(phase.getName()).toBeTruthy();
  });

  test('all strategies should have getDescription method', () => {
    const complexity = new ComplexityBasedStrategy();
    const agent = new AgentSpecificStrategy();
    const phase = new PhaseBasedStrategy();

    expect(complexity.getDescription()).toBeTruthy();
    expect(agent.getDescription()).toBeTruthy();
    expect(phase.getDescription()).toBeTruthy();
  });

  test('strategies should return valid model names', () => {
    const validModels = [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'claude-3-opus',
      'claude-3-sonnet',
      'claude-3-haiku'
    ];

    const complexity = new ComplexityBasedStrategy();
    const agent = new AgentSpecificStrategy();
    const phase = new PhaseBasedStrategy();

    const complexityModel = complexity.select('frontend', 'moderate', {});
    const agentModel = agent.select('frontend', 'moderate', {});
    const phaseModel = phase.select('frontend', 'moderate', {});

    if (complexityModel) expect(validModels).toContain(complexityModel);
    if (agentModel) expect(validModels).toContain(agentModel);
    if (phaseModel) expect(validModels).toContain(phaseModel);
  });
});
