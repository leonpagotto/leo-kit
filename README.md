<div align="center">

![LEO Workflow Kit](docs/assets/leo_kit_logo.png)

<h3>Intelligent GitHub Workflow Automation</h3>

**Transform your development workflow with AI-powered task routing, spec-first development, and automated GitHub Projects—all from your terminal.**

[![npm version](https://img.shields.io/npm/v/leo-workflow-kit.svg?style=flat-square&color=blue&logo=npm)](https://www.npmjs.com/package/leo-workflow-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-487%2F521%20passing-green?style=flat-square)](https://github.com/leonpagotto/leo-kit)

[Quick Start](#-quick-start) • [Features](#-features) • [Visual Guide](docs/WORKFLOW_DIAGRAMS.md) • [Contributing](CONTRIBUTING.md) • [API Reference](docs/guides/API_REFERENCE.md)

---

### 🎉 **v5.3.5** - Custom Model Support & Clean Codebase

🎯 **Custom Model Support** • 🚀 **Enterprise Model Access** • ⚡ **Clean LEO Branding** • 💰 **Flexible Model Selection**

**[View Release Notes](CHANGELOG.md#535)** • **[Quick Start Guide](docs/guides/QUICK_START.md)**

---

</div>

## What is LEO?

**LEO Workflow Kit** is an intelligent CLI that automates your GitHub workflow. It combines multi-agent AI orchestration, spec-driven development, and seamless GitHub Projects integration into one powerful tool.

### 🆚 LEO vs GitHub Spec Kit

Many developers ask: _"How is LEO different from GitHub Spec Kit?"_ Here's the breakdown:

| Feature             | GitHub Spec Kit             | LEO Workflow Kit                      | Winner                  |
| ------------------- | --------------------------- | ------------------------------------- | ----------------------- |
| **Philosophy**      | Specs as Code               | Specs as Issues                       | _Different approaches_  |
| **Storage**         | Files (`specs/001/spec.md`) | GitHub Issues (#42, #80)              | **LEO** (simpler)       |
| **Create Spec**     | Create file → Commit → Push | `leo spec new "Feature"`              | **LEO** (5x faster)     |
| **View Spec**       | Clone repo → Read file      | Click issue link                      | **LEO** (instant)       |
| **Edit Spec**       | Edit file → Commit → Push   | Edit issue on GitHub                  | **LEO** (no git needed) |
| **Team Collab**     | Pull requests → Merge       | Real-time comments                    | **LEO** (no conflicts)  |
| **Non-Dev Access**  | Requires Git knowledge      | Just GitHub account                   | **LEO** (accessible)    |
| **Diff Tracking**   | `git diff spec.md`          | `leo spec-diff <issue>`               | **LEO** (semantic)      |
| **Project Board**   | Manual linking              | Native integration                    | **LEO** (automatic)     |
| **Offline Work**    | ✅ Yes (files local)        | ❌ No (requires internet)             | **Spec Kit**            |
| **Backup**          | ✅ Git history              | ⚠️ GitHub only                        | **Spec Kit**            |
| **Task Management** | Files (`tasks.md`)          | Dual-mode (checklist OR child issues) | **LEO** (flexible)      |

**Use Spec Kit if:** You want specs as code, prefer file-based workflows, need offline access.

**Use LEO if:** You're GitHub-centric, have non-technical stakeholders, want faster iteration, prefer real-time collaboration.

**Bottom Line:** We solve the same problem (structured specs) with **opposite philosophies**. Spec Kit = "Specs should be files". LEO = "Specs should be issues". Both valid, different use cases. **LEO is better for GitHub-native teams**, Spec Kit is better for Git-purist teams.

---

### The Problem

- ⏰ **Hours wasted** setting up GitHub Projects, labels, and templates
- 🔀 **Inconsistent workflows** across team members
- 📝 **Poor planning** leading to rework and missed requirements
- 🤖 **Generic AI** that lacks domain expertise
- 📊 **Manual tracking** of issues and project status

### The Solution

LEO transforms these pain points into strengths:

| Challenge            | LEO Solution               | Impact                     |
| -------------------- | -------------------------- | -------------------------- |
| Manual setup         | One-command initialization | **2-4 hours → 5 minutes**  |
| Generic AI           | 6 specialized AI agents    | **60% faster development** |
| Unclear requirements | Spec-first methodology     | **50% fewer issues**       |
| Manual updates       | Auto GitHub Projects sync  | **100% automated**         |
| Documentation chaos  | Automated organization     | **98/100 health score**    |

---

## ✨ Features

### 🤖 Multi-Agent Orchestration

Six specialized AI agents provide expert guidance:

```
Your Request → Orchestrator → Routes to Specialist(s)

🎨 Frontend │ UI/UX, Components, Responsive Design
⚙️ Backend │ APIs, Database, Authentication, Security
🚀 DevOps │ CI/CD, Docker, Deployment, Monitoring
🧪 Testing │ Unit, Integration, E2E, Coverage
📚 Docs │ API Reference, Guides, Comments
🎛️ Orchestrator │ Intelligent Task Routing
```

**[See Visual Diagrams →](docs/WORKFLOW_DIAGRAMS.md#diagram-1-how-the-orchestrator-routes-tasks)**

### 📋 Spec-First Development

GitHub-native specification workflow with evolution tracking:

**Create & Manage Specs:**

```bash
# Create specification (GitHub issue, not files!)
leo spec new "Build authentication system"

# Clarify requirements
leo clarify 42

# Generate implementation plan
leo plan 42
```

**Dual-Mode Task Management:**

```bash
# Checklist mode (simple, single issue)
leo tasks create 42

# Child issues mode (parallel work, team collaboration)
leo tasks create 42 --create-issues

# Track progress
leo tasks status 42  # Shows: 5/10 completed (50%)
```

**Spec Evolution & Extensions:**

```bash
# Track how spec evolved
leo spec-diff 42 --timeline

# See aggregate changes
leo spec-diff 42 --summary

# Extend spec with new requirements
leo spec-extend 42 "Add OAuth2 support"

# Extend and create child issues
leo spec-extend 42 "Add SSO" --create-issues
```

**Why GitHub Issues over Files?**

- ✅ 5x faster (no git commits, instant edits)
- ✅ Real-time collaboration (comments, not PRs)
- ✅ No merge conflicts (GitHub handles it)
- ✅ Non-technical team members can contribute
- ✅ Native project board integration

**[Complete Spec Workflow Guide →](docs/WORKFLOW_DIAGRAMS.md#diagram-4-complete-spec-workflow-complex-features)**

### 📁 Automated Documentation Organization

New in v5.0.1! Automatically organizes markdown files:

\`\`\`bash

# Organize documentation

leo organize-docs

# Validate organization

leo organize-docs --validate

# Enable pre-commit hook

leo hooks install
\`\`\`

**Features:**

- Automatic file organization by type (sessions, releases, guides)
- Pre-commit hook prevents documentation clutter
- Health check integration (+5 points)
- Configurable allowed root files

**Configurable in `.leorc.json`** - See [Configuration](#-configuration) section below

### 🔄 GitHub Projects Integration

- ✅ One-command setup with project boards, columns, and labels
- ✅ Automatic issue creation with proper metadata
- ✅ Status updates as you work (Todo → In Progress → Done)
- ✅ Smart commit message formatting

### ⚡ Best Practices Enforcement

- Component-first architecture
- Performance optimization
- SEO excellence
- Security validation
- Test coverage requirements

---

## � How LEO Works

LEO transforms your GitHub workflow with intelligent automation. Here's the simple version:

### 1. **You Describe Work**

```bash
# Three easy ways:
leo issue                           # Interactive prompts
"Hey Copilot, add dark mode"       # Just talk (Copilot auto-creates issue)
leo spec new "Build payment system" # For complex features
```

### 2. **Orchestrator Routes to Specialist**

- Detects keywords (button → Frontend, API → Backend)
- Routes to the right expert agent
- Coordinates multiple agents if needed

### 3. **GitHub Issue Created Automatically**

- Title, description, labels
- Added to project board (📋 Todo)
- Priority and estimates set

### 4. **Work Starts** (configurable)

- `auto-resolve: true` → Starts immediately (default)
- `auto-resolve: false` → Waits for your approval
- Agent guides implementation

### 5. **Automatic Tracking**

- Status updates: Todo → In Progress → Done
- Project board syncs automatically
- Issue closes when PR merges

**[📊 See Visual Workflow Diagrams](docs/WORKFLOW_DIAGRAMS.md)** - Simple diagrams anyone can understand!

---

## 📋 Spec-First Development (For Complex Features)

When you're building something big (> 1 week), LEO helps you plan first:

```bash
# 1. Create specification (GitHub issue, not files!)
leo spec new "Build authentication system"
→ Creates structured spec template

# 2. Clarify requirements (AI asks questions)
leo clarify 42
→ "What auth methods? OAuth? Email? Both?"

# 3. Generate implementation plan
leo plan 42
→ Creates step-by-step checklist

# 4. Create tasks (2 modes)
leo tasks create 42                    # Checklist (simple)
leo tasks create 42 --create-issues    # Child issues (teams)

# 5. Track progress
leo tasks status 42
→ Shows: "5/10 completed (50%)"

# 6. Extend spec later (optional)
leo spec-extend 42 "Add OAuth2 support"
→ Merges new requirements without losing old ones
```

**Why specs are GitHub issues instead of files:**

- ✅ 5x faster (no git commits, instant edits)
- ✅ Real-time collaboration (comments instead of PRs)
- ✅ No merge conflicts (GitHub handles it)
- ✅ Non-technical team members can contribute
- ✅ Native project board integration

**[📖 Complete Spec Workflow Diagram](docs/WORKFLOW_DIAGRAMS.md#diagram-4-complete-spec-workflow-complex-features)**

---

## 🏗️ System Architecture

**Simple View:**

```
You → Orchestrator → Specialist Agent → GitHub Issue → Work → Done
```

**Detailed View:**

LEO has 3 layers:

1. **CLI Commands** - What you type (`leo init`, `leo issue`, `leo spec new`)
2. **Orchestrator** - Smart router that picks the right agent
3. **Specialist Agents** - Experts (Frontend, Backend, DevOps, Testing, Docs)

Everything connects to GitHub:

- Issues created automatically
- Project boards updated
- Status tracked in real-time

**[📊 See Architecture Diagrams](docs/WORKFLOW_DIAGRAMS.md#diagram-5-the-complete-leo-journey)**

**Configuration** (`.leorc.json`):

```json
{
  "auto-resolve": true, // Start work immediately (or wait for approval)
  "agents": {
    "orchestrator": { "enabled": true },
    "frontend": { "enabled": true },
    "backend": { "enabled": true }
    // ... enable/disable agents as needed
  },
  "github": {
    "owner": "your-username",
    "repo": "your-repo",
    "project": { "number": 4 }
  }
}
```

---

## 🚀 Quick Start

### Installation

\`\`\`bash
npm install -g leo-workflow-kit
\`\`\`

### Initialize Your Project

\`\`\`bash

# Navigate to your repo

cd your-project

# Initialize LEO

leo init

# Follow interactive setup

\`\`\`

This creates:

- \`.leorc.json\` - Configuration file
- \`.github/copilot-instructions.md\` - AI behavior rules
- GitHub Project with columns and labels
- Issue templates and workflow files

### Basic Usage

\`\`\`bash

# Create an issue

leo issue

# Organize documentation

leo organize-docs

# Check project health

leo health

# Enable/disable agents

leo agent list
leo agent enable frontend
leo agent disable testing

# Configure settings

leo config

# View all commands

leo --help
\`\`\`

### Spec-First Commands

**Create Specifications:**
\`\`\`bash
leo spec new "Build user dashboard"

# Creates GitHub issue with structured spec template

# Includes: Requirements, User Stories, Acceptance Criteria

\`\`\`

**Clarify Requirements:**
\`\`\`bash
leo clarify 42

# AI asks clarifying questions

# Updates spec with answers

\`\`\`

**Generate Implementation Plan:**
\`\`\`bash
leo plan 42

# Creates step-by-step task checklist

# Adds to spec issue body

\`\`\`

**Task Management (Dual-Mode):**
\`\`\`bash

# Checklist mode (default) - tasks stay in spec

leo tasks create 42

# Child issues mode - tasks become separate issues

leo tasks create 42 --create-issues

# Check progress

leo tasks status 42

# Shows: 5/10 completed (50%)

\`\`\`

**Track Spec Evolution:**
\`\`\`bash

# Standard diff view

leo spec-diff 42

# Chronological timeline

leo spec-diff 42 --timeline

# Aggregate statistics

leo spec-diff 42 --summary

# Version range comparison

leo spec-diff 42 --from 2 --to 5

# Section-specific diff

leo spec-diff 42 --section requirements
\`\`\`

**Extend Specifications:**
\`\`\`bash

# Basic extension (merge new requirements)

leo spec-extend 42 "Add Slack notifications"

# With child issues for the new work

leo spec-extend 42 "Add OAuth2" --create-issues

# Preview without updating

leo spec-extend 42 "Add mobile app" --no-update
\`\`\`

---

## 📚 Documentation

### Essential Guides

- **[Visual Workflow Guide](docs/WORKFLOW_DIAGRAMS.md)** - Simple diagrams showing how LEO works
- **[GitHub Integration Guide](docs/guides/GITHUB_INTEGRATION_GUIDE.md)** - GitHub Projects and automation
- **[Configuration Guide](#-configuration)** - Customize LEO for your project (see below)
- **[CLI Reference](bin/cli.js)** - All commands and options (`leo --help`)

### Advanced Topics

- **[REST API Documentation](docs/guides/API_REFERENCE.md)** - HTTP + WebSocket server
- **[Model Selection Guide](docs/guides/MODEL_SELECTION_GUIDE.md)** - AI model configuration
- **[Architecture Diagrams](docs/WORKFLOW_DIAGRAMS.md)** - System design and flow

### Resources

- **[Changelog](CHANGELOG.md)** - Release history
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Security](SECURITY.md)** - Security policy

---

## 💡 Examples

### Multi-Agent Task Routing

\`\`\`bash

# Frontend task (UI component)

"Add a dark mode toggle to the header"
→ Routed to Frontend Agent → Creates component with accessibility

# Backend task (API endpoint)

"Add OAuth2 authentication with Google"
→ Routed to Backend Agent → Creates secure endpoints

# Multi-agent task

"Add user login with social auth and responsive UI"
→ Backend Agent: OAuth2 setup
→ Frontend Agent: Login form UI
→ Testing Agent: Auth flow tests
\`\`\`

### Spec-First Workflow

\`\`\`bash

# 1. Create specification issue (GitHub-native, no files!)

leo spec new "Build user authentication system"
→ Creates GitHub issue with structured template

# 2. Clarify requirements (AI asks questions)

leo clarify 42
→ Updates spec with clarifications

# 3. Generate implementation plan

leo plan 42
→ Creates task checklist in spec

# 4. Create child issues for parallel work (optional)

leo tasks create 42 --create-issues
→ Converts tasks into separate GitHub issues

# 5. Track evolution as spec changes

leo spec-diff 42 --timeline
→ Shows all versions with timestamps

# 6. Extend with new requirements

leo spec-extend 42 "Add OAuth2 support"
→ Merges new requirements (preserves existing)

# Complete workflow: spec → clarify → plan → tasks → track → extend

# All operations on GitHub issues (no files, no commits)

\`\`\`

### Documentation Organization

\`\`\`bash

# Before: 45+ markdown files in root (unprofessional)

# After: Organized structure

docs/
sessions/2025-10/ # Session summaries
releases/ # Release notes
guides/ # How-to guides
phases/ # Project phases
stories/ # User stories

# Root: Only essential files (README, CHANGELOG, etc.)

\`\`\`

---

## 🔧 Configuration

Configure LEO via \`.leorc.json\`:

\`\`\`json
{
"github": {
"project": "My Project",
"owner": "username"
},
"agents": {
"enabled": ["orchestrator", "frontend", "backend"],
"auto-resolve": true
},
"documentation": {
"enforce-organization": true,
"allowed-root-files": ["README.md", "CHANGELOG.md", "LICENSE"],
"root-files-max": 5
},
"specs": {
"directory": "docs/specs",
"template": "default"
}
}
\`\`\`

**[See Full Configuration Options Below](#-configuration)**

---

## 🧪 Testing

LEO has comprehensive test coverage:

\`\`\`bash
npm test # Run all tests
npm run test:watch # Watch mode
npm run test:model # Model selection tests only
\`\`\`

**Current Status:**

- ✅ 462 tests passing
- ⚠️ 59 tests in progress
- 📊 Improving test coverage to 80%+

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of Conduct
- Development setup
- Pull request process
- Coding standards
- Testing requirements

**Quick Contribution:**

\`\`\`bash

# Fork and clone

git clone https://github.com/YOUR_USERNAME/leo-kit.git

# Install dependencies

npm install

# Create feature branch

git checkout -b feature/amazing-feature

# Make changes and test

npm test

# Commit with conventional commits

git commit -m "feat: add amazing feature"

# Push and create PR

git push origin feature/amazing-feature
\`\`\`

---

## 📊 Project Status

### Current Release: v5.0.1

**Key Features:**

- ✅ Automated documentation organization
- ✅ Pre-commit hooks for docs
- ✅ Health check integration
- ✅ Multi-agent orchestration (6 agents)
- ✅ Spec-first development
- ✅ GitHub Projects automation
- ✅ Configuration management

**In Progress:**

- 🔨 Test coverage improvements (59 remaining)
- 🔨 Enhanced error handling
- 🔨 Performance optimizations

**Upcoming (v5.1.0):**

- 🎯 Advanced model selection strategies
- 🎯 Cost tracking and budgets
- 🎯 Team collaboration features
- 🎯 Slack integration

**Roadmap**: Check our [open issues](https://github.com/leonpagotto/leo-kit/issues) for upcoming features

---

## 📝 License

MIT © [Leo Pagotto](https://github.com/leonpagotto)

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [GitHub CLI](https://cli.github.com/) - GitHub integration
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Jest](https://jestjs.io/) - Testing framework

Special thanks to all [contributors](https://github.com/leonpagotto/leo-kit/graphs/contributors)!

---

## 📞 Support

- 💬 [GitHub Discussions](https://github.com/leonpagotto/leo-kit/discussions) - Community Q&A
- 🐛 [Issue Tracker](https://github.com/leonpagotto/leo-kit/issues) - Bug reports and feature requests
- 📖 [Documentation](docs/) - Full documentation in docs/ folder
- 📧 Contact: [GitHub](https://github.com/leonpagotto)

---

<div align="center">

**Made with ❤️ for developers who value automation and best practices**

**[⭐ Star this repo](https://github.com/leonpagotto/leo-kit)** if LEO helps your workflow!

</div>
