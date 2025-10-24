/**
 * Model Selector Status Manager
 * Emits real-time updates about model selection changes for UI integration
 */

const EventEmitter = require('events');
const path = require('path');
const fs = require('fs-extra');

class ModelSelectorStatusManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.currentModel = null;
    this.currentAgent = null;
    this.taskId = null;
    this.startTime = null;
    this.statusHistory = [];
    this.maxHistorySize = 50;
    this.statusFile = config.statusFile || path.join(__dirname, '../../.leo-model-status.json');
  }

  /**
   * Notify that model selection is happening
   * @param {string} agent - Agent name
   * @param {Object} task - Task details
   * @param {string} selectedModel - Selected model
   * @param {Object} metadata - Additional metadata
   */
  async onModelSelected(agent, task, selectedModel, metadata = {}) {
    const timestamp = new Date().toISOString();
    const status = {
      timestamp,
      agent,
      model: selectedModel,
      taskId: this.taskId,
      complexity: task?.complexity || 'moderate',
      cost: metadata.cost,
      speed: metadata.speed,
      reason: metadata.reason,
      isActive: true
    };

    this.currentAgent = agent;
    this.currentModel = selectedModel;
    this.statusHistory.push(status);

    // Keep history size manageable
    if (this.statusHistory.length > this.maxHistorySize) {
      this.statusHistory.shift();
    }

    // Write status to file for external monitoring
    await this.writeStatusFile(status);

    // Emit event for listeners
    this.emit('model-selected', {
      agent,
      model: selectedModel,
      timestamp,
      metadata
    });

    return status;
  }

  /**
   * Notify that agent is starting execution
   * @param {string} agent - Agent name
   * @param {Object} task - Task details
   * @param {string} model - Model being used
   */
  async onAgentStart(agent, task, model) {
    this.startTime = Date.now();
    const status = {
      timestamp: new Date().toISOString(),
      event: 'agent-start',
      agent,
      model,
      taskId: this.taskId,
      status: 'in-progress'
    };

    this.statusHistory.push(status);
    await this.writeStatusFile(status);

    this.emit('agent-start', {
      agent,
      model,
      taskId: this.taskId
    });

    // Also emit a status update for VS Code dropdown
    this.emitStatusUpdate(agent, model, 'active');
  }

  /**
   * Notify that agent execution completed
   * @param {string} agent - Agent name
   * @param {Object} result - Execution result
   */
  async onAgentComplete(agent, result = {}) {
    const duration = Date.now() - (this.startTime || Date.now());
    const status = {
      timestamp: new Date().toISOString(),
      event: 'agent-complete',
      agent,
      model: this.currentModel,
      duration,
      success: result.success !== false,
      taskId: this.taskId
    };

    this.statusHistory.push(status);
    await this.writeStatusFile(status);

    this.emit('agent-complete', {
      agent,
      duration,
      success: result.success !== false
    });

    // Emit status cleared (model no longer active)
    this.emitStatusUpdate(agent, null, 'complete');
  }

  /**
   * Emit a status update that VS Code extension can listen for
   * @param {string} agent - Current agent
   * @param {string} model - Current model (null if complete)
   * @param {string} state - 'active', 'complete', 'error'
   */
  emitStatusUpdate(agent, model, state = 'active') {
    const update = {
      timestamp: new Date().toISOString(),
      agent,
      model,
      state,
      taskId: this.taskId
    };

    this.emit('status-update', update);

    // Also emit specific state updates
    if (state === 'active') {
      this.emit('model-active', { agent, model });
    } else if (state === 'complete') {
      this.emit('model-complete', { agent });
    } else if (state === 'error') {
      this.emit('model-error', { agent, model });
    }
  }

  /**
   * Write status to file for external processes to read
   * @param {Object} status - Status object
   */
  async writeStatusFile(status) {
    try {
      const statusData = {
        current: status,
        history: this.statusHistory.slice(-10), // Last 10 events
        timestamp: new Date().toISOString()
      };

      await fs.writeJSON(this.statusFile, statusData, { spaces: 2 });
    } catch (error) {
      console.error('Failed to write status file:', error.message);
    }
  }

  /**
   * Get current status
   * @returns {Object} Current status
   */
  getCurrentStatus() {
    return {
      agent: this.currentAgent,
      model: this.currentModel,
      taskId: this.taskId,
      isActive: !!this.currentAgent,
      recentHistory: this.statusHistory.slice(-5)
    };
  }

  /**
   * Get full history
   * @returns {Array} Complete history
   */
  getHistory() {
    return [...this.statusHistory];
  }

  /**
   * Start a new task
   * @param {string} taskId - Task identifier
   */
  startTask(taskId) {
    this.taskId = taskId;
    this.statusHistory = [];
    this.emit('task-start', { taskId });
  }

  /**
   * Complete a task
   * @param {string} taskId - Task identifier
   * @param {Object} result - Task result
   */
  completeTask(taskId, result = {}) {
    this.emit('task-complete', { taskId, result });
    this.currentAgent = null;
    this.currentModel = null;
    this.taskId = null;
  }

  /**
   * Listen for model selection events
   * @param {Function} callback - Callback function
   */
  onModelChange(callback) {
    this.on('status-update', callback);
  }

  /**
   * Clear event listeners
   */
  removeAllListeners() {
    super.removeAllListeners();
  }
}

module.exports = ModelSelectorStatusManager;
