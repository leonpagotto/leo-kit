# GitHub Projects Quick Reference

> **Fast reference for LEO Workflow Kit v2.3.0 GitHub Projects integration**

## 🚀 Quick Start

```bash
# 1. Check your projects
gh project list --owner YOUR_USERNAME

# 2. Note the project number (e.g., 4)

# 3. Use LEO normally - Copilot handles the rest!
```

---

## 📋 Common Commands

### Project Management

```bash
# List projects
gh project list --owner USERNAME

# Create new project
gh project create --owner USERNAME --title "Project Name"

# View project fields
gh project field-list PROJECT_NUMBER --owner USERNAME

# List project items
gh project item-list PROJECT_NUMBER --owner USERNAME
```

### Issue Management

```bash
# Create issue (Copilot does this automatically)
gh issue create --title "..." --body "..." --label "..."

# Add issue to project
gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL

# Close issue
gh issue close ISSUE_NUMBER --reason completed
```

### Status Updates

```bash
# Get project IDs (needed for GraphQL)
gh project list --owner USERNAME --format json | jq '.projects[] | {number, id}'

# Get field IDs
gh project field-list PROJECT_NUMBER --owner USERNAME --format json | jq '.fields[] | {name, id}'

# Get status option IDs
gh project field-list PROJECT_NUMBER --owner USERNAME --format json | jq '.fields[] | select(.name=="Status") | .options'
```

---

## 🤖 Copilot Automation

### Automatic Issue Creation

**You say:**

> "We need to fix the login bug"

**Copilot does:**

- ✅ Creates issue with proper labels
- ✅ Adds to your project
- ✅ Sets status: Todo
- ✅ Confirms with issue number

### Automatic Status Updates

**When you work:**

```bash
git commit -m "feat: implement login fix #42"
# ✓ Copilot detects → Status: In Progress

# ... work continues ...

# PR merged with "Closes #42"
# ✓ Copilot detects → Status: Done
```

---

## 🎯 Work Indicators for Status Updates

### Todo → In Progress

- ✅ `git commit -m "feat: start work #42"`
- ✅ `git checkout -b feature/issue-42`
- ✅ User says: _"Let's work on #42"_

### In Progress → Done

- ✅ PR merged with _"Closes #42"_
- ✅ `gh issue close 42`
- ✅ User says: _"Issue #42 is complete"_

---

## 🔧 Manual Status Update

```bash
# Find item ID
ITEM_ID=$(gh project item-list 4 --owner leonpagotto --format json | jq -r '.items[] | select(.content.number==42) | .id')

# Update to "In Progress"
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "YOUR_PROJECT_ID"
        itemId: "'$ITEM_ID'"
        fieldId: "YOUR_STATUS_FIELD_ID"
        value: { singleSelectOptionId: "IN_PROGRESS_OPTION_ID" }
      }
    ) {
      projectV2Item { id }
    }
  }'
```

---

## 📊 Project Configuration

### Required Fields

- **Status** (Single select: Todo, In Progress, Done)
- **Title** (Default)
- **Assignees** (Default)
- **Labels** (Default)

### Recommended Views

**Board View:**

- Group by: Status
- Columns: Todo | In Progress | Done
- Show: Title, Assignees, Labels

---

## 🐛 Troubleshooting

### Issue not added to project

```bash
# Check authentication
gh auth status

# Re-authenticate with project scope
gh auth login --scopes "project,repo"

# Manually add issue
gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL
```

### Status not updating

```bash
# Verify project configuration
gh project field-list PROJECT_NUMBER --owner OWNER

# Check for "Status" field with options: Todo, In Progress, Done
```

### Permission denied

```bash
# Re-authenticate with correct scopes
gh auth login --scopes "project,repo,workflow"

# Verify
gh auth status
```

---

## 💡 Best Practices

1. **Always reference issue numbers in commits**

   ```bash
   git commit -m "feat: implement feature #42"
   ```

2. **Create branches with issue numbers**

   ```bash
   git checkout -b feature/login-42
   ```

3. **Use "Closes #42" in PR descriptions**

   ```markdown
   ## Changes

   Implemented user authentication

   Closes #42
   ```

4. **Tell Copilot when starting work**

   > "Let's work on issue #42"

5. **Review project board regularly**
   - Check for stale "In Progress" items
   - Verify "Done" items are complete
   - Update assignees as needed

---

## 📚 More Information

- **Full Guide:** `docs/guides/github-projects-integration.md`
- **Release Notes:** `docs/development/RELEASE_V2.3.0.md`
- **Changelog:** `CHANGELOG.md`
- **Examples:** See full guide for detailed examples

---

**Version:** 2.3.0
**Updated:** October 19, 2025
