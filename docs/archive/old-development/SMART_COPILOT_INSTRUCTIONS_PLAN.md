# Smart Project-Type Based Copilot Instructions - Implementation Plan

**Issue**: #8
**Date**: October 19, 2025
**Status**: In Progress

---

## 🎯 Goal

Create a smart system that generates customized Copilot instructions based on project type, reducing noise and improving focus for developers.

---

## ✅ Phase 1: Foundation (COMPLETE)

### Created Files

- ✅ `lib/copilot-instructions/config.js` - Project types and section definitions
- ✅ `lib/copilot-instructions/builder.js` - Smart builder that assembles sections
- ✅ `lib/copilot-instructions/index.js` - Main API

### Project Types Defined

1. ✅ **Full Stack** (~1,200 lines) - Everything
2. ✅ **Frontend** (~900 lines) - UI, Components, SEO
3. ✅ **Backend** (~600 lines) - API, Testing, Security
4. ✅ **CLI** (~400 lines) - CLI patterns, focused
5. ✅ **Mobile** (~800 lines) - Mobile patterns, no SEO
6. ✅ **Library** (~500 lines) - API design, versioning

### Sections Defined

- ✅ 15 sections identified with metadata
- ✅ Auto-detection rules from package.json
- ✅ Validation functions
- ✅ Dynamic TOC and quick reference builders

---

## 🔨 Phase 2: Extract Sections from Template (NEXT)

### Task: Modularize Existing Template

Break `lib/copilot-instructions-template.js` into separate section files in `lib/copilot-instructions/sections/`:

#### 1. Core Workflow (ALWAYS included)

**File**: `core-workflow.js`
**Content**:

- 🚨 CRITICAL: Automatic Issue Creation
- Mandatory workflow
- Detection patterns
- Spec-first development decision tree
- Creating specs vs direct issues
- Automatic status updates
- GitHub Projects integration

**Lines**: ~350 (from template lines 1-350)

#### 2. UX Principles

**File**: `ux-principles.js`
**Content**:

- User Experience First
- Audience Awareness
- Complete Solutions

**Lines**: ~50 (from template lines 430-480)

#### 3. UI Development

**File**: `ui-development.js`
**Content**:

- Design Consistency
- Accessibility (WCAG 2.1 AA)
- Responsive Design
- Code Quality

**Lines**: ~100 (from template lines 490-590)

#### 4. Component-First

**File**: `component-first.js`
**Content**:

- Component Philosophy
- Atomic Design Hierarchy
- Component Composition Rules
- Naming Conventions
- Props Design
- Component Documentation
- DRY Principle (examples)
- Utility Functions
- Custom Hooks

**Lines**: ~200 (from template lines 520-720)

#### 5. SEO Optimization

**File**: `seo-optimization.js`
**Content**:

- HTML Semantic Structure
- Meta Tags (OG, Twitter)
- Image Optimization
- Performance (Core Web Vitals)
- Lazy Loading
- Code Splitting
- Resource Hints
- Font Optimization
- Critical CSS
- Structured Data
- URL Structure
- Sitemap & Robots.txt

**Lines**: ~300 (from template lines 720-1020)

#### 6. Backend API (NEW - to be written)

**File**: `backend-api.js`
**Content**:

- API Design Principles (REST, GraphQL)
- Request/Response Patterns
- Error Handling
- Rate Limiting
- Caching Strategies
- Database Query Optimization
- Background Jobs
- Webhooks

**Lines**: ~150 (new content)

#### 7. API Design (for libraries)

**File**: `api-design.js`
**Content**:

- Public API Design
- Function Signatures
- TypeScript Types
- JSDoc Documentation
- Breaking Changes
- Deprecation Strategy

**Lines**: ~100 (new content)

#### 8. CLI Patterns (NEW - to be written)

**File**: `cli-patterns.js`
**Content**:

- Command Structure
- Argument Parsing
- Interactive Prompts
- Progress Indicators
- Error Messages
- Help Text
- Exit Codes
- Colors and Formatting

**Lines**: ~80 (new content, can reference our own CLI)

#### 9. Mobile Patterns (NEW - to be written)

**File**: `mobile-patterns.js`
**Content**:

- Touch Interactions (44x44px targets)
- Gestures
- Performance Optimization
- Offline Support
- Push Notifications
- Deep Linking
- Platform-Specific Guidelines (iOS/Android)

**Lines**: ~100 (new content)

#### 10. Documentation Organization

**File**: `documentation.js`
**Content**:

- docs/ folder structure
- Where to place files
- Markdown standards
- API documentation
- README best practices

**Lines**: ~80 (from template + existing docs standards)

#### 11. Versioning (for libraries)

**File**: `versioning.js`
**Content**:

- Semantic Versioning
- Changelog Standards
- Release Process
- Git Tags
- NPM Publishing

**Lines**: ~60 (new content)

#### 12. Testing

**File**: `testing.js`
**Content**:

- Testing Requirements
- Unit Tests
- Integration Tests
- E2E Tests
- Component Tests
- Coverage Guidelines

**Lines**: ~80 (from template lines 960-1040)

#### 13. Security

**File**: `security.js`
**Content**:

- Authentication & Authorization
- Input Validation
- SQL Injection Prevention
- XSS Protection
- CSRF Protection
- Secret Management
- HTTPS/TLS
- Rate Limiting

**Lines**: ~80 (from template + expanded)

#### 14. Git Workflow

**File**: `git-workflow.js`
**Content**:

- Commit Messages (Conventional Commits)
- Pull Request Guidelines
- Branching Strategy
- Code Review Best Practices
- Continuous Improvement
- Refactoring

**Lines**: ~120 (from template lines 1020-1140)

#### 15. Team Collaboration

**File**: `team-collaboration.js`
**Content**:

- Working with Designers
- Working with Product Managers
- Working with Developers
- Decision Making
- Communication

**Lines**: ~60 (from template lines 1065-1125)

---

## 🔧 Phase 3: Update `leo init` Command

### Add Project Type Selection

Update `lib/commands/init.js` to prompt for project type:

\`\`\`javascript
const { getProjectTypes } = require('../copilot-instructions');

// Add to prompts
const projectTypeQuestion = {
type: 'list',
name: 'projectType',
message: 'What type of project is this?',
choices: getProjectTypes().map(pt => ({
name: \`\${pt.name} - \${pt.description}\`,
value: pt.value,
short: pt.name
})),
default: 'fullstack',
when: !options.nonInteractive
};
\`\`\`

### Auto-Detection

\`\`\`javascript
const fs = require('fs');
const { detectProjectType } = require('../copilot-instructions');

// Try to detect from package.json
let suggestedType = 'fullstack';
if (fs.existsSync('package.json')) {
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const detected = detectProjectType(pkg);
if (detected) {
suggestedType = detected;
console.log(\`📊 Detected project type: \${PROJECT_TYPES[detected].name}\`);
}
}
\`\`\`

### Generate Instructions

\`\`\`javascript
const { generate } = require('../copilot-instructions');

// Generate instructions based on project type
const instructions = generate({
projectType: answers.projectType || suggestedType,
packageJson: pkg,
autoDetect: true
});

// Write to .github/copilot-instructions.md
fs.writeFileSync('.github/copilot-instructions.md', instructions);
\`\`\`

### Save Configuration

\`\`\`javascript
// Save to .leorc.json
const leoConfig = {
projectType: answers.projectType,
copilotSections: getSectionsForType(answers.projectType),
initialized: true,
version: '2.5.0'
};

fs.writeFileSync('.leorc.json', JSON.stringify(leoConfig, null, 2));
\`\`\`

---

## 🎛️ Phase 4: Add `leo config` Command

### New Command: `lib/commands/config.js`

\`\`\`javascript
const program = require('commander');
const inquirer = require('inquirer');
const { generate, getProjectTypes, getSections } = require('../copilot-instructions');

program
.command('config')
.description('Configure LEO Kit settings')
.option('--project-type <type>', 'Change project type')
.option('--add-section <section>', 'Add a Copilot instruction section')
.option('--remove-section <section>', 'Remove a Copilot instruction section')
.option('--list-types', 'List available project types')
.option('--list-sections', 'List available sections')
.action(async (options) => {
// Implementation here
});
\`\`\`

### Usage Examples

\`\`\`bash

# Change project type

leo config --project-type frontend

# Add SEO section to backend project

leo config --add-section seo

# Remove UI section

leo config --remove-section ui

# List available types

leo config --list-types

# Interactive configuration

leo config
\`\`\`

---

## 🔄 Phase 5: Add `leo copilot:refresh` Command

### Regenerate Instructions

\`\`\`bash
leo copilot:refresh

# Reads .leorc.json and regenerates .github/copilot-instructions.md

\`\`\`

---

## 📋 Implementation Checklist

### Phase 1: Foundation ✅

- [x] Create config.js with project types and sections
- [x] Create builder.js for assembling instructions
- [x] Create index.js as main API
- [x] Define auto-detection rules
- [x] Commit foundation code

### Phase 2: Extract Sections 🔨

- [ ] Create sections/ directory structure
- [ ] Extract core-workflow.js from template
- [ ] Extract ux-principles.js from template
- [ ] Extract ui-development.js from template
- [ ] Extract component-first.js from template
- [ ] Extract seo-optimization.js from template
- [ ] Write backend-api.js (new content)
- [ ] Write api-design.js (new content)
- [ ] Write cli-patterns.js (new content)
- [ ] Write mobile-patterns.js (new content)
- [ ] Extract documentation.js from template
- [ ] Write versioning.js (new content)
- [ ] Extract testing.js from template
- [ ] Write security.js (expanded from template)
- [ ] Extract git-workflow.js from template
- [ ] Extract team-collaboration.js from template
- [ ] Test each section loads correctly

### Phase 3: Update Init Command

- [ ] Add project type prompt to init.js
- [ ] Implement auto-detection logic
- [ ] Update instruction generation to use new system
- [ ] Save configuration to .leorc.json
- [ ] Test init with each project type
- [ ] Update non-interactive mode handling

### Phase 4: Config Command

- [ ] Create lib/commands/config.js
- [ ] Implement --project-type option
- [ ] Implement --add-section option
- [ ] Implement --remove-section option
- [ ] Implement --list-types option
- [ ] Implement --list-sections option
- [ ] Add interactive mode
- [ ] Test all options

### Phase 5: Copilot Refresh Command

- [ ] Create lib/commands/copilot.js
- [ ] Implement refresh subcommand
- [ ] Read .leorc.json configuration
- [ ] Regenerate instructions
- [ ] Confirm to user

### Phase 6: Documentation

- [ ] Update README.md with new features
- [ ] Create docs/guides/PROJECT_TYPES.md
- [ ] Update AUTO_INITIALIZATION.md
- [ ] Add examples for each project type
- [ ] Document leo config command
- [ ] Add migration guide from v2.4.0

### Phase 7: Testing

- [ ] Test fullstack project type
- [ ] Test frontend project type
- [ ] Test backend project type
- [ ] Test cli project type
- [ ] Test mobile project type
- [ ] Test library project type
- [ ] Test auto-detection
- [ ] Test config command
- [ ] Test backward compatibility
- [ ] Test non-interactive mode

---

## 🎯 Success Metrics

- ✅ All 6 project types generate correct instructions
- ✅ File sizes match estimates (±10%)
- ✅ Auto-detection works for common frameworks
- ✅ Configuration persists in .leorc.json
- ✅ Backward compatible (defaults to fullstack)
- ✅ No breaking changes to existing installs
- ✅ Documentation complete and clear
- ✅ All tests passing

---

## 📦 Release Plan

### v2.5.0 Features

- ✅ Auto-initialization (already complete)
- 🔨 Smart project-type based Copilot instructions
- ✅ Optimized template organization

### Release Checklist

- [ ] Complete all implementation phases
- [ ] Update CHANGELOG.md
- [ ] Update package.json version
- [ ] Run full test suite
- [ ] Publish to npm
- [ ] Create GitHub release
- [ ] Announce on social media

---

## 🚀 Future Enhancements (v2.6.0+)

- Framework-specific sections (Next.js, NestJS, Remix, etc.)
- Language-specific patterns (TypeScript strict mode, Python, Go)
- Team size configurations (solo developer vs team)
- Industry-specific standards (healthcare HIPAA, finance PCI-DSS)
- Custom section templates (allow users to create own sections)
- VS Code extension for easier configuration
- Web UI for configuring project type

---

**Current Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🔨
