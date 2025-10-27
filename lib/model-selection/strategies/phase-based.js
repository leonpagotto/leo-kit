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
        priority: 'cost-efficient',
        models: ['gpt-3.5-turbo', 'claude-3-haiku', 'claude-3-sonnet'],
        maxCostPerTask: 0.10,
        reasoning: 'Rapid iteration, cost-effective models preferred'
      },
      staging: {
        strategy: 'balanced',
        priority: 'balanced',
        models: ['claude-3-sonnet', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        maxCostPerTask: 0.50,
        reasoning: 'Pre-production validation with higher quality models'
      },
      production: {
        strategy: 'performance',
        priority: 'performance',
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
      } else if (nodeEnv === 'test' || nodeEnv === 'testing') {
        return 'development'; // Map testing to development
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
   * @param {string|Object} complexity - Complexity level or task object
   * @param {Object} context - Additional context
   * @returns {string} Selected model
   */
  select(agent, complexity, context = {}) {
    const phase = this.detectPhase();
    const preferences = this.phasePreferences[phase] || this.phasePreferences.development;

    // Handle both old (object) and new (string) API
    const complexityLevel = typeof complexity === 'string'
      ? complexity
      : (complexity?.complexity || 'moderate');

    // Map complexity to model selection within phase
    if (phase === 'development') {
      // Development: Always use cheapest
      return preferences.models[0];
    } else if (phase === 'staging') {
      // Staging: Balance based on complexity
      if (complexityLevel === 'simple') {
        return preferences.models[2]; // gpt-3.5-turbo
      }
      return preferences.models[0]; // claude-3-sonnet
    } else if (phase === 'production') {
      // Production: Quality based on complexity
      if (complexityLevel === 'critical' || complexityLevel === 'complex') {
        return preferences.models[0]; // gpt-4 or claude-3-opus
      } else if (complexityLevel === 'moderate') {
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
   * Get phase preferences
   * @param {string} phase - Phase name
   * @returns {Object|null} Phase preferences or null if not found
   */
  getPhasePreferences(phase) {
    return this.phasePreferences[phase] || null;
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
