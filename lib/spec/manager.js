/**
 * LEO Spec System: Specification-Driven Development
 *
 * Integrates GitHub's spec-kit methodology with LEO kit's governance
 * Enables: Constitution → Spec → Plan → Tasks → AI Code Generation
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

/**
 * Specification Manager - Core spec system
 */
class SpecificationManager {
  constructor(projectDir = process.cwd()) {
    this.projectDir = projectDir;
    this.specDir = path.join(projectDir, '.leo/spec');
    this.featureDir = null;
  }

  /**
   * Initialize spec project
   */
  async init(featureName) {
    try {
      console.log(chalk.cyan.bold('\n📋 Initializing LEO Spec\n'));

      // Create directory structure
      this.featureDir = path.join(this.specDir, featureName);
      await fs.mkdir(this.featureDir, { recursive: true });

      // Create empty spec files
      const files = {
        'constitution.md': this._getConstitutionTemplate(),
        'specification.md': this._getSpecTemplate(),
        'plan.md': this._getPlanTemplate(),
        'tasks.md': this._getTasksTemplate(),
        'metadata.json': JSON.stringify({ name: featureName, created: new Date().toISOString() }, null, 2)
      };

      for (const [filename, content] of Object.entries(files)) {
        const filepath = path.join(this.featureDir, filename);
        await fs.writeFile(filepath, content);
      }

      console.log(chalk.green(`✅ Spec initialized: ${featureName}\n`));
      console.log(chalk.cyan('Next steps:\n'));
      console.log(`  leo spec constitution       # Define project principles`);
      console.log(`  leo spec specify            # Write specification`);
      console.log(`  leo spec plan               # Plan implementation`);
      console.log(`  leo spec tasks              # Generate tasks\n`);

      return { success: true, featureDir: this.featureDir };
    } catch (error) {
      throw new Error(`Failed to init spec: ${error.message}`);
    }
  }

  /**
   * Create constitution (project principles)
   */
  async createConstitution(content) {
    try {
      if (!this.featureDir) {
        throw new Error('Feature not initialized. Run: leo spec init <name>');
      }

      const filepath = path.join(this.featureDir, 'constitution.md');
      await fs.writeFile(filepath, content);

      console.log(chalk.green('\n✅ Constitution created\n'));
      console.log(chalk.cyan('Next: Write specification'));
      console.log(`  leo spec specify\n`);

      return { success: true, path: filepath };
    } catch (error) {
      throw new Error(`Failed to create constitution: ${error.message}`);
    }
  }

  /**
   * Create specification
   */
  async createSpecification(content) {
    try {
      if (!this.featureDir) {
        throw new Error('Feature not initialized. Run: leo spec init <name>');
      }

      const filepath = path.join(this.featureDir, 'specification.md');
      await fs.writeFile(filepath, content);

      console.log(chalk.green('\n✅ Specification created\n'));
      console.log(chalk.cyan('Next: Create implementation plan'));
      console.log(`  leo spec plan\n`);

      return { success: true, path: filepath };
    } catch (error) {
      throw new Error(`Failed to create specification: ${error.message}`);
    }
  }

  /**
   * Create implementation plan
   */
  async createPlan(content) {
    try {
      if (!this.featureDir) {
        throw new Error('Feature not initialized. Run: leo spec init <name>');
      }

      const filepath = path.join(this.featureDir, 'plan.md');
      await fs.writeFile(filepath, content);

      console.log(chalk.green('\n✅ Implementation plan created\n'));
      console.log(chalk.cyan('Next: Generate tasks'));
      console.log(`  leo spec tasks\n`);

      return { success: true, path: filepath };
    } catch (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }
  }

  /**
   * Load all spec documents
   */
  async loadSpec(featureName) {
    try {
      this.featureDir = path.join(this.specDir, featureName);

      const constitution = await this._loadFile('constitution.md');
      const specification = await this._loadFile('specification.md');
      const plan = await this._loadFile('plan.md');
      const tasks = await this._loadFile('tasks.md');

      return {
        constitution,
        specification,
        plan,
        tasks,
        loaded: true
      };
    } catch (error) {
      return { loaded: false, error: error.message };
    }
  }

  /**
   * Analyze specification for consistency
   */
  async analyze(spec) {
    const issues = [];

    // Check if spec parts are complete
    if (!spec.constitution || spec.constitution.includes('TBD')) {
      issues.push('❌ Constitution incomplete - has TBD sections');
    }
    if (!spec.specification || spec.specification.includes('TBD')) {
      issues.push('❌ Specification incomplete - has TBD sections');
    }
    if (!spec.plan || spec.plan.includes('TBD')) {
      issues.push('❌ Plan incomplete - has TBD sections');
    }

    return {
      valid: issues.length === 0,
      issues,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate task list from spec
   */
  async generateTasks(spec) {
    try {
      // Parse spec to extract requirements
      const tasks = this._parseSpecToTasks(spec);

      const taskContent = `# Tasks

Generated from specification at ${new Date().toISOString()}

${tasks.map((task, idx) => `## Task ${idx + 1}: ${task.name}

**Description:** ${task.description}

**Priority:** ${task.priority}

**Effort:** ${task.effort}

- [ ] Implement
- [ ] Test
- [ ] Document

`).join('\n')}

---

Run: \`leo spec implement\` to generate code for these tasks
`;

      const filepath = path.join(this.featureDir, 'tasks.md');
      await fs.writeFile(filepath, taskContent);

      console.log(chalk.green(`\n✅ Generated ${tasks.length} tasks\n`));

      return { success: true, tasks, count: tasks.length };
    } catch (error) {
      throw new Error(`Failed to generate tasks: ${error.message}`);
    }
  }

  /**
   * Get specification status
   */
  async getStatus(featureName) {
    try {
      this.featureDir = path.join(this.specDir, featureName);

      const constitution = await this._loadFile('constitution.md');
      const specification = await this._loadFile('specification.md');
      const plan = await this._loadFile('plan.md');
      const tasks = await this._loadFile('tasks.md');

      const completeness = {
        constitution: constitution ? 100 : 0,
        specification: specification ? 100 : 0,
        plan: plan ? 100 : 0,
        tasks: tasks ? 100 : 0
      };

      const totalComplete = (Object.values(completeness).reduce((a, b) => a + b, 0) / 4).toFixed(0);

      return {
        feature: featureName,
        completeness,
        totalComplete: `${totalComplete}%`,
        status: totalComplete >= 100 ? 'Ready for implementation' : 'In progress'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Private: Check if file exists (helper for tests)
   */
  async _fileExists(filepath) {
    try {
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Private: Load file content
   */
  async _loadFile(filename) {
    try {
      const filepath = path.join(this.featureDir, filename);
      return await fs.readFile(filepath, 'utf-8');
    } catch {
      return null;
    }
  }

  /**
   * Private: Parse spec into tasks
   */
  _parseSpecToTasks(spec) {
    const tasks = [];

    // Extract requirements from specification
    const lines = spec.specification?.split('\n') || [];
    const requirements = lines.filter(line => line.match(/^[-*•]\s+(.+)/));

    requirements.forEach((req, idx) => {
      const name = req.replace(/^[-*•]\s+/, '').trim();
      tasks.push({
        name,
        description: `Implement: ${name}`,
        priority: idx < 3 ? 'High' : 'Medium',
        effort: '4-8 hours'
      });
    });

    return tasks;
  }

  /**
   * Templates
   */
  _getConstitutionTemplate() {
    return `# Project Constitution

Define your project's principles and development guidelines.

## Code Quality Standards

- TBD: Specify code style, linting, formatting
- TBD: Define testing requirements
- TBD: Document code documentation standards

## Development Practices

- TBD: Specify version control strategy
- TBD: Define code review process
- TBD: Specify deployment strategy

## Architecture Principles

- TBD: Define architectural constraints
- TBD: Specify design patterns
- TBD: Define technology choices

---

**Instructions:** Replace TBD sections with specific principles for your project.
`;
  }

  _getSpecTemplate() {
    return `# Specification

Describe what you want to build, focusing on the "what" and "why".

## Overview

TBD: High-level description of the feature

## Requirements

- TBD: Requirement 1
- TBD: Requirement 2
- TBD: Requirement 3

## User Stories

TBD: User stories describing features

\`\`\`
As a [user type]
I want to [do something]
So that [benefit]
\`\`\`

## Acceptance Criteria

- TBD: Acceptance criteria 1
- TBD: Acceptance criteria 2
- TBD: Acceptance criteria 3

---

**Instructions:** Replace TBD sections with your specification details.
`;
  }

  _getPlanTemplate() {
    return `# Implementation Plan

Define your technology stack and architecture choices.

## Technology Stack

- TBD: Frontend framework
- TBD: Backend framework
- TBD: Database
- TBD: Deployment platform

## Architecture

TBD: High-level architecture overview

## Components

- TBD: Component 1
- TBD: Component 2
- TBD: Component 3

## Dependencies

- TBD: External services
- TBD: Libraries
- TBD: Infrastructure

---

**Instructions:** Replace TBD sections with your technical decisions.
`;
  }

  _getTasksTemplate() {
    return `# Tasks

Tasks will be generated from your specification and plan.

Run: \`leo spec tasks\` to auto-generate tasks from your spec.
`;
  }
}

/**
 * AI Code Generator Integration - Multi-Model Support
 *
 * Supports multiple Claude models with intelligent selection
 */
class AICodeGenerator {
  constructor(options = {}) {
    this.provider = options.provider || 'claude';
    this.model = options.model || 'sonnet-3-5';
    this.autoSelect = options.autoSelect || false;
    this.client = null;
    this._initializeClient();

    // Model configurations
    this.modelConfig = {
      'sonnet-3-5': {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Balanced performance & cost (Default)',
        maxTokens: 4000
      },
      'opus-4': {
        id: 'claude-opus-4-1',
        name: 'Claude 4 (Opus)',
        description: 'High performance & reasoning',
        maxTokens: 4096
      },
      'opus-4-5': {
        id: 'claude-opus-4-5-20250514',
        name: 'Claude 4.5 (Opus)',
        description: 'Maximum capabilities & reasoning',
        maxTokens: 8000
      },
      'haiku-3': {
        id: 'claude-3-haiku-20250307',
        name: 'Claude 3 Haiku',
        description: 'Fast lightweight generation',
        maxTokens: 1024
      }
    };
  }

  /**
   * Initialize AI provider client
   */
  _initializeClient() {
    if (this.provider === 'claude') {
      try {
        const Anthropic = require('@anthropic-ai/sdk').default;
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
          console.warn(chalk.yellow('⚠️  ANTHROPIC_API_KEY not set. Using mock responses.\n'));
          this.client = null;
          return;
        }

        this.client = new Anthropic({ apiKey });
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Claude SDK not available: ${error.message}\n`));
        this.client = null;
      }
    }
  }

  /**
   * Auto-select best model based on specification complexity
   */
  _autoSelectModel(spec) {
    const specSize = JSON.stringify(spec).length;
    const taskCount = (spec.tasks || '').split('\n').filter(l => l.trim()).length;

    // Selection logic
    if (specSize > 10000 && taskCount > 20) {
      return 'opus-4-5'; // Complex features
    } else if (specSize > 5000 && taskCount > 10) {
      return 'opus-4'; // Moderate features
    } else if (specSize < 2000 && taskCount < 5) {
      return 'haiku-3'; // Simple & fast
    }

    return 'sonnet-3-5'; // Default: balanced
  }

  /**
   * Get active model config
   */
  _getActiveModel() {
    return this.modelConfig[this.model] || this.modelConfig['sonnet-3-5'];
  }

  /**
   * Generate code from specification
   */
  async generateFromSpec(spec, options = {}) {
    try {
      // Auto-select model if enabled
      if (this.autoSelect) {
        this.model = this._autoSelectModel(spec);
        console.log(chalk.cyan('\n🔍 Auto-selected model based on complexity...\n'));
      }

      const activeModel = this._getActiveModel();
      console.log(chalk.cyan.bold('\n🤖 Generating Code with AI\n'));
      console.log(chalk.gray(`Using provider: ${this.provider}`));
      console.log(chalk.gray(`Model: ${activeModel.name} (${activeModel.description})`));
      console.log(chalk.gray(`Max tokens: ${activeModel.maxTokens}\n`));

      // Build prompt from spec
      const prompt = this._buildPrompt(spec, options, activeModel);

      // Call AI provider
      console.log(chalk.gray('Generating code... (this may take a moment)'));
      const generatedCode = await this._callAIProvider(prompt, activeModel);

      console.log(chalk.green('\n✅ Code generated successfully!\n'));

      return generatedCode;
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Build prompt for AI - optimized per model
   */
  _buildPrompt(spec, options, model) {
    // Provide default model if undefined
    const defaultModel = {
      name: this.modelConfig[this.model]?.name || 'AI Model',
      id: this.modelConfig[this.model]?.id || 'default'
    };
    const activeModel = model || defaultModel;

    let prompt = `You are an expert code generator using ${activeModel.name}.

## Project Constitution (Principles)
${spec.constitution}

## Specification (Requirements)
${spec.specification}

## Implementation Plan (Tech Stack)
${spec.plan}

## Tasks
${spec.tasks}

## Base Requirements
1. Generate complete, working code
2. Include error handling and validation
3. Add comments for complex logic
4. Follow best practices from the constitution
5. Generate all necessary files (package.json, config, README)
6. Include unit tests
7. Follow the technology stack specified in the plan
8. Ensure code is production-ready and maintainable

## Output Format
Return ONLY a valid JSON object with filenames as keys and code content as values:
{
  "src/index.js": "code here",
  "tests/index.test.js": "test code here",
  "package.json": "{ configuration }",
  "README.md": "documentation"
}`;

    // Add model-specific requirements for advanced models
    if (model.id.includes('opus-4-5')) {
      prompt += `

## Enhanced Requirements for ${model.name}
- Include comprehensive TypeScript definitions
- Add JSDoc comments for all public APIs
- Include performance optimizations and benchmarks
- Implement security hardening best practices
- Add CI/CD pipeline configuration
- Include detailed architecture documentation
- Add monitoring and observability code
- Optimize for scalability`;
    } else if (model.id.includes('opus-4-1')) {
      prompt += `

## Advanced Requirements for ${model.name}
- Include TypeScript where appropriate
- Add JSDoc comments for public APIs
- Include performance optimizations
- Add security best practices
- Include CI/CD configuration`;
    } else if (model.id.includes('haiku')) {
      prompt += `

## Simplified Requirements for Fast Generation
- Focus on core functionality
- Keep code concise but complete
- Minimal but clear comments
- Essential configuration only`;
    }

    prompt += `

Generate code now:`;

    return prompt;
  }

  /**
   * Call AI provider
   */
  async _callAIProvider(prompt, model) {
    if (this.provider === 'claude' && this.client) {
      return await this._callClaude(prompt, model);
    }

    // Fallback mock response
    console.log(chalk.gray('(Using mock response - set ANTHROPIC_API_KEY for real generation)'));
    return this._getMockResponse(model);
  }

  /**
   * Call Claude API with specified model
   */
  async _callClaude(prompt, model) {
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

      return this._getMockResponse(model);
    } catch (error) {
      console.error(chalk.red(`\n❌ Claude API error: ${error.message}\n`));
      return this._getMockResponse(model);
    }
  }

  /**
   * Get mock response for testing/fallback
   */
  _getMockResponse(model) {
    const modelName = model ? model.name : 'Claude';
    return {
      'src/main.js': `// Generated code with ${modelName}
// This is a mock response. Set ANTHROPIC_API_KEY to generate real code.

console.log('Generated with LEO Spec System');
console.log('Model: ${modelName}');

module.exports = {};
`,
      'package.json': JSON.stringify({
        name: 'leo-generated',
        version: '1.0.0',
        description: `Generated by LEO Spec System with ${modelName}`
      }, null, 2),
      'README.md': `# Generated Code

This code was generated from a specification using the LEO Spec System.

**Model:** ${modelName}

## Setup

Install dependencies:
\`\`\`
npm install
\`\`\`

Run tests:
\`\`\`
npm test
\`\`\`
`
    };
  }
}

module.exports = { SpecificationManager, AICodeGenerator };
