# `.leorc.json` Configuration Guide

The `.leorc.json` file configures LEO Workflow Kit for your project. This file is automatically created by `leo init` and can be manually edited.

## File Location

```
.leorc.json  # Project root directory
```

## Complete Configuration Example

```json
{
  "auto-resolve": false,
  "project-type": "fullstack",
  "github": {
    "org": "your-org-name",
    "repo": "your-repo-name",
    "project": {
      "org": "your-org-name",
      "number": 1,
      "url": "https://github.com/orgs/your-org-name/projects/1"
    }
  },
  "ai-assistants": {
    "enabled": ["copilot", "cursor"],
    "primary": "copilot",
    "sync-on-update": true
  },
  "deployment": {
    "platform": "railway",
    "services": {
      "backend": {
        "name": "api-service",
        "url": "https://api.example.com"
      },
      "frontend": {
        "name": "web-service",
        "url": "https://app.example.com"
      }
    }
  },
  "workflows": {
    "require-specs-for-large-features": true,
    "auto-add-issues-to-project": true,
    "enforce-commit-message-length": true
  }
}
```

---

## Configuration Options

### `auto-resolve` (boolean, default: `true`)

**Controls whether AI assistants should automatically start working on issues after creating them.**

```json
{
  "auto-resolve": false
}
```

**Behaviors:**

- `true` (default): AI creates issue AND starts working immediately
- `false`: AI creates issue but WAITS for user review before working

**When to disable:**

- You want to review all issues before work begins
- Working in a team where issues need approval
- Want to plan work before execution

**Commands:**

```bash
# Disable auto-resolve
leo config set auto-resolve false

# Enable auto-resolve
leo config set auto-resolve true

# Check current setting
leo config get auto-resolve
```

---

### `project-type` (string, default: `"auto"`)

**Specifies the project type for better AI instruction customization.**

```json
{
  "project-type": "fullstack"
}
```

**Options:**

- `"auto"` - Auto-detect from project structure
- `"fullstack"` - Full-stack web application
- `"frontend"` - Frontend-only (React, Vue, Angular, etc.)
- `"backend"` - Backend API (Node.js, Python, etc.)
- `"mobile"` - Mobile app (React Native, Flutter, etc.)
- `"cli"` - Command-line tool
- `"library"` - NPM package or library

**Detection triggers:**

- Presence of `next.config.js` → Next.js project
- `vue.config.js` → Vue project
- `angular.json` → Angular project
- `requirements.txt` → Python project

---

### `github` (object)

**GitHub repository and project configuration.**

```json
{
  "github": {
    "org": "your-org-name",
    "repo": "your-repo-name",
    "project": {
      "org": "your-org-name",
      "number": 1,
      "url": "https://github.com/orgs/your-org-name/projects/1"
    }
  }
}
```

**Fields:**

- `org` (optional): GitHub organization name
- `repo` (optional): Repository name
- `project.org`: Organization or user owning the project
- `project.number`: GitHub Project number
- `project.url`: Full URL to GitHub Project

**How to find project number:**

```bash
# List your GitHub Projects
gh project list --owner YOUR_ORG

# Output shows:
# NUMBER  TITLE            STATE  URL
# 1       LEO Workflow     OPEN   https://github.com/orgs/YOUR_ORG/projects/1
```

---

### `ai-assistants` (object)

**Configuration for AI coding assistants.**

```json
{
  "ai-assistants": {
    "enabled": ["copilot", "cursor", "cline"],
    "primary": "copilot",
    "sync-on-update": true
  }
}
```

**Fields:**

- `enabled` (array): List of enabled AI assistants
  - Options: `"copilot"`, `"cursor"`, `"cline"`, `"codeium"`
- `primary` (string): Your main AI assistant
- `sync-on-update` (boolean): Auto-regenerate instructions on config changes

**Supported AI Assistants:**

| AI Assistant | File Generated                    | Description            |
| ------------ | --------------------------------- | ---------------------- |
| **copilot**  | `.github/copilot-instructions.md` | GitHub Copilot         |
| **cursor**   | `.cursorrules`                    | Cursor IDE with Claude |
| **cline**    | `.clinerules`                     | Cline VSCode extension |
| **codeium**  | `.codeium/instructions.md`        | Codeium AI             |

**Managing AI Assistants:**

```bash
# List configured AIs
leo ai list

# Add AI assistant
leo ai add cursor

# Remove AI assistant
leo ai remove cursor

# Regenerate all instruction files
leo ai sync
```

---

### `agents` (object) ⭐ NEW in v4.0.0

**Configuration for multi-agent orchestration system.**

```json
{
  "agents": {
    "orchestrator": {
      "enabled": true
    },
    "frontend": {
      "enabled": true,
      "frameworks": ["react", "next.js"],
      "ui-library": "tailwindcss"
    },
    "backend": {
      "enabled": true,
      "framework": "express",
      "database": "postgresql",
      "orm": "prisma"
    },
    "devops": {
      "enabled": false,
      "platform": "railway",
      "ci-cd": "github-actions"
    },
    "testing": {
      "enabled": true,
      "frameworks": ["jest", "playwright"],
      "coverage-threshold": 80
    },
    "documentation": {
      "enabled": true,
      "style": "jsdoc"
    }
  }
}
```

**Available Agents:**

| Agent             | Purpose                                            | Can Disable? |
| ----------------- | -------------------------------------------------- | ------------ |
| **orchestrator**  | Routes tasks to specialized agents                 | ❌ Required  |
| **frontend**      | UI/UX, components, styling, accessibility          | ✅ Optional  |
| **backend**       | APIs, databases, authentication, business logic    | ✅ Optional  |
| **devops**        | Deployment, CI/CD, infrastructure, monitoring      | ✅ Optional  |
| **testing**       | Unit tests, integration tests, E2E tests, coverage | ✅ Optional  |
| **documentation** | README, API docs, user guides, code comments       | ✅ Optional  |

#### Orchestrator Agent (Required)

The orchestrator agent is always enabled and cannot be disabled. It analyzes user requests and routes to appropriate specialized agents.

```json
{
  "agents": {
    "orchestrator": {
      "enabled": true
    }
  }
}
```

#### Frontend Agent

Specialized in UI/UX development, component architecture, and frontend performance.

```json
{
  "agents": {
    "frontend": {
      "enabled": true,
      "frameworks": ["react", "vue", "angular"],
      "ui-library": "tailwindcss"
    }
  }
}
```

**Configuration Options:**

- `enabled` (boolean): Enable/disable frontend agent
- `frameworks` (array): Frontend frameworks used (e.g., `["react", "next.js"]`)
- `ui-library` (string): UI library or CSS framework (e.g., `"tailwindcss"`, `"mui"`, `"bootstrap"`)

**Triggers Frontend Agent:**

- Keywords: `component`, `UI`, `style`, `design`, `responsive`, `accessibility`
- File patterns: `*.jsx`, `*.tsx`, `*.vue`, `*.css`, `*.scss`
- User requests: "Add a button", "Style the header", "Make it responsive"

#### Backend Agent

Specialized in API development, database design, authentication, and server-side logic.

```json
{
  "agents": {
    "backend": {
      "enabled": true,
      "framework": "express",
      "database": "postgresql",
      "orm": "prisma"
    }
  }
}
```

**Configuration Options:**

- `enabled` (boolean): Enable/disable backend agent
- `framework` (string): Backend framework (e.g., `"express"`, `"fastify"`, `"nest"`)
- `database` (string): Database type (e.g., `"postgresql"`, `"mongodb"`, `"mysql"`)
- `orm` (string): ORM/query builder (e.g., `"prisma"`, `"typeorm"`, `"sequelize"`)

**Triggers Backend Agent:**

- Keywords: `API`, `endpoint`, `database`, `auth`, `query`, `model`, `security`
- File patterns: `*.controller.js`, `*.service.js`, `*.model.js`, `*.route.js`
- User requests: "Create API endpoint", "Add authentication", "Query the database"

#### DevOps Agent

Specialized in deployment, CI/CD pipelines, infrastructure, and monitoring.

```json
{
  "agents": {
    "devops": {
      "enabled": true,
      "platform": "railway",
      "ci-cd": "github-actions"
    }
  }
}
```

**Configuration Options:**

- `enabled` (boolean): Enable/disable devops agent
- `platform` (string): Deployment platform (e.g., `"railway"`, `"vercel"`, `"aws"`, `"gcp"`)
- `ci-cd` (string): CI/CD system (e.g., `"github-actions"`, `"gitlab-ci"`, `"jenkins"`)

**Triggers DevOps Agent:**

- Keywords: `deploy`, `CI/CD`, `Docker`, `pipeline`, `infrastructure`, `monitoring`
- File patterns: `Dockerfile`, `docker-compose.yml`, `.github/workflows/*`
- User requests: "Deploy to production", "Add CI/CD pipeline", "Setup monitoring"

#### Testing Agent

Specialized in test creation, coverage analysis, and quality assurance.

```json
{
  "agents": {
    "testing": {
      "enabled": true,
      "frameworks": ["jest", "playwright"],
      "coverage-threshold": 80
    }
  }
}
```

**Configuration Options:**

- `enabled` (boolean): Enable/disable testing agent
- `frameworks` (array): Testing frameworks (e.g., `["jest", "vitest", "mocha"]`)
- `coverage-threshold` (number): Minimum test coverage percentage (default: 80)

**Triggers Testing Agent:**

- Keywords: `test`, `spec`, `coverage`, `mock`, `fixture`, `assertion`
- File patterns: `*.test.js`, `*.spec.js`, `__tests__/*`, `*.e2e.js`
- User requests: "Write tests", "Add test coverage", "Mock the API"

#### Documentation Agent

Specialized in technical writing, API documentation, and user guides.

```json
{
  "agents": {
    "documentation": {
      "enabled": true,
      "style": "jsdoc"
    }
  }
}
```

**Configuration Options:**

- `enabled` (boolean): Enable/disable documentation agent
- `style` (string): Documentation style (e.g., `"jsdoc"`, `"typedoc"`, `"markdown"`)

**Triggers Documentation Agent:**

- Keywords: `documentation`, `README`, `guide`, `comment`, `explain`, `document`
- File patterns: `*.md`, `docs/*`, `README*`, `CONTRIBUTING*`
- User requests: "Update README", "Document the API", "Write a user guide"

#### Managing Agents

```bash
# List enabled agents
leo agent list

# Enable an agent
leo agent add frontend

# Disable an agent (except orchestrator)
leo agent remove devops

# Get agent info
leo agent info backend

# Regenerate all agent instruction files
leo agent sync
```

#### Recommended Agents by Project Type

| Project Type  | Recommended Agents                                      |
| ------------- | ------------------------------------------------------- |
| **fullstack** | Orchestrator, Frontend, Backend, Testing, Documentation |
| **frontend**  | Orchestrator, Frontend, Testing, Documentation          |
| **backend**   | Orchestrator, Backend, Testing, DevOps, Documentation   |
| **cli**       | Orchestrator, Backend, Testing, Documentation           |
| **mobile**    | Orchestrator, Frontend, Backend, Testing, Documentation |
| **library**   | Orchestrator, Backend, Testing, Documentation           |

**See Also:** [Multi-Agent Orchestration Spec](../specs/multi-agent-orchestration.md)

---

### `routing` (object) ⭐ NEW in v4.0.0

**Configuration for agent routing behavior.**

```json
{
  "routing": {
    "multi-agent-threshold": 3,
    "auto-handoff": true,
    "fallback-agent": "orchestrator"
  }
}
```

**Configuration Options:**

- `multi-agent-threshold` (number): Number of agents required to trigger special multi-agent coordination (default: 3)
- `auto-handoff` (boolean): Automatically hand off between agents without user intervention (default: true)
- `fallback-agent` (string): Agent to use when routing is unclear (default: "orchestrator")

**How Routing Works:**

1. **User describes work** → Orchestrator analyzes request
2. **Task classified** → Determines which agent(s) are needed
3. **Single-agent task** → Routes directly to specialist
4. **Multi-agent task** → Coordinates multiple specialists sequentially
5. **Unclear task** → Falls back to orchestrator or asks for clarification

**Example Multi-Agent Routing:**

```
User: "Add OAuth2 login button"

Orchestrator Analysis:
  ✓ Primary: Backend (OAuth2 authentication)
  ✓ Secondary: Frontend (login button UI)

Execution:
  Step 1: Backend Agent → Creates OAuth2 endpoints
  Step 2: Frontend Agent → Creates login button UI
  Step 3: Integration → Orchestrator verifies connection
```

---

### `deployment` (object)

**Deployment platform and service configuration.**

```json
{
  "deployment": {
    "platform": "railway",
    "services": {
      "backend": {
        "name": "api-service",
        "url": "https://api.example.com",
        "health-check": "/health"
      },
      "frontend": {
        "name": "web-service",
        "url": "https://app.example.com"
      },
      "database": {
        "name": "postgres",
        "internal-url": "postgres://..."
      }
    }
  }
}
```

**Fields:**

- `platform` (string): Deployment platform name
  - Examples: `"railway"`, `"vercel"`, `"aws"`, `"gcp"`, `"heroku"`
- `services` (object): Map of service configurations

**Service Fields:**

- `name` (string): Service name in platform
- `url` (string): Public URL
- `internal-url` (optional): Internal/private URL
- `health-check` (optional): Health check endpoint path

**Use case:** AI assistants use this to:

- Generate correct environment variables
- Configure cross-service URLs
- Create deployment scripts
- Write deployment documentation

---

### `workflows` (object)

**Workflow enforcement settings.**

```json
{
  "workflows": {
    "require-specs-for-large-features": true,
    "auto-add-issues-to-project": true,
    "enforce-commit-message-length": true
  }
}
```

**Fields:**

- `require-specs-for-large-features` (boolean, default: `true`)

  - Forces creation of spec file for complex work
  - AI will ask for approval before creating issues

- `auto-add-issues-to-project` (boolean, default: `true`)

  - Automatically adds new issues to configured GitHub Project
  - Requires `github.project` to be configured

- `enforce-commit-message-length` (boolean, default: `true`)
  - Warns when commit messages exceed 72 characters
  - Can be integrated with git hooks

---

## Minimal Configuration

**Smallest working configuration:**

```json
{
  "auto-resolve": true,
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot"
  }
}
```

---

## Configuration Commands

### Set Configuration Value

```bash
# Set auto-resolve
leo config set auto-resolve false

# Set project type
leo config set project-type frontend

# Set GitHub org
leo config set github.org your-org-name

# Set deployment platform
leo config set deployment.platform railway
```

### Get Configuration Value

```bash
# Get auto-resolve
leo config get auto-resolve

# Get all config
leo config get
```

### Delete Configuration Value

```bash
# Delete deployment config
leo config delete deployment

# Reset to defaults
leo config reset
```

---

## Environment-Specific Configuration

**Development vs Production:**

You can create environment-specific files (not yet implemented, proposed):

```
.leorc.json              # Default config
.leorc.development.json  # Development overrides
.leorc.production.json   # Production overrides
```

**Current workaround:** Use environment variables

```bash
# Override auto-resolve via env var
export LEO_AUTO_RESOLVE=false
leo init
```

---

## Configuration for Teams

### Organization Template

Create a template for your organization:

**`.leorc.json` (organization template):**

```json
{
  "auto-resolve": false,
  "github": {
    "org": "your-org-name",
    "project": {
      "org": "your-org-name",
      "number": 1,
      "url": "https://github.com/orgs/your-org-name/projects/1"
    }
  },
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot",
    "sync-on-update": true
  },
  "workflows": {
    "require-specs-for-large-features": true,
    "auto-add-issues-to-project": true,
    "enforce-commit-message-length": true
  }
}
```

**Distribute to team members:**

```bash
# Add to .github/leo-config-template.json in your organization
# Team members can copy during setup
cp .github/leo-config-template.json .leorc.json
```

---

## Migration Guide

### Upgrading from v2.x to v3.x

**v2.x format:**

```json
{
  "copilot-instructions": true,
  "project-number": 1
}
```

**v3.x format:**

```json
{
  "auto-resolve": true,
  "github": {
    "project": {
      "number": 1
    }
  },
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot"
  }
}
```

**Automatic migration:**

```bash
# LEO Kit will automatically migrate on first run
leo status  # Triggers migration if needed
```

---

## Troubleshooting

### Config not loading

**Check file exists:**

```bash
ls -la .leorc.json
```

**Check JSON is valid:**

```bash
cat .leorc.json | jq .
# If error, JSON is malformed
```

**Regenerate config:**

```bash
# Backup current config
mv .leorc.json .leorc.json.backup

# Re-run init
leo init
```

### AI instructions not updating

**Manually sync:**

```bash
leo ai sync
```

**Check sync-on-update:**

```bash
leo config get ai-assistants.sync-on-update
# Should return: true
```

### Project not linking issues

**Verify project config:**

```bash
leo config get github.project
```

**Test project connection:**

```bash
gh project view YOUR_PROJECT_NUMBER --owner YOUR_ORG
```

---

## Best Practices

### 1. Commit `.leorc.json` to Git

**DO commit:**

```bash
git add .leorc.json
git commit -m "chore: add LEO workflow configuration"
```

**Why:** Ensures consistent workflow across team

### 2. Don't Store Secrets

**DON'T add sensitive data:**

```json
{
  "deployment": {
    "api-key": "secret123" // ❌ DON'T DO THIS
  }
}
```

**DO use environment variables:**

```bash
# .env file (in .gitignore)
RAILWAY_TOKEN=secret123
```

### 3. Document Custom Settings

**Add comments (proposed):**

```json
{
  "auto-resolve": false,
  "_comment": "Disabled because we review all issues as a team"
}
```

### 4. Keep It Simple

**Start minimal:**

```json
{
  "auto-resolve": true,
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot"
  }
}
```

**Add config as needed!**

---

## Schema Validation

**Proposed JSON Schema (not yet implemented):**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LEO Workflow Kit Configuration",
  "type": "object",
  "properties": {
    "auto-resolve": {
      "type": "boolean",
      "default": true,
      "description": "Auto-start work after creating issues"
    },
    "project-type": {
      "type": "string",
      "enum": [
        "auto",
        "fullstack",
        "frontend",
        "backend",
        "mobile",
        "cli",
        "library"
      ],
      "default": "auto"
    }
  }
}
```

---

## Related Documentation

- **Initial Setup:** `docs/guides/QUICK_REFERENCE.md`
- **AI Assistants:** `docs/guides/AI_ASSISTANTS.md` (coming soon)
- **GitHub Projects:** `docs/guides/github-projects-integration.md`
- **Deployment:** `docs/workflows/deployment-workflow.md`

---

## Examples

### Solo Developer (Default)

```json
{
  "auto-resolve": true,
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot"
  }
}
```

### Team Project

```json
{
  "auto-resolve": false,
  "github": {
    "org": "acme-corp",
    "project": {
      "org": "acme-corp",
      "number": 5,
      "url": "https://github.com/orgs/acme-corp/projects/5"
    }
  },
  "ai-assistants": {
    "enabled": ["copilot"],
    "primary": "copilot"
  },
  "workflows": {
    "require-specs-for-large-features": true,
    "auto-add-issues-to-project": true
  }
}
```

### Multi-Platform Deployment

```json
{
  "auto-resolve": true,
  "deployment": {
    "platform": "railway",
    "services": {
      "api": {
        "name": "backend-api",
        "url": "https://api.acme.com",
        "health-check": "/health"
      },
      "web": {
        "name": "frontend-web",
        "url": "https://app.acme.com"
      },
      "admin": {
        "name": "admin-panel",
        "url": "https://admin.acme.com"
      },
      "database": {
        "name": "postgres-main",
        "internal-url": "${{Postgres.DATABASE_URL}}"
      }
    }
  }
}
```

---

**Need help?** Run `leo status` to check your configuration!
