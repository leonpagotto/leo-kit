````markdown
# Changelog

All notable changes to LEO Workflow Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.1] - 2025-10-24

### 🎯 NEW FEATURE: Real-Time Model Selection in VS Code

#### New Features

##### Real-Time Model Selection Display
- ✅ **Status Bar Display**: Shows current AI model in VS Code status bar with agent emoji
- ✅ **Automatic Model Switching**: Models update automatically as agents execute
- ✅ **File Watching**: Real-time updates via `~/.leo-model-status.json`
- ✅ **Polling Fallback**: 100ms polling ensures maximum 100ms update latency
- ✅ **Event Emission**: Full event system for model selection lifecycle
- ✅ **Status Indicators**: Visual feedback (↻ active, ✓ complete, ⊘ idle)

##### New Components
- `ModelSelectorStatusManager` - Event emission and status file management
- `ModelSelectionOrchestrator` - Orchestration with automatic tracking
- VS Code Extension (`model-selector.js`) - Status bar display with real-time updates

##### Documentation
- `REALTIME_MODEL_SELECTION_IN_VSCODE.md` - Complete architecture guide
- `REALTIME_MODEL_SELECTION_QUICK_START.md` - Setup and installation guide
- `REALTIME_MODEL_SELECTION_IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `REALTIME_MODEL_SELECTION_VISUAL_GUIDE.md` - Visual flows and state diagrams

### 📝 Improvements
- Enhanced documentation formatting and consistency
- Improved visual guides for understanding real-time model selection
- Better integration examples for orchestrator

## [4.1.0] - 2025-10-22

### 🎯 NEW FEATURE: GitHub-Native Issue Creation System

#### Breaking Changes

- **CHANGED**: Issue creation now uses GitHub native features instead of label-based workarounds
- **REMOVED**: P0, P1, P2, P3 priority labels (replaced with priority field in issue body)
- **REMOVED**: Type labels like `bug`, `enhancement`, `feature` (use native GitHub issue type instead)
- **CHANGED**: Labels are now ONLY for components (backend, frontend, database, devops, ux, documentation, api, infrastructure)

#### New Features

##### GitHub-Native Issue System
- ✅ **Native Issue Types**: Use GitHub's standard Bug/Enhancement/Task types
- ✅ **Visual Priority Indicators**: Emoji-based priority in body (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low)
- ✅ **Story Point Estimation**: Fibonacci scale (1, 2, 3, 5, 8, 13, 21) for effort tracking
- ✅ **Component Labels Only**: Dedicated labels for components, not mixed with types/priorities
- ✅ **Auto-Status Transitions**: Issues automatically move through workflow stages

##### New Issue Creation Format
```markdown
**Priority:** 🟡 Medium
**Estimate:** 5 story points
**Components:** frontend, backend

---

## Description
Clear description...

## Acceptance Criteria
- [ ] Testable criterion 1
- [ ] Testable criterion 2
```

##### Component Label System
- `backend` - Backend/API changes
- `frontend` - Frontend/UI changes
- `database` - Database changes
- `devops` - DevOps/Infrastructure
- `ux` - UX/Design
- `documentation` - Documentation
- `api` - API changes
- `infrastructure` - Infrastructure

##### New Tools & Scripts
- **NEW**: `scripts/setup-github-project.js` - Auto-detects GitHub Project fields and generates .env configuration
- **NEW**: `docs/guides/GITHUB_PROJECTS_SETUP.md` - Complete setup guide for GitHub Projects v2 integration
- **NEW**: `lib/commands/issue-improved.js` - Modern issue creation with native GitHub features

#### Improvements

- **IMPROVED**: Issue body uses `--body-file` for proper markdown rendering (no escaping issues)
- **IMPROVED**: Copilot instructions template updated with new workflow examples
- **IMPROVED**: README.md with comprehensive v3.0.0 feature comparison table
- **IMPROVED**: Wiki documentation with new issue creation workflow

#### Documentation

- **UPDATED**: `lib/copilot-instructions-template.js` - All examples use new format
- **UPDATED**: `README.md` - Added "GitHub-Native Issue Creation" section
- **UPDATED**: `wiki/Home.md` - "What's New in 3.0.0" highlights
- **NEW**: Issue creation examples show `--body-file` approach with temp files

#### Migration Guide

**Old Format (< v3.0.0):**
```bash
gh issue create --title "Fix bug" --label "bug,P1,frontend,backend"
```

**New Format (v3.0.0+):**
```bash
cat > .gh-issue-body.md << 'EOF'
**Priority:** 🔴 Critical
**Estimate:** 3 story points
**Components:** frontend, backend

---

## Description
Bug description...
EOF

gh issue create --title "Fix bug" --body-file .gh-issue-body.md --label "frontend,backend"
rm .gh-issue-body.md
```

#### Benefits

- ✅ **Standards-Compliant** - Uses GitHub's intended feature set
- ✅ **Better Filtering** - Component labels separate from types/priorities
- ✅ **Effort Tracking** - Story points enable sprint planning
- ✅ **Visual Clarity** - Emoji indicators make priorities instantly recognizable
- ✅ **Automated Workflow** - Status transitions happen automatically

---

## [4.0.3] - 2025-10-21

### 🐛 Bug Fixes

#### Template Syntax Error Fix

- **FIXED**: Escaped backticks in `lib/copilot-instructions-template.js` to prevent syntax error
  - Issue: Backticks inside template literal broke CLI commands
  - Solution: Changed \`gh issue create\` to \\\`gh issue create\\\` in template string
  - Impact: v4.0.2 was completely broken, couldn't run any `leo` commands
  - Status: ✅ Fixed and verified working

### ✅ Verification

- CLI commands working: `leo --version`, `leo health`, `leo agent list`
- No syntax errors in template
- Global installation successful

### 📦 Package

- **Size**: 144.1 KB (tarball), 481.4 KB (unpacked)
- **Files**: 47 files

---

## [4.0.2] - 2025-10-21

### 🤖 Automation Improvements

#### Full Automation Enforcement

- **ENHANCED**: Copilot instructions now enforce 100% automated issue creation
  - ✅ Always uses `gh issue create --title "..." --body "..." --label "..."` with ALL parameters
  - ❌ Never uses `leo issue` command (prevents interactive CLI prompts)
  - ✅ Provides complete issue details in ONE command
  - ✅ No manual user input required

#### Latest AI Models Support

- **UPDATED**: Model Selection Strategy spec with latest AI models
  - Added **GPT-5** (main reasoning model)
  - Added **GPT-5 Codex Preview** (coding tasks, testing)
  - Added **Claude Sonnet 4.5** (frontend/backend development)
  - Added **Claude Haiku 4.5 Preview** (lightweight tasks, docs)
  - Updated all strategy configurations (phase-based, complexity-based, agent-based)

### 📝 Documentation Updates

- **IMPROVED**: `.github/copilot-instructions.md`

  - Added explicit "NO MANUAL CLI" rules with examples
  - Added Quick Reference section for issue creation
  - Enhanced Key Mantras and Critical Reminders
  - Added correct vs forbidden automation patterns

- **IMPROVED**: `lib/copilot-instructions-template.js`

  - Updated installation template with automation rules
  - Added "NO MANUAL CLI - ONLY AUTOMATION" enforcement
  - Ensures new projects get full automation by default

- **UPDATED**: `docs/specs/model-selection-strategy.md`
  - Updated to GPT-5, GPT-5 Codex Preview
  - Updated to Claude 4.5 series
  - Updated AI assistant mapping
  - Aligned with latest OpenAI and Anthropic releases

### 🔧 Files Modified

- `.github/copilot-instructions.md` - Enhanced automation rules
- `lib/copilot-instructions-template.js` - Updated installation template
- `docs/specs/model-selection-strategy.md` - Latest AI models

### 📦 Package

- **Size**: 143.5 KB (tarball), 479.4 KB (unpacked)
- **Files**: 47 files

---

## [4.0.0] - 2025-10-20

### 🎛️ Major Feature: Multi-Agent Orchestration System

#### Architecture Transformation

- **NEW**: Intelligent orchestration layer with specialized AI agents
  - **Orchestrator Agent** (always enabled): Analyzes requests and routes to specialists
  - **Frontend Agent**: UI/UX, components, styling, accessibility, responsive design
  - **Backend Agent**: APIs, databases, authentication, security, performance
  - **DevOps Agent**: CI/CD, Docker, Kubernetes, deployment, monitoring
  - **Testing Agent**: Unit/integration/E2E tests, TDD, code coverage
  - **Documentation Agent**: README, API docs, guides, tutorials, JSDoc

#### Benefits Over v3.x

- ✅ **Higher Quality Output** - Domain specialists produce better code than generic AI
- ✅ **Faster Responses** - Smaller, focused instruction sets (~13-17KB per agent)
- ✅ **Flexibility** - Enable only agents you need for your project
- ✅ **Maintainability** - Modular agent templates instead of monolithic instructions
- ✅ **Scalability** - Easy to add new agent types in future versions

### ⚡ New `leo agent` Command Suite

Complete CLI for managing specialized agents:

```bash
# List all agents and their status
leo agent list

# Enable a specialized agent
leo agent enable frontend
leo agent enable backend

# Disable an agent
leo agent disable devops

# Show detailed agent information
leo agent info testing

# Regenerate AI instruction files
leo agent sync
```

#### Features

- ✅ Interactive prompts for AI file sync after enable/disable
- ✅ Clear status display with emojis and colors
- ✅ Detailed agent information with responsibilities and routing triggers
- ✅ Orchestrator always enabled (cannot be disabled - core routing layer)
- ✅ Integration with config-manager for persistent configuration
- ✅ Error handling for invalid agent names

### 🔧 Enhanced Configuration System

#### New `.leorc.json` Schema

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

#### Agent Selection During `leo init`

- **NEW**: Interactive agent selection based on project type
- **Recommended Agents** shown for each project type:
  - **fullstack**: frontend, backend, testing
  - **frontend-only**: frontend, devops, testing, documentation
  - **backend-only**: backend, devops, testing, documentation
  - **cli-tool**: backend, testing, documentation
- **Smart Defaults** based on project needs

#### Config Manager Enhancements

8 new functions for agent management:

- `validateAgentsConfig()` - Validate agents configuration
- `getEnabledAgents()` - Get list of enabled agents
- `enableAgent(agent, config, skipSync)` - Enable an agent
- `disableAgent(agent, skipSync)` - Disable an agent
- `getAgentConfig(agent)` - Get configuration for specific agent
- `getProjectType()` - Get project type from config
- `getRecommendedAgents(projectType)` - Get recommended agents by type

### 📝 Intelligent Routing System

#### Single-Agent Tasks

**Example: "Add a search bar to the header"**

```
Orchestrator analyzes:
  - Keywords: "search bar", "header" → Frontend task
  - Routes to: Frontend Agent

Frontend Agent implements:
  - Creates SearchBar component
  - Adds styling and accessibility
  - Updates Header component
```

#### Multi-Agent Coordination

**Example: "Add OAuth2 login with Google"**

```
Orchestrator analyzes:
  - "OAuth2" + "login" → Backend + Frontend
  - Multi-agent coordination needed

Step 1: Backend Agent
  - Creates /api/auth/google endpoint
  - Configures OAuth2 provider

Step 2: Frontend Agent (with context from Backend)
  - Creates LoginButton component
  - Integrates with backend API

Orchestrator: Verifies integration
```

#### Routing Triggers

Each agent activates based on:

- **Keywords** - Specific terms in user requests
- **File Patterns** - Files being modified
- **User Intent** - Desired outcome analysis

### 📚 Comprehensive Documentation

#### New Documentation Files

- **`docs/guides/multi-agent-system.md`** (~3000 lines)

  - Complete multi-agent system guide
  - Architecture diagrams
  - Agent descriptions with examples
  - Configuration guide
  - CLI command reference
  - Routing logic explanation
  - Best practices
  - Troubleshooting
  - Migration guide from v3.x

- **`docs/development/E2E_TESTING_V4.0.0.md`**

  - End-to-end testing report
  - 13 test scenarios (6 automated, 7 manual)
  - 100% pass rate on automated tests
  - Test outputs and verification
  - Recommendations for improvements

- **`docs/specs/multi-agent-orchestration.md`**
  - Complete architectural specification
  - 50+ pages of design decisions
  - Implementation phases
  - Future vision (v5.0.0+)

#### README Updates

- Added v4.0.0 announcement section
- Multi-Agent Orchestration overview with diagram
- Agent table with roles and triggers
- Example routing scenarios
- Configuration examples
- Links to full documentation

### 🔧 AI Instruction Generation

#### Builder Enhancements

- **NEW**: Multi-agent content generation in `lib/ai-instructions/builder.js`
  - `getAgentGenerators()` - Returns map of agent generator functions
  - `getEnabledAgents()` - Gets enabled agents from config
  - `generateMultiAgentContent()` - Generates all agent instructions
  - Updated `getUniversalTemplate()` to call multi-agent generation

#### Adapter Updates

- **Cline Adapter**: Flexible validation supporting both traditional and multi-agent content
- **Codeium Adapter**: Flexible validation supporting both traditional and multi-agent content
- **Copilot/Cursor**: Already flexible, work with multi-agent content

#### Generated File Sizes

- **v3.x**: Single monolithic file (~500KB)
- **v4.0.0**: Modular multi-agent files (~60-80KB with 2-3 agents, ~80-100KB with all 5)

### 📦 New Files Created

#### Agent Templates

- `lib/agents/orchestrator-template.js` (644 lines, ~420 lines generated)
- `lib/agents/frontend-template.js` (644 lines, ~13.2KB output)
- `lib/agents/backend-template.js` (710 lines, ~16.5KB output)
- `lib/agents/devops-template.js` (724 lines, ~14.8KB output)
- `lib/agents/testing-template.js` (625 lines, ~15.3KB output)
- `lib/agents/documentation-template.js` (765 lines, ~16.5KB output)

#### Commands

- `lib/commands/agent.js` (470 lines) - Complete agent management CLI

#### Documentation

- `docs/guides/multi-agent-system.md` - User guide
- `docs/development/E2E_TESTING_V4.0.0.md` - Test report
- `docs/specs/multi-agent-orchestration.md` - Technical spec
- `docs/development/MULTI_AGENT_PROJECT_STATUS.md` - Implementation tracker

### 📦 Modified Files

- `lib/utils/config-manager.js` - Added 8 agent management functions
- `lib/ai-instructions/builder.js` - Multi-agent generation support
- `lib/ai-instructions/adapters/cline-adapter.js` - Flexible validation
- `lib/ai-instructions/adapters/codeium-adapter.js` - Flexible validation
- `lib/commands/init.js` - Agent selection prompts (~85 lines added)
- `bin/cli.js` - Added `leo agent` command
- `README.md` - v4.0.0 announcement and multi-agent section
- `lib/copilot-instructions-template.js` - Fixed code block escaping

### ⚠️ Breaking Changes

#### AI Instruction File Structure

- **Changed**: AI instruction files now use multi-agent template structure
- **Impact**: Custom edits to `.github/copilot-instructions.md` will be overwritten
- **Migration**: Back up custom changes before running `leo agent sync`

#### Configuration Schema

- **Added**: New `agents` section in `.leorc.json`
- **Impact**: Minimal - v3.x configs work without agents section (all agents disabled)
- **Migration**: Run `leo init` to add agent selection, or manually add agents section

### 🔄 Backward Compatibility

✅ **Mostly Backward Compatible**

- ✅ Existing `.leorc.json` files work (agents section optional)
- ✅ GitHub Projects integration unchanged
- ✅ Issue templates and labels unchanged
- ✅ CLI commands backward compatible (except AI file structure)

### 📊 Migration Guide (v3.x → v4.0.0)

#### Step 1: Update LEO

```bash
npm install -g leo-workflow-kit@latest
```

#### Step 2: Backup Existing Config

```bash
cp .leorc.json .leorc.json.backup
```

#### Step 3: Re-run Init with Agent Selection

```bash
leo init
```

Select agents when prompted.

#### Step 4: Regenerate AI Files

```bash
leo agent sync
```

#### Step 5: Restart AI Assistant

- **VS Code (Copilot)**: Reload window (`Cmd+Shift+P` → "Reload Window")
- **Cursor**: Restart application
- **Cline**: Reload extension
- **Codeium**: Restart extension

#### Step 6: Test Routing

Try a simple request to verify routing:

```
"Add a button to the homepage"
```

Should see:

```
✓ Task analyzed: Frontend (UI component)
✓ Routing to Frontend Agent...
```

### 🎯 Benefits Summary

| Aspect            | v3.x                 | v4.0.0                       |
| ----------------- | -------------------- | ---------------------------- |
| **Architecture**  | Single AI assistant  | Multi-agent orchestration    |
| **Instructions**  | One file (~500KB)    | Modular files (~60-80KB)     |
| **Configuration** | Basic settings       | Agent selection              |
| **Routing**       | Manual (user-driven) | Automatic (intelligent)      |
| **Quality**       | Generic output       | Specialized domain expertise |
| **Flexibility**   | All-or-nothing       | Enable only what you need    |

### 🚀 Future Roadmap

Coming in v4.1.0+:

- Custom agent configurations
- Per-agent settings and priority overrides
- Custom routing rules
- Agent usage statistics and metrics
- Performance profiling
- Quality scoring

### 🙏 Acknowledgments

Special thanks to all contributors and users who provided feedback that shaped the multi-agent system architecture.

---

## [3.0.3] - 2025-10-19

### 🐛 Critical Bug Fixes

#### AI Instruction Generation Fixed

- **Fixed**: AI instruction files not being generated during `leo init`
  - **Root Cause**: Missing `success: true` flag in result objects from `generateForAI()` method
  - **Solution**: Added `success: true` to return value in `lib/ai-instructions/builder.js` (line 78)
  - **Impact**: All users running `leo init` now correctly receive AI instruction files
  - **Affected Commands**: `leo init`, `leo ai sync`

### 🔒 Enhanced AI Enforcement

#### Mandatory Instruction Reading

- **Added**: "READ ALL INSTRUCTIONS FROM TOP TO BOTTOM" requirement to all AI adapters
  - Forces AI assistants to read entire instruction file before responding
  - Prevents skipping sections or assuming knowledge
  - Added prominent header to all 4 AI adapters (Copilot, Cursor, Cline, Codeium)
  - Explicit checklist: Read file → Understand rules → Apply rules → Verify compliance

#### Strengthened Enforcement Language

- **Enhanced**: All AI adapters with stronger imperative language
  - Changed "should" to "MUST" throughout instructions
  - Added "NO EXCEPTIONS" and "ALWAYS ACTIVE" markers
  - Emphasized mandatory workflows (issue creation, status updates, commit format)
  - 5-layer enforcement: Top header → Checklist → Content → Quick Reference → Final Reminder

### 📚 New Documentation

- **Added**: `docs/workflows/deployment-workflow.md` - Complete deployment guide

  - Pre-deployment checklist (400+ lines)
  - Monorepo vs single-package patterns
  - Railway deployment guide with troubleshooting
  - CI/CD integration examples
  - Rollback procedures

- **Added**: `docs/guides/leorc-configuration.md` - .leorc.json configuration reference

  - All configuration options documented
  - Examples for each setting
  - Priority explanation (local > global > default)
  - Common configuration patterns

- **Added**: `docs/development/IMPLEMENTATION_V3.0.3.md` - Implementation summary

  - Complete changelog of code modifications
  - Testing recommendations
  - Backward compatibility notes

- **Added**: `docs/development/AI_INSTRUCTION_ENFORCEMENT.md` - Enforcement strategy
  - Problem statement and solution
  - Multi-layer enforcement approach
  - Testing and validation guidelines
  - Best practices for AI instructions

### 🔧 Improved Verification

- **Enhanced**: Post-generation verification in `leo init`
  - Shows file size confirmation for each AI instruction file
  - Provides VS Code reload instructions
  - Better error messages when generation fails
  - Explicit success confirmation with file paths

### 📦 Files Modified

- `lib/ai-instructions/builder.js` - Fixed success flag
- `lib/commands/init.js` - Enhanced verification
- `lib/copilot-instructions-template.js` - Added "READ ALL" sections
- `lib/ai-instructions/adapters/copilot-adapter.js` - Enforcement header
- `lib/ai-instructions/adapters/cursor-adapter.js` - Enforcement header
- `lib/ai-instructions/adapters/cline-adapter.js` - Enforcement header
- `lib/ai-instructions/adapters/codeium-adapter.js` - Enforcement header

### 📦 Files Created

- `docs/workflows/deployment-workflow.md`
- `docs/guides/leorc-configuration.md`
- `docs/development/IMPLEMENTATION_V3.0.3.md`
- `docs/development/AI_INSTRUCTION_ENFORCEMENT.md`

### ⚠️ Breaking Changes

None - fully backward compatible with v3.0.2

### 🔄 Migration Guide

No action required! This is a bug fix and enhancement release.

**To benefit from enhancements:**

```bash
# Update to latest version
npm install -g leo-workflow-kit@latest

# Regenerate AI instruction files (optional, recommended)
cd your-project
leo ai sync
```

**What's improved:**

- AI instruction files will generate correctly during init
- Stronger enforcement ensures AI follows workflows from first message
- Better error messages and verification feedback
- Comprehensive deployment and configuration documentation

---

## [3.0.2] - 2025-10-19

### Added

- **Smart AI Instruction Merging**: When existing AI instruction files are detected, LEO now intelligently merges content instead of skipping
  - Detects existing `.github/copilot-instructions.md`, `.cursorrules`, `.clinerules`, or `.codeium/instructions.md`
  - Preserves user's project-specific conventions and custom content
  - Prepends LEO's workflow standards with clear section markers
  - Creates backup files before merging (`.backup` extension)
  - Prompts user for confirmation before merging
  - Works with all supported AI assistants

### Changed

- **`leo init` behavior**: Now offers to merge with existing AI instructions instead of skipping generation
- **`leo ai sync` behavior**: Intelligently merges updates while preserving custom sections
- **File structure**: AI instruction files now have clear section markers:
  - `<!-- LEO WORKFLOW STANDARDS (Auto-generated) -->`
  - `<!-- PROJECT-SPECIFIC INSTRUCTIONS -->`

### Improved

- **Onboarding experience**: Projects with existing AI instructions can now adopt LEO without losing customizations
- **Documentation**: Updated guides with merging workflow examples

### Fixed

- Issue #15: LEO now merges existing AI instructions instead of skipping generation

---

## [3.0.1] - 2025-10-19

### Changed

- **Workflow Instructions**: Enhanced automatic status update enforcement

  - Added CRITICAL requirement for immediate status update when starting work
  - Updated Quick Reference Card with status update as first action
  - Added "Update Status FIRST" to Key Mantras
  - All AI assistants now receive explicit instructions to comment on issues and move to "In Progress" before coding

- **Installation Banner**: Updated to highlight multi-AI support

  - Added multi-AI support as first feature
  - Updated feature descriptions to mention all 4 AI assistants
  - Improved messaging for AI-optimized workflow instructions

- **Documentation**: Comprehensive updates for v3.0.0
  - Updated wiki Home.md with v3.0.0 release information
  - Added full `leo ai` command documentation to Commands-Reference.md
  - Updated navigation links for Multi-AI sections
  - All documentation now reflects v3.0.0 multi-AI capabilities

### Fixed

- Issue status update workflow now more explicit and mandatory
- Better guidance for AI assistants on when to update project board status

---

## [3.0.0] - 2025-10-19

### 🎉 Major Release: Multi-AI Assistant Support

LEO Workflow Kit now supports **4 AI coding assistants** beyond GitHub Copilot! This major release enables teams to use their preferred AI tools while maintaining consistent LEO workflow standards.

### Added

- **🤖 Multi-AI Support**: 4 AI assistants with optimized instruction generation

  - **GitHub Copilot** (.github/copilot-instructions.md) - Original supported AI
  - **Cursor** (.cursorrules) - Claude-powered IDE with Composer Mode
  - **Cline** (.clinerules) - Autonomous Claude-Dev VSCode extension
  - **Codeium** (.codeium/instructions.md) - Free AI completion (70+ languages)

- **📦 AI Instructions Architecture**:

  - `lib/ai-instructions/` directory with adapter pattern design
  - `BaseAIAdapter` abstract class defining AI adapter interface
  - Individual adapters for each AI with optimized content
  - `AIInstructionsBuilder` orchestrator for generation and management

- **⚡ New `leo ai` Command**:

  - `leo ai list` - Show configured AI assistants with file paths
  - `leo ai add <name>` - Add new AI assistant and generate instructions
  - `leo ai remove <name>` - Remove AI assistant and delete files
  - `leo ai sync` - Regenerate all AI instruction files
  - `leo ai diff <ai1> <ai2>` - Compare two AI configs (coming soon)

- **🚀 Init Integration**:

  - AI assistant selection during `leo init` (checkbox prompt)
  - Generate instruction files for all selected AIs
  - Set primary AI for multi-AI setups
  - Non-interactive mode defaults to Copilot only

- **📝 Configuration**:

  - New `ai-assistants` section in `.leorc.json`
  - `enabled`: Array of active AI assistants
  - `primary`: Most-used AI assistant
  - `sync-on-update`: Auto-sync all AI files on template updates

- **📚 Documentation**:
  - Comprehensive Migration Guide (v2.x → v3.0.0) in `docs/MIGRATION_V3.md`
  - Multi-AI Support section in README
  - `leo ai` command documentation
  - AI assistant comparison table

### Changed

- **Refactored Copilot Instructions**: Existing template now serves as universal base for all AIs
- **Enhanced Init Flow**: Now includes AI assistant selection step
- **Updated README**: Added Multi-AI Support section before Features
- **Success Messages**: Show configured AIs and primary AI after init

### Technical Details

- Each AI adapter generates ~40KB instruction file with:
  - Full LEO workflow standards (spec-driven, issue creation, commit guidelines)
  - AI-specific tips and keyboard shortcuts
  - Best practices for that tool's strengths
  - Component-first development patterns
  - Performance optimization guidelines
  - SEO best practices

### Backward Compatibility

- ✅ **Fully backward compatible** with v2.x
- ✅ Existing `.github/copilot-instructions.md` files preserved
- ✅ Default configuration is Copilot-only (no breaking changes)
- ✅ All v2.x commands and workflows continue working
- ✅ Migration is optional - add other AIs when ready

### Migration

Existing v2.x users can:

1. **Do nothing**: Continue using Copilot-only setup (fully supported)
2. **Add AIs**: Run `leo ai add <name>` to add more assistants
3. **Fresh init**: Re-run `leo init` to select multiple AIs

See [Migration Guide](docs/MIGRATION_V3.md) for detailed instructions.

---

## [2.6.4] - 2025-10-19

### Changed

- **Golden gradient banner**: LEO_KIT ASCII art now features a beautiful golden gradient
  - Transitions from bright gold (#FFD700) at top to darker orange-gold (#FF8C00) at bottom
  - Creates a more visually striking and professional appearance
  - Applied to both main banner and installation banner
  - Improved border alignment for perfect box rendering

## [2.6.3] - 2025-10-19

### Fixed

- **Banner alignment**: All text now properly centered with dynamic padding
  - Added `centerText()` helper function in `lib/banner.js`
  - Added `centerInBox()` helper function in `scripts/postinstall.js`
  - Version text, title, and subtitle now perfectly aligned regardless of version number length
  - Improved visual consistency across all banner displays

## [2.6.2] - 2025-10-19

### Fixed

- **Dynamic version display**: Banner and postinstall script now read version from `package.json` instead of hardcoded value
  - Fixed `lib/banner.js` to dynamically read version
  - Fixed `scripts/postinstall.js` to display correct version during installation
  - Users now see accurate version number when installing or running `leo welcome`

### Changed

- **Banner version**: Now shows current package version (2.6.2) instead of outdated "2.2.0"

## [2.6.1] - 2025-10-19

### Changed

- **Copilot instructions template**:
  - Added issue comment length guidelines (prevent pipeline delays)
  - Updated Quick Reference Card with comment length checklist
  - Updated Key Mantras with "Keep It Short" principle

## [2.6.0] - 2025-10-19

### 🎉 Major Features

#### Workflow Configuration System

- **`leo config` command**: Manage workflow settings via CLI
- **Auto-resolution toggle**: Control whether Copilot automatically works on created issues
  - `leo config set auto-resolve false` - Create issues but wait for review
  - `leo config set auto-resolve true` - Auto-work on issues (default)
- **Local and global config**: Project-specific (`.leorc.json`) or global (`~/.leorc.json`) settings
- **Configuration priority**: Local > Global > Default
- **Smart Copilot integration**: Template checks config before proceeding with work

#### Commit Message Length Guidelines

- **Pipeline protection**: Guidelines to prevent long commits from causing pipeline issues
- **Best practices**: Keep subject lines under 72 characters
- **Clear examples**: Good vs problematic commit message examples
- **Quick reference**: Added to development workflow checklist

#### Issue Comment Length Guidelines ⭐ NEW

- **Pipeline protection**: Guidelines to prevent long issue comments from causing delays
- **Best practices**: Keep comments under 3-4 lines or ~200 characters
- **Applies to**: `gh issue close --comment` and `gh issue comment` commands
- **Clear examples**: Good vs problematic comment examples
- **Quick reference**: Added to development workflow and Key Mantras

### Added

- `lib/commands/config.js` - Full configuration management command
- `lib/utils/config-manager.js` - Config file read/write utilities
- `.leorc.json` support - Local project configuration
- `~/.leorc.json` support - Global user configuration
- Auto-resolution configuration in Copilot instructions template
- Comprehensive commit message length section in template
- **Issue comment length guidelines section** in template
- Configuration keys:
  - `auto-resolve` (default: true) - Auto-work on issues
  - `auto-init` (default: false) - Auto-initialize on install
  - `project-type` (default: auto) - Project type for smart instructions

### Changed

- **Copilot instructions template**:
  - Added auto-resolution config check workflow
  - Enhanced Git & Version Control section with commit length limits
  - **Added Issue Comment Length Guidelines section (CRITICAL)**
  - Updated Table of Contents to highlight commit length guidelines
  - Updated Quick Reference Card with commit length reminder
  - **Updated Quick Reference Card with issue comment length reminder**
  - **Added "Keep It Short" to Key Mantras**
- **.gitignore**: Added `.leorc.json` to exclude user configs
- **CLI**: Registered `leo config` command with `cfg` alias

### Documentation

- Enhanced config command help with examples
- Added configuration priority explanation
- Documented all available configuration keys
- Added auto-resolution workflow to template
- **Added issue comment best practices and examples**

## [2.5.0] - 2025-10-19

### 🎉 Major Features

#### Automatic Initialization

- **Auto-init on install**: Set `LEO_AUTO_INIT=true` to automatically initialize projects on install
- **Non-interactive mode**: `leo init --non-interactive` for CI/CD and automated setups
- **Smart detection**: Automatically detects if in git repo and not already initialized
- **Zero-configuration**: Works with `npm install leo-workflow-kit` - no manual steps needed

#### Smart Project-Type Based Copilot Instructions (Foundation)

- **6 Project Types**: fullstack, frontend, backend, cli, mobile, library
- **Modular architecture**: 15 customizable sections
- **Auto-detection**: Detects project type from package.json
- **Optimized instructions**: Tailored content based on project needs
  - Frontend: ~900 lines (no backend/API noise)
  - Backend: ~600 lines (no UI/SEO noise)
  - CLI: ~400 lines (focused on CLI patterns)
  - Full Stack: ~1,200 lines (everything)

#### Optimized Copilot Instructions Template

- **Better organization**: Clear table of contents with visual markers (🚨, 🎨, 📚)
- **Critical workflows first**: Automatic issue creation rules impossible to miss
- **Improved readability**: Section dividers and better headers
- **Enhanced quick reference**: Key mantras and workflow reminders
- **All standards preserved**: SEO, UI, Components, Code Quality fully intact

### Added

- `LEO_AUTO_INIT` environment variable for automatic initialization
- `--non-interactive` flag for `leo init` command
- `lib/copilot-instructions/` modular system (config, builder, index)
- Auto-detection rules for project types (React → frontend, Express → backend, etc.)
- Comprehensive implementation plan for Phase 2-7
- `docs/guides/AUTO_INITIALIZATION.md` - Complete auto-init guide
- `docs/development/SMART_COPILOT_INSTRUCTIONS_PLAN.md` - Implementation roadmap

### Changed

- **Copilot instructions template**: Reorganized with table of contents and visual markers
- **package.json description**: Updated to reflect new features
- **postinstall.js**: Now supports auto-initialization
- **init.js**: Added non-interactive mode support

### Fixed

- Issue #3: Copilot now automatically creates issues (enhanced instructions)
- Issue #5: Critical workflow rules now prominently displayed
- Issue #6: Optimized project's own Copilot instructions
- Issue #7: Optimized user template for clarity and organization

### Documentation

- Created `TEMPLATE_OPTIMIZATION_V2.5.0.md` - Template optimization summary
- Created `COPILOT_INSTRUCTIONS_CLARIFICATION.md` - Explains which file is which
- Created `CLEANUP_COMPLETE_V2.5.0.md` - Comprehensive cleanup documentation
- Updated wiki pages with v2.5.0 features
- Improved README with auto-initialization examples

### Developer Experience

- **Faster setup**: Auto-init reduces setup time from ~5 minutes to < 30 seconds
- **Less noise**: Project-type based instructions reduce cognitive load
- **Better focus**: Only see relevant sections for your project type
- **Consistent workflow**: Same great spec-first development, now automatic

### Breaking Changes

None - fully backward compatible. Defaults to fullstack project type if not specified.

### Migration Guide

#### From v2.4.0 to v2.5.0

No action required! However, to take advantage of new features:

**Enable Auto-Initialization:**
\`\`\`bash

# In your project or CI/CD

export LEO_AUTO_INIT=true
npm install leo-workflow-kit
\`\`\`

**Or in package.json:**
\`\`\`json
{
"config": {
"LEO_AUTO_INIT": "true"
}
}
\`\`\`

**Smart Copilot Instructions** (coming in future updates):
\`\`\`bash

# Will be available in upcoming releases

leo init --project-type frontend
leo config --project-type backend
\`\`\`

### Credits

- Core development: Leo de Souza (@leonpagotto)
- Testing and feedback: LEO community
- Inspiration: spec-kit, GitHub Projects, modern CLI tools

---

## [2.4.0] - 2025-10-19

### 🚀 Major Feature: Intelligent Spec-First Decision Making

Copilot now intelligently decides whether to create a specification first or go directly to issues!

### Added

- **Intelligent Work Analysis**: AI analyzes complexity before creating issues
- **Automatic Spec Creation**: For complex features, creates specification files in `docs/specs/`
- **Spec Review Workflow**: Asks user to review specs before breaking down into issues
- **Decision Tree Logic**: Clear rules for when to create specs vs direct issues
- **Enhanced Workflow Diagram**: Updated to show spec-first decision flow
- **Comprehensive Documentation**: Issue #4 resolved with complete guides

### Decision Rules

**Create SPEC First:**

- New features requiring architecture decisions
- Significant system changes (multiple components)
- Features needing design/planning (> 1 week)
- Work requiring team discussion
- Features generating multiple issues

**Direct ISSUE:**

- Bug fixes (clear problem/solution)
- Documentation updates
- Small enhancements (< 1 day)
- Adding tests
- UI polish/tweaks
- Single component refactoring

### Workflow Changes

**Complex Feature Example:**

```
User: "Add OAuth2 authentication"
→ Copilot creates docs/specs/oauth2-authentication.md
→ Asks user to review
→ After approval, breaks into 5 focused issues
→ Each issue added to project with Todo status
```

**Simple Task Example:**

```
User: "Fix login button on mobile"
→ Copilot creates issue directly
→ Adds to project with Todo status
→ Ready to work immediately
```

### Improved

- **Copilot Instructions**: Major enhancement with spec-first decision tree
- **Workflow Diagram**: Now shows spec creation path vs direct issue path
- **Documentation**: Updated README with new workflow
- **Issue Quality**: Specs ensure better planning for complex work

### Technical Details

- Spec files created in `docs/specs/` with structured format
- Includes: Problem Statement, Solution, Technical Approach, Architecture, Criteria
- User review required before issue breakdown
- Multiple focused issues generated from approved specs

## [2.3.0] - 2025-10-19

### 🚀 Major Feature: GitHub Projects Integration & Automated Status Management

This release adds full GitHub Projects integration with automatic status tracking - issues are automatically added to your project board and status updates as work progresses!

### Added

- **Automatic Project Integration**: Issues are automatically added to GitHub Projects when created by Copilot
- **Intelligent Status Management**: Status automatically updates based on work indicators:
  - **Todo** (default for new issues)
  - **In Progress** (when commits/branches reference issue or user starts work)
  - **Done** (when PR merged or issue closed)
- **Project View Configuration**: Copilot instructions for setting up project views with Status, Title, Assignees, and Labels columns
- **Status Transition Detection**: Monitors commits, branches, PRs, and user statements to detect work progress
- **GraphQL API Integration**: Uses GitHub's GraphQL API for reliable status updates
- **Comprehensive Project Guide**: Added detailed documentation for GitHub Projects setup and configuration (`docs/guides/github-projects-integration.md`)

### Changed

- **Copilot Instructions**: Major expansion with automatic status update rules and project management workflows
- **Issue Creation Flow**: Now includes project addition and status setting when project is configured
- **Template Updates**: Enhanced `lib/copilot-instructions-template.js` with project integration patterns

### Improved

- **Workflow Automation**: Complete automation from issue creation → project addition → status tracking → completion
- **Project Visibility**: All work visible on project board with real-time status updates
- **Developer Experience**: No manual status updates needed - Copilot handles it based on your work
- **Documentation**: Comprehensive guide with examples, troubleshooting, and best practices

### Technical Details

- Uses `gh project item-add` for adding issues to projects
- Uses GraphQL mutations for status field updates
- Detects work indicators: commit messages, branch names, PR actions, user statements
- Supports custom project configurations with configurable field IDs

## [2.2.0] - 2025-10-19

### 🚀 Major Feature: Automatic Issue Creation via GitHub Copilot

This release enables GitHub Copilot to automatically create issues when you describe work in conversation - no more manual form filling!

### Added

- **Automatic Issue Creation Instructions**: Added comprehensive Copilot instructions for detecting when users describe work and automatically creating GitHub issues
- **GitHub Authentication Flow**: Added interactive GitHub CLI authentication during `leo init` setup
- **Smart Intent Detection**: Copilot now recognizes patterns like "We need to fix...", "Let's add...", "There's a bug..." and creates issues automatically
- **Context Extraction**: Automatically extracts priority, type, component from user descriptions

### Changed

- **Copilot Instructions Enhanced**: Added detailed examples and rules for automatic issue creation at the top of instructions (CRITICAL section)
- **Init Command**: Now checks GitHub authentication and offers to authenticate interactively if not logged in
- **Package Optimization**: Further reduced package size by excluding more unnecessary files via improved .npmignore

### Improved

- **User Experience**: Users can now describe issues in conversation and Copilot creates them automatically
- **Authentication UX**: Clear prompts and guidance for GitHub authentication during setup
- **Package Size**: Maintained lean package size (46.8 KB) while adding new features

### How It Works

When you say to Copilot:

- "We need to fix the login button not working on mobile"
- "Let's add dark mode support"
- "The search is too slow"

Copilot will automatically:

1. Detect you're describing work
2. Extract key details (priority, type, component)
3. Run `leo issue` with smart defaults
4. Confirm issue creation with link

No more interrupting your flow to fill out forms!

## [2.1.1] - 2025-10-19

### Fixed

- **Package Publishing**: Added explicit `files` field to package.json to ensure all templates are included in npm package
- **Installation Flow**: Enhanced postinstall.js to detect local vs global installs and guide users accordingly
- **Smart Setup**: Postinstall now detects if you're in a git repo and prompts to run `leo init` for quick setup
- **Package Size**: Reduced package size from 94.1 KB to 45.3 KB by excluding unnecessary documentation files via .npmignore

### Added

- `.npmignore` file to exclude development documentation and keep package lean
- Auto-detection of existing LEO setup to avoid duplicate initialization
- Context-aware installation messages based on install type (global/local) and repository status

### Changed

- Improved postinstall messaging to clearly guide users on next steps
- Updated version references to 2.1.1 across banner and scripts

## [2.0.3] - 2025-10-18

### Changed

- **Brand Refresh**: Updated banner from "LEO WORKFLOW KIT" to "LEO-KIT" for cleaner, more memorable branding
- **Visual Enhancement**: Redesigned ASCII art banner with bold block letters for outstanding visual appeal
- **Compact Design**: Simplified compact banner for better readability on smaller terminals

### Design Details

- Full banner now uses modern block characters (`█╗║╝═╔╚`) for professional appearance
- Maintained golden yellow color scheme (#FFD700) for consistency with lion branding
- All three banner variants updated: full, compact, and welcome message
- Terminal width responsive behavior preserved

## [2.0.0] - 2025-10-18

### 🎉 Major Release: Development Best Practices & Enhanced Project Management

This major release transforms LEO Workflow Kit from a simple setup tool into a comprehensive development best practices platform.

### Added

#### Component-First Development

- **Atomic Design Guidelines**: Comprehensive component hierarchy structure (atoms, molecules, organisms, templates, pages)
- **Composition Patterns**: Best practices for building reusable components through composition
- **Smart Extraction Rules**: Guidelines on when to extract components vs. keeping them local
- **TypeScript Patterns**: Type-safe component patterns with prop definitions and JSDoc documentation
- **Component Documentation**: Standards for documenting reusable components

#### Performance Optimization

- **Lazy Loading Strategies**: Route-based and component-based code splitting guidelines
- **Image Optimization**: WebP format, responsive images, lazy loading best practices
- **Bundle Optimization**: Tree shaking, code splitting, and vendor chunk strategies
- **Core Web Vitals**: Detailed guidelines for LCP, FID, and CLS optimization
- **Resource Hints**: Preconnect, prefetch, and preload implementation patterns
- **Critical CSS**: Above-the-fold optimization strategies
- **Font Optimization**: System fonts with web font fallback patterns
- **Caching Strategies**: Browser cache, service workers, and CDN implementation

#### SEO Excellence

- **Semantic HTML**: Proper HTML5 structure for better accessibility and SEO
- **Meta Tags System**: Comprehensive templates for Open Graph, Twitter Cards, and meta descriptions
- **Structured Data**: Schema.org implementation guidelines for rich snippets
- **Image SEO**: Alt text best practices, dimensions, and lazy loading for images
- **URL Structure**: SEO-friendly URL pattern guidelines
- **Sitemap & Robots**: Automated generation templates and best practices

#### DRY Principle Enforcement

- **Code Duplication Detection**: Guidelines for identifying and eliminating repeated code
- **Utility Function Patterns**: Best practices for extracting common logic
- **Custom Hooks**: Patterns for creating reusable React hooks
- **Extraction Thresholds**: When to extract (3+ similar blocks rule)
- **Shared Component Library**: Patterns for building reusable component libraries

#### GitHub Project Management

- **Flexible Project Setup**: Choose between creating new GitHub Projects or connecting to existing ones
- **Interactive Project Creation**: Guided workflow for setting up new projects with proper structure
- **Pre-configured Columns**: Automatic setup of LEO workflow columns (Backlog, Ready, In Progress, Review, Done)
- **Custom Fields**: Automatic Priority and Component field creation for new projects
- **Smart Detection**: Automatic detection of organization vs. personal repositories

#### Enhanced Copilot Instructions

- **Component-First Principles**: Embedded best practices for component architecture
- **Performance Guidelines**: Comprehensive performance optimization instructions
- **SEO Best Practices**: Built-in SEO optimization guidelines
- **Accessibility Standards**: WCAG 2.1 AA compliance guidelines
- **Code Quality Rules**: Testing, error handling, and security best practices

### Changed

- **Version**: Bumped to 2.0.0 to reflect major feature additions
- **Package Description**: Updated to highlight new component-first and optimization features
- **Init Flow**: Enhanced `leo init` command with interactive project setup options
- **Project Configuration**: More flexible project setup supporting both new and existing scenarios
- **Keywords**: Added component-first, best-practices, seo-optimization, performance, frontend, code-quality

### Improved

- **User Experience**: Better prompts and guidance during initialization
- **Error Handling**: More descriptive error messages for GitHub API failures
- **Documentation**: Comprehensive documentation of all new features
- **Success Messages**: Enhanced feedback showing exactly what was configured

### Technical Details

- Enhanced `lib/commands/init.js` with project creation and connection logic
- Updated `lib/copilot-instructions-template.js` with 2000+ lines of best practices
- Improved project detection and organization handling
- Added support for creating custom fields in GitHub Projects

## [1.3.0] - 2025-10-15

### Added

- Initial release of LEO Workflow Kit
- Core CLI framework with 4 main commands
- 8 professional issue templates
- 22+ GitHub labels configuration
- VS Code Copilot integration
- Documentation structure with specs folder
- Spec-driven development workflow

### Features

- `leo init` - Initialize workflow in current project
- `leo issue` - Create issues from templates
- `leo labels` - Manage GitHub labels
- `leo vscode` - Configure VS Code settings
- `leo status` - Check workflow status
- `leo docs` - Open documentation

---

## Migration Guide: 1.x to 2.0

If you're upgrading from version 1.x:

1. **No Breaking Changes**: Version 2.0 is fully backward compatible
2. **New Features**: Simply run `leo init` in existing projects to get new Copilot instructions
3. **Project Setup**: New projects can now choose between creating or connecting to GitHub Projects
4. **Best Practices**: All new best practices are embedded in Copilot instructions automatically

### To Update Existing Projects

```bash
# Update to latest version
npm install -g leo-workflow-kit@latest

# Re-run init to update Copilot instructions (optional)
cd your-project
leo vscode --project
```

Your existing setup will remain intact, and new best practices will be available through updated Copilot instructions.

---

## Support

For issues, questions, or suggestions:

- GitHub Issues: https://github.com/leonpagotto/leo-kit/issues
- Documentation: https://github.com/leonpagotto/leo-kit#readme
````
