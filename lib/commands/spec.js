/**
 * LEO Spec Commands
 * Specification-Driven Development commands for leo-workflow-kit
 *
 * Commands:
 * - leo spec init <name>            Create new spec
 * - leo spec constitution            Define project principles
 * - leo spec specify                 Write specification
 * - leo spec plan                    Create implementation plan
 * - leo spec tasks                   Generate task list
 * - leo spec analyze                 Check consistency
 * - leo spec implement               Generate code with AI
 * - leo spec status                  Show spec progress
 */

const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const { SpecificationManager, AICodeGenerator } = require('../spec/manager');

/**
 * Spec Commands Handler
 */
class SpecCommands {
  /**
   * Initialize spec project
   * Usage: leo spec init my-feature
   */
  static async init(featureName, options = {}) {
    try {
      if (!featureName) {
        console.error(chalk.red('\n❌ Feature name required\n'));
        console.log(chalk.cyan('Usage: leo spec init <feature-name>\n'));
        console.log('Examples:');
        console.log('  leo spec init user-dashboard');
        console.log('  leo spec init payment-integration\n');
        return;
      }

      const manager = new SpecificationManager();
      const result = await manager.init(featureName);

      return result;
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Create constitution
   * Usage: leo spec constitution
   */
  static async constitution(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n📜 Create Project Constitution\n'));
      console.log(chalk.gray('Define your project principles and development guidelines.\n'));

      const template = `# Project Constitution

## Code Quality Standards

- Use consistent code style (configured in .eslintrc)
- Minimum 80% test coverage
- All functions documented with JSDoc
- No console logs in production code

## Development Practices

- Feature branch workflow
- Pull request code review required
- Commit messages follow conventional commits
- Semantic versioning for releases

## Architecture Principles

- Modular, composable components
- Single Responsibility Principle
- Dependency Injection for testability
- Clear separation of concerns

## Performance Requirements

- Page load < 2 seconds
- API response < 500ms
- Bundle size < 100KB gzipped
- 60 FPS animations

## Security Standards

- Input validation on all endpoints
- Output encoding for XSS prevention
- CSRF protection enabled
- Rate limiting on APIs
`;

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        await manager.createConstitution(template);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Create specification
   * Usage: leo spec specify
   */
  static async specify(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n📝 Create Specification\n'));
      console.log(chalk.gray('Describe what you want to build (focus on "what" and "why").\n'));

      const template = `# Feature Specification

## Overview

Build a user dashboard that displays hunting team activity and statistics.

## Requirements

- Display active hunts with real-time updates
- Show team member participation
- Calculate and display statistics
- Responsive design (mobile, tablet, desktop)
- Real-time WebSocket updates

## User Stories

\`\`\`
As a team lead
I want to see all active hunts in real-time
So that I can track team progress
\`\`\`

\`\`\`
As a team member
I want to see my statistics and contributions
So that I can understand my impact
\`\`\`

## Acceptance Criteria

- [ ] Dashboard loads in < 2 seconds
- [ ] Real-time updates via WebSocket
- [ ] Mobile responsive layout
- [ ] Shows active hunts, team members, stats
- [ ] 90+ lighthouse score

## Out of Scope

- User authentication (handled separately)
- Data export functionality
- Admin panel
`;

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        await manager.createSpecification(template);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Create implementation plan
   * Usage: leo spec plan
   */
  static async plan(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🏗️  Create Implementation Plan\n'));
      console.log(chalk.gray('Define your technology stack and architecture.\n'));

      const template = `# Implementation Plan

## Technology Stack

**Frontend:**
- React 18 for UI components
- Vite for fast build and hot reload
- TailwindCSS for styling
- Socket.io-client for real-time updates

**Backend:**
- Node.js + Express for API server
- Socket.io for WebSocket events
- MongoDB for data storage
- Redis for caching

**DevOps:**
- Docker for containerization
- GitHub Actions for CI/CD
- AWS EC2 for hosting
- S3 for static assets

## Architecture

\`\`\`
┌──────────────────────────────────┐
│       React Dashboard UI         │
│  (Vite + TailwindCSS)           │
└──────────────┬───────────────────┘
               │ REST API + WebSocket
┌──────────────▼───────────────────┐
│    Node.js Express API Server    │
│  (Socket.io WebSocket support)   │
└──────────────┬───────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼──────┐   ┌─────▼──────┐
│  MongoDB   │   │   Redis    │
│  (Data)    │   │  (Cache)   │
└────────────┘   └────────────┘
\`\`\`

## Components

**Frontend:**
- HuntCard: Display individual hunt
- TeamPanel: Show team members
- StatsGrid: Display statistics
- RealtimeUpdates: WebSocket listener

**Backend:**
- /api/hunts: Get all hunts
- /api/stats: Get statistics
- Socket events: hunt:created, hunt:updated
- Authentication middleware

## Data Models

\`\`\`javascript
Hunt {
  id: string
  names: string[]
  currentPhase: number
  teamMembers: string[]
  startTime: timestamp
  completionTime?: timestamp
}

Stats {
  totalHunts: number
  completedHunts: number
  activeTeams: number
  totalMembers: number
}
\`\`\`

## Deployment

- Development: \`npm run dev\` (Vite dev server)
- Production: \`npm run build && docker build -t dashboard .\`
- Deploy: GitHub Actions → Docker Hub → AWS EC2
`;

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        await manager.createPlan(template);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Generate tasks from spec
   * Usage: leo spec tasks
   */
  static async tasks(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n📋 Generating Task List\n'));

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        const spec = await manager.loadSpec(featureName);

        if (spec.loaded) {
          await manager.generateTasks(spec);
        } else {
          console.error(chalk.red('Specification not fully created'));
        }
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Analyze specification
   * Usage: leo spec analyze
   */
  static async analyze(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🔍 Analyzing Specification\n'));

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        const spec = await manager.loadSpec(featureName);

        if (spec.loaded) {
          const analysis = await manager.analyze(spec);

          if (analysis.valid) {
            console.log(chalk.green('✅ Specification is complete and consistent\n'));
            console.log(chalk.cyan('Ready to proceed:'));
            console.log('  leo spec implement    # Generate code with AI\n');
          } else {
            console.log(chalk.yellow('⚠️  Issues found:\n'));
            analysis.issues.forEach(issue => console.log(`  ${issue}`));
            console.log();
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Generate code from spec (AI)
   * Usage: leo spec implement --ai claude
   */
  static async implement(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n🤖 AI Code Generation\n'));

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      
      if (featureName) {
        manager.featureDir = path.join(manager.specDir, featureName);
        const spec = await manager.loadSpec(featureName);

        if (!spec.loaded) {
          console.error(chalk.red('Specification not found'));
          return;
        }

        // Check if spec is ready
        const analysis = await manager.analyze(spec);
        if (!analysis.valid) {
          console.log(chalk.yellow('⚠️  Warning: Specification has issues:\n'));
          analysis.issues.forEach(issue => console.log(`  ${issue}`));
          console.log();
          console.log(chalk.yellow('Proceeding anyway (may result in incomplete code)\n'));
        }

        // Generate code
        const aiProvider = options.ai || 'claude';
        const generator = new AICodeGenerator(aiProvider);
        
        console.log(chalk.gray(`Using ${aiProvider} for code generation...`));
        console.log(chalk.gray('(Ready for Claude/Copilot API integration)\n'));

        const generatedCode = await generator.generateFromSpec(spec);

        // Save generated code
        await this._saveGeneratedCode(featureName, generatedCode);

        console.log(chalk.green('\n✅ Code generation complete!\n'));
        console.log(chalk.cyan('Next steps:'));
        console.log(`  1. Review generated code: .leo/generated/${featureName}/`);
        console.log(`  2. Run tests: npm test`);
        console.log(`  3. Deploy: leo spec deploy\n`);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Show spec status
   * Usage: leo spec status
   */
  static async status(options = {}) {
    try {
      console.log(chalk.cyan.bold('\n📊 Specification Status\n'));

      const manager = new SpecificationManager();
      const featureName = await this._getFeatureName();
      
      if (featureName) {
        const status = await manager.getStatus(featureName);

        console.log(`Feature: ${chalk.cyan(status.feature)}`);
        console.log(`Status: ${chalk.cyan(status.status)}\n`);

        console.log(chalk.gray('Progress:\n'));
        console.log(`  Constitution:  ${this._progressBar(status.completeness.constitution)}`);
        console.log(`  Specification: ${this._progressBar(status.completeness.specification)}`);
        console.log(`  Plan:          ${this._progressBar(status.completeness.plan)}`);
        console.log(`  Tasks:         ${this._progressBar(status.completeness.tasks)}`);
        console.log(`\n  Overall:       ${chalk.cyan.bold(status.totalComplete)}\n`);
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ ${error.message}\n`));
    }
  }

  /**
   * Private: Save generated code
   */
  static async _saveGeneratedCode(featureName, code) {
    try {
      const outputDir = path.join(process.cwd(), `.leo/generated/${featureName}`);
      await fs.mkdir(outputDir, { recursive: true });

      for (const [filename, content] of Object.entries(code)) {
        const filepath = path.join(outputDir, filename);
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, content);
      }
    } catch (error) {
      throw new Error(`Failed to save generated code: ${error.message}`);
    }
  }

  /**
   * Private: Get current feature name
   */
  static async _getFeatureName() {
    // Try to read from .leo/spec directory
    const specDir = path.join(process.cwd(), '.leo/spec');
    try {
      const features = await fs.readdir(specDir);
      const dirs = features.filter(f => !f.startsWith('.'));
      
      if (dirs.length === 1) {
        return dirs[0];
      } else if (dirs.length > 1) {
        console.log(chalk.yellow('\nMultiple features found. Using first:\n'));
        console.log(`  ${dirs.join('\n  ')}\n`);
        return dirs[0];
      }
    } catch (error) {
      console.error(chalk.red('No spec initialized. Run: leo spec init <name>\n'));
      return null;
    }
  }

  /**
   * Private: Progress bar
   */
  static _progressBar(percent, width = 20) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const color = percent >= 75 ? chalk.green : percent >= 50 ? chalk.yellow : chalk.red;
    return `${color(bar)} ${chalk.bold(percent)}%`;
  }
}

module.exports = SpecCommands;
