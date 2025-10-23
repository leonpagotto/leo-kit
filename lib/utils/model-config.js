/**
 * Model Configuration Manager
 * Handles loading and managing model selection configuration from .leorc.json
 */

const fs = require('fs-extra');
const path = require('path');

class ModelConfigManager {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(process.cwd(), '.leorc.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file
   * @returns {Object} Configuration object
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readJsonSync(this.configPath);
        return this.migrateConfig(data);
      }
    } catch (error) {
      console.warn(`Failed to load config from ${this.configPath}:`, error.message);
    }

    return this.getDefaultConfig();
  }

  /**
   * Get default configuration
   * @returns {Object} Default config
   */
  getDefaultConfig() {
    return {
      'model-selection': {
        enabled: false,
        strategy: 'auto', // auto, cost-optimized, performance, balanced
        budgets: {
          daily: 5.00,
          monthly: 50.00,
          perAgent: 10.00
        },
        models: {
          preferred: null, // null = auto-select
          fallback: 'gpt-3.5-turbo',
          blacklist: [] // Models to never use
        },
        providers: {
          openai: {
            enabled: true,
            apiKey: process.env.OPENAI_API_KEY || null
          },
          anthropic: {
            enabled: true,
            apiKey: process.env.ANTHROPIC_API_KEY || null
          }
        },
        phases: {
          development: {
            strategy: 'cost-optimized',
            maxCostPerTask: 0.10
          },
          testing: {
            strategy: 'balanced',
            maxCostPerTask: 0.25
          },
          production: {
            strategy: 'performance',
            maxCostPerTask: 1.00
          }
        },
        agents: {
          orchestrator: {
            preferredModels: ['gpt-4', 'gpt-4-turbo'],
            maxCostPerTask: 0.50
          },
          frontend: {
            preferredModels: ['claude-3-sonnet', 'gpt-4-turbo'],
            maxCostPerTask: 0.25
          },
          backend: {
            preferredModels: ['claude-3-sonnet', 'claude-3-opus'],
            maxCostPerTask: 0.30
          },
          devops: {
            preferredModels: ['gpt-3.5-turbo', 'gpt-4-turbo'],
            maxCostPerTask: 0.15
          },
          testing: {
            preferredModels: ['claude-3-sonnet', 'gpt-3.5-turbo'],
            maxCostPerTask: 0.20
          },
          documentation: {
            preferredModels: ['gpt-3.5-turbo', 'claude-3-haiku'],
            maxCostPerTask: 0.10
          }
        }
      }
    };
  }

  /**
   * Migrate old configuration format to new format
   * @param {Object} config - Old configuration
   * @returns {Object} Migrated configuration
   */
  migrateConfig(config) {
    // Check if model-selection section exists
    if (!config['model-selection']) {
      // First time setup - merge with defaults
      const defaults = this.getDefaultConfig();
      config['model-selection'] = defaults['model-selection'];
      config['model-selection'].enabled = false; // Opt-in feature
    }

    // Migrate from v4.0.x to v4.1.0+ if needed
    if (config['model-selection'] && !config['model-selection'].phases) {
      const defaults = this.getDefaultConfig();
      config['model-selection'].phases = defaults['model-selection'].phases;
      config['model-selection'].agents = defaults['model-selection'].agents;
    }

    return config;
  }

  /**
   * Save configuration to file
   */
  async saveConfig() {
    try {
      await fs.writeJson(this.configPath, this.config, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save config:', error.message);
    }
  }

  /**
   * Get model selection configuration
   * @returns {Object} Model selection config
   */
  getModelSelectionConfig() {
    return this.config['model-selection'] || this.getDefaultConfig()['model-selection'];
  }

  /**
   * Check if model selection is enabled
   * @returns {boolean} True if enabled
   */
  isEnabled() {
    const modelConfig = this.getModelSelectionConfig();
    return modelConfig.enabled === true;
  }

  /**
   * Enable model selection
   */
  async enable() {
    if (!this.config['model-selection']) {
      this.config['model-selection'] = this.getDefaultConfig()['model-selection'];
    }
    this.config['model-selection'].enabled = true;
    await this.saveConfig();
  }

  /**
   * Disable model selection
   */
  async disable() {
    if (this.config['model-selection']) {
      this.config['model-selection'].enabled = false;
      await this.saveConfig();
    }
  }

  /**
   * Get budget configuration
   * @returns {Object} Budget config
   */
  getBudgets() {
    const modelConfig = this.getModelSelectionConfig();
    return modelConfig.budgets || this.getDefaultConfig()['model-selection'].budgets;
  }

  /**
   * Set budget
   * @param {string} type - Budget type (daily, monthly, perAgent)
   * @param {number} amount - Budget amount in USD
   */
  async setBudget(type, amount) {
    if (!this.config['model-selection']) {
      this.config['model-selection'] = this.getDefaultConfig()['model-selection'];
    }
    
    if (!this.config['model-selection'].budgets) {
      this.config['model-selection'].budgets = {};
    }

    this.config['model-selection'].budgets[type] = amount;
    await this.saveConfig();
  }

  /**
   * Get agent-specific configuration
   * @param {string} agent - Agent name
   * @returns {Object} Agent config
   */
  getAgentConfig(agent) {
    const modelConfig = this.getModelSelectionConfig();
    const defaultAgents = this.getDefaultConfig()['model-selection'].agents;
    
    return modelConfig.agents?.[agent] || defaultAgents[agent] || {
      preferredModels: [],
      maxCostPerTask: 0.25
    };
  }

  /**
   * Get provider configuration
   * @param {string} provider - Provider name (openai, anthropic)
   * @returns {Object} Provider config
   */
  getProviderConfig(provider) {
    const modelConfig = this.getModelSelectionConfig();
    const defaultProviders = this.getDefaultConfig()['model-selection'].providers;
    
    return modelConfig.providers?.[provider] || defaultProviders[provider] || {
      enabled: false,
      apiKey: null
    };
  }

  /**
   * Get current phase configuration (development, testing, production)
   * @returns {Object} Phase config
   */
  getCurrentPhase() {
    // Detect phase from environment or default to development
    const phase = process.env.LEO_PHASE || process.env.NODE_ENV || 'development';
    const modelConfig = this.getModelSelectionConfig();
    const defaultPhases = this.getDefaultConfig()['model-selection'].phases;
    
    return modelConfig.phases?.[phase] || defaultPhases.development;
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];
    const warnings = [];
    const modelConfig = this.getModelSelectionConfig();

    // Check if at least one provider is enabled
    if (modelConfig.providers) {
      const enabledProviders = Object.keys(modelConfig.providers).filter(
        p => modelConfig.providers[p].enabled
      );

      if (enabledProviders.length === 0) {
        errors.push('No providers enabled. Enable at least one provider (OpenAI or Anthropic)');
      }

      // Check for API keys
      enabledProviders.forEach(provider => {
        const config = modelConfig.providers[provider];
        if (!config.apiKey && !process.env[`${provider.toUpperCase()}_API_KEY`]) {
          warnings.push(`${provider} is enabled but no API key configured`);
        }
      });
    }

    // Check budgets are reasonable
    if (modelConfig.budgets) {
      if (modelConfig.budgets.daily > modelConfig.budgets.monthly) {
        errors.push('Daily budget cannot exceed monthly budget');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export configuration for display
   * @returns {Object} Formatted config
   */
  export() {
    return this.getModelSelectionConfig();
  }
}

module.exports = ModelConfigManager;
