# Welcome to the LEO Workflow Kit Wiki! 🦁

> **Your comprehensive guide to mastering AI-powered workflow automation**

## 🌟 What is LEO Workflow Kit?

LEO Workflow Kit is a powerful CLI tool that revolutionizes software development project management through:

- **🤖 Multi-AI Support**: Works with Copilot, Cursor, Cline, and Codeium
- **🚀 Automatic Initialization**: Zero-config setup with `LEO_AUTO_INIT=true`
- **🎯 AI-Optimized Instructions**: Each AI gets customized workflow guidance (~40KB)
- **🧠 Intelligent Spec-First AI**: Automatically decides when to create specs vs direct issues
- **📊 Intelligent Project Management**: Auto-sync with GitHub Projects with smart status updates
- **🎯 Spec-Driven Development**: Enforce best practices and documentation-first approach
- **⚡ Zero Configuration**: Works out-of-the-box - literally just `npm install`

**Current Version:** 3.0.1 🎉
**Latest Stable:** 3.0.1
**Released:** October 19, 2025

**What's New in 3.0.1:** Enhanced Workflow Instructions

- 🚨 **CRITICAL Status Updates**: Mandatory immediate status updates when starting work
- 📝 **Enhanced Banner**: Multi-AI support highlighted in installation
- 📚 **Updated Documentation**: Comprehensive v3.0.0 wiki updates
- 🔧 **Better Workflow**: Explicit instructions for AI assistants on project status management

**v3.0.0 Features:** 🎉 MAJOR RELEASE

- 🤖 **Multi-AI Support**: 4 AI assistants (Copilot, Cursor, Cline, Codeium)
- ⚡ **New `leo ai` Command**: Manage AI assistants (list, add, remove, sync)
- 🎯 **AI Selection During Init**: Choose your AI tools during setup
- 📝 **AI-Specific Instructions**: Optimized for each tool's strengths
- 🔄 **Backward Compatible**: Existing Copilot setups continue working

---

## 📚 Quick Navigation

### Getting Started

- [Installation Guide](./Installation-Guide) - Get up and running in 5 minutes
- [Quick Start Tutorial](./Quick-Start) - Your first LEO project
- [Configuration](./Configuration) - Customize LEO for your workflow

### Core Features

- [Multi-AI Support](./Multi-AI-Support) - Use Copilot, Cursor, Cline, or Codeium 🎉 NEW v3.0.0
- [AI Assistant Management](./AI-Commands) - `leo ai` command reference 🎉 NEW v3.0.0
- [Automatic Initialization](./Automatic-Initialization) - Zero-config setup
- [Smart Project Types](./Smart-Project-Types) - Optimized instructions per project type
- [Workflow Configuration](./Configuration) - Control auto-resolution & behavior
- [Intelligent Spec-First Decision Making](./Spec-First-Decision-Making) - AI chooses spec vs direct issue
- [Automatic Issue Creation](./Automatic-Issue-Creation) - Let AI handle your issues
- [GitHub Projects Integration](./GitHub-Projects-Integration) - Automated project management
- [Status Management](./Status-Management) - Smart status updates based on work
- [Spec-Driven Development](./Spec-Driven-Development) - Write specs, then code

### Advanced Usage

- [Copilot Instructions](./Copilot-Instructions) - Understanding AI behavior
- [Custom Templates](./Custom-Templates) - Create your own templates
- [Multi-Project Setup](./Multi-Project-Setup) - Manage multiple projects
- [CI/CD Integration](./CICD-Integration) - Automate your pipeline

### Reference

- [Commands Reference](./Commands-Reference) - Complete command documentation
- [Architecture](./Architecture) - System design and components
- [Troubleshooting](./Troubleshooting) - Common issues and solutions
- [FAQ](./FAQ) - Frequently asked questions

### Contributing

- [Development Guide](./Development-Guide) - Contributing to LEO
- [Release Process](./Release-Process) - How releases are made
- [Roadmap](./Roadmap) - Future plans and features

---

## 🚀 Quick Examples

### Example 1: Automatic Setup (v2.5.0)

```bash
# One command - complete setup!
LEO_AUTO_INIT=true npm install leo-workflow-kit

# That's it! Your project now has:
# ✅ Documentation structure (docs/specs/)
# ✅ Issue templates (8 professional templates)
# ✅ GitHub Actions workflows
# ✅ VS Code Copilot instructions (optimized for your project type)
# ✅ Standard labels (22+ configured)

# Start working immediately!
```

### Example 2: Configure Auto-Resolution (v2.6.0) ⭐ NEW

```bash
# For teams - disable auto-resolution for review workflow
leo config set auto-resolve false

# Now when Copilot creates issues:
# ✅ Issue #42 created
# ⏸️ Waits for your review
# 👤 You approve when ready
# ✅ Copilot proceeds with implementation

# Check current config
leo config list

# Re-enable for solo fast-paced work
leo config set auto-resolve true
```

### Example 3: Simple Task (Direct Issue)

```bash
# Traditional manual setup
npm install -g leo-workflow-kit
cd your-project
leo init

# Describe a simple bug fix to Copilot:
# "Fix the login button not working on mobile"

# Copilot automatically:
# ✅ Analyzes: This is a simple bug fix
# ✅ Creates issue #42 directly
# ✅ Checks auto-resolve config
# ✅ Adds to GitHub Project (status: Todo)
# ✅ If enabled: Starts work immediately
# ✅ If disabled: Waits for your approval
```

### Example 4: Complex Feature (Spec First)

```bash
# Describe a complex feature to Copilot:
# "Add OAuth2 authentication system with Google and GitHub providers"

# Copilot automatically:
# ✅ Analyzes: This is complex, needs planning
# ✅ Creates docs/specs/oauth2-authentication.md
# ✅ Asks you to review the spec
# ✅ After approval, breaks into 5 focused issues:
#    - #43: Setup OAuth2 providers
#    - #44: Implement auth routes
#    - #45: Create sessions table
#    - #46: Add frontend login buttons
#    - #47: Write tests
# ✅ All added to project board
```

---

## 📊 Current Status

### Latest Release: v3.0.1 (October 19, 2025) ⭐ CURRENT

**Major Features:**

- ✅ **Multi-AI Support** - Copilot, Cursor, Cline, Codeium (v3.0.0)
- ✅ **New `leo ai` Command** - Manage AI assistants easily
- ✅ **Enhanced Status Management** - Critical status update enforcement (v3.0.1)
- ✅ **Intelligent Spec-First AI** - Auto-decides spec vs direct issue
- ✅ **GitHub Projects Integration** - Auto-sync with smart status updates
- ✅ **AI-Optimized Instructions** - ~40KB per AI assistant
- ✅ **Zero Configuration** - Auto-init with `LEO_AUTO_INIT=true`

**Stats:**

- 📦 Package Size: ~50 KB (optimized)
- 🤖 AI Assistants: 4 supported
- ⭐ GitHub Stars: Growing!
- 🐛 Open Issues: Actively maintained
- 🔄 Active Development: Yes

---

## 🗺️ Roadmap

### v2.4.0 (October 2025) - ✅ Released

- ✅ **Intelligent spec-first decision making**
- ✅ Automatic spec creation for complex features
- ✅ User review workflow
- ✅ Smart issue breakdown from specs

### v2.5.0 (Q4 2025) - Planned

- [ ] Auto-create projects during `leo init`
- [ ] Multiple project support
- [ ] Custom status field names
- [ ] Milestone integration
- [ ] Sprint planning automation

### v3.0.0 (Q1 2026) - Vision

- [ ] Web dashboard for project visualization
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Plugin system for extensibility
- [ ] Integration with more project management tools

See [Roadmap](./Roadmap) for detailed plans.

---

## 💡 Key Concepts

### Intelligent Decision Making ⭐ NEW

AI analyzes work complexity to choose the right approach:

- **Simple work** (bugs, quick fixes) → Direct issue creation
- **Complex work** (architecture, multi-component) → Create spec → Review → Break into issues

### Spec-Driven Development

Write specifications before code. Specs live in `docs/specs/`, issues track execution. Complex features automatically get specs created for review.

### Automatic Issue Creation

Copilot detects when you describe work and creates issues automatically using `gh issue create`. Smart enough to know when a spec is needed first.

### Status Management

Issues transition through states (Todo → In Progress → Done) based on commits, branches, and PR actions.

### Project Integration

Issues are automatically added to GitHub Projects and kept in sync throughout their lifecycle.

---

## 🤝 Community

- **Issues:** [Report bugs or request features](https://github.com/leonpagotto/leo-kit/issues)
- **Discussions:** Share ideas and ask questions
- **Contributing:** [Read our contribution guidelines](./Development-Guide)
- **License:** MIT (free and open source)

---

## 📖 Documentation

- **README:** [Main documentation](https://github.com/leonpagotto/leo-kit)
- **Guides:** [In-depth tutorials](https://github.com/leonpagotto/leo-kit/tree/main/docs/guides)
- **API Reference:** [Command-line reference](./Commands-Reference)
- **Examples:** Real-world usage patterns

---

## 🔗 External Resources

- [GitHub CLI Documentation](https://cli.github.com/)
- [GitHub Projects v2](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Copilot](https://github.com/features/copilot)
- [Mermaid Diagrams](https://mermaid.js.org/)

---

**Last Updated:** October 19, 2025
**Wiki Version:** 1.0
**Maintainer:** [@leonpagotto](https://github.com/leonpagotto)

---

<div align="center">

**[⬆ Back to Top](#welcome-to-the-leo-workflow-kit-wiki-)**

Made with ❤️ by the LEO Workflow Kit team

</div>
