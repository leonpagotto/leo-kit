# GitHub Projects Integration Guide

> **Automatic issue tracking with status management in GitHub Projects**

## Overview

LEO Workflow Kit now automatically integrates with GitHub Projects, adding issues to your project board with proper status tracking. When Copilot creates an issue, it automatically:

1. ✅ Adds the issue to your configured GitHub Project
2. ✅ Sets initial status to **"Todo"**
3. ✅ Updates status as work progresses (**In Progress** → **Done**)
4. ✅ Keeps your project board synchronized with actual work

---

## 📋 Project Setup

### Step 1: Create or Use Existing Project

**Check existing projects:**

```bash
gh project list --owner YOUR_USERNAME
```

**Create a new project:**

```bash
gh project create --owner YOUR_USERNAME --title "My Project"
```

Note the **project number** (e.g., `4`) from the output.

### Step 2: Configure Project Fields

Your project needs these fields:

- ✅ **Status** (Single select: Todo, In Progress, Done)
- ✅ **Title** (Default)
- ✅ **Assignees** (Default)
- ✅ **Labels** (Default)

**Verify fields:**

```bash
gh project field-list PROJECT_NUMBER --owner YOUR_USERNAME
```

**Check Status field options:**

```bash
gh project field-list PROJECT_NUMBER --owner YOUR_USERNAME --format json | jq '.fields[] | select(.name=="Status")'
```

### Step 3: Configure Project Views

**Recommended Board View:**

- **Columns:** Group by Status
- **Column Order:** Todo → In Progress → Done
- **Card Display:** Show Title, Assignees, Labels

---

## 🤖 Automatic Issue Creation with Projects

### How It Works

When you describe work to Copilot:

- **"We need to fix the login bug"**
- **"Let's add dark mode"**
- **"The search is slow, optimize it"**

Copilot automatically:

1. Creates GitHub issue with proper labels and description
2. Adds issue to your project
3. Sets status to **"Todo"**
4. Confirms with issue number and link

### Example Workflow

**You say:**

> "We need to add user authentication with OAuth2"

**Copilot does:**

```bash
# 1. Create the issue
gh issue create \
  --title "feat: Add OAuth2 user authentication" \
  --body "## Feature Request
Implement OAuth2 authentication for secure user login.

## Acceptance Criteria
- [ ] Integrate OAuth2 provider (Google, GitHub)
- [ ] Create authentication flow
- [ ] Store user sessions securely
- [ ] Add logout functionality

## Priority: P1" \
  --label "feature,p1,backend,auth"

# 2. Add to project
gh project item-add 4 --owner leonpagotto --url https://github.com/owner/repo/issues/7

# 3. Confirm
echo "✓ Created issue #7: Add OAuth2 user authentication"
echo "✓ Added to project with status: Todo"
```

---

## 📊 Automatic Status Updates

### Status Transition Flow

```
┌─────────┐    Start Work    ┌──────────────┐    Complete    ┌────────┐
│  Todo   │ ───────────────> │ In Progress  │ ────────────> │  Done  │
└─────────┘                  └──────────────┘               └────────┘
```

### Todo → In Progress

**Triggers:**

- User says: _"Let's work on issue #7"_ or _"Starting #7"_
- First commit: `git commit -m "feat: start OAuth implementation #7"`
- Branch created: `git checkout -b feature/oauth-7`

**Copilot Action:**

```bash
# Find project item ID
ITEM_ID=$(gh project item-list 4 --owner leonpagotto --format json | jq -r '.items[] | select(.content.number==7) | .id')

# Update status to "In Progress"
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PVT_kwHODW-f-M4BF5lC"
        itemId: "'$ITEM_ID'"
        fieldId: "PVTSSF_lAHODW-f-M4BF5lCzg3Gjw0"
        value: { singleSelectOptionId: "47fc9ee4" }
      }
    ) {
      projectV2Item { id }
    }
  }'

echo "✓ Issue #7 moved to In Progress"
```

### In Progress → Done

**Triggers:**

- PR merged with: _"Closes #7"_
- Issue closed: `gh issue close 7`
- User says: _"Issue #7 is complete"_

**Copilot Action:**

```bash
# Update status to "Done"
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PVT_kwHODW-f-M4BF5lC"
        itemId: "'$ITEM_ID'"
        fieldId: "PVTSSF_lAHODW-f-M4BF5lCzg3Gjw0"
        value: { singleSelectOptionId: "98236657" }
      }
    ) {
      projectV2Item { id }
    }
  }'

echo "✓ Issue #7 completed and moved to Done"
```

---

## 🔧 Manual Project Configuration

### Get Project IDs

**Project ID:**

```bash
gh project list --owner YOUR_USERNAME --format json | jq -r '.projects[] | select(.number==4) | .id'
```

**Status Field ID:**

```bash
gh project field-list 4 --owner YOUR_USERNAME --format json | jq -r '.fields[] | select(.name=="Status") | .id'
```

**Status Option IDs:**

```bash
gh project field-list 4 --owner YOUR_USERNAME --format json | jq -r '.fields[] | select(.name=="Status") | .options[] | "\(.name): \(.id)"'
```

### Manually Add Issue to Project

```bash
# Add issue to project
gh project item-add PROJECT_NUMBER --owner OWNER --url https://github.com/OWNER/REPO/issues/NUMBER

# Set status to Todo
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PROJECT_ID"
        itemId: "ITEM_ID"
        fieldId: "STATUS_FIELD_ID"
        value: { singleSelectOptionId: "TODO_OPTION_ID" }
      }
    ) {
      projectV2Item { id }
    }
  }'
```

---

## 📖 Best Practices

### 1. Configure Project Before Using

- ✅ Create project with proper fields
- ✅ Note project number for Copilot
- ✅ Set up Board view with Status columns
- ✅ Test manually adding one issue first

### 2. Use Clear Work Indicators

- ✅ Reference issue numbers in commits: `feat: implement login #42`
- ✅ Create branches with issue numbers: `feature/login-42`
- ✅ Use "Closes #42" in PR descriptions
- ✅ Tell Copilot when starting work: _"Let's work on #42"_

### 3. Keep Status In Sync

- ✅ Let Copilot update status automatically
- ✅ Provide clear work progress signals
- ✅ Close issues when work is complete
- ✅ Verify project board stays current

### 4. Review Project Board Regularly

- ✅ Check for stale "In Progress" issues
- ✅ Ensure "Done" issues are actually complete
- ✅ Move blocked issues back to "Todo"
- ✅ Update assignees as needed

---

## 🐛 Troubleshooting

### Issue Not Added to Project

**Problem:** Issue created but not in project board

**Solution:**

```bash
# Manually add issue
gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL
```

### Status Not Updating

**Problem:** Status stays as "Todo" when work starts

**Solution:**

1. Ensure you reference issue number in commits
2. Tell Copilot explicitly: _"I'm starting work on #42"_
3. Check GitHub CLI authentication: `gh auth status`
4. Verify project permissions

### Wrong Status Value

**Problem:** Status shows wrong value or blank

**Solution:**

```bash
# Get correct option IDs
gh project field-list PROJECT_NUMBER --owner OWNER --format json | jq '.fields[] | select(.name=="Status")'

# Use correct option ID in GraphQL mutation
```

### Permission Denied

**Problem:** `gh` commands fail with permission errors

**Solution:**

```bash
# Re-authenticate with project scope
gh auth login --scopes "project,repo"

# Verify scopes
gh auth status
```

---

## 🎯 Quick Reference

### Common Commands

```bash
# List projects
gh project list --owner USERNAME

# List project fields
gh project field-list PROJECT_NUMBER --owner USERNAME

# Add issue to project
gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL

# List project items
gh project item-list PROJECT_NUMBER --owner USERNAME

# Close issue (auto-updates to Done)
gh issue close ISSUE_NUMBER --reason completed
```

### Project Configuration

**Required Fields:**

- Status (Single select: Todo, In Progress, Done)
- Title
- Assignees
- Labels

**Recommended Views:**

- Board (grouped by Status)
- Table (all fields visible)

---

## 📚 Related Documentation

- [GitHub Projects v2 Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub CLI Projects Extension](https://cli.github.com/manual/gh_project)
- [Automatic Issue Creation Guide](./automatic-issue-creation.md)
- [Copilot Instructions Reference](../development/copilot-instructions-reference.md)

---

**Updated:** October 19, 2025
**Version:** 2.3.0
