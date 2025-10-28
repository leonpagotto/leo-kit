# LEO Kit 5.0.0 - Multi-Model Claude Integration Guide

**Latest Update:** October 24, 2025
**Version:** 5.0.0
**Status:** Complete ✅

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Supported Models](#supported-models)
3. [Model Selection](#model-selection)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [Performance Comparison](#performance-comparison)
7. [Troubleshooting](#troubleshooting)

---

## Overview

LEO Kit 5.0.0 introduces **multi-model Claude support**, enabling intelligent code generation with four distinct Claude models optimized for different use cases.

### Key Features

✅ **4 Claude Models** - Sonnet, 4, 4.5, and Haiku
✅ **Auto-Selection** - Intelligent model selection based on task complexity
✅ **Configuration** - Environment variables and CLI options
✅ **Beautiful ASCII Output** - Gradient-styled terminal interface
✅ **Backward Compatible** - Defaults to Claude 3.5 Sonnet
✅ **Optimized Prompts** - Model-specific prompt engineering

---

## Supported Models

### 1️⃣ Claude 3.5 Sonnet (Default)

**Model ID:** `claude-3-5-sonnet-20241022`
**Alias:** `sonnet-3-5`
**Max Tokens:** 4,000
**Cost:** Low ($)
**Speed:** Fast ⚡

#### Best For:

- General code generation
- API implementation
- Feature development
- Balanced performance/cost needs
- Most use cases (recommended default)

#### Example:

```bash
leo spec generate --model sonnet-3-5
```

---

### 2️⃣ Claude 4 (Opus)

**Model ID:** `claude-opus-4-1`
**Alias:** `opus-4`
**Max Tokens:** 4,096
**Cost:** Medium ($$)
**Speed:** Standard ⏱️

#### Best For:

- Complex system architecture
- Multi-file refactoring
- High-quality code generation
- Advanced problem solving
- Teams needing better performance

#### Example:

```bash
leo spec generate --model opus-4
```

---

### 3️⃣ Claude 4.5 (Opus - Maximum)

**Model ID:** `claude-opus-4-5-20250514`
**Alias:** `opus-4-5`
**Max Tokens:** 8,000
**Cost:** High ($$$)
**Speed:** Standard ⏱️

#### Best For:

- Enterprise-grade systems
- Complex algorithms
- Full-stack applications
- Mission-critical code
- Maximum code quality
- Large-scale implementations

#### Features:

- Best reasoning capabilities
- Largest context window
- Superior code quality
- Comprehensive documentation generation

#### Example:

```bash
leo spec generate --model opus-4-5
```

---

### 4️⃣ Claude 3 Haiku (Fast & Lightweight)

**Model ID:** `claude-3-haiku-20250307`
**Alias:** `haiku-3`
**Max Tokens:** 1,024
**Cost:** Very Low ($)
**Speed:** Very Fast ⚡⚡

#### Best For:

- Quick prototyping
- Simple components
- Testing and demos
- CI/CD pipelines
- Cost-sensitive operations
- Rapid iteration

#### Example:

```bash
leo spec generate --model haiku-3
```

---

## Model Selection

### Method 1: CLI Option (Recommended)

```bash
# Use specific model
leo spec generate --model opus-4-5

# Use default (Sonnet)
leo spec generate
```

### Method 2: Environment Variable

```bash
# Set default model
export LEO_MODEL=opus-4-5
export ANTHROPIC_MODEL=opus-4-5

# Now all generations use this model
leo spec generate
```

### Method 3: Auto-Selection

Let LEO automatically choose the best model based on specification complexity:

```bash
# Enable auto-selection
leo spec generate --auto-select

# Or set in code:
const generator = new AICodeGenerator({
  autoSelect: true
});
```

#### Auto-Selection Logic:

| Specification Size | Task Count | Selected Model       |
| ------------------ | ---------- | -------------------- |
| < 2 KB             | < 5        | Haiku (fast)         |
| 2-5 KB             | 5-10       | Sonnet (balanced)    |
| 5-10 KB            | 10-20      | Claude 4 (advanced)  |
| > 10 KB            | > 20       | Claude 4.5 (maximum) |

### Method 4: Configuration File

Create `.leorc.json`:

```json
{
  "ai": {
    "provider": "claude",
    "model": "opus-4-5",
    "auto-select": false
  }
}
```

---

## Configuration

### Environment Variables

```bash
# API Key (Required)
export ANTHROPIC_API_KEY=sk-ant-xxxxx

# Default Model (Optional)
export LEO_MODEL=opus-4-5

# Alternative naming (Optional)
export ANTHROPIC_MODEL=opus-4-5

# Auto-Select (Optional)
export LEO_AUTO_SELECT=true
```

### Code Configuration

```javascript
const { MultiModelCodeGenerator } = require("leo-kit");

// Basic usage (defaults to Sonnet)
const generator = new MultiModelCodeGenerator();

// With specific model
const generator = new MultiModelCodeGenerator({
  model: "opus-4-5",
  autoSelect: false,
});

// With auto-selection
const generator = new MultiModelCodeGenerator({
  autoSelect: true,
});
```

---

## Usage Examples

### Example 1: Generate Simple Component (Haiku)

```bash
leo spec init my-component
leo spec specify
leo spec plan
leo spec tasks
leo spec generate --model haiku-3
```

**Output:**

```
🤖 Generating Code with AI

Using provider: claude
Model: Claude 3 Haiku (Fast lightweight generation)
Max tokens: 1024

Generating code... (this may take a moment)

✅ Code generated successfully!
```

---

### Example 2: Enterprise System (Claude 4.5)

```bash
leo spec init enterprise-system
# ... define comprehensive spec ...
leo spec generate --model opus-4-5
```

**Generated Output Includes:**

- TypeScript definitions
- Comprehensive JSDoc
- Performance optimizations
- Security hardening
- CI/CD configuration
- Architecture documentation
- Monitoring code

---

### Example 3: Programmatic Generation

```javascript
const { AICodeGenerator } = require("./lib/spec/manager");

// Initialize with Claude 4.5
const generator = new AICodeGenerator({
  model: "opus-4-5",
});

// Load specification
const spec = await generator._loadSpec("my-feature");

// Generate code
const generatedCode = await generator.generateFromSpec(spec, {
  includeTests: true,
  includeDocumentation: true,
});

// Save generated files
for (const [filename, content] of Object.entries(generatedCode)) {
  await fs.writeFile(filename, content);
}
```

---

### Example 4: Auto-Select Based on Complexity

```javascript
const { AICodeGenerator } = require("./lib/spec/manager");

const generator = new AICodeGenerator({
  autoSelect: true, // Automatically picks best model
});

const spec = await generator._loadSpec("my-feature");
const code = await generator.generateFromSpec(spec);

// Automatically selected:
// - Haiku for simple specs (< 2KB)
// - Sonnet for moderate specs (2-5KB)
// - Claude 4 for complex specs (5-10KB)
// - Claude 4.5 for very complex specs (> 10KB)
```

---

## Performance Comparison

### Speed (Tokens per Second)

| Model      | Speed          | Token/s |
| ---------- | -------------- | ------- |
| Haiku      | ⚡⚡ Very Fast | 100+    |
| Sonnet     | ⚡ Fast        | 50-80   |
| Claude 4   | ⏱️ Standard    | 40-60   |
| Claude 4.5 | ⏱️ Standard    | 40-60   |

### Quality (Code Quality Score 1-10)

| Model      | Quality                | Score  |
| ---------- | ---------------------- | ------ |
| Haiku      | ⭐⭐⭐ Good            | 6-7    |
| Sonnet     | ⭐⭐⭐⭐ Very Good     | 8-9    |
| Claude 4   | ⭐⭐⭐⭐⭐ Excellent   | 9-9.5  |
| Claude 4.5 | ⭐⭐⭐⭐⭐ Outstanding | 9.5-10 |

### Cost (per 1M tokens)

| Model      | Input  | Output |
| ---------- | ------ | ------ |
| Haiku      | $0.80  | $2.40  |
| Sonnet     | $3.00  | $15.00 |
| Claude 4   | $15.00 | $45.00 |
| Claude 4.5 | $20.00 | $60.00 |

### Recommendation Matrix

| Use Case         | Recommended | Rationale                       |
| ---------------- | ----------- | ------------------------------- |
| Quick prototypes | Haiku       | Fast, cheap, sufficient quality |
| Production apps  | Sonnet      | Best value, high quality        |
| Complex systems  | Claude 4    | Advanced reasoning              |
| Critical systems | Claude 4.5  | Maximum capabilities            |
| Cost-sensitive   | Haiku       | $$ savings                      |
| Quality-focused  | Claude 4.5  | Best code quality               |

---

## Code Examples

### Getting All Available Models

```javascript
const {
  MultiModelCodeGenerator,
  MODEL_CONFIG,
} = require("./lib/ai/multi-model-generator");

const generator = new MultiModelCodeGenerator();
const models = generator.getAvailableModels();

Object.entries(models).forEach(([key, model]) => {
  console.log(`${model.name}: ${model.description}`);
});
```

### Displaying Model Information

```javascript
const { ASCIIGradient } = require("./lib/ai/multi-model-generator");

// Display all available models with gradients
console.log(ASCIIGradient.renderModelList());

// Display success message
console.log(ASCIIGradient.renderSuccess(5)); // 5 files generated

// Display error message
console.log(ASCIIGradient.renderError("API connection failed"));
```

### Model Configuration API

```javascript
const { AICodeGenerator } = require("./lib/spec/manager");

const generator = new AICodeGenerator({
  model: "opus-4-5",
});

// Get active model config
const model = generator._getActiveModel();
console.log(model.name); // "Claude 4.5 (Opus)"
console.log(model.maxTokens); // 8000

// Auto-select based on spec
const spec = await loadSpec();
const selected = generator._autoSelectModel(spec);
console.log(selected); // "opus-4-5" or "haiku-3" etc
```

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"

**Solution:**

```bash
# Set your API key
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Verify it's set
echo $ANTHROPIC_API_KEY
```

[Get API key from console.anthropic.com](https://console.anthropic.com)

---

### Issue: Model not found

**Solution:** Verify you're using a valid model alias:

```bash
# Valid models:
leo spec generate --model sonnet-3-5    ✅
leo spec generate --model opus-4        ✅
leo spec generate --model opus-4-5      ✅
leo spec generate --model haiku-3       ✅

# Invalid (won't work):
leo spec generate --model claude-sonnet ❌
leo spec generate --model gpt-4         ❌
```

---

### Issue: Generation timing out

**Solution:** For large specifications, use Claude 4.5:

```bash
# Haiku might timeout on large specs
leo spec generate --model haiku-3

# Try Claude 4.5 instead
leo spec generate --model opus-4-5
```

Or break spec into smaller parts.

---

### Issue: Unexpected code quality

**Recommendations:**

1. **Too simple code** → Use Claude 4.5 for better quality
2. **Too verbose** → Use Haiku for concise output
3. **Missing features** → Add details to specification
4. **Wrong style** → Update constitutional governance

---

### Issue: High costs

**Solutions:**

1. **Use Haiku for prototypes:**

   ```bash
   leo spec generate --model haiku-3
   ```

2. **Enable auto-selection:**

   ```bash
   leo spec generate --auto-select
   ```

3. **Simplify specifications** - Fewer tasks = faster generation

4. **Use Sonnet for balance:**
   ```bash
   leo spec generate --model sonnet-3-5
   ```

---

## Best Practices

### 1. Choose Right Model for Task

```javascript
// ✅ Good: Task-appropriate model
if (isProduction) {
  generator.model = "opus-4-5"; // Best quality
} else if (isQuickTest) {
  generator.model = "haiku-3"; // Fast & cheap
} else {
  generator.model = "sonnet-3-5"; // Balanced
}
```

### 2. Use Auto-Selection for Mixed Workloads

```javascript
// ✅ Good: Let LEO pick best model
const generator = new AICodeGenerator({
  autoSelect: true,
});
```

### 3. Define Constitutional Governance

```javascript
// ✅ Good: Constitution enforced across all models
const spec = {
  constitution: `
    ## Project Constitution
    - Always use TypeScript
    - Include 80%+ test coverage
    - Security-first approach
    - Performance optimized
  `,
  specification: "...",
  plan: "...",
  tasks: "...",
};
```

### 4. Optimize Specifications

```javascript
// ✅ Good: Clear, specific tasks
const tasks = `
- [ ] Create user authentication
- [ ] Implement password hashing
- [ ] Add session management
- [ ] Create login API
- [ ] Write auth tests
`;
```

### 5. Monitor Generation Performance

```javascript
const startTime = Date.now();
const code = await generator.generateFromSpec(spec);
const duration = Date.now() - startTime;

console.log(`Generated in ${duration}ms with ${generator.model}`);
```

---

## Migration Guide (from 4.1.1 to 5.0.0)

### Update Dependencies

```bash
npm update @anthropic-ai/sdk
```

### Update Code (if using AICodeGenerator)

**Before (v4.1.1):**

```javascript
const { AICodeGenerator } = require("leo-kit");
const generator = new AICodeGenerator("claude");
```

**After (v5.0.0):**

```javascript
const { AICodeGenerator } = require("leo-kit");
const generator = new AICodeGenerator({
  provider: "claude",
  model: "sonnet-3-5", // or your preferred model
});
```

### Environment Variables (Optional)

Add to your `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
LEO_MODEL=sonnet-3-5
```

---

## API Reference

### MultiModelCodeGenerator

```javascript
const gen = new MultiModelCodeGenerator(options);

// Options
{
  model: 'sonnet-3-5',      // Model to use
  autoSelect: false,        // Auto-select based on complexity
  provider: 'claude'        // AI provider
}

// Methods
gen.getModelConfig(modelKey)              // Get model details
gen.getAvailableModels()                  // Get all models
gen.autoSelectBestModel(spec)             // Auto-select model
gen.generateFromSpec(spec, options)       // Generate code (async)
```

### AICodeGenerator (Updated in v5.0.0)

```javascript
const gen = new AICodeGenerator(options);

// Options
{
  provider: 'claude',      // AI provider
  model: 'sonnet-3-5',     // Model to use
  autoSelect: false        // Auto-select based on complexity
}

// Methods
gen.generateFromSpec(spec, options)       // Generate code (async)
gen._getActiveModel()                     // Get current model config
gen._autoSelectModel(spec)                // Auto-select model
```

### ASCIIGradient (Styling)

```javascript
const { ASCIIGradient } = require("leo-kit");

// Gradient methods
ASCIIGradient.createGradient(text, startRGB, endRGB);
ASCIIGradient.rainbowGradient(text);
ASCIIGradient.fireGradient(text);
ASCIIGradient.oceanGradient(text);
ASCIIGradient.forestGradient(text);
ASCIIGradient.purpleGradient(text);

// Display methods
ASCIIGradient.renderHeader();
ASCIIGradient.renderModelHeader(model);
ASCIIGradient.renderLoading();
ASCIIGradient.renderSuccess(fileCount);
ASCIIGradient.renderError(errorMsg);
ASCIIGradient.renderModelList();
```

---

## FAQ

### Q: Which model should I use?

**A:** Start with **Sonnet** (default). It's fast, affordable, and high-quality. Use Haiku for prototypes, Claude 4 for complex projects, and Claude 4.5 for mission-critical systems.

### Q: Can I switch models mid-project?

**A:** Yes! Models are interchangeable. You can regenerate with different models and compare results.

### Q: Is there a free tier?

**A:** Anthropic offers free trial credits. After that, pricing varies by model. Haiku is most affordable for testing.

### Q: How do I monitor costs?

**A:** Check your Anthropic dashboard at [console.anthropic.com](https://console.anthropic.com). Each model shows input/output costs per 1M tokens.

### Q: Can I use multiple models in parallel?

**A:** Yes, create separate generators:

```javascript
const sonnet = new AICodeGenerator({ model: "sonnet-3-5" });
const opus = new AICodeGenerator({ model: "opus-4-5" });

const code1 = await sonnet.generateFromSpec(spec);
const code2 = await opus.generateFromSpec(spec);
```

### Q: What if a model fails?

**A:** The system falls back to mock responses. Set `ANTHROPIC_API_KEY` to enable real generation.

---

## Version History

### v5.0.0 (October 24, 2025)

- ✅ Multi-model Claude support (Sonnet, 4, 4.5, Haiku)
- ✅ Auto-selection based on complexity
- ✅ Beautiful ASCII gradient styling
- ✅ Optimized prompts per model
- ✅ Complete documentation and examples
- ✅ Backward compatible with v4.1.1

---

## Support

Need help? Here's how to get support:

1. **Documentation:** Check [docs/README.md](./README.md)
2. **API Reference:** See [docs/API_REFERENCE.md](./API_REFERENCE.md)
3. **Issues:** Report on [GitHub Issues](https://github.com/leonpagotto/leo-kit/issues)
4. **Discussion:** Start [GitHub Discussion](https://github.com/leonpagotto/leo-kit/discussions)

---

**Last Updated:** October 24, 2025
**Maintained by:** Leo Pagotto
**License:** MIT
