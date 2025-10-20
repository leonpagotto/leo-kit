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
