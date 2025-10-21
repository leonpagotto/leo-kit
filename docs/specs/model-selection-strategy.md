# Model Selection Strategy - LEO Workflow Kit

> **Specification Document** > **Feature:** Intelligent Model Selection for Multi-Agent Workflows
> **Issue:** #40
> **Status:** 📋 Proposed
> **Complexity:** Medium-to-Complex (2-3 weeks)
> **Target Release:** v4.1.0

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Goals](#goals)
4. [Non-Goals](#non-goals)
5. [Proposed Solution](#proposed-solution)
6. [Technical Design](#technical-design)
7. [Configuration Schema](#configuration-schema)
8. [CLI Commands](#cli-commands)
9. [Implementation Plan](#implementation-plan)
10. [Testing Strategy](#testing-strategy)
11. [Documentation](#documentation)
12. [Success Metrics](#success-metrics)

---

## Overview

Implement intelligent model selection strategy that automatically chooses the optimal AI model based on:

- **Development Phase** (development, testing, deployment)
- **Task Complexity** (simple, medium, complex)
- **Agent Role** (orchestrator, frontend, backend, devops, testing, documentation)
- **Cost Constraints** (budget limits per agent/task)

This feature enhances LEO's multi-agent system by optimizing cost-to-performance ratio while maintaining quality.

---

## Problem Statement

### Current State

- All agents use the same AI model (GitHub Copilot)
- No cost optimization based on task complexity
- No flexibility to choose specialized models per agent
- No awareness of development phase for model selection
- Limited control over AI usage costs

### Pain Points

1. **High Costs**: Using advanced models for simple tasks
2. **Inefficiency**: Not leveraging specialized coding models
3. **Inflexibility**: Cannot adapt model choice to project constraints
4. **No Budget Control**: No per-agent cost limits
5. **Phase Ignorance**: Same model for development and production

---

## Goals

### Primary Goals

1. ✅ Enable **per-agent model configuration** with fallback support
2. ✅ Implement **phase-based model selection** (dev, test, deploy)
3. ✅ Support **complexity-based model routing** (simple → cheap, complex → advanced)
4. ✅ Add **cost tracking and budget limits** per agent
5. ✅ Provide **CLI commands** for model management
6. ✅ Maintain **backward compatibility** with existing configurations

### Secondary Goals

1. Support multiple AI providers (OpenAI, Anthropic, Google, local models)
2. Cost estimation before task execution
3. Model performance analytics
4. Automatic fallback on model failure or rate limits

---

## Non-Goals

- ❌ Building a custom AI model selection engine (use existing APIs)
- ❌ Training custom models
- ❌ Real-time model performance benchmarking
- ❌ Cross-provider cost comparison dashboard (maybe v4.2.0)

---

## Proposed Solution

### Architecture

```
User Request
     │
     ▼
┌─────────────────────┐
│  Orchestrator Agent │ ──► Determines task complexity
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Model Selector      │ ──► Checks phase, complexity, budget
│ - Phase strategy    │
│ - Complexity check  │
│ - Cost validation   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Agent Executor      │ ──► Uses selected model
│ with assigned model │
└─────────────────────┘
```

### Selection Strategies

#### 1. **Phase-Based Strategy**

```javascript
// Models per development phase using latest GPT-5 and Claude 4.5
const phaseModels = {
  development: {
    orchestrator: "claude-haiku-4.5-preview",
    frontend: "claude-haiku-4.5-preview",
    backend: "claude-haiku-4.5-preview",
    devops: "claude-haiku-4.5-preview",
    testing: "claude-haiku-4.5-preview",
    documentation: "claude-haiku-4.5-preview",
  },
  testing: {
    orchestrator: "gpt-5-codex-preview",
    frontend: "claude-sonnet-4.5",
    backend: "claude-sonnet-4.5",
    devops: "gpt-5-codex-preview",
    testing: "gpt-5-codex-preview",
    documentation: "claude-sonnet-4.5",
  },
  deployment: {
    orchestrator: "gpt-5",
    frontend: "claude-sonnet-4.5",
    backend: "claude-sonnet-4.5",
    devops: "gpt-5",
    testing: "gpt-5",
    documentation: "claude-sonnet-4.5",
  },
};
```

#### 2. **Complexity-Based Strategy**

```javascript
// Model selection based on task complexity
const complexityModels = {
  simple: {
    model: "claude-haiku-4.5-preview",
    maxTokens: 1000,
    costLimit: 0.001,
  },
  medium: {
    model: "gpt-5-codex-preview",
    maxTokens: 4000,
    costLimit: 0.01,
  },
  complex: {
    model: "gpt-5",
    maxTokens: 8000,
    costLimit: 0.05,
  },
};
```

#### 3. **Agent-Based Strategy**

```javascript
// Aligned with enabled AI assistants: copilot, cursor, cline, codeium
const agentModels = {
  orchestrator: {
    primary: "gpt-5", // GitHub Copilot - Intelligent routing
    fallback: "claude-sonnet-4.5", // Cursor/Cline
    costLimit: 0.1,
    specialization: "reasoning",
    aiAssistant: "copilot",
  },
  frontend: {
    primary: "claude-sonnet-4.5", // Cursor - UI/React expertise
    fallback: "gpt-5-codex-preview",
    costLimit: 0.05,
    specialization: "frontend-coding",
    aiAssistant: "cursor",
  },
  backend: {
    primary: "claude-sonnet-4.5", // Cline - API/database
    fallback: "gpt-5-codex-preview",
    costLimit: 0.05,
    specialization: "backend-coding",
    aiAssistant: "cline",
  },
  devops: {
    primary: "claude-haiku-4.5-preview", // Copilot - Scripts, configs
    fallback: "gpt-5-codex-preview",
    costLimit: 0.02,
    specialization: "devops",
    aiAssistant: "copilot",
  },
  testing: {
    primary: "gpt-5-codex-preview", // Copilot - Test generation
    fallback: "claude-sonnet-4.5",
    costLimit: 0.03,
    specialization: "testing",
    aiAssistant: "copilot",
  },
  documentation: {
    primary: "claude-haiku-4.5-preview", // Cursor - Content generation
    fallback: "claude-sonnet-4.5",
    costLimit: 0.01,
    specialization: "documentation",
    aiAssistant: "cursor",
  },
};
```

#### 2. **Complexity-Based Strategy**

```javascript
// Model selection based on task complexity
const complexityModels = {
  simple: {
    model: "gpt-4o-mini",
    maxTokens: 1000,
    costLimit: 0.001,
  },
  medium: {
    model: "gpt-4o",
    maxTokens: 4000,
    costLimit: 0.01,
  },
  complex: {
    model: "claude-3.5-opus",
    maxTokens: 8000,
    costLimit: 0.05,
  },
};
```

#### 3. **Agent-Based Strategy**

```javascript
// Aligned with enabled AI assistants: copilot, cursor, cline, codeium
const agentModels = {
  orchestrator: {
    primary: "gpt-4o", // GitHub Copilot - Intelligent routing
    fallback: "claude-3.5-sonnet", // Cursor/Cline
    costLimit: 0.1,
    specialization: "reasoning",
    aiAssistant: "copilot",
  },
  frontend: {
    primary: "claude-3.5-sonnet", // Cursor - UI/React expertise
    fallback: "gpt-4o",
    costLimit: 0.05,
    specialization: "frontend-coding",
    aiAssistant: "cursor",
  },
  backend: {
    primary: "claude-3.5-sonnet", // Cline - API/database
    fallback: "gpt-4o",
    costLimit: 0.05,
    specialization: "backend-coding",
    aiAssistant: "cline",
  },
  devops: {
    primary: "gpt-4o-mini", // GitHub Copilot - Scripts, configs
    fallback: "claude-3.5-haiku",
    costLimit: 0.02,
    specialization: "devops",
    aiAssistant: "copilot",
  },
  testing: {
    primary: "gpt-4o", // GitHub Copilot - Test generation
    fallback: "claude-3.5-sonnet",
    costLimit: 0.03,
    specialization: "testing",
    aiAssistant: "copilot",
  },
  documentation: {
    primary: "claude-3.5-haiku", // Cursor - Content generation
    fallback: "gpt-4o-mini",
    costLimit: 0.01,
    specialization: "documentation",
    aiAssistant: "cursor",
  },
};
```

---

## Technical Design

### File Structure

```
lib/
├── model-selection/
│   ├── index.js                 # Main model selector
│   ├── strategies/
│   │   ├── phase-strategy.js    # Phase-based selection
│   │   ├── complexity-strategy.js # Complexity-based
│   │   └── agent-strategy.js    # Agent-based
│   ├── providers/
│   │   ├── openai.js            # OpenAI API wrapper
│   │   ├── anthropic.js         # Anthropic API wrapper
│   │   ├── google.js            # Google AI wrapper
│   │   └── local.js             # Local model support
│   ├── cost-tracker.js          # Cost tracking & limits
│   └── fallback-handler.js      # Fallback logic
├── commands/
│   └── model.js                 # New CLI command
└── utils/
    └── model-config.js          # Model configuration manager
```

### Core Classes

#### 1. **ModelSelector**

```javascript
class ModelSelector {
  constructor(config) {
    this.config = config;
    this.strategy = config.modelSelection?.strategy || "agent-based";
    this.costTracker = new CostTracker(config);
  }

  async selectModel(agent, task, complexity) {
    // 1. Check budget
    if (!this.costTracker.canAfford(agent, task)) {
      return this.selectFallback(agent);
    }

    // 2. Apply strategy
    const model = await this.applyStrategy(agent, task, complexity);

    // 3. Validate availability
    if (!(await this.isModelAvailable(model))) {
      return this.selectFallback(agent);
    }

    // 4. Track usage
    this.costTracker.recordUsage(agent, model, task);

    return model;
  }

  applyStrategy(agent, task, complexity) {
    switch (this.strategy) {
      case "phase-based":
        return this.phaseStrategy.select(agent);
      case "complexity-based":
        return this.complexityStrategy.select(complexity);
      case "agent-based":
        return this.agentStrategy.select(agent);
      default:
        return this.config.modelSelection?.agents?.[agent]?.model || "gpt-4";
    }
  }

  selectFallback(agent) {
    return (
      this.config.modelSelection?.agents?.[agent]?.fallback || "gpt-3.5-turbo"
    );
  }
}
```

#### 2. **CostTracker**

```javascript
class CostTracker {
  constructor(config) {
    this.config = config;
    this.usage = this.loadUsage();
  }

  canAfford(agent, task) {
    const limit =
      this.config.modelSelection?.agents?.[agent]?.costLimit || Infinity;
    const currentCost = this.usage[agent] || 0;
    const estimatedCost = this.estimateCost(task);

    return currentCost + estimatedCost <= limit;
  }

  recordUsage(agent, model, task) {
    const cost = this.calculateCost(model, task);
    this.usage[agent] = (this.usage[agent] || 0) + cost;
    this.saveUsage();
  }

  estimateCost(task) {
    // Estimate tokens → cost
    const estimatedTokens = task.length * 1.5; // rough estimate
    return this.tokensToCostan(estimatedTokens, "gpt-4"); // worst case
  }

  calculateCost(model, task) {
    // Actual cost calculation based on model pricing
    const pricing = this.modelPricing[model];
    const tokens = this.countTokens(task);
    return (tokens / 1000) * pricing.per1kTokens;
  }
}
```

---

## Configuration Schema

### `.leorc.json` Extension

```json
{
  "model-selection": {
    "enabled": true,
    "strategy": "agent-based",
    "development-phase": "development",
    "cost-tracking": true,
    "monthly-budget": 50.0,

    "agents": {
      "orchestrator": {
        "model": "gpt-5",
        "fallback": "claude-sonnet-4.5",
        "cost-limit": 10.0,
        "max-tokens": 8000,
        "temperature": 0.7,
        "ai-assistant": "copilot"
      },
      "frontend": {
        "model": "claude-sonnet-4.5",
        "fallback": "gpt-5",
        "cost-limit": 5.0,
        "max-tokens": 4000,
        "temperature": 0.5,
        "ai-assistant": "cursor"
      },
      "backend": {
        "model": "claude-sonnet-4.5",
        "fallback": "gpt-5-codex-preview",
        "cost-limit": 5.0,
        "max-tokens": 4000,
        "temperature": 0.5,
        "ai-assistant": "cline"
      },
      "devops": {
        "model": "claude-haiku-4.5-preview",
        "fallback": "gpt-5-codex-preview",
        "cost-limit": 2.0,
        "max-tokens": 2000,
        "temperature": 0.3,
        "ai-assistant": "copilot"
      },
      "testing": {
        "model": "gpt-5-codex-preview",
        "fallback": "claude-sonnet-4.5",
        "cost-limit": 3.0,
        "max-tokens": 4000,
        "temperature": 0.4,
        "ai-assistant": "copilot"
      },
      "documentation": {
        "model": "claude-haiku-4.5-preview",
        "fallback": "claude-sonnet-4.5",
        "cost-limit": 1.0,
        "max-tokens": 2000,
        "temperature": 0.6,
        "ai-assistant": "cursor"
      }
    },

    "complexity-thresholds": {
      "simple": {
        "model": "claude-haiku-4.5-preview",
        "max-tokens": 1000,
        "indicators": ["bug fix", "typo", "formatting"]
      },
      "medium": {
        "model": "gpt-5-codex-preview",
        "max-tokens": 4000,
        "indicators": ["new feature", "refactor", "optimization"]
      },
      "complex": {
        "model": "gpt-5",
        "max-tokens": 8000,
        "indicators": ["architecture", "system design", "integration"]
      }
    },

    "providers": {
      "openai": {
        "api-key-env": "OPENAI_API_KEY",
        "enabled": true,
        "models": ["gpt-5", "gpt-5-codex-preview", "gpt-4o", "gpt-4o-mini"]
      },
      "anthropic": {
        "api-key-env": "ANTHROPIC_API_KEY",
        "enabled": true,
        "models": ["claude-sonnet-4.5", "claude-haiku-4.5-preview", "claude-3.5-opus"]
      },
      "google": {
        "api-key-env": "GOOGLE_AI_API_KEY",
        "enabled": false,
        "models": ["gemini-2.0-flash-exp", "gemini-1.5-pro"]
      }
    },

    "ai-assistant-mapping": {
      "copilot": ["gpt-5", "gpt-5-codex-preview", "gpt-4o", "gpt-4o-mini"],
      "cursor": [
        "claude-sonnet-4.5",
        "claude-haiku-4.5-preview",
        "gpt-5"
      ],
      "cline": [
        "claude-sonnet-4.5",
        "gpt-5",
        "gpt-5-codex-preview",
        "gemini-2.0-flash-exp"
      ],
      "codeium": ["gpt-5", "claude-sonnet-4.5"]
    }
  }
}
```

        "model": "gpt-3.5-turbo",
        "fallback": "claude-3-haiku",
        "cost-limit": 2.0,
        "max-tokens": 2000,
        "temperature": 0.3
      },
      "testing": {
        "model": "gpt-4-turbo",
        "fallback": "claude-3-sonnet",
        "cost-limit": 3.0,
        "max-tokens": 4000,
        "temperature": 0.4
      },
      "documentation": {
        "model": "claude-3-haiku",
        "fallback": "gpt-3.5-turbo",
        "cost-limit": 1.0,
        "max-tokens": 2000,
        "temperature": 0.6
      }
    },

    "complexity-thresholds": {
      "simple": {
        "model": "gpt-3.5-turbo",
        "max-tokens": 1000,
        "indicators": ["bug fix", "typo", "formatting"]
      },
      "medium": {
        "model": "gpt-4-turbo",
        "max-tokens": 4000,
        "indicators": ["new feature", "refactor", "optimization"]
      },
      "complex": {
        "model": "gpt-4",
        "max-tokens": 8000,
        "indicators": ["architecture", "system design", "integration"]
      }
    },

    "providers": {
      "openai": {
        "api-key-env": "OPENAI_API_KEY",
        "enabled": true
      },
      "anthropic": {
        "api-key-env": "ANTHROPIC_API_KEY",
        "enabled": true
      },
      "google": {
        "api-key-env": "GOOGLE_AI_API_KEY",
        "enabled": false
      }
    }

}
}

````

---

## CLI Commands

### New Command: `leo model`

```bash
# View current model configuration
leo model list

# Set model selection strategy
leo model strategy <phase-based|complexity-based|agent-based>

# Configure agent model
leo model set <agent> --model <model-name> --fallback <fallback-model> --limit <cost-limit>

# View cost usage
leo model costs

# Reset cost tracking
leo model reset-costs

# Test model selection
leo model test <agent> <task-description>

# Set development phase
leo model phase <development|testing|deployment>

# Enable/disable cost tracking
leo model cost-tracking <on|off>

# Set monthly budget
leo model budget <amount>
````

### Examples

```bash
# Set frontend agent to use Claude Sonnet
leo model set frontend --model claude-3-sonnet --fallback gpt-4-turbo --limit 5.00

# Switch to development phase (uses cheaper models)
leo model phase development

# View current costs
leo model costs
# Output:
# Agent          Model              Cost     Limit    Remaining
# orchestrator   gpt-4             $2.45    $10.00   $7.55
# frontend       claude-3-sonnet   $1.20    $5.00    $3.80
# backend        claude-3-sonnet   $1.50    $5.00    $3.50
# TOTAL                            $5.15    $50.00   $44.85

# Test model selection
leo model test frontend "Create a responsive navbar component"
# Output:
# Agent: frontend
# Selected Model: claude-3-sonnet
# Reason: Agent-based strategy, within budget
# Estimated Cost: $0.05
```

---

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

- [ ] Create `lib/model-selection/` structure
- [ ] Implement `ModelSelector` class
- [ ] Implement `CostTracker` class
- [ ] Add configuration schema to `.leorc.json`
- [ ] Create provider wrappers (OpenAI, Anthropic)

### Phase 2: Strategy Implementation (Week 1-2)

- [ ] Implement Phase-Based Strategy
- [ ] Implement Complexity-Based Strategy
- [ ] Implement Agent-Based Strategy
- [ ] Add fallback handler
- [ ] Add cost estimation logic

### Phase 3: CLI Commands (Week 2)

- [ ] Create `leo model` command
- [ ] Implement `leo model list`
- [ ] Implement `leo model set`
- [ ] Implement `leo model costs`
- [ ] Implement `leo model strategy`
- [ ] Implement `leo model phase`

### Phase 4: Integration (Week 2-3)

- [ ] Integrate with orchestrator agent
- [ ] Update agent execution to use selected models
- [ ] Add model selection to agent templates
- [ ] Update Copilot instructions

### Phase 5: Testing & Documentation (Week 3)

- [ ] Unit tests for model selector
- [ ] Integration tests for strategies
- [ ] CLI command tests
- [ ] User documentation
- [ ] Migration guide from v4.0.x

---

## Testing Strategy

### Unit Tests

```javascript
describe("ModelSelector", () => {
  test("selects model based on agent strategy", () => {
    const selector = new ModelSelector(config);
    const model = selector.selectModel("frontend", task, "medium");
    expect(model).toBe("claude-3-sonnet");
  });

  test("falls back to fallback model on budget exceed", () => {
    const selector = new ModelSelector(config);
    // Simulate budget exceeded
    const model = selector.selectModel("frontend", task, "medium");
    expect(model).toBe("gpt-4-turbo"); // fallback
  });

  test("respects complexity thresholds", () => {
    const selector = new ModelSelector(config);
    const model = selector.selectModel("backend", simpleTask, "simple");
    expect(model).toBe("gpt-3.5-turbo");
  });
});

describe("CostTracker", () => {
  test("tracks usage correctly", () => {
    const tracker = new CostTracker(config);
    tracker.recordUsage("frontend", "claude-3-sonnet", task);
    expect(tracker.usage["frontend"]).toBeGreaterThan(0);
  });

  test("enforces cost limits", () => {
    const tracker = new CostTracker(config);
    expect(tracker.canAfford("frontend", expensiveTask)).toBe(false);
  });
});
```

### Integration Tests

- Test end-to-end agent execution with model selection
- Verify fallback behavior on model failure
- Test cost tracking across multiple agents
- Verify phase transitions update model selection

---

## Documentation

### User Documentation

#### `docs/guides/model-selection.md`

- Overview of model selection strategies
- Configuration guide
- CLI command reference
- Cost optimization tips
- Examples for different project types

#### `docs/guides/cost-management.md`

- Understanding AI costs
- Setting budgets
- Monitoring usage
- Optimizing for cost-efficiency

### Developer Documentation

#### `lib/model-selection/README.md`

- Architecture overview
- Adding new strategies
- Adding new providers
- Extending cost tracking

---

## Success Metrics

### Performance Metrics

- ✅ Model selection latency < 100ms
- ✅ 95% cost reduction for simple tasks
- ✅ Zero degradation in output quality
- ✅ 100% backward compatibility

### Business Metrics

- ✅ 60% average cost reduction across projects
- ✅ 90% user adoption of cost tracking
- ✅ 50% increase in agent customization

### User Metrics

- ✅ Users can configure models in < 2 minutes
- ✅ Cost transparency improves user trust
- ✅ Flexible model choice increases satisfaction

---

## Risks & Mitigations

### Risk 1: API Rate Limits

**Mitigation:** Implement exponential backoff and fallback models

### Risk 2: Cost Estimation Inaccuracy

**Mitigation:** Conservative estimates + real-time tracking

### Risk 3: Model Provider Changes

**Mitigation:** Provider abstraction layer + versioned API wrappers

### Risk 4: Complexity Overwhelms Users

**Mitigation:** Sensible defaults + simple CLI + documentation

---

## Open Questions

1. **Should we support local models (Ollama, LM Studio)?**

   - Pros: Zero cost, privacy
   - Cons: Setup complexity, performance variance

2. **Should we cache model responses?**

   - Pros: Cost savings on repeated tasks
   - Cons: Staleness, storage requirements

3. **Should we support multi-provider fallback chains?**

   - Example: GPT-4 → Claude Opus → Gemini Pro
   - Pros: Resilience
   - Cons: Complexity

4. **Should we add real-time cost alerts?**
   - Example: "⚠️ Frontend agent has used 80% of budget"
   - Pros: Cost awareness
   - Cons: Notification noise

---

## Approval

**Awaiting User Review** ✋

Once approved, this spec will be broken into the following issues:

1. Core model selection infrastructure
2. Strategy implementations
3. CLI commands
4. Integration with agents
5. Documentation and examples

---

**Status:** 📋 Awaiting Approval
**Created:** 2025-10-21
**Last Updated:** 2025-10-21
**Assignee:** TBD
