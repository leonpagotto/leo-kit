# 📖 Commands Reference

> **Complete reference for all LEO Workflow Kit commands**

## 🎯 Command Overview

| Command         | Purpose                              | Interactive | Version |
| --------------- | ------------------------------------ | ----------- | ------- |
| `leo init`      | Initialize LEO in project            | ✅ Yes      | v1.0.0  |
| `leo agent`     | Manage specialized agents 🎉 NEW     | ✅ Yes      | v4.0.0  |
| `leo github`    | Configure repository settings 🎉 NEW | ✅ Yes      | v4.0.0  |
| `leo ai`        | Manage AI assistants                 | ✅ Yes      | v3.0.0  |
| `leo issue`     | Create issue interactively           | ✅ Yes      | v1.0.0  |
| `leo labels`    | Configure GitHub labels              | ✅ Yes      | v1.0.0  |
| `leo vscode`    | Setup VS Code integration            | ✅ Yes      | v1.0.0  |
| `leo config`    | Manage configuration                 | ✅ Yes      | v2.6.0  |
| `leo status`    | Show project workflow status         | ❌ No       | v1.0.0  |
| `leo health`    | System health check                  | ❌ No       | v2.0.0  |
| `leo welcome`   | Show welcome banner                  | ❌ No       | v1.0.0  |
| `leo docs`      | Open documentation                   | ❌ No       | v1.0.0  |
| `leo --version` | Show version                         | ❌ No       | v1.0.0  |
| `leo --help`    | Show help                            | ❌ No       | v1.0.0  |

---

## 📋 Detailed Command Reference

### `leo init`

Initialize LEO Workflow in your project.

**Usage:**

```bash
leo init [options]
```

**What It Does:**

1. Shows welcome banner
2. Checks prerequisites (Node.js, git, GitHub CLI)
3. Verifies GitHub authentication
4. Creates documentation structure
5. Installs issue and PR templates
6. Sets up VS Code Copilot instructions
7. Optionally configures GitHub labels

**Interactive Prompts:**

- Would you like to configure GitHub labels? (y/n)

**Options:**

```bash
leo init --skip-labels    # Skip label configuration
leo init --force          # Overwrite existing files
leo init --help           # Show help for init command
```

**Example:**

```bash
cd my-project
leo init
```

**Output Structure:**

```
your-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   ├── feature-request.md
│   │   ├── documentation.md
│   │   ├── deployment-task.md
│   │   └── ... (8 total)
│   ├── copilot-instructions.md
│   └── pull_request_template.md
└── docs/
    ├── README.md
    ├── specs/
    ├── guides/
    ├── development/
    └── archive/
```

---

### `leo ai` 🎉 NEW in v3.0.0

Manage AI assistant configurations and instruction files.

**Usage:**

```bash
leo ai [subcommand] [args...]
```

**Subcommands:**

#### `leo ai list` (alias: `leo ai ls`)

List configured AI assistants with file paths and status.

```bash
leo ai list
```

**Example Output:**

```
📦 Configured AI Assistants:

  ✓ GitHub Copilot
    .github/copilot-instructions.md
  ✓ Cursor
    .cursorrules
  ✓ Cline
    .clinerules
  ⚠ Codeium
    .codeium/instructions.md (not generated)

  Primary AI: copilot
```

#### `leo ai add <ai-name>`

Add a new AI assistant and generate its instruction file.

```bash
leo ai add cursor      # Add Cursor (Claude-powered IDE)
leo ai add cline       # Add Cline (autonomous coding)
leo ai add codeium     # Add Codeium (free alternative)
```

**Available AIs:**

- `copilot` - GitHub Copilot
- `cursor` - Cursor (Claude)
- `cline` - Cline (Claude-Dev)
- `codeium` - Codeium (free)

**What It Does:**

1. Validates AI name
2. Generates ~40KB instruction file
3. Updates `.leorc.json` configuration
4. Sets as primary if it's the first AI

**Example Output:**

```
✓ Added Cursor
  Generated: .cursorrules
```

#### `leo ai remove <ai-name>` (alias: `leo ai rm`)

Remove an AI assistant and delete its instruction file.

```bash
leo ai remove cursor
leo ai rm cursor
```

**What It Does:**

1. Deletes instruction file
2. Removes from configuration
3. Updates primary AI if needed

#### `leo ai sync`

Regenerate all AI instruction files for configured assistants.

```bash
leo ai sync
```

**When to Use:**

- After upgrading LEO Kit
- After modifying workflow standards
- To update all AI files at once

**Example Output:**

```
🔄 Syncing AI instruction files...

🚀 Generating AI instruction files...
  ✓ .github/copilot-instructions.md
  ✓ .cursorrules
  ✓ .clinerules
  ✓ .codeium/instructions.md

📊 Summary:
  ✓ Success: 4
```

#### `leo ai diff <ai1> <ai2>` (coming soon)

Compare two AI configurations (planned feature).

```bash
leo ai diff copilot cursor
```

**Examples:**

```bash
# List what's configured
leo ai list

# Add Cursor for complex refactoring
leo ai add cursor

# Add Codeium as free alternative
leo ai add codeium

# Update all instruction files
leo ai sync

# Remove an AI you no longer use
leo ai remove cline
```

**Configuration:**
AI settings are stored in `.leorc.json`:

```json
{
  "ai-assistants": {
    "enabled": ["copilot", "cursor"],
    "primary": "copilot",
    "sync-on-update": true
  }
}
```

**See Also:**

- [Multi-AI Support Guide](./Multi-AI-Support)
- [Migration Guide v2.x → v3.0.0](../docs/MIGRATION_V3.md)

---

### `leo agent` 🎉 NEW in v4.0.0

Manage specialized AI agents for multi-agent orchestration.

**Usage:**

```bash
leo agent <subcommand> [agent] [options]
```

**Subcommands:**

#### `leo agent list`

Show all agents and their current status.

**Usage:**

```bash
leo agent list
```

**Output:**

```
🎯 LEO Multi-Agent System

Project Type: fullstack

🎛️  Orchestrator Agent ✓ ENABLED
   Routes tasks to specialized agents
   Status: Always active (core routing layer)

🎨  Frontend Agent ✓ ENABLED
   UI/UX, components, styling, accessibility, responsive design

⚙️   Backend Agent ○ DISABLED
   APIs, databases, authentication, security, performance

Total: 2 agents enabled
```

#### `leo agent enable <agent>`

Enable a specialized agent.

**Usage:**

```bash
leo agent enable frontend
leo agent enable backend
leo agent enable devops
leo agent enable testing
leo agent enable documentation
```

**Example:**

```bash
leo agent enable frontend
# Output:
# ✔ frontend agent enabled
# ? Regenerate AI instruction files with new agent? (Y/n)
```

**Options:**

- `--no-sync` - Skip AI file regeneration prompt

#### `leo agent disable <agent>`

Disable a specialized agent.

**Usage:**

```bash
leo agent disable devops
```

**Note:** Cannot disable the Orchestrator agent (core routing layer).

#### `leo agent info <agent>`

Show detailed information about a specific agent.

**Usage:**

```bash
leo agent info frontend
leo agent info orchestrator
```

**Output:**

```
🎨  Frontend Agent

Description:
  UI/UX development specialist

Status:
  ✓ ENABLED

Responsibilities:
  • Component-first architecture (atomic design)
  • Accessibility (WCAG 2.1 AA compliance)
  • Responsive design (mobile-first)
  • Performance optimization
  • SEO best practices

Routing Triggers:
  • Keywords: component, UI, style, design, responsive, button, form
  • Files: *.jsx, *.tsx, *.vue, *.css, *.scss
```

#### `leo agent sync`

Regenerate AI instruction files with current agent configuration.

**Usage:**

```bash
leo agent sync
```

**When to Use:**

- After manually editing `.leorc.json`
- After enabling/disabling agents (if you skipped auto-sync)
- After updating LEO Workflow Kit version

**Available Agents:**

- 🎛️ **Orchestrator** - Core routing layer (always enabled)
- 🎨 **Frontend** - UI/UX, components, styling, accessibility
- ⚙️ **Backend** - APIs, databases, authentication, security
- 🚀 **DevOps** - CI/CD, Docker, Kubernetes, deployment
- 🧪 **Testing** - Unit/integration/E2E tests, TDD
- 📚 **Documentation** - README, API docs, guides, tutorials

**Configuration:**

Agents are configured in `.leorc.json`:

```json
{
  "project-type": "fullstack",
  "agents": {
    "frontend": { "enabled": true },
    "backend": { "enabled": true },
    "devops": { "enabled": false },
    "testing": { "enabled": true },
    "documentation": { "enabled": false }
  }
}
```

**See Also:**

- [Multi-Agent System Guide](../docs/guides/multi-agent-system.md)
- [Migration Guide v3.x → v4.0.0](../docs/guides/multi-agent-system.md#migration-from-v3x)

---

### `leo github` 🎉 NEW in v4.0.0

Configure GitHub repository settings with LEO recommended best practices.

**Usage:**

```bash
leo github <subcommand> [options]
```

**Subcommands:**

#### `leo github status`

Show current GitHub repository settings.

**Usage:**

```bash
leo github status
```

**Output:**

```
📊 GitHub Repository Settings

Repository: leonpagotto/leo-kit
URL: https://github.com/leonpagotto/leo-kit

⚙️  Repository Settings:

  Visibility:          PUBLIC
  Default branch:      main

Features:

  Issues:              ✓ Enabled
  Projects:            ✓ Enabled
  Wiki:                ✓ Enabled
  Discussions:         ○ Disabled

Merge Settings:

  Delete branch on merge: ○ Disabled
  Allow merge commits: ✓ Enabled
  Allow squash merge:  ✓ Enabled
  Allow rebase merge:  ✓ Enabled
```

#### `leo github setup`

Configure repository with recommended settings.

**Usage:**

```bash
leo github setup          # Interactive (asks for confirmation)
leo github setup --yes    # Non-interactive (applies without asking)
```

**Recommended Settings:**

- ✅ **Issues enabled** - For issue tracking
- ✅ **Projects enabled** - For project boards
- ✅ **Wiki enabled** - For documentation
- ✅ **Discussions enabled** - For community
- ✅ **Delete branch on merge** - Keep repository clean
- ✅ **All merge types** - Flexibility in workflows

**Interactive Flow:**

1. Shows current settings
2. Shows recommended settings
3. Calculates differences
4. Asks for confirmation
5. Applies changes safely

**Safety Features:**

- ✅ Shows all changes before applying
- ✅ Requires confirmation (unless `--yes` flag)
- ✅ Never deletes data without explicit permission
- ✅ Reports settings requiring manual configuration

**Example:**

```bash
leo github setup

# Output:
# ⚙️  GitHub Repository Settings Setup
#
# 📊 Current Settings:
#   Delete branch on merge: ○ Disabled
#
# ✨ Recommended Settings (LEO Workflow Kit):
#   Delete branch on merge: ✓ Enabled (keep repo clean)
#
# ⚠️  1 setting(s) need to be updated:
#
# ? Apply recommended settings? (Y/n)
```

**Options:**

- `-y, --yes` - Skip confirmation prompt

**Requirements:**

- GitHub CLI installed (`gh`)
- Repository admin permissions
- Authenticated with GitHub

**See Also:**

- [GitHub Settings Best Practices](./GitHub-Settings)

---

### `leo issue`

Create a GitHub issue interactively.

**Usage:**

```bash
leo issue
```

**Interactive Flow:**

1. **Select Issue Type**

   - Bug
   - Feature
   - Enhancement
   - Documentation
   - Refactoring
   - Testing
   - Deployment
   - Integration

2. **Enter Title**

   - Clear, concise summary

3. **Select Component** (if applicable)

   - Frontend, Backend, Database, DevOps, etc.

4. **Set Priority**

   - P0 (Critical)
   - P1 (High)
   - P2 (Medium)
   - P3 (Low)

5. **Enter Description**

   - Detailed explanation
   - Opens default editor (vim/nano/code)

6. **Review & Confirm**
   - Preview issue before creation
   - Edit or submit

**Example:**

```bash
leo issue
# Follow prompts...
# → Issue #42 created: "Add dark mode support"
```

**Tips:**

- Use clear, descriptive titles
- Include acceptance criteria in description
- Add relevant labels automatically
- Reference related issues with #number

---

### `leo labels`

Configure GitHub repository labels.

**Usage:**

```bash
leo labels [options]
```

**What It Does:**

1. Checks existing labels
2. Shows preview of labels to create
3. Creates 22+ standardized labels:
   - **Priorities:** P0, P1, P2, P3
   - **Types:** bug, feature, enhancement, documentation, etc.
   - **Status:** in-progress, ready-to-merge, blocked
   - **Components:** frontend, backend, api, database, etc.

**Options:**

```bash
leo labels --force        # Overwrite existing labels
leo labels --dry-run      # Preview without creating
leo labels --help         # Show help
```

**Label Categories:**

**Priority Labels (4):**

- 🔴 P0 - Critical (production down, security)
- 🟠 P1 - High (major features, significant bugs)
- 🟡 P2 - Medium (standard features, minor bugs)
- 🟢 P3 - Low (nice-to-have, polish)

**Type Labels (8):**

- 🐛 bug
- ✨ feature
- 🔧 enhancement
- 📚 documentation
- ♻️ refactoring
- 🚀 deployment
- 🔗 integration
- 🧪 testing

**Status Labels (4):**

- 🚧 in-progress
- 👀 needs-review
- ✅ ready-to-merge
- 🚫 blocked

**Component Labels (6+):**

- 💻 frontend
- ⚙️ backend
- 🗄️ database
- 🔧 devops
- 🎨 design
- 📡 api

**Example:**

```bash
leo labels
# Creates all 22+ labels with colors and descriptions
```

---

### `leo vscode`

Setup VS Code integration with Copilot instructions.

**Usage:**

```bash
leo vscode
```

**What It Does:**

1. Creates `.github/copilot-instructions.md`
2. Configures Copilot behavior for your project
3. Enables automatic issue creation
4. Sets up project management workflows

**Instructions Include:**

- Automatic issue creation rules
- GitHub Projects integration
- Status management workflows
- Spec-driven development guidelines
- Component-first best practices
- SEO optimization guidelines
- Performance best practices

**Example:**

```bash
leo vscode
# ✓ Created .github/copilot-instructions.md
# ✓ Copilot will now follow LEO workflow
```

**Verify:**

1. Open project in VS Code
2. Open Copilot Chat
3. Describe work: "We need to add user authentication"
4. Copilot should automatically create issue

---

### `leo status`

Show current project workflow status.

**Usage:**

```bash
leo status
```

**Displays:**

- Project name and description
- Current branch
- Last commit
- Open issues count
- GitHub Projects status
- LEO configuration status

**Example Output:**

```
🦁 LEO Workflow Status

Project: my-awesome-app
Branch: main
Last Commit: feat: add dark mode (3 hours ago)

GitHub Status:
  ✓ Authenticated as: username
  ✓ Repository: owner/my-awesome-app
  ✓ Open Issues: 5
  ✓ Projects: 2 active

LEO Configuration:
  ✓ Documentation structure
  ✓ Issue templates (8)
  ✓ Labels configured (22)
  ✓ VS Code integration
  ✓ Copilot instructions

All systems operational! 🚀
```

---

### `leo health`

Run system health check.

**Usage:**

```bash
leo health
```

**Checks:**

1. ✅ Node.js version (≥16.0.0)
2. ✅ npm installation
3. ✅ Git installation
4. ✅ GitHub CLI (`gh`) installation
5. ✅ GitHub authentication status
6. ✅ GitHub CLI scopes (repo, project, workflow)
7. ✅ LEO installation version
8. ✅ Project git repository

**Example Output:**

```
🔍 LEO Health Check

System Requirements:
  ✓ Node.js v20.10.0 (✓ ≥16.0.0)
  ✓ npm v10.2.3
  ✓ git v2.42.0
  ✓ GitHub CLI v2.40.0

GitHub:
  ✓ Authenticated as: username
  ✓ Scopes: repo, project, workflow
  ✓ API access: OK

LEO:
  ✓ Version: 2.3.0
  ✓ Installation: global

Project:
  ✓ Git repository
  ✓ Remote: github.com/owner/repo
  ✓ Branch: main

All checks passed! ✅
```

---

### `leo welcome`

Display LEO welcome banner.

**Usage:**

```bash
leo welcome
```

**Shows:**

- ASCII art logo
- Current version
- Quick start info
- Helpful commands

---

### `leo docs`

Open documentation.

**Usage:**

```bash
leo docs [topic]
```

**Topics:**

```bash
leo docs                  # Open main docs
leo docs guides           # Open guides folder
leo docs specs            # Open specs folder
leo docs readme           # Open README
```

---

### Global Options

Available for all commands:

```bash
--help, -h        # Show help for command
--version, -v     # Show LEO version
--verbose         # Verbose output
--quiet, -q       # Suppress output
--no-color        # Disable colors
```

**Examples:**

```bash
leo init --help
leo status --verbose
leo labels --quiet
```

---

## 🔄 Command Chaining

Some commands can be chained:

```bash
# Initialize and configure labels
leo init && leo labels

# Health check before status
leo health && leo status

# Full setup
leo init && leo labels && leo vscode
```

---

## 🎓 Common Workflows

### New Project Setup

```bash
cd new-project
leo init              # Initialize LEO
leo labels            # Configure labels
# Start coding - Copilot handles the rest!
```

### Add LEO to Existing Project

```bash
cd existing-project
leo init --skip-labels  # Keep existing labels
leo vscode             # Add Copilot instructions
```

### Create Issue Manually

```bash
leo issue
# Follow prompts to create structured issue
```

### Check Everything is OK

```bash
leo health    # System check
leo status    # Project status
```

---

## 💡 Tips & Tricks

### 1. Skip Interactive Prompts

```bash
# Use gh CLI directly for non-interactive
gh issue create --title "..." --body "..." --label "bug,p1"
```

### 2. Alias Commands

```bash
# Add to ~/.bashrc or ~/.zshrc
alias li="leo init"
alias ls="leo status"
alias lh="leo health"
```

### 3. CI/CD Usage

```bash
# Use npx for one-time setup in CI
npx leo-workflow-kit init --skip-labels --force
```

### 4. Quick Health Check

```bash
leo health | grep "✓"    # Show only passed checks
leo health | grep "✗"    # Show only failed checks
```

---

## 🐛 Troubleshooting Commands

### Command Not Found

```bash
# Check if installed
npm list -g leo-workflow-kit

# Reinstall
npm install -g leo-workflow-kit
```

### Permission Errors

```bash
# Check npm prefix
npm config get prefix

# Fix permissions (macOS/Linux)
sudo chown -R $USER $(npm config get prefix)
```

### GitHub Auth Issues

```bash
# Check status
gh auth status

# Refresh with scopes
gh auth refresh -s repo -s project -s workflow
```

---

## 📚 Additional Resources

- [Quick Start Tutorial](./Quick-Start)
- [Configuration Guide](./Configuration)
- [Troubleshooting](./Troubleshooting)
- [FAQ](./FAQ)

---

**Last Updated:** October 19, 2025
**Commands Version:** 2.3.0
