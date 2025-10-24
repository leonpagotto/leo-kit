# 🦁 LionPack Technical Implementation Guide

**Building the Team-Based Workflow System**

> This guide details how to implement LionPack's core systems: team management, role-based coordination, hunt cycles, and team analytics.

**Document Version:** 1.0  
**Status:** Implementation Guide  
**Target Audience:** Developers implementing LionPack

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Data Models](#data-models)
4. [Command Implementation](#command-implementation)
5. [AI Agent Adaptation](#ai-agent-adaptation)
6. [Automation Workflows](#automation-workflows)
7. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### System Layers

```
┌─────────────────────────────────────────────────────┐
│              CLI Layer (Commands)                    │
│  team, role, hunt, handoff, metrics, etc.          │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│          Orchestration Layer                         │
│  Pack Manager, Hunt Coordinator, Handoff Engine     │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│          Business Logic Layer                        │
│  Team Manager, Role Manager, Cycle Tracker          │
│  Analytics Engine, GitHub Sync                      │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│             Storage Layer                            │
│  .lionpack.json (config), .lionpack/data/           │
│  GitHub Issues, GitHub Projects, GitHub Actions     │
└─────────────────────────────────────────────────────┘
```

### Data Flow: Hunt Cycle

```
User creates feature
       ↓
[Hunt Start] → Create hunt cycle record
       ↓
[Phase 1] → Requirements Hunter ← AI: Requirements Analyzer
       ↓ (Handoff)
[Phase 2] → Spec Refiner ← AI: Spec Master
       ↓ (Create issues)
[Phase 3] → Implementation Hunter ← AI: Implementation Expert
       ↓ (Handoff per task)
[Phase 4] → QA Specialist ← AI: QA Expert
       ↓ (Merge & close)
[Hunt Complete] → Record metrics → Next hunt
```

---

## Core Components

### 1. Team Manager (`lib/team/pack.js`)

**Responsibility:** Manage team structure, members, and roles

```javascript
class TeamPack {
  constructor(packName, organization, repository) {
    this.packName = packName;
    this.organization = organization;
    this.repository = repository;
    this.members = [];
    this.config = {
      autoHandoff: true,
      notifyRole: true,
      trackAnalytics: true,
      huntCycleDays: 7
    };
  }

  /**
   * Initialize pack from local config
   * @returns {TeamPack}
   */
  static async load() {
    // Read .lionpack.json
    // Load members from GitHub
    // Validate structure
  }

  /**
   * Add team member
   * @param {string} username - GitHub username
   * @param {string} role - requirements|spec|implementation|testing
   */
  async addMember(username, role) {
    // Verify role
    // Verify GitHub user exists
    // Add to members array
    // Save to .lionpack.json
    // Set GitHub team membership if needed
  }

  /**
   * Assign member to role
   * @param {string} username
   * @param {string} newRole
   */
  async assignRole(username, newRole) {
    // Find member
    // Validate new role
    // Update role
    // Notify member
    // Record change
  }

  /**
   * Get member by role
   * @param {string} role
   * @returns {Object} member object
   */
  getMemberByRole(role) {
    return this.members.find(m => m.role === role);
  }

  /**
   * Get all members with their current workload
   * @returns {Object} members with task counts
   */
  async getMembersWithWorkload() {
    // For each member, count assigned issues
    // Return members with workload info
  }

  /**
   * Save pack configuration
   */
  async save() {
    // Write .lionpack.json
    // Update GitHub if needed
  }
}
```

### 2. Hunt Cycle Tracker (`lib/team/tracker.js`)

**Responsibility:** Track pack hunts through their lifecycle

```javascript
class HuntCycleTracker {
  constructor(packName) {
    this.packName = packName;
    this.hunts = [];
  }

  /**
   * Load all hunts from GitHub + local storage
   */
  static async load(packName) {
    // Read from .lionpack/hunts.json
    // Fetch from GitHub issues with "pack-hunt" label
    // Merge and deduplicate
  }

  /**
   * Start new hunt cycle
   * @param {string} featureName
   * @param {string} description
   * @returns {HuntCycle}
   */
  async startHunt(featureName, description) {
    const hunt = new HuntCycle(
      `hunt-${Date.now()}`,
      featureName,
      description,
      this.packName
    );

    // Create GitHub issue with pack-hunt label
    // Create hunt record in .lionpack/hunts.json
    // Assign to Requirements Hunter
    // Set status to "requirements"

    this.hunts.push(hunt);
    return hunt;
  }

  /**
   * Transition hunt to next phase
   * @param {string} huntId
   * @param {string} nextPhase
   * @param {string} nextRole
   */
  async transitionHunt(huntId, nextPhase, nextRole) {
    const hunt = this.hunts.find(h => h.id === huntId);

    // Validate phase transition
    // Create GitHub comment: "Phase complete"
    // Assign issue to next role member
    // Update GitHub issue status
    // Update local hunt record

    hunt.currentPhase = nextPhase;
    hunt.currentRole = nextRole;
    hunt.phaseHistory.push({
      phase: nextPhase,
      assignee: nextRole,
      startTime: new Date(),
      previousPhaseDuration: calculateDuration(hunt)
    });

    await this.save();
  }

  /**
   * Complete hunt cycle
   * @param {string} huntId
   */
  async completeHunt(huntId) {
    const hunt = this.hunts.find(h => h.id === huntId);

    hunt.status = "completed";
    hunt.completedAt = new Date();

    // Close all related issues
    // Record metrics
    // Create hunt completion comment with stats
    // Update analytics

    await this.recordMetrics(hunt);
    await this.save();
  }

  /**
   * Get active hunts
   * @returns {Array} active hunt objects
   */
  getActiveHunts() {
    return this.hunts.filter(h => h.status !== "completed");
  }

  /**
   * Get hunt by ID
   * @param {string} huntId
   * @returns {HuntCycle}
   */
  getHunt(huntId) {
    return this.hunts.find(h => h.id === huntId);
  }

  /**
   * Save hunt data
   */
  async save() {
    // Write to .lionpack/hunts.json
  }
}
```

### 3. Handoff Engine (`lib/team/handoff.js`)

**Responsibility:** Automate role-to-role transitions

```javascript
class HandoffEngine {
  /**
   * Execute handoff from one role to next
   * @param {string} huntId
   * @param {string} fromRole
   * @param {string} toRole
   * @param {Object} context - Additional data to pass
   */
  static async executeHandoff(huntId, fromRole, toRole, context = {}) {
    // 1. Validate handoff
    validateHandoff(fromRole, toRole);

    // 2. Get target team member
    const pack = await TeamPack.load();
    const toMember = pack.getMemberByRole(toRole);

    if (!toMember) {
      throw new Error(`No team member assigned to role: ${toRole}`);
    }

    // 3. Get GitHub issue
    const issue = await fetchGitHubIssue(huntId);

    // 4. Update GitHub
    await updateGitHubIssue(issue.number, {
      assignees: [toMember.username],
      labels: [
        `phase-${toRole}`,
        'pack-hunt',
        'awaiting-' + toRole
      ]
    });

    // 5. Add handoff comment
    await addGitHubComment(issue.number, `
🤝 **Handoff from ${fromRole} to ${toRole}**

**${toMember.name}** - Your turn to hunt! 🦁

**Context passed:**
${formatContext(context)}

⏭️ Start with: Review phase output, proceed with your role's responsibilities.
    `);

    // 6. Send notification
    await notifyMember(toMember, 'handoff', {
      huntId,
      fromRole,
      issue: issue.number,
      context
    });

    // 7. Update tracker
    const tracker = await HuntCycleTracker.load(pack.packName);
    await tracker.transitionHunt(huntId, toRole, toMember.username);
  }

  /**
   * Auto-handoff workflow for requirements complete
   */
  static async onRequirementsComplete(huntId, context) {
    return this.executeHandoff(huntId, 'requirements', 'spec', {
      requirements: context.requirements,
      acceptanceCriteria: context.acceptanceCriteria
    });
  }

  /**
   * Auto-handoff workflow for spec complete
   */
  static async onSpecComplete(huntId, context) {
    // Create implementation issues from spec
    const issues = await createImplementationIssues(context.tasks);

    return this.executeHandoff(huntId, 'spec', 'implementation', {
      implementationIssues: issues,
      architecture: context.architecture
    });
  }

  /**
   * Auto-handoff workflow for implementation complete (PR ready)
   */
  static async onImplementationComplete(huntId, context) {
    return this.executeHandoff(huntId, 'implementation', 'testing', {
      pullRequest: context.pr,
      testCoverage: context.coverage,
      acceptanceCriteria: context.criteria
    });
  }

  /**
   * Auto-handoff workflow for testing complete
   */
  static async onTestingComplete(huntId, context) {
    // Merge PR
    // Close all related issues
    // Record metrics
    return this.completeHunt(huntId, context);
  }
}
```

### 4. Role Manager (`lib/team/roles.js`)

**Responsibility:** Define and manage team roles

```javascript
const ROLES = {
  requirements: {
    id: 'requirements',
    name: 'Requirements Hunter',
    emoji: '🔍',
    description: 'Analyzes requirements and defines scope',
    gitHubLabel: 'role-requirements',
    aiAgent: 'requirements-analyzer',
    estimatedDuration: '2-4 hours',
    responsibilities: [
      'Analyze user needs and business requirements',
      'Define scope, constraints, and success criteria',
      'Identify edge cases and non-functional requirements',
      'Create initial problem statement'
    ],
    keywordTriggers: [
      'user story',
      'requirement',
      'scope',
      'acceptance criteria',
      'feature request'
    ]
  },

  spec: {
    id: 'spec',
    name: 'Specification Refiner',
    emoji: '📋',
    description: 'Creates specifications and prepares issues',
    gitHubLabel: 'role-spec',
    aiAgent: 'spec-master',
    estimatedDuration: '4-8 hours',
    responsibilities: [
      'Take requirements and create detailed specifications',
      'Break down complex features into testable chunks',
      'Prepare focused GitHub issues for implementation',
      'Identify risks and dependencies',
      'Create implementation roadmap'
    ],
    keywordTriggers: [
      'specification',
      'spec',
      'design',
      'architecture',
      'breakdown'
    ]
  },

  implementation: {
    id: 'implementation',
    name: 'Implementation Hunter',
    emoji: '🎯',
    description: 'Codes features based on specifications',
    gitHubLabel: 'role-implementation',
    aiAgent: 'implementation-expert',
    estimatedDuration: '1-3 days per task',
    responsibilities: [
      'Code features based on specifications',
      'Implement according to acceptance criteria',
      'Make implementation decisions within spec boundaries',
      'Create commits with clear traceability',
      'Open pull requests with complete context'
    ],
    keywordTriggers: [
      'implement',
      'code',
      'feature',
      'component',
      'API',
      'backend',
      'frontend'
    ]
  },

  testing: {
    id: 'testing',
    name: 'QA & Testing Specialist',
    emoji: '✅',
    description: 'Tests and validates implementation',
    gitHubLabel: 'role-testing',
    aiAgent: 'qa-expert',
    estimatedDuration: '2-4 hours per task',
    responsibilities: [
      'Test implementation against acceptance criteria',
      'Validate edge cases defined in requirements',
      'Verify no regressions',
      'Review code quality and test coverage',
      'Approve or request changes'
    ],
    keywordTriggers: [
      'test',
      'verify',
      'quality',
      'coverage',
      'regression',
      'QA',
      'testing'
    ]
  }
};

class RoleManager {
  /**
   * Get all available roles
   */
  static getAllRoles() {
    return Object.values(ROLES);
  }

  /**
   * Get role by ID
   */
  static getRole(roleId) {
    return ROLES[roleId];
  }

  /**
   * Validate role exists
   */
  static validateRole(roleId) {
    if (!ROLES[roleId]) {
      throw new Error(`Invalid role: ${roleId}`);
    }
    return true;
  }

  /**
   * Get role by keyword (for AI routing)
   */
  static findRoleByKeyword(keywords) {
    const lowerKeywords = keywords.toLowerCase();

    for (const role of Object.values(ROLES)) {
      for (const trigger of role.keywordTriggers) {
        if (lowerKeywords.includes(trigger)) {
          return role;
        }
      }
    }

    return null;
  }

  /**
   * Get previous role in hunt cycle
   */
  static getPreviousRole(roleId) {
    const sequence = ['requirements', 'spec', 'implementation', 'testing'];
    const index = sequence.indexOf(roleId);
    return index > 0 ? sequence[index - 1] : null;
  }

  /**
   * Get next role in hunt cycle
   */
  static getNextRole(roleId) {
    const sequence = ['requirements', 'spec', 'implementation', 'testing'];
    const index = sequence.indexOf(roleId);
    return index < sequence.length - 1 ? sequence[index + 1] : null;
  }
}
```

### 5. Analytics Engine (`lib/team/analytics.js`)

**Responsibility:** Track and report team metrics

```javascript
class AnalyticsEngine {
  /**
   * Record hunt cycle metrics
   */
  static async recordHuntMetrics(hunt) {
    const metrics = {
      huntId: hunt.id,
      feature: hunt.featureName,
      completedAt: hunt.completedAt,
      phases: {},
      totals: {
        totalDuration: 0,
        phaseCount: hunt.phaseHistory.length
      }
    };

    // Calculate metrics per phase
    for (const phase of hunt.phaseHistory) {
      const duration = calculateDuration(phase);
      metrics.phases[phase.phase] = {
        duration,
        assignee: phase.assignee,
        startTime: phase.startTime,
        endTime: phase.endTime
      };
      metrics.totals.totalDuration += duration;
    }

    // Save to analytics database
    await this.saveMetrics(metrics);

    return metrics;
  }

  /**
   * Calculate pack velocity (hunts per month)
   */
  static async getPackVelocity(packName, months = 3) {
    const tracker = await HuntCycleTracker.load(packName);
    const completedHunts = tracker.hunts.filter(h => h.status === 'completed');

    const huntsPerMonth = completedHunts.length / months;

    return {
      huntsCompleted: completedHunts.length,
      months,
      velocity: huntsPerMonth,
      trend: calculateTrend(completedHunts)
    };
  }

  /**
   * Calculate role utilization
   */
  static async getRoleUtilization(packName) {
    const pack = await TeamPack.load(packName);
    const tracker = await HuntCycleTracker.load(packName);
    const completedHunts = tracker.hunts.filter(h => h.status === 'completed');

    const roleStats = {};

    for (const role of Object.values(ROLES)) {
      let totalTime = 0;
      let taskCount = 0;

      for (const hunt of completedHunts) {
        const phaseData = hunt.phaseHistory.find(p => p.phase === role.id);
        if (phaseData) {
          totalTime += calculateDuration(phaseData);
          taskCount++;
        }
      }

      roleStats[role.id] = {
        role: role.name,
        tasksCompleted: taskCount,
        totalTime,
        averageTime: taskCount > 0 ? totalTime / taskCount : 0
      };
    }

    return roleStats;
  }

  /**
   * Calculate quality metrics
   */
  static async getQualityMetrics(packName) {
    const tracker = await HuntCycleTracker.load(packName);
    const completedHunts = tracker.hunts.filter(h => h.status === 'completed');

    const metrics = {
      huntsCompleted: completedHunts.length,
      avgTestCoverage: 0,
      bugsFound: 0,
      requirementsMissed: 0
    };

    for (const hunt of completedHunts) {
      // Fetch GitHub issue data
      const issue = await fetchGitHubIssue(hunt.id);

      // Parse test coverage from comments
      const coverageMatch = issue.body?.match(/coverage:\s*(\d+)%/);
      if (coverageMatch) {
        metrics.avgTestCoverage += parseInt(coverageMatch[1]);
      }

      // Count bugs reported
      metrics.bugsFound += issue.comments
        ?.filter(c => c.includes('[bug]')).length || 0;
    }

    metrics.avgTestCoverage =
      completedHunts.length > 0
        ? metrics.avgTestCoverage / completedHunts.length
        : 0;

    return metrics;
  }

  /**
   * Generate team report
   */
  static async generateTeamReport(packName, reportType = 'summary') {
    const velocity = await this.getPackVelocity(packName);
    const utilization = await this.getRoleUtilization(packName);
    const quality = await this.getQualityMetrics(packName);

    if (reportType === 'summary') {
      return { velocity, utilization, quality };
    }

    if (reportType === 'detailed') {
      return {
        velocity,
        utilization,
        quality,
        timestamp: new Date(),
        recommendations: this.generateRecommendations(
          velocity,
          utilization,
          quality
        )
      };
    }
  }

  /**
   * Generate recommendations based on metrics
   */
  static generateRecommendations(velocity, utilization, quality) {
    const recommendations = [];

    // Check for bottlenecks
    const roleEfficiencies = Object.values(utilization);
    const avgEfficiency =
      roleEfficiencies.reduce((a, b) => a + b.averageTime, 0) /
      roleEfficiencies.length;

    for (const role in utilization) {
      const roleData = utilization[role];
      if (roleData.averageTime > avgEfficiency * 1.5) {
        recommendations.push(
          `⚠️ ${roleData.role} is slower than average. Consider pair programming or additional training.`
        );
      }
    }

    // Check for quality issues
    if (quality.avgTestCoverage < 80) {
      recommendations.push(
        `📊 Test coverage is below target (${quality.avgTestCoverage}%). Focus on improving testing.`
      );
    }

    // Check velocity trend
    if (velocity.trend === 'declining') {
      recommendations.push(
        '📉 Velocity is declining. Check for team blockers or increased complexity.'
      );
    }

    return recommendations;
  }
}
```

---

## Data Models

### Hunt Cycle Model

```javascript
class HuntCycle {
  constructor(id, featureName, description, packName) {
    this.id = id;
    this.featureName = featureName;
    this.description = description;
    this.packName = packName;

    this.status = 'pending'; // pending, in-progress, completed
    this.currentPhase = null;
    this.currentRole = null;

    this.startedAt = new Date();
    this.completedAt = null;

    this.phaseHistory = [];
    this.issueLinks = [];
    this.pullRequestLinks = [];

    this.metrics = {
      totalDuration: 0,
      testCoverage: 0,
      qualityScore: 0
    };
  }

  /**
   * Convert to GitHub issue body
   */
  toGitHubIssue() {
    return `
# ${this.featureName}

## Description
${this.description}

## Pack Hunt Tracking
- **Pack:** ${this.packName}
- **Hunt ID:** ${this.id}
- **Status:** ${this.status}
- **Current Phase:** ${this.currentPhase}
- **Started:** ${this.startedAt.toISOString()}

## Phase Progress
| Phase | Assignee | Status | Duration |
|-------|----------|--------|----------|
| Requirements | - | - | - |
| Specification | - | - | - |
| Implementation | - | - | - |
| Testing | - | - | - |

## Acceptance Criteria
- [ ] Feature complete
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Deployed to production

---

*Managed by LionPack - Team-based workflow automation*
    `;
  }
}
```

### Team Pack Model

```javascript
class TeamPackConfig {
  constructor(packName, organization, repository) {
    this.version = '1.0';
    this.packName = packName;
    this.organization = organization;
    this.repository = repository;

    this.members = [];
    this.roles = {};
    this.config = {
      autoHandoff: true,
      notifyRole: true,
      trackAnalytics: true,
      huntCycleDays: 7,
      defaultLabels: ['pack-hunt', 'spec-driven']
    };

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Serialize to .lionpack.json
   */
  toJSON() {
    return {
      version: this.version,
      packName: this.packName,
      organization: this.organization,
      repository: this.repository,
      members: this.members,
      config: this.config,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Deserialize from .lionpack.json
   */
  static fromJSON(data) {
    const pack = new TeamPackConfig(
      data.packName,
      data.organization,
      data.repository
    );
    pack.members = data.members;
    pack.config = data.config;
    pack.createdAt = new Date(data.createdAt);
    pack.updatedAt = new Date(data.updatedAt);
    return pack;
  }
}
```

---

## Command Implementation

### `lionpack team init`

```javascript
// lib/commands/team.js

async function teamInit(options) {
  console.log(chalk.cyan('🦁 Initializing LionPack for your team...\n'));

  // Step 1: Get pack details
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'packName',
      message: 'What is your pack name?',
      default: 'Alpha Pack'
    },
    {
      type: 'input',
      name: 'organization',
      message: 'GitHub organization (or username for personal)',
      default: await getGitHubUser()
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Repository name',
      default: await getRepositoryName()
    }
  ]);

  // Step 2: Add team members
  console.log(
    chalk.cyan('\n📋 Add your team members (4 for full pack, 3 for small pack)\n')
  );

  const members = [];
  const roleSequence = ['requirements', 'spec', 'implementation', 'testing'];

  for (const role of roleSequence) {
    const roleInfo = ROLES[role];
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: `${roleInfo.emoji} ${roleInfo.name} (GitHub username or skip):`,
        default: ''
      }
    ]);

    if (answer.username) {
      // Verify GitHub user exists
      try {
        await verifyGitHubUser(answer.username);
        members.push({
          username: answer.username,
          role,
          joinedAt: new Date(),
          assignedIssues: 0
        });
      } catch (error) {
        console.log(
          chalk.red(`❌ GitHub user ${answer.username} not found. Skipping.`)
        );
      }
    }
  }

  if (members.length < 2) {
    console.log(chalk.yellow('⚠️  Pack needs at least 2 members!'));
    return;
  }

  // Step 3: Save configuration
  const packConfig = new TeamPackConfig(
    answers.packName,
    answers.organization,
    answers.repository
  );
  packConfig.members = members;

  await savePack PackConfig(packConfig);

  // Step 4: Setup GitHub
  console.log(chalk.cyan('\n🔗 Setting up GitHub integration...\n'));

  // Create GitHub labels
  await setupGitHubLabels(answers);

  // Create default project board if needed
  if (options.createProject) {
    await createGitHubProject(answers);
  }

  // Step 5: Success message
  console.log(chalk.green('\n✅ LionPack initialized successfully!\n'));
  console.log(chalk.cyan('Your pack:'));
  members.forEach(m => {
    const roleInfo = ROLES[m.role];
    console.log(chalk.cyan(`  ${roleInfo.emoji} ${m.username} - ${roleInfo.name}`));
  });

  console.log(chalk.cyan('\n📖 Next steps:'));
  console.log(chalk.cyan('  1. lionpack hunt start'));
  console.log(chalk.cyan('  2. Start building with your pack!'));
}
```

### `lionpack hunt start`

```javascript
// lib/commands/hunt.js

async function huntStart(options) {
  const pack = await TeamPack.load();
  const tracker = await HuntCycleTracker.load(pack.packName);

  // Get hunt details
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'featureName',
      message: 'Feature or task name:'
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Describe the feature (editor will open):'
    }
  ]);

  // Create hunt
  const hunt = await tracker.startHunt(answers.featureName, answers.description);

  // Get first role member
  const requirementsHunter = pack.getMemberByRole('requirements');

  console.log(chalk.green(`\n✅ Hunt #${hunt.id} started!\n`));
  console.log(
    chalk.cyan(
      `🔍 Assigned to ${requirementsHunter.username} for requirements analysis\n`
    )
  );

  // Create GitHub issue
  const issue = await createGitHubIssue({
    title: `🦁 ${answers.featureName}`,
    body: hunt.toGitHubIssue(),
    assignees: [requirementsHunter.username],
    labels: ['pack-hunt', 'phase-requirements'],
    projectNumber: pack.config.projectNumber
  });

  hunt.githubIssue = issue.number;
  await tracker.save();

  console.log(chalk.cyan(`📍 GitHub Issue: #${issue.number}`));
}
```

---

## AI Agent Adaptation

### Requirements Analyzer Agent

```javascript
// lib/agents/requirements-analyzer-template.js

const REQUIREMENTS_ANALYZER_INSTRUCTIONS = `
# Requirements Analyzer Agent

You are the **Requirements Analyzer** - the first lion in the pack's hunt.

## Your Role
You analyze feature requests and define project scope, constraints, and success criteria.

## When You're Activated
- New feature requests arrive
- Team discusses new requirements
- Scope needs clarification

## Your Responsibilities
1. **Analyze** user needs and business requirements
2. **Define** scope, constraints, and success criteria
3. **Identify** edge cases and non-functional requirements
4. **Create** detailed problem statement
5. **Validate** requirements completeness

## Output Format
Create a requirements document:

\`\`\`markdown
# Requirements: [Feature Name]

## Problem Statement
[Clear description of the problem being solved]

## User Stories
As a [user], I want to [action], so that [benefit]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Constraints & Non-Functional Requirements
- Performance: [e.g., < 200ms response time]
- Security: [e.g., GDPR compliance]
- Scalability: [e.g., support 10k concurrent users]
- Accessibility: [e.g., WCAG 2.1 AA]

## Edge Cases
- [Edge case 1]
- [Edge case 2]
- [Edge case 3]

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Dependencies
- [External service/dependency]
- [Database migration]
- [Third-party API]
\`\`\`

## Hunt Cycle Integration
After completing requirements:
1. Comment on GitHub issue: "✅ Requirements complete - Ready for spec refinement"
2. Assign to Spec Refiner (@github-username)
3. Add label: "phase-spec"

## Best Practices
- Ask clarifying questions
- Don't skip edge cases
- Consider compliance (GDPR, HIPAA, etc.)
- Think about failure modes
- Document assumptions
`;

module.exports = REQUIREMENTS_ANALYZER_INSTRUCTIONS;
```

### Spec Master Agent

```javascript
// lib/agents/spec-master-template.js

const SPEC_MASTER_INSTRUCTIONS = `
# Specification Master Agent

You are the **Specification Master** - the strategist who prepares the pack for the hunt.

## Your Role
You take requirements and create detailed specifications, breaking down features into actionable implementation tasks.

## When You're Activated
- Requirements are complete and passed to you
- Complex features need architectural planning
- Implementation readiness needs verification

## Your Responsibilities
1. **Review** requirements document
2. **Design** solution architecture
3. **Break down** into implementation tasks (3-5 typically)
4. **Create** specification document
5. **Identify** risks, dependencies, and gotchas
6. **Prepare** issues for implementation team

## Output Format
Create a spec document and implementation issues:

\`\`\`markdown
# Specification: [Feature Name]

## Architecture Overview
[Diagram or detailed description of solution]

## Technical Design
### Components
- [Component 1]
- [Component 2]

### Database Schema
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  ...
);
\`\`\`

### API Endpoints
- POST /api/endpoint-1
- GET /api/endpoint-2

## Implementation Tasks
1. **Backend Task 1**: [Description]
   - Acceptance criteria
   - Key files affected

2. **Frontend Task 1**: [Description]
   - Acceptance criteria
   - Key files affected

3. **Testing**: [Description]

## Risks & Mitigations
- Risk: [Description]
  Mitigation: [Approach]

## Dependencies
- Task 1 blocks Task 2
- Requires database migration

## Estimated Effort
- Total: 45 hours
- Backend: 20 hours
- Frontend: 15 hours
- Testing: 10 hours
\`\`\`

## GitHub Issues to Create

For each implementation task:
- Title: "[Task] Description"
- Labels: "ready-to-implement", "spec-approved", "pack-hunt"
- Acceptance criteria from spec
- Link to parent spec issue

## Hunt Cycle Integration
After completing specification:
1. Create all implementation issues
2. Comment: "✅ Specification approved - Implementation ready"
3. Assign implementation issues to Implementation Hunter
4. Add labels: "phase-implementation", "ready-to-implement"

## Best Practices
- Break down into 3-5 focused tasks
- Each task should be completable in 4-8 hours
- Identify blocking dependencies
- Consider testing strategy
- Plan for code review time
`;

module.exports = SPEC_MASTER_INSTRUCTIONS;
```

---

## Automation Workflows

### GitHub Actions: Auto-Handoff Trigger

```yaml
# .github/workflows/lionpack-handoff.yml

name: 🦁 LionPack Auto-Handoff

on:
  issues:
    types: [opened, edited]
  pull_request_review:
    types: [submitted]
  pull_request:
    types: [opened]

jobs:
  detect-phase-complete:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Detect Requirements Complete
        if: contains(github.event.issue.body, '✅ Requirements complete')
        run: |
          lionpack handoff --hunt-id ${{ github.event.issue.number }} \
            --from-role requirements --to-role spec

      - name: Detect Spec Complete
        if: contains(github.event.issue.body, '✅ Specification approved')
        run: |
          lionpack handoff --hunt-id ${{ github.event.issue.number }} \
            --from-role spec --to-role implementation

      - name: Detect Implementation Complete (PR)
        if: github.event_name == 'pull_request'
        run: |
          lionpack handoff --hunt-id ${{ github.event.pull_request.body }} \
            --from-role implementation --to-role testing
```

---

## Implementation Checklist

- [ ] Create `lib/team/pack.js` - TeamPack class
- [ ] Create `lib/team/tracker.js` - HuntCycleTracker class
- [ ] Create `lib/team/handoff.js` - HandoffEngine class
- [ ] Create `lib/team/roles.js` - RoleManager and ROLES
- [ ] Create `lib/team/analytics.js` - AnalyticsEngine class
- [ ] Create `lib/commands/team.js` - Team management commands
- [ ] Create `lib/commands/hunt.js` - Hunt management commands
- [ ] Create AI agent templates for 4 roles
- [ ] Create `.lionpack.json` config structure
- [ ] Create GitHub Actions workflows
- [ ] Add tests for all components
- [ ] Update CLI entry point (`bin/cli.js`)
- [ ] Update README with LionPack features
- [ ] Update package.json metadata
- [ ] Create migration guide from LEO

---

**Next: Begin Phase 1 implementation with team pack initialization!**
