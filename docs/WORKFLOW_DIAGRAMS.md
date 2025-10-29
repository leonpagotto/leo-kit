# LEO Workflow Kit - Simple Visual Guide

> **Easy-to-understand diagrams showing how LEO works**

---

## 📌 Diagram 1: How the Orchestrator Routes Tasks

When you describe work to LEO, the Orchestrator Agent analyzes it and sends it to the right specialist:

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 YOU: "Add a login button to the homepage"                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎛️  ORCHESTRATOR AGENT                                         │
│  ├─ Reads your request                                          │
│  ├─ Looks for keywords: "button", "homepage" = UI work          │
│  └─ Routes to → FRONTEND AGENT 🎨                               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  🎨 FRONTEND AGENT                                               │
│  ├─ Creates button component                                    │
│  ├─ Adds styling & accessibility                                │
│  └─ Creates GitHub issue with proper labels                     │
└─────────────────────────────────────────────────────────────────┘
```

**Keywords that trigger each agent:**

- **Frontend** 🎨: button, UI, page, component, style, responsive, layout
- **Backend** ⚙️: API, database, auth, endpoint, server, security
- **DevOps** 🚀: deploy, CI/CD, Docker, hosting, infrastructure
- **Testing** 🧪: test, coverage, E2E, unit test, integration
- **Documentation** 📚: docs, README, guide, comments, API docs

---

## 📌 Diagram 2: Spec-First Decision Making

LEO decides whether to create a detailed specification or go straight to work:

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 YOU: Describe what you want to build                        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ How complex? │
              └──────┬───────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
    SIMPLE TASK              COMPLEX FEATURE
    (< 1 day)                  (> 1 week)
         │                        │
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌──────────────────────┐
│ ✅ DIRECT ISSUE  │     │ 📋 CREATE SPEC FIRST │
│                  │     │                      │
│ • Bug fix        │     │ 1. Create spec issue │
│ • Quick task     │     │ 2. Ask user review   │
│ • Simple feature │     │ 3. Get approval      │
│ • Documentation  │     │ 4. Break into tasks  │
│                  │     │ 5. Create issues     │
│ ⬇                │     │ ⬇                    │
│ Start work now   │     │ Then start work      │
└──────────────────┘     └──────────────────────┘
```

**Simple Examples:**

- Fix typo in README ✅
- Add error message ✅
- Update color scheme ✅

**Complex Examples:**

- Build authentication system 📋
- Create admin dashboard 📋
- Add payment processing 📋

---

## 📌 Diagram 3: Simple Issue Creation Workflow

For simple tasks, LEO creates an issue and you start working immediately:

```
Step 1: YOU DESCRIBE WORK
┌─────────────────────────────────────────┐
│ "Fix the broken link in the footer"    │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 2: ORCHESTRATOR ANALYZES
┌─────────────────────────────────────────┐
│ Type: Bug                               │
│ Priority: Medium                        │
│ Component: Documentation                │
│ Agent: Documentation Agent 📚           │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 3: CREATE GITHUB ISSUE
┌─────────────────────────────────────────┐
│ gh issue create                         │
│ --title "Fix broken footer link"       │
│ --label "bug,documentation,P2"          │
│ --body "Description with context"       │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 4: ADD TO PROJECT BOARD
┌─────────────────────────────────────────┐
│ Column: 📋 Todo                         │
│ Status: Todo                            │
│ Issue #42 created ✅                    │
└────────────────┬────────────────────────┘
                 │
                 ▼
Step 5: CHECK AUTO-RESOLVE SETTING
┌─────────────────────────────────────────┐
│ Is auto-resolve enabled? (default: YES) │
│                                         │
│ YES ✅ → Start work immediately         │
│ NO  ⏸️  → Wait for your approval       │
└─────────────────────────────────────────┘
```

**Config setting (`.leorc.json`):**

```json
{
  "auto-resolve": true // ✅ Start work immediately (default)
  // ⏸️  false = wait for approval
}
```

---

## 📌 Diagram 4: Complete Spec Workflow (Complex Features)

For complex features, LEO guides you through a structured specification process:

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: CREATE SPECIFICATION                                 │
│ Command: leo spec new "Build user authentication"           │
│                                                              │
│ Creates GitHub issue with template:                         │
│ ✓ Problem Statement                                         │
│ ✓ Proposed Solution                                         │
│ ✓ Acceptance Criteria                                       │
│ ✓ Technical Details                                         │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: CLARIFY REQUIREMENTS                                 │
│ Command: leo clarify 42                                     │
│                                                              │
│ AI analyzes spec and asks questions:                        │
│ • "What authentication methods? (OAuth, email, etc.)"       │
│ • "Should we support 2FA?"                                  │
│ • "What's the session timeout?"                             │
│ You answer in issue comments ✍️                             │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: GENERATE IMPLEMENTATION PLAN                         │
│ Command: leo plan 42                                        │
│                                                              │
│ Creates checklist of tasks:                                 │
│ ☐ Set up authentication middleware                          │
│ ☐ Create login API endpoint                                 │
│ ☐ Add password hashing                                      │
│ ☐ Implement session management                              │
│ ☐ Create login UI component                                 │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: CREATE TASKS                                         │
│ Command: leo tasks create 42                                │
│                                                              │
│ Two modes:                                                   │
│ 📝 Checklist Mode: Tasks stay in spec (simple)              │
│ 🔗 Child Issues Mode: Each task = separate issue (teams)    │
│                                                              │
│ leo tasks create 42 --create-issues (for parallel work)     │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: TRACK PROGRESS                                       │
│ Command: leo tasks status 42                                │
│                                                              │
│ Shows: "5/10 tasks completed (50%)"                         │
│ Updates project board automatically                         │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│ STEP 6: EXTEND (OPTIONAL)                                    │
│ Command: leo spec-extend 42 "Add OAuth2 support"           │
│                                                              │
│ • Merges new requirements into existing spec                │
│ • Preserves original requirements                           │
│ • Can create new child issues                               │
└──────────────────────────────────────────────────────────────┘
```

**Why specs are GitHub issues, not files:**

- ✅ 5x faster (no git commits)
- ✅ Real-time collaboration
- ✅ No merge conflicts
- ✅ Non-technical team members can contribute
- ✅ Auto-syncs with project boards

---

## 📌 Diagram 5: The Complete LEO Journey

From installation to done - the full picture:

```
┌─────────┐
│ INSTALL │  npm install -g leo-workflow-kit
└────┬────┘
     │
     ▼
┌─────────┐
│  INIT   │  cd your-project && leo init
└────┬────┘  Creates: .leorc.json, GitHub Project, Labels
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│ DESCRIBE WORK (3 options)                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Option 1: Interactive                                  │
│ $ leo issue                                            │
│ → Prompts guide you step-by-step                      │
│                                                         │
│ Option 2: Just talk to GitHub Copilot                 │
│ "Hey Copilot, add a dark mode toggle"                 │
│ → LEO auto-creates issue from conversation             │
│                                                         │
│ Option 3: Spec for complex features                   │
│ $ leo spec new "Build payment system"                 │
│ → Creates structured specification                     │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ ORCHESTRATOR ROUTES TO SPECIALIST                       │
│                                                         │
│  🎨 Frontend → UI/Components/Styling                   │
│  ⚙️  Backend → APIs/Database/Auth                      │
│  🚀 DevOps → Deploy/CI-CD/Infrastructure               │
│  🧪 Testing → Tests/Coverage/QA                        │
│  📚 Docs → Guides/API Docs/Comments                    │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ GITHUB ISSUE CREATED                                    │
│ ✓ Title, description, labels                           │
│ ✓ Added to project board (📋 Todo column)              │
│ ✓ Priority, component, estimates set                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ START WORKING                                           │
│ 1. Create branch: feature/issue-42                     │
│ 2. Write code (agent guides you)                       │
│ 3. Commit: "feat: add dark mode (#42)"                │
│    ⚠️ Keep message < 72 characters!                    │
│ 4. Auto-update status: 📋 Todo → 🚧 In Progress        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ CREATE PULL REQUEST                                     │
│ • Include "Closes #42" in description                  │
│ • Code review happens                                  │
│ • Merge to main                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ ✅ DONE!                                                │
│ • Issue auto-closes                                    │
│ • Status: 🚧 In Progress → ✅ Done                     │
│ • Project board updates automatically                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

1. **Orchestrator is like a smart traffic controller**

   - Reads your request
   - Routes to the right specialist
   - Coordinates multiple agents if needed

2. **Spec-first saves time on complex features**

   - < 1 day = direct issue
   - > 1 week = create spec first
   - AI helps clarify requirements

3. **Everything is automated**

   - Issue creation
   - Project board updates
   - Status tracking
   - No manual work!

4. **Specs are GitHub issues, not files**

   - Faster collaboration
   - No git conflicts
   - Everyone can contribute

5. **Two working modes**
   - `auto-resolve: true` → Start immediately (default)
   - `auto-resolve: false` → Wait for approval

---

## 📚 Quick Command Reference

| Command                    | What it does                             |
| -------------------------- | ---------------------------------------- |
| `leo init`                 | Set up LEO in your project               |
| `leo issue`                | Create simple issue (interactive)        |
| `leo spec new "..."`       | Create specification for complex feature |
| `leo clarify 42`           | Ask AI to generate clarifying questions  |
| `leo plan 42`              | Generate implementation plan from spec   |
| `leo tasks create 42`      | Create task checklist (or child issues)  |
| `leo tasks status 42`      | Check progress (e.g., "5/10 completed")  |
| `leo spec-extend 42 "..."` | Add new requirements to existing spec    |
| `leo health`               | Check LEO setup health                   |
| `leo agent list`           | See all available agents                 |

---

**Made with ❤️ to make GitHub workflows simple and fun!**
