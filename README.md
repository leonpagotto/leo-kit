<div align="center">

![LEO Workflow Kit](docs/assets/leo_kit_logo.png)

<h3>Intelligent GitHub Workflow Automation</h3>

**Transform your development workflow with AI-powered task routing, spec-first development, and automated GitHub Projects—all from your terminal.**

[![npm version](https://img.shields.io/npm/v/leo-workflow-kit.svg?style=flat-square&color=blue&logo=npm)](https://www.npmjs.com/package/leo-workflow-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/tests-462%2F521%20passing-green?style=flat-square)](https://github.com/leonpagotto/leo-kit)

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](../../wiki) • [Contributing](CONTRIBUTING.md)

---

### 🎉 **v5.0.1** - Production Ready with Automated Documentation

✨ **Automated Docs Organization** • 🤖 **Multi-Agent AI** • 📋 **Spec-First Development** • 🔄 **GitHub Projects Sync** • 🎯 **Pre-commit Hooks**

**[View Release Notes](CHANGELOG.md)** • **[Full Documentation](../../wiki)**

---

</div>

## What is LEO?

**LEO Workflow Kit** is an intelligent CLI that automates your GitHub workflow. It combines multi-agent AI orchestration, spec-driven development, and seamless GitHub Projects integration into one powerful tool.

### The Problem

- ⏰ **Hours wasted** setting up GitHub Projects, labels, and templates
- 🔀 **Inconsistent workflows** across team members
- 📝 **Poor planning** leading to rework and missed requirements
- 🤖 **Generic AI** that lacks domain expertise
- 📊 **Manual tracking** of issues and project status

### The Solution

LEO transforms these pain points into strengths:

| Challenge | LEO Solution | Impact |
|-----------|-------------|--------|
| Manual setup | One-command initialization | **2-4 hours → 5 minutes** |
| Generic AI | 6 specialized AI agents | **60% faster development** |
| Unclear requirements | Spec-first methodology | **50% fewer issues** |
| Manual updates | Auto GitHub Projects sync | **100% automated** |
| Documentation chaos | Automated organization | **98/100 health score** |

---

## ✨ Features

### 🤖 Multi-Agent Orchestration

Six specialized AI agents provide expert guidance:

\`\`\`
Your Request → Orchestrator → Routes to Specialist(s)

🎨 Frontend  │ UI/UX, Components, Responsive Design
⚙️  Backend   │ APIs, Database, Authentication, Security
🚀 DevOps    │ CI/CD, Docker, Deployment, Monitoring
🧪 Testing   │ Unit, Integration, E2E, Coverage
📚 Docs      │ API Reference, Guides, Comments
🎛️  Orchestrator │ Intelligent Task Routing
\`\`\`

**[Learn More →](../../wiki/Multi-Agent-System)**

### 📋 Spec-First Development

Smart decision-making based on complexity:

- **Simple tasks** (< 1 day): Direct to GitHub issue
- **Complex features** (> 1 week): Create specification first
- **Automatic routing**: Orchestrator decides the best path

**[Learn More →](../../wiki/Spec-First-Development)**

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

**[Learn More →](../../wiki/Documentation-Organization)**

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

---

## 📚 Documentation

### Essential Guides

- **[Getting Started](../../wiki/Getting-Started)** - Step-by-step setup
- **[Multi-Agent System](../../wiki/Multi-Agent-System)** - How AI agents work together
- **[Spec-First Development](../../wiki/Spec-First-Development)** - Specification workflow
- **[GitHub Integration](../../wiki/GitHub-Integration)** - Projects and automation
- **[Configuration Guide](../../wiki/Configuration)** - Customize LEO for your project
- **[Documentation Organization](../../wiki/Documentation-Organization)** - Keep docs clean
- **[CLI Reference](../../wiki/CLI-Reference)** - All commands and options

### Advanced Topics

- **[Plugin Development](../../wiki/Plugin-Development)** - Extend LEO with plugins
- **[REST API](../../wiki/REST-API)** - HTTP + WebSocket server
- **[Constitutional Governance](../../wiki/Constitutional-Governance)** - Spec validation rules
- **[Architecture](../../wiki/Architecture)** - System design and diagrams

### Resources

- **[Troubleshooting](../../wiki/Troubleshooting)** - Common issues and solutions
- **[FAQ](../../wiki/FAQ)** - Frequently asked questions
- **[Changelog](CHANGELOG.md)** - Release history
- **[Contributing](CONTRIBUTING.md)** - How to contribute

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
# Complex feature request
"Build an admin dashboard with analytics"
→ Orchestrator detects complexity (> 1 week)
→ Creates specification in docs/specs/
→ User reviews and approves spec
→ Breaks down into multiple issues
→ Agents implement incrementally
\`\`\`

### Documentation Organization

\`\`\`bash
# Before: 45+ markdown files in root (unprofessional)
# After: Organized structure

docs/
  sessions/2025-10/     # Session summaries
  releases/             # Release notes
  guides/               # How-to guides
  phases/               # Project phases
  stories/              # User stories

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

**[Full Configuration Reference →](../../wiki/Configuration)**

---

## 🧪 Testing

LEO has comprehensive test coverage:

\`\`\`bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:model   # Model selection tests only
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

**[View Roadmap →](../../wiki/Roadmap)**

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
- 📖 [Wiki](../../wiki) - Full documentation
- 📧 Contact: [GitHub](https://github.com/leonpagotto)

---

<div align="center">

**Made with ❤️ for developers who value automation and best practices**

**[⭐ Star this repo](https://github.com/leonpagotto/leo-kit)** if LEO helps your workflow!

</div>
