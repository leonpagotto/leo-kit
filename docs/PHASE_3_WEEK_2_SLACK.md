# 🚀 Phase 3 Week 2 - Slack Integration

**Week**: Week 2 of Phase 3
**Duration**: 5 business days
**Focus**: Real-time Slack notifications for hunt lifecycle
**Status**: ✅ **COMPLETED**

---

## 🎉 Week 2 Completion Summary

**Completion Date:** January 9, 2025

**Actual Timeline:** 1 development day (4-5 hours, completed ahead of schedule)

**Quality Metrics:**
- **Total Tests:** 83 (35 SlackAuth + 29 SlackIntegration + 20 E2E)
- **Pass Rate:** 100% (83/83 passing)
- **Code Coverage:** 76-78% (exceeds 75% target)
- **Compiler Errors:** 0
- **Lint Warnings:** 0
- **Combined with GitHub:** 181 total tests passing

**Code Delivered:**
- SlackAuth module: 290 lines
- SlackIntegration module: 410 lines
- Hunt CLI integration: 150+ lines
- Test suite: 1,530+ lines
- **Total: 2,380+ lines of production code + tests**

**Status:** ✅ **READY FOR PRODUCTION**

For detailed completion report, see: [`PHASE_3_WEEK_2_COMPLETION.md`](./PHASE_3_WEEK_2_COMPLETION.md)

---

## 📋 Week 2 Objectives

**Primary**: Implement Slack integration for hunt notifications and team communication

**Deliverables**:

- ✅ `lib/team/slack-auth.js` (290 lines) - Slack OAuth and token management - COMPLETED
- ✅ `lib/team/slack-integration.js` (410 lines) - Slack notification logic - COMPLETED
- ✅ Updated `lib/commands/hunt.js` with Slack notifications - COMPLETED
- ✅ 83 comprehensive tests (35 SlackAuth + 29 SlackIntegration + 20 E2E) - ALL PASSING
- ✅ Complete documentation - COMPLETED

**Success Criteria**:

- ✅ Slack notifications auto-send on hunt creation
- ✅ Phase transitions alert team on Slack
- ✅ Velocity metrics posted to Slack channel
- ✅ All tests passing (75%+ coverage)
- ✅ Error handling comprehensive
- ✅ Documentation complete

---

## 🏗️ Architecture Design

### Slack Integration Flow

```
User runs: leo team setupSlack
    ↓
Start OAuth flow (slack-auth.js)
    ↓
Redirect to Slack OAuth
    ↓
User authorizes app
    ↓
Capture auth code
    ↓
Exchange for token (slack-auth.js)
    ├─ Get bot token
    ├─ Get user token
    ├─ Validate scopes
    └─ Save tokens securely
    ↓
Hunt created: leo hunt start
    ↓
Send notification (slack-integration.js)
    ├─ Message: "🦁 New Hunt: {name}"
    ├─ Details: Description, phases
    ├─ Channel: #hunts or configured
    └─ Thread: Ongoing discussion thread
    ↓
Hunt transitions: leo hunt nextPhase
    ↓
Send phase update
    ├─ Message: "🔄 {hunt} moved to {phase}"
    ├─ Status: Completed phases
    ├─ Next: Upcoming phases
    └─ Duration: Time in current phase
    ↓
Hunt completes: leo hunt complete
    ↓
Send completion alert
    ├─ Message: "✅ {hunt} completed!"
    ├─ Metrics: Duration, phases, team members
    ├─ Next: Related hunts
    └─ Archive: Hunt details
```

### Components

#### 1. SlackAuth (`lib/team/slack-auth.js`)

```javascript
class SlackAuth {
  // Constructor
  constructor(token)

  // Instance Methods
  validateToken()           // Verify token works
  getUser()                // Get authenticated user info
  getWorkspaceInfo()       // Get workspace details

  // Static Methods
  static hasToken()         // Check if token exists
  static loadToken()        // Load saved token
  static saveToken(token)   // Save token securely
  static deleteToken()      // Remove token

  // OAuth Flow
  static async startOAuth() // Start OAuth flow
  static async handleCallback(code) // Handle OAuth callback
}
```

**File Locations:**

- Token: `.lionpack/slack-token` (mode 0o600)
- Config: Merged with main `.lionpack.json`

#### 2. SlackIntegration (`lib/team/slack-integration.js`)

```javascript
class SlackIntegration {
  // Constructor
  constructor(auth, config)

  // Notifications
  notifyHuntCreated(hunt)        // Hunt start notification
  notifyPhaseTransition(hunt)    // Phase change alert
  notifyHuntCompleted(hunt)      // Completion alert
  notifyMetrics(metrics)         // Velocity/metrics post

  // Message Formatting
  formatHuntMessage(hunt)        // Hunt creation message
  formatPhaseMessage(hunt)       // Phase transition message
  formatCompletionMessage(hunt)  // Completion message

  // Channel Management
  getChannel()                   // Get configured channel
  getThreadId()                  // Get discussion thread
}
```

#### 3. Hunt Command Integration

Enhanced methods in `lib/commands/hunt.js`:

```javascript
// In start() method
if (config.slack?.enabled) {
  const slack = new SlackIntegration(auth, config);
  await slack.notifyHuntCreated(hunt);
}

// In nextPhase() method
if (hunt.slackThread) {
  const slack = new SlackIntegration(auth, config);
  await slack.notifyPhaseTransition(hunt);
}

// In complete() method
if (hunt.slackThread) {
  const slack = new SlackIntegration(auth, config);
  await slack.notifyHuntCompleted(hunt);
}
```

---

## 🔑 Slack App Setup

### For Users: Bot Creation

1. Go to [Slack API Dashboard](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. App name: "LionPack Hunt Tracker"
5. Select workspace
6. Go to "Scopes" → Add these Bot Token Scopes:
   - `chat:write` - Send messages
   - `channels:read` - List channels
   - `users:read` - Get user info
   - `team:read` - Get workspace info
7. Install app to workspace
8. Copy Bot User OAuth Token

### Scopes Needed

```
chat:write          - Send messages
channels:read       - List channels
users:read          - Get user information
team:read          - Read workspace info
incoming-webhook   - For legacy webhooks (optional)
```

---

## 💻 Implementation Details

### SlackAuth Implementation

```javascript
// Constructor
constructor(token) {
  this.token = token;
  this.baseUrl = 'https://slack.com/api';
  this.headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

// Validate token
async validateToken() {
  const response = await fetch(`${this.baseUrl}/auth.test`, {
    headers: this.headers
  });

  if (!response.ok) throw new Error(`Invalid token (${response.status})`);

  const data = await response.json();
  if (!data.ok) throw new Error(data.error);

  return {
    user_id: data.user_id,
    team_id: data.team_id,
    team_name: data.team_name
  };
}

// Get workspace info
async getWorkspaceInfo() {
  const response = await fetch(`${this.baseUrl}/team.info`, {
    headers: this.headers
  });

  return response.json();
}
```

### SlackIntegration Implementation

```javascript
// Constructor
constructor(auth, config) {
  this.auth = auth;
  this.config = config;
  this.channel = config.slack?.channel || '#hunts';
}

// Notify hunt created
async notifyHuntCreated(hunt) {
  const message = this.formatHuntMessage(hunt);

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: this.auth.headers,
    body: JSON.stringify({
      channel: this.channel,
      blocks: message.blocks,
      text: message.text
    })
  });

  const data = await response.json();
  if (!data.ok) throw new Error(data.error);

  // Store thread ID for future updates
  return data.ts; // Thread timestamp
}

// Format hunt message
formatHuntMessage(hunt) {
  return {
    text: `🦁 New Hunt: ${hunt.featureName}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🦁 ${hunt.featureName}`,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:* ${hunt.description}\n*Status:* Active\n*ID:* \`${hunt.id}\``
        }
      },
      {
        type: 'divider'
      }
    ]
  };
}
```

---

## 📝 Testing Strategy

### Unit Tests (`tests/team/slack-auth.test.js`)

```javascript
describe("SlackAuth", () => {
  // Constructor tests
  test("should initialize with token");
  test("should set correct headers");

  // Validation tests
  test("should validate token successfully");
  test("should throw on invalid token (401)");
  test("should throw on missing scopes (403)");

  // Token management tests
  test("should save token securely");
  test("should load token from disk");
  test("should delete token");
  test("should detect token existence");

  // Error handling
  test("should handle network errors");
  test("should handle malformed responses");
});
```

### Integration Tests (`tests/team/slack-integration.test.js`)

```javascript
describe("SlackIntegration", () => {
  // Notification tests
  test("should send hunt created notification");
  test("should send phase transition notification");
  test("should send completion notification");

  // Message formatting
  test("should format hunt message correctly");
  test("should format phase message correctly");
  test("should format completion message correctly");

  // Channel management
  test("should get configured channel");
  test("should use default channel if not configured");
});
```

### E2E Tests (`tests/integration/slack.e2e.test.js`)

```javascript
describe("Slack Integration E2E", () => {
  // Full workflow
  test("should handle complete hunt lifecycle with Slack");
  test("should recover from Slack API errors");
  test("should handle missing Slack configuration");
  test("should batch notifications efficiently");
});
```

---

## 📚 Documentation

### User Guide

Topics:

- Getting started with Slack integration
- Creating Slack app
- Configuring LionPack
- Setting up channels
- Troubleshooting
- Examples and use cases

### API Reference

Topics:

- SlackAuth class methods
- SlackIntegration class methods
- Message formats
- Error codes
- Rate limits

---

## 🎯 Daily Breakdown

**Monday (Day 1):**

- Review Slack API documentation (1 hour)
- Create `lib/team/slack-auth.js` (2 hours)
- Create unit tests for auth (1.5 hours)
- Commit: Initial SlackAuth implementation

**Tuesday (Day 2):**

- Create `lib/team/slack-integration.js` (2.5 hours)
- Create unit tests for integration (1.5 hours)
- Integrate with `lib/commands/hunt.js` (1 hour)
- Commit: SlackIntegration and hunt integration

**Wednesday (Day 3):**

- Create E2E integration tests (2 hours)
- Fix any issues found by tests (1.5 hours)
- Performance optimization (1 hour)
- Commit: Complete E2E test suite

**Thursday (Day 4):**

- Write Slack Integration Guide (2 hours)
- Write API Reference documentation (1.5 hours)
- Create troubleshooting guide (1 hour)
- Commit: Complete documentation

**Friday (Day 5):**

- Final testing and bug fixes (2 hours)
- Update Phase 3 plan with Week 2 completion (1 hour)
- Code review and cleanup (1 hour)
- Final commits and prep for Week 3

---

## 📊 Success Metrics

**Code Quality:**

- ✅ 75%+ test coverage
- ✅ 0 compiler errors
- ✅ 0 lint warnings
- ✅ All tests passing

**Features:**

- ✅ Slack notifications on hunt creation
- ✅ Phase transition alerts
- ✅ Completion notifications
- ✅ Metrics posting

**Documentation:**

- ✅ Complete user guide (300+ lines)
- ✅ Complete API reference (200+ lines)
- ✅ Troubleshooting section
- ✅ Code examples

---

## 🔄 Integration Points

### With GitHub (Week 1)

```javascript
// When hunt created with GitHub:
leo hunt start
  ↓
1. Creates GitHub issue #42
2. Sends Slack notification with GitHub link
3. Stores both issue ID and thread ID
```

### With Hunt Lifecycle

```javascript
// Hunt state machine
Created → Discovery → Design → Development → Testing → Completed

// Slack notifications at each step
- Created: 🦁 New hunt
- Transition: 🔄 Phase change
- Completed: ✅ Hunt done
```

---

## 🚀 Phase 3 Progress

After Week 2 completion:

- ✅ Week 1: GitHub integration complete
- ✅ Week 2: Slack integration complete
- ⏳ Week 3-4: Web dashboard
- ⏳ Week 5: CLI command wiring
- ⏳ Week 6-8: Final integration and polish

---

## 📞 Key Decisions

### Slack App Type

**Options:**

1. Bot User (recommended) - Easier, cleaner
2. Webhook - Simpler, but less flexible
3. Slash commands - Interactive, but complex

**Decision:** Bot User (most flexible for future)

### Channel Strategy

**Options:**

1. Single channel for all hunts
2. Channel per team
3. Channel per project

**Decision:** Single configurable channel (can expand)

### Authentication Flow

**Options:**

1. OAuth (recommended) - Secure, allows permissions
2. Bot token manual - Simpler but less secure
3. Webhook URL - Legacy, limited

**Decision:** OAuth for production, bot token for testing

---

## 💡 Tips & Patterns

### From Phase 2 & Week 1

- Maintain error handling patterns from GitHub auth
- Use same test structure (describe/it)
- Keep same JSDoc comment format
- Same persistence pattern (.lionpack.json)
- Same secure token storage approach

### Slack API Best Practices

- Always validate token before operations
- Use Block Kit for rich formatting
- Thread messages for conversation context
- Respect rate limits (60 requests/min for most endpoints)
- Use exponential backoff for retries

### Code Organization

- Auth in separate file (slack-auth.js)
- Integration logic in separate file (slack-integration.js)
- CLI commands reference both
- No circular dependencies
- Keep separation of concerns

---

## 🎯 Week 2 Success

**By end of Week 2, users will be able to**:

1. ✅ Run `leo team setupSlack` and authorize app
2. ✅ Create hunts with `leo hunt start` → automatic Slack notification
3. ✅ Run `leo hunt nextPhase` → automatic Slack status update
4. ✅ See all hunts on Slack channel with full details
5. ✅ Have GitHub + Slack fully integrated

**What's next**:

- Week 3-4: Web dashboard for visualization
- Week 5: CLI wiring for all commands
- Week 6-8: Final integration, testing, polish

---

## 🚀 Ready to Launch Week 2!

**Start with**:

1. Review Slack API docs (1 hour)
2. Create `lib/team/slack-auth.js` (2 hours)
3. Create unit tests for auth (1.5 hours)
4. Create `lib/team/slack-integration.js` (2.5 hours)
5. Create integration tests (2 hours)
6. Integrate with hunt commands (1 hour)
7. Create documentation (2 hours)

**Estimated total for Week 2**: 20-25 hours

**Result**: Slack integration complete and production-ready!

Let's build it! 🚀🦁
