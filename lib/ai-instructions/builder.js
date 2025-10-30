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
   * Load agent instruction content from markdown files
   */
  async loadAgentContent(agentName) {
    const agentFiles = {
      orchestrator: 'orchestrator-main.md',
      frontend: 'frontend-agent.md',
      backend: 'backend-agent.md',
      devops: 'devops-agent.md',
      testing: 'testing-agent.md',
      documentation: 'documentation-agent.md',
      designer: 'designer-agent.md'
    };

    const filename = agentFiles[agentName];
    if (!filename) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    const filePath = path.join(__dirname, filename);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      throw new Error(`Failed to load ${agentName} instructions: ${error.message}`);
    }
  }

  /**
   * Get enabled agents from config
   */
  getEnabledAgents(config = {}) {
    const agents = config.agents || {};
    const enabled = ['orchestrator']; // Always include orchestrator

    // Add other enabled agents (must be explicitly enabled: true)
    for (const [name, agentConfig] of Object.entries(agents)) {
      if (name !== 'orchestrator' && agentConfig && agentConfig.enabled === true) {
        enabled.push(name);
      }
    }

    return enabled;
  }

  /**
   * Generate multi-agent instruction content
   * Combines orchestrator + enabled specialized agents
   */
  async generateMultiAgentContent(config = {}) {
    const enabledAgents = this.getEnabledAgents(config);
    const sections = [];

    // Always start with orchestrator
    try {
      const orchestratorContent = await this.loadAgentContent('orchestrator');
      sections.push(orchestratorContent);
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not load orchestrator instructions: ${error.message}`));
    }

    // Add enabled specialized agents
    for (const agentName of enabledAgents) {
      if (agentName === 'orchestrator') continue;

      try {
        const agentContent = await this.loadAgentContent(agentName);
        sections.push('\n\n---\n\n');
        sections.push(agentContent);
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not load ${agentName} instructions: ${error.message}`));
      }
    }

    return sections.join('');
  }

  /**
   * Get universal template content
   * Generates multi-agent content based on config
   */
  async getUniversalTemplate(config = {}) {
    // Check if multi-agent mode is enabled
    const hasAgentConfig = config.agents && Object.keys(config.agents).length > 0;

    if (hasAgentConfig) {
      // Use multi-agent system
      return await this.generateMultiAgentContent(config);
    }

    // Fallback: Load orchestrator only
    try {
      return await this.loadAgentContent('orchestrator');
    } catch (error) {
      throw new Error(`Failed to load instructions: ${error.message}`);
    }
  }

  /**
   * Generate instructions for a specific AI
   */
  async generateForAI(aiName, projectType = 'fullstack', config = {}) {
    try {
      // Get adapter
      const adapter = this.getAdapter(aiName, projectType, config);

      // Get universal template (multi-agent or legacy)
      const universalTemplate = await this.getUniversalTemplate(config);

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

