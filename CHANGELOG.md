# Changelog

All notable changes to LEO Workflow Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
