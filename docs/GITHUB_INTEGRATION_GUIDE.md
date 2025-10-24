# GitHub Integration Guide

## Overview

The GitHub integration feature enables seamless synchronization between LionPack hunts and GitHub project boards. Automatically create, track, and manage GitHub issues directly from your hunt workflow.

**Last Updated:** Phase 3 Week 1 (Stable)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Setup Instructions](#setup-instructions)
3. [Features](#features)
4. [Usage Examples](#usage-examples)
5. [Troubleshooting](#troubleshooting)
6. [API Reference](#api-reference)

---

## Getting Started

### Prerequisites

- GitHub account with repository access
- GitHub Personal Access Token (PAT) with `project` and `repo` scopes
- LionPack team initialized (`leo team init`)

### Quick Setup

```bash
# 1. Initialize your team (if not done)
leo team init

# 2. Set up GitHub integration
leo team setupGitHub

# 3. Enter your Personal Access Token when prompted
# GitHub will create a project board automatically

# 4. Start creating hunts with GitHub sync!
leo hunt start
```

---

## Setup Instructions

### Step 1: Generate GitHub Personal Access Token

1. Visit [GitHub Settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name (e.g., "LionPack Integration")
4. Select these scopes:
   - `repo` (Full control of private repositories)
   - `project` (Read/write GitHub project boards)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### Step 2: Configure GitHub in LionPack

Run the setup command and paste your token:

```bash
leo team setupGitHub
```

You'll be prompted for:

- **GitHub Personal Access Token**: Your PAT (input masked for security)

The setup process will:

1. ✅ Validate your token against GitHub
2. ✅ Create a project board for your team
3. ✅ Create columns matching your workflow phases
4. ✅ Save configuration securely (token stored in `.lionpack/github-token`)

### Step 3: Verify Configuration

Check your GitHub integration status:

```bash
leo team checkGitHub

# Output:
# ✅ GitHub Connected
# User: octocat
# Repository: org/repo
# Project: LionPack Board (ID: P123)
# Rate Limit: 4000/5000 remaining
```

---

## Features

### 1. Automatic Project Board Creation

When you run `leo team setupGitHub`, LionPack automatically creates a GitHub project board with columns matching your workflow:

- **Discovery** - Initial research and planning
- **Design** - Architecture and design phase
- **Development** - Implementation phase
- _(Custom phases based on your workflow)_

### 2. Automatic Issue Creation

When you start a hunt:

```bash
leo hunt start

# Questions:
# ? Hunt name: User Authentication Feature
# ? Description: Implement OAuth2 with Google and GitHub
# ...
# ✅ GitHub issue created: #42
```

The system automatically:

- Creates a GitHub issue with hunt details
- Adds hunt-specific labels (`hunt`, `lionpack`)
- Adds the issue to your project board
- Stores issue metadata in the hunt

### 3. Phase Transition Tracking

As your hunt progresses through phases:

```bash
leo hunt nextPhase hunt-1

# Transitions discovery → design
# ✅ Moved to design phase
# GitHub: Issue #42 moved to Design column
```

The system:

- Moves the issue between board columns
- Adds phase labels (`design`, `development`, etc.)
- Comments on the issue with phase transitions
- Maintains audit trail on GitHub

### 4. Hunt Completion

When your hunt completes:

```bash
leo hunt complete hunt-1

# ✅ Hunt completed!
# GitHub: Issue #42 closed
# Duration: 2 hours 15 minutes
```

The system:

- Closes the corresponding GitHub issue
- Adds a completion comment with hunt metrics
- Archives hunt data locally

### 5. Rate Limit Monitoring

LionPack tracks GitHub API rate limits:

```bash
leo team checkGitHub

# Rate Limit: 4000/5000 remaining
# Reset at: 2024-10-24 15:30:00 UTC
```

Operations automatically handle rate limits:

- Pauses before limit is exceeded (at 250 remaining)
- Provides helpful error messages
- Includes retry logic for transient failures

---

## Usage Examples

### Example 1: Complete Hunt Workflow with GitHub Sync

```bash
# Step 1: Initialize team and GitHub
leo team init
leo team setupGitHub

# Step 2: Start a hunt with GitHub issue creation
leo hunt start
# ? Hunt name: Implement Dark Mode
# ? Description: Add dark theme support across app
# ✅ GitHub issue created: #73
# ✅ Hunt created: hunt-a1b2c3d4

# Step 3: Track progress as phases change
leo hunt nextPhase hunt-a1b2c3d4
# Transitions to next phase, updates GitHub board

# Step 4: Complete the hunt
leo hunt complete hunt-a1b2c3d4
# Issue #73 closed on GitHub
# Hunt archived locally
```

### Example 2: Check GitHub Connection Status

```bash
leo team checkGitHub

# Output:
# ✅ GitHub Connected
#
# User Information:
#   Login: octocat
#   ID: 12345
#   Name: The Octocat
#
# Project Details:
#   Project: LionPack Board
#   Repository: octocat/my-repo
#   Columns: 3 (discovery, design, development)
#
# Rate Limit:
#   Remaining: 4850/5000
#   Resets in: 59 minutes
```

### Example 3: Disable GitHub Integration

If you need to disconnect GitHub:

```bash
leo team disconnectGitHub

# Confirmation prompt:
# Are you sure? This will remove your GitHub token. (y/N): y

# ✅ GitHub disconnected
# Token removed from system
```

Later, you can re-enable with:

```bash
leo team setupGitHub
```

### Example 4: View Hunt with GitHub Sync

```bash
leo hunt list

# Output:
# 🦁 Hunts (Active)
#
#   hunt-1a2b3c4d
#   Feature: User Authentication
#   Phase: Design
#   Duration: 1 hour 23 minutes
#   GitHub: #42 (design)
#
#   hunt-5e6f7g8h
#   Feature: Dark Mode
#   Phase: Development
#   Duration: 4 hours 12 minutes
#   GitHub: #73 (development)
```

---

## Troubleshooting

### Invalid Token Error

**Error:** `Invalid token (401)`

**Solutions:**

1. Verify token hasn't expired (regenerate if needed)
2. Check token has correct scopes (`repo`, `project`)
3. Ensure you copied the full token

```bash
leo team setupGitHub  # Re-enter token
```

### Permission Denied Error

**Error:** `Insufficient permissions (403)`

**Solutions:**

1. Token needs `repo` and `project` scopes
2. Check repository access permissions
3. Regenerate token with correct scopes

### Rate Limit Exceeded

**Error:** `API rate limit exceeded`

**Solutions:**

1. Wait for rate limit reset (shown in message)
2. LionPack automatically retries transient failures
3. Check current status: `leo team checkGitHub`

### GitHub Issue Not Created

**Symptoms:** Hunt starts but no GitHub issue appears

**Diagnosis:**

```bash
# Check GitHub is enabled
leo team checkGitHub

# Check recent hunt
leo hunt list
```

**Solutions:**

1. Verify GitHub token is still valid: `leo team checkGitHub`
2. Check rate limits aren't exceeded
3. Try creating issue manually on GitHub
4. Re-setup GitHub integration: `leo team setupGitHub`

### Token Not Saved Securely

**Security Check:**

```bash
ls -la .lionpack/github-token

# Should show: -rw-------  (600 permissions, owner-only read/write)
```

If permissions are wrong:

```bash
chmod 600 .lionpack/github-token
```

### Board Columns Don't Match Workflow

**Issue:** GitHub board columns don't match your workflow phases

**Solution:** Manually update project board columns on GitHub, or reset:

```bash
leo team disconnectGitHub
leo team setupGitHub  # Creates new board
```

---

## API Reference

### Team Commands

#### `leo team setupGitHub`

Set up GitHub integration for your team.

```javascript
// Behavior
- Prompts for GitHub Personal Access Token (password input)
- Validates token against GitHub API
- Creates project board with workflow columns
- Saves GitHub configuration
- Returns success status

// Returns
{
  enabled: true,
  projectId: "P123",
  columns: [
    { id: "C1", name: "discovery" },
    { id: "C2", name: "design" },
    { id: "C3", name: "development" }
  ],
  user: { login: "octocat", id: 12345 }
}
```

#### `leo team checkGitHub`

Verify GitHub integration status.

```javascript
// Behavior
- Loads and validates stored token
- Fetches authenticated user info
- Gets rate limit status
- Displays connection details

// Returns
{
  authenticated: true,
  user: { login: "octocat", name: "The Octocat" },
  rateLimit: { remaining: 4000, reset: 1635120000 }
}
```

#### `leo team disconnectGitHub`

Disconnect GitHub integration.

```javascript
// Behavior
- Asks for confirmation
- Deletes stored token
- Removes GitHub config
- Returns confirmation

// Returns
{
  removed: true,
  message: "GitHub integration disconnected"
}
```

### Hunt Commands

#### `leo hunt start` (with GitHub enabled)

Start a hunt and create GitHub issue.

```javascript
// Behavior
- Creates hunt as normal
- If GitHub enabled and token valid:
  * Creates GitHub issue
  * Adds to project board (first column)
  * Stores issue metadata in hunt
- Handles errors gracefully

// Hunt object includes
{
  id: "hunt-123",
  featureName: "User Auth",
  githubIssue: {
    number: 42,
    id: "I1",
    url: "https://github.com/.../issues/42"
  }
}
```

#### `leo hunt nextPhase hunt-id` (with GitHub enabled)

Transition hunt to next phase, update GitHub.

```javascript
// Behavior
- Transitions hunt phase as normal
- If hunt has GitHub issue:
  * Moves issue to corresponding column
  * Adds phase label
  * Comments with transition details
- Handles errors gracefully

// GitHub updates
- Column: discovery → design
- Labels: Added [design]
- Comment: "🔄 Moved to **design** phase"
```

#### `leo hunt complete hunt-id` (with GitHub enabled)

Complete hunt, close GitHub issue.

```javascript
// Behavior
- Marks hunt as complete
- If hunt has GitHub issue:
  * Closes the issue
  * Adds completion comment with metrics
  * Archives locally
- Handles errors gracefully

// GitHub updates
- State: open → closed
- Comment: "✅ Hunt completed! Duration: X minutes"
```

### GitHubAuth Class

#### Constructor

```javascript
const auth = new GitHubAuth(token);
```

#### Methods

##### `validateToken()`

Verify token is valid.

```javascript
const user = await auth.validateToken();
// Returns: { id, login, name, ... }
// Throws: Error on invalid token
```

##### `getUser()`

Get authenticated user information.

```javascript
const user = await auth.getUser();
// Returns: { id, login, name, email, ... }
```

##### `getRateLimit()`

Get current rate limit status.

```javascript
const limits = auth.getRateLimit();
// Returns: { remaining: 4000, reset: 1635120000 }
```

##### `isNearRateLimit()`

Check if approaching rate limit.

```javascript
const isNear = auth.isNearRateLimit();
// Returns: boolean (true if remaining <= 250)
```

#### Static Methods

##### `GitHubAuth.hasToken()`

Check if token exists locally.

```javascript
const hasToken = GitHubAuth.hasToken();
// Returns: boolean
```

##### `GitHubAuth.loadToken()`

Load stored token from disk.

```javascript
const token = GitHubAuth.loadToken();
// Returns: token string
// Throws: Error if not found
```

##### `GitHubAuth.saveToken(token)`

Save token to disk securely (mode 0o600).

```javascript
GitHubAuth.saveToken(token);
// Creates .lionpack/github-token with user-only permissions
```

##### `GitHubAuth.deleteToken()`

Delete stored token.

```javascript
GitHubAuth.deleteToken();
// Removes .lionpack/github-token
```

### GitHubAPI Class

#### Constructor

```javascript
const api = new GitHubAPI(auth);
```

#### Methods

##### `createProjectBoard(name, columns)`

Create a GitHub project board.

```javascript
const board = await api.createProjectBoard("LionPack Board", [
  "discovery",
  "design",
  "development",
]);
// Returns: { id, name, columns: [...] }
```

##### `createIssue(repo, title, description, labels)`

Create a GitHub issue.

```javascript
const issue = await api.createIssue(
  "org/repo",
  "🦁 Feature Name",
  "Detailed description",
  ["hunt", "feature"]
);
// Returns: { id, number, state, title, ... }
```

##### `updateIssue(repo, number, updates)`

Update issue state or metadata.

```javascript
await api.updateIssue("org/repo", 42, { state: "closed" });
// Returns: { id, number, state, ... }
```

##### `addLabel(repo, number, labels)`

Add labels to an issue.

```javascript
await api.addLabel("org/repo", 42, ["bug", "urgent"]);
// Returns: boolean (success)
```

##### `addComment(repo, number, comment)`

Add comment to an issue.

```javascript
await api.addComment("org/repo", 42, "✅ Complete");
// Returns: { id, body, ... }
```

##### `addIssueToBoard(projectId, issueNumber, columnId)`

Add issue to project board.

```javascript
await api.addIssueToBoard("P1", 42, "C1");
// Returns: boolean (success)
```

##### `moveIssueColumn(projectId, issueNumber, targetColumnId)`

Move issue between columns.

```javascript
await api.moveIssueColumn("P1", 42, "C2");
// Returns: boolean (success)
```

---

## Best Practices

### 1. Token Security

- ✅ Store token securely (default: `.lionpack/github-token` with 0o600 permissions)
- ✅ Never commit token to version control
- ✅ Rotate token every 90 days
- ✅ Use repository-scoped personal access tokens when possible

### 2. Workflow Alignment

- ✅ Ensure GitHub board columns match your workflow phases
- ✅ Use consistent naming (e.g., "discovery" not "Discovery")
- ✅ Keep board structure simple and clear

### 3. Naming Conventions

- ✅ Use hunt names that are descriptive and searchable
- ✅ Include feature type in issue title (🦁 Feature Name)
- ✅ Use labels consistently (hunt, feature, bug, etc.)

### 4. Rate Limit Awareness

- ✅ Check rate limits: `leo team checkGitHub`
- ✅ LionPack pauses automatically if limits are low
- ✅ Rate limit resets hourly

### 5. Regular Maintenance

- ✅ Archive old issues monthly
- ✅ Review and update workflow phases as needed
- ✅ Keep token permissions minimal (only needed scopes)

---

## Examples & Use Cases

### Use Case 1: Track Feature Development

```bash
# Start hunt for new feature
leo hunt start
# Creates GitHub issue with feature details

# Track progress through phases
leo hunt nextPhase hunt-1  # discovery → design
leo hunt nextPhase hunt-1  # design → development
leo hunt nextPhase hunt-1  # development → testing

# Complete when done
leo hunt complete hunt-1
# GitHub issue automatically closed
```

### Use Case 2: Team Collaboration

With GitHub integration, your team can:

- See hunt progress on GitHub board
- Comment on issues for discussion
- Assign issues to team members
- Link PRs to hunt issues
- Generate release notes from issues

### Use Case 3: Audit & Reporting

GitHub integration provides:

- Complete audit trail on GitHub
- Hunt metrics in completion comments
- Phase transition history
- Team member tracking

---

## Support & Feedback

For issues or feature requests:

- **Documentation**: See [LEO Workflow Kit Wiki](../wiki)
- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)

---

**Version:** 1.0.0 | **Status:** Stable | **Last Updated:** Phase 3 Week 1
