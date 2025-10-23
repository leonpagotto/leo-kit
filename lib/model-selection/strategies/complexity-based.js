/**
 * Complexity-Based Strategy
 * Selects models based on task complexity
 */

class ComplexityBasedStrategy {
  constructor(config = {}) {
    this.config = config;
    this.complexityMap = {
      simple: ['gpt-3.5-turbo', 'claude-3-haiku'],
      moderate: ['gpt-4-turbo', 'claude-3-sonnet'],
      complex: ['gpt-4', 'claude-3-opus'],
      critical: ['gpt-4', 'claude-3-opus']
    };
  }

  /**
   * Select model based on task complexity
   * @param {string} agent - Agent name
   * @param {Object} task - Task details
   * @returns {Promise<string>} Selected model
   */
  async select(agent, task) {
    const complexity = task.complexity || 'moderate';
    const candidates = this.complexityMap[complexity] || this.complexityMap.moderate;
    
    // Return first candidate (can be enhanced with availability checks)
    return candidates[0];
  }

  /**
   * Get strategy name
   * @returns {string} Strategy name
   */
  getName() {
    return 'complexity-based';
  }

  /**
   * Get strategy description
   * @returns {string} Description
   */
  getDescription() {
    return 'Selects models based on task complexity level';
  }
}

module.exports = ComplexityBasedStrategy;
