# LEO Kit 5.0.0 - Complete User Guide

**Version:** 5.0.0  
**Released:** October 25, 2025  
**Status:** Production Ready ✅

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Specification System](#specification-system)
5. [AI Code Generation](#ai-code-generation)
6. [CLI Commands](#cli-commands)
7. [REST API](#rest-api)
8. [Plugin System](#plugin-system)
9. [Workflows](#workflows)
10. [Examples](#examples)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)

---

## Introduction

### What is LEO Kit?

LEO Kit is an **enterprise-grade CLI framework** for building scalable, automated development workflows with **AI-powered code generation**. It combines:

- **REST API** with WebSocket real-time events
- **CLI Commands** for powerful automation
- **Plugin System** for infinite extensibility
- **Specification-Driven Development** for structured workflows
- **Claude 3.5 Sonnet AI** for automatic code generation
- **Constitutional Governance** for team alignment

### Why LEO Kit?

✅ **Reduce Manual Work** - Generate code from specifications  
✅ **Automated Workflows** - CI/CD-ready development pipeline  
✅ **AI-Powered** - Claude 3.5 Sonnet integration for smart generation  
✅ **Extensible** - Plugin architecture for custom needs  
✅ **Team-Ready** - Constitutional governance for alignment  
✅ **Production-Grade** - 49/49 tests passing (100%)

### Perfect For

- Teams building automated workflows
- Projects requiring specification-first development
- Organizations wanting AI-assisted code generation
- Multi-tool coordination needs
- Enterprise governance requirements

---

## Getting Started

### Installation

**Prerequisites:**
- Node.js 16+ installed
- npm or yarn package manager
- Basic command-line knowledge

**Install LEO Kit:**

```bash
npm install @leo/kit
```

Or install locally for development:

```bash
git clone https://github.com/leonpagotto/leo-kit.git
cd leo-kit
npm install
npm link
```

### First Command

After installation, verify everything works:

```bash
leo spec init my-first-feature
```

You should see:
```
✅ Specification initialized for my-first-feature
📁 Project structure created:
   - constitution.md
   - specification.md
   - plan.md
   - tasks.md
```

### Your First Workflow (5 Minutes)

#### Step 1: Initialize a Project
```bash
leo spec init user-auth
```

#### Step 2: Define the Constitution (Team Values)
```bash
leo spec constitution
```
Edit the constitution.md file with your team's principles.

#### Step 3: Write the Specification
```bash
leo spec specify
```
Describe what you want to build in specification.md.

#### Step 4: Generate a Plan
```bash
leo spec plan
```
LEO Kit analyzes your spec and creates a structured plan.

#### Step 5: Generate Code
```bash
leo spec implement
```
Claude 3.5 Sonnet AI generates code from your specification!

```
🚀 Implementing specification...
✨ Generating code with Claude 3.5 Sonnet...

Generated Files:
  ✅ src/auth/models/user.js (180 lines)
  ✅ src/auth/services/auth.service.js (220 lines)
  ✅ src/auth/routes/auth.routes.js (150 lines)
  ✅ tests/auth.test.js (180 lines)

📂 All files in: .leo/generated/
```

---

## Core Features

### 1. REST API Server

LEO Kit includes a powerful REST API with 12 endpoints and WebSocket support:

**Starting the Server:**
```bash
leo dashboard start
```

**Key Features:**
- Express.js-based HTTP API
- WebSocket real-time events
- CORS support
- Error handling
- Request logging
- Response formatting

**Example API Call:**
```bash
curl http://localhost:3000/api/specs
```

### 2. CLI Commands

Full suite of commands for complete workflow management:

**Specification Commands:**
```bash
leo spec init <name>              # Initialize new specification
leo spec constitution             # Define team principles
leo spec specify                  # Write specification
leo spec plan                      # Generate implementation plan
leo spec tasks                     # View tasks
leo spec analyze                   # Check consistency
leo spec implement                 # Generate code with AI
leo spec status                    # Show progress
```

**Dashboard Commands:**
```bash
leo dashboard start                # Start API server
leo dashboard stop                 # Stop server
leo dashboard status               # Check status
leo dashboard open                 # Open in browser
leo dashboard docs                 # View API docs
```

**Plugin Commands:**
```bash
leo plugin create <name>           # Create plugin
leo plugin list                    # List plugins
leo plugin info <name>             # Plugin details
leo plugin install <name>          # Install plugin
leo plugin start <name>            # Start plugin
leo plugin stop <name>             # Stop plugin
leo plugin uninstall <name>        # Remove plugin
```

### 3. Plugin System

Extensible plugin architecture for custom functionality:

**Built-in Plugins:**
- Web Dashboard - Visual project management
- VS Code Extension - Editor integration
- CLI Tools - Command extensions

**Creating a Plugin:**
```bash
leo plugin create my-plugin
```

**Plugin Structure:**
```
my-plugin/
├── index.js                    # Main plugin file
├── package.json                # Plugin metadata
├── config.json                 # Configuration
├── lib/
│   ├── models.js              # Data models
│   ├── services.js            # Business logic
│   └── routes.js              # API endpoints
└── README.md                   # Documentation
```

**Example Plugin:**
```javascript
// my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  
  async init(leo) {
    // Initialize plugin
    console.log('Plugin loaded!');
  },
  
  async execute(command, args) {
    // Handle commands
    return { success: true };
  },
  
  getMetadata() {
    return {
      description: 'My custom plugin',
      commands: ['do-something']
    };
  }
};
```

### 4. Specification System

Structure-driven development with multiple document types:

#### Constitution (Team Principles)
```markdown
# Constitution

## Our Principles
1. Code Quality - Maintainable and well-tested
2. User-First - Prioritize user experience
3. Transparency - Document decisions
4. Automation - Reduce manual work
```

#### Specification (What to Build)
```markdown
# User Authentication System

## Overview
Build secure user authentication with email/password.

## Requirements
- User registration and login
- JWT-based sessions
- Password hashing
- Email verification

## Acceptance Criteria
- All 20 tests passing
- 95%+ test coverage
- Load 1000 users/sec
```

#### Plan (How to Build It)
```markdown
# Implementation Plan

## Phase 1: Models (Day 1)
- User model with validation
- Session model
- Password hashing utilities

## Phase 2: API (Day 2)
- Registration endpoint
- Login endpoint
- Logout endpoint

## Phase 3: Testing (Day 3)
- Unit tests (100% coverage)
- Integration tests
- E2E tests
```

#### Tasks (What to Do)
Auto-generated from specification:
```
[ ] Create user model
[ ] Add password hashing
[ ] Build registration endpoint
[ ] Write validation tests
[ ] Implement JWT tokens
[ ] Add email verification
[ ] Write integration tests
```

### 5. AI Code Generation

Powered by Claude 3.5 Sonnet, automatically generate production code:

**How It Works:**
1. Write specification in Markdown
2. LEO Kit parses requirements
3. Constructs detailed prompt for Claude
4. Claude generates implementation code
5. Code saved to `.leo/generated/`
6. Ready for review and deployment

**Example Generated Code:**

**From Specification:**
```markdown
# User Auth Service

Build a service that:
- Validates email format
- Hashes passwords with bcrypt
- Generates JWT tokens
- Stores sessions in memory
- Returns user with token on login
```

**Generated Output:**
```javascript
// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.sessions = new Map();
    this.users = new Map();
  }

  async register(email, password) {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now(),
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    this.users.set(email, user);
    return { id: user.id, email: user.email };
  }

  async login(email, password) {
    const user = this.users.get(email);
    if (!user) throw new Error('User not found');
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'secret-key',
      { expiresIn: '24h' }
    );
    
    this.sessions.set(token, user);
    return { token, user: { id: user.id, email: user.email } };
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

module.exports = AuthService;
```

**Configuration:**
Set your API key to enable AI code generation:

```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

Without an API key, LEO Kit provides quality code templates.

---

## Specification System

### Understanding the 4-Document Workflow

LEO Kit's specification system uses four interconnected documents:

```
Constitution (Principles)
    ↓
Specification (Requirements)
    ↓
Plan (Steps)
    ↓
Tasks (Actions)
```

### Constitution: Team Alignment

Defines your team's core principles:

**Template:**
```markdown
# Constitution

## Mission
What are we trying to accomplish?

## Core Principles
1. First principle
2. Second principle
3. Third principle

## Team Values
- Value 1
- Value 2
- Value 3

## Quality Standards
- Code coverage: 85%+
- Documentation: Required
- Tests: Required for new code

## Decision-Making Process
How do we make decisions?

## Conflict Resolution
How do we resolve disagreements?
```

**Best Practice:**
- Keep constitution stable (rarely changes)
- Reference in specification decisions
- Use for design reviews
- Share with entire team

### Specification: Clear Requirements

Describes exactly what to build:

**Template:**
```markdown
# Feature Name

## Overview
One-paragraph summary of the feature.

## Problem Statement
What problem does this solve?

## Goals
- Goal 1
- Goal 2
- Goal 3

## Requirements
### Functional
- Requirement 1
- Requirement 2
- Requirement 3

### Non-Functional
- Performance: X requests/sec
- Scalability: Support Y users
- Availability: 99.9% uptime

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Constraints
- Technical limitations
- Timeline constraints
- Budget constraints

## Out of Scope
What are we NOT building?
```

**Best Practice:**
- Be specific and measurable
- Include examples
- Define success clearly
- Get team buy-in before coding

### Plan: Implementation Strategy

Outlines how to build it:

**Template:**
```markdown
# Implementation Plan

## Architecture Overview
High-level system design diagram.

## Technology Stack
- Backend: Node.js + Express
- Database: PostgreSQL
- Frontend: React

## Phases

### Phase 1: Foundation (Days 1-2)
- Task 1
- Task 2
- Deliverable: X

### Phase 2: Core (Days 3-5)
- Task 1
- Task 2
- Deliverable: Y

### Phase 3: Polish (Days 6-7)
- Task 1
- Task 2
- Deliverable: Z

## Dependencies
- External service X
- Third-party library Y

## Risk Mitigation
- Risk 1: Mitigation strategy
- Risk 2: Mitigation strategy

## Success Metrics
- Metric 1: Expected value
- Metric 2: Expected value
```

**Best Practice:**
- Break into phases
- Identify dependencies
- Plan for risks
- Estimate timeline

### Tasks: Actionable Items

Auto-generated task list:

```bash
leo spec tasks
```

**Output:**
```
Generated Tasks (20 total):

Phase 1: Setup (4 tasks)
  [ ] Install dependencies
  [ ] Setup database
  [ ] Configure environment
  [ ] Create project structure

Phase 2: Core (12 tasks)
  [ ] Build user model
  [ ] Create auth service
  [ ] Add login endpoint
  [ ] Add register endpoint
  ...

Phase 3: Testing (4 tasks)
  [ ] Write unit tests
  [ ] Write integration tests
  [ ] Test error handling
  [ ] Verify with 100 users
```

---

## AI Code Generation

### Setup

**Step 1: Get API Key**

Visit [Anthropic Console](https://console.anthropic.com) to get your API key.

**Step 2: Configure**

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Or in `.env`:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

**Step 3: Verify**

```bash
leo spec init test-project
leo spec implement
```

### Code Generation Process

**When you run `leo spec implement`:**

1. **Parse Specification** - Reads specification.md
2. **Extract Requirements** - Identifies key requirements
3. **Build Prompt** - Constructs detailed prompt for Claude
4. **Call Claude API** - Sends prompt to Claude 3.5 Sonnet
5. **Parse Response** - Extracts generated code
6. **Validate** - Checks code quality
7. **Save Files** - Writes to `.leo/generated/`
8. **Report** - Shows what was generated

**Example Prompt (Generated Internally):**

```
You are an expert code generator for a Node.js project.

Based on this specification:
[specification content]

And this plan:
[plan content]

Generate production-ready code with:
- Clear variable names
- Error handling
- Input validation
- Comprehensive comments
- Best practices

Return code as a JSON object with filenames and content.
```

### Generated Output Structure

```
.leo/generated/
├── src/
│   ├── models/
│   │   └── User.js
│   ├── services/
│   │   └── AuthService.js
│   ├── routes/
│   │   └── auth.routes.js
│   └── middleware/
│       └── auth.middleware.js
├── tests/
│   ├── models/
│   │   └── User.test.js
│   ├── services/
│   │   └── AuthService.test.js
│   └── routes/
│       └── auth.routes.test.js
├── package.json
└── README.md
```

### Quality Assurance

LEO Kit validates generated code:

✅ **Syntax Validation** - No syntax errors  
✅ **Import Checks** - All imports resolvable  
✅ **Test Coverage** - Tests included  
✅ **Documentation** - Comments present  
✅ **Best Practices** - Follows conventions  

If issues detected:
```
⚠️ Generated code review:
  - Missing error handling in line 45
  - Consider adding input validation
  - Add JSDoc comments to exports

Run `leo spec implement --fix` to auto-correct
```

---

## CLI Commands Reference

### Spec Commands

#### `leo spec init <name>`
Initialize a new specification project.

```bash
leo spec init user-dashboard

# Creates:
# user-dashboard/
# ├── constitution.md
# ├── specification.md
# ├── plan.md
# └── tasks.md
```

#### `leo spec constitution`
Create/edit team constitution.

```bash
leo spec constitution

# Opens editor for constitution.md
# Define team principles and values
```

#### `leo spec specify`
Write the specification.

```bash
leo spec specify

# Opens editor for specification.md
# Describe requirements in detail
```

#### `leo spec plan`
Generate implementation plan from specification.

```bash
leo spec plan

# Analyzes specification.md
# Creates plan.md with implementation strategy
# Generates phase breakdown
```

#### `leo spec tasks`
View auto-generated task list.

```bash
leo spec tasks

# Shows all generated tasks
# Organized by phase
# Includes subtasks

Output:
Generate Tasks (45 total):
  Phase 1: Setup (5 tasks)
    [ ] Install dependencies
    [ ] Setup database
    ...
```

#### `leo spec analyze`
Check specification consistency.

```bash
leo spec analyze

# Validates all 4 documents
# Checks for gaps/conflicts
# Suggests improvements

✅ Constitution: Valid
✅ Specification: Valid (12 requirements)
⚠️ Plan: 1 missing phase
✅ Tasks: 45 tasks generated
```

#### `leo spec implement`
Generate code using Claude AI.

```bash
leo spec implement

# Analyzes specification
# Calls Claude 3.5 Sonnet
# Generates code files
# Saves to .leo/generated/

🚀 Implementing specification...
✨ Generating with Claude 3.5 Sonnet...
✅ Generated 12 files (2,450 lines)
```

#### `leo spec status`
Show specification progress.

```bash
leo spec status

Output:
Specification Status: my-feature
├─ Constitution:  ✅ Complete (100%)
├─ Specification: ✅ Complete (100%)
├─ Plan:          ✅ Complete (100%)
├─ Tasks:         ✅ 45 tasks (0% done)
└─ Overall:       ✅ 75% complete
```

### Dashboard Commands

#### `leo dashboard start`
Start the API server.

```bash
leo dashboard start

# Starting dashboard server...
# Listening on http://localhost:3000
# WebSocket ready on ws://localhost:3000
# Press Ctrl+C to stop
```

#### `leo dashboard stop`
Stop the running server.

```bash
leo dashboard stop

# Stopping server...
# ✅ Server stopped
```

#### `leo dashboard status`
Check server status.

```bash
leo dashboard status

# Server Status:
# ├─ Status:    Running
# ├─ Port:      3000
# ├─ Uptime:    45 minutes
# └─ Connections: 3 active
```

#### `leo dashboard open`
Open dashboard in browser.

```bash
leo dashboard open

# Opens http://localhost:3000 in default browser
```

#### `leo dashboard docs`
Show API documentation.

```bash
leo dashboard docs

# Displays OpenAPI 3.0 specification
# Lists all 12 endpoints
# Shows WebSocket events
```

### Plugin Commands

#### `leo plugin create <name>`
Create a new plugin.

```bash
leo plugin create my-analyzer

# Created plugin structure
# my-analyzer/
# ├── index.js
# ├── package.json
# ├── config.json
# └── README.md
```

#### `leo plugin list`
List all installed plugins.

```bash
leo plugin list

# Installed Plugins:
# ├─ web-dashboard (v1.0.0) - Visual project management
# ├─ vscode-extension (v1.0.0) - VS Code integration
# └─ my-analyzer (v1.0.0) - Code analysis [custom]
```

#### `leo plugin info <name>`
Show plugin details.

```bash
leo plugin info web-dashboard

# Plugin: web-dashboard
# ├─ Version:     1.0.0
# ├─ Status:      Running
# ├─ Port:        3001
# ├─ Commands:    dashboard, widgets
# └─ Description: Visual project management interface
```

#### `leo plugin start <name>`
Start a plugin.

```bash
leo plugin start web-dashboard

# Starting plugin: web-dashboard
# ✅ Plugin started on port 3001
```

#### `leo plugin stop <name>`
Stop a plugin.

```bash
leo plugin stop web-dashboard

# Stopping plugin: web-dashboard
# ✅ Plugin stopped
```

#### `leo plugin uninstall <name>`
Remove a plugin.

```bash
leo plugin uninstall my-analyzer

# Removing plugin: my-analyzer
# ✅ Plugin uninstalled
```

---

## REST API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
None required for development. Configure in production.

### Endpoints

#### Specifications

**GET /specs**
List all specifications.

```bash
curl http://localhost:3000/api/specs
```

Response:
```json
{
  "specs": [
    { "name": "user-auth", "status": "planning" },
    { "name": "dashboard", "status": "generated" }
  ]
}
```

**POST /specs**
Create new specification.

```bash
curl -X POST http://localhost:3000/api/specs \
  -H "Content-Type: application/json" \
  -d '{"name":"new-feature"}'
```

**GET /specs/:name**
Get specification details.

```bash
curl http://localhost:3000/api/specs/user-auth
```

#### Code Generation

**POST /specs/:name/generate**
Generate code for specification.

```bash
curl -X POST http://localhost:3000/api/specs/user-auth/generate
```

Response:
```json
{
  "status": "success",
  "files": [
    "src/auth/models/User.js",
    "src/auth/services/AuthService.js"
  ],
  "lineCount": 450
}
```

#### Tasks

**GET /specs/:name/tasks**
Get task list.

```bash
curl http://localhost:3000/api/specs/user-auth/tasks
```

Response:
```json
{
  "tasks": [
    { "id": 1, "title": "Create user model", "completed": false },
    { "id": 2, "title": "Add password hashing", "completed": true }
  ]
}
```

**POST /specs/:name/tasks/:id/complete**
Mark task as complete.

```bash
curl -X POST http://localhost:3000/api/specs/user-auth/tasks/1/complete
```

### WebSocket Events

Connect to `ws://localhost:3000`:

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
});
```

**Events:**

- `specification:updated` - Specification changed
- `code:generated` - Code generation complete
- `task:completed` - Task marked complete
- `error:occurred` - Error in system

---

## Plugin System

### Creating a Plugin

**Generate plugin scaffold:**
```bash
leo plugin create my-plugin
```

**Plugin structure:**
```javascript
// my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  
  // Required: Initialize plugin
  async init(leo) {
    console.log('Plugin initialized');
    
    // Register commands
    leo.commands.register('my-command', this.myCommand.bind(this));
    
    // Listen to events
    leo.on('code:generated', (data) => {
      console.log('Code generated:', data);
    });
  },
  
  // Required: Provide metadata
  getMetadata() {
    return {
      description: 'My custom plugin',
      version: '1.0.0',
      commands: ['my-command'],
      events: ['my-event']
    };
  },
  
  // Custom command implementation
  async myCommand(args) {
    return { success: true, message: 'Done!' };
  }
};
```

### Publishing a Plugin

1. **Create package.json:**
```json
{
  "name": "@leo/plugin-myname",
  "version": "1.0.0",
  "type": "module",
  "leo": {
    "plugin": true
  }
}
```

2. **Publish to npm:**
```bash
npm publish
```

3. **Install in LEO Kit:**
```bash
leo plugin install @leo/plugin-myname
```

---

## Workflows

### Workflow 1: Build a New API Endpoint

**Time:** 30 minutes

**Steps:**

1. Initialize specification
```bash
leo spec init user-profiles-api
```

2. Write specification
```bash
leo spec specify
```
Content:
```markdown
# User Profiles API

Build RESTful API to manage user profiles with CRUD operations.

## Requirements
- GET /profiles - List all profiles
- GET /profiles/:id - Get single profile
- POST /profiles - Create new profile
- PUT /profiles/:id - Update profile
- DELETE /profiles/:id - Delete profile

## Validation
- Email must be valid format
- Name must be 2-50 characters
- Phone optional but valid if provided

## Authentication
- No auth for MVP
- Add token validation later

## Response Format
All endpoints return JSON with structure:
```

3. Create plan
```bash
leo spec plan
```

4. Generate code
```bash
leo spec implement
```

5. Review generated code in `.leo/generated/`

6. Copy to project
```bash
cp -r .leo/generated/src/* src/
cp -r .leo/generated/tests/* tests/
```

7. Install dependencies
```bash
npm install
```

8. Run tests
```bash
npm test
```

9. Start server
```bash
leo dashboard start
```

10. Test endpoints
```bash
curl http://localhost:3000/api/profiles
```

### Workflow 2: Document a Complex Feature

**Time:** 1 hour

**Steps:**

1. Create constitutional alignment
```bash
leo spec constitution
```
Ensure feature aligns with team values.

2. Write detailed specification
```bash
leo spec specify
```
Include examples, edge cases, constraints.

3. Generate plan
```bash
leo spec plan
```

4. Review generated plan
```bash
leo spec status
```

5. Adjust as needed
```bash
leo spec specify  # Update if needed
leo spec plan     # Regenerate
```

6. Share with team
- Review specification.md
- Review plan.md
- Get feedback before coding

7. Generate code
```bash
leo spec implement
```

8. Team review
- Check generated code quality
- Ensure it meets constitution
- Approve before merge

### Workflow 3: Refactor Existing Code

**Time:** 2-4 hours

**Steps:**

1. Document current behavior
```bash
leo spec init refactor-auth
leo spec specify
```
Describe what needs to change and why.

2. Create migration plan
```bash
leo spec plan
```
Include breaking changes, migration path.

3. Generate new code
```bash
leo spec implement
```

4. Write migration guide
```markdown
# Migration Guide

## Breaking Changes
- Changed parameter X to Y
- Removed deprecated method Z

## Migration Steps
1. Update calls from X to Y
2. Remove calls to Z
3. Run tests
```

5. Update tests
```bash
npm test
```

6. Gradual rollout
- Deploy with feature flag
- Monitor for issues
- Disable flag if needed

---

## Examples

### Example 1: Simple CRUD API

**Specification:**
```markdown
# Blog Posts API

Create REST API for managing blog posts.

## Endpoints
- GET /posts - List posts (paginated)
- GET /posts/:id - Get single post
- POST /posts - Create post
- PUT /posts/:id - Update post
- DELETE /posts/:id - Delete post

## Data Model
- id: UUID
- title: String (required, max 200 chars)
- content: String (required)
- author: String (required)
- createdAt: ISO timestamp
- updatedAt: ISO timestamp

## Validation
- Title must be 10-200 characters
- Content must be at least 100 characters
- Author required

## Response
All responses return JSON with data/error structure:
{
  "success": true,
  "data": {...},
  "timestamp": "2025-10-25T10:00:00Z"
}
```

**Generated Code Example:**
```javascript
// routes/posts.routes.js
const express = require('express');
const router = express.Router();

// GET /posts
router.get('/', (req, res) => {
  // List with pagination
});

// POST /posts
router.post('/', (req, res) => {
  // Validate and create
});

module.exports = router;
```

### Example 2: Multi-Phase Feature

**Specification:**
```markdown
# User Dashboard

Build comprehensive user dashboard with analytics, settings, and notifications.

## Phase 1: Foundation
- User profile display
- Account settings
- Session management

## Phase 2: Analytics
- Activity timeline
- Usage statistics
- Performance metrics

## Phase 3: Notifications
- Real-time notifications
- Notification history
- Preference management

## Acceptance Criteria
- Load in under 2 seconds
- Support 10,000 concurrent users
- 95% test coverage
```

---

## Best Practices

### 1. Start with Constitution

Always begin with team constitutional alignment:

```bash
leo spec constitution
```

Include:
- Mission statement
- Core values
- Quality standards
- Decision-making process

### 2. Be Specific in Specifications

✅ **Good Specification:**
```markdown
# User Authentication

Create authentication system supporting:
- Email/password login
- JWT tokens valid 24 hours
- Refresh tokens valid 30 days
- Password reset via email
- Rate limiting: 5 attempts per minute

## Acceptance Criteria
- Login takes < 500ms
- All edge cases tested
- 100% test coverage
```

❌ **Vague Specification:**
```markdown
# Authentication

Build login system.
```

### 3. Review Generated Code

Always review AI-generated code before using:

```bash
leo spec implement
# Review files in .leo/generated/
# Check for:
# - Correct logic
# - Error handling
# - Test coverage
# - Security issues
# - Performance
```

### 4. Keep Specifications Updated

Maintain specifications as source of truth:

- Update when behavior changes
- Link to issues/PRs
- Document decisions
- Add examples over time

### 5. Test Thoroughly

Generated code includes tests, but verify:

```bash
npm test                    # Run tests
npm run test:coverage       # Check coverage
npm run test:integration    # Integration tests
```

### 6. Use Version Control

Track specification changes:

```bash
git add specification.md plan.md tasks.md
git commit -m "docs(spec): update user auth requirements"
```

### 7. Collaborate Early

Share specifications early in development:

1. Post specification draft
2. Get team feedback
3. Iterate on specification
4. Then generate code

---

## Troubleshooting

### Problem: "API Key not found"

**Solution:**
```bash
# Set API key
export ANTHROPIC_API_KEY=sk-ant-xxxxx

# Verify
echo $ANTHROPIC_API_KEY

# Or in .env file
echo "ANTHROPIC_API_KEY=sk-ant-xxxxx" > .env
```

### Problem: "Specification not found"

**Solution:**
```bash
# Check current directory
pwd

# List specifications
leo spec status

# Initialize if missing
leo spec init my-feature

# Verify files exist
ls -la
```

### Problem: "Claude API timeout"

**Solution:**
- Check internet connection
- API key valid?
- Try again in a minute
- Use mock mode (without API key)

### Problem: "Generated code has errors"

**Solution:**
1. Review generated code
2. Check specification for ambiguity
3. Add more detail to specification
4. Regenerate with improved specification

### Problem: "Tests failing"

**Solution:**
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test
npm test -- test-name

# Check logs
npm test -- --verbose 2>&1 | tail -20
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
leo dashboard start --port 3001

# Or kill process
lsof -ti :3000 | xargs kill -9
```

---

## FAQ

### Q: Do I need an API key?

**A:** No, but code generation works better with one. Set `ANTHROPIC_API_KEY` environment variable for Claude 3.5 Sonnet integration.

### Q: Can I use LEO Kit offline?

**A:** Yes! Core features work offline. Code generation requires internet connection.

### Q: How do I contribute?

**A:** Fork repository, make changes, submit PR. See CONTRIBUTING.md for details.

### Q: Is LEO Kit free?

**A:** Yes! MIT license. Open source. Use commercially.

### Q: Can I extend LEO Kit?

**A:** Yes! Plugin system allows custom functionality. See plugin documentation.

### Q: How do I report bugs?

**A:** Open GitHub issue with reproduction steps.

### Q: What's the performance?

**A:** - REST API: <50ms latency
- Code generation: 3-5 seconds per feature
- CLI commands: <1 second
- WebSocket: Real-time (<100ms)

### Q: Does it work on Windows?

**A:** Yes! Node.js 16+ required. Use PowerShell or Git Bash.

### Q: Can I use my own AI provider?

**A:** Currently Claude 3.5 Sonnet. Plugin system allows custom providers.

### Q: How do I deploy?

**A:** Copy generated code to your project. Deploy like normal Node.js app.

### Q: Is it production-ready?

**A:** Yes! 49/49 tests passing (100%). Enterprise-grade code.

### Q: Can I contribute examples?

**A:** Yes! Submit PR with examples. We'll feature them.

### Q: How do I get support?

**A:** GitHub issues, discussions, or email support@leokit.dev

---

## Next Steps

1. **Install:** `npm install @leo/kit`
2. **Learn:** Read this guide
3. **Try:** `leo spec init my-first-feature`
4. **Build:** `leo spec implement`
5. **Contribute:** Share your specs!

---

**Happy coding! 🚀**

---

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** ✅ Production Ready
