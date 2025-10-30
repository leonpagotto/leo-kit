# Deployment Workflow

## Before Starting Deployment

**ALWAYS follow this checklist before deploying anything:**

### 1. Create GitHub Issue First (MANDATORY)

```bash
gh issue create --title "Deploy [Component] to [Platform]" \
  --body "Deploy [description]" \
  --label "deployment,devops,p1"
```

**NO EXCEPTIONS.** Even for "quick deploys" - create the issue first!

### 2. Check for `.leorc.json` Configuration

```bash
# Check if auto-resolve is enabled
cat .leorc.json | grep "auto-resolve"
```

- If `auto-resolve: false` → Wait for user review before working
- If `auto-resolve: true` or missing → Proceed with deployment

### 3. Analyze Deployment Complexity

**Simple Deployment** (< 1 hour, single service):

- Direct issue creation → Implement → Deploy
- Example: Update environment variable, deploy existing code

**Complex Deployment** (> 1 hour, multiple services, architecture changes):

- Create specification in `docs/specs/deploy-[name].md`
- Get user approval
- Break down into multiple issues
- Execute deployment

### 4. Create Deployment Specification (Complex Deployments)

File: `docs/specs/deploy-[component]-[platform].md`

```markdown
# [Platform] [Component] Deployment Specification

## Pre-Deployment Analysis

### Project Structure

- Root directory: [path]
- Component directory: [path]
- Package manager: [npm/yarn/pnpm + version]
- Dependencies: [list shared dependencies]

### Build Context

- Service root: [subdirectory if monorepo]
- Builder: [Nixpacks/Dockerfile/Buildpack]
- Runtime: [Node.js version, Python version, etc.]

### Required Files in Build Directory

- [ ] package.json
- [ ] package-lock.json / yarn.lock / pnpm-lock.yaml
- [ ] .yarn/ directory (if using Yarn v4)
- [ ] .npmrc / .yarnrc.yml (if custom config)
- [ ] Shared workspace packages (if monorepo)

### Environment Variables

- [ ] [VAR_NAME]: [description]
- [ ] [VAR_NAME]: [description]

### Implementation Plan

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Plan

If deployment fails:

1. [Rollback step 1]
2. [Rollback step 2]
```

### 5. Update Issue Status

```bash
gh issue comment [NUMBER] --body "🚀 Starting deployment..."
# Update project board status to "In Progress" if configured
```

---

## Monorepo Deployment Patterns

### Railway Subdirectory Builds

When Railway builds from a subdirectory, you need:

#### 1. Package Manager Files

**Problem:** Railway builds from subdirectory but needs root-level files

**Solution:**

```bash
# Copy yarn.lock to build directory
cp yarn.lock packages/twenty-front/

# Copy .yarn directory (patches, releases) if using Yarn v4
cp -r .yarn packages/twenty-front/

# Copy .yarnrc.yml or .npmrc configuration
cp .yarnrc.yml packages/twenty-front/
```

#### 2. Shared Dependencies

**Problem:** Workspace packages not available during build

**Options:**

- **Option A:** Copy shared packages to build directory
- **Option B:** Use monorepo-aware build command
- **Option C:** Configure Railway to build from root with subdirectory output

```bash
# Option A: Copy shared packages
cp -r packages/shared packages/twenty-front/node_modules/@workspace/

# Option B: Build from root (railway.json)
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd packages/twenty-front && npm run build"
  },
  "deploy": {
    "startCommand": "cd packages/twenty-front && npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 3. Environment Variables

**Adjust paths for assets, configs, etc.**

```bash
# Frontend .env
VITE_API_URL=https://api-service.up.railway.app
VITE_PUBLIC_PATH=/

# Backend .env
FRONTEND_URL=https://frontend-service.up.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Railway variable reference
```

---

## Platform-Specific Deployment Guides

### Railway Deployment

#### Prerequisites

- Railway account connected to GitHub
- Railway CLI installed (optional): `npm i -g @railway/cli`

#### Configuration Files

**1. `railway.json`** (in component directory)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build",
    "watchPatterns": ["src/**", "public/**"]
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

**2. `nixpacks.toml`** (for custom build configuration)

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "yarn"]

[phases.install]
cmds = ["yarn install --frozen-lockfile"]

[phases.build]
cmds = ["yarn build"]

[start]
cmd = "yarn start"
```

**3. `.railwayignore`** (exclude files from deployment)

```
node_modules/
.git/
.env.local
*.log
.DS_Store
```

#### Deployment Steps

```bash
# 1. Create Railway service (via dashboard or CLI)
railway link

# 2. Configure environment variables
railway variables set VITE_API_URL=https://api.example.com

# 3. Deploy
railway up

# 4. Monitor logs
railway logs

# 5. Get deployment URL
railway domain
```

#### Monorepo Railway Deployment

```bash
# Set root directory in Railway dashboard:
# Settings → Service → Root Directory → packages/frontend

# Or via railway.json at root:
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd packages/frontend && npm run build",
    "watchPatterns": ["packages/frontend/**"]
  },
  "deploy": {
    "startCommand": "cd packages/frontend && npm start"
  }
}
```

---

## Deployment Checklist Template

Copy this checklist to your deployment issue:

```markdown
## Pre-Deployment Checklist

### Analysis

- [ ] GitHub issue created (#XXX)
- [ ] Deployment spec created (if complex)
- [ ] `.leorc.json` checked for auto-resolve setting
- [ ] Environment variables documented
- [ ] Build directory identified
- [ ] Required files identified

### Monorepo Specific (if applicable)

- [ ] yarn.lock/package-lock.json copied to build dir
- [ ] .yarn directory copied (if using Yarn v4)
- [ ] Shared workspace packages handled
- [ ] Build script paths adjusted

### Configuration Files

- [ ] nixpacks.toml or Dockerfile created
- [ ] railway.json (or platform config) created
- [ ] Build script created
- [ ] Environment variables set in platform dashboard
- [ ] Health check endpoint configured

### Testing

- [ ] Build succeeds locally (if possible)
- [ ] Environment variables verified
- [ ] Dependencies installed correctly
- [ ] Build output correct

### Deployment

- [ ] Service created in platform
- [ ] Repository connected
- [ ] Root directory configured (if monorepo)
- [ ] Build triggered
- [ ] Deployment succeeded

### Post-Deployment Verification

- [ ] Build succeeds in platform
- [ ] Application accessible at URL
- [ ] API connections working (if applicable)
- [ ] Health checks passing
- [ ] Logs show no errors
- [ ] Performance acceptable

### Finalization

- [ ] Issue updated with deployment URL
- [ ] Documentation updated with new URLs
- [ ] Team notified of deployment
- [ ] Issue closed with concise comment
```

---

## Common Deployment Issues

### Issue: "Cannot find module" during build

**Cause:** Missing dependencies or wrong Node.js version

**Solution:**

```bash
# Check package.json for required Node version
cat package.json | grep '"node"'

# Ensure lockfile is present
ls -la *lock*

# For Railway, set Node version in nixpacks.toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]
```

### Issue: "Build directory not found"

**Cause:** Wrong root directory configuration for monorepo

**Solution:**

```bash
# Railway: Set root directory in dashboard
# Settings → Service → Root Directory → packages/your-service

# Or use railway.json with proper buildCommand
{
  "build": {
    "buildCommand": "cd packages/your-service && npm run build"
  }
}
```

### Issue: "Environment variable not found"

**Cause:** Env vars not set in platform dashboard

**Solution:**

```bash
# Railway CLI
railway variables set VAR_NAME=value

# Or set in Railway dashboard:
# Project → Variables → Add Variable
```

### Issue: "Port binding failed"

**Cause:** Application not listening on $PORT

**Solution:**

```javascript
// Ensure your app uses the PORT env variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Best Practices

### 1. Always Use Version Control

- Commit configuration files to git
- Tag production deployments: `git tag v1.0.0`
- Document deployment in commit message

### 2. Environment-Specific Configurations

```bash
# Don't hardcode URLs
GOOD:  API_URL=${{BACKEND_SERVICE_URL}}
BAD:   API_URL=https://api.example.com

# Use platform variable references
# Railway: ${{SERVICE_NAME.VARIABLE}}
# Vercel: $VARIABLE_NAME
```

### 3. Health Checks

```javascript
// Always provide a health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});
```

### 4. Graceful Shutdowns

```javascript
// Handle SIGTERM for graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

### 5. Deployment Logging

```bash
# Always update the GitHub issue with deployment status
gh issue comment [NUMBER] --body "✅ Deployed to production
URL: https://app.example.com
Build: #123
Status: Healthy"
```

---

## Rollback Procedures

### Quick Rollback (Railway)

```bash
# Via CLI
railway rollback

# Via Dashboard
# Deployments → Select previous deployment → Redeploy
```

### Manual Rollback

```bash
# 1. Revert to previous git commit
git revert HEAD
git push

# 2. Trigger new deployment
# Platform will automatically deploy reverted code

# 3. Update issue
gh issue comment [NUMBER] --body "⚠️ Rolled back to previous version
Reason: [brief reason]
Investigating: #[new-issue-number]"
```

---

## Security Considerations

### Never Commit Secrets

```bash
# Add to .gitignore
.env
.env.local
.env.*.local
railway.json  # if contains secrets

# Use platform secret management
railway variables set DATABASE_PASSWORD=secret --secret
```

### Use HTTPS Only

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

### CORS Configuration

```javascript
// Restrict CORS to known origins
const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

---

## Remember

**"Spec-First for Complex Deployments, Issue-Always for Any Deployment"**

Even quick deployments deserve a GitHub issue for tracking and documentation.

When in doubt, create a specification first!
