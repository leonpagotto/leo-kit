# GitHub Projects v2 Setup Guide

## Prerequisites

1. **Authenticate with GitHub CLI (with `project` scope)**

```bash
gh auth refresh -s project
```

2. **Create a GitHub Project Board** (if you don't have one)

- Go to: https://github.com/users/leonpagotto/projects
- Click "New Project"
- Choose "Board" template
- Name it: "LEO Workflow Board"

## Get Your Project Field IDs

Run these commands to get the field IDs needed for automation:

### 1. Get Project Number

```bash
gh project list --owner leonpagotto
```

Copy the number (e.g., `42`)

### 2. Get Project Fields

```bash
gh api graphql -f query='
  query {
    user(login: "leonpagotto") {
      projectV2(number: YOUR_PROJECT_NUMBER) {
        fields(first: 20) {
          nodes {
            ... on ProjectV2Field {
              id
              name
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  }
'
```

This will show you:
- Field IDs (e.g., `PVTF_lADOABCDEF`)
- Option IDs for Status field (Todo, In Progress, Done)

### 3. Create Custom Fields in Your Project

In your GitHub Project settings, add these custom fields:

**Priority** (Single Select):
- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🟢 Low

**Estimate** (Number):
- Min: 1
- Max: 21

**Status** (Single Select) - should already exist:
- Todo
- In Progress
- Done

## Configure Environment Variables

Create a `.env` file in your project root:

```bash
# GitHub Project Configuration
GH_PROJECT_NUMBER=42                          # Your project number
GH_PROJECT_FIELD_PRIORITY=PVTF_lADOABCD...   # Priority field ID
GH_PROJECT_FIELD_ESTIMATE=PVTF_lADOABCD...   # Estimate field ID
GH_PROJECT_FIELD_STATUS=PVTF_lADOABCD...     # Status field ID
GH_PROJECT_OPTION_TODO=PVTO_lADOABCD...      # "Todo" option ID
GH_PROJECT_OPTION_IN_PROGRESS=PVTO_lADOABCD... # "In Progress" option ID
GH_PROJECT_OPTION_DONE=PVTO_lADOABCD...      # "Done" option ID
```

## Alternative: Auto-Detect Fields (Recommended)

We can create a helper script that auto-detects these values:

```bash
node scripts/setup-github-project.js
```

This will:
1. Scan your projects
2. Detect field IDs automatically
3. Generate `.env` file
4. Test the integration

## Manual Setup (Quick Start)

If you want to test without full automation first:

```bash
# Just set project number
export GH_PROJECT_NUMBER=42

# Issues will be created but won't auto-add to project
# (You can manually add them from the UI)
```

## Verify Setup

```bash
# Test issue creation
leo issue --interactive

# Should create issue with:
# - Proper type (Bug/Enhancement/Task)
# - Component labels only
# - Metadata in body (Priority, Estimate)
```

## Next: Status Automation

Once fields are configured, AI assistants can:
- Auto-move issues to "In Progress" when work starts
- Auto-move to "Done" when PR merges
- Update estimates based on actual work

See `docs/guides/github-projects-automation.md` for details.
