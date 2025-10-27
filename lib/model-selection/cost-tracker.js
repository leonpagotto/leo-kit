/**
 * Cost Tracker
 * Tracks AI model usage and enforces budget limits
 */

const fs = require('fs-extra');
const path = require('path');

class CostTracker {
  constructor(config = {}) {
    // Support both direct budget object and config with budgets property
    // If config has 'daily', 'monthly', or 'perAgent', treat it as budgets directly
    if (config.daily !== undefined || config.monthly !== undefined || config.perAgent !== undefined) {
      this.config = {};
      this.budgets = { ...this.getDefaultBudgets(), ...config };
    } else {
      this.config = config;
      this.budgets = config.budgets || this.getDefaultBudgets();
    }

    this.usageFile = config.usageFile || path.join(process.cwd(), '.leo', 'model-usage.json');
    this.usage = this.initializeUsage(); // Initialize with empty, will be loaded async
  }  /**
   * Get default budget configuration
   * @returns {Object} Default budgets
   */
  getDefaultBudgets() {
    return {
      daily: 5.00,      // $5 per day
      monthly: 50.00,   // $50 per month
      perAgent: 10.00   // $10 per agent per month
    };
  }

  /**
   * Load usage data from file
   * @returns {Promise<Object>} Usage data
   */
  async loadUsage() {
    try {
      const exists = await fs.pathExists(this.usageFile);
      if (exists) {
        const data = await fs.readJson(this.usageFile);

        // Update current usage from loaded data - preserve the structure
        this.usage = {
          ...this.initializeUsage(),
          ...data
        };

        // Load budgets if present in saved data
        if (data.budgets) {
          this.budgets = data.budgets;
        }

        // Calculate current daily cost from dailyUsage structure (for backwards compatibility)
        if (data.dailyUsage) {
          const today = new Date().toISOString().split('T')[0];
          const todayUsage = data.dailyUsage[today];
          this.usage.dailyCost = todayUsage?.cost || 0;
        }

        // Calculate monthly cost from monthlyUsage structure (for backwards compatibility)
        if (data.monthlyUsage) {
          this.usage.monthlyCost = data.monthlyUsage.cost || 0;

          // Also update agents from monthlyUsage
          if (data.monthlyUsage.byAgent) {
            this.usage.agents = this.usage.agents || {};
            for (const [agent, cost] of Object.entries(data.monthlyUsage.byAgent)) {
              this.usage.agents[agent] = { monthlyCost: cost };
            }
          }
        }

        // Check if we need to reset (new month)
        const lastMonth = data.month ? new Date(data.month).getMonth() : new Date().getMonth();
        const currentMonth = new Date().getMonth();

        if (lastMonth !== currentMonth) {
          this.usage = this.resetMonthlyUsage(data);
        }

        return this.usage;
      } else {
        // File doesn't exist, create it
        this.usage = this.initializeUsage();
        await this.saveUsage();
        return this.usage;
      }
    } catch (error) {
      console.warn('Failed to load usage data:', error.message);
      this.usage = this.initializeUsage();
      return this.usage;
    }
  }  /**
   * Initialize fresh usage data
   * @returns {Object} Fresh usage structure
   */
  initializeUsage() {
    return {
      lastReset: new Date().toISOString(),
      totalCost: 0,
      dailyCost: 0,
      monthlyCost: 0,
      lastDailyReset: new Date().toISOString(),
      agents: {},
      models: {},
      history: []
    };
  }

  /**
   * Reset monthly usage (keep history)
   * @param {Object} oldData - Previous usage data
   * @returns {Object} Reset usage data
   */
  resetMonthlyUsage(oldData) {
    const newData = this.initializeUsage();

    // Set current month
    newData.month = new Date().toISOString().slice(0, 7);

    // Preserve history
    if (oldData.history) {
      newData.history = oldData.history.slice(-100); // Keep last 100 entries
    }

    // Preserve budgets
    if (oldData.budgets) {
      newData.budgets = oldData.budgets;
    }

    // Initialize dailyUsage and monthlyUsage structures
    newData.dailyUsage = {};
    newData.monthlyUsage = {
      cost: 0,
      requests: 0,
      byAgent: {},
      byModel: {}
    };

    return newData;
  }

  /**
   * Save usage data to file
   */
  async saveUsage() {
    try {
      // Ensure month and budgets are in the saved data
      const dataToSave = {
        ...this.usage,
        month: this.usage.month || new Date().toISOString().slice(0, 7),
        budgets: this.budgets
      };

      await fs.ensureDir(path.dirname(this.usageFile));
      await fs.writeJson(this.usageFile, dataToSave, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save usage data:', error.message);
    }
  }

  /**
   * Check if agent can afford to execute a task
   * @param {string} agent - Agent name (orchestrator, frontend, backend, etc.)
   * @param {Object} task - Task details
   * @returns {Promise<boolean>} True if within budget
   */
  async canAfford(agent, task) {
    const estimatedCost = await this.estimateCost(task);

    // Check daily budget
    if (this.usage.dailyCost + estimatedCost > this.budgets.daily) {
      return false;
    }

    // Check monthly budget
    if (this.usage.monthlyCost + estimatedCost > this.budgets.monthly) {
      return false;
    }

    // Check per-agent budget
    const agentCost = this.usage.agents[agent]?.monthlyCost || 0;
    if (agentCost + estimatedCost > this.budgets.perAgent) {
      return false;
    }

    return true;
  }

  /**
   * Estimate cost for a task
   * @param {Object} task - Task details
   * @returns {Promise<number>} Estimated cost in USD
   */
  async estimateCost(task) {
    // Base estimation on task complexity and type
    const baseRates = {
      simple: 0.01,     // $0.01 per simple task
      moderate: 0.05,   // $0.05 per moderate task
      complex: 0.20,    // $0.20 per complex task
      critical: 0.50    // $0.50 per critical task
    };

    const complexity = task.complexity || 'moderate';
    return baseRates[complexity] || baseRates.moderate;
  }

  /**
   * Record actual usage after task completion
   * @param {string} agent - Agent name
   * @param {string} model - Model used
   * @param {Object} task - Task details
   * @param {Object} usage - Actual usage stats (inputTokens, outputTokens, cost)
   */
  async recordUsage(agent, model, task, usage) {
    // Calculate cost if not provided
    let cost = usage.cost;
    if (cost === undefined && usage.inputTokens !== undefined && usage.outputTokens !== undefined) {
      cost = this.calculateCost(model, usage);
    }
    cost = cost || 0;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if we need daily reset
    const lastDailyReset = new Date(this.usage.lastDailyReset);
    if (now.getDate() !== lastDailyReset.getDate()) {
      this.usage.dailyCost = 0;
      this.usage.lastDailyReset = now.toISOString();
    }

    // Initialize dailyUsage structure if needed
    if (!this.usage.dailyUsage) {
      this.usage.dailyUsage = {};
    }

    if (!this.usage.dailyUsage[today]) {
      this.usage.dailyUsage[today] = {
        cost: 0,
        requests: 0,
        byAgent: {},
        byModel: {}
      };
    }

    // Initialize monthlyUsage structure if needed
    if (!this.usage.monthlyUsage) {
      this.usage.monthlyUsage = {
        cost: 0,
        requests: 0,
        byAgent: {},
        byModel: {}
      };
    }

    // Update totals
    this.usage.totalCost += cost;
    this.usage.dailyCost += cost;
    this.usage.monthlyCost += cost;

    // Update dailyUsage structure
    this.usage.dailyUsage[today].cost += cost;
    this.usage.dailyUsage[today].requests++;
    this.usage.dailyUsage[today].byAgent[agent] = (this.usage.dailyUsage[today].byAgent[agent] || 0) + cost;
    this.usage.dailyUsage[today].byModel[model] = (this.usage.dailyUsage[today].byModel[model] || 0) + cost;

    // Update monthlyUsage structure
    this.usage.monthlyUsage.cost += cost;
    this.usage.monthlyUsage.requests++;
    this.usage.monthlyUsage.byAgent[agent] = (this.usage.monthlyUsage.byAgent[agent] || 0) + cost;
    this.usage.monthlyUsage.byModel[model] = (this.usage.monthlyUsage.byModel[model] || 0) + cost;

    // Update agent stats
    if (!this.usage.agents[agent]) {
      this.usage.agents[agent] = {
        totalCost: 0,
        monthlyCost: 0,
        requestCount: 0,
        lastUsed: null
      };
    }

    this.usage.agents[agent].totalCost += cost;
    this.usage.agents[agent].monthlyCost += cost;
    this.usage.agents[agent].requestCount++;
    this.usage.agents[agent].lastUsed = now.toISOString();

    // Update model stats
    if (!this.usage.models[model]) {
      this.usage.models[model] = {
        totalCost: 0,
        requestCount: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0
      };
    }

    this.usage.models[model].totalCost += cost;
    this.usage.models[model].requestCount++;
    this.usage.models[model].totalInputTokens += usage.inputTokens || 0;
    this.usage.models[model].totalOutputTokens += usage.outputTokens || 0;

    // Add to history
    this.usage.history.push({
      timestamp: now.toISOString(),
      agent,
      model,
      task: task.type || 'unknown',
      complexity: task.complexity || 'moderate',
      cost,
      inputTokens: usage.inputTokens || 0,
      outputTokens: usage.outputTokens || 0
    });

    // Keep only last 100 history entries
    if (this.usage.history.length > 100) {
      this.usage.history = this.usage.history.slice(-100);
    }

    await this.saveUsage();
  }

  /**
   * Calculate actual cost based on usage
   * @param {string} model - Model identifier
   * @param {Object} usage - Usage stats
   * @returns {number} Cost in USD
   */
  calculateCost(model, usage) {
    // Pricing per 1M tokens (approximate)
    const pricing = {
      'gpt-4': { input: 30.00, output: 60.00 },
      'gpt-4-turbo': { input: 10.00, output: 30.00 },
      'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
      'claude-3-opus': { input: 15.00, output: 75.00 },
      'claude-3-sonnet': { input: 3.00, output: 15.00 },
      'claude-3-haiku': { input: 0.25, output: 1.25 }
    };

    const modelPricing = pricing[model];

    // Return 0 for unknown models
    if (!modelPricing) {
      return 0;
    }

    const inputCost = (usage.inputTokens / 1000000) * modelPricing.input;
    const outputCost = (usage.outputTokens / 1000000) * modelPricing.output;

    return inputCost + outputCost;
  }

  /**
   * Get usage summary
   * @returns {Object} Usage summary
   */
  getSummary() {
    return {
      daily: {
        cost: this.usage.dailyCost,
        budget: this.budgets.daily,
        remaining: this.budgets.daily - this.usage.dailyCost,
        percentUsed: (this.usage.dailyCost / this.budgets.daily) * 100
      },
      monthly: {
        cost: this.usage.monthlyCost,
        budget: this.budgets.monthly,
        remaining: this.budgets.monthly - this.usage.monthlyCost,
        percentUsed: (this.usage.monthlyCost / this.budgets.monthly) * 100
      },
      agents: Object.keys(this.usage.agents).map(agent => ({
        name: agent,
        cost: this.usage.agents[agent].monthlyCost,
        budget: this.budgets.perAgent,
        requestCount: this.usage.agents[agent].requestCount
      })),
      models: Object.keys(this.usage.models).map(model => ({
        name: model,
        cost: this.usage.models[model].totalCost,
        requestCount: this.usage.models[model].requestCount
      })),
      lastReset: this.usage.lastReset
    };
  }

  /**
   * Reset all usage (for testing or manual reset)
   */
  async reset() {
    this.usage = this.initializeUsage();
    await this.saveUsage();
  }

  /**
   * Export usage data for analysis
   * @returns {Object} Full usage data
   */
  exportData() {
    return { ...this.usage };
  }

  /**
   * Get monthly usage statistics
   * @returns {Object} Monthly usage stats
   */
  getMonthlyUsage() {
    if (this.usage.monthlyUsage) {
      return this.usage.monthlyUsage;
    }

    return {
      cost: this.usage.monthlyCost || 0,
      requests: 0,
      byAgent: {},
      byModel: {}
    };
  }

  /**
   * Get agent-specific usage
   * @param {string} agentName - Name of the agent
   * @returns {number} Total cost for agent
   */
  getAgentUsage(agentName) {
    if (this.usage.monthlyUsage?.byAgent?.[agentName]) {
      return this.usage.monthlyUsage.byAgent[agentName];
    }

    if (this.usage.agents?.[agentName]?.monthlyCost) {
      return this.usage.agents[agentName].monthlyCost;
    }

    return 0;
  }

  /**
   * Update budget limits
   * @param {string} budgetType - 'daily', 'monthly', or 'perAgent'
   * @param {number} amount - New budget amount
   */
  updateBudget(budgetType, amount) {
    if (amount < 0) {
      throw new Error('Budget amount cannot be negative');
    }

    const validTypes = ['daily', 'monthly', 'perAgent'];
    if (!validTypes.includes(budgetType)) {
      throw new Error(`Invalid budget type: ${budgetType}`);
    }

    this.budgets[budgetType] = amount;
  }
}

module.exports = CostTracker;
