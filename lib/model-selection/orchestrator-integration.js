/**
 * Model Selection Orchestrator Integration
 *
 * Integrates model selection with orchestration and broadcasts real-time updates
 * to VS Code and other listeners for live model display
 */

const ModelSelector = require('./index');
const ModelSelectorStatusManager = require('./status-manager');

class ModelSelectionOrchestrator extends ModelSelector {
  constructor(config = {}) {
    super(config);
    this.statusManager = new ModelSelectorStatusManager(config);
    this.agentSequence = [];
    this.taskId = null;
  }

  /**
   * Select model with orchestration tracking
   * @param {string} agent - Agent name
   * @param {Object} task - Task details
   * @param {string} complexity - Task complexity
   * @returns {Promise<string>} Selected model
   */
  async selectModelWithTracking(agent, task = {}, complexity = 'moderate') {
    // Get task ID if starting new task
    if (!this.taskId) {
      this.taskId = this.generateTaskId();
      this.statusManager.startTask(this.taskId);
    }

    // Track agent in sequence
    this.agentSequence.push(agent);

    // Notify start of agent execution
    await this.statusManager.onAgentStart(agent, task, null);

    try {
      // Select model using parent class
      const selectedModel = await this.selectModel(agent, task, complexity);

      // Get metadata about selected model
      const modelInfo = this.getModelInfo(selectedModel);
      const metadata = {
        cost: modelInfo?.cost,
        speed: modelInfo?.speed,
        strengths: modelInfo?.strengths,
        reason: `Selected ${selectedModel} for ${agent} agent (${complexity} complexity)`
      };

      // Notify model selection
      await this.statusManager.onModelSelected(agent, task, selectedModel, metadata);

      return selectedModel;
    } catch (error) {
      this.statusManager.emit('model-error', {
        agent,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Notify completion of agent work
   * @param {string} agent - Agent name
   * @param {Object} result - Execution result
   */
  async completeAgent(agent, result = {}) {
    await this.statusManager.onAgentComplete(agent, result);
  }

  /**
   * Complete entire task
   * @param {Object} result - Task result
   */
  async completeTask(result = {}) {
    this.statusManager.completeTask(this.taskId, result);
    this.taskId = null;
    this.agentSequence = [];
  }

  /**
   * Get status manager for listening to events
   * @returns {ModelSelectorStatusManager} Status manager instance
   */
  getStatusManager() {
    return this.statusManager;
  }

  /**
   * Generate unique task ID
   * @returns {string} Task ID
   */
  generateTaskId() {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current execution status
   * @returns {Object} Status
   */
  getExecutionStatus() {
    return {
      taskId: this.taskId,
      agentSequence: this.agentSequence,
      ...this.statusManager.getCurrentStatus()
    };
  }

  /**
   * Get execution history
   * @returns {Array} Execution history
   */
  getExecutionHistory() {
    return this.statusManager.getHistory();
  }
}

/**
 * Usage Example
 *
 * // Create orchestrator
 * const orchestrator = new ModelSelectionOrchestrator({
 *   statusFile: path.join(require('os').homedir(), '.leo-model-status.json')
 * });
 *
 * // Listen for model changes
 * orchestrator.getStatusManager().on('status-update', (update) => {
 *   console.log(`Model changed: ${update.agent} → ${update.model}`);
 * });
 *
 * // Execute feature request
 * async function buildFeature() {
 *   try {
 *     // Designer phase
 *     const designerModel = await orchestrator.selectModelWithTracking(
 *       'designer',
 *       { feature: 'checkout form' },
 *       'moderate'
 *     );
 *     console.log(`Designer using: ${designerModel}`);
 *     // ... designer work ...
 *     await orchestrator.completeAgent('designer', { success: true });
 *
 *     // Frontend phase
 *     const frontendModel = await orchestrator.selectModelWithTracking(
 *       'frontend',
 *       { feature: 'checkout form', designModel: designerModel },
 *       'moderate'
 *     );
 *     console.log(`Frontend using: ${frontendModel}`);
 *     // ... frontend work ...
 *     await orchestrator.completeAgent('frontend', { success: true });
 *
 *     // Backend phase
 *     const backendModel = await orchestrator.selectModelWithTracking(
 *       'backend',
 *       { feature: 'checkout feature', frontendModel: frontendModel },
 *       'complex'
 *     );
 *     console.log(`Backend using: ${backendModel}`);
 *     // ... backend work ...
 *     await orchestrator.completeAgent('backend', { success: true });
 *
 *     // Complete task
 *     await orchestrator.completeTask({ success: true });
 *
 *   } catch (error) {
 *     console.error('Feature build failed:', error);
 *     await orchestrator.completeTask({ success: false, error: error.message });
 *   }
 * }
 *
 * buildFeature();
 */

module.exports = ModelSelectionOrchestrator;
