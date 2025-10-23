/**
 * Base Provider Class
 * Abstract class defining the interface for AI model providers (OpenAI, Anthropic, etc.)
 */

class BaseProvider {
  constructor(config = {}) {
    if (this.constructor === BaseProvider) {
      throw new Error('BaseProvider is an abstract class and cannot be instantiated directly');
    }

    this.config = config;
    this.name = config.name || 'unknown';
    this.apiKey = config.apiKey || process.env[this.getApiKeyEnvVar()];
    this.rateLimits = config.rateLimits || this.getDefaultRateLimits();
    this.lastRequestTime = 0;
    this.requestCount = 0;
  }

  /**
   * Get the environment variable name for the API key
   * @returns {string} Environment variable name
   */
  getApiKeyEnvVar() {
    throw new Error('getApiKeyEnvVar() must be implemented by provider');
  }

  /**
   * Get default rate limits for this provider
   * @returns {Object} Rate limit configuration
   */
  getDefaultRateLimits() {
    return {
      requestsPerMinute: 60,
      tokensPerMinute: 90000,
      requestsPerDay: 10000
    };
  }

  /**
   * Execute a prompt with the AI model
   * @param {string} model - Model identifier (e.g., 'gpt-4', 'claude-3-opus')
   * @param {string} prompt - The prompt to execute
   * @param {Object} options - Additional options (temperature, maxTokens, etc.)
   * @returns {Promise<Object>} Response with content and usage stats
   */
  async execute(model, prompt, options = {}) {
    throw new Error('execute() must be implemented by provider');
  }

  /**
   * Estimate cost for a given prompt
   * @param {string} model - Model identifier
   * @param {string} prompt - The prompt to estimate
   * @param {number} estimatedOutputTokens - Estimated output length
   * @returns {Promise<number>} Estimated cost in USD
   */
  async estimateCost(model, prompt, estimatedOutputTokens = 500) {
    const inputTokens = this.countTokens(prompt);
    const pricing = this.getModelPricing(model);
    
    if (!pricing) {
      throw new Error(`Pricing not found for model: ${model}`);
    }

    const inputCost = (inputTokens / 1000000) * pricing.inputPer1M;
    const outputCost = (estimatedOutputTokens / 1000000) * pricing.outputPer1M;

    return inputCost + outputCost;
  }

  /**
   * Get pricing information for a specific model
   * @param {string} model - Model identifier
   * @returns {Object|null} Pricing info or null if not found
   */
  getModelPricing(model) {
    throw new Error('getModelPricing() must be implemented by provider');
  }

  /**
   * Count tokens in a string (rough estimation)
   * @param {string} text - Text to count tokens for
   * @returns {number} Estimated token count
   */
  countTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters for English
    // More accurate implementations should use tokenizer libraries
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if the model is available/supported by this provider
   * @param {string} model - Model identifier
   * @returns {boolean} True if model is available
   */
  isModelAvailable(model) {
    throw new Error('isModelAvailable() must be implemented by provider');
  }

  /**
   * Validate API key is present and valid format
   * @returns {boolean} True if API key is valid
   */
  validateApiKey() {
    if (!this.apiKey) {
      return false;
    }

    // Basic format validation (override for provider-specific checks)
    return this.apiKey.length > 10;
  }

  /**
   * Check rate limits before making a request
   * @throws {Error} If rate limit exceeded
   */
  async checkRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Minimum time between requests
    const minInterval = (60 * 1000) / this.rateLimits.requestsPerMinute;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get provider statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      provider: this.name,
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      apiKeyConfigured: !!this.apiKey
    };
  }

  /**
   * Reset provider state
   */
  reset() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }
}

module.exports = BaseProvider;
