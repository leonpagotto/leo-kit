# LEO Kit Improvements - Based on CRM Deployment Experience

> **Created:** 2025-10-19
> **Context:** Twenty CRM Railway deployment (Issue #7)
> **Purpose:** Document improvements needed in LEO Kit for better client deployments

---

## 🚨 Critical Issues Encountered

### 1. **Violated Automatic Issue Creation Rule**

**What happened:**

- User described work: "Deploy frontend to Railway"
- AI started working immediately WITHOUT creating a GitHub issue first
- Issue #7 was created retroactively after ~8 commits

**LEO Kit Standard:**

```markdown
EVERY TIME the user describes work, you MUST create a GitHub issue IMMEDIATELY.
NO EXCEPTIONS. NO "LET ME KNOW IF YOU WANT ME TO". JUST DO IT.
```

**What should have happened:**

1. User: "i got this: {404 error}" → Deploy frontend
2. AI: Check `.leorc.json` for auto-resolve setting
3. AI: Create Issue #7 immediately with deployment plan
4. AI: Comment on issue: "🚀 Starting work on this issue..."
5. AI: Update status to "In Progress"
6. AI: Begin implementation with all commits referencing #7

**Improvement needed:**

- Stronger enforcement in Copilot instructions
- Detection pattern for deployment requests
- Auto-issue creation before ANY technical work begins

---

### 2. **Missing Status Update on Work Start**

**What happened:**

- Started working without updating issue status to "In Progress"
- No initial comment on issue announcing work started

**LEO Kit Standard:**

```bash
# IMMEDIATELY when starting work:
gh issue comment ISSUE_NUMBER --body "🚀 Starting work on this issue..."
# Update status to "In Progress" if project configured
```

**Improvement needed:**

- Mandatory status update workflow
- Template for "starting work" comments
- Integration with GitHub Projects API

---

### 3. **Monorepo Deployment Challenges Not Documented**

**What happened:**

- Railway builds from subdirectory (`packages/twenty-front/`)
- Missing files: `yarn.lock`, `.yarn/patches/`, `.yarn/releases/`
- Required multiple iterations to discover dependencies

**What should have been in LEO Kit:**

- **Monorepo deployment checklist**
- **Railway subdirectory build patterns**
- **Yarn workspace deployment guide**

**Improvement needed:**
Create `docs/setup/monorepo-deployment-patterns.md`:

```markdown
# Monorepo Deployment Patterns

## Railway Subdirectory Builds

When Railway builds from a subdirectory, you need:

### 1. Package Manager Files

- Copy `yarn.lock` or `package-lock.json` to build directory
- Copy `.yarn/` directory (patches, releases) if using Yarn v4
- Copy `.yarnrc.yml` or `.npmrc` configuration

### 2. Shared Dependencies

- Copy shared workspace packages or use monorepo-aware tools
- Configure buildCommand to run from root if needed

### 3. Environment Variables

- Adjust paths for assets, configs, etc.
- Backend/Frontend URLs must point to opposite services
```

---

### 4. **Iterative Debugging vs. Spec-First Planning**

**What happened:**

- 8 commits fixing sequential build errors
- Each error discovered only after previous fix deployed
- No upfront analysis of monorepo deployment requirements

**What should have happened (Spec-First):**

**Create `docs/specs/railway-frontend-deployment.md`:**

```markdown
# Railway Frontend Deployment Specification

## Pre-Deployment Analysis

### Monorepo Structure

- Root: `/Users/leo.de.souza1/osp/osp-crm`
- Frontend: `packages/twenty-front/`
- Package Manager: Yarn 4.9.2
- Dependencies: Shared workspace packages

### Railway Build Context

- Service Root: `packages/twenty-front/` (subdirectory)
- Builder: Nixpacks
- Node.js: Detected version vs required version mismatch

### Required Files in Build Directory

- [x] package.json ✅ (already present)
- [ ] yarn.lock ❌ (at root, not in subdirectory)
- [ ] .yarn/patches/ ❌ (contains package customizations)
- [ ] .yarn/releases/ ❌ (contains Yarn 4.9.2 binary)

### Implementation Plan

1. Copy yarn.lock to packages/twenty-front/
2. Copy .yarn directory to packages/twenty-front/
3. Create nixpacks.toml with Yarn 4.9.2 config
4. Create railway.json with build settings
5. Create optimized build script
6. Test build locally first (if possible)
7. Deploy and monitor
```

**Improvement needed:**

- Enforce spec creation for complex deployments
- Checklist for monorepo deployment analysis
- Template for deployment specifications

---

### 5. **Long Commit Messages in Pipeline**

**What happened:**

- Some commit messages triggered pipeline delays
- LEO Kit standards warn about this but not strictly enforced

**Current standard:**

```markdown
## 🚨 Commit Message Length Guidelines (CRITICAL)

- Keep subject line under 72 characters (hard limit: 100)
```

**Improvement needed:**

- Git commit hook to enforce length limits
- Pre-commit validation script
- Template for commit message structure

---

## 📋 Recommended LEO Kit Enhancements

### 1. **Deployment Workflow Module**

Create `docs/workflows/deployment-workflow.md`:

````markdown
# Deployment Workflow

## Before Starting Deployment

1. **Create GitHub Issue First**
   ```bash
   gh issue create --title "Deploy [Component] to [Platform]"
   ```
````

2. **Create Deployment Specification** (for complex deployments)

   - File: `docs/specs/deploy-[component]-[platform].md`
   - Include: Requirements analysis, file checklist, implementation plan

3. **Check for Monorepo Patterns**

   - Is build directory a subdirectory?
   - What files need to be copied?
   - Are there shared dependencies?

4. **Update Issue Status**

   ```bash
   gh issue comment [NUMBER] --body "🚀 Starting deployment..."
   ```

5. **Begin Implementation**
   - Reference issue in all commits
   - Update progress in issue comments

````

---

### 2. **Railway Deployment Template**

Create `.github/templates/railway-deployment-checklist.md`:

```markdown
# Railway Deployment Checklist

## Pre-Deployment
- [ ] GitHub issue created
- [ ] Deployment spec created (if complex)
- [ ] Environment variables documented
- [ ] Build directory identified
- [ ] Required files identified

## Monorepo Specific
- [ ] yarn.lock/package-lock.json copied to build dir
- [ ] .yarn directory copied (if using Yarn v4)
- [ ] Shared workspace packages handled
- [ ] Build script paths adjusted

## Configuration Files
- [ ] nixpacks.toml or Dockerfile created
- [ ] railway.json created
- [ ] Build script created
- [ ] Environment variables set in Railway dashboard

## Post-Deployment
- [ ] Build succeeds in Railway
- [ ] Application accessible at URL
- [ ] API connections working
- [ ] Health checks passing
- [ ] Issue updated and closed
````

---

### 3. **Auto-Resolution Configuration**

**Missing from this project:**

- No `.leorc.json` file in repository
- Auto-resolve defaulted to `true` (work started immediately)

**Recommendation for LEO Kit:**

Create `.leorc.json` template:

```json
{
  "auto-resolve": false,
  "github": {
    "project": {
      "org": "osp-group",
      "number": 1,
      "url": "https://github.com/orgs/osp-group/projects/1"
    }
  },
  "deployment": {
    "platform": "railway",
    "services": {
      "backend": {
        "name": "twenty-server",
        "url": "https://osp-crm-server.up.railway.app"
      },
      "frontend": {
        "name": "twenty-front",
        "url": "https://osp-crm.up.railway.app"
      }
    }
  }
}
```

**Usage:**

- AI checks this file before starting work
- If `auto-resolve: false`, AI creates issue and waits
- If `auto-resolve: true`, AI creates issue and proceeds

---

### 4. **Issue Creation Templates**

Add to `.github/ISSUE_TEMPLATE/deployment.md`:

```markdown
---
name: Deployment Task
about: Deploy a component to production/staging
title: 'Deploy [Component] to [Platform]'
labels: deployment, devops
assignees: ''
---

**Component:** [Backend/Frontend/Database/etc.]
**Platform:** [Railway/Vercel/AWS/etc.]
**Priority:** [P0/P1/P2]
**Environment:** [Production/Staging/Development]

## Deployment Goal

[What needs to be deployed and why]

## Pre-Deployment Checklist

- [ ] Environment variables documented
- [ ] Configuration files created
- [ ] Dependencies verified
- [ ] Build process tested (if applicable)

## Monorepo Specific (if applicable)

- [ ] Build directory identified
- [ ] Required files copied to build directory
- [ ] Shared dependencies handled

## Deployment Steps

1. [Step-by-step deployment plan]

## Acceptance Criteria

- [ ] Build succeeds
- [ ] Application accessible
- [ ] Health checks passing
- [ ] Integrations working

## Rollback Plan

[How to rollback if deployment fails]
```

---

### 5. **Copilot Instructions Enhancement**

**Add to `.github/copilot-instructions.md`:**

````markdown
## 🚀 Deployment Workflow (MANDATORY)

**BEFORE deploying anything:**

1. **Check for `.leorc.json`** in project root

   - If missing, assume `auto-resolve: true`
   - Read platform and service configuration

2. **Create GitHub Issue FIRST**
   ```bash
   gh issue create --title "Deploy [Component] to [Platform]" ...
   ```
````

3. **For Complex Deployments (monorepos, multi-service):**

   - Create specification: `docs/specs/deploy-[name].md`
   - Include: Requirements, file checklist, dependencies
   - Get user approval before proceeding

4. **Analyze Build Context:**

   - Is it a monorepo? Which subdirectory?
   - What files need to be in build directory?
   - Are there workspace dependencies?

5. **Update Issue Status:**

   ```bash
   gh issue comment [NUMBER] --body "🚀 Starting deployment..."
   ```

6. **Implement with Commits Referencing Issue:**

   ```bash
   git commit -m "feat: add railway config (#7)"
   ```

7. **Monitor and Update Issue:**
   - Add progress comments
   - Check task boxes as completed
   - Close when fully deployed and verified

```

---

## 🎯 Summary of Improvements

### High Priority
1. ✅ Enforce automatic issue creation BEFORE any work
2. ✅ Add deployment workflow documentation
3. ✅ Create monorepo deployment patterns guide
4. ✅ Add Railway-specific templates and checklists
5. ✅ Create `.leorc.json` template and documentation

### Medium Priority
6. Create git hooks for commit message length
7. Add deployment issue templates
8. Create spec-first deployment guide
9. Document status update workflow with examples
10. Add platform-specific deployment guides (Vercel, AWS, etc.)

### Low Priority
11. Create deployment automation scripts
12. Add deployment testing guidelines
13. Create rollback procedure templates
14. Add deployment monitoring setup guides

---

## 📝 Action Items for LEO Kit Repository

**For leo-workflow-kit maintainers:**

1. **Create new documentation:**
   - `docs/workflows/deployment-workflow.md`
   - `docs/setup/monorepo-deployment-patterns.md`
   - `docs/templates/railway-deployment-checklist.md`
   - `docs/templates/.leorc.json`

2. **Update existing documentation:**
   - Enhance `.github/copilot-instructions.md` with deployment section
   - Add deployment examples to workflow guides
   - Update issue templates with deployment template

3. **Add validation:**
   - Git hooks for commit message length
   - Pre-commit checks for issue creation
   - Deployment checklist validator

4. **Test with clients:**
   - Deploy to different platforms (Railway, Vercel, AWS)
   - Test with monorepos and single repos
   - Test with different package managers (npm, yarn, pnpm)

---

## 💡 Lessons Learned

### What Worked Well
- ✅ Iterative debugging (though should have been planned)
- ✅ Comprehensive documentation created during process
- ✅ Git commits tracked all changes
- ✅ Railway logs analysis effective

### What Needs Improvement
- ❌ Should have created issue FIRST
- ❌ Should have analyzed monorepo structure upfront
- ❌ Should have created deployment spec for complex work
- ❌ Should have updated issue status when starting
- ❌ Could have avoided 6+ iteration commits with better planning

### Key Takeaway
**"Spec-First for Complex Work, Issue-Always for Any Work"**

Even though the deployment succeeded, following LEO Kit standards would have:
- Created clear tracking from the start
- Reduced iteration cycles through upfront analysis
- Provided better documentation for future deployments
- Followed organizational workflows (osp-group project board)

---

## 🔗 Related Documentation

- Issue #7: https://github.com/osp-group/crm/issues/7
- OSP Project Board: https://github.com/orgs/osp-group/projects/1
- LEO Kit Repository: [link needed]
- Railway Documentation: https://docs.railway.app

---

**Next Steps:**
1. Review this document with LEO Kit team
2. Prioritize improvements
3. Create issues in LEO Kit repository for each enhancement
4. Test new workflows with next client deployment
5. Update LEO Kit templates and documentation
```
