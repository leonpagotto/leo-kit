# Model Quality Control Guide

> **Control your AI model quality vs cost trade-offs**

LEO Workflow Kit v5.3.3+ gives you complete control over which AI models are used for your work. Choose between quality-first (best models), balanced (cost-optimized), or fixed single-model approaches.

---

## 📋 Quick Start

### Option 1: Use Best Models Everywhere (Quality-First)

**Perfect for:** Users coming from GitHub Copilot, quality-critical work, production environments

```json
{
  "model-selection": {
    "upgrade-defaults": true,
    "verbose": true
  }
}
```

✅ **Result:** All agents use high-quality models:

- Orchestrator: `claude-3.5-sonnet` (instead of `claude-3-haiku`)
- Documentation: `claude-3.5-sonnet` (instead of `claude-3-haiku`)
- Frontend/Backend: `claude-3.5-sonnet` (best coding)
- Designer: `gpt-4o` (best visual understanding)

---

### Option 2: Use Single Model for Everything (Fixed Model)

**Perfect for:** Consistency, testing, specific model preferences

```json
{
  "model-selection": {
    "fixed-model": "claude-3.5-sonnet",
    "verbose": true
  }
}
```

✅ **Result:** ALL agents use `claude-3.5-sonnet` regardless of task complexity

**Available options:**

- `"claude-3.5-sonnet"` - Best all-around coding (recommended)
- `"gpt-4o"` - Best for visual/design work
- `"gpt-4-turbo"` - Powerful reasoning
- `"o1-preview"` - Deepest reasoning for critical work

---

### Option 3: Custom/Beta/Enterprise Models

**Perfect for:** Users with access to beta models, enterprise agreements, or unreleased models

```json
{
  "model-selection": {
    "fixed-model": "claude-4.5-sonnet",
    "verbose": true,
    "show-reasoning": true
  }
}
```

✅ **Result:** Uses your custom model (e.g., Claude 4.5, GPT-5, etc.)

**Important Notes:**

- ⚠️ LEO accepts ANY model name - validation happens at the API provider level
- ✅ Perfect for beta testers, enterprise customers, or users with special access
- ✅ System shows warnings but doesn't block you from using the model
- 🔑 Make sure you have API credentials with access to the model

**Example Enterprise Models:**

```json
{
  "model-selection": {
    "fixed-model": "claude-4.5-sonnet", // Anthropic Enterprise/Beta
    // OR
    "fixed-model": "gpt-5", // OpenAI Enterprise/Beta
    // OR
    "fixed-model": "o1-preview", // OpenAI Reasoning Models
    // OR any other model your API key has access to
    "verbose": true
  }
}
```

**What you'll see:**

```
⚙️  Model Selection Configuration:
   Fixed Model: claude-4.5-sonnet (all agents will use this)
   ℹ️  Custom model (not in default registry)

🔒 Fixed Model Mode:
   ✓ Using fixed model: claude-4.5-sonnet
   Provider: Unknown (custom model)
   Type: Custom/Beta/Enterprise model
   ℹ️  This model is not in the default registry
   ℹ️  Ensure you have API access to: claude-4.5-sonnet
```

**Advanced: Define Custom Model Metadata (Optional)**

For better visibility and organization:

```json
{
  "model-selection": {
    "custom-models": {
      "claude-4.5-sonnet": {
        "provider": "anthropic",
        "tier": "ultra-premium",
        "description": "Claude 4.5 Sonnet (Enterprise Beta)",
        "cost": "very-high",
        "speed": "fast"
      },
      "gpt-5": {
        "provider": "openai",
        "tier": "ultra-premium",
        "description": "GPT-5 (Private Beta)",
        "cost": "very-high",
        "speed": "medium"
      }
    },
    "fixed-model": "claude-4.5-sonnet",
    "verbose": true
  }
}
```

This adds your custom models to LEO's internal registry with metadata for better tracking.

---

### Option 4: Balanced Mode (Cost-Optimized)

**Perfect for:** Budget-conscious projects, development environments

```json
{
  "model-selection": {
    "upgrade-defaults": false,
    "verbose": true
  }
}
```

✅ **Result:** Smart cost optimization:

- Simple tasks: `claude-3-haiku` (fast & cheap)
- Moderate tasks: `claude-3.5-sonnet` (balanced)
- Complex tasks: `claude-3-opus` or `gpt-4-turbo` (powerful)

💰 **Savings:** ~40% cost reduction compared to quality-first

---

### Option 4: Disable Model Selection (Always Default)

**Perfect for:** Simplicity, testing, known preferences

```json
{
  "model-selection": {
    "enabled": false,
    "verbose": true
  }
}
```

✅ **Result:** Always uses `claude-3.5-sonnet` as default

---

## 🎯 Configuration Reference

### All Available Options

```json
{
  "model-selection": {
    // Enable/disable dynamic model selection
    "enabled": true,

    // Strategy: "dynamic" (varies by task) or "fixed" (one model)
    "strategy": "dynamic",

    // Show real-time model selection output
    "verbose": true,

    // Show reasoning for model choices
    "show-reasoning": true,

    // Force specific model for ALL agents (overrides everything)
    "fixed-model": null,

    // Use best models (true) or cost-optimized (false)
    "upgrade-defaults": true
  }
}
```

---

## 🔍 Model Comparison

### Quality-First vs Balanced

| Agent             | Task Complexity | Balanced Mode    | Upgraded Mode       | Quality Gain |
| ----------------- | --------------- | ---------------- | ------------------- | ------------ |
| **Orchestrator**  | Simple          | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **Orchestrator**  | Moderate        | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **Documentation** | Simple          | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **Documentation** | Moderate        | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **Frontend**      | Simple          | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **Testing**       | Simple          | `claude-3-haiku` | `claude-3.5-sonnet` | ⬆️ +45%      |
| **DevOps**        | Simple          | `claude-3-haiku` | `gpt-4-turbo`       | ⬆️ +60%      |

**Cost Impact:** Quality-first mode costs ~40% more than balanced mode

---

## 💡 Use Case Recommendations

### When to Use Quality-First (`upgrade-defaults: true`)

✅ **Production applications**

- Critical business logic
- Customer-facing features
- Security-sensitive code

✅ **Coming from GitHub Copilot**

- You're used to high-quality model output
- Cost is not primary concern
- Quality consistency matters

✅ **Complex projects**

- Large codebases
- Multi-component systems
- Architecture-heavy work

---

### When to Use Balanced Mode (`upgrade-defaults: false`)

✅ **Development/Learning**

- Personal projects
- Prototyping
- Experimentation

✅ **Budget-conscious**

- Tight API budgets
- High-volume usage
- Non-critical tasks

✅ **Simple tasks**

- Documentation updates
- Simple bug fixes
- Basic CRUD operations

---

### When to Use Fixed Model (`fixed-model: "..."`)

✅ **Consistency requirements**

- Team standards
- Testing specific models
- Predictable output

✅ **Model preference**

- You know what works for your project
- Want to avoid surprises
- Specific model features needed

---

## 🚀 Real-World Examples

### Example 1: GitHub Copilot Replacement

**Problem:** "I use Copilot Pro with GPT-4. LEO's cost optimization uses Claude Haiku which is a downgrade."

**Solution:**

```json
{
  "model-selection": {
    "upgrade-defaults": true,
    "verbose": true
  }
}
```

**Result:** All agents use Claude 3.5 Sonnet or better (comparable to GPT-4)

---

### Example 2: Startup on Budget

**Problem:** "We love LEO but API costs are adding up. Need to optimize."

**Solution:**

```json
{
  "model-selection": {
    "upgrade-defaults": false,
    "verbose": true
  }
}
```

**Result:** 40% cost savings with smart optimization

---

### Example 3: Claude Fanatic

**Problem:** "I only want to use Claude 3.5 Sonnet for everything."

**Solution:**

```json
{
  "model-selection": {
    "fixed-model": "claude-3.5-sonnet",
    "verbose": true
  }
}
```

**Result:** Every single agent uses Claude 3.5 Sonnet

---

### Example 4: Testing & Validation

**Problem:** "Need predictable output for testing."

**Solution:**

```json
{
  "model-selection": {
    "enabled": false,
    "verbose": true
  }
}
```

**Result:** Always uses default Claude 3.5 Sonnet

---

## 📊 Cost Analysis

### Monthly Cost Estimates (100 tasks/day)

**Scenario:** Mixed workload (50% simple, 30% moderate, 20% complex)

| Mode                   | Monthly Cost | Quality Rating   | Best For              |
| ---------------------- | ------------ | ---------------- | --------------------- |
| **Quality-First**      | $120         | ⭐⭐⭐⭐⭐ (5/5) | Production, Pro users |
| **Balanced**           | $72          | ⭐⭐⭐⭐ (4/5)   | Development, Budget   |
| **Fixed (Claude 3.5)** | $100         | ⭐⭐⭐⭐⭐ (5/5) | Consistency, Testing  |
| **Disabled**           | $100         | ⭐⭐⭐⭐⭐ (5/5) | Simplicity            |

**Note:** Actual costs vary by usage patterns, API pricing, and task complexity.

---

## 🎨 Verbose Output Examples

### Quality-First Mode

```
⚙️  Model Selection Configuration:
   Enabled: true
   Strategy: dynamic
   Upgraded Defaults: true

🎯 Analyzing task for model selection...
   Agent: orchestrator
   Complexity: simple
   Strategy: default (upgraded)

🤖 Model Selection (Upgraded Defaults):
   Agent: orchestrator
   Complexity: simple
   ✓ Selected: claude-3.5-sonnet
```

### Fixed Model Mode

```
⚙️  Model Selection Configuration:
   Enabled: true
   Strategy: dynamic
   Fixed Model: claude-3.5-sonnet (all agents will use this)
   Upgraded Defaults: true

🔒 Fixed Model Mode:
   Agent: backend
   Complexity: complex
   ✓ Using fixed model: claude-3.5-sonnet
   Provider: Anthropic
   Tier: premium
   Cost: $$
   Speed: fast
```

### Balanced Mode

```
⚙️  Model Selection Configuration:
   Enabled: true
   Strategy: dynamic
   Upgraded Defaults: false

🎯 Analyzing task for model selection...
   Agent: documentation
   Complexity: simple
   Strategy: default (balanced)

🤖 Model Selection (Balanced):
   Agent: documentation
   Complexity: simple
   ✓ Selected: claude-3-haiku
```

---

## 🔧 Advanced Configuration

### Mix and Match

```json
{
  "model-selection": {
    // Use upgraded defaults for most agents
    "upgrade-defaults": true,

    // But show detailed reasoning
    "show-reasoning": true,

    // And allow overrides with environment variable
    "fixed-model": "${MODEL_OVERRIDE}",

    // Verbose for debugging
    "verbose": true
  }
}
```

### Per-Environment Configuration

**Development:**

```json
{
  "model-selection": {
    "upgrade-defaults": false,
    "verbose": true
  }
}
```

**Production:**

```json
{
  "model-selection": {
    "upgrade-defaults": true,
    "verbose": false,
    "show-reasoning": false
  }
}
```

---

## ❓ FAQ

### Q: Which mode should I use?

**A:** Start with **quality-first** (`upgrade-defaults: true`). If costs become an issue, switch to **balanced** mode. If you want ultimate control, use **fixed-model**.

### Q: Can I change modes dynamically?

**A:** Yes! Just edit `.leorc.json` and the changes take effect immediately.

### Q: What if I run out of budget?

**A:** LEO automatically falls back to cheaper models when budget is exceeded, regardless of your configuration.

### Q: Is Claude 3.5 Sonnet better than GPT-4?

**A:** For code generation, Claude 3.5 Sonnet is generally considered equal to or better than GPT-4. For reasoning tasks, GPT-4 may have an edge. For design work, GPT-4o is best.

### Q: Why was balanced mode the default in v5.3.1?

**A:** We initially optimized for cost. After user feedback, we realized quality should be the default. **v5.3.3+ uses quality-first by default.**

### Q: Can I use GPT-4 for everything?

**A:** Not yet, but you can set `"fixed-model": "gpt-4-turbo"` which is the latest GPT-4 variant.

---

## 🎯 Summary

**Default Configuration (Recommended):**

```json
{
  "model-selection": {
    "upgrade-defaults": true,
    "verbose": true,
    "show-reasoning": true
  }
}
```

**Why this is recommended:**

- ✅ Uses best available models (Claude 3.5 Sonnet, GPT-4o, GPT-4 Turbo)
- ✅ No quality regression from GitHub Copilot
- ✅ Visible model selection process
- ✅ Detailed reasoning for learning
- ✅ Can always switch to balanced mode later if needed

**To apply:**

1. Edit `.leorc.json` in your project root
2. Add/update the `model-selection` section
3. Save and restart LEO
4. Watch the verbose output to see models in action!

---

## 📚 Related Documentation

- [Model Selection API Reference](./API_REFERENCE.md#model-selection)
- [Configuration Guide](./CONFIGURATION.md)
- [Cost Tracking](./COST_TRACKING.md)
- [Agent System](./AGENTS.md)

---

**Last Updated:** v5.3.3 (October 29, 2025)
