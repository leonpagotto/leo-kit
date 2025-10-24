# 🔄 Real-Time Model Selection: Complete Visual Guide

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         LEO WORKFLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Command: leo build-feature "checkout"                     │
│                    ↓                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ModelSelectionOrchestrator                              │    │
│  │ (orchestrator-integration.js)                           │    │
│  └────────────┬─────────────────────────────────────────┘    │
│               │                                                 │
│               ├─→ selectModelWithTracking('designer')          │
│               │           ↓                                     │
│               │   ┌──────────────────────────────────┐         │
│               │   │ ModelSelectorStatusManager        │         │
│               │   │ (status-manager.js)               │         │
│               │   └────────┬─────────────────────────┘         │
│               │            │                                    │
│               │            ├─→ onAgentStart('designer')        │
│               │            │       ↓                            │
│               │            │   emit('agent-start')             │
│               │            │   writeStatusFile()               │
│               │            │                                    │
│               │            ├─→ onModelSelected(...)            │
│               │            │       ↓                            │
│               │            │   emit('model-selected')          │
│               │            │   emit('status-update')  ◄────┐   │
│               │            │       ↓                      │   │
│               │            │   writeStatusFile()          │   │
│               │            │   ~/.leo-model-status.json   │   │
│               │            │                              │   │
│               │            └────────────────────────────  │   │
│               │                                           │   │
│               │      ┌──────────────────────────────────┐ │   │
│               │      │ VS Code Extension                │ │   │
│               │      │ (model-selector.js)              │─┘   │
│               │      ├─ Watches: .leo-model-status.json │     │
│               │      ├─ Polls every 100ms              │     │
│               │      ├─ Listens to events              │     │
│               │      └────────┬───────────────────────┘     │
│               │               │                              │
│               │               ├─→ updateStatusBar()         │
│               │               │   "↻ 🎨 designer → Claude-S"│
│               │               │                              │
│               │               └─→ Shows in Status Bar      │
│               │                                              │
│               ├─→ Designer work (45 minutes)                │
│               │                                              │
│               ├─→ completeAgent('designer')                 │
│               │       ↓                                      │
│               │   emit('agent-complete')                    │
│               │       ↓                                      │
│               │   updateStatusBar()                         │
│               │   "✓ 🎨 designer complete"                │
│               │                                              │
│               ├─→ selectModelWithTracking('frontend')       │
│               │       ↓                                      │
│               │   updateStatusBar()                         │
│               │   "↻ 💻 frontend → Claude-S"              │
│               │                                              │
│               ├─→ Frontend work (1.5-2 hours)               │
│               │       ...                                    │
│               │                                              │
│               └─→ Backend, Testing, Documentation phases    │
│                   (each updates model display automatically)│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Task Execution Flow

```
PHASE 1: DESIGNER
┌────────────────────────────────────────────────────────────┐
│ selectModelWithTracking('designer', {}, 'moderate')        │
│  ↓                                                          │
│ StatusManager.onAgentStart()                              │
│  ├─ emit('agent-start')                                  │
│  └─ emit('status-update'): { agent: 'designer', ... }   │
│  ↓                                                          │
│ ModelSelector.selectModel()                               │
│  └─ chooses: claude-3-sonnet                              │
│  ↓                                                          │
│ StatusManager.onModelSelected()                           │
│  ├─ emit('model-selected')                               │
│  ├─ emit('status-update'): { model: 'claude-3-sonnet' }  │
│  └─ writeStatusFile()                                     │
│      └─ ~/.leo-model-status.json ← FILE UPDATES           │
│  ↓                                                          │
│ [VS Code Extension Watching]                              │
│  ├─ Detects file change                                   │
│  ├─ Reads new status                                      │
│  ├─ Calls updateStatusBar()                               │
│  └─ Status Bar Shows: ↻ 🎨 designer → Claude-S           │
│  ↓                                                          │
│ [Designer work happens...]                                │
│ ~45 minutes                                                │
│  ↓                                                          │
│ completeAgent('designer', { success: true })              │
│  ├─ StatusManager.onAgentComplete()                       │
│  ├─ emit('agent-complete')                                │
│  └─ writeStatusFile(): { state: 'complete' }              │
│      └─ ~/. leo-model-status.json ← FILE UPDATES           │
│  ↓                                                          │
│ [VS Code Extension detects completion]                    │
│  ├─ Status bar changes to: ✓ 🎨 designer complete        │
│  └─ Indicator shows check mark                            │
└────────────────────────────────────────────────────────────┘

PHASE 2: FRONTEND
┌────────────────────────────────────────────────────────────┐
│ selectModelWithTracking('frontend', {}, 'moderate')        │
│  ↓                                                          │
│ ModelSelector.selectModel()                               │
│  └─ chooses: claude-3-sonnet                              │
│  ↓                                                          │
│ StatusManager emissions + file write                       │
│  ↓                                                          │
│ [VS Code Extension updates]                               │
│  └─ Status Bar: ↻ 💻 frontend → Claude-S                 │
│  ↓                                                          │
│ [Frontend work happens...]                                │
│ ~1.5-2 hours                                               │
│  ↓                                                          │
│ completeAgent('frontend', { success: true })              │
│  ↓                                                          │
│ Status Bar: ✓ 💻 frontend complete                       │
└────────────────────────────────────────────────────────────┘

PHASE 3: BACKEND (MODEL UPGRADED!)
┌────────────────────────────────────────────────────────────┐
│ selectModelWithTracking('backend', {}, 'complex')          │
│  ↓                                                          │
│ ModelSelector.selectModel()                               │
│  └─ Detects complexity='complex'                          │
│  └─ Chooses: claude-3-opus (POWERFUL!)                    │
│  ↓                                                          │
│ StatusManager emissions                                    │
│  ├─ emit('status-update'): { model: 'claude-3-opus' }    │
│  └─ writeStatusFile()                                     │
│      └─ ~/.leo-model-status.json ← UPDATED WITH NEW MODEL │
│  ↓                                                          │
│ [VS Code Extension detects MODEL CHANGE!]                 │
│  └─ Status Bar: ↻ 🔧 backend → Claude-Opus              │
│         (AUTOMATICALLY UPGRADED FROM SONNET!)             │
│  ↓                                                          │
│ [Backend work with powerful model...]                     │
│ ~1.5-2 hours                                               │
│  ↓                                                          │
│ completeAgent('backend', { success: true })               │
│  ↓                                                          │
│ Status Bar: ✓ 🔧 backend complete                        │
└────────────────────────────────────────────────────────────┘

PHASE 4: TESTING
┌────────────────────────────────────────────────────────────┐
│ selectModelWithTracking('testing', {}, 'moderate')         │
│  ↓                                                          │
│ Status Bar: ↻ 🧪 testing → Claude-S                      │
│ (model changes back to Sonnet from Opus)                  │
│  ↓                                                          │
│ [Testing work...]                                          │
│  ↓                                                          │
│ completeAgent('testing', { success: true })               │
│  ↓                                                          │
│ Status Bar: ✓ 🧪 testing complete                        │
└────────────────────────────────────────────────────────────┘

PHASE 5: DOCUMENTATION (CHEAPEST MODEL!)
┌────────────────────────────────────────────────────────────┐
│ selectModelWithTracking('documentation', {}, 'simple')    │
│  ↓                                                          │
│ ModelSelector.selectModel()                               │
│  └─ Simple task → GPT-3.5-turbo (CHEAPEST!)              │
│  ↓                                                          │
│ Status Bar: ↻ 📚 documentation → GPT-3.5                 │
│ (model changes to most cost-efficient!)                   │
│  ↓                                                          │
│ [Documentation work...]                                    │
│  ↓                                                          │
│ completeAgent('documentation', { success: true })        │
│  ↓                                                          │
│ Status Bar: ✓ 📚 documentation complete                  │
└────────────────────────────────────────────────────────────┘

TASK COMPLETE
┌────────────────────────────────────────────────────────────┐
│ completeTask({ success: true })                            │
│  ↓                                                          │
│ Status Bar: ⊘ LEO Ready                                   │
│ (returns to idle state)                                    │
└────────────────────────────────────────────────────────────┘
```

---

## 📈 Real-Time Model Changes

```
TIME ─────────────────────────────────────────────────────────────→

0s        ⊘ LEO Ready
          (Idle)

0.5s      ↻ 🎨 designer → Claude-S
          (Designer starts)

45m       ✓ 🎨 designer complete
          (Designer finishes)

45.5m     ↻ 💻 frontend → Claude-S
          (Frontend starts, same model)

2h 15m    ✓ 💻 frontend complete
          (Frontend finishes)

2h 15.5m  ↻ 🔧 backend → Claude-Opus
          (Backend starts, UPGRADED MODEL!)
          (More complex → More powerful AI)

3h 45m    ✓ 🔧 backend complete
          (Backend finishes)

3h 45.5m  ↻ 🧪 testing → Claude-S
          (Testing starts, back to Sonnet)

4h 45m    ✓ 🧪 testing complete
          (Testing finishes)

4h 45.5m  ↻ 📚 documentation → GPT-3.5
          (Documentation starts, CHEAPEST MODEL!)
          (Simple writing → Cost-efficient AI)

5h 30m    ✓ 📚 documentation complete
          (Documentation finishes)

5h 30.5m  ⊘ LEO Ready
          (All done, back to idle)
```

---

## 🔧 VS Code Extension Update Mechanism

```
MODEL CHANGE DETECTION AND DISPLAY:

Method 1: FILE WATCHING
────────────────────
File Event:      ~/.leo-model-status.json changed
                 ↓
           fs.watch() listener triggered
                 ↓
           fs.readJSON() reads file
                 ↓
           StatusManager.current.agent !== currentAgent?
                 ↓ YES
           updateStatusBar(agent, model, state)
                 ↓
           Status Bar Text Updated
                 ↓
           "↻ 🎧 backend → Claude-Opus"


Method 2: POLLING (FALLBACK)
────────────────────────
Timer: setInterval every 100ms
       ↓
Check ~/.leo-model-status.json
       ↓
Compare current.agent with cached agent
       ↓ DIFFERENT
updateStatusBar(agent, model, state)
       ↓
Status Bar Text Updated

Combined:
- File watch triggers immediate update (< 1ms)
- Polling ensures update within 100ms max
- Redundant = highly reliable
```

---

## 📊 Status File State Transitions

```
STATE TRANSITIONS DURING TASK:

┌──────────────────┐
│ INITIAL STATE    │
│ (no file)        │
└────────┬─────────┘
         │ selectModelWithTracking('designer')
         ↓
┌──────────────────────────────────────────────────┐
│ AGENT_START_STATE                                 │
│ {                                                  │
│   current: {                                       │
│     agent: 'designer',                           │
│     model: null,                                 │
│     state: 'in-progress'                         │
│   }                                                │
│ }                                                  │
└────────┬─────────────────────────────────────────┘
         │ selectModel() completes
         ↓
┌──────────────────────────────────────────────────┐
│ MODEL_SELECTED_STATE                             │
│ {                                                  │
│   current: {                                       │
│     agent: 'designer',                           │
│     model: 'claude-3-sonnet',    ← SET!         │
│     state: 'active',              ← ACTIVE!     │
│     cost: 'low',                                 │
│     speed: 'medium',                            │
│     timestamp: '2025-10-24T...'                 │
│   }                                                │
│ }                                                  │
└────────┬─────────────────────────────────────────┘
         │ (45 minutes of designer work)
         │
         │ completeAgent('designer')
         ↓
┌──────────────────────────────────────────────────┐
│ AGENT_COMPLETE_STATE                             │
│ {                                                  │
│   current: {                                       │
│     agent: 'designer',                           │
│     model: 'claude-3-sonnet',                   │
│     state: 'complete',            ← COMPLETE!  │
│     duration: 2700000,                         │
│     success: true                              │
│   }                                                │
│ }                                                  │
└────────┬─────────────────────────────────────────┘
         │ selectModelWithTracking('frontend')
         ↓
┌──────────────────────────────────────────────────┐
│ NEXT_AGENT_STATE                                 │
│ {                                                  │
│   current: {                                       │
│     agent: 'frontend',            ← CHANGED!   │
│     model: 'claude-3-sonnet',     ← SAME MODEL │
│     state: 'active'               ← ACTIVE!    │
│     timestamp: '2025-10-24T...'                 │
│   }                                                │
│ }                                                  │
└────────┬─────────────────────────────────────────┘
         │ selectModelWithTracking('backend')
         ↓
┌──────────────────────────────────────────────────┐
│ UPGRADE_STATE (COMPLEX DETECTED)                 │
│ {                                                  │
│   current: {                                       │
│     agent: 'backend',             ← CHANGED!   │
│     model: 'claude-3-opus',       ← UPGRADED!  │
│     state: 'active'               ← ACTIVE!    │
│     complexity: 'complex'         ← TRIGGERED  │
│     cost: 'high',                 ← MORE$$    │
│     reason: 'Complex logic...'                 │
│   }                                                │
│ }                                                  │
└────────────────────────────────────────────────────┘
```

---

## 🎯 Key Model Changes in Single Task

```
Task: "Build Checkout Feature"

┌─────────────────────────────────────────────────────────┐
│                                                           │
│ MODEL SELECTION TIMELINE                                 │
│                                                           │
│ Time │ Agent        │ Model            │ Reason          │
│ ─────┼──────────────┼──────────────────┼─────────────── │
│ 0m   │ designer     │ Claude-Sonnet    │ Fast iteration  │
│      │              │ Cost: $0.02      │                 │
│      │              │ Speed: Medium    │                 │
│ ─────┼──────────────┼──────────────────┼─────────────── │
│ 45m  │ frontend     │ Claude-Sonnet    │ UI expertise    │
│      │              │ Cost: $0.15      │ (same model)    │
│      │              │ Speed: Medium    │                 │
│ ─────┼──────────────┼──────────────────┼─────────────── │
│ 2h   │ backend      │ Claude-Opus ⬆️   │ Complex logic!  │
│ 15m  │              │ Cost: $0.30      │ UPGRADED        │
│      │              │ Speed: Slow      │ (powerful!)     │
│ ─────┼──────────────┼──────────────────┼─────────────── │
│ 3h   │ testing      │ Claude-Sonnet ⬇️ │ Test generation │
│ 45m  │              │ Cost: $0.10      │ Back to cheap   │
│      │              │ Speed: Medium    │                 │
│ ─────┼──────────────┼──────────────────┼─────────────── │
│ 4h   │ documentation│ GPT-3.5 ⬇️⬇️      │ Writing task    │
│ 45m  │              │ Cost: $0.05      │ CHEAPEST!       │
│      │              │ Speed: Fast      │                 │
│ ─────┴──────────────┴──────────────────┴─────────────── │
│ TOTAL COST: ~$0.62 (all 5 phases)                       │
│ TOTAL TIME: 5-6 hours                                    │
│ MODELS USED: 3 different (Sonnet, Opus, GPT-3.5)       │
│                                                           │
│ VS CODE SHOWS:                                           │
│ ↻ 🎨 designer → Claude-S    (2m ago)                   │
│ ↻ 💻 frontend → Claude-S    (46m ago)                  │
│ ↻ 🔧 backend → Claude-Opus  (now) ← CURRENT            │
│ 🧪 testing → Claude-S                                   │
│ 📚 documentation → GPT-3.5                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Summary: Real-Time Model Display

**What happens automatically:**

1. **Task starts** → Status shows `⊘ LEO Ready`
2. **Agent selected** → Status shows `↻ agent → model`
3. **Agent completes** → Status shows `✓ agent complete`
4. **Next agent** → Status automatically switches
5. **Model upgrades** → Status shows `↻ agent → NewModel`
6. **Task done** → Status shows `⊘ LEO Ready`

**No manual intervention needed** - everything updates automatically! 🎉
