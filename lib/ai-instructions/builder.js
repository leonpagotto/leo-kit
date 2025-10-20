const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Import adapters
const CopilotAdapter = require('./adapters/copilot-adapter');
const CursorAdapter = require('./adapters/cursor-adapter');
const ClineAdapter = require('./adapters/cline-adapter');
const CodeiumAdapter = require('./adapters/codeium-adapter');

/**
 * AI Instructions Builder
 * Orchestrates generation of AI-specific instruction files
 */
class AIInstructionsBuilder {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.adapters = new Map();

    // Register available adapters
    this.registerAdapter('copilot', CopilotAdapter);
    this.registerAdapter('cursor', CursorAdapter);
    this.registerAdapter('cline', ClineAdapter);
    this.registerAdapter('codeium', CodeiumAdapter);
  }

  /**
   * Register an AI adapter
   */
  registerAdapter(name, AdapterClass) {
    this.adapters.set(name, AdapterClass);
  }

  /**
   * Get available AI assistants
   */
  getAvailableAIs() {
    return Array.from(this.adapters.keys());
  }

  /**
   * Get adapter instance for AI
   */
  getAdapter(aiName, projectType = 'fullstack', config = {}) {
    const AdapterClass = this.adapters.get(aiName);
    if (!AdapterClass) {
      throw new Error(`Unknown AI assistant: ${aiName}`);
    }
    return new AdapterClass(projectType, config);
  }

  /**
   * Get universal template content
   * For now, uses existing copilot-instructions-template
   * TODO: Refactor into modular sections
   */
  async getUniversalTemplate() {
    // For MVP, use existing copilot template as universal base
    const templatePath = path.join(__dirname, '../copilot-instructions-template.js');
    const template = require(templatePath);

    // The template is a function that returns content
    if (typeof template === 'function') {
      return template();
    }

    return template;
  }

  /**
   * Generate instructions for a specific AI
   */
  async generateForAI(aiName, projectType = 'fullstack', config = {}) {
    try {
      // Get adapter
      const adapter = this.getAdapter(aiName, projectType, config);

      // Get universal template
      const universalTemplate = await this.getUniversalTemplate();

      // Generate AI-specific instructions
      const instructions = adapter.generateInstructions(universalTemplate);

      // Validate
      if (!adapter.validate(instructions)) {
        throw new Error(`Generated instructions for ${aiName} failed validation`);
      }

      return {
        ai: aiName,
        filePath: adapter.getFilePath(),
        content: instructions,
        metadata: adapter.getMetadata(),
        success: true  // CRITICAL: Mark as success for proper counting
      };
    } catch (error) {
      throw new Error(`Failed to generate instructions for ${aiName}: ${error.message}`);
    }
  }

  /**
   * Generate instructions for multiple AIs
   */
  async generateForMultiple(aiNames, projectType = 'fullstack', config = {}) {
    const results = [];

    for (const aiName of aiNames) {
      try {
        const result = await this.generateForAI(aiName, projectType, config);
        results.push(result);
      } catch (error) {
        console.error(chalk.red(`✗ Failed to generate for ${aiName}:`), error.message);
        results.push({
          ai: aiName,
          error: error.message,
          success: false
        });
      }
    }

    return results;
  }

  /**
   * Write instruction file to disk
   */
  async writeInstructionFile(result) {
    if (result.error) {
      return false;
    }

    const fullPath = path.join(this.projectPath, result.filePath);
    const dirPath = path.dirname(fullPath);

    // Create directory if needed
    await fs.ensureDir(dirPath);

    // Write file
    await fs.writeFile(fullPath, result.content, 'utf8');

    return true;
  }

  /**
   * Generate and write instructions for multiple AIs
   */
  async generateAndWrite(aiNames, projectType = 'fullstack', config = {}) {
    console.log(chalk.cyan('\n🚀 Generating AI instruction files...\n'));

    const results = await this.generateForMultiple(aiNames, projectType, config);
    const summary = {
      success: [],
      failed: []
    };

    for (const result of results) {
      if (result.error) {
        console.log(chalk.red(`  ✗ ${result.ai}: ${result.error}`));
        summary.failed.push(result.ai);
      } else {
        const written = await this.writeInstructionFile(result);
        if (written) {
          console.log(chalk.green(`  ✓ ${result.filePath}`));
          summary.success.push(result.ai);
        } else {
          console.log(chalk.red(`  ✗ ${result.ai}: Failed to write file`));
          summary.failed.push(result.ai);
        }
      }
    }

    console.log('');
    return summary;
  }

  /**
   * Check which AI instruction files exist
   */
  async detectExistingAIs() {
    const existing = [];

    for (const [aiName, AdapterClass] of this.adapters) {
      const adapter = new AdapterClass();
      const filePath = path.join(this.projectPath, adapter.getFilePath());

      if (await fs.pathExists(filePath)) {
        existing.push({
          ai: aiName,
          filePath: adapter.getFilePath(),
          exists: true
        });
      }
    }

    return existing;
  }
}

module.exports = AIInstructionsBuilder;
