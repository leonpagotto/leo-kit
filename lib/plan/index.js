/**
 * Spec Planning - Architecture and implementation plan generation
 *
 * Part of Phase 1: Spec Kit Integration (Day 5-6)
 * This module generates detailed technical implementation plans
 * for spec issues that have been clarified.
 *
 * Key Features:
 * - Parse spec requirements
 * - Generate architecture plan (components, data model, APIs)
 * - Suggest tech stack based on requirements
 * - Create implementation breakdown (tasks)
 * - Post plan as GitHub issue comment
 * - Label management (add 'planned', remove 'needs-planning')
 *
 * @module lib/plan
 */

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

/**
 * Plan template structure
 */
const PLAN_TEMPLATE = {
  sections: [
    'Architecture Overview',
    'Tech Stack',
    'Data Model',
    'API Contracts',
    'Component Breakdown',
    'Implementation Phases',
    'Testing Strategy',
    'Deployment Plan'
  ]
};

/**
 * PlanManager - Main class for implementation planning
 */
class PlanManager {
  constructor() {
    this.template = PLAN_TEMPLATE;
  }

  /**
   * Generate implementation plan for a spec issue
   *
   * @param {number|string} issueNumber - GitHub issue number
   * @param {Object} options - Planning options
   * @param {boolean} options.autoPost - Automatically post plan as comment
   * @param {boolean} options.updateLabels - Update labels (add 'planned', remove 'needs-planning')
   * @param {string} options.focus - Focus area (architecture, api, data, testing)
   * @returns {Promise<Object>} Planning results
   */
  async plan(issueNumber, options = {}) {
    const {
      autoPost = true,
      updateLabels = true,
      focus = null
    } = options;

    console.log(chalk.blue(`📐 Generating implementation plan for issue #${issueNumber}...`));

    // Step 1: Load spec issue
    const spec = await this._loadSpecIssue(issueNumber);

    // Step 2: Parse spec sections
    const sections = this._parseSpecSections(spec.body);

    // Step 3: Check if clarification is needed
    const clarificationNeeded = await this._checkClarificationStatus(spec, sections);
    if (clarificationNeeded) {
      console.log(chalk.yellow('\n⚠️  Spec has gaps/ambiguities - consider running leo clarify first'));
      console.log(chalk.gray('   Proceeding with planning anyway...\n'));
    }

    // Step 4: Generate implementation plan
    const plan = this._generatePlan(sections, spec, focus);

    // Step 5: Format plan as comment
    const comment = this._formatPlanComment(plan, spec);

    // Step 6: Post to GitHub (if autoPost)
    if (autoPost) {
      await this._postComment(issueNumber, comment);
      console.log(chalk.green(`✅ Posted implementation plan to issue #${issueNumber}`));
    }

    // Step 7: Update labels (if updateLabels)
    if (updateLabels) {
      await this._updateLabels(issueNumber);
    }

    return {
      issueNumber,
      plan,
      comment
    };
  }

  /**
   * Load spec issue from GitHub
   */
  async _loadSpecIssue(issueNumber) {
    try {
      const command = `gh issue view ${issueNumber} --json number,title,body,labels`;
      const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
      const issue = JSON.parse(output);

      // Verify it's a spec issue
      const hasSpecLabel = issue.labels.some(l => l.name === 'spec');
      if (!hasSpecLabel) {
        console.log(chalk.yellow(`⚠️  Issue #${issueNumber} doesn't have 'spec' label - planning anyway`));
      }

      return issue;

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to load issue: ${error.message}`));
      throw error;
    }
  }

  /**
   * Parse spec sections from issue body
   */
  _parseSpecSections(body) {
    const sections = {};
    const sectionRegex = /^## (.+?)$/gm;

    let match;
    let lastIndex = 0;
    let lastSection = null;

    while ((match = sectionRegex.exec(body)) !== null) {
      if (lastSection) {
        const content = body.substring(lastIndex, match.index).trim();
        sections[lastSection] = content;
      }
      lastSection = match[1];
      lastIndex = match.index + match[0].length;
    }

    if (lastSection) {
      const content = body.substring(lastIndex).trim();
      sections[lastSection] = content;
    }

    return sections;
  }

  /**
   * Check if clarification is needed (basic check)
   */
  async _checkClarificationStatus(spec, sections) {
    // Simple heuristic: check for common gaps
    let needsClarification = false;

    if (!sections['Context'] || sections['Context'].length < 50) {
      needsClarification = true;
    }

    if (!sections['Requirements'] || (sections['Requirements'].match(/- \[ \]/g) || []).length < 3) {
      needsClarification = true;
    }

    return needsClarification;
  }

  /**
   * Generate implementation plan
   */
  _generatePlan(sections, spec, focus = null) {
    const plan = {
      title: spec.title,
      issueNumber: spec.number,
      sections: {}
    };

    // Extract requirements for plan generation
    const requirements = sections['Requirements'] || '';
    const context = sections['Context'] || '';
    const technicalApproach = sections['Technical Approach'] || '';

    // Generate each plan section
    if (!focus || focus === 'architecture') {
      plan.sections['Architecture Overview'] = this._generateArchitectureOverview(requirements, context);
    }

    if (!focus || focus === 'tech') {
      plan.sections['Tech Stack'] = this._generateTechStack(requirements, technicalApproach);
    }

    if (!focus || focus === 'data') {
      plan.sections['Data Model'] = this._generateDataModel(requirements);
    }

    if (!focus || focus === 'api') {
      plan.sections['API Contracts'] = this._generateAPIContracts(requirements);
    }

    if (!focus || focus === 'components') {
      plan.sections['Component Breakdown'] = this._generateComponentBreakdown(requirements);
    }

    if (!focus || focus === 'phases') {
      plan.sections['Implementation Phases'] = this._generateImplementationPhases(requirements);
    }

    if (!focus || focus === 'testing') {
      plan.sections['Testing Strategy'] = this._generateTestingStrategy(requirements, sections['Acceptance Criteria'] || '');
    }

    if (!focus || focus === 'deployment') {
      plan.sections['Deployment Plan'] = this._generateDeploymentPlan(requirements);
    }

    return plan;
  }

  /**
   * Generate architecture overview
   */
  _generateArchitectureOverview(requirements, context) {
    // Detect architecture patterns from requirements
    const needsRealtime = /real-time|websocket|live|collaborative/i.test(requirements + context);
    const needsAuth = /auth|login|user|session|permission/i.test(requirements + context);
    const needsAPI = /api|endpoint|rest|graphql/i.test(requirements + context);
    const needsDB = /database|data|store|persist/i.test(requirements + context);

    let architecture = '**Architecture Pattern:** ';

    if (needsAPI && needsDB) {
      architecture += 'Layered Architecture (Controller → Service → Repository)\n\n';
    } else if (needsRealtime) {
      architecture += 'Event-Driven Architecture with WebSockets\n\n';
    } else {
      architecture += 'Modular Architecture\n\n';
    }

    architecture += '**Key Components:**\n';

    if (needsAuth) {
      architecture += '- Authentication & Authorization Layer\n';
    }
    if (needsAPI) {
      architecture += '- API Layer (REST/GraphQL endpoints)\n';
    }
    if (needsDB) {
      architecture += '- Data Access Layer (Repository pattern)\n';
    }
    architecture += '- Business Logic Layer (Service classes)\n';
    if (needsRealtime) {
      architecture += '- Real-time Communication Layer (WebSocket/SSE)\n';
    }
    architecture += '- Error Handling & Validation\n';
    architecture += '- Logging & Monitoring\n\n';

    architecture += '**Design Principles:**\n';
    architecture += '- Single Responsibility Principle\n';
    architecture += '- Dependency Injection\n';
    architecture += '- Test-Driven Development\n';
    architecture += '- API-First Design\n';

    return architecture;
  }

  /**
   * Generate tech stack recommendations
   */
  _generateTechStack(requirements, technicalApproach) {
    const isNode = /node|express|javascript|typescript/i.test(requirements + technicalApproach);
    const isPython = /python|django|flask/i.test(requirements + technicalApproach);
    const needsRealtime = /real-time|websocket|live/i.test(requirements);
    const needsAuth = /auth|oauth/i.test(requirements);

    let stack = '**Backend:**\n';

    if (isPython) {
      stack += '- Python + FastAPI/Flask\n';
    } else {
      stack += '- Node.js + Express/Fastify\n';
      stack += '- TypeScript (for type safety)\n';
    }

    stack += '\n**Database:**\n';
    stack += '- PostgreSQL (primary data store)\n';
    stack += '- Redis (caching & sessions)\n';

    if (needsRealtime) {
      stack += '\n**Real-time:**\n';
      stack += '- Socket.io or WebSocket API\n';
      stack += '- Redis Pub/Sub (for horizontal scaling)\n';
    }

    if (needsAuth) {
      stack += '\n**Authentication:**\n';
      stack += '- Passport.js / OAuth2\n';
      stack += '- JWT for tokens\n';
    }

    stack += '\n**Testing:**\n';
    stack += '- Jest (unit tests)\n';
    stack += '- Supertest (API tests)\n';
    stack += '- Playwright (E2E tests)\n';

    stack += '\n**DevOps:**\n';
    stack += '- Docker (containerization)\n';
    stack += '- GitHub Actions (CI/CD)\n';
    stack += '- Railway/Vercel (deployment)\n';

    return stack;
  }

  /**
   * Generate data model
   */
  _generateDataModel(requirements) {
    const needsUsers = /user|account|profile/i.test(requirements);
    const needsSessions = /session|auth|login/i.test(requirements);

    let model = '```typescript\n';

    if (needsUsers) {
      model += '// User model\ninterface User {\n';
      model += '  id: string;\n';
      model += '  email: string;\n';
      model += '  name: string;\n';
      model += '  createdAt: Date;\n';
      model += '  updatedAt: Date;\n';
      model += '}\n\n';
    }

    if (needsSessions) {
      model += '// Session model\ninterface Session {\n';
      model += '  id: string;\n';
      model += '  userId: string;\n';
      model += '  token: string;\n';
      model += '  expiresAt: Date;\n';
      model += '}\n\n';
    }

    model += '// Add feature-specific models here\n';
    model += '```\n\n';
    model += '**Database Schema:**\n';
    model += '- Use migrations for schema changes\n';
    model += '- Add indexes on foreign keys and frequently queried fields\n';
    model += '- Use UUIDs for primary keys\n';
    model += '- Add timestamps (createdAt, updatedAt) to all tables\n';

    return model;
  }

  /**
   * Generate API contracts
   */
  _generateAPIContracts(requirements) {
    let api = '**REST API Endpoints:**\n\n';

    // Extract potential endpoints from requirements
    const hasAuth = /auth|login|signup/i.test(requirements);
    const hasCRUD = /create|read|update|delete|list|get/i.test(requirements);

    if (hasAuth) {
      api += '```\nPOST   /api/auth/signup      - Create new account\n';
      api += 'POST   /api/auth/login       - Authenticate user\n';
      api += 'POST   /api/auth/logout      - End session\n';
      api += 'GET    /api/auth/me          - Get current user\n```\n\n';
    }

    if (hasCRUD) {
      api += '```\nPOST   /api/resources        - Create resource\n';
      api += 'GET    /api/resources        - List resources\n';
      api += 'GET    /api/resources/:id    - Get resource by ID\n';
      api += 'PUT    /api/resources/:id    - Update resource\n';
      api += 'DELETE /api/resources/:id    - Delete resource\n```\n\n';
    }

    api += '**Request/Response Format:**\n\n';
    api += '```typescript\n';
    api += '// Success response\n';
    api += '{\n';
    api += '  success: true,\n';
    api += '  data: { ... }\n';
    api += '}\n\n';
    api += '// Error response\n';
    api += '{\n';
    api += '  success: false,\n';
    api += '  error: {\n';
    api += '    code: "ERROR_CODE",\n';
    api += '    message: "Human readable error"\n';
    api += '  }\n';
    api += '}\n';
    api += '```\n\n';
    api += '**API Design Principles:**\n';
    api += '- RESTful conventions\n';
    api += '- Consistent error handling\n';
    api += '- Pagination for list endpoints\n';
    api += '- Rate limiting\n';
    api += '- API versioning (/api/v1/...)\n';

    return api;
  }

  /**
   * Generate component breakdown
   */
  _generateComponentBreakdown(requirements) {
    let breakdown = '**Backend Components:**\n\n';
    breakdown += '1. **Controllers** - Handle HTTP requests/responses\n';
    breakdown += '2. **Services** - Business logic implementation\n';
    breakdown += '3. **Repositories** - Data access layer\n';
    breakdown += '4. **Middleware** - Auth, validation, error handling\n';
    breakdown += '5. **Utils** - Helper functions, constants\n\n';

    breakdown += '**Frontend Components:** (if applicable)\n\n';
    breakdown += '1. **Pages** - Route-level components\n';
    breakdown += '2. **UI Components** - Reusable UI elements\n';
    breakdown += '3. **Hooks** - Custom React hooks\n';
    breakdown += '4. **Services** - API client, state management\n';
    breakdown += '5. **Utils** - Formatting, validation helpers\n\n';

    breakdown += '**Shared:**\n\n';
    breakdown += '1. **Types** - TypeScript interfaces/types\n';
    breakdown += '2. **Constants** - Shared constants, configs\n';
    breakdown += '3. **Validators** - Input validation schemas\n';

    return breakdown;
  }

  /**
   * Generate implementation phases
   */
  _generateImplementationPhases(requirements) {
    let phases = '**Phase 1: Foundation** (Day 1-2)\n';
    phases += '- [ ] Set up project structure\n';
    phases += '- [ ] Configure database & migrations\n';
    phases += '- [ ] Set up testing framework\n';
    phases += '- [ ] Create basic data models\n\n';

    phases += '**Phase 2: Core Features** (Day 3-5)\n';
    phases += '- [ ] Implement business logic\n';
    phases += '- [ ] Create API endpoints\n';
    phases += '- [ ] Add error handling\n';
    phases += '- [ ] Write unit tests\n\n';

    phases += '**Phase 3: Integration** (Day 6-7)\n';
    phases += '- [ ] Frontend integration (if applicable)\n';
    phases += '- [ ] Integration tests\n';
    phases += '- [ ] End-to-end tests\n';
    phases += '- [ ] Performance optimization\n\n';

    phases += '**Phase 4: Polish & Deploy** (Day 8-9)\n';
    phases += '- [ ] Documentation\n';
    phases += '- [ ] Code review\n';
    phases += '- [ ] Security audit\n';
    phases += '- [ ] Deployment\n\n';

    phases += '**Estimated Timeline:** 9-10 days\n';

    return phases;
  }

  /**
   * Generate testing strategy
   */
  _generateTestingStrategy(requirements, acceptanceCriteria) {
    let testing = '**Test Pyramid:**\n\n';
    testing += '1. **Unit Tests** (70% coverage)\n';
    testing += '   - Test individual functions/methods\n';
    testing += '   - Mock external dependencies\n';
    testing += '   - Fast execution (< 1s total)\n\n';

    testing += '2. **Integration Tests** (20% coverage)\n';
    testing += '   - Test API endpoints end-to-end\n';
    testing += '   - Use test database\n';
    testing += '   - Verify request/response contracts\n\n';

    testing += '3. **E2E Tests** (10% coverage)\n';
    testing += '   - Test critical user flows\n';
    testing += '   - Browser-based testing (if UI)\n';
    testing += '   - Smoke tests for deployment\n\n';

    testing += '**Coverage Requirements:**\n';
    testing += '- Minimum 80% code coverage\n';
    testing += '- 100% coverage for critical paths\n';
    testing += '- All API endpoints tested\n\n';

    testing += '**Test Scenarios (from Acceptance Criteria):**\n';
    const criteriaList = acceptanceCriteria.split('\n').filter(l => l.includes('- [ ]'));
    criteriaList.forEach((criterion, index) => {
      testing += `${index + 1}. ${criterion.replace('- [ ]', '').trim()}\n`;
    });

    return testing;
  }

  /**
   * Generate deployment plan
   */
  _generateDeploymentPlan(requirements) {
    let deployment = '**Deployment Strategy:**\n\n';
    deployment += '**Environment Setup:**\n';
    deployment += '- Development: Local with Docker Compose\n';
    deployment += '- Staging: Railway/Vercel (preview deployments)\n';
    deployment += '- Production: Railway/Vercel (main branch)\n\n';

    deployment += '**CI/CD Pipeline:**\n';
    deployment += '1. Push to branch → Run tests\n';
    deployment += '2. Create PR → Run tests + lint + type check\n';
    deployment += '3. Merge to main → Deploy to staging\n';
    deployment += '4. Manual approval → Deploy to production\n\n';

    deployment += '**Deployment Checklist:**\n';
    deployment += '- [ ] Environment variables configured\n';
    deployment += '- [ ] Database migrations run\n';
    deployment += '- [ ] Health check endpoint working\n';
    deployment += '- [ ] Monitoring/logging setup\n';
    deployment += '- [ ] Rollback plan documented\n';

    return deployment;
  }

  /**
   * Format plan as GitHub comment (Markdown)
   */
  _formatPlanComment(plan, spec) {
    let comment = `# 📐 Implementation Plan: ${plan.title}\n\n`;
    comment += `**Issue:** #${plan.issueNumber}\n\n`;
    comment += '---\n\n';

    // Add each plan section
    for (const [sectionName, sectionContent] of Object.entries(plan.sections)) {
      comment += `## ${sectionName}\n\n${sectionContent}\n\n`;
    }

    comment += '---\n\n';
    comment += '## Next Steps\n\n';
    comment += '1. Review this plan and provide feedback\n';
    comment += '2. Break down into smaller tasks/issues if needed\n';
    comment += '3. Assign team members to phases\n';
    comment += '4. Start implementation following Phase 1\n\n';
    comment += '_Generated by `leo plan`_\n';

    return comment;
  }

  /**
   * Post comment to GitHub issue
   */
  async _postComment(issueNumber, comment) {
    try {
      const commentFile = path.join('/tmp', `leo-plan-${Date.now()}.md`);
      await fs.writeFile(commentFile, comment, 'utf-8');

      execSync(`gh issue comment ${issueNumber} --body-file "${commentFile}"`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      await fs.unlink(commentFile);

    } catch (error) {
      console.error(chalk.red(`\n❌ Failed to post comment: ${error.message}`));
      throw error;
    }
  }

  /**
   * Update labels (add 'planned', remove 'needs-planning')
   */
  async _updateLabels(issueNumber) {
    try {
      // Ensure 'planned' label exists
      try {
        execSync(`gh label list --json name | grep '"name":"planned"'`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        // Create label
        execSync(`gh label create "planned" --description "Spec has implementation plan" --color "0E8A16"`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
        console.log(chalk.gray(`   Created label: planned`));
      }

      // Add 'planned' label
      execSync(`gh issue edit ${issueNumber} --add-label "planned"`, {
        encoding: 'utf-8',
        cwd: process.cwd()
      });

      // Remove 'needs-planning' label (if exists)
      try {
        execSync(`gh issue edit ${issueNumber} --remove-label "needs-planning"`, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      } catch (error) {
        // Label might not exist, ignore
      }

      console.log(chalk.green(`✅ Updated labels: +planned, -needs-planning`));

    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not update labels: ${error.message}`));
    }
  }
}

module.exports = PlanManager;
