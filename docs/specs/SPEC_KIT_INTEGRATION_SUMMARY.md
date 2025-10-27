# Spec Kit Integration Summary

**Date:** 2025-10-27
**Issue:** #75 - Integrate Spec Kit principles into LEO Workflow Kit
**Status:** Spec Created ✅

---

## 🎯 What We Accomplished

### 1. Analyzed Spec Kit Repository

- Studied GitHub's Spec Kit (42.4k stars, active project)
- Reviewed workflow: constitution → specify → clarify → plan → tasks → implement
- Identified key strengths: templates, constitutional principles, contract-first thinking
- Evaluated compatibility with LEO's GitHub-centric approach

### 2. Created Comprehensive Integration Spec

- **GitHub Issue #75**: Complete roadmap for integration
- **4 Phases**: Foundation → Task Management → Agent Integration → Execution Modes
- **Key Innovation**: GitHub Issues as living specs (not file-based)
- **Maintains LEO Philosophy**: Lightweight, adaptive, issue-centric

---

## 🗺️ Integration Strategy

### What LEO Will Adopt from Spec Kit

✅ **Constitutional Principles** → `.leorc.json` + `docs/CONSTITUTION.md`

- Project-wide development rules
- TDD enforcement, API-first design, dependency limits

✅ **Structured Templates** → GitHub issue templates

- Spec template: Context, Requirements, User Stories, Acceptance Criteria
- Clarification template: AI-driven Q&A before planning

✅ **Clarification Workflow** → `leo clarify <issue>`

- AI analyzes spec for ambiguities
- Posts structured questions as issue comment
- Reduces "what did you mean?" back-and-forth

✅ **Architecture Planning** → `leo plan <issue>`

- Generates tech stack, data model, API contracts
- Posts as issue comment (not separate file)
- Checks constitutional compliance

✅ **Task Dependencies** → Issue checklists with `[P]` and `[S]` markers

- [P] = Parallel (can run concurrently)
- [S] = Sequential (must run in order)
- Example: `[P after Phase 2]` = parallel after phase 2 completes

✅ **Phase-Based Execution** → Setup → Tests → Code → Polish

- TDD: Tests before implementation
- Contract-first: APIs before code
- Integration: Connect components
- Polish: Docs, optimization

---

### What LEO Will NOT Adopt

❌ **File-based specs** (specs/001-feature/spec.md, plan.md, tasks.md)

- Conflicts with GitHub-centric workflow
- Issues are already our "spec files"

❌ **Separate CLI tool** (`specify` command)

- LEO already has its CLI
- Commands integrate into existing `leo` tool

❌ **Feature numbering** (001-feature, 002-feature)

- Unnecessary complexity
- Standard Git branches work fine

❌ **Agent-specific files** (.claude/, .cursor/, etc.)

- GitHub issues provide context for all agents
- Keeps workspace clean

---

## 🚀 Roadmap Summary

### Phase 1: Foundation 🔴 High Priority

**New Commands:**

- `leo constitution init` - Create project principles
- `leo spec new <description>` - Structured issue creation
- `leo clarify <issue>` - AI-driven clarification
- `leo plan <issue>` - Architecture planning

**Example Workflow:**

```bash
# 1. Setup project principles
leo constitution init
# Creates .leorc.json + docs/CONSTITUTION.md

# 2. Create spec with structured template
leo spec new "Add OAuth2 authentication with Google/GitHub"
# → Creates issue #42 with sections: Context, Requirements, User Stories

# 3. Clarify ambiguities
leo clarify 42
# → AI posts: "Which OAuth2 flow? JWT or sessions? What user data?"

# 4. Generate architecture plan
leo plan 42
# → Posts: Tech stack (Passport.js), Data model (SQL), API contracts, File structure
```

---

### Phase 2: Task Management 🟠 Medium Priority

**New Commands:**

- `leo tasks create <issue>` - Generate checklist in issue
- `leo spec diff <issue>` - Show spec evolution
- `leo spec extend <issue> <desc>` - Add extension/child issue

**Task Checklist Format:**

```markdown
## ✅ Implementation Tasks

### Phase 1: Setup [S]

- [ ] Install Passport.js
- [ ] Configure env vars

### Phase 2: Tests (TDD) [S]

- [ ] Write OAuth service tests
- [ ] Write E2E flow tests

### Phase 3: Implementation [P after Phase 2]

- [ ] [P] Implement Google OAuth
- [ ] [P] Implement GitHub OAuth
- [ ] [S] Integrate both providers

### Phase 4: Polish [S]

- [ ] Run tests (all pass)
- [ ] Update docs
```

---

### Phase 3: Agent Integration 🟠 Medium Priority

**New Command:**

- `leo orchestrate <issue>` - Multi-agent task execution

**Spec-Aware Routing:**

- Planner Agent reads "Architecture Plan" section
- Developer Agent reads "Implementation Tasks" section
- Reviewer Agent reads "Acceptance Criteria" section
- Testing Agent reads "Phase 2: Tests" section

**Orchestration Flow:**

```bash
leo orchestrate 42

# Output:
# 🎭 Orchestrating Issue #42
# Phase 1: Setup → DevOps Agent → ✅ Complete
# Phase 2: Tests → Testing Agent → ✅ 6 tests written
# Phase 3: Implementation → Backend Agent (parallel) → ✅ Complete
# Phase 4: Polish → Documentation Agent → ✅ Complete
# 🎉 15/15 tasks completed, all tests passing
```

---

### Phase 4: Execution Modes 🟡 Medium-Low Priority

**Fast Mode** (existing LEO):

```bash
leo issue "Add OAuth2 login"
# → Create + implement + commit + close (instant)
```

**Spec Mode** (new structured workflow):

```bash
leo spec new "Add OAuth2 login" --mode spec
# → Spec → Clarify → Plan → Tasks → Orchestrate (deliberate)
```

**Auto-Detection:**

```json
{
  "execution-mode": "auto",
  "spec-mode-triggers": [
    "complexity > 3 days",
    "label: architecture",
    "multiple agents required"
  ]
}
```

---

### Phase 5: Visualization 🟢 Low Priority

**New Commands:**

- `leo dashboard` - Show spec → plan → tasks flow
- `leo feedback <issue>` - Post-completion analysis

---

## 🎯 Key Innovation: GitHub Issues as Living Specs

**Traditional Spec Kit:**

```
specs/
  001-oauth/
    spec.md           # Requirements (static file)
    plan.md           # Architecture (static file)
    tasks.md          # Task list (static file)
    contracts/        # API specs (static files)
    data-model.md     # Entities (static file)
```

**LEO Kit Integration:**

```
GitHub Issue #42: Add OAuth2 authentication

[Issue Description]
- 📋 Context
- 🎯 Functional Requirements
- 👥 User Stories

[Issue Comments]
- 🤔 Clarification Q&A (leo clarify)
- 🏗️ Architecture Plan (leo plan)

[Issue Checklist]
- ✅ Implementation Tasks (leo tasks create)

[Issue History]
- Version control via comment timeline
- Spec evolution tracked automatically
```

**Benefits:**

- ✅ Single source of truth (GitHub)
- ✅ Version control via issue history
- ✅ Collaboration via comments
- ✅ No sync issues between files and issues
- ✅ Works with GitHub Projects, labels, milestones

---

## 📊 Comparison Table

| Aspect            | Spec Kit                   | LEO Kit Integration       |
| ----------------- | -------------------------- | ------------------------- |
| **Spec Storage**  | Files (specs/001-feature/) | GitHub Issues             |
| **Planning**      | plan.md file               | Issue comment             |
| **Tasks**         | tasks.md file              | Issue checklist           |
| **Constitution**  | memory/constitution.md     | .leorc.json + docs/       |
| **Workflow**      | /speckit.\* commands       | leo \* commands           |
| **Versioning**    | Git commits on files       | Issue comment history     |
| **Collaboration** | File PRs                   | Issue comments            |
| **Agent Support** | Not agent-aware            | Multi-agent orchestration |
| **Execution**     | Manual command sequence    | Dual mode (fast/spec)     |

---

## 📈 Expected Impact

### Clarity (+50%)

- Structured templates reduce ambiguity
- Clarification workflow catches unclear requirements early
- Contract-first thinking aligns expectations

### Quality (Measurable Improvement)

- Constitutional principles enforce standards
- TDD mandatory (tests before code)
- API-first design (contracts before implementation)
- Fewer bugs, better architecture

### Speed (+30% for complex features)

- Less rework due to better planning
- Parallel task execution ([P] markers)
- Agent orchestration optimizes workflow

### Adoption (Target: 80%)

- Fast Mode for simple features (< 1 day)
- Spec Mode for complex features (> 3 days)
- Auto-detection based on complexity

### Developer Satisfaction

- Less "what did you mean?" questions
- Clear roadmap from spec to completion
- Visibility into progress (dashboard)

---

## 🚧 Implementation Timeline

### Week 1: Foundation (Phase 1)

- Create `lib/constitution/` module
- Implement `leo constitution init`
- Create issue templates
- Implement `leo spec new`, `leo clarify`, `leo plan`

### Week 2: Task Management (Phase 2)

- Implement `leo tasks create`
- Add dependency markers ([P], [S])
- Implement `leo spec diff`, `leo spec extend`

### Week 3: Agent Integration (Phase 3)

- Update orchestrator for spec-aware routing
- Implement `leo orchestrate`
- GitHub Projects integration

### Week 4: Modes & Polish (Phase 4-5)

- Dual execution modes
- Dashboard (CLI version)
- Feedback loop
- Documentation

---

## 📚 Resources

- **Spec Kit Repository**: https://github.com/github/spec-kit (42.4k stars)
- **Spec-Driven Development Guide**: https://github.com/github/spec-kit/blob/main/spec-driven.md
- **LEO Workflow Kit**: https://github.com/leonpagotto/leo-kit
- **Integration Issue**: https://github.com/leonpagotto/leo-kit/issues/75

---

## ✅ Next Steps

1. **Review Issue #75** - Read full spec, provide feedback
2. **Prioritize Phases** - Confirm roadmap order
3. **Start Phase 1** - Constitutional principles + spec creation
4. **Iterate & Refine** - Test with real features, gather feedback

---

## 🎉 Success Criteria

- [ ] `leo constitution init` works and creates principles
- [ ] `leo spec new` creates structured issues
- [ ] `leo clarify` posts AI questions
- [ ] `leo plan` generates architecture
- [ ] `leo tasks create` builds checklists
- [ ] `leo orchestrate` assigns to agents
- [ ] Fast Mode and Spec Mode coexist
- [ ] Documentation complete
- [ ] > 80% test coverage
- [ ] Devs prefer spec mode for complex work

---

**Status:** Ready for implementation 🚀
**Owner:** @leonpagotto
**Timeline:** 4 weeks (phased rollout)
**Risk Level:** Low (additive, doesn't break existing features)

---

_Generated: 2025-10-27_
_LEO Workflow Kit v5.0.1_
