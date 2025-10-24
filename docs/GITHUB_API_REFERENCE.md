# GitHub Integration - API Reference

Complete technical reference for GitHub integration APIs and classes.

**Version:** 1.0.0 | **Status:** Stable

---

## Table of Contents

1. [GitHubAuth API](#githubaauth-api)
2. [GitHubAPI API](#githubapi-api)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Examples](#examples)

---

## GitHubAuth API

### Overview

The `GitHubAuth` class manages GitHub authentication and token handling.

**File:** `lib/team/github-auth.js`
**Size:** 278 lines
**Coverage:** 89%

### Constructor

```javascript
const GitHubAuth = require('./github-auth');
const auth = new GitHubAuth(token);
```

**Parameters:**
- `token` (string): GitHub Personal Access Token

### Instance Methods

#### `validateToken()`

Validate the GitHub token against the GitHub API.

```javascript
async validateToken() → Promise<User>
```

**Returns:**
```javascript
{
  id: number,           // GitHub user ID
  login: string,        // GitHub username
  name: string,         // Full name
  email: string,        // Email address
  avatar_url: string,   // Avatar URL
  html_url: string      // Profile URL
}
```

**Throws:**
- `Error: Invalid token (401)` - Token is invalid or expired
- `Error: Insufficient permissions (403)` - Token lacks required scopes
- `Error: GitHub API error (5xx)` - Server error

**Example:**
```javascript
try {
  const user = await auth.validateToken();
  console.log(`Authenticated as @${user.login}`);
} catch (error) {
  if (error.message.includes('401')) {
    console.log('Invalid token');
  }
}
```

#### `getUser()`

Get information about the authenticated user.

```javascript
async getUser() → Promise<User>
```

**Returns:**
```javascript
{
  id: number,
  login: string,
  name: string,
  email: string,
  bio: string,
  company: string,
  location: string,
  public_repos: number,
  followers: number,
  following: number,
  created_at: string,   // ISO date
  updated_at: string    // ISO date
}
```

**Example:**
```javascript
const user = await auth.getUser();
console.log(`User: ${user.name} (@${user.login})`);
console.log(`Repos: ${user.public_repos}`);
console.log(`Followers: ${user.followers}`);
```

#### `getRateLimit()`

Get current GitHub API rate limit status.

```javascript
getRateLimit() → RateLimit
```

**Returns:**
```javascript
{
  remaining: number,    // Remaining API calls this hour
  limit: number,        // Total limit per hour
  reset: number         // Unix timestamp when limit resets
}
```

**Example:**
```javascript
const limits = auth.getRateLimit();
console.log(`API Calls: ${limits.remaining}/${limits.limit}`);

const resetTime = new Date(limits.reset * 1000);
console.log(`Resets at: ${resetTime.toLocaleString()}`);
```

#### `isNearRateLimit()`

Check if rate limit is approaching threshold (≤ 250 remaining).

```javascript
isNearRateLimit() → boolean
```

**Returns:**
- `true` - Less than 250 API calls remaining
- `false` - More than 250 API calls available

**Example:**
```javascript
if (auth.isNearRateLimit()) {
  console.warn('Rate limit approaching - waiting before next request');
  await sleep(60000);  // Wait 60 seconds
}
```

### Static Methods

#### `GitHubAuth.hasToken()`

Check if a GitHub token exists in local storage.

```javascript
static hasToken() → boolean
```

**Returns:**
- `true` - Token file exists at `.lionpack/github-token`
- `false` - No token found

**Example:**
```javascript
if (GitHubAuth.hasToken()) {
  const token = GitHubAuth.loadToken();
  const auth = new GitHubAuth(token);
}
```

#### `GitHubAuth.loadToken()`

Load stored token from disk.

```javascript
static loadToken() → string
```

**Returns:** Token string

**Throws:**
- `Error: No GitHub token found` - Token file doesn't exist

**Example:**
```javascript
try {
  const token = GitHubAuth.loadToken();
  const auth = new GitHubAuth(token);
} catch (error) {
  console.log('GitHub not configured');
}
```

#### `GitHubAuth.saveToken(token)`

Save token to disk securely.

```javascript
static saveToken(token) → void
```

**Parameters:**
- `token` (string): GitHub Personal Access Token

**File Permissions:** 0o600 (user read/write only)
**Location:** `.lionpack/github-token`

**Example:**
```javascript
const token = 'gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
GitHubAuth.saveToken(token);
console.log('Token saved securely');
```

#### `GitHubAuth.deleteToken()`

Delete stored token from disk.

```javascript
static deleteToken() → void
```

**Example:**
```javascript
GitHubAuth.deleteToken();
console.log('Token deleted');
```

---

## GitHubAPI API

### Overview

The `GitHubAPI` class handles GitHub REST API operations for projects, issues, and boards.

**File:** `lib/team/github-api.js`
**Size:** 511 lines
**Coverage:** 90%

### Constructor

```javascript
const GitHubAPI = require('./github-api');
const api = new GitHubAPI(auth);
```

**Parameters:**
- `auth` (GitHubAuth): Authenticated GitHubAuth instance

### Instance Methods

#### `createProjectBoard(name, columns)`

Create a GitHub project board.

```javascript
async createProjectBoard(name, columns) → Promise<Board>
```

**Parameters:**
- `name` (string): Project board name
- `columns` (string[]): Column names in order

**Returns:**
```javascript
{
  id: string,           // Project ID
  name: string,
  url: string,
  columns: [
    {
      id: string,       // Column ID
      name: string,
      cards_url: string
    },
    ...
  ]
}
```

**Throws:**
- `Error` - GitHub API error

**Example:**
```javascript
const board = await api.createProjectBoard('LionPack Board', [
  'discovery',
  'design',
  'development',
  'testing'
]);

console.log(`Board created: ${board.name}`);
console.log(`Columns: ${board.columns.map(c => c.name).join(', ')}`);
```

#### `createIssue(repo, title, description, labels)`

Create a GitHub issue.

```javascript
async createIssue(repo, title, description, labels) → Promise<Issue>
```

**Parameters:**
- `repo` (string): Repository in format "owner/repo"
- `title` (string): Issue title
- `description` (string): Issue body/description
- `labels` (string[]): Label names

**Returns:**
```javascript
{
  id: number,
  number: number,       // Issue number (#42)
  title: string,
  body: string,
  state: string,        // 'open' or 'closed'
  url: string,
  html_url: string,
  created_at: string,   // ISO date
  updated_at: string,
  labels: [
    { name: string, color: string },
    ...
  ]
}
```

**Example:**
```javascript
const issue = await api.createIssue(
  'octocat/Hello-World',
  '🦁 User Authentication',
  'Implement OAuth2 authentication\n\nHunt ID: hunt-123',
  ['feature', 'hunt', 'p1']
);

console.log(`Issue created: #${issue.number}`);
console.log(`URL: ${issue.html_url}`);
```

#### `updateIssue(repo, number, updates)`

Update issue properties.

```javascript
async updateIssue(repo, number, updates) → Promise<Issue>
```

**Parameters:**
- `repo` (string): Repository "owner/repo"
- `number` (number): Issue number
- `updates` (object): Properties to update
  - `state` (string): 'open' or 'closed'
  - `title` (string): New title
  - `body` (string): New description
  - `labels` (string[]): New labels

**Returns:** Updated issue object

**Example:**
```javascript
// Close an issue
const issue = await api.updateIssue('octocat/Hello-World', 42, {
  state: 'closed'
});

// Update multiple properties
await api.updateIssue('octocat/Hello-World', 42, {
  state: 'closed',
  title: '✅ User Authentication (Completed)',
  labels: ['feature', 'completed']
});
```

#### `addLabel(repo, number, labels)`

Add labels to an issue.

```javascript
async addLabel(repo, number, labels) → Promise<void>
```

**Parameters:**
- `repo` (string): Repository "owner/repo"
- `number` (number): Issue number
- `labels` (string[]): Labels to add

**Example:**
```javascript
await api.addLabel('octocat/Hello-World', 42, ['urgent', 'backend']);
```

#### `addComment(repo, number, comment)`

Add comment to an issue.

```javascript
async addComment(repo, number, comment) → Promise<Comment>
```

**Parameters:**
- `repo` (string): Repository "owner/repo"
- `number` (number): Issue number
- `comment` (string): Comment text (supports Markdown)

**Returns:**
```javascript
{
  id: number,
  body: string,
  user: { login: string, ... },
  created_at: string,
  updated_at: string,
  html_url: string
}
```

**Example:**
```javascript
await api.addComment('octocat/Hello-World', 42, `
🔄 **Status Update**

- Moved to: Design phase
- Assigned to: @alice
- Estimated: 2 days

[View Hunt](hunt-link)
`);
```

#### `addIssueToBoard(projectId, issueNumber, columnId)`

Add issue to project board column.

```javascript
async addIssueToBoard(projectId, issueNumber, columnId) → Promise<void>
```

**Parameters:**
- `projectId` (string): Project ID
- `issueNumber` (number): Issue number
- `columnId` (string): Target column ID

**Example:**
```javascript
// Add issue #42 to first column (Discovery)
await api.addIssueToBoard('P123', 42, 'C1');
```

#### `moveIssueColumn(projectId, issueNumber, targetColumnId)`

Move issue between board columns.

```javascript
async moveIssueColumn(projectId, issueNumber, targetColumnId) → Promise<void>
```

**Parameters:**
- `projectId` (string): Project ID
- `issueNumber` (number): Issue number
- `targetColumnId` (string): Target column ID

**Example:**
```javascript
// Move from discovery (C1) to design (C2)
await api.moveIssueColumn('P123', 42, 'C2');

// Move to development (C3)
await api.moveIssueColumn('P123', 42, 'C3');
```

#### `getProject(projectId)`

Get project details.

```javascript
async getProject(projectId) → Promise<Project>
```

**Returns:**
```javascript
{
  id: string,
  name: string,
  owner: { login: string, ... },
  columns: [
    { id: string, name: string, ... },
    ...
  ]
}
```

#### `getIssue(repo, number)`

Get issue details.

```javascript
async getIssue(repo, number) → Promise<Issue>
```

#### `getBoardColumns(projectId)`

Get all columns in a project.

```javascript
async getBoardColumns(projectId) → Promise<Column[]>
```

**Returns:**
```javascript
[
  { id: string, name: string, cards_url: string },
  ...
]
```

#### `getProjectIssues(projectId)`

Get all issues in a project.

```javascript
async getProjectIssues(projectId) → Promise<Issue[]>
```

---

## Error Handling

### Common Errors

#### Authentication Errors

```javascript
// Invalid Token
Error: "Invalid token (401)"
// Solution: Check token validity, regenerate if needed

// Insufficient Scopes
Error: "Insufficient permissions (403)"
// Solution: Regenerate token with correct scopes

// Rate Limit
Error: "API rate limit exceeded"
// Solution: Wait for limit reset, check with getRateLimit()
```

#### API Errors

```javascript
try {
  await api.createIssue('owner/repo', 'Title', 'Body', []);
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Repository not found');
  } else if (error.message.includes('422')) {
    console.log('Validation error - check parameters');
  } else if (error.message.includes('5')) {
    console.log('GitHub server error - retrying');
  }
}
```

---

## Rate Limiting

GitHub API has rate limits:
- **Limit:** 5,000 requests per hour (authenticated)
- **Reset:** Hourly

LionPack automatically:
- Tracks remaining requests
- Pauses when approaching limit (≤250 remaining)
- Includes retry logic for transient failures

```javascript
// Check rate limit
const limits = auth.getRateLimit();
console.log(`Remaining: ${limits.remaining}`);

// Check if approaching threshold
if (auth.isNearRateLimit()) {
  console.log('Pausing for rate limit safety');
  await new Promise(r => setTimeout(r, 60000));  // 1 minute
}
```

---

## Examples

### Complete Workflow

```javascript
const GitHubAuth = require('./github-auth');
const GitHubAPI = require('./github-api');

// 1. Load or create authentication
const token = GitHubAuth.loadToken();
const auth = new GitHubAuth(token);

// 2. Validate token
const user = await auth.validateToken();
console.log(`Authenticated as @${user.login}`);

// 3. Create API instance
const api = new GitHubAPI(auth);

// 4. Create project board
const board = await api.createProjectBoard('My Project', [
  'todo',
  'in-progress',
  'review',
  'done'
]);
console.log(`Board: ${board.name} (${board.id})`);

// 5. Create issue
const issue = await api.createIssue(
  'owner/repo',
  'Implement feature',
  'Detailed description',
  ['feature', 'bug']
);
console.log(`Issue: #${issue.number}`);

// 6. Add to board
await api.addIssueToBoard(board.id, issue.number, board.columns[0].id);

// 7. Update status
await api.moveIssueColumn(board.id, issue.number, board.columns[1].id);
await api.addComment('owner/repo', issue.number, '🚀 Started work');

// 8. Complete
await api.updateIssue('owner/repo', issue.number, { state: 'closed' });
await api.addComment('owner/repo', issue.number, '✅ Done');
```

---

**Version:** 1.0.0 | **Status:** Stable | **Last Updated:** Phase 3 Week 1
