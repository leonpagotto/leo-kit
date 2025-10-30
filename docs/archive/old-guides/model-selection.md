# Model Selection - LEO Workflow Kit

> **🤖 Automatic AI Model Selection for Optimal Performance and Cost Efficiency**
>
> LEO automatically selects the best AI model for each task based on agent role, task complexity, and development phase. This ensures you get the right balance of performance, cost, and quality for every piece of work.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [How It Works](#how-it-works)
4. [Configuration](#configuration)
5. [CLI Commands](#cli-commands)
6. [Budget Management](#budget-management)
7. [Selection Strategies](#selection-strategies)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Usage](#advanced-usage)

---

## Overview

### What is Model Selection?

Model Selection is LEO's intelligent system that automatically chooses the optimal AI model for each task you work on. Instead of always using the most powerful (and expensive) model, or the cheapest model that might struggle with complex tasks, LEO analyzes:

- **Agent Role**: Frontend, Backend, DevOps, Testing, Documentation
- **Task Complexity**: Simple (CRUD), Moderate (features), Complex (architecture)
- **Development Phase**: Development, Staging, Production

Based on these factors, LEO selects from a portfolio of models to give you the best results at the lowest cost.

### Why Use Model Selection?

✅ **Cost Efficiency**: Don't waste money on GPT-4 for simple tasks
✅ **Performance**: Use powerful models when you need them
✅ **Budget Control**: Set daily, monthly, and per-agent spending limits
✅ **Automatic**: No manual model selection needed
✅ **Transparent**: See exactly which model was selected and why

### Supported Models

| Model | Provider | Tier | Best For | Cost |
|-------|----------|------|----------|------|
| **GPT-4** | OpenAI | Premium | Complex reasoning, architecture | $$$ |
| **GPT-4-turbo** | OpenAI | High | Fast complex tasks | $$ |
| **GPT-3.5-turbo** | OpenAI | Standard | General development | $ |
| **Claude-3-opus** | Anthropic | Premium | Backend architecture, security | $$$ |
| **Claude-3-sonnet** | Anthropic | High | Frontend code generation | $$ |
| **Claude-3-haiku** | Anthropic | Standard | Documentation, simple tasks | $ |

---

## Quick Start

### 1. Check Model Status

```bash
# View all available models
leo model list

# Check current usage and budgets
leo model status
```

**Example Output:**
```
📊 Model Selection Status

Enabled Models:
✓ gpt-4 (premium) - Complex reasoning and architecture
✓ gpt-4-turbo (high) - Fast complex task execution
✓ gpt-3.5-turbo (standard) - General development tasks
✓ claude-3-opus (premium) - Backend architecture and security
✓ claude-3-sonnet (high) - Frontend code generation
✓ claude-3-haiku (standard) - Documentation and simple tasks

Budget Status:
Daily: $2.50 / $5.00 (50% used)
Monthly: $15.00 / $50.00 (30% used)

Per-Agent Budgets:
orchestrator: $3.20 / $10.00
frontend: $5.50 / $10.00
backend: $4.30 / $10.00
```

### 2. Configure Budgets (Optional)

Default budgets are reasonable for most projects, but you can customize:

```bash
# Set daily budget to $10
leo model budget daily 10

# Set monthly budget to $100
leo model budget monthly 100

# Set per-agent budget to $20
leo model budget agent 20
```

### 3. Enable/Disable Models (Optional)

All models are enabled by default. Disable expensive models if on a tight budget:

```bash
# Disable premium models to save costs
leo model disable gpt-4
leo model disable claude-3-opus

# Re-enable when needed
leo model enable gpt-4
```

### 4. Test Model Selection

Test which model would be selected for different scenarios:

```bash
# Test frontend + complex task
leo model test frontend complex
# Output: Would select: claude-3-opus

# Test testing + simple task
leo model test testing simple
# Output: Would select: gpt-3.5-turbo
```

---

## How It Works

### Selection Flow

When you start working on a task, LEO automatically:

1. **Analyzes** the task based on your description and file patterns
2. **Classifies** the agent role (frontend, backend, etc.)
3. **Determines** complexity level (simple, moderate, complex)
4. **Checks** development phase (dev, staging, production)
5. **Applies** selection strategies in order:
   - Agent-Specific Strategy
   - Complexity-Based Strategy
   - Phase-Based Strategy
   - Default Fallback
6. **Verifies** budget availability
7. **Selects** the optimal model
8. **Routes** to the agent with selected model

### Example: "Add OAuth2 Login"

```yaml
User Request: "Add OAuth2 login with Google and GitHub"

Step 1: Task Analysis
  Type: Backend (authentication)
  Complexity: Complex (security, multiple providers)
  Phase: Development

Step 2: Strategy Application
  Agent-Specific: Backend → Prefers Claude-3-opus, GPT-4
  Complexity: Complex → Premium tier models
  Phase: Development → Balanced selection

Step 3: Model Selection
  Selected: claude-3-opus
  Reason: Backend architecture + Complex security task
  Cost: $0.03 per 1K tokens

Step 4: Budget Check
  Backend agent budget: $7.20 / $10.00 available ✓
  Daily budget: $3.50 / $5.00 available ✓
  Monthly budget: $20.00 / $50.00 available ✓

Step 5: Execution
  Task routed to Backend Agent with claude-3-opus
```

---

## Configuration

Model selection is configured in `.leorc.json`:

### Default Configuration

```json
{
  "model-selection": {
    "enabled": true,
    "default-strategy": "agent-specific",
    "fallback-strategy": "complexity-based",
    "budgets": {
      "daily": 5,
      "monthly": 50,
      "per-agent": 10
    },
    "models": {
      "gpt-4": { "enabled": true },
      "gpt-4-turbo": { "enabled": true },
      "gpt-3.5-turbo": { "enabled": true },
      "claude-3-opus": { "enabled": true },
      "claude-3-sonnet": { "enabled": true },
      "claude-3-haiku": { "enabled": true }
    }
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable/disable model selection |
| `default-strategy` | string | `"agent-specific"` | Primary selection strategy |
| `fallback-strategy` | string | `"complexity-based"` | Fallback if primary fails |
| `budgets.daily` | number | `5` | Daily spending limit ($) |
| `budgets.monthly` | number | `50` | Monthly spending limit ($) |
| `budgets.per-agent` | number | `10` | Per-agent spending limit ($) |
| `models.<model>.enabled` | boolean | `true` | Enable/disable specific model |

### Manual Configuration

Edit `.leorc.json` directly or use CLI commands:

```bash
# Enable/disable models
leo model enable gpt-4
leo model disable claude-3-opus

# Set budgets
leo model budget daily 10
leo model budget monthly 100
leo model budget agent 20

# Reset usage tracking
leo model usage reset
```

---

## CLI Commands

### `leo model list`

Display all available models with their status, tier, and capabilities.

```bash
leo model list
```

**Output:**
```
📊 Available AI Models

✓ gpt-4 (premium)
  Provider: OpenAI
  Speed: Slow
  Cost: High
  Best for: Complex reasoning, system architecture, critical decisions

✓ gpt-4-turbo (high)
  Provider: OpenAI
  Speed: Fast
  Cost: Medium-High
  Best for: Fast complex tasks, multi-step workflows

✓ gpt-3.5-turbo (standard)
  Provider: OpenAI
  Speed: Very Fast
  Cost: Low
  Best for: General development, CRUD operations, simple features

✓ claude-3-opus (premium)
  Provider: Anthropic
  Speed: Moderate
  Cost: High
  Best for: Backend architecture, security, complex logic

✓ claude-3-sonnet (high)
  Provider: Anthropic
  Speed: Fast
  Cost: Medium
  Best for: Frontend code generation, UI components

✓ claude-3-haiku (standard)
  Provider: Anthropic
  Speed: Very Fast
  Cost: Very Low
  Best for: Documentation, comments, simple refactoring
```

### `leo model status`

Show current usage, budgets, and model selection status.

```bash
leo model status
```

**Output:**
```
📊 Model Selection Status

Configuration:
  Strategy: agent-specific (fallback: complexity-based)
  Status: ✓ ENABLED

Enabled Models: 6 / 6
  ✓ gpt-4, gpt-4-turbo, gpt-3.5-turbo
  ✓ claude-3-opus, claude-3-sonnet, claude-3-haiku

Budget Status:
  Daily: $2.50 / $5.00 (50% used) - Resets in 8 hours
  Monthly: $15.00 / $50.00 (30% used) - Resets in 12 days

Per-Agent Usage:
  orchestrator: $3.20 / $10.00 (32%)
  frontend: $5.50 / $10.00 (55%)
  backend: $4.30 / $10.00 (43%)
  testing: $1.50 / $10.00 (15%)
  documentation: $0.50 / $10.00 (5%)

Total Requests: 125
Average Cost: $0.12 per request
```

### `leo model enable <model>`

Enable a specific model for selection.

```bash
leo model enable gpt-4
```

### `leo model disable <model>`

Disable a specific model (will use fallback).

```bash
leo model disable gpt-4
```

**Note**: You must have at least one model enabled in each tier.

### `leo model budget <type> <amount>`

Set budget limits.

```bash
# Daily budget
leo model budget daily 10

# Monthly budget
leo model budget monthly 100

# Per-agent budget
leo model budget agent 20
```

### `leo model usage`

View detailed usage statistics.

```bash
leo model usage
```

**Output:**
```
📊 Model Usage Statistics

This Month:
  Total Cost: $15.00
  Total Requests: 125
  Average: $0.12 per request

By Model:
  gpt-4: 15 requests ($6.00) - 40%
  claude-3-opus: 10 requests ($4.00) - 27%
  gpt-4-turbo: 20 requests ($2.50) - 17%
  claude-3-sonnet: 30 requests ($1.80) - 12%
  gpt-3.5-turbo: 40 requests ($0.50) - 3%
  claude-3-haiku: 10 requests ($0.20) - 1%

By Agent:
  orchestrator: 25 requests ($3.20)
  frontend: 35 requests ($5.50)
  backend: 30 requests ($4.30)
  testing: 20 requests ($1.50)
  documentation: 15 requests ($0.50)

Top 5 Most Expensive Requests:
  1. Backend refactor (gpt-4): $0.85
  2. Architecture design (claude-3-opus): $0.75
  3. Complex feature (gpt-4): $0.60
  4. Security audit (claude-3-opus): $0.50
  5. Multi-agent coordination (gpt-4-turbo): $0.45
```

### `leo model usage reset`

Reset usage tracking (for testing or new billing cycle).

```bash
leo model usage reset
```

⚠️ **Warning**: This will clear all usage statistics. Monthly budgets auto-reset on the 1st of each month.

### `leo model test <agent> <complexity>`

Test which model would be selected for a scenario without making actual API calls.

```bash
# Test frontend + complex
leo model test frontend complex
# Output: Would select: claude-3-opus

# Test backend + simple
leo model test backend simple
# Output: Would select: gpt-3.5-turbo

# Test orchestrator + complex
leo model test orchestrator complex
# Output: Would select: gpt-4
```

---

## Budget Management

### Budget Types

LEO enforces three levels of budget:

1. **Daily Budget**: Resets every 24 hours
2. **Monthly Budget**: Resets on the 1st of each month
3. **Per-Agent Budget**: Tracks spending per specialized agent

All three are checked before executing a task. If any budget is exceeded, LEO falls back to the cheapest available model.

### Setting Budgets

```bash
# Conservative budgets (small projects)
leo model budget daily 2
leo model budget monthly 20
leo model budget agent 5

# Standard budgets (most projects) - DEFAULT
leo model budget daily 5
leo model budget monthly 50
leo model budget agent 10

# Generous budgets (large projects)
leo model budget daily 10
leo model budget monthly 100
leo model budget agent 20

# Enterprise budgets (production systems)
leo model budget daily 50
leo model budget monthly 500
leo model budget agent 100
```

### Budget Enforcement

When a budget is exceeded:

1. **Warning**: LEO logs a warning message
2. **Fallback**: Automatically selects cheapest model (gpt-3.5-turbo or claude-3-haiku)
3. **Continues**: Work continues with fallback model
4. **Notification**: User notified of budget limit

```bash
⚠️  Daily budget exceeded ($5.20 / $5.00)
✓ Falling back to cost-efficient model: gpt-3.5-turbo
ℹ️  Increase budget with: leo model budget daily 10
```

### Monitoring Usage

**Real-time Monitoring:**

```bash
# Check status anytime
leo model status

# View detailed usage
leo model usage
```

**Usage Tracking File:**

LEO stores usage data in `.leo/model-usage.json`:

```json
{
  "month": "2025-01",
  "dailyUsage": {
    "2025-01-24": {
      "cost": 2.5,
      "requests": 20,
      "byAgent": {
        "frontend": 1.2,
        "backend": 1.3
      }
    }
  },
  "monthlyUsage": {
    "cost": 15.0,
    "requests": 125
  }
}
```

---

## Selection Strategies

LEO uses multiple strategies to select the optimal model. Strategies are applied in order until one succeeds.

### 1. Agent-Specific Strategy

Each agent has preferred models based on their specialization.

| Agent | Primary Models | Fallback Models | Reasoning |
|-------|---------------|-----------------|-----------|
| **Orchestrator** | GPT-4, GPT-4-turbo | GPT-3.5-turbo | Requires strong reasoning for task routing |
| **Frontend** | Claude-3-sonnet, GPT-4-turbo | Claude-3-haiku | Excels at code generation and UI logic |
| **Backend** | Claude-3-opus, GPT-4 | GPT-3.5-turbo | Best for architecture and security |
| **DevOps** | GPT-4-turbo, GPT-4 | GPT-3.5-turbo | Infrastructure requires reliability |
| **Testing** | GPT-3.5-turbo, Claude-3-haiku | Claude-3-haiku | Test generation is straightforward |
| **Documentation** | Claude-3-haiku, GPT-3.5-turbo | Claude-3-haiku | Writing documentation is simple |

**Example:**

```javascript
// Backend agent working on authentication
Agent: backend
Strategy: agent-specific
Selected: claude-3-opus (preferred for backend architecture)
```

### 2. Complexity-Based Strategy

Task complexity determines model tier.

| Complexity | Model Tier | Examples |
|------------|-----------|----------|
| **Simple** | Standard ($ - $$) | CRUD operations, docs, simple fixes |
| **Moderate** | High ($$ - $$$) | Feature implementation, refactoring |
| **Complex** | Premium ($$$) | Architecture, security, multi-component |

**Selection Logic:**

- **Simple** → gpt-3.5-turbo, claude-3-haiku
- **Moderate** → gpt-4-turbo, claude-3-sonnet
- **Complex** → gpt-4, claude-3-opus

**Example:**

```javascript
// Complex security implementation
Complexity: complex
Strategy: complexity-based
Selected: gpt-4 (premium model for complex tasks)
```

### 3. Phase-Based Strategy

Development phase influences model selection.

| Phase | Priority | Model Selection |
|-------|----------|-----------------|
| **Development** | Cost-efficient | Prefer standard tier for iteration |
| **Staging** | Balanced | Mix of high and standard tier |
| **Production** | Performance | Prefer premium tier for reliability |

**Environment Detection:**

LEO detects phase from:
- `LEO_PHASE` environment variable
- `NODE_ENV` environment variable
- Git branch name (main/master = production)

**Example:**

```bash
# Set development phase
export LEO_PHASE=development

# Set production phase
export LEO_PHASE=production
```

**Selection Logic:**

- **Development** → Favor cost-efficient models
- **Staging** → Balanced approach
- **Production** → Favor powerful models

### 4. Default Fallback Strategy

If all strategies fail or budgets are exceeded:

1. Try standard tier: gpt-3.5-turbo
2. If unavailable, try claude-3-haiku
3. If unavailable, fail with error

---

## Troubleshooting

### Model Selection Not Working

**Symptom**: Always using the same model regardless of task

**Solution**:

```bash
# Check if model selection is enabled
leo model status

# If disabled, check .leorc.json
# Ensure: "model-selection": { "enabled": true }

# Regenerate AI instructions
leo agent sync
```

### Budget Exceeded Too Quickly

**Symptom**: Hitting daily/monthly budget limits frequently

**Solutions**:

```bash
# Option 1: Increase budgets
leo model budget daily 10
leo model budget monthly 100

# Option 2: Disable expensive models
leo model disable gpt-4
leo model disable claude-3-opus

# Option 3: Set lower per-agent budgets for non-critical agents
# Edit .leorc.json to set custom per-agent budgets
```

### Wrong Model Being Selected

**Symptom**: Model selection doesn't match expectations

**Solution**:

```bash
# Test the selection logic
leo model test <agent> <complexity>

# Check which models are enabled
leo model list

# Verify strategy configuration in .leorc.json
# "default-strategy": "agent-specific"
# "fallback-strategy": "complexity-based"
```

### Usage Tracking Not Updating

**Symptom**: `leo model status` shows 0 usage

**Explanation**: Usage tracking requires integration with actual AI provider APIs (OpenAI, Anthropic). In the current version, LEO provides the infrastructure but doesn't make actual API calls. Tracking will work when integrated with real providers.

### Configuration Changes Not Applied

**Symptom**: Model configuration changes not taking effect

**Solution**:

```bash
# After editing .leorc.json, regenerate AI instructions
leo agent sync

# This updates .github/copilot-instructions.md and other AI files
```

---

## Advanced Usage

### Custom Per-Agent Budgets

Set different budgets for different agents:

```json
{
  "model-selection": {
    "budgets": {
      "daily": 10,
      "monthly": 100,
      "per-agent": {
        "orchestrator": 20,
        "frontend": 15,
        "backend": 25,
        "testing": 5,
        "documentation": 3
      }
    }
  }
}
```

### Phase-Based Deployment

Use different configurations for different environments:

**.leorc.development.json**:
```json
{
  "model-selection": {
    "budgets": { "daily": 2, "monthly": 20 },
    "models": {
      "gpt-4": { "enabled": false },
      "claude-3-opus": { "enabled": false }
    }
  }
}
```

**.leorc.production.json**:
```json
{
  "model-selection": {
    "budgets": { "daily": 50, "monthly": 500 },
    "models": {
      "gpt-4": { "enabled": true },
      "claude-3-opus": { "enabled": true }
    }
  }
}
```

### Cost Optimization Strategies

**Strategy 1: Disable Premium Models During Development**

```bash
# Development
leo model disable gpt-4
leo model disable claude-3-opus
leo model budget daily 2

# Production
leo model enable gpt-4
leo model enable claude-3-opus
leo model budget daily 20
```

**Strategy 2: Agent-Specific Restrictions**

Only use premium models for critical agents:

```json
{
  "agents": {
    "backend": {
      "enabled": true,
      "allowed-models": ["claude-3-opus", "gpt-4"]
    },
    "frontend": {
      "enabled": true,
      "allowed-models": ["claude-3-sonnet", "gpt-3.5-turbo"]
    },
    "testing": {
      "enabled": true,
      "allowed-models": ["gpt-3.5-turbo", "claude-3-haiku"]
    }
  }
}
```

**Strategy 3: Time-Based Budgets**

Use cron jobs to reset budgets at specific times:

```bash
# Reset daily budget at midnight
0 0 * * * leo model budget daily 5

# Reset monthly budget on 1st of month
0 0 1 * * leo model budget monthly 50
```

### Integration with CI/CD

Use environment-specific budgets in CI/CD pipelines:

```yaml
# .github/workflows/deploy.yml
- name: Configure Model Selection for Production
  run: |
    leo model budget daily 50
    leo model budget monthly 500
    leo model enable gpt-4
    leo model enable claude-3-opus
```

---

## Cost Estimation

### Model Pricing (Approximate)

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| gpt-4 | $0.03 | $0.06 |
| gpt-4-turbo | $0.01 | $0.03 |
| gpt-3.5-turbo | $0.0005 | $0.0015 |
| claude-3-opus | $0.015 | $0.075 |
| claude-3-sonnet | $0.003 | $0.015 |
| claude-3-haiku | $0.00025 | $0.00125 |

### Usage Examples

**Small Project** (10 tasks/day):
- Budget: $2/day, $20/month
- Models: gpt-3.5-turbo, claude-3-haiku
- Cost: ~$0.10-0.20 per task

**Medium Project** (30 tasks/day):
- Budget: $5/day, $50/month
- Models: All except premium
- Cost: ~$0.15-0.30 per task

**Large Project** (100 tasks/day):
- Budget: $20/day, $200/month
- Models: All models
- Cost: ~$0.15-0.40 per task

---

## Next Steps

- [Selection Strategies Deep Dive](./model-selection-strategies.md)
- [Cost Optimization Guide](./model-selection-cost-optimization.md)
- [Developer API Documentation](../developers/model-selection-api.md)
- [Multi-Agent System Guide](./multi-agent-system.md)

---

**Questions or Issues?**

- GitHub Issues: https://github.com/leonpagotto/leo-kit/issues
- Documentation: https://github.com/leonpagotto/leo-kit/wiki
