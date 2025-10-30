# 🎯 Dual-Mode Task Management Demo

LEO Workflow Kit now supports **two modes** for task management, giving you flexibility based on your workflow needs.

---

## 🔀 Two Modes, One Workflow

### Mode 1: Simple Checklist (Default)

**Perfect for:** Solo developers, quick prototypes, lightweight tracking

```bash
# Create spec
leo spec new "Add user authentication"

# Generate plan
leo plan 42

# Create task checklist (default mode)
leo tasks create 42
```

**Result:** Markdown checklist posted to issue #42

```markdown
## 📋 Implementation Tasks

### Phase 1: Foundation

- [ ] Set up project structure (Parallel)
- [ ] Configure database & migrations (Parallel)
- [ ] Set up testing framework (Parallel)
- [ ] Create basic data models (Parallel)

### Phase 2: Core Features

- [ ] Implement business logic (BLOCKED: Phase 1)
- [ ] Create API endpoints (BLOCKED: Phase 1)
      ...
```

**Benefits:**

- ✅ Fast - no extra GitHub API calls
- ✅ Lightweight - all tasks in one comment
- ✅ Simple - check boxes as you complete tasks

**Example:** [Issue #79](https://github.com/leonpagotto/leo-kit/issues/79)

---

### Mode 2: Child GitHub Issues (Teams)

**Perfect for:** Team collaboration, complex projects, GitHub Projects boards

```bash
# Create spec
leo spec new "Add payment processing with Stripe"

# Generate plan
leo plan 80

# Create child issues for each task
leo tasks create 80 --create-issues
```

**Result:** 16 separate GitHub issues created (#81-#96)

**Each child issue includes:**

- Clear title: `[Phase 1] Set up project structure`
- Parent link: References spec #80
- Phase information: Foundation, Core Features, Integration, Deploy
- Labels: `task`, `phase-1`, `blocked` (if applicable)
- Acceptance criteria: Tests, code review, completion

**Benefits:**

- ✅ Full GitHub Projects board visualization
- ✅ Individual assignees per task
- ✅ Separate discussions for each task
- ✅ Granular tracking and progress metrics
- ✅ Better for distributed teams

**Example:** [Issue #80](https://github.com/leonpagotto/leo-kit/issues/80) (parent spec)

- Child issues: [#81](https://github.com/leonpagotto/leo-kit/issues/81) - [#96](https://github.com/leonpagotto/leo-kit/issues/96)

---

## 🎨 Automatic Label Creation

When using `--create-issues`, LEO automatically creates these labels:

| Label        | Color      | Purpose                      |
| ------------ | ---------- | ---------------------------- |
| `task`       | Blue       | Identifies child tasks       |
| `phase-1`    | Purple     | Foundation phase             |
| `phase-2`    | Green      | Core features phase          |
| `phase-3`    | Yellow     | Integration phase            |
| `phase-4`    | Light Blue | Polish & Deploy phase        |
| `blocked`    | Red        | Task blocked by dependencies |
| `testing`    | Purple     | Testing-related tasks        |
| `deployment` | Yellow     | Deployment tasks             |

---

## 📊 Progress Tracking

Both modes support progress tracking:

```bash
leo tasks status 80
```

**Output:**

```
📊 Task Progress for Issue #80

Phase 1: Foundation
  ✅ Set up project structure
  ✅ Configure database & migrations
  🚧 Set up testing framework
  📝 Create basic data models

Phase 2: Core Features
  📝 Implement business logic (BLOCKED: Phase 1)
  📝 Create API endpoints (BLOCKED: Phase 1)
  ...

Overall Progress: 12/16 (75%) 🎯
```

---

## 🤝 Parent-Child Linking

Child issues are automatically linked to the parent spec:

**In parent issue (#80):**

```markdown
## 🔗 Child Task Issues

Created 16 child issues for detailed task tracking:

Phase 1:
• #81 - Set up project structure
• #82 - Configure database & migrations
• #83 - Set up testing framework
• #84 - Create basic data models

Phase 2:
• #85 - Implement business logic
...
```

**In child issue (#81):**

```markdown
Parent Spec: #80 - Add payment processing with Stripe
Phase: 1 - Foundation
Type: Parallel
```

---

## 🎯 When to Use Each Mode

### Use Mode 1 (Checklist) when:

- 👤 You're working solo
- ⚡ You want fast task creation
- 📝 You prefer lightweight tracking
- 🏃 You're building a quick prototype
- 📋 You don't need granular discussions

### Use Mode 2 (Child Issues) when:

- 👥 You're working with a team
- 🎨 You want GitHub Projects visualization
- 💬 You need separate discussions per task
- 👤 You need individual assignees
- 📊 You want detailed progress metrics
- 🔍 You need audit trails per task

---

## 🔄 Switching Modes

You can use **both modes** on the same spec:

```bash
# Start with simple checklist
leo tasks create 42

# Later, create child issues for specific phases
leo tasks create 42 --create-issues --phase 2
```

_(Note: `--phase` flag coming in Phase 2 Days 12-13)_

---

## 🚀 Real-World Examples

### Example 1: Solo Developer - API Feature

```bash
# Quick checklist for personal project
leo spec new "Add search API endpoint"
leo plan 97
leo tasks create 97

# Check off tasks as you complete them
# No extra GitHub issues cluttering your board
```

### Example 2: Team Project - Payment Integration

```bash
# Full GitHub tracking for team collaboration
leo spec new "Integrate Stripe payment gateway"
leo plan 98
leo tasks create 98 --create-issues

# Assign tasks to team members:
# Alice → #99 (Frontend integration)
# Bob → #100 (Backend API)
# Carol → #101 (Testing)
```

---

## 📈 Statistics

**Mode 1 Performance:**

- ⚡ 1-2 seconds to create checklist
- 📝 1 API call (post comment)
- 💾 Minimal GitHub API usage

**Mode 2 Performance:**

- 🚀 5-10 seconds for 16 child issues
- 📝 17+ API calls (create issues + link comment)
- 🎨 Full GitHub Projects integration
- 🏷️ Auto-creates 8 labels (one-time only)

---

## 🎓 Best Practices

1. **Default to Mode 1** - Start simple, upgrade if needed
2. **Use Mode 2 for Sprints** - Great for agile workflows
3. **Combine Both** - Checklist for quick tasks, child issues for complex ones
4. **Label Consistency** - LEO auto-creates labels, keep them clean
5. **Close Child Issues** - Progress tracking works when you close tasks

---

## 🔮 Coming Soon (Phase 2 Days 12-13)

- `--phase <number>` - Create child issues for specific phase only
- `leo spec extend` - Add new tasks to existing specs
- Parent-child dependency automation
- GitHub Projects board auto-creation

---

**Dual-mode task management is available in LEO Workflow Kit v5.1.1+**

Install: `npm install -g @leonpagotto/leo-kit`
