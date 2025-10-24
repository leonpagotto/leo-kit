# 🔄 Real-Time Model Selection in VS Code

> **Dynamic Model Display as Agents Change During Task Execution**

---

## 🎯 What's New

You now have **real-time model selection updates** that automatically display in VS Code as agents execute:

```
VS Code Status Bar:
┌─────────────────────────────────────┐
│ ... ↻ 🎨 designer → Claude-S        │  ← Spinning (active)
└─────────────────────────────────────┘

After 45 minutes, Designer completes:
┌─────────────────────────────────────┐
│ ... ✓ 🎨 designer complete          │  ← Check mark (done)
└─────────────────────────────────────┘

Frontend Agent starts:
┌─────────────────────────────────────┐
│ ... ↻ 💻 frontend → Claude-S        │  ← New agent, spinning
└─────────────────────────────────────┘

Backend Agent starts (more powerful model):
┌─────────────────────────────────────┐
│ ... ↻ 🔧 backend → Claude-Opus      │  ← Upgraded to Opus!
└─────────────────────────────────────┘
```

---

## 🏗️ Architecture

### 1. Model Selection Status Manager
**File:** `lib/model-selection/status-manager.js`

Emits real-time events as models are selected:
- `model-selected` - Model has been chosen for an agent
- `agent-start` - Agent starting execution
- `agent-complete` - Agent finished execution
- `status-update` - General status update

```javascript
const statusManager = new ModelSelectorStatusManager();

statusManager.on('status-update', (update) => {
  console.log(`${update.agent} now using ${update.model}`);
  // Update UI dropdown here
});
```

### 2. Model Selection Orchestrator Integration
**File:** `lib/model-selection/orchestrator-integration.js`

Extends ModelSelector with orchestration tracking:
```javascript
const orchestrator = new ModelSelectionOrchestrator();

// Model changes are automatically tracked and broadcast
const model = await orchestrator.selectModelWithTracking('designer', task, 'moderate');
// ↓ Emits event: { agent: 'designer', model: 'claude-3-sonnet', state: 'active' }

await orchestrator.completeAgent('designer', { success: true });
// ↓ Emits event: { agent: 'designer', state: 'complete' }
```

### 3. VS Code Extension
**File:** `lib/vscode-extension/model-selector.js`

Displays status bar and listens for changes:
- Status bar shows current agent and model
- Updates every 100ms
- Watches `.leo-model-status.json` for changes
- Shows emoji for each agent type

### 4. Status File
**Location:** `~/.leo-model-status.json`

Real-time status file that VS Code extension watches:
```json
{
  "current": {
    "timestamp": "2025-10-24T14:30:45.123Z",
    "agent": "backend",
    "model": "claude-3-opus",
    "state": "active",
    "taskId": "task-1729784400000-abc123def456"
  },
  "history": [
    { "event": "agent-start", "agent": "designer", "model": "claude-3-sonnet" },
    { "event": "agent-complete", "agent": "designer", "duration": 2700000 },
    { "event": "agent-start", "agent": "frontend", "model": "claude-3-sonnet" }
  ],
  "timestamp": "2025-10-24T14:30:45.123Z"
}
```

---

## 🚀 How It Works

### Flow During Task Execution

```
User: "Build checkout feature"
    ↓
Orchestrator creates task ID
    ↓
Designer Agent Selected
┌─────────────────────────────────────┐
│ Status Manager: 'designer' starting │
├─────────────────────────────────────┤
│ Model: Claude-3-Sonnet selected     │
│ Emits: { agent: 'designer',         │
│         model: 'claude-3-sonnet',   │
│         state: 'active' }            │
├─────────────────────────────────────┤
│ Status file written                 │
│ (~/.leo-model-status.json updated)  │
├─────────────────────────────────────┤
│ VS Code Extension listening:        │
│ - Sees status file change           │
│ - Updates status bar:               │
│   ↻ 🎨 designer → Claude-S          │
└─────────────────────────────────────┘
    ↓ (45 minutes of design work)
Designer completes
┌─────────────────────────────────────┐
│ Status Manager: 'designer' complete │
├─────────────────────────────────────┤
│ Emits: { agent: 'designer',         │
│         state: 'complete',          │
│         duration: 2700000 }          │
├─────────────────────────────────────┤
│ VS Code updates:                    │
│   ✓ 🎨 designer complete            │
└─────────────────────────────────────┘
    ↓
Frontend Agent Selected
┌─────────────────────────────────────┐
│ Status Manager: 'frontend' starting │
├─────────────────────────────────────┤
│ Model: Claude-3-Sonnet selected     │
│ Emits: { agent: 'frontend',         │
│         model: 'claude-3-sonnet',   │
│         state: 'active' }            │
├─────────────────────────────────────┤
│ VS Code updates:                    │
│   ↻ 💻 frontend → Claude-S           │
└─────────────────────────────────────┘
    ↓
Backend Agent Selected
┌─────────────────────────────────────┐
│ Status Manager: 'backend' starting  │
├─────────────────────────────────────┤
│ Model: Claude-3-Opus selected       │
│ (MORE POWERFUL for complex logic!)   │
│ Emits: { agent: 'backend',          │
│         model: 'claude-3-opus',     │
│         state: 'active' }            │
├─────────────────────────────────────┤
│ VS Code updates:                    │
│   ↻ 🔧 backend → Claude-Opus         │
└─────────────────────────────────────┘
```

---

## 💻 VS Code Status Bar Display

### Status Bar Layout
```
Left Side  │  Center                  │  Right Side (Priority)
           │  (File/Activity)         │  
           │                          │ ✓ Hover to show full info
           │                          │ ↻ 🔧 backend → Claude-Opus
           │                          │ (LEO Model Selector - Click for details)
```

### Status Indicators

**Active Execution:**
```
↻ 🎨 designer → Claude-S      ← Spinning icon (agent working)
↻ 💻 frontend → Claude-S      ← Spinning icon
↻ 🔧 backend → Claude-Opus    ← Spinning icon (powerful model!)
```

**Complete:**
```
✓ 🎨 designer complete        ← Check mark
✓ 💻 frontend complete
✓ 🔧 backend complete
```

**Inactive:**
```
⊘ LEO Ready                   ← Slash icon (no active task)
```

### Agent Emojis
- 🎨 Designer
- 💻 Frontend
- 🔧 Backend
- 🧪 Testing
- 📚 Documentation
- 🚀 DevOps
- 🎯 Orchestrator

### Model Labels (Shortened for Display)
- `gpt-4` → `GPT-4`
- `gpt-4-turbo` → `GPT-4T`
- `gpt-3.5-turbo` → `GPT-3.5`
- `claude-3-opus` → `Claude-Opus`
- `claude-3-sonnet` → `Claude-S`
- `claude-3-haiku` → `Claude-H`

---

## 🔧 Using Real-Time Model Updates

### In Your CLI Commands

Update your orchestrator to use automatic model tracking:

```javascript
// lib/commands/orchestrator.js

const ModelSelectionOrchestrator = require('../model-selection/orchestrator-integration');

async function executeFeature(request) {
  const orchestrator = new ModelSelectionOrchestrator({
    statusFile: path.join(process.env.HOME, '.leo-model-status.json')
  });

  // Listen for model changes (optional - for logging)
  orchestrator.getStatusManager().on('status-update', (update) => {
    console.log(`[${update.timestamp}] ${update.agent.toUpperCase()} → ${update.model}`);
  });

  try {
    // Designer Phase
    const designerModel = await orchestrator.selectModelWithTracking(
      'designer',
      { feature: request },
      'moderate'
    );
    console.log(`Using ${designerModel} for design`);
    // ... designer work ...
    await orchestrator.completeAgent('designer', { success: true });
    // ↑ VS Code status bar updates to show designer complete

    // Frontend Phase
    const frontendModel = await orchestrator.selectModelWithTracking(
      'frontend',
      { feature: request },
      'moderate'
    );
    console.log(`Using ${frontendModel} for frontend`);
    // ... frontend work ...
    await orchestrator.completeAgent('frontend', { success: true });
    // ↑ VS Code status bar updates automatically

    // Backend Phase
    const backendModel = await orchestrator.selectModelWithTracking(
      'backend',
      { feature: request },
      'complex'  // More complex = more powerful model
    );
    console.log(`Using ${backendModel} for backend`);
    // ... backend work ...
    await orchestrator.completeAgent('backend', { success: true });

    // Complete
    await orchestrator.completeTask({ success: true });
    // ↑ Status bar returns to "LEO Ready"

  } catch (error) {
    await orchestrator.completeTask({ success: false, error: error.message });
    throw error;
  }
}
```

### VS Code Extension Commands

**Built-in commands:**

```bash
# Show current model information
Command: LEO: Show Current Model Info
Hotkey: (will appear in Command Palette)

# Select model preference
Command: LEO: Select Model Preference

# Show model history
Command: LEO: Show Model History
```

### Listening to Events

```javascript
const { ModelSelectionOrchestrator } = require('./model-selection');

const orchestrator = new ModelSelectionOrchestrator();

// Listen for specific events
orchestrator.getStatusManager().on('model-selected', ({ agent, model, metadata }) => {
  console.log(`✓ ${agent} selected ${model}`);
  console.log(`  Cost: ${metadata.cost}, Speed: ${metadata.speed}`);
});

orchestrator.getStatusManager().on('agent-complete', ({ agent, duration }) => {
  console.log(`✓ ${agent} completed in ${(duration/1000).toFixed(1)}s`);
});
```

---

## 📊 Status File Format

The `.leo-model-status.json` file updates in real-time:

```json
{
  "current": {
    "timestamp": "2025-10-24T14:35:22.456Z",
    "agent": "backend",
    "model": "claude-3-opus",
    "taskId": "task-1729784400000-abc123",
    "complexity": "complex",
    "cost": "high",
    "speed": "slow",
    "reason": "Selected claude-3-opus for backend agent (complex complexity)",
    "state": "active",
    "isActive": true
  },
  "history": [
    {
      "timestamp": "2025-10-24T14:30:45.123Z",
      "event": "task-start",
      "taskId": "task-1729784400000-abc123"
    },
    {
      "timestamp": "2025-10-24T14:30:46.500Z",
      "event": "agent-start",
      "agent": "designer",
      "model": "claude-3-sonnet",
      "taskId": "task-1729784400000-abc123",
      "status": "in-progress"
    },
    {
      "timestamp": "2025-10-24T14:33:15.789Z",
      "event": "agent-complete",
      "agent": "designer",
      "model": "claude-3-sonnet",
      "duration": 2705289,
      "success": true,
      "taskId": "task-1729784400000-abc123"
    },
    {
      "timestamp": "2025-10-24T14:33:16.200Z",
      "event": "agent-start",
      "agent": "frontend",
      "model": "claude-3-sonnet",
      "taskId": "task-1729784400000-abc123",
      "status": "in-progress"
    }
  ],
  "timestamp": "2025-10-24T14:35:22.456Z"
}
```

---

## 🎯 Installation & Setup

### 1. Add to CLI

Update your main CLI entry point:

```javascript
// bin/cli.js

const ModelSelectionOrchestrator = require('../lib/model-selection/orchestrator-integration');

// Create global orchestrator instance
global.leoOrchestrator = new ModelSelectionOrchestrator({
  statusFile: path.join(process.env.HOME, '.leo-model-status.json')
});

// Now use in any command
async function handleFeatureRequest(request) {
  const orchestrator = global.leoOrchestrator;
  
  const model = await orchestrator.selectModelWithTracking(
    'designer',
    { feature: request },
    'moderate'
  );
  
  // ... work ...
  
  await orchestrator.completeAgent('designer', { success: true });
}
```

### 2. Install VS Code Extension

```bash
# Copy extension to VS Code
mkdir -p ~/.vscode/extensions/leo-model-selector/
cp -r lib/vscode-extension/* ~/.vscode/extensions/leo-model-selector/

# Restart VS Code
```

### 3. Verify Installation

Check status bar in VS Code - you should see:
```
⊘ LEO Ready
```

---

## ✅ Features Implemented

| Feature | Status | How It Works |
|---------|--------|------------|
| Real-time status bar updates | ✅ | Polls `.leo-model-status.json` every 100ms |
| Agent emoji display | ✅ | Shows appropriate emoji for each agent |
| Model name display | ✅ | Shortened names (GPT-4T, Claude-S, etc.) |
| Spinning indicator (active) | ✅ | `↻` while agent is working |
| Check mark (complete) | ✅ | `✓` when agent finishes |
| Status information tooltip | ✅ | Click status bar to see details |
| Model selection history | ✅ | Last 50 model selections tracked |
| Event emissions | ✅ | Can listen to model changes programmatically |
| Cost tracking | ✅ | Recorded in status file |
| Duration tracking | ✅ | How long each agent takes |

---

## 🔍 Example: Watching Model Changes

```javascript
// Watch model changes in real-time
const orchestrator = new ModelSelectionOrchestrator();
const statusManager = orchestrator.getStatusManager();

statusManager.on('model-active', ({ agent, model }) => {
  console.log(`🎯 ${agent.toUpperCase()} activated with ${model}`);
});

statusManager.on('model-complete', ({ agent }) => {
  console.log(`✓ ${agent.toUpperCase()} completed`);
});

statusManager.on('status-update', (update) => {
  console.log(`Status: Agent=${update.agent}, Model=${update.model}, State=${update.state}`);
});

// Execute feature
async function build() {
  // Each phase automatically triggers status updates
  const model1 = await orchestrator.selectModelWithTracking('designer', {}, 'moderate');
  // Logs: 🎯 DESIGNER activated with claude-3-sonnet
  // Logs: Status: Agent=designer, Model=claude-3-sonnet, State=active
  
  await orchestrator.completeAgent('designer', { success: true });
  // Logs: ✓ DESIGNER completed
  
  const model2 = await orchestrator.selectModelWithTracking('frontend', {}, 'moderate');
  // Logs: 🎯 FRONTEND activated with claude-3-sonnet
  
  const model3 = await orchestrator.selectModelWithTracking('backend', {}, 'complex');
  // Logs: 🎯 BACKEND activated with claude-3-opus (upgraded model!)
}

build();
```

---

## 🎉 Summary

You now have:
- ✅ **Real-time model display** in VS Code status bar
- ✅ **Automatic updates** as agents change
- ✅ **Visual indicators** (spinning, check, emojis)
- ✅ **Status file** for external monitoring
- ✅ **Event system** for programmatic listening
- ✅ **Cost & duration tracking**
- ✅ **Model history** persisted

**Result:** Watch your models change in real-time as different agents execute their work!

🚀 Models update dynamically → See changes in VS Code dropdown → Agents execute optimally
