# ✅ GitHub Copilot Instructions - Verification & Implementation Guide

**Date:** October 20, 2025
**LEO Kit Version:** 3.0.2
**Purpose:** Ensure Copilot instructions are properly recognized and followed
**Reporter:** Leo de Souza (leonpagotto)

---

## 📊 Current Status

### ✅ File Successfully Generated

- **Location:** `.github/copilot-instructions.md` ✅
- **Size:** 1,344 lines, 5,838 words, 41,988 characters
- **Created via:** `leo ai sync` (manual workaround)
- **Content:** Comprehensive LEO workflow standards

### ⚠️ Initial Problem

- **During `leo init`:** File was NOT generated automatically
- **Terminal showed:** "Generated 0 AI instruction file"
- **Workaround required:** Manual `leo ai sync` command

---

## 🎯 How GitHub Copilot Custom Instructions Work

### Official Location & Recognition

According to [GitHub's official documentation](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot):

**✅ CORRECT LOCATION (You have this):**

```
.github/copilot-instructions.md
```

**This is the official repository-wide custom instructions file.**

### Automatic Recognition by Copilot

GitHub Copilot **automatically detects and loads** this file when:

1. ✅ **File exists** in `.github/copilot-instructions.md`
2. ✅ **Repository is opened** in VS Code (or other supported IDEs)
3. ✅ **GitHub Copilot extension is installed** (you have this: `GitHub.copilot` in `.vscode/extensions.json`)
4. ✅ **Copilot is authenticated** and enabled
5. ✅ **Custom instructions are enabled** in Copilot settings (enabled by default)

### NO Additional Configuration Required

**Good news:** You **DO NOT** need to:

- ❌ Add anything to `.vscode/settings.json`
- ❌ Reference the file manually
- ❌ Configure special VS Code settings
- ❌ Restart VS Code (though recommended after first creation)

**The file is automatically read by Copilot on every request!** 🎉

---

## 🔍 How to Verify It's Working

### Method 1: Check References in Copilot Chat (Recommended)

1. **Open VS Code** in your repository
2. **Open Copilot Chat** (Ctrl+Shift+I or ⌘+Shift+I on Mac)
3. **Ask Copilot a question** about your project
4. **Expand the "References" section** at the top of Copilot's response
5. **Look for:** `.github/copilot-instructions.md` in the references list

**If you see it listed → It's working! ✅**

**Screenshot example from GitHub docs:**

```
References:
  ├─ 📄 .github/copilot-instructions.md  ← This confirms it's loaded
  ├─ 📄 src/index.ts
  └─ 📄 README.md
```

### Method 2: Check VS Code Settings (Optional)

1. Open VS Code Settings (⌘+, or Ctrl+,)
2. Search for: `copilot instruction`
3. Look for: **"Code Generation: Use Instruction Files"**
4. **Ensure it's checked** (enabled by default)

**Setting name:** `github.copilot.advanced.codeGeneration.useInstructionFiles`

### Method 3: Test Copilot's Behavior

**Before instructions:** Copilot gives generic suggestions
**After instructions:** Copilot follows LEO workflow patterns

**Test prompts:**

- "We need to add a new feature for user authentication"

  - ✅ **Should:** Immediately create a GitHub issue without asking
  - ❌ **Should not:** Ask "Would you like me to create an issue?"

- "Fix the login button on mobile"
  - ✅ **Should:** Create issue, then implement
  - ✅ **Should:** Check `.leorc.json` for auto-resolve setting

### Method 4: Terminal Command (Quick Check)

```bash
# Check if file exists and is readable
ls -lh .github/copilot-instructions.md

# Expected output:
# -rw-r--r-- 1 user staff 42K Oct 20 16:01 .github/copilot-instructions.md
```

---

## 🔧 Ensuring Instructions Are Followed

### 1. File Content Validation

**Your file is correctly formatted:**

- ✅ Markdown format (`.md`)
- ✅ Natural language instructions
- ✅ Clear, actionable guidelines
- ✅ Structured with headers and examples

### 2. Key Requirements (All Met)

✅ **Repository-wide scope** - Located in `.github/` (applies to all files)
✅ **Copilot extension installed** - Configured in `.vscode/extensions.json`
✅ **Authenticated** - GitHub CLI authenticated during `leo init`
✅ **No conflicting instructions** - No other custom instruction files

### 3. Feature Support Matrix

| Feature                | VS Code | Support Level                                  |
| ---------------------- | ------- | ---------------------------------------------- |
| **Copilot Chat**       | ✅      | Full support                                   |
| **Code Completions**   | ✅      | Full support                                   |
| **Inline Suggestions** | ✅      | Full support                                   |
| **Code Review**        | ✅      | Full support                                   |
| **Copilot Agents**     | ✅      | Full support (AGENTS.md format also supported) |

**All Copilot features will use your instructions! ✅**

### 4. Instruction Priority

If multiple instruction sources exist:

1. **Personal instructions** (highest priority)
2. **Repository instructions** ← Your `.github/copilot-instructions.md` (YOU ARE HERE)
3. **Organization instructions** (lowest priority)

**Your repository instructions will apply unless user has personal overrides.**

---

## 🚀 Recommended Actions for Users

### For New LEO Kit Users (Immediate Actions)

1. **Verify File Exists:**

   ```bash
   ls -lh .github/copilot-instructions.md
   ```

2. **Restart VS Code** (if you just created the file):

   ```bash
   # Close and reopen VS Code
   # OR reload window: Ctrl+Shift+P → "Reload Window"
   ```

3. **Test in Copilot Chat:**

   - Open Copilot Chat
   - Ask: "Explain the LEO workflow"
   - Check References for `.github/copilot-instructions.md`

4. **Use Copilot normally** - Instructions are now active!

### For LEO Kit Installation (Recommended Setup)

**Add this verification step to `leo init`:**

```javascript
// After leo ai sync successfully generates the file
console.log("\n🤖 Verifying Copilot Integration...");

// Check if file was created
if (fs.existsSync(".github/copilot-instructions.md")) {
  const stats = fs.statSync(".github/copilot-instructions.md");
  const fileSizeKB = (stats.size / 1024).toFixed(1);

  console.log(`  ✅ Instructions file: ${fileSizeKB} KB`);
  console.log(`  📍 Location: .github/copilot-instructions.md`);
  console.log(`  🎯 Copilot will automatically load these instructions`);
  console.log(
    "\n💡 Tip: Reload VS Code window to ensure Copilot loads the new file"
  );
  console.log("   → Press Ctrl+Shift+P (Cmd+Shift+P on Mac)");
  console.log('   → Type "Reload Window" and press Enter\n');
} else {
  console.log(`  ⚠️  Instructions file not found`);
  console.log(`  💡 Run: leo ai sync\n`);
}
```

---

## 🐛 Bug Fix Recommendations for LEO Kit Developers

### Issue #1: Instructions Not Generated During `leo init`

**Location to fix:** `lib/commands/init.js` (or wherever AI assistant setup happens)

**Root cause analysis:**

1. Config is saved to `.leorc.json` correctly ✅
2. Terminal shows "Generated 0 AI instruction file" ❌
3. `leo ai sync` works perfectly afterward ✅

**This means:** The generation logic exists and works, but isn't being called during init.

### Proposed Fix:

**STEP 1: Add explicit AI instruction generation after AI selection**

```javascript
// In lib/commands/init.js (after AI assistant configuration)

// ========================================
// AI ASSISTANT CONFIGURATION (EXISTING CODE)
// ========================================
if (selectedAssistants.length > 0) {
  // Save config to .leorc.json
  config["ai-assistants"] = {
    enabled: selectedAssistants,
    primary: selectedAssistants[0],
    "sync-on-update": true,
  };

  await fs.writeFile(".leorc.json", JSON.stringify(config, null, 2));
  console.log("✔ AI configuration saved");

  // ========================================
  // NEW CODE: Generate AI instruction files
  // ========================================
  console.log("\n🚀 Generating AI instruction files...");

  try {
    // Import the sync function from leo ai sync command
    const { syncAIInstructions } = require("./ai-sync"); // Adjust path as needed

    // Call the same function that leo ai sync uses
    const generatedFiles = await syncAIInstructions();

    if (generatedFiles && generatedFiles.length > 0) {
      console.log(
        `✔ Generated ${generatedFiles.length} AI instruction file(s)`
      );
      generatedFiles.forEach((file) => {
        console.log(`  → ${file}`);
      });

      // Verify file was created
      if (fs.existsSync(".github/copilot-instructions.md")) {
        const stats = fs.statSync(".github/copilot-instructions.md");
        const fileSizeKB = (stats.size / 1024).toFixed(1);
        console.log(`\n📊 Instructions file: ${fileSizeKB} KB`);
        console.log(
          "🎯 GitHub Copilot will automatically load these instructions"
        );
      }
    } else {
      console.log("⚠ No AI instruction files generated");
      console.log("💡 You can generate them later with: leo ai sync");
    }
  } catch (error) {
    // Don't fail the entire init if AI sync fails
    console.error("✖ Failed to generate AI instruction files:", error.message);
    console.log("💡 You can generate them later with: leo ai sync");

    // Log the full error for debugging
    if (process.env.DEBUG) {
      console.error("Debug error details:", error);
    }
  }
}
```

**STEP 2: Extract sync logic to reusable function**

Create `lib/commands/ai-sync.js` (or extract existing):

```javascript
// lib/commands/ai-sync.js

const fs = require("fs").promises;
const path = require("path");

/**
 * Sync AI instruction files based on .leorc.json config
 * @returns {Promise<string[]>} Array of generated file paths
 */
async function syncAIInstructions() {
  const generatedFiles = [];

  // Read config
  const configPath = path.join(process.cwd(), ".leorc.json");
  const configExists = await fs
    .access(configPath)
    .then(() => true)
    .catch(() => false);

  if (!configExists) {
    throw new Error(".leorc.json not found");
  }

  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  const enabledAIs = config["ai-assistants"]?.enabled || [];

  if (enabledAIs.length === 0) {
    return generatedFiles;
  }

  // Generate instruction files for each enabled AI
  for (const ai of enabledAIs) {
    if (ai === "copilot") {
      const instructionsPath = ".github/copilot-instructions.md";
      await generateCopilotInstructions(instructionsPath);
      generatedFiles.push(instructionsPath);
    }
    // Add other AI assistants here (Cursor, Cody, etc.)
  }

  return generatedFiles;
}

async function generateCopilotInstructions(filePath) {
  // Ensure .github directory exists
  await fs.mkdir(".github", { recursive: true });

  // Read template from templates/ai-instructions/copilot-instructions.md
  const templatePath = path.join(
    __dirname,
    "../../templates/ai-instructions/copilot-instructions.md"
  );
  const template = await fs.readFile(templatePath, "utf8");

  // Add dynamic content (current date, project name, etc.)
  const content = template.replace(
    "{{DATE}}",
    new Date().toISOString().split("T")[0]
  );

  // Write to project
  await fs.writeFile(filePath, content, "utf8");
}

module.exports = { syncAIInstructions };
```

**STEP 3: Update the interactive init flow**

```javascript
// Ensure AI instruction generation happens AFTER:
// 1. .leorc.json is written to disk
// 2. .github directory is created
// 3. GitHub templates are installed

// The order should be:
// 1. Create .github directory
// 2. Install issue templates
// 3. Configure AI assistants → Save .leorc.json
// 4. Generate AI instruction files ← ADD THIS STEP
// 5. Configure VS Code
// 6. Create initial commit
```

### Issue #2: Silent Failure

**Problem:** No error shown to user when generation fails

**Fix:** Add comprehensive error handling:

```javascript
try {
  const generatedFiles = await syncAIInstructions();
  // ... success handling
} catch (error) {
  console.error("✖ Failed to generate AI instruction files");
  console.error(`   Error: ${error.message}`);
  console.log("\n💡 Workaround:");
  console.log("   1. Ensure .leorc.json exists with AI configuration");
  console.log("   2. Run: leo ai sync");
  console.log("   3. If that fails, report the issue with debug output:");
  console.log("      DEBUG=1 leo ai sync\n");

  // Don't fail entire init - let user continue and fix later
}
```

### Issue #3: No Post-Generation Verification

**Add verification step:**

```javascript
// After generating files
console.log("\n✅ Verifying installation...");

const checks = [
  {
    name: "Config file",
    check: () => fs.existsSync(".leorc.json"),
    fix: "Run leo init again",
  },
  {
    name: "Copilot instructions",
    check: () => fs.existsSync(".github/copilot-instructions.md"),
    fix: "Run leo ai sync",
  },
  {
    name: "VS Code config",
    check: () => fs.existsSync(".vscode/settings.json"),
    fix: "Run leo init again",
  },
];

let allPassed = true;
for (const { name, check, fix } of checks) {
  const passed = check();
  console.log(`  ${passed ? "✅" : "❌"} ${name}`);
  if (!passed) {
    console.log(`     Fix: ${fix}`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("\n🎉 All checks passed!");
} else {
  console.log("\n⚠️  Some checks failed. Please run the suggested fixes.");
}
```

---

## 📝 Testing Checklist for LEO Kit Developers

### Unit Test: AI Instruction Generation

```javascript
// test/ai-sync.test.js

describe("AI Instruction Sync", () => {
  it("should generate copilot-instructions.md when config has copilot enabled", async () => {
    // Setup
    await fs.writeFile(
      ".leorc.json",
      JSON.stringify({
        "ai-assistants": {
          enabled: ["copilot"],
          primary: "copilot",
        },
      })
    );

    // Execute
    const files = await syncAIInstructions();

    // Assert
    expect(files).toContain(".github/copilot-instructions.md");
    expect(fs.existsSync(".github/copilot-instructions.md")).toBe(true);

    // Verify file is not empty
    const stats = fs.statSync(".github/copilot-instructions.md");
    expect(stats.size).toBeGreaterThan(1000); // At least 1KB
  });

  it("should not fail if .github directory does not exist", async () => {
    // Setup
    if (fs.existsSync(".github")) {
      fs.rmdirSync(".github", { recursive: true });
    }

    // Execute & Assert - should not throw
    await expect(syncAIInstructions()).resolves.not.toThrow();

    // Verify directory was created
    expect(fs.existsSync(".github")).toBe(true);
  });

  it("should return empty array if no AI assistants enabled", async () => {
    // Setup
    await fs.writeFile(
      ".leorc.json",
      JSON.stringify({
        "ai-assistants": {
          enabled: [],
          primary: null,
        },
      })
    );

    // Execute
    const files = await syncAIInstructions();

    // Assert
    expect(files).toEqual([]);
  });
});
```

### Integration Test: Full Init Flow

```javascript
// test/init-integration.test.js

describe("leo init - AI Integration", () => {
  it("should generate AI instructions during init", async () => {
    // Execute init with copilot selection (mock user input)
    await runInit({
      aiAssistants: ["copilot"],
      skipProject: true,
    });

    // Assert
    expect(fs.existsSync(".github/copilot-instructions.md")).toBe(true);
    expect(fs.existsSync(".leorc.json")).toBe(true);

    // Verify config matches generated files
    const config = JSON.parse(fs.readFileSync(".leorc.json", "utf8"));
    expect(config["ai-assistants"].enabled).toContain("copilot");
  });

  it("should show proper message when generation succeeds", async () => {
    const output = await captureOutput(() =>
      runInit({
        aiAssistants: ["copilot"],
      })
    );

    expect(output).toContain("Generated 1 AI instruction file");
    expect(output).toContain(".github/copilot-instructions.md");
    expect(output).not.toContain("Generated 0 AI instruction file");
  });
});
```

### Manual Test Procedure

```bash
# 1. Clean test
rm -rf test-leo-init
mkdir test-leo-init
cd test-leo-init
git init
gh repo create test-leo-init --private --source=. --remote=origin

# 2. Run init
leo init
# → Select "GitHub Copilot" when prompted
# → Complete the setup

# 3. Verify
ls -la .github/copilot-instructions.md
# Expected: File exists with ~42KB size

cat .leorc.json
# Expected: Shows copilot in enabled array

# 4. Check terminal output
# Expected: "Generated 1 AI instruction file"
# Expected: "→ .github/copilot-instructions.md"
# NOT: "Generated 0 AI instruction file"

# 5. Test in VS Code
code .
# → Open Copilot Chat
# → Ask: "What workflow should I follow?"
# → Check References section for copilot-instructions.md

# 6. Cleanup
cd ..
rm -rf test-leo-init
gh repo delete test-leo-init --yes
```

---

## 🎓 Education: How Users Can Verify It's Working

### Add to LEO Kit Documentation

**File:** `docs/guides/VERIFYING_COPILOT_INTEGRATION.md`

```markdown
# Verifying GitHub Copilot Integration

After running `leo init`, your GitHub Copilot is automatically configured to follow LEO workflow standards.

## Quick Verification (30 seconds)

1. **Open VS Code** in your project
2. **Open Copilot Chat** (⌘+Shift+I / Ctrl+Shift+I)
3. **Ask Copilot:** "What is the LEO workflow?"
4. **Check the References section** (expand it at the top of the response)
5. **Look for:** `.github/copilot-instructions.md`

**If you see it → You're all set! ✅**

## What to Expect

With LEO instructions loaded, Copilot will:

✅ **Automatically create GitHub issues** when you describe work
✅ **Follow spec-first development** for complex features
✅ **Use LEO coding standards** (component-first, DRY, etc.)
✅ **Respect your auto-resolve setting** in `.leorc.json`
✅ **Keep commits concise** (under 72 characters)

## Troubleshooting

**Instructions not showing in References?**

1. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
2. Check file exists: `ls .github/copilot-instructions.md`
3. Regenerate if missing: `leo ai sync`
4. Ensure Copilot extension is updated

**Copilot not following LEO patterns?**

- Check VS Code settings: Search "copilot instruction" → Ensure "Use Instruction Files" is enabled
- Try disabling/re-enabling in Copilot Chat settings
- File might not have been loaded yet - reload window

## Need Help?

Run `leo status` to check your configuration, or open an issue on GitHub.
```

### Add to Post-Init Message

Update the success message in `leo init` to include:

```javascript
console.log(`
🦁 LEO Workflow Kit initialized successfully! 🦁

Your project is now set up with:

  ✅ Documentation structure with specs/ folder
  ✅ 8 professional issue templates
  ✅ Pull request template
  ✅ GitHub Actions workflows (automation)
  ✅ 22+ GitHub labels configured
  ✅ VS Code settings
  ✅ AI Assistants: ${assistants.join(", ")}
     Primary: ${primaryAI}
     📄 Instructions: .github/copilot-instructions.md

🎯 The LEO Workflow:

  Phase 1: Specification (Planning)
    → Write detailed specs in docs/specs/
    → Review and discuss with team
    → Get approval before coding

  Phase 2: Execution (GitHub Issues)
    → Convert approved specs into GitHub issues
    → Track work in GitHub Projects
    → Reference issues in all commits

💡 Copilot Integration:

  Your GitHub Copilot is now configured to follow LEO standards!

  ✓ Reload VS Code window to ensure instructions are loaded
  ✓ Open Copilot Chat and check References section
  ✓ Look for .github/copilot-instructions.md in references

  If missing, run: leo ai sync

Next steps:

  1. Reload VS Code: Ctrl+Shift+P → "Reload Window"
  2. Write your first spec: docs/specs/EXAMPLE_SPEC.md
  3. Create issues: leo issue
  4. Check status: leo status
`);
```

---

## 📊 Success Metrics

### How to Measure Success

After fixing the issue, track these metrics:

1. **File Generation Rate**

   - Target: 100% of `leo init` runs generate copilot-instructions.md
   - Measure: Check terminal output logs

2. **File Presence in Projects**

   - Target: 100% of LEO-initialized projects have the file
   - Measure: `ls .github/copilot-instructions.md` in user projects

3. **User Reports**

   - Target: 0 "instructions not working" issues after fix
   - Measure: GitHub issues, user feedback

4. **Adoption**
   - Target: Users naturally follow LEO patterns without manual reference
   - Measure: Code review patterns, issue creation frequency

---

## 🎯 Summary for LEO Kit Developer

### The Problem

1. ✅ **File location is correct:** `.github/copilot-instructions.md`
2. ✅ **Copilot recognizes it automatically:** No config needed
3. ❌ **Generation during init fails:** Shows "Generated 0" instead of "Generated 1"
4. ✅ **Manual sync works perfectly:** `leo ai sync` generates file successfully

### The Solution

**Three-step fix:**

1. **Call `syncAIInstructions()` during init** after saving `.leorc.json`
2. **Add error handling** to show actual errors (currently fails silently)
3. **Add verification step** to confirm file was created

### The Impact

**Before fix:**

- Users get "Generated 0 AI instruction file"
- They don't know copilot-instructions.md is missing
- Copilot doesn't follow LEO standards
- Users must manually run `leo ai sync` (if they know about it)

**After fix:**

- Users get "Generated 1 AI instruction file: .github/copilot-instructions.md"
- File is created automatically during init
- Copilot follows LEO standards from day 1
- Perfect onboarding experience ✅

### Time to Fix

Estimated: **2-4 hours**

- 1 hour: Implement fix
- 1 hour: Write tests
- 1 hour: Update documentation
- 1 hour: Test manually

### Priority

**HIGH** - This is a core feature that impacts every new user's experience.

---

## 🚀 Ready to Deploy

Once the fix is implemented:

1. ✅ Update version (v3.0.3)
2. ✅ Add to CHANGELOG.md
3. ✅ Publish to npm
4. ✅ Update documentation
5. ✅ Close related issues
6. ✅ Announce the fix

**The LEO Kit will then provide a seamless AI-powered workflow from the first minute! 🦁**
