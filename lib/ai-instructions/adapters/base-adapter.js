/**
 * Base AI Adapter Interface
 * All AI-specific adapters should extend this class
 */
class BaseAIAdapter {
  constructor(projectType = 'fullstack', config = {}) {
    this.projectType = projectType;
    this.config = config;
  }

  /**
   * Get the AI assistant name
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented by adapter');
  }

  /**
   * Get the instruction file path relative to project root
   * @returns {string}
   */
  getFilePath() {
    throw new Error('getFilePath() must be implemented by adapter');
  }

  /**
   * Get the file format (markdown, json, yaml, etc.)
   * @returns {string}
   */
  getFormat() {
    return 'markdown'; // Default format
  }

  /**
   * Generate AI-specific instruction content from universal template
   * @param {string} universalTemplate - Universal workflow template
   * @returns {string} - AI-specific formatted instructions
   */
  generateInstructions(universalTemplate) {
    throw new Error('generateInstructions() must be implemented by adapter');
  }

  /**
   * Apply AI-specific optimizations to content
   * Override this to add AI-specific tweaks
   * @param {string} content
   * @returns {string}
   */
  optimizeContent(content) {
    return content; // No optimization by default
  }

  /**
   * Validate generated instructions
   * @param {string} content
   * @returns {boolean}
   */
  validate(content) {
    return content && content.length > 0;
  }

  /**
   * Get AI-specific metadata
   * @returns {Object}
   */
  getMetadata() {
    return {
      name: this.getName(),
      filePath: this.getFilePath(),
      format: this.getFormat(),
      projectType: this.projectType
    };
  }
}

module.exports = BaseAIAdapter;

