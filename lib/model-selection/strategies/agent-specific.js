/**
 * Agent-Specific Strategy
 * Selects models based on agent role and specialized requirements
 */

class AgentSpecificStrategy {
  constructor(config = {}) {
    this.config = config;

    // Agent-specific model preferences
    this.agentPreferences = {
      orchestrator: {
        primary: ['gpt-4', 'gpt-4-turbo'],
        fallback: ['gpt-3.5-turbo'],
        reasoning: 'Needs strong reasoning for task routing and coordination'
      },
      frontend: {
        primary: ['claude-3-sonnet', 'gpt-4-turbo'],
        fallback: ['claude-3-haiku', 'gpt-3.5-turbo'],
        reasoning: 'UI/UX requires good design sense and React expertise'
      },
      backend: {
        primary: ['claude-3-opus', 'claude-3-sonnet', 'gpt-4'],
        fallback: ['gpt-3.5-turbo'],
        reasoning: 'Complex logic, API design, database optimization'
      },
      devops: {
        primary: ['gpt-4-turbo', 'gpt-3.5-turbo'],
        fallback: ['gpt-3.5-turbo'],
        reasoning: 'Infrastructure scripts, straightforward but critical'
      },
      testing: {
        primary: ['claude-3-sonnet', 'gpt-4-turbo'],
        fallback: ['gpt-3.5-turbo'],
        reasoning: 'Test generation and edge case analysis'
      },
      documentation: {
        primary: ['gpt-3.5-turbo', 'claude-3-haiku'],
        fallback: ['gpt-3.5-turbo'],
        reasoning: 'Content generation, cost-effective'
      }
    };
  }

  /**
   * Select model based on agent role
   * @param {string} agent - Agent name
   * @param {string|Object} complexity - Complexity level or task object
   * @param {Object} context - Additional context
   * @returns {string} Selected model
   */
  select(agent, complexity, context = {}) {
    const preferences = this.agentPreferences[agent];

    // Return null for unknown agents
    if (!preferences) {
      return null;
    }

    // Handle both old (object) and new (string) API
    const complexityLevel = typeof complexity === 'string'
      ? complexity
      : (complexity?.complexity || 'moderate');

    if (complexityLevel === 'simple' || complexityLevel === 'low') {
      // Use fallback for simple tasks to save cost
      return preferences.fallback[0];
    }

    // Use primary models for moderate/complex tasks
    return preferences.primary[0];
  }  /**
   * Get agent preferences
   * @param {string} agent - Agent name
   * @returns {Object} Agent preferences
   */
  getAgentPreferences(agent) {
    return this.agentPreferences[agent] || null;
  }

  /**
   * Get strategy name
   * @returns {string} Strategy name
   */
  getName() {
    return 'agent-specific';
  }

  /**
   * Get strategy description
   * @returns {string} Description
   */
  getDescription() {
    return 'Selects models based on agent role and specialized requirements';
  }

  /**
   * List all agent configurations
   * @returns {Array} Agent configurations
   */
  listAgents() {
    return Object.keys(this.agentPreferences).map(agent => ({
      agent,
      primary: this.agentPreferences[agent].primary,
      fallback: this.agentPreferences[agent].fallback,
      reasoning: this.agentPreferences[agent].reasoning
    }));
  }
}

module.exports = AgentSpecificStrategy;
