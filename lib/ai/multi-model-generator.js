/**
 * LEO Kit Multi-Model AI Code Generator
 *
 * Supports multiple Anthropic Claude models:
 * - claude-3-5-sonnet (default) - Balanced performance/cost
 * - claude-4 (claude-opus-4) - High complexity
 * - claude-4-5 (claude-opus-4-5) - Maximum capabilities
 * - claude-haiku (claude-3-haiku) - Fast, lightweight
 *
 * Each model optimized for specific use cases
 */

const chalk = require('chalk');
const Anthropic = require('@anthropic-ai/sdk').default;

/**
 * Model Configuration
 */
const MODEL_CONFIG = {
  'sonnet-3-5': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: 'Balanced performance & cost',
    maxTokens: 4000,
    bestFor: ['General code generation', 'API implementation', 'Feature development'],
    costRank: 'Low',
    speedRank: 'Fast'
  },
  'opus-4': {
    id: 'claude-opus-4-1',
    name: 'Claude 4 (Opus)',
    description: 'High performance & reasoning',
    maxTokens: 4096,
    bestFor: ['Complex architecture', 'Multi-file systems', 'High-quality code'],
    costRank: 'Medium',
    speedRank: 'Standard'
  },
  'opus-4-5': {
    id: 'claude-opus-4-5-20250514',
    name: 'Claude 4.5 (Opus)',
    description: 'Maximum capabilities & reasoning',
    maxTokens: 8000,
    bestFor: ['Enterprise systems', 'Complex algorithms', 'Full-stack applications'],
    costRank: 'High',
    speedRank: 'Standard'
  },
  'haiku-3': {
    id: 'claude-3-haiku-20250307',
    name: 'Claude 3 Haiku',
    description: 'Fast lightweight generation',
    maxTokens: 1024,
    bestFor: ['Quick generation', 'Simple components', 'Testing'],
    costRank: 'Very Low',
    speedRank: 'Very Fast'
  }
};

/**
 * ASCII Art with Gradients
 */
class ASCIIGradient {
  /**
   * Create gradient effect using ANSI colors
   */
  static createGradient(text, startColor, endColor) {
    const colors = [
      startColor,
      chalk.rgb(100, 150, 200),
      chalk.rgb(120, 180, 220),
      chalk.rgb(140, 200, 240),
      endColor
    ];

    const lines = text.split('\n');
    return lines.map((line, i) => {
      const colorIndex = Math.min(i, colors.length - 1);
      return colors[colorIndex](line);
    }).join('\n');
  }

  /**
   * Render beautiful header with gradient
   */
  static renderHeader() {
    const header = `
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║          🚀 LEO Kit 5.0.0 - AI Code Generator 🤖          ║
    ║       Multi-Model Support: Claude Sonnet • 4 • 4.5        ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    `;

    return this.createGradient(
      header,
      chalk.rgb(255, 153, 51),  // Orange start
      chalk.rgb(100, 200, 255)   // Blue end
    );
  }

  /**
   * Render model selection header
   */
  static renderModelHeader(model) {
    const header = `
    ╔════════════════════════════════════════════════════════════╗
    ║  🤖 ${model.name.padEnd(50)}║
    ║  ${model.description.padEnd(56)}║
    ╚════════════════════════════════════════════════════════════╝
    `;

    const color1 = chalk.rgb(102, 204, 255);
    const color2 = chalk.rgb(153, 102, 255);

    return this.createGradient(header, color1, color2);
  }

  /**
   * Render loading animation with gradient
   */
  static renderLoading() {
    const frames = [
      '  ⠋ Generating code...',
      '  ⠙ Analyzing specification...',
      '  ⠹ Building implementation...',
      '  ⠸ Optimizing output...',
      '  ⠼ Finalizing code...',
      '  ⠴ Almost ready...',
      '  ⠦ Completing...',
      '  ⠧ Done!'
    ];

    return frames.map((frame, i) => {
      const colors = [
        chalk.rgb(255, 100, 100),
        chalk.rgb(255, 150, 100),
        chalk.rgb(255, 200, 100),
        chalk.rgb(255, 255, 100),
        chalk.rgb(100, 255, 100),
        chalk.rgb(100, 255, 200),
        chalk.rgb(100, 200, 255),
        chalk.rgb(200, 100, 255)
      ];
      return colors[i % colors.length](frame);
    });
  }

  /**
   * Render success message with gradient
   */
  static renderSuccess(filesCount) {
    const success = `
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║                  ✅ Code Generated Successfully!           ║
    ║                                                            ║
    ║                  📁 Files: ${String(filesCount).padStart(2)}                           ║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    `;

    return this.createGradient(
      success,
      chalk.rgb(100, 255, 100),  // Green start
      chalk.rgb(0, 200, 100)     // Dark green end
    );
  }

  /**
   * Render error message with gradient
   */
  static renderError(error) {
    const errorMsg = `
    ╔════════════════════════════════════════════════════════════╗
    ║                                                            ║
    ║                   ❌ Generation Failed!                    ║
    ║                                                            ║
    ║  ${error.substring(0, 52).padEnd(54)}║
    ║                                                            ║
    ╚════════════════════════════════════════════════════════════╝
    `;

    return this.createGradient(
      errorMsg,
      chalk.rgb(255, 100, 100),  // Red start
      chalk.rgb(200, 0, 0)       // Dark red end
    );
  }

  /**
   * Render model list
   */
  static renderModelList() {
    const header = chalk.rgb(100, 200, 255)('Available Models:\n');
    let output = header;

    Object.entries(MODEL_CONFIG).forEach(([key, model], index) => {
      const colors = [
        chalk.rgb(255, 153, 51),   // Orange
        chalk.rgb(102, 204, 255),  // Light Blue
        chalk.rgb(153, 102, 255),  // Purple
        chalk.rgb(102, 255, 178)   // Green
      ];

      const color = colors[index % colors.length];
      output += color(`\n  ${model.name}`);
      output += chalk.gray(`\n    → ${model.description}`);
      output += chalk.gray(`\n    → Best for: ${model.bestFor[0]}`);
      output += chalk.gray(`\n    → Cost: ${model.costRank} | Speed: ${model.speedRank}\n`);
    });

    return output;
  }
}

/**
 * Multi-Model AI Code Generator
 */
class MultiModelCodeGenerator {
  constructor(options = {}) {
    this.selectedModel = options.model || 'sonnet-3-5';
    this.client = null;
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.autoSelectModel = options.autoSelect || false;

    this._initializeClient();
  }

  /**
   * Initialize Anthropic client
   */
  _initializeClient() {
    if (!this.apiKey) {
      console.warn(
        chalk.yellow('\n⚠️  ANTHROPIC_API_KEY not configured\n') +
        chalk.gray('Set it with: export ANTHROPIC_API_KEY=sk-ant-xxxxx\n')
      );
      return;
    }

    try {
      this.client = new Anthropic({ apiKey: this.apiKey });
    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to initialize Anthropic client: ${error.message}\n`));
      this.client = null;
    }
  }

  /**
   * Get model configuration
   */
  getModelConfig(modelKey = this.selectedModel) {
    return MODEL_CONFIG[modelKey] || MODEL_CONFIG['sonnet-3-5'];
  }

  /**
   * Get all available models
   */
  getAvailableModels() {
    return MODEL_CONFIG;
  }

  /**
   * Select best model based on specification complexity
   */
  autoSelectBestModel(spec) {
    const specText = JSON.stringify(spec).length;
    const taskCount = (spec.tasks || '').split('\n').length;

    // Auto-selection logic
    if (specText > 10000 && taskCount > 20) {
      return 'opus-4-5'; // Most complex
    } else if (specText > 5000 && taskCount > 10) {
      return 'opus-4'; // Complex
    } else if (specText < 2000 && taskCount < 5) {
      return 'haiku-3'; // Simple & fast
    }

    return 'sonnet-3-5'; // Default balanced
  }

  /**
   * Generate code from specification
   */
  async generateFromSpec(spec, options = {}) {
    try {
      // Show header
      console.log('\n' + ASCIIGradient.renderHeader());

      // Auto-select model if enabled
      if (this.autoSelectModel) {
        this.selectedModel = this.autoSelectBestModel(spec);
        console.log(chalk.cyan('\n🔍 Auto-selected model based on complexity...\n'));
      }

      const model = this.getModelConfig(this.selectedModel);
      console.log(ASCIIGradient.renderModelHeader(model));

      // Check for API key
      if (!this.client) {
        console.log(chalk.yellow('\n📝 Using mock response (set ANTHROPIC_API_KEY for real generation)\n'));
        return this._getMockResponse();
      }

      // Build and send prompt
      const prompt = this._buildPrompt(spec, options);
      console.log(chalk.gray('\n🔨 Generating code with AI...\n'));

      const generatedCode = await this._callModel(prompt, model);

      // Show success
      const fileCount = Object.keys(generatedCode).length;
      console.log('\n' + ASCIIGradient.renderSuccess(fileCount));

      return generatedCode;
    } catch (error) {
      console.log('\n' + ASCIIGradient.renderError(error.message));
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Call specific Claude model
   */
  async _callModel(prompt, model) {
    try {
      const message = await this.client.messages.create({
        model: model.id,
        max_tokens: model.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Extract code from response
      const content = message.content[0];
      if (content.type === 'text') {
        try {
          // Try to parse as JSON
          const jsonMatch = content.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          // If not JSON, return as text file
          return {
            'generated-code.txt': content.text
          };
        }
      }

      return this._getMockResponse();
    } catch (error) {
      throw new Error(`Model API error (${model.name}): ${error.message}`);
    }
  }

  /**
   * Build optimized prompt for selected model
   */
  _buildPrompt(spec, options) {
    const model = this.getModelConfig(this.selectedModel);

    // Adjust prompt complexity based on model capabilities
    let prompt = `You are an expert code generator using ${model.name}.

## Project Constitution (Principles)
${spec.constitution || 'No constitution provided'}

## Specification (Requirements)
${spec.specification || 'No specification provided'}

## Implementation Plan (Tech Stack)
${spec.plan || 'No plan provided'}

## Tasks
${spec.tasks || 'No tasks provided'}

## Requirements
1. Generate complete, production-ready code
2. Include comprehensive error handling
3. Add detailed comments for complex logic
4. Follow best practices from the constitution
5. Generate all necessary files (package.json, config, etc.)
6. Include unit tests
7. Follow the technology stack specified in the plan
8. Ensure code is maintainable and scalable

## Output Format
Return ONLY a valid JSON object with filenames as keys and code content as values:
{
  "src/index.js": "code here",
  "tests/index.test.js": "test code here",
  "package.json": "{ configuration }"
}`;

    // For complex models, add advanced requirements
    if (['opus-4', 'opus-4-5'].includes(this.selectedModel)) {
      prompt += `

## Advanced Requirements (${model.name} Optimized)
- Include TypeScript where appropriate
- Add JSDoc comments for all public APIs
- Include performance optimizations
- Add security best practices
- Include CI/CD configuration
- Add documentation for setup and usage`;
    }

    // For Haiku, keep prompt simpler
    if (this.selectedModel === 'haiku-3') {
      prompt += `

## Simplified Requirements (Fast Generation)
- Generate minimal but complete code
- Focus on core functionality
- Skip extensive comments`;
    }

    return prompt;
  }

  /**
   * Get mock response for testing
   */
  _getMockResponse() {
    return {
      'src/index.js': `// Generated with ${this.getModelConfig().name}
export async function main(config) {
  console.log('Implementation generated from specification');
  return { success: true };
}`,
      'tests/index.test.js': `// Test suite generated
describe('Generated Code', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});`,
      'package.json': `{
  "name": "generated-app",
  "version": "1.0.0",
  "type": "module"
}`
    };
  }
}

/**
 * Display model information
 */
function displayModelInfo() {
  console.log('\n' + ASCIIGradient.renderHeader());
  console.log(ASCIIGradient.renderModelList());
}

module.exports = {
  MultiModelCodeGenerator,
  ASCIIGradient,
  MODEL_CONFIG,
  displayModelInfo
};
