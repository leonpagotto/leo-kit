# 🦁 LionPack Quick Reference Guide

**Team-Based Development Workflow for Small Packs (3-4 people)**

> The smallest unit of special forces is the fire team of 4-5 members. The lion is a team hunter... Four to five are better than one. – Your vision

---

## 📖 One-Minute Overview

**LionPack** transforms team development using a **pack hunting metaphor**:

- **4 Specialized Roles** - Each person has a clear responsibility
- **Automatic Handoffs** - Work automatically passes to the next role
- **Seamless Coordination** - Team hunts together, not sequentially
- **Velocity Tracking** - Measure team efficiency and performance

| Role | Emoji | Focus | Duration | Key Skill |
|------|-------|-------|----------|-----------|
| Requirements Hunter | 🔍 | Define scope & criteria | 2-4h | Product thinking |
| Spec Refiner | 📋 | Architecture & task breakdown | 4-8h | System design |
| Implementation Hunter | 🎯 | Code implementation | 1-3 days | Programming |
| QA & Testing | ✅ | Validate & verify | 2-4h | Quality mindset |

---

## 🔄 The Hunt Cycle

```
START: Feature Request
  ↓
🔍 Role 1 (Requirements Hunter)
   └─ Analyzes requirements (2-4 hours)
   └─ Creates problem statement
   └─ Defines success criteria
  ↓ [Handoff]
📋 Role 2 (Spec Refiner)
   └─ Designs architecture (4-8 hours)
   └─ Creates 3-5 implementation issues
   └─ Identifies dependencies
  ↓ [Handoff]
🎯 Role 3 (Implementation Hunter)
   └─ Codes features (1-3 days)
   └─ Tests locally
   └─ Creates PRs
  ↓ [Handoff]
✅ Role 4 (QA & Testing)
   └─ Validates implementation (2-4 hours)
   └─ Runs acceptance tests
   └─ Approves merge
  ↓
DONE: Hunt Complete! 🏆
   └─ Issue closed
   └─ Metrics recorded
   └─ Next hunt begins
```

---

## 💡 Key Advantages

### For Small Teams

✅ **Clear Responsibilities** - Everyone knows their role  
✅ **No Bottlenecks** - Roles work in parallel when possible  
✅ **Fast Handoffs** - Automatic transitions < 5 minutes  
✅ **High Quality** - Specialization leads to better code  
✅ **Faster Velocity** - 45-60 hours per hunt cycle vs 80+ hours in unstructured teams  

### Example: Building Authentication

```
Monday:
- 🔍 Requirements Hunter: Defines auth requirements (2 hours)

Monday PM:
- 📋 Spec Refiner: Creates auth spec + 5 implementation issues (6 hours)
- 🎯 Implementation Hunter: Starts first backend task

Tuesday-Wednesday:
- 🎯 Implementer: Codes 5 tasks in parallel
- ✅ QA prepares test plan

Thursday:
- 🎯 Implementer: Final testing + PR
- ✅ QA: Reviews + Merges

Friday:
- SHIPPED! 🚀

**Total Time: ~45 hours vs 2 weeks in traditional workflow**
```

---

## 🎯 The Four Roles Explained

### 1. 🔍 Requirements Hunter

**Mindset:** "What problem are we solving?"

**Activities:**
- Reads feature requests and specifications
- Asks clarifying questions about requirements
- Identifies edge cases and constraints
- Defines acceptance criteria
- Documents all assumptions

**Deliverables:**
- Requirements document with:
  - Clear problem statement
  - User stories and use cases
  - Success criteria (checklist)
  - Constraints and limitations
  - Known edge cases

**Handoff Signal:**
```
✅ Requirements complete - Ready for specification refinement
```

**Quote:** "Requirements are the foundation. Get them right once, and implementation flows."

---

### 2. 📋 Specification Refiner

**Mindset:** "How do we build this?"

**Activities:**
- Reviews requirements document
- Designs solution architecture
- Creates detailed technical specification
- Breaks complex features into 3-5 focused tasks
- Identifies risks and dependencies
- Prepares GitHub issues with acceptance criteria

**Deliverables:**
- Specification document with:
  - Architecture diagram/description
  - Technical design decisions
  - API endpoints (if backend)
  - Database schema (if data work)
  - Implementation tasks (3-5 issues)
  - Risk assessment and mitigations
  - Estimated effort (usually 20-50 hours total)

**Handoff Signal:**
```
✅ Specification approved - Implementation ready

Creates 3-5 GitHub issues labeled:
- ready-to-implement
- spec-approved
- pack-hunt
```

**Quote:** "Good specs save days of rework. Take time to get architecture right."

---

### 3. 🎯 Implementation Hunter

**Mindset:** "Let's build it!"

**Activities:**
- Picks next implementation issue
- Codes based on spec and acceptance criteria
- Writes tests (unit + integration)
- Creates well-documented commits
- Opens PR with context and checklist
- Responds to code review feedback

**Deliverables:**
- Pull request with:
  - Implemented feature/fix
  - Unit tests (80%+ coverage)
  - Integration tests
  - Updated documentation
  - Clear commit messages with issue references

**Handoff Signal:**
```
✅ Implementation complete - Ready for testing

Creates PR with:
- Acceptance criteria checklist
- Test coverage report
- Link to spec and issue
```

**Quote:** "Code is communication. Write for the next person to read."

---

### 4. ✅ QA & Testing Specialist

**Mindset:** "Will this work for our users?"

**Activities:**
- Reviews PR against acceptance criteria
- Tests implementation in test environment
- Runs full acceptance test suite
- Checks code coverage
- Verifies no regressions
- Approves or requests changes

**Deliverables:**
- Code review with:
  - Acceptance criteria validation ✓
  - Edge case testing results
  - Test coverage analysis
  - Code quality assessment
  - Approval to merge

**Handoff Signal:**
```
✅ Testing approved - Ready to ship

Merges PR (auto-closes issue)
Records metrics for hunt analytics
```

**Quote:** "Quality isn't added at the end. It's built in from requirements through testing."

---

## 📊 Pack Configurations

### 🦁 Solo Lion (1 person)
- All roles
- Uses LionPack for personal automation
- Lightweight team features

### 🦁🦁 Pair (2 people)
- Person A: Requirements + Specs
- Person B: Implementation + Testing
- Flexible swapping based on workload

### 🦁🦁🦁 Small Pack (3 people) ⭐ RECOMMENDED
- Person A: Requirements (spec input)
- Person B: Specs (implementation input)
- Person C: Implementation + Testing (can swap)
- Optimal balance of specialization and flexibility

### 🦁🦁🦁🦁 Full Pack (4 people) ⭐ IDEAL
- Person A: Requirements
- Person B: Specifications
- Person C: Implementation
- Person D: QA & Testing
- Maximum specialization and throughput

---

## 🚀 Getting Started

### Step 1: Initialize Pack

```bash
npm install -g @osp-group/lionpack
cd your-project
lionpack team init
```

You'll be asked to:
- Name your pack (e.g., "Alpha Team")
- Add team members (GitHub usernames)
- Assign roles (requirements, spec, implementation, testing)

### Step 2: Start First Hunt

```bash
lionpack hunt start

# Describe your first feature:
# "User Authentication with Email/Password"

# System creates GitHub issue and assigns to Requirements Hunter
```

### Step 3: Let the Pack Hunt

Each role completes their phase and hands off to the next:

```bash
# Requirements Hunter (when complete):
# 1. Creates requirements document
# 2. Comments: "✅ Requirements complete"
# → Auto-assigns to Spec Refiner

# Spec Refiner (when complete):
# 1. Creates specification
# 2. Creates implementation issues
# 3. Comments: "✅ Specification approved"
# → Auto-assigns implementation issues

# Implementation Hunter (when complete):
# 1. Opens PR with complete implementation
# 2. References issue in PR
# → Auto-assigns to QA

# QA Specialist (when complete):
# 1. Reviews against acceptance criteria
# 2. Approves PR
# → Merges PR (auto-closes issue)

# Hunt Complete! 🏆
lionpack metrics velocity  # See your team's speed!
```

---

## 📈 Measuring Success

### Individual Role Metrics

```bash
lionpack metrics roles
```

Shows per role:
- Tasks completed
- Average time per task
- Velocity trend

### Team Velocity

```bash
lionpack metrics velocity
```

Shows:
- Hunts completed (per month)
- Average hunt duration
- Trend (improving/declining)

### Quality Metrics

```bash
lionpack metrics quality
```

Shows:
- Test coverage (target: > 80%)
- Bug escape rate (target: < 5%)
- Regressions (target: 0)

### Team Report

```bash
lionpack report
```

Generates comprehensive report with:
- All metrics
- Recommendations for improvement
- Bottleneck identification
- Efficiency insights

---

## 🎭 Real-World Scenarios

### Scenario 1: Single Feature (4 days)

**Monday 9am:**
```
lionpack hunt start "User Profile Page"
🔍 Alice (Requirements) starts analyzing
```

**Monday 2pm:**
```
✅ Requirements complete!
📋 Bob (Specs) picks up
Bob breaks it into: Backend API + Frontend Component + E2E Tests
```

**Tuesday 9am:**
```
✅ Specification ready!
🎯 Charlie (Implementation) starts coding
```

**Wednesday 5pm:**
```
✅ Implementation done!
Charlie opens PR with full test coverage
✅ Diana (QA) starts testing
```

**Thursday 2pm:**
```
✅ All tests pass! Quality ✓
PR merged. Issue closed.
Hunt complete! 🏆
```

**Efficiency:**
- Total time: 35 hours (vs 50-60 hours traditional)
- Each person specialized in their role
- Clear handoffs, minimal wait time

---

### Scenario 2: Complex Feature (10 days, 3 parallel hunts)

**Key insight:** While Alice works on Hunt #2, Bob continues on Hunt #1, Charlie implements Hunt #1, Diana tests Hunt #1!

```
Week 1:
├─ Hunt #1: Alice (Req) → Bob (Spec) → Charlie (Impl) → Diana (QA)
├─ Hunt #2: Alice (Req) starts
├─ Hunt #3: [Waiting for Hunt #1 completion to start]

Week 2:
├─ Hunt #1: ✅ DONE
├─ Hunt #2: Bob (Spec) → Charlie (Impl) → Diana (QA)
├─ Hunt #3: Alice (Req) → Bob (Spec) → Charlie (Impl)

Week 3:
├─ Hunt #2: ✅ DONE
├─ Hunt #3: Charlie (Impl) → Diana (QA)
├─ Hunt #4: Alice (Req) starts
```

**Result:** Ship 3 features in 3 weeks instead of traditional 4-5 weeks!

---

## 🔧 Common Questions

### Q: What if someone is sick?

**A:** Flexible role rotation! Team members can cover multiple roles for that day/sprint.

```bash
lionpack role assign alice implementation  # Alice temporarily covers impl
# When person returns:
lionpack role assign alice requirements    # Back to her primary role
```

### Q: What if a role finishes early?

**A:** They can start preparing the next hunt or help catch up on bottlenecks!

```bash
lionpack hunt status    # See where help is needed
# Join whoever needs support
```

### Q: How do we handle urgent bugs?

**A:** Parallel hunt stream!

```bash
lionpack hunt start --priority urgent "Production Bug: Login broken"
# This hunt bypasses normal queue
# Assigned immediately, affects metrics tracking differently
```

### Q: Can we adjust phases?

**A:** Yes! You can create custom workflows.

```bash
lionpack config set phases requirements,spec,implementation,staging,testing,deployment
# Adds staging and deployment phases
```

---

## 📚 Learn More

- **[LionPack Vision Document](./LIONPACK_TRANSFORMATION_STRATEGY.md)** - Full concept explanation
- **[Technical Implementation Guide](./LIONPACK_TECHNICAL_GUIDE.md)** - How it's built
- **[Team Workflow Guide](./docs/LIONPACK_TEAM_WORKFLOW.md)** - Step-by-step workflow
- **[Role Responsibilities](./docs/LIONPACK_ROLES.md)** - Detailed role descriptions
- **[Commands Reference](./docs/LIONPACK_COMMANDS.md)** - All CLI commands

---

## 🦁 The Philosophy

**Lions hunt in packs because:**
- Alone, they fail 90% of hunts
- In a pack of 4, they succeed 90% of hunts
- Each member has a role in the strategy
- Success requires coordination and specialization
- The pack moves faster together than alone

**LionPack applies this to software development.**

Your team doesn't have to work in isolation or hope things go well. With clear roles, automatic coordination, and team analytics, you hunt together.

**Let's build something great. 🦁**

---

**Questions? Feedback? Contributions?**  
📧 open an issue or discussion  
⭐ Star the repo if you find LionPack useful  
🚀 Join the hunt!

