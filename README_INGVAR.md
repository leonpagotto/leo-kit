<div align="center">

<img src="docs/assets/ingvar_kit_logo.png" alt="Ingvar Kit Logo" width="600" />

<h3 style="color: #0051BA; font-weight: 600;">
  <span style="color: #0051BA;">🪑 GitHub Workflow Automation with Multi-Agent AI Orchestration 🇸🇪</span>
</h3>

<p><strong>Transform your development workflow with Ingka Way of Working—intelligent task routing, spec-first development, and automated GitHub Projects integration—all from your terminal.</strong></p>

<p style="font-style: italic; color: #666;">Named after <strong>Ingvar Kamprad</strong>, founder of IKEA, embodying simplicity, efficiency, and quality in software development.</p>

[![npm version](https://img.shields.io/npm/v/ingvar-workflow-kit.svg?style=flat-square&color=0051BA&logo=npm)](https://www.npmjs.com/package/ingvar-workflow-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFDB00.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![GitHub Stars](https://img.shields.io/github/stars/ingka-group/ingvar-kit?style=flat-square&color=FFDB00&logo=github)](https://github.com/ingka-group/ingvar-kit/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/ingka-group/ingvar-kit?style=flat-square&color=0051BA&logo=github)](https://github.com/ingka-group/ingvar-kit/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[🚀 Quick Start](#-quick-start) • [📖 What is Ingvar?](#-what-is-ingvar-workflow-kit) • [✨ Features](#-core-features) • [🤖 Multi-Agent System](#-multi-agent-orchestration-system) • [📦 Installation](#-installation) • [🎯 Commands](#-command-reference)

---

### 🎉 Latest Release: **v1.0.0** - Ingka Way of Working

**Following Ingvar Kamprad's principles of simplicity, quality, and efficiency**

🪑 Swedish design philosophy • 🧠 Multi-agent AI orchestration • 🚀 Zero manual input • ⚡ Ingka standards

---

</div>

## 📖 What is Ingvar Workflow Kit?

**Ingvar Workflow Kit** is an intelligent CLI tool that revolutionizes software development workflow management following **Ingka Way of Working**. Born from real-world development challenges at Ingka Digital (IKEA's digital hub), Ingvar combines **multi-agent AI orchestration**, **spec-driven development**, **automated GitHub Projects integration**, and **intelligent workflow automation** into a single, powerful command-line interface.

### 🪑 The Ingvar Philosophy

Named after **Ingvar Kamprad**, the founder of IKEA, this toolkit embodies his core principles:

- **Simplicity**: Complex workflows made simple through intelligent automation
- **Quality**: Best practices enforced by specialized AI agents
- **Efficiency**: One command replaces hours of manual setup
- **Accessibility**: Designed for developers at all levels
- **Continuous Improvement**: Evolving with Ingka's way of working

### 🎯 The Problem We Solve

Modern development teams at Ingka and beyond face common challenges:

- ⏰ **Time-consuming setup**: Hours spent configuring GitHub Projects, labels, and templates
- 🔀 **Inconsistent workflows**: Each developer follows different processes
- 📝 **Poor documentation**: Features built without proper planning
- 🤖 **Generic AI assistance**: One-size-fits-all AI that lacks domain expertise
- 🔄 **Manual tracking**: Constantly updating issue statuses and project boards

### 💡 The Ingvar Solution

Ingvar transforms these pain points into strengths:

| Challenge                | Ingvar Solution                            | Time Saved                        |
| ------------------------ | ------------------------------------------ | --------------------------------- |
| Manual GitHub setup      | One-command initialization                 | **2-4 hours → 5 minutes**         |
| Inconsistent AI guidance | Multi-agent orchestration with specialists | **60% faster development**        |
| Unclear requirements     | Spec-first decision making                 | **50% fewer missed requirements** |
| Manual status updates    | Automatic GitHub Projects sync             | **100% automated**                |
| Generic best practices   | Domain-specific expertise per agent        | **Higher code quality**           |

### 🌟 Why Teams Choose Ingvar

- **🤖 Multi-Agent Intelligence**: 6 specialized AI agents (Orchestrator, Frontend, Backend, DevOps, Testing, Documentation) provide expert guidance for every task
- **🎯 Smart Task Routing**: Orchestrator analyzes your request and routes to the right specialist(s)
- **📋 Spec-First Methodology**: Complex features get structured planning; simple tasks move fast
- **⚡ Lightning Setup**: Complete workflow configuration in 5 minutes vs 2-4 hours manually
- **🔄 Zero-Touch Automation**: Issues automatically sync with GitHub Projects, statuses update as you work
- **🎨 Best Practices Enforced**: Component-first architecture, performance optimization, SEO excellence—built into every agent
- **🔧 Flexibility**: Enable only the agents you need for your project type
- **🌍 Universal Compatibility**: Works with personal repos, organizations, and any project type
- **🇸🇪 Ingka Standards**: Aligned with Ingka Digital's development standards and best practices

---

## 🏗️ System Architecture

### Multi-Agent Orchestration

Ingvar introduces an intelligent orchestration system that routes tasks to specialized AI agents based on domain expertise:

```
                                    Your Development Request
                                              │
                                              ▼
                        ┌──────────────────────────────────────────┐
                        │      🎛️  Orchestrator Agent             │
                        │   Analyzes Keywords, Files & Intent      │
                        └──────────┬───────────────────────────────┘
                                   │
        ┌──────────────┬───────────┼───────────┬──────────────┬──────────────┐
        │              │           │           │              │              │
        ▼              ▼           ▼           ▼              ▼              ▼
   ┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐   ┌──────────┐  ┌──────────┐
   │ 🎨 Front│   │ ⚙️ Back │ │ 🚀 Dev  │ │ 🧪 Test │   │ 📚 Docs  │  │ 🔧 Config│
   │  -end   │   │  -end   │ │  Ops    │ │  -ing   │   │          │  │          │
   │ Expert  │   │ Expert  │ │ Expert  │ │ Expert  │   │ Expert   │  │ Manager  │
   └─────────┘   └─────────┘ └─────────┘ └─────────┘   └──────────┘  └──────────┘
   UI/UX         APIs        CI/CD       Quality        Guides        Settings
   Components    Database    Deploy      Coverage       API Docs      Projects
```

**[📊 View Full Architecture Diagram](diagrams/architecture.mmd)**

---

## ✨ Core Features

### 🤖 Multi-Agent AI Orchestration

Ingvar v1.0 features an intelligent orchestration system with specialized agents:

#### **Orchestrator Agent** (Router & Coordinator)

- Analyzes every request to determine task type
- Routes to appropriate specialist agent(s)
- Coordinates multi-agent tasks
- Enforces Ingka workflow standards

#### **Frontend Agent** (UI/UX Specialist)

- Component-first architecture (Atomic Design)
- Accessibility compliance (WCAG 2.1 AA)
- Mobile-first responsive design
- Performance optimization (Core Web Vitals)
- SEO best practices

**Triggers**: `component`, `UI`, `style`, `design`, `responsive`, `accessibility`

#### **Backend Agent** (API & Database Specialist)

- RESTful API design
- Database optimization
- Authentication & security
- Input validation
- Error handling

**Triggers**: `API`, `endpoint`, `database`, `auth`, `query`, `security`

#### **DevOps Agent** (Infrastructure Specialist)

- CI/CD pipeline setup
- Docker containerization
- Cloud deployment (AWS, Azure, Railway)
- Monitoring & logging
- Environment configuration

**Triggers**: `deploy`, `CI/CD`, `Docker`, `pipeline`, `infrastructure`

#### **Testing Agent** (Quality Assurance Specialist)

- Unit testing strategies
- Integration tests
- E2E test automation
- Code coverage analysis
- Test-driven development

**Triggers**: `test`, `spec`, `coverage`, `mock`, `fixture`

#### **Documentation Agent** (Technical Writer)

- README maintenance
- API documentation
- User guides
- Code comments (JSDoc)
- Changelog management

**Triggers**: `documentation`, `README`, `guide`, `comment`, `docs`

### 🎯 AI Assistant Support

Ingvar works seamlessly with **4 major AI assistants**:

- ✅ **GitHub Copilot** (`.github/copilot-instructions.md`)
- ✅ **Cursor AI** (`.cursorrules`)
- ✅ **Cline** (`.clinerules`)
- ✅ **Codeium** (`.codeium/instructions.md`)

**Smart Sync**: When you enable/disable agents, all AI instruction files update automatically.

### 📋 Spec-First Decision Making

Ingvar enforces a smart decision tree for complex work:

```
┌─────────────────────────────────────┐
│   New Feature Request Arrives       │
└──────────────┬──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Effort > 1wk?│
        └──────┬───────┘
               │
        ┌──────┴───────┐
        │              │
       YES            NO
        │              │
        ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ Create   │   │ Create   │
  │ SPEC     │   │ Issue    │
  │ First    │   │ Directly │
  └──────────┘   └──────────┘
        │              │
        ▼              ▼
  ┌──────────┐   ┌──────────┐
  │ Get      │   │ Start    │
  │ Approval │   │ Work     │
  └──────────┘   └──────────┘
        │
        ▼
  ┌──────────┐
  │ Break    │
  │ into     │
  │ Issues   │
  └──────────┘
```

**Benefits**:

- 🚀 Simple tasks move fast (< 1 day → immediate implementation)
- 🏗️ Complex features get structured planning (> 1 week → spec review)
- 📊 Better estimates and clearer expectations
- 🎯 Reduced scope creep and missed requirements

### ⚡ Automated GitHub Projects Integration

Ingvar automatically syncs with GitHub Projects:

1. **Issue Creation**: Automatically creates GitHub issues with proper labels
2. **Status Tracking**: Updates project board as work progresses
3. **Auto-Close**: Issues close when PRs merge with "Closes #123"
4. **Label Management**: Sets up comprehensive label system (P0-P3, types, status)

**Supported Project Layouts**:

- ✅ Basic Kanban (Todo, In Progress, Done)
- ✅ Agile Sprint (Backlog, Todo, In Progress, Review, Done)
- ✅ Custom columns (auto-detected)

### 🎨 Professional Issue Templates

8 production-ready templates following Ingka standards:

1. **Bug Report**: Detailed reproduction steps, environment info
2. **Feature Request**: User stories, acceptance criteria, mockups
3. **Documentation**: Gaps identified, target audience, scope
4. **Security Vulnerability**: CVSS scoring, impact assessment
5. **Performance Issue**: Metrics, profiling data, thresholds
6. **Accessibility**: WCAG level, affected users, severity
7. **Refactoring**: Technical debt assessment, migration plan
8. **Deployment**: Rollout strategy, rollback plan, monitoring

### 🏷️ Intelligent Label System

Auto-configured labels with semantic meaning:

**Priority** (P0-P3):

- `P0` 🔴 Critical (production down, data loss)
- `P1` 🟠 High (major feature broken)
- `P2` 🟡 Medium (minor bug, enhancement)
- `P3` 🟢 Low (nice-to-have, polish)

**Type** (Feature, Bug, Docs, etc.):

- `feature` ✨ New functionality
- `bug` 🐛 Something broken
- `docs` 📚 Documentation
- `refactor` 🔧 Code improvement
- `security` 🔒 Vulnerability
- `performance` ⚡ Speed/efficiency

**Status** (Workflow stages):

- `needs-review` 👀 Awaiting review
- `in-progress` 🚧 Active work
- `blocked` 🚫 Dependencies

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g ingvar-workflow-kit
```

### Verify Installation

```bash
ingvar --version
```

### First-Time Setup

```bash
# Navigate to your project
cd your-project

# Initialize Ingvar workflow (one-time setup)
ingvar init
```

**What `ingvar init` does**:

1. ✅ Sets up `docs/specs/` directory
2. ✅ Installs 8 professional issue templates
3. ✅ Configures comprehensive label system
4. ✅ Creates `.ingvarrc.json` configuration
5. ✅ Installs AI assistant instructions (Copilot, Cursor, Cline, Codeium)
6. ✅ Links to GitHub Projects (optional)

**Time**: ~5 minutes (vs 2-4 hours manual setup)

---

## 🚀 Quick Start

### 1. Install Ingvar Kit

```bash
npm install -g ingvar-workflow-kit
```

### 2. Initialize Your Project

```bash
cd your-project
ingvar init
```

### 3. Configure GitHub (One-Time)

```bash
# Authenticate with GitHub CLI (if not already)
gh auth login

# Configure your repository in .ingvarrc.json
ingvar config github.owner your-org
ingvar config github.repo your-repo
```

### 4. Create Your First Issue

```bash
ingvar issue
```

**Interactive prompt**:

1. Choose template (bug, feature, docs, etc.)
2. Fill in details
3. Assign priority (P0-P3)
4. Auto-creates GitHub issue
5. Auto-links to GitHub Project
6. Status tracked automatically

### 5. Start Working

GitHub Copilot / Cursor / Cline / Codeium will now:

- ✅ Automatically create issues for work descriptions
- ✅ Route tasks to specialized agents
- ✅ Enforce Ingka best practices
- ✅ Update project board status
- ✅ Generate spec-compliant commit messages

**Example**:

```
You: "Add dark mode toggle to settings page"

Copilot (via Ingvar):
✓ Issue created: #42 - "Add dark mode toggle"
✓ Routing to Frontend Agent...
✓ Creating component with accessibility support
✓ Status updated: Todo → In Progress
```

---

## 🎯 Command Reference

### Core Commands

#### `ingvar init`

Initialize Ingvar workflow in current project.

```bash
ingvar init [options]

Options:
  -o, --org <organization>   GitHub organization name
  -p, --project <number>     GitHub project number
  --skip-project             Skip GitHub Project setup
  --skip-labels              Skip label setup
  --skip-vscode              Skip VS Code configuration
  --non-interactive          Run with defaults (CI/CD mode)
```

**Example**:

```bash
# Interactive setup (recommended)
ingvar init

# Non-interactive with org
ingvar init --org ingka-group --project 4

# Skip GitHub Project integration
ingvar init --skip-project
```

---

#### `ingvar issue`

Create spec-driven issue from templates.

```bash
ingvar issue [options]
# Alias: ingvar i

Options:
  -t, --template <type>      Template type (bug, feature, docs, etc.)
  -T, --title <title>        Issue title
  -p, --priority <priority>  Priority (P0, P1, P2, P3)
  -a, --assignee <username>  Assign to user
  --no-interactive           Skip prompts
```

**Example**:

```bash
# Interactive (choose from templates)
ingvar issue

# Quick bug report
ingvar i -t bug -T "Login button not working" -p P1

# Feature with assignment
ingvar i -t feature -T "Add OAuth2 support" -a yourusername
```

---

#### `ingvar labels`

Set up GitHub labels for workflow.

```bash
ingvar labels [options]
# Alias: ingvar l

Options:
  --clean    Remove default GitHub labels first
```

**Example**:

```bash
# Add Ingvar labels
ingvar labels

# Clean slate (remove GitHub defaults, add Ingvar labels)
ingvar labels --clean
```

---

#### `ingvar vscode`

Install VS Code Copilot instructions.

```bash
ingvar vscode [options]
# Alias: ingvar vs

Options:
  --global    Install to user settings
  --project   Install to project only
```

**Example**:

```bash
# Project-level (recommended)
ingvar vscode

# Global (all projects)
ingvar vscode --global
```

---

#### `ingvar config`

Manage workflow configuration.

```bash
ingvar config <key> [value]
# Alias: ingvar cfg

Examples:
  ingvar config github.owner ingka-group
  ingvar config github.repo ingvar-kit
  ingvar config auto-resolve true
  ingvar config list
```

**Configuration Options**:

| Key                   | Description                    | Default   |
| --------------------- | ------------------------------ | --------- |
| `github.owner`        | GitHub owner/org               | `null`    |
| `github.repo`         | Repository name                | `null`    |
| `github.project.url`  | GitHub Project URL             | `null`    |
| `github.project.id`   | GitHub Project ID              | `null`    |
| `auto-resolve`        | Auto-start work after issue    | `true`    |
| `project-type`        | Project type (fullstack, etc.) | `general` |
| `enabled-agents`      | Active agents                  | `[]`      |
| `ai-assistants`       | Active AI tools                | `[]`      |

---

#### `ingvar agent`

Manage specialized agents.

```bash
ingvar agent <subcommand> [agent]

Subcommands:
  list              List all available agents
  enable <agent>    Enable an agent
  disable <agent>   Disable an agent
  info <agent>      Show agent details
  sync              Sync AI instruction files

Options:
  --no-sync         Skip AI file sync when enabling/disabling
```

**Example**:

```bash
# List available agents
ingvar agent list

# Enable Frontend agent
ingvar agent enable frontend

# Disable Testing agent
ingvar agent disable testing

# View Frontend agent details
ingvar agent info frontend

# Manually sync AI instructions
ingvar agent sync
```

**Available Agents**:

- `orchestrator` (always enabled)
- `frontend`
- `backend`
- `devops`
- `testing`
- `documentation`

---

#### `ingvar ai`

Manage AI assistant configurations.

```bash
ingvar ai <subcommand> [args...]

Subcommands:
  list              List supported AI assistants
  add <assistant>   Add AI assistant
  remove <name>     Remove AI assistant
  sync              Sync instruction files
```

**Example**:

```bash
# List supported AI assistants
ingvar ai list

# Add Copilot support
ingvar ai add copilot

# Remove Cursor support
ingvar ai remove cursor

# Sync all AI instruction files
ingvar ai sync
```

**Supported AI Assistants**:

- `copilot` (GitHub Copilot)
- `cursor` (Cursor AI)
- `cline` (Cline AI)
- `codeium` (Codeium AI)

---

#### `ingvar github`

Configure GitHub repository settings.

```bash
ingvar github <subcommand>

Subcommands:
  setup     Interactive GitHub setup
  status    Show GitHub configuration

Options:
  -y, --yes    Skip confirmation prompts
```

**Example**:

```bash
# Interactive GitHub setup
ingvar github setup

# Check GitHub configuration
ingvar github status
```

---

#### `ingvar status`

Quick workflow setup status check.

```bash
ingvar status
# Alias: ingvar s
```

**Checks**:

- ✅ GitHub CLI installed
- ✅ Git repository initialized
- ✅ Issue templates configured
- ✅ Labels set up
- ✅ VS Code configured

---

#### `ingvar health`

Comprehensive workflow health check with scoring.

```bash
ingvar health
# Alias: ingvar h
```

**Health Score Categories**:

- GitHub CLI setup
- Repository configuration
- Issue templates
- Label system
- VS Code integration
- Agent configuration
- AI assistant setup

**Scoring**:

- 🟢 **90-100**: Excellent
- 🟡 **70-89**: Good
- 🟠 **50-69**: Needs improvement
- 🔴 **< 50**: Critical issues

---

#### `ingvar docs`

Open documentation in browser.

```bash
ingvar docs
```

---

#### `ingvar welcome`

Show welcome message and quick start guide.

```bash
ingvar welcome
# Alias: ingvar w
```

---

## 🛠️ Configuration

### `.ingvarrc.json`

Created by `ingvar init`, this file stores your project configuration:

```json
{
  "version": "1.0.0",
  "github": {
    "owner": "ingka-group",
    "repo": "your-repo",
    "project": {
      "url": "https://github.com/orgs/ingka-group/projects/1",
      "id": "PVT_kwDOABCDEF",
      "number": 1
    }
  },
  "auto-resolve": true,
  "project-type": "fullstack",
  "enabled-agents": ["orchestrator", "frontend", "backend"],
  "ai-assistants": ["copilot", "cursor"]
}
```

**Note**: `.ingvarrc.json` is git-ignored (contains sensitive project data).

---

## 🤖 Working with AI Assistants

### GitHub Copilot Integration

When you have Copilot installed, Ingvar automatically enhances it with:

1. **Automatic Issue Creation**: Copilot detects work descriptions and creates issues
2. **Task Routing**: Routes to specialized agents based on keywords
3. **Workflow Enforcement**: Ensures spec-first methodology
4. **Status Updates**: Auto-comments on issues as work progresses

**Example Conversation**:

```
You: "I need to add a search bar to the header"

Copilot (powered by Ingvar):
✓ Task classified: Frontend (UI component)
✓ Issue created: #55 - "Add search bar to header"
✓ Routing to Frontend Agent...

[Frontend Agent implements search bar with:
  - Accessible ARIA labels
  - Mobile-responsive design
  - Debounced input
  - Keyboard navigation]

✓ Status updated: Todo → In Progress → Done
```

### Multi-Agent Coordination

For complex tasks requiring multiple agents:

```
You: "Add OAuth2 authentication with Google and GitHub"

Orchestrator:
✓ Task classified: Multi-agent (Backend + Frontend)
✓ Issue created: #60 - "Add OAuth2 authentication"

Step 1: Backend Agent
  ✓ Created /api/auth/google endpoint
  ✓ Created /api/auth/github endpoint
  ✓ Configured OAuth2 providers

Step 2: Frontend Agent
  ✓ Created LoginButton component
  ✓ Added OAuth2 redirect flow
  ✓ Managed auth state

✓ Integration complete
✓ Issue #60 → Done
```

---

## 📚 Best Practices

### 1. Spec-First for Complex Features

**Rule**: If effort > 1 week, create a spec first.

```bash
# Create spec in docs/specs/
ingvar init  # Creates docs/specs/ directory

# Write spec: docs/specs/oauth2-implementation.md
# Get team review
# Then break into issues
```

### 2. Use Descriptive Issue Titles

**✅ Good**:

- "Add OAuth2 authentication with Google and GitHub"
- "Fix button alignment on mobile devices"
- "Optimize database query for user search"

**❌ Bad**:

- "Fix bug"
- "Update code"
- "Changes"

### 3. Assign Proper Priorities

- **P0** 🔴: Production down, data loss, security breach
- **P1** 🟠: Major feature broken, blocking work
- **P2** 🟡: Minor bug, enhancement, tech debt
- **P3** 🟢: Nice-to-have, polish, future improvement

### 4. Enable Relevant Agents

Don't enable all agents if you don't need them:

```bash
# Frontend-only project
ingvar agent enable frontend

# Fullstack project
ingvar agent enable frontend
ingvar agent enable backend
ingvar agent enable testing
```

### 5. Keep Commit Messages Short

**Rule**: Subject line < 72 characters, reference issue number.

```bash
# ✅ Good
git commit -m "feat(auth): add OAuth2 support (#60)"

# ❌ Bad (too long, breaks pipelines)
git commit -m "This commit adds OAuth2 authentication with Google and GitHub providers including session management and redirect flow handling"
```

### 6. Let AI Create Issues Automatically

Don't manually create issues—let Copilot/Cursor do it:

```
# Instead of:
1. Go to GitHub
2. Click "New Issue"
3. Fill out form

# Just tell your AI assistant:
"Add dark mode toggle to settings"

# Ingvar will:
✓ Create issue automatically
✓ Add proper labels
✓ Link to project board
✓ Start tracking status
```

---

## 🧩 Examples

### Example 1: Frontend Feature

```
You: "Add a responsive navigation bar with mobile menu"

Ingvar Orchestrator:
✓ Task classified: Frontend (UI component)
✓ Issue created: #42 - "Add responsive navigation bar"
✓ Routing to Frontend Agent...

Frontend Agent:
✓ Creating Navbar component (organism level)
✓ Implementing mobile-first design
✓ Adding accessibility (ARIA labels, keyboard nav)
✓ Optimizing performance (lazy loading, code splitting)

✓ Issue #42 → In Progress → Done
✓ PR created with "Closes #42"
```

---

### Example 2: Backend API

```
You: "Create a REST API for user management with CRUD operations"

Ingvar Orchestrator:
✓ Task classified: Backend (API development)
✓ Issue created: #50 - "Create user management API"
✓ Routing to Backend Agent...

Backend Agent:
✓ Created /api/users endpoints (GET, POST, PUT, DELETE)
✓ Added input validation with Joi
✓ Implemented authentication middleware
✓ Added rate limiting
✓ Created unit tests

✓ Issue #50 → In Progress → Done
```

---

### Example 3: Multi-Agent Task

```
You: "Build an admin dashboard with user analytics"

Ingvar Orchestrator:
✓ Task classified: Multi-agent (Frontend + Backend + Testing)
✓ Issue created: #75 - "Build admin dashboard"

Step 1: Backend Agent
  ✓ Created /api/analytics endpoints
  ✓ Aggregated user metrics
  ✓ Added caching layer

Step 2: Frontend Agent
  ✓ Created Dashboard component
  ✓ Integrated Chart.js for visualizations
  ✓ Responsive grid layout

Step 3: Testing Agent
  ✓ Added E2E tests for dashboard
  ✓ Unit tests for analytics API
  ✓ 85% code coverage

✓ Issue #75 → Done
```

---

## 🎓 Advanced Usage

### Custom Agent Configuration

Edit `.ingvarrc.json` to customize agent behavior:

```json
{
  "agents": {
    "frontend": {
      "enabled": true,
      "frameworks": ["react", "next.js"],
      "ui-library": "tailwind",
      "project-type": "web-app"
    },
    "backend": {
      "enabled": true,
      "language": "typescript",
      "database": "postgresql",
      "orm": "prisma"
    }
  }
}
```

### Custom Issue Templates

Add custom templates to `.github/ISSUE_TEMPLATE/`:

```bash
# Use existing templates as reference
ls .github/ISSUE_TEMPLATE/

# Create custom template
cp .github/ISSUE_TEMPLATE/feature_request.md .github/ISSUE_TEMPLATE/custom_template.md

# Edit to fit your needs
```

### CI/CD Integration

Use `ingvar init --non-interactive` in CI/CD pipelines:

```yaml
# .github/workflows/setup.yml
name: Setup Ingvar Workflow

on:
  repository_dispatch:
    types: [setup-workflow]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install -g ingvar-workflow-kit
      - run: ingvar init --non-interactive --skip-project
      - run: ingvar labels
```

---

## 🔧 Troubleshooting

### Issue: `ingvar: command not found`

**Solution**:

```bash
# Check npm global bin path
npm config get prefix

# Add to PATH (macOS/Linux)
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Windows
# Add npm global bin to System PATH environment variable
```

---

### Issue: GitHub CLI not authenticated

**Solution**:

```bash
# Authenticate with GitHub
gh auth login

# Verify
gh auth status
```

---

### Issue: AI assistant not detecting Ingvar instructions

**Solution**:

```bash
# Reinstall AI instructions
ingvar vscode

# Verify files exist
ls .github/copilot-instructions.md
ls .cursorrules
ls .clinerules
ls .codeium/instructions.md

# Restart VS Code / Cursor
```

---

### Issue: Issues not syncing to GitHub Project

**Solution**:

```bash
# Check GitHub configuration
ingvar config list

# Reconfigure GitHub
ingvar config github.owner your-org
ingvar config github.repo your-repo
ingvar github setup

# Test issue creation
ingvar issue -t bug -T "Test issue" -p P3
```

---

## 🤝 Contributing

We welcome contributions from the Ingka community and beyond!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test` (when available)
5. **Commit**: `git commit -m "feat: add amazing feature"`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines

- Follow Ingka coding standards
- Write descriptive commit messages (conventional commits)
- Add tests for new features
- Update documentation
- Ensure backward compatibility

**[Read Full Contributing Guide](CONTRIBUTING.md)**

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **Ingvar Kamprad**: For inspiring simplicity, quality, and efficiency
- **Ingka Digital**: For fostering innovation and best practices
- **IKEA**: For the way of working that inspired this toolkit
- **Open Source Community**: For the tools and libraries that make this possible

---

## 📞 Support

- **Documentation**: [https://github.com/ingka-group/ingvar-kit#readme](https://github.com/ingka-group/ingvar-kit#readme)
- **Issues**: [https://github.com/ingka-group/ingvar-kit/issues](https://github.com/ingka-group/ingvar-kit/issues)
- **Discussions**: [https://github.com/ingka-group/ingvar-kit/discussions](https://github.com/ingka-group/ingvar-kit/discussions)
- **Ingka Digital**: [https://www.ingka.com](https://www.ingka.com)

---

<div align="center">

**Made with 🪑 by Ingka Digital**

_Following the Ingvar Way: Simple, Quality, Efficient_

[![IKEA](https://img.shields.io/badge/IKEA-FFDB00?style=for-the-badge&logo=ikea&logoColor=0051BA)](https://www.ikea.com)
[![Ingka](https://img.shields.io/badge/Ingka-0051BA?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)](https://www.ingka.com)

</div>
