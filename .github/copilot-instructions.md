# GitHub Copilot Instructions - LEO Workflow Kit

## 🚨 CRITICAL: AUTOMATIC ISSUE CREATION IS MANDATORY 🚨

### ⚠️ READ THIS FIRST - NON-NEGOTIABLE RULES ⚠️

**EVERY TIME the user describes work, you MUST create a GitHub issue IMMEDIATELY.**

**NO EXCEPTIONS. NO "LET ME KNOW IF YOU WANT ME TO". JUST DO IT.**

#### 🔴 MANDATORY WORKFLOW (FOLLOW EXACTLY):

1. **User describes ANY work** (feature, bug, docs, anything)
2. **YOU IMMEDIATELY analyze complexity** (< 5 seconds of thought)
3. **YOU IMMEDIATELY create:**
   - **Simple work** → `gh issue create` (one issue, done)
   - **Complex work** → Create spec file → Ask approval → `gh issue create` (multiple issues)
4. **YOU CONFIRM** issue created with number and link

#### ✅ ALWAYS CREATE ISSUES FOR:

- ✅ New features (any size)
- ✅ Bug fixes (any severity)
- ✅ Documentation updates
- ✅ Refactoring tasks
- ✅ Performance improvements
- ✅ Testing additions
- ✅ Configuration changes
- ✅ Deployment tasks
- ✅ **ANYTHING the user describes as work to be done**

#### ❌ NEVER SAY THESE PHRASES:

- ❌ "Would you like me to create an issue?"
- ❌ "Should I create a GitHub issue for this?"
- ❌ "Let me know if you want an issue created"
- ❌ "I can create an issue if you'd like"

#### ✅ INSTEAD, ALWAYS SAY:

- ✅ "Creating issue for [work description]..."
- ✅ "Issue created: #X - [title]"
- ✅ "✓ Issue #X created and added to project"

#### 🎯 HOW TO DETECT WORK DESCRIPTIONS:

**User mentions any of these = CREATE ISSUE:**

- "We need to..."
- "Can you..."
- "Let's add..."
- "Fix the..."
- "Update..."
- "Create..."
- "Implement..."
- "Add support for..."
- "Make sure that..."
- "I want to..."
- "Build..."
- "Refactor..."

**Examples that MUST trigger issue creation:**

- ✅ "We need to add automatic initialization" → Create issue immediately
- ✅ "Can you fix the postinstall script?" → Create issue immediately
- ✅ "Let's update the README" → Create issue immediately
- ✅ "Make sure users can auto-initialize" → Create issue immediately

**IMPORTANT:** The user doesn't need to say "create an issue". If they describe work, **YOU create the issue automatically!**

---

## 🤖 Spec-First Development

### Decision Tree: Spec or Direct Issue?

#### Create SPEC First (Complex Work):

- 🏗️ New features requiring architecture decisions
- 🔧 Significant system changes affecting multiple components
- 📐 Features needing design/planning (> 1 week effort)
- 🎯 Features that will generate multiple issues

**Examples:** "Add OAuth2 authentication", "Redesign database schema", "Build admin dashboard"

#### Create ISSUE Directly (Simple Work):

- 🐛 Bug fixes (clear problem, clear solution)
- 📝 Documentation updates
- ✨ Small enhancements (< 1 day effort)
- 🧪 Adding tests

**Examples:** "Fix login button on mobile", "Update README", "Add dark mode toggle"

---

## 💻 Issue Creation Commands

### Simple Work - Direct Issue

```bash
gh issue create \
  --repo OWNER/REPO \
  --title "Clear, descriptive title" \
  --body "**Type:** Bug/Feature/Docs
**Priority:** P0/P1/P2/P3
**Component:** frontend/backend/etc

## Problem/Description
[Clear description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3" \
  --label "type,priority,component" \
  --assignee "@me"
```

### Complex Work - Create Spec First

```bash
# 1. Create spec file
cat > docs/specs/feature-name.md << 'EOF'
# Feature Name

## Problem Statement
[What problem are we solving?]

## Proposed Solution
[How will we solve it?]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Implementation Plan
1. Step 1
2. Step 2

## Estimated Effort
X weeks/days
EOF

# 2. Ask user to review
# 3. After approval, break into issues
gh issue create --title "..." --body "..." --label "..."
gh issue create --title "..." --body "..." --label "..."
```

---

## 📊 Key Rules

### ✅ DO:

- Create issues immediately when user describes work
- Use `gh issue create` command (not `leo issue`)
- Infer priority, type, and component from context
- Include detailed acceptance criteria
- Reference issues in all commits: `feat: add feature (#42)`
- Confirm issue creation with number and link

### ❌ DON'T:

- Ask permission to create issues
- Use interactive commands (`leo issue`)
- Skip issue creation for described work
- Create markdown files for tasks (use GitHub issues!)
- Forget to reference issues in commits

---

## 📁 Documentation Organization

**Keep root directory clean - only README.md allowed at root.**

### Structure:

- `docs/specs/` - Feature specifications (PRE-DEVELOPMENT)
- `docs/guides/` - User guides and tutorials
- `docs/development/` - Technical documentation
- `docs/archive/` - Completed/historical work

### Rules:

1. Always place docs in appropriate `docs/` subfolder
2. Never create markdown files in project root (except README.md)
3. Move completed work to `docs/archive/` when stable
4. Delete obsolete files rather than archiving if no historical value

---

## 🔄 Git Workflow

### Commit Messages

```
type(scope): brief description

Refs: #123, #456
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Examples:**

- `feat(auth): add OAuth2 support (#42)`
- `fix(ui): resolve button alignment (#89)`
- `docs(api): update endpoints`

### Pull Requests

- Reference issues: "Closes #42", "Fixes #89"
- Include description of changes
- Add screenshots for UI changes
- Keep PRs focused (< 400 lines when possible)

---

## ⚡ Quick Reference

**User describes work** → **You analyze** → **You create issue** → **You confirm**

**Workflow:**

1. Detect work description
2. Analyze: Simple or Complex?
3. Simple: Create issue directly
4. Complex: Create spec → Review → Issues
5. Confirm with issue number
6. Reference in all commits

**Remember:** Specifications are FILES. Tasks are GITHUB ISSUES.

---

**For detailed coding standards, see:**

- Component development: `docs/development/COMPONENT_STANDARDS.md`
- SEO optimization: `docs/development/SEO_STANDARDS.md`
- Code quality: `docs/development/CODE_QUALITY.md`
