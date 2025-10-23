/**
 * Phase-Based Strategy
 * Selects models based on development phase (development, testing, production)
 */

class PhaseBasedStrategy {
  constructor(config = {}) {
    this.config = config;
    
    // Phase-specific preferences
    this.phasePreferences = {
      development: {
        strategy: 'cost-optimized',
        models: ['gpt-3.5-turbo', 'claude-3-haiku', 'claude-3-sonnet'],
        maxCostPerTask: 0.10,
        reasoning: 'Rapid iteration, cost-effective models preferred'
      },
      testing: {
        strategy: 'balanced',
        models: ['claude-3-sonnet', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        maxCostPerTask: 0.25,
        reasoning: 'Balance between accuracy and cost for test generation'
      },
      staging: {
        strategy: 'performance',
        models: ['gpt-4-turbo', 'claude-3-sonnet', 'gpt-4'],
        maxCostPerTask: 0.50,
        reasoning: 'Pre-production validation with higher quality models'
      },
      production: {
        strategy: 'performance',
        models: ['gpt-4', 'claude-3-opus', 'gpt-4-turbo'],
        maxCostPerTask: 1.00,
        reasoning: 'Production-grade responses, reliability over cost'
      }
    };
  }

  /**
   * Detect current phase from environment
   * @returns {string} Current phase
   */
  detectPhase() {
    // Check LEO_PHASE environment variable
    if (process.env.LEO_PHASE) {
      return process.env.LEO_PHASE.toLowerCase();
    }

    // Fallback to NODE_ENV
    if (process.env.NODE_ENV) {
      const nodeEnv = process.env.NODE_ENV.toLowerCase();
      
      // Map NODE_ENV to phases
      if (nodeEnv === 'development' || nodeEnv === 'dev') {
        return 'development';
      } else if (nodeEnv === 'test') {
        return 'testing';
      } else if (nodeEnv === 'staging') {
        return 'staging';
      } else if (nodeEnv === 'production' || nodeEnv === 'prod') {
        return 'production';
      }
    }

    // Default to development
    return 'development';
  }

  /**
   * Select model based on current phase
   * @param {string} agent - Agent name
   * @param {Object} task - Task details
   * @returns {Promise<string>} Selected model
   */
  async select(agent, task) {
    const phase = this.detectPhase();
    const preferences = this.phasePreferences[phase] || this.phasePreferences.development;
    
    // Consider task complexity
    const complexity = task.complexity || 'moderate';
    
    // Map complexity to model selection within phase
    if (phase === 'development') {
      // Development: Always use cheapest
      return preferences.models[0];
    } else if (phase === 'testing') {
      // Testing: Balance based on complexity
      if (complexity === 'simple') {
        return preferences.models[2]; // gpt-3.5-turbo
      }
      return preferences.models[0]; // claude-3-sonnet
    } else if (phase === 'production') {
      // Production: Quality based on complexity
      if (complexity === 'critical' || complexity === 'complex') {
        return preferences.models[0]; // gpt-4 or claude-3-opus
      } else if (complexity === 'moderate') {
        return preferences.models[2]; // gpt-4-turbo
      }
      return preferences.models[1]; // claude-3-sonnet
    }
    
    // Default: first model in phase preferences
    return preferences.models[0];
  }

  /**
   * Get current phase info
   * @returns {Object} Phase information
   */
  getCurrentPhaseInfo() {
    const phase = this.detectPhase();
    return {
      phase,
      ...this.phasePreferences[phase]
    };
  }

  /**
   * Check if task cost is within phase budget
   * @param {number} estimatedCost - Estimated cost
   * @returns {boolean} True if within budget
   */
  isWithinPhaseBudget(estimatedCost) {
    const phase = this.detectPhase();
    const preferences = this.phasePreferences[phase] || this.phasePreferences.development;
    return estimatedCost <= preferences.maxCostPerTask;
  }

  /**
   * Get strategy name
   * @returns {string} Strategy name
   */
  getName() {
    return 'phase-based';
  }

  /**
   * Get strategy description
   * @returns {string} Description
   */
  getDescription() {
    return 'Selects models based on development phase (development, testing, production)';
  }

  /**
   * List all phase configurations
   * @returns {Array} Phase configurations
   */
  listPhases() {
    return Object.keys(this.phasePreferences).map(phase => ({
      phase,
      ...this.phasePreferences[phase]
    }));
  }
}

module.exports = PhaseBasedStrategy;
