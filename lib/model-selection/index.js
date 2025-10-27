/**
 * Model Selector
 * Intelligent model selection based on agent type, task complexity, and budget
 */

const CostTracker = require('./cost-tracker');
const fs = require('fs-extra');
const path = require('path');

class ModelSelector {
  constructor(config = {}) {
    this.config = config;
    this.costTracker = new CostTracker(config.costTracking || {});
    this.strategies = {};
    this.providers = {};
    this.modelRegistry = this.initializeModelRegistry();

    // Load strategies
    this.loadStrategies();
  }

  /**
   * Initialize the model registry with available models and their characteristics
   * @returns {Object} Model registry
   */
  initializeModelRegistry() {
    return {
      // OpenAI Models
      'gpt-4': {
        id: 'gpt-4',
        provider: 'openai',
        tier: 'premium',
        strengths: ['reasoning', 'complex-analysis', 'architecture'],
        cost: 'high',
        speed: 'slow'
      },
      'gpt-4-turbo': {
        id: 'gpt-4-turbo',
        provider: 'openai',
        tier: 'premium',
        strengths: ['reasoning', 'coding', 'balanced'],
        cost: 'medium-high',
        speed: 'medium'
      },
      'gpt-3.5-turbo': {
        id: 'gpt-3.5-turbo',
        provider: 'openai',
        tier: 'standard',
        strengths: ['speed', 'simple-tasks', 'cost-effective'],
        cost: 'low',
        speed: 'fast'
      },

      // Anthropic Models
      'claude-3-opus': {
        id: 'claude-3-opus',
        provider: 'anthropic',
        tier: 'premium',
        strengths: ['reasoning', 'complex-analysis', 'long-context'],
        cost: 'high',
        speed: 'slow'
      },
      'claude-3-sonnet': {
        id: 'claude-3-sonnet',
        provider: 'anthropic',
        tier: 'standard',
        strengths: ['balanced', 'coding', 'analysis'],
        cost: 'medium',
        speed: 'medium'
      },
      'claude-3-haiku': {
        id: 'claude-3-haiku',
        provider: 'anthropic',
        tier: 'economy',
        strengths: ['speed', 'simple-tasks', 'cost-effective'],
        cost: 'low',
        speed: 'fast'
      }
    };
  }

  /**
   * Get models as a Map (for backwards compatibility with tests)
   * @returns {Map} Map of model IDs to metadata
   */
  get models() {
    const map = new Map();
    for (const [id, metadata] of Object.entries(this.modelRegistry)) {
      map.set(id, metadata);
    }
    return map;
  }

  /**
   * Load selection strategies
   */
  loadStrategies() {
    const strategiesDir = path.join(__dirname, 'strategies');

    try {
      if (fs.existsSync(strategiesDir)) {
        const strategyFiles = fs.readdirSync(strategiesDir).filter(f => f.endsWith('.js'));

        strategyFiles.forEach(file => {
          try {
            const strategyPath = path.join(strategiesDir, file);
            const Strategy = require(strategyPath);
            const strategyName = path.basename(file, '.js');
            this.strategies[strategyName] = new Strategy(this.config);
          } catch (error) {
            console.warn(`Failed to load strategy ${file}:`, error.message);
          }
        });
      }
    } catch (error) {
      // Strategies directory doesn't exist yet - that's okay
    }
  }

  /**
   * Select the best model for a given agent and task
   * @param {string} agent - Agent name (orchestrator, frontend, backend, etc.)
   * @param {Object} task - Task details
   * @param {string} complexity - Task complexity (simple, moderate, complex, critical)
   * @returns {Promise<string>} Selected model identifier
   */
  async selectModel(agent, task = {}, complexity = 'moderate') {
    // Enhance task with complexity
    const enhancedTask = { ...task, complexity };

    // Check budget first
    const canAfford = await this.costTracker.canAfford(agent, enhancedTask);
    if (!canAfford) {
      console.warn(`Budget exceeded for ${agent}, using fallback model`);
      return this.selectFallback(agent);
    }

    // Apply strategies in order
    let selectedModel = null;

    // 1. Agent-specific strategy
    if (this.strategies['agent-specific']) {
      selectedModel = await this.strategies['agent-specific'].select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        return selectedModel;
      }
    }

    // 2. Complexity-based strategy
    if (this.strategies['complexity-based']) {
      selectedModel = await this.strategies['complexity-based'].select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        return selectedModel;
      }
    }

    // 3. Phase-based strategy (development, testing, deployment)
    if (this.strategies['phase-based']) {
      selectedModel = await this.strategies['phase-based'].select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        return selectedModel;
      }
    }

    // Fallback to default model selection
    return this.selectDefaultModel(agent, complexity);
  }

  /**
   * Select default model based on agent and complexity
   * @param {string} agent - Agent name
   * @param {string} complexity - Task complexity
   * @returns {string} Model identifier
   */
  selectDefaultModel(agent, complexity) {
    // Default mapping
    const defaultMap = {
      orchestrator: {
        simple: 'gpt-3.5-turbo',
        moderate: 'gpt-4-turbo',
        complex: 'gpt-4',
        critical: 'gpt-4'
      },
      frontend: {
        simple: 'claude-3-haiku',
        moderate: 'claude-3-sonnet',
        complex: 'claude-3-sonnet',
        critical: 'claude-3-opus'
      },
      backend: {
        simple: 'claude-3-haiku',
        moderate: 'claude-3-sonnet',
        complex: 'claude-3-opus',
        critical: 'claude-3-opus'
      },
      devops: {
        simple: 'gpt-3.5-turbo',
        moderate: 'gpt-3.5-turbo',
        complex: 'gpt-4-turbo',
        critical: 'gpt-4'
      },
      testing: {
        simple: 'gpt-3.5-turbo',
        moderate: 'claude-3-sonnet',
        complex: 'claude-3-sonnet',
        critical: 'claude-3-opus'
      },
      documentation: {
        simple: 'gpt-3.5-turbo',
        moderate: 'gpt-3.5-turbo',
        complex: 'claude-3-sonnet',
        critical: 'claude-3-sonnet'
      }
    };

    const agentMap = defaultMap[agent] || defaultMap.frontend;
    return agentMap[complexity] || agentMap.moderate;
  }

  /**
   * Select fallback model (cheapest available)
   * @param {string} agent - Agent name
   * @returns {string} Fallback model identifier
   */
  selectFallback(agent) {
    // Always use cheapest model as fallback
    return 'gpt-3.5-turbo';
  }

  /**
   * Check if a model is available
   * @param {string} model - Model identifier
   * @returns {boolean} True if model is available
   */
  isModelAvailable(model) {
    // Check if model exists in registry
    if (!this.modelRegistry[model]) {
      return false;
    }

    // Check if provider is available
    const modelInfo = this.modelRegistry[model];
    const provider = this.providers[modelInfo.provider];

    if (!provider) {
      // Provider not loaded, assume available
      return true;
    }

    return provider.isModelAvailable(model);
  }

  /**
   * Register a provider
   * @param {string} name - Provider name (openai, anthropic, etc.)
   * @param {Object} provider - Provider instance
   */
  registerProvider(name, provider) {
    this.providers[name] = provider;
  }

  /**
   * Register a strategy
   * @param {string} name - Strategy name
   * @param {Object} strategy - Strategy instance
   */
  registerStrategy(name, strategy) {
    this.strategies[name] = strategy;
  }

  /**
   * Get model information
   * @param {string} model - Model identifier
   * @returns {Object|null} Model info or null
   */
  getModelInfo(model) {
    return this.modelRegistry[model] || null;
  }

  /**
   * List all available models
   * @param {Object} filters - Optional filters (tier, provider, cost)
   * @returns {Array} Array of model identifiers
   */
  listModels(filters = {}) {
    let models = Object.keys(this.modelRegistry);

    if (filters.tier) {
      models = models.filter(m => this.modelRegistry[m].tier === filters.tier);
    }

    if (filters.provider) {
      models = models.filter(m => this.modelRegistry[m].provider === filters.provider);
    }

    if (filters.cost) {
      models = models.filter(m => this.modelRegistry[m].cost === filters.cost);
    }

    return models;
  }

  /**
   * Get usage statistics
   * @returns {Object} Usage summary
   */
  getUsageStats() {
    return this.costTracker.getSummary();
  }

  /**
   * Record model usage
   * @param {string} agent - Agent name
   * @param {string} model - Model used
   * @param {Object} task - Task details
   * @param {Object} usage - Usage stats
   */
  async recordUsage(agent, model, task, usage) {
    await this.costTracker.recordUsage(agent, model, task, usage);
  }

  /**
   * Reset usage tracking
   */
  async resetUsage() {
    await this.costTracker.reset();
  }
}

module.exports = ModelSelector;
