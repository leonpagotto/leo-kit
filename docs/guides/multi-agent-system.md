# Multi-Agent Orchestration System

> **LEO Workflow Kit v4.0.0+**
>
> Intelligent task routing with specialized AI agents

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Agent Types](#agent-types)
5. [Configuration](#configuration)
6. [CLI Commands](#cli-commands)
7. [How Routing Works](#how-routing-works)
8. [Multi-Agent Tasks](#multi-agent-tasks)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)
11. [Migration from v3.x](#migration-from-v3x)

---

## Overview

### What is the Multi-Agent System?

LEO Workflow Kit v4.0.0 introduces an **intelligent orchestration layer** that routes your requests to specialized AI agents based on task type. Instead of a single generic AI assistant, you get experts for frontend, backend, DevOps, testing, and documentation.

### Why Multi-Agent?

**Traditional Approach (v3.x):**

- Single AI assistant handles everything
- Generic instructions for all tasks
- Mixed quality across different domains
- Large instruction files (~500KB+)

**Multi-Agent Approach (v4.0.0+):**

- ✅ Specialized agents with domain expertise
- ✅ Orchestrator routes to the right specialist
- ✅ Higher quality output per domain
- ✅ Modular, maintainable instruction files
- ✅ Enable only what you need

### Key Benefits

1. **Better Quality** - Domain specialists produce better code
2. **Faster Responses** - Smaller, focused instruction sets
3. **Flexibility** - Enable/disable agents as needed
4. **Scalability** - Easy to add new agent types
5. **Clarity** - Clear separation of concerns

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     User Request                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │  Orchestrator Agent    │  ◄── Always Enabled
          │  (Routing Layer)       │
          └───────────┬───────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌────────────┐ ┌──────────────┐
│ Frontend     │ │ Backend    │ │ DevOps       │
│ Agent        │ │ Agent      │ │ Agent        │
└──────────────┘ └────────────┘ └──────────────┘
        ▲             ▲             ▲
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────────┐ ┌────────────────────┐
│ Testing      │ │ Documentation      │
│ Agent        │ │ Agent              │
└──────────────┘ └────────────────────┘
```

### Components

#### 1. Orchestrator Agent (Core)

- **Role**: Routing and coordination
- **Status**: Always enabled (cannot be disabled)
- **Functions**:
  - Analyzes user requests
  - Classifies task type
  - Routes to appropriate specialist(s)
  - Coordinates multi-agent tasks
  - Enforces LEO workflow rules

#### 2. Specialized Agents (Optional)

- **Frontend Agent**: UI/UX, components, styling
- **Backend Agent**: APIs, databases, authentication
- **DevOps Agent**: CI/CD, Docker, deployment
- **Testing Agent**: Unit/integration/E2E tests
- **Documentation Agent**: README, API docs, guides

---

## Getting Started

### 1. Initialize with Agent Selection

When you run `leo init`, you'll be prompted to select agents:

```bash
leo init
```

**You'll see:**

```
? Select project type: (Use arrow keys)
  ❯ fullstack
    frontend-only
    backend-only
    cli-tool
    mobile-app
    library

? Enable specialized agents: (Press <space> to select, <a> to toggle all, <i> to invert)
  ◉ frontend (recommended)
  ◯ backend (recommended)
  ◯ devops
  ◯ testing (recommended)
  ◯ documentation
```

### 2. Enable/Disable Agents Later

Use the `leo agent` command to manage agents after initialization:

```bash
# List all agents and their status
leo agent list

# Enable a specialized agent
leo agent enable frontend

# Disable an agent
leo agent disable devops

# Show agent details
leo agent info backend

# Regenerate AI files with current config
leo agent sync
```

### 3. Verify Configuration

Check your `.leorc.json`:

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

---

## Agent Types

### Orchestrator Agent 🎛️

**Role**: Primary routing and coordination layer

**Responsibilities:**

- Analyze user requests to identify task type
- Route to appropriate specialized agent(s)
- Coordinate multi-agent tasks
- Enforce LEO workflow rules
- Handle cross-cutting concerns

**Status**: Always enabled (core routing layer)

**Routing Logic:**

- Analyzes keywords, file patterns, and user intent
- Routes to single agent for simple tasks
- Coordinates multiple agents for complex tasks

---

### Frontend Agent 🎨

**Role**: UI/UX development specialist

**Expertise:**

- Component-first architecture (atomic design)
- Accessibility (WCAG 2.1 AA compliance)
- Responsive design (mobile-first)
- Performance optimization
- SEO best practices

**Routing Triggers:**

- **Keywords**: component, UI, style, design, responsive, button, form, page, mobile, CSS, theme
- **Files**: `*.jsx`, `*.tsx`, `*.vue`, `*.css`, `*.scss`, `*.styled.js`

**Example Tasks:**

- "Add a login button to the homepage"
- "Make the navbar responsive"
- "Fix button alignment on mobile"
- "Create a card component"
- "Add dark mode support"

**Output Size**: ~13KB of specialized instructions

---

### Backend Agent ⚙️

**Role**: API and server-side specialist

**Expertise:**

- RESTful API design
- Database modeling and optimization
- Authentication & authorization
- Security best practices (OWASP)
- Error handling & validation

**Routing Triggers:**

- **Keywords**: API, endpoint, database, schema, authentication, server, query, model, security
- **Files**: `*.controller.js`, `*.service.js`, `*.model.js`, `*.route.js`, `schema.prisma`

**Example Tasks:**

- "Add OAuth2 authentication"
- "Create a REST API for users"
- "Optimize the search query"
- "Add input validation to signup"
- "Fix database connection issue"

**Output Size**: ~16.5KB of specialized instructions

---

### DevOps Agent 🚀

**Role**: Deployment and infrastructure specialist

**Expertise:**

- CI/CD pipeline configuration
- Docker & Kubernetes
- Infrastructure as Code (Terraform, Pulumi)
- Monitoring & logging
- Deployment strategies

**Routing Triggers:**

- **Keywords**: deploy, CI/CD, Docker, Kubernetes, pipeline, monitoring, container, cloud
- **Files**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/*`, `terraform/*`, `k8s/*`

**Example Tasks:**

- "Deploy to Railway"
- "Add GitHub Actions CI/CD"
- "Containerize the application"
- "Setup monitoring with Sentry"
- "Configure production environment"

**Output Size**: ~14.8KB of specialized instructions

---

### Testing Agent 🧪

**Role**: Quality assurance specialist

**Expertise:**

- Unit testing (AAA pattern)
- Integration testing
- E2E testing (Playwright, Cypress)
- TDD workflow
- Code coverage analysis

**Routing Triggers:**

- **Keywords**: test, testing, unit test, integration test, E2E, coverage, mock, fixture
- **Files**: `*.test.js`, `*.spec.js`, `__tests__/*`, `*.e2e.js`, `cypress/*`

**Example Tasks:**

- "Write unit tests for auth service"
- "Add E2E tests for checkout flow"
- "Increase test coverage to 80%"
- "Mock the external API calls"
- "Test the login functionality"

**Output Size**: ~15.3KB of specialized instructions

---

### Documentation Agent 📚

**Role**: Technical writing specialist

**Expertise:**

- README best practices
- API documentation (JSDoc, OpenAPI)
- User guides & tutorials
- Architecture Decision Records (ADRs)
- Code comments

**Routing Triggers:**

- **Keywords**: docs, documentation, README, API docs, guide, tutorial, comment, explain
- **Files**: `README.md`, `*.md`, `docs/*`, `openapi.yaml`, `swagger.json`

**Example Tasks:**

- "Update the README with installation steps"
- "Document the API endpoints"
- "Write a user guide for authentication"
- "Add JSDoc comments to functions"
- "Explain how the routing works"

**Output Size**: ~16.5KB of specialized instructions

---

## Configuration

### .leorc.json Structure

```json
{
  "project-type": "fullstack",
  "auto-resolve": true,
  "github": {
    "repo": "username/repo-name",
    "org": "organization-name",
    "project-number": 1
  },
  "agents": {
    "frontend": {
      "enabled": true
    },
    "backend": {
      "enabled": true
    },
    "devops": {
      "enabled": false
    },
    "testing": {
      "enabled": true
    },
    "documentation": {
      "enabled": false
    }
  },
  "ai-assistants": {
    "enabled": ["copilot", "cursor", "cline", "codeium"],
    "primary": "copilot"
  }
}
```

### Recommended Configurations

#### Full Stack Project

```json
{
  "project-type": "fullstack",
  "agents": {
    "frontend": { "enabled": true },
    "backend": { "enabled": true },
    "devops": { "enabled": true },
    "testing": { "enabled": true },
    "documentation": { "enabled": true }
  }
}
```

#### Frontend-Only Project

```json
{
  "project-type": "frontend-only",
  "agents": {
    "frontend": { "enabled": true },
    "backend": { "enabled": false },
    "devops": { "enabled": true },
    "testing": { "enabled": true },
    "documentation": { "enabled": true }
  }
}
```

#### CLI Tool

```json
{
  "project-type": "cli-tool",
  "agents": {
    "frontend": { "enabled": false },
    "backend": { "enabled": true },
    "devops": { "enabled": true },
    "testing": { "enabled": true },
    "documentation": { "enabled": true }
  }
}
```

---

## CLI Commands

### `leo agent list`

Show all agents and their status.

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

⚙️   Backend Agent ✓ ENABLED
   APIs, databases, authentication, security, performance

Total: 3 agents enabled
```

---

### `leo agent enable <agent>`

Enable a specialized agent.

```bash
leo agent enable frontend
```

**Interactive Prompt:**

```
✔ frontend agent enabled
? Regenerate AI instruction files with new agent? (Y/n)
```

If you select Yes, AI files are automatically regenerated.

---

### `leo agent disable <agent>`

Disable a specialized agent.

```bash
leo agent disable devops
```

**Interactive Prompt:**

```
✔ devops agent disabled
? Regenerate AI instruction files without this agent? (Y/n)
```

---

### `leo agent info <agent>`

Show detailed information about an agent.

```bash
leo agent info backend
```

**Output:**

```
⚙️   Backend Agent

Description:
  API and server-side specialist

Status:
  ✓ ENABLED

Responsibilities:
  • RESTful API design
  • Database modeling and optimization
  • Authentication & authorization
  • Security best practices
  • Error handling & validation

Routing Triggers:
  • Keywords: API, endpoint, database, schema, authentication, server
  • Files: *.controller.js, *.service.js, *.model.js, *.route.js
```

---

### `leo agent sync`

Regenerate AI instruction files with current agent configuration.

```bash
leo agent sync
```

**When to use:**

- After enabling/disabling agents (if you skipped auto-sync)
- After manually editing `.leorc.json`
- After updating LEO Workflow Kit version

**Output:**

```
✔ Regenerated 4 AI instruction files
  Multi-agent mode: 3 specialized agents enabled
```

---

## How Routing Works

### Single-Agent Tasks

**Example: "Add a search bar to the header"**

1. **Orchestrator analyzes**:

   - Keywords: "search bar", "header" → Frontend task
   - No backend or DevOps keywords detected

2. **Orchestrator routes** to Frontend Agent

3. **Frontend Agent implements**:

   - Creates SearchBar component
   - Adds styling and accessibility
   - Updates Header component

4. **Result**: Delivered by Frontend Agent

---

### Multi-Agent Tasks

**Example: "Add OAuth2 login with Google"**

1. **Orchestrator analyzes**:

   - Keywords: "OAuth2", "login" → Backend task
   - Keywords: "login" + UI context → Frontend task
   - Classification: Multi-agent coordination required

2. **Orchestrator coordinates**:

   **Step 1: Backend Agent (Primary)**

   - Creates `/api/auth/google` endpoint
   - Configures OAuth2 provider
   - Returns API contract

   **Step 2: Frontend Agent (Secondary)**

   - Creates LoginButton component
   - Adds onClick handler calling `/api/auth/google`
   - Handles OAuth2 redirect flow

3. **Orchestrator integrates**:

   - Verifies both parts work together
   - Tests end-to-end flow

4. **Result**: Coordinated multi-agent implementation

---

### Routing Algorithm

```javascript
// Simplified routing logic
function routeTask(userRequest) {
  // 1. Extract keywords
  const keywords = extractKeywords(userRequest);

  // 2. Identify file patterns
  const files = identifyAffectedFiles(userRequest);

  // 3. Classify task type
  if (matches(keywords, FRONTEND_TRIGGERS) || matches(files, FRONTEND_FILES)) {
    return ["frontend"];
  }

  if (matches(keywords, BACKEND_TRIGGERS) || matches(files, BACKEND_FILES)) {
    const agents = ["backend"];

    // Check if frontend is also needed
    if (hasUIComponent(userRequest)) {
      agents.push("frontend");
    }

    return agents;
  }

  // ... similar logic for other agents
}
```

---

## Multi-Agent Tasks

### Common Patterns

#### 1. Feature with UI + API

**Task**: "Add user profile page with edit functionality"

**Agents**: Backend → Frontend

**Execution:**

1. **Backend**: Creates `/api/users/:id` endpoint (GET, PUT)
2. **Frontend**: Creates ProfilePage component calling API
3. **Integration**: Tests full flow

---

#### 2. Feature with Testing

**Task**: "Add authentication system with tests"

**Agents**: Backend → Testing

**Execution:**

1. **Backend**: Implements auth endpoints
2. **Testing**: Writes unit + integration tests
3. **Integration**: Verifies test coverage

---

#### 3. Full Stack Feature

**Task**: "Build admin dashboard"

**Agents**: Backend → Frontend → Testing → Documentation

**Execution:**

1. **Backend**: Admin APIs (users, analytics, settings)
2. **Frontend**: Dashboard UI with charts and tables
3. **Testing**: E2E tests for admin flows
4. **Documentation**: Admin user guide

---

#### 4. Deployment

**Task**: "Deploy new feature to production"

**Agents**: DevOps (+ Frontend/Backend for build)

**Execution:**

1. **DevOps**: Updates CI/CD pipeline
2. **Frontend/Backend**: Ensures builds pass
3. **DevOps**: Deploys to production
4. **DevOps**: Monitors deployment health

---

## Best Practices

### 1. Enable Only What You Need

❌ **Bad**: Enable all agents for a frontend-only project

```json
{
  "project-type": "frontend-only",
  "agents": {
    "frontend": { "enabled": true },
    "backend": { "enabled": true }, // ❌ Not needed
    "devops": { "enabled": true }, // ✅ OK (for deployment)
    "testing": { "enabled": true }, // ✅ OK
    "documentation": { "enabled": true } // ✅ OK
  }
}
```

✅ **Good**: Enable only relevant agents

```json
{
  "project-type": "frontend-only",
  "agents": {
    "frontend": { "enabled": true }, // ✅ Core agent
    "devops": { "enabled": true }, // ✅ For deployment
    "testing": { "enabled": true }, // ✅ For quality
    "documentation": { "enabled": true } // ✅ For docs
  }
}
```

---

### 2. Use Descriptive Task Descriptions

❌ **Bad**: Vague request

```
"Fix the thing"
```

✅ **Good**: Clear, specific request

```
"Fix the login button alignment on mobile devices (< 768px)"
```

**Why**: Better routing decisions + better agent output

---

### 3. Sync After Configuration Changes

Always run `leo agent sync` after:

- Enabling/disabling agents manually in `.leorc.json`
- Updating LEO Workflow Kit version
- Changing project-type

```bash
leo agent sync
```

---

### 4. Review Agent Recommendations

During `leo init`, LEO recommends agents based on project type:

```
✨ Recommended agents for fullstack:
  • frontend - UI/UX development
  • backend - API and database
  • testing - Quality assurance
```

**Follow recommendations** unless you have specific reasons not to.

---

### 5. Use Agent Info for Clarification

Not sure what an agent does? Use `leo agent info`:

```bash
leo agent info devops
```

Helps you understand:

- What the agent handles
- When it gets triggered
- Its responsibilities

---

## Troubleshooting

### Issue: Agent not responding to tasks

**Symptoms:**

- Request clearly matches agent triggers
- Orchestrator routes elsewhere or doesn't route

**Solutions:**

1. **Verify agent is enabled:**

   ```bash
   leo agent list
   ```

2. **Check .leorc.json:**

   ```bash
   cat .leorc.json
   ```

   Ensure agent has `"enabled": true`

3. **Regenerate AI files:**

   ```bash
   leo agent sync
   ```

4. **Restart your AI assistant** (Copilot, Cursor, etc.)

---

### Issue: Wrong agent handles task

**Symptoms:**

- Backend agent handles frontend work
- Frontend agent tries to write API code

**Solutions:**

1. **Be more specific in your request:**

   ❌ Vague: "Add login functionality"
   ✅ Clear: "Add login API endpoint (POST /api/auth/login)"

2. **Use explicit keywords:**

   - For frontend: "UI", "component", "styling", "page"
   - For backend: "API", "endpoint", "database", "schema"

3. **Mention file paths:**
   - "Update `src/components/LoginForm.jsx`" → Frontend
   - "Update `server/routes/auth.js`" → Backend

---

### Issue: Multi-agent coordination fails

**Symptoms:**

- Parts don't integrate properly
- Missing handoff between agents

**Solutions:**

1. **Break task into phases:**

   ```
   Phase 1: "Create API endpoint for user profile (GET /api/users/:id)"
   Phase 2: "Create ProfilePage component that calls the API"
   ```

2. **Wait for one agent to complete before next:**
   Don't rush multi-agent tasks. Let Backend finish API before Frontend builds UI.

3. **Test integration points explicitly:**
   ```
   "Verify that ProfilePage component successfully fetches from /api/users/:id"
   ```

---

### Issue: AI instruction files too large

**Symptoms:**

- Slow AI response times
- Context limit errors

**Solutions:**

1. **Disable unused agents:**

   ```bash
   leo agent disable documentation  # If you don't need it
   leo agent disable devops        # If not deploying yet
   ```

2. **Enable agents incrementally:**
   Start with 1-2 core agents, add more as needed.

3. **Check file sizes:**
   ```bash
   ls -lh .github/copilot-instructions.md
   # Should be ~60-80KB with 3-4 agents enabled
   ```

---

## Migration from v3.x

### What Changed?

| Aspect            | v3.x                    | v4.0.0                   |
| ----------------- | ----------------------- | ------------------------ |
| **Architecture**  | Single AI assistant     | Multi-agent system       |
| **Instructions**  | One large file (~500KB) | Modular files (~60-80KB) |
| **Configuration** | Basic settings          | Agent selection          |
| **Routing**       | Manual (user-driven)    | Automatic (intelligent)  |
| **Quality**       | Generic output          | Specialized output       |

### Migration Steps

#### 1. Update LEO Workflow Kit

```bash
npm install -g leo-workflow-kit@latest
```

#### 2. Re-initialize Your Project

```bash
# Backup existing config
cp .leorc.json .leorc.json.backup

# Re-run init with agent selection
leo init
```

You'll be prompted to select agents. Choose based on your project needs.

#### 3. Regenerate AI Instruction Files

```bash
leo agent sync
```

This replaces old v3.x instruction files with new multi-agent versions.

#### 4. Restart Your AI Assistant

- **VS Code (Copilot)**: Reload window (`Cmd+Shift+P` → "Reload Window")
- **Cursor**: Restart application
- **Cline**: Reload extension
- **Codeium**: Restart extension

#### 5. Test Agent Routing

Try a simple request:

```
"Add a button to the homepage"
```

You should see:

```
✓ Task analyzed: Frontend (UI component)
✓ Routing to Frontend Agent...
```

### Backward Compatibility

v4.0.0 is **mostly backward compatible** with v3.x:

- ✅ Existing `.leorc.json` files work (agents section optional)
- ✅ GitHub Projects integration unchanged
- ✅ Issue templates and labels unchanged
- ✅ CLI commands backward compatible

**Only Breaking Change**: AI instruction file structure

If you manually edited `.github/copilot-instructions.md`, those changes will be overwritten. Back up custom changes before migrating.

---

## Advanced Topics

### Custom Agent Configurations

Coming in v4.1.0:

- Custom agent types
- Per-agent settings
- Agent priority overrides
- Custom routing rules

### Agent Metrics

Coming in v4.2.0:

- Agent usage statistics
- Routing accuracy metrics
- Performance profiling
- Quality scoring

---

## Summary

### Key Takeaways

1. **Orchestrator is always active** - Routes all tasks to specialists
2. **Enable agents based on project needs** - Don't enable everything
3. **Use clear, specific task descriptions** - Better routing + better output
4. **Sync after configuration changes** - Keep AI files up to date
5. **Review recommendations** - LEO suggests agents based on project type

### Getting Help

- **Documentation**: [LEO Workflow Kit Wiki](https://github.com/leonpagotto/leo-kit/wiki)
- **Issues**: [GitHub Issues](https://github.com/leonpagotto/leo-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leonpagotto/leo-kit/discussions)

### Next Steps

1. Run `leo agent list` to see your current setup
2. Enable/disable agents as needed
3. Try a task and observe routing
4. Read agent-specific docs in `docs/agents/` (coming soon)

---

**Happy multi-agent orchestration! 🎯🚀**
