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
 * AI Code Generator Integration
 */
class AICodeGenerator {
  constructor(provider = 'claude') {
    this.provider = provider;
    this.client = null;
  }

  /**
   * Generate code from specification
   */
  async generateFromSpec(spec, options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🤖 Generating Code with AI\n'));
      console.log(chalk.gray(`Using provider: ${this.provider}`));

      // Build prompt from spec
      const prompt = this._buildPrompt(spec, options);

      // Call AI provider
      console.log(chalk.gray('Generating code... (this may take a moment)'));
      const generatedCode = await this._callAIProvider(prompt);

      console.log(chalk.green('\n✅ Code generated successfully!\n'));

      return generatedCode;
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Build prompt for AI
   */
  _buildPrompt(spec, options) {
    return `You are an expert code generator. Generate production-ready code based on this specification.

## Project Constitution (Principles)
${spec.constitution}

## Specification (Requirements)
${spec.specification}

## Implementation Plan (Tech Stack)
${spec.plan}

## Tasks
${spec.tasks}

## Requirements
1. Generate complete, working code
2. Include error handling
3. Add comments for complex logic
4. Follow best practices from the constitution
5. Generate all necessary files (package.json, config, etc.)
6. Include tests
7. Follow the technology stack specified in the plan

## Output Format
Return a JSON object with filenames as keys and code content as values:
{
  "src/index.js": "code here",
  "tests/index.test.js": "test code here",
  "package.json": "{ configuration }"
}

Generate code now:`;
  }

  /**
   * Call AI provider
   */
  async _callAIProvider(prompt) {
    // Placeholder - will be implemented with actual API calls
    console.log(chalk.gray('(Placeholder - ready for Claude/Copilot integration)'));

    return {
      'src/main.js': '// Generated code',
      'package.json': JSON.stringify({ name: 'generated', version: '1.0.0' }, null, 2)
    };
  }
}

module.exports = { SpecificationManager, AICodeGenerator };
