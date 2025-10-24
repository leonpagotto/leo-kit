# ⚡ Quick Start: Real-Time Model Selection

> **Watch your models change in real-time as agents execute in VS Code**

---

## 🎯 What You Get

```
VS Code Status Bar Updates As Task Progresses:

   ⊘ LEO Ready
   ↓ (task starts)
   ↻ 🎨 designer → Claude-S          (45 minutes of design)
   ✓ 🎨 designer complete
   ↻ 💻 frontend → Claude-S          (1.5-2 hours of coding)
   ✓ 💻 frontend complete
   ↻ 🔧 backend → Claude-Opus        (1.5-2 hours, upgraded model!)
   ✓ 🔧 backend complete
   ↻ 🧪 testing → Claude-S
   ✓ 🧪 testing complete
   ↻ 📚 documentation → GPT-3.5       (cheapest!)
   ✓ 📚 documentation complete
   ⊘ LEO Ready                        (done)
```

---

## 1️⃣ Install VS Code Extension

```bash
# Copy extension files
mkdir -p ~/.vscode/extensions/leo-model-selector/
cp -r lib/vscode-extension/* ~/.vscode/extensions/leo-model-selector/

# Restart VS Code (Command Palette → Developer: Reload Window)
```

After restart, you'll see in status bar:
```
⊘ LEO Ready
```

---

## 2️⃣ Use in Your CLI

Update your CLI command to use real-time tracking:

```javascript
// lib/commands/build-feature.js
const path = require('path');
const ModelSelectionOrchestrator = require('../model-selection/orchestrator-integration');

async function buildFeature(featureName) {
  // Create orchestrator with real-time tracking
  const orchestrator = new ModelSelectionOrchestrator({
    statusFile: path.join(process.env.HOME, '.leo-model-status.json')
  });

  try {
    // Designer Phase
    console.log('🎨 Starting design phase...');
    const designModel = await orchestrator.selectModelWithTracking(
      'designer',
      { feature: featureName },
      'moderate'
    );
    // ↑ VS Code shows: ↻ 🎨 designer → Claude-S
    
    // ... do design work ...
    console.log(`Designer used: ${designModel}`);
    
    await orchestrator.completeAgent('designer', { success: true });
    // ↑ VS Code shows: ✓ 🎨 designer complete

    // Frontend Phase
    console.log('💻 Starting frontend phase...');
    const frontendModel = await orchestrator.selectModelWithTracking(
      'frontend',
      { feature: featureName },
      'moderate'
    );
    // ↑ VS Code shows: ↻ 💻 frontend → Claude-S
    
    // ... do frontend work ...
    console.log(`Frontend used: ${frontendModel}`);
    
    await orchestrator.completeAgent('frontend', { success: true });
    // ↑ VS Code shows: ✓ 💻 frontend complete

    // Backend Phase
    console.log('🔧 Starting backend phase...');
    const backendModel = await orchestrator.selectModelWithTracking(
      'backend',
      { feature: featureName },
      'complex'  // ← More complex = more powerful model
    );
    // ↑ VS Code shows: ↻ 🔧 backend → Claude-Opus (upgraded!)
    
    // ... do backend work ...
    console.log(`Backend used: ${backendModel}`);
    
    await orchestrator.completeAgent('backend', { success: true });
    // ↑ VS Code shows: ✓ 🔧 backend complete

    // Complete
    await orchestrator.completeTask({ success: true });
    // ↑ VS Code shows: ⊘ LEO Ready

    console.log('✓ Feature build complete!');

  } catch (error) {
    await orchestrator.completeTask({ success: false, error: error.message });
    console.error('✗ Build failed:', error.message);
    process.exit(1);
  }
}

module.exports = buildFeature;
```

---

## 3️⃣ Run Your Command

```bash
leo build-feature "checkout form"

# Output:
# 🎨 Starting design phase...
# Designer used: claude-3-sonnet
# (Watch status bar: ↻ 🎨 designer → Claude-S)
# 
# [45 minutes later...]
# 
# ✓ Feature build complete!
# (Status bar: ⊘ LEO Ready)
```

---

## 📊 What's Happening Behind The Scenes

1. **Task starts** → Orchestrator creates task ID
2. **Agent selected** → Status manager notifies VS Code extension
3. **Model chosen** → Status file updated
4. **VS Code watches** → Status bar updated every 100ms
5. **Agent completes** → Extension shows completion checkmark
6. **Next agent** → Status bar switches to new agent
7. **Task ends** → Status returns to "LEO Ready"

---

## 🎥 Live Example

### Terminal Output:
```
$ leo build "checkout feature"
🎨 Starting design phase...
Designer selected: claude-3-sonnet
✓ Design complete (2m 15s)

💻 Starting frontend phase...
Frontend selected: claude-3-sonnet
✓ Frontend complete (1h 32m)

🔧 Starting backend phase...
Backend selected: claude-3-opus    ← Upgraded model!
✓ Backend complete (1h 48m)

🧪 Starting testing phase...
Testing selected: claude-3-sonnet
✓ Testing complete (1h 5m)

📚 Starting documentation phase...
Documentation selected: gpt-3.5-turbo  ← Cheapest model!
✓ Documentation complete (45m)

✓ Feature build complete! (Total: 6h 40m)
```

### VS Code Status Bar:
```
Right side of status bar shows:
⊘ LEO Ready                                    (initial)
↻ 🎨 designer → Claude-S                      (2m 15s later)
✓ 🎨 designer complete                        (design done)
↻ 💻 frontend → Claude-S                      (start frontend)
✓ 💻 frontend complete                        (1h 32m later)
↻ 🔧 backend → Claude-Opus                    (more powerful!)
✓ 🔧 backend complete                         (1h 48m later)
↻ 🧪 testing → Claude-S                       (start testing)
✓ 🧪 testing complete                         (1h 5m later)
↻ 📚 documentation → GPT-3.5                   (cheapest!)
✓ 📚 documentation complete                   (45m later)
⊘ LEO Ready                                    (all done!)
```

---

## 💡 Key Features

### 🎯 Real-Time Display
- Spinning ↻ means agent actively working
- Check ✓ means agent completed
- Shows current model name
- Updates instantly as agents change

### 📊 Agent Emojis
- 🎨 Designer
- 💻 Frontend
- 🔧 Backend
- 🧪 Testing
- 📚 Documentation
- 🚀 DevOps

### 💰 Model Optimization
- Designer: Claude-3-Sonnet (fast)
- Frontend: Claude-3-Sonnet (UI-focused)
- Backend: Claude-3-Opus (powerful reasoning)
- Testing: Claude-3-Sonnet (test generation)
- Documentation: GPT-3.5-Turbo (cost-efficient!)
- DevOps: GPT-4-Turbo (infrastructure-critical)

### 📈 Tracking
- Status file: `~/.leo-model-status.json`
- History: Last 50 selections tracked
- Duration: How long each phase takes
- Cost: Track model costs per task

---

## 🔍 View Status Information

Click the status bar to see detailed info:

```
LEO Model Status

Agent: backend
Model: claude-3-opus
Status: In Progress
Time: 2025-10-24T14:35:22.456Z

Recent Events:
  • agent-start: designer
  • agent-complete: designer
  • agent-start: frontend
  • agent-complete: frontend
  • agent-start: backend
```

---

## 🎯 Commands Available

After installing, you can use:

```bash
# Show current model information (in VS Code Command Palette)
Command: LEO: Show Current Model Info
→ Shows which agent/model currently active

# Select model preference
Command: LEO: Select Model Preference
→ Choose your preferred model for next task

# Show model history
Command: LEO: Show Model History
→ See all model selections in last 50 tasks
```

---

## ✅ Verification Checklist

- [ ] VS Code extension files copied to `~/.vscode/extensions/leo-model-selector/`
- [ ] VS Code restarted
- [ ] Status bar shows `⊘ LEO Ready`
- [ ] CLI updated with `ModelSelectionOrchestrator`
- [ ] CLI uses `selectModelWithTracking()` method
- [ ] Task runs and status bar updates
- [ ] Models change as agents switch
- [ ] Status file created at `~/.leo-model-status.json`

---

## 🐛 Troubleshooting

### Status bar not showing
```bash
# Check extension loaded
VS Code Command Palette → "Developer: Show Logs..." → Extension Host

# Restart
Command Palette → "Developer: Reload Window"
```

### Status bar shows "LEO Ready" but doesn't update
```bash
# Check if orchestrator is being used in your code
grep -r "selectModelWithTracking" lib/commands/

# Make sure status file path is correct
echo $HOME/.leo-model-status.json
```

### Models not changing between agents
```bash
# Check if completeAgent() is being called
# Check orchestrator configuration

console.log(orchestrator.getExecutionStatus());
```

---

## 🚀 Next Steps

1. ✅ Install extension
2. ✅ Update CLI with orchestrator
3. ✅ Run a feature build
4. ✅ Watch models change in real-time
5. ✅ Monitor status file for external integrations

**Result:** Dynamic model display in VS Code showing exactly which AI model is running at any moment! 🎉
