/**
 * Model Selector
 * Intelligent model selection based on agent type, task complexity, and budget
 */

const CostTracker = require('./cost-tracker');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ModelSelector {
  constructor(config = {}) {
    this.config = config;
    this.verbose = config.verbose || false;
    this.showReasoning = config['show-reasoning'] || config.showReasoning || false;
    this.enabled = config.enabled !== false; // Default: true
    this.strategy = config.strategy || 'dynamic'; // 'dynamic' or 'fixed'
    this.fixedModel = config['fixed-model'] || config.fixedModel || null;
    this.upgradeDefaults = config['upgrade-defaults'] !== false; // Default: true
    this.costTracker = new CostTracker(config.costTracking || {});
    this.strategies = new Map();  // Use Map for strategies
    this.providers = {};
    this.modelRegistry = this.initializeModelRegistry();

    // Add custom models from config
    if (config['custom-models']) {
      this.addCustomModels(config['custom-models']);
    }

    // Load strategies
    this.loadStrategies();

    // Log configuration if verbose
    if (this.verbose) {
      console.log(chalk.cyan('\n⚙️  Model Selection Configuration:'));
      console.log(chalk.gray(`   Enabled: ${this.enabled}`));
      console.log(chalk.gray(`   Strategy: ${this.strategy}`));
      if (this.fixedModel) {
        console.log(chalk.yellow(`   Fixed Model: ${this.fixedModel} (all agents will use this)`));
        // Show if it's a custom model
        if (!this.modelRegistry[this.fixedModel]) {
          console.log(chalk.gray(`   ℹ️  Custom model (not in default registry)`));
        }
      }
      console.log(chalk.gray(`   Upgraded Defaults: ${this.upgradeDefaults}`));
    }
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
        tier: 'high',
        strengths: ['reasoning', 'coding', 'balanced'],
        cost: 'medium-high',
        speed: 'medium'
      },
      'gpt-4o': {
        id: 'gpt-4o',
        provider: 'openai',
        tier: 'premium',
        strengths: ['multimodal', 'visual-understanding', 'design', 'ui-ux', 'fast-reasoning'],
        cost: 'high',
        speed: 'fast',
        description: 'GPT-4 Omni - Multimodal model with vision, best for design and visual tasks'
      },
      'o1-preview': {
        id: 'o1-preview',
        provider: 'openai',
        tier: 'ultra-premium',
        strengths: ['deep-reasoning', 'complex-problem-solving', 'architecture', 'math', 'science'],
        cost: 'very-high',
        speed: 'very-slow',
        description: 'OpenAI o1 - Advanced reasoning model for complex problems'
      },
      'o1-mini': {
        id: 'o1-mini',
        provider: 'openai',
        tier: 'premium',
        strengths: ['reasoning', 'coding', 'math', 'fast-reasoning'],
        cost: 'high',
        speed: 'medium',
        description: 'OpenAI o1-mini - Faster reasoning model'
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
      'claude-3.5-sonnet': {
        id: 'claude-3.5-sonnet',
        provider: 'anthropic',
        tier: 'ultra-premium',
        strengths: ['coding', 'visual-analysis', 'design', 'ui-ux', 'balanced', 'fast'],
        cost: 'high',
        speed: 'fast',
        description: 'Claude 3.5 Sonnet - Latest model with enhanced coding and visual capabilities'
      },
      'claude-3-sonnet': {
        id: 'claude-3-sonnet',
        provider: 'anthropic',
        tier: 'high',
        strengths: ['balanced', 'coding', 'analysis'],
        cost: 'medium',
        speed: 'medium'
      },
      'claude-3-haiku': {
        id: 'claude-3-haiku',
        provider: 'anthropic',
        tier: 'standard',
        strengths: ['speed', 'simple-tasks', 'cost-effective'],
        cost: 'low',
        speed: 'fast'
      }
    };
  }

  /**
   * Add custom models to the registry
   * @param {Object} customModels - Custom model definitions
   */
  addCustomModels(customModels) {
    for (const [modelId, metadata] of Object.entries(customModels)) {
      this.modelRegistry[modelId] = {
        id: modelId,
        provider: metadata.provider || 'custom',
        tier: metadata.tier || 'premium',
        strengths: metadata.strengths || ['general'],
        cost: metadata.cost || 'unknown',
        speed: metadata.speed || 'unknown',
        description: metadata.description || `Custom model: ${modelId}`,
        custom: true
      };

      if (this.verbose) {
        console.log(chalk.green(`   ✓ Added custom model: ${modelId}`));
      }
    }
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
    // If model selection is disabled, return default high-quality model
    if (!this.enabled) {
      if (this.verbose) {
        console.log(chalk.yellow('\n⚠️  Model selection disabled, using default: claude-3.5-sonnet'));
      }
      return 'claude-3.5-sonnet';
    }

    // If fixed model is set, always use it
    if (this.strategy === 'fixed' || this.fixedModel) {
      const model = this.fixedModel || 'claude-3.5-sonnet';
      if (this.verbose) {
        console.log(chalk.cyan('\n🔒 Fixed Model Mode:'));
        console.log(chalk.gray(`   Agent: ${agent}`));
        console.log(chalk.gray(`   Complexity: ${complexity}`));
        console.log(chalk.green(`   ✓ Using fixed model: ${model}`));

        if (this.showReasoning) {
          const modelInfo = this.modelRegistry[model];
          if (modelInfo) {
            console.log(chalk.gray(`   Provider: ${modelInfo.provider}`));
            console.log(chalk.gray(`   Tier: ${modelInfo.tier}`));
            console.log(chalk.gray(`   Cost: ${modelInfo.cost}`));
            console.log(chalk.gray(`   Speed: ${modelInfo.speed}`));
            if (modelInfo.description) {
              console.log(chalk.gray(`   Info: ${modelInfo.description}`));
            }
          } else {
            // Model not in registry - it's a custom/beta/enterprise model
            console.log(chalk.gray(`   Provider: Unknown (custom model)`));
            console.log(chalk.gray(`   Type: Custom/Beta/Enterprise model`));
            console.log(chalk.yellow(`   ℹ️  This model is not in the default registry`));
            console.log(chalk.yellow(`   ℹ️  Ensure you have API access to: ${model}`));
          }
        }
      }
      return model;
    }

    if (this.verbose) {
      console.log(chalk.cyan('\n🎯 Analyzing task for model selection...'));
      console.log(chalk.gray(`   Agent: ${agent}`));
      console.log(chalk.gray(`   Complexity: ${complexity}`));
    }

    // Normalize task to object or keep as string
    const taskObj = typeof task === 'string' ? task : task;
    const enhancedTask = typeof task === 'object' ? { ...task, complexity } : task;

    // Check budget first (use original task parameter for compatibility)
    const canAfford = await this.costTracker.canAfford(agent, task);
    if (!canAfford) {
      if (this.verbose) {
        console.warn(chalk.yellow(`⚠️  Budget exceeded for ${agent}, using fallback model`));
      }
      return this.selectFallback(agent);
    }

    // Apply strategies in order
    let selectedModel = null;

    // 1. Agent-specific strategy
    if (this.strategies.get && this.strategies.get('agent-specific')) {
      selectedModel = await this.strategies.get('agent-specific').select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        if (this.verbose) {
          console.log(chalk.green(`   ✓ Strategy: agent-specific → ${selectedModel}`));
        }
        return selectedModel;
      }
    }

    // 2. Complexity-based strategy
    if (this.strategies.get && this.strategies.get('complexity-based')) {
      selectedModel = await this.strategies.get('complexity-based').select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        if (this.verbose) {
          console.log(chalk.green(`   ✓ Strategy: complexity-based → ${selectedModel}`));
        }
        return selectedModel;
      }
    }

    // 3. Phase-based strategy (development, testing, deployment)
    if (this.strategies.get && this.strategies.get('phase-based')) {
      selectedModel = await this.strategies.get('phase-based').select(agent, enhancedTask);
      if (selectedModel && this.isModelAvailable(selectedModel)) {
        if (this.verbose) {
          console.log(chalk.green(`   ✓ Strategy: phase-based → ${selectedModel}`));
        }
        return selectedModel;
      }
    }

    // Fallback to default model selection
    if (this.verbose) {
      console.log(chalk.gray(`   Strategy: default (${this.upgradeDefaults ? 'upgraded' : 'balanced'})`));
    }
    return this.selectDefaultModel(agent, complexity);
  }

  /**
   * Select default model based on agent and complexity
   * @param {string} agent - Agent name
   * @param {string} complexity - Task complexity
   * @returns {string} Model identifier
   */
  selectDefaultModel(agent, complexity) {
    // If upgrade-defaults is true, use best available models (no cost optimization)
    if (this.upgradeDefaults) {
      const upgradedDefaults = {
        orchestrator: {
          simple: 'claude-3.5-sonnet',      // Upgraded from claude-3-haiku
          moderate: 'claude-3.5-sonnet',    // Upgraded from claude-3-haiku
          complex: 'gpt-4-turbo',
          critical: 'o1-preview'
        },
        designer: {
          simple: 'gpt-4o',
          moderate: 'gpt-4o',
          complex: 'gpt-4o',
          critical: 'gpt-4o'
        },
        frontend: {
          simple: 'claude-3.5-sonnet',      // Upgraded from claude-3-haiku
          moderate: 'claude-3.5-sonnet',
          complex: 'claude-3.5-sonnet',
          critical: 'claude-3.5-sonnet'     // Upgraded from o1-preview
        },
        backend: {
          simple: 'claude-3.5-sonnet',      // Upgraded from claude-3-haiku
          moderate: 'claude-3.5-sonnet',
          complex: 'claude-3.5-sonnet',     // Downgraded from claude-3-opus for consistency
          critical: 'claude-3-opus'
        },
        devops: {
          simple: 'gpt-4-turbo',            // Upgraded from claude-3-haiku
          moderate: 'gpt-4-turbo',
          complex: 'gpt-4-turbo',
          critical: 'o1-preview'            // Upgraded from o1-mini
        },
        testing: {
          simple: 'claude-3.5-sonnet',      // Upgraded from claude-3-haiku
          moderate: 'claude-3.5-sonnet',
          complex: 'claude-3.5-sonnet',
          critical: 'claude-3-opus'
        },
        documentation: {
          simple: 'claude-3.5-sonnet',      // Upgraded from claude-3-haiku
          moderate: 'claude-3.5-sonnet',    // Upgraded from claude-3-haiku
          complex: 'claude-3.5-sonnet',
          critical: 'claude-3.5-sonnet'
        }
      };

      const agentMap = upgradedDefaults[agent] || upgradedDefaults.orchestrator;
      const selectedModel = agentMap[complexity] || agentMap.moderate;

      if (this.verbose) {
        const modelInfo = this.modelRegistry[selectedModel];
        console.log(chalk.cyan('\n🤖 Model Selection (Upgraded Defaults):'));
        console.log(chalk.gray(`   Agent: ${agent}`));
        console.log(chalk.gray(`   Complexity: ${complexity}`));
        console.log(chalk.green(`   ✓ Selected: ${selectedModel}`));

        if (this.showReasoning && modelInfo) {
          console.log(chalk.gray(`   Provider: ${modelInfo.provider}`));
          console.log(chalk.gray(`   Tier: ${modelInfo.tier}`));
          console.log(chalk.gray(`   Cost: ${modelInfo.cost}`));
          console.log(chalk.gray(`   Speed: ${modelInfo.speed}`));
          if (modelInfo.description) {
            console.log(chalk.gray(`   Info: ${modelInfo.description}`));
          }
        }
      }

      return selectedModel;
    }

    // Original cost-optimized defaults (balanced approach)
    const defaultMap = {
      orchestrator: {
        simple: 'claude-3-haiku',  // Fast for simple routing decisions
        moderate: 'claude-3-haiku',  // Cost-effective for orchestration
        complex: 'gpt-4-turbo',  // Powerful reasoning when needed
        critical: 'o1-preview'  // Deep reasoning for critical decisions
      },
      designer: {
        simple: 'gpt-4o',  // GPT-4o for ALL design (visual understanding)
        moderate: 'gpt-4o',  // Multimodal excels at UI/UX prototyping
        complex: 'gpt-4o',  // Best visual model for complex designs
        critical: 'gpt-4o'  // Top choice for critical design work
      },
      frontend: {
        simple: 'claude-3-haiku',  // Fast for simple components
        moderate: 'claude-3.5-sonnet',  // Best coding for standard work
        complex: 'claude-3.5-sonnet',  // Excellent for complex UI
        critical: 'claude-3.5-sonnet'  // Top choice for critical frontend
      },
      backend: {
        simple: 'claude-3-haiku',  // Fast for simple endpoints
        moderate: 'claude-3.5-sonnet',  // Upgraded - best for APIs
        complex: 'claude-3.5-sonnet',  // Excellent for complex logic
        critical: 'claude-3-opus'  // Most powerful for critical backend
      },
      devops: {
        simple: 'claude-3-haiku',  // Fast for simple deployments
        moderate: 'gpt-4-turbo',  // Good for infrastructure
        complex: 'gpt-4-turbo',  // Handles complex DevOps
        critical: 'o1-mini'  // Reasoning for critical infra
      },
      testing: {
        simple: 'claude-3-haiku',  // Fast for simple unit tests
        moderate: 'claude-3.5-sonnet',  // Best test generation
        complex: 'claude-3.5-sonnet',  // Comprehensive test coverage
        critical: 'claude-3-opus'  // Critical test scenarios
      },
      documentation: {
        simple: 'claude-3-haiku',  // Fast and cost-effective
        moderate: 'claude-3-haiku',  // Perfect for standard docs
        complex: 'claude-3.5-sonnet',  // Complex technical writing
        critical: 'claude-3.5-sonnet'  // Critical documentation
      }
    };

    const agentMap = defaultMap[agent] || defaultMap.frontend;
    const selectedModel = agentMap[complexity] || agentMap.moderate;

    // Show verbose output if enabled
    if (this.verbose) {
      const modelInfo = this.modelRegistry[selectedModel];
      console.log(chalk.cyan('\n🤖 Model Selection (Balanced):'));
      console.log(chalk.gray(`   Agent: ${agent}`));
      console.log(chalk.gray(`   Complexity: ${complexity}`));
      console.log(chalk.green(`   ✓ Selected: ${selectedModel}`));

      if (this.showReasoning && modelInfo) {
        console.log(chalk.gray(`   Provider: ${modelInfo.provider}`));
        console.log(chalk.gray(`   Tier: ${modelInfo.tier}`));
        console.log(chalk.gray(`   Cost: ${modelInfo.cost}`));
        console.log(chalk.gray(`   Speed: ${modelInfo.speed}`));
        if (modelInfo.description) {
          console.log(chalk.gray(`   Info: ${modelInfo.description}`));
        }
      }
    }

    return selectedModel;
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
    // ALWAYS return true - accept any model name
    // This allows users to use models not in our registry (beta models, enterprise models, etc.)
    // The actual validation happens at the API provider level
    return true;

    // Legacy code (kept for reference):
    // // Check if model exists in registry
    // if (!this.modelRegistry[model]) {
    //   return false;
    // }
    //
    // // Check if provider is available
    // const modelInfo = this.modelRegistry[model];
    // const provider = this.providers[modelInfo.provider];
    //
    // if (!provider) {
    //   // Provider not loaded, assume available
    //   return true;
    // }
    //
    // return provider.isModelAvailable(model);
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
    this.strategies.set(name, strategy);
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
