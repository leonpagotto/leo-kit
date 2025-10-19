# Migration Guide: v2.x → v3.0.0

> **Breaking Changes:** v3.0.0 introduces multi-AI support with minimal breaking changes. Existing Copilot setups continue working.

---

## 📋 What's New in v3.0.0

### Multi-AI Assistant Support 🤖

v3.0.0 expands LEO Kit beyond GitHub Copilot to support **4 AI coding assistants**:

1. **GitHub Copilot** - Original supported AI (.github/copilot-instructions.md)
2. **Cursor (Claude)** - Claude-powered IDE with Composer Mode (.cursorrules)
3. **Cline** - Autonomous Claude-Dev VSCode extension (.clinerules)
4. **Codeium** - Free AI code completion, 70+ languages (.codeium/instructions.md)

### New Commands

- `leo ai list` - Show configured AI assistants
- `leo ai add <name>` - Add new AI assistant
- `leo ai remove <name>` - Remove AI assistant
- `leo ai sync` - Regenerate all AI instruction files

---

## 🚀 Quick Migration

### For Existing Users (Already Have v2.x)

**Option 1: Automatic Migration (Recommended)**

```bash
# Update to v3.0.0
npm install -g leo-workflow-kit@latest

# Add additional AI assistants (optional)
cd your-project
leo ai add cursor    # If you use Cursor IDE
leo ai add cline     # If you use Cline extension
leo ai add codeium   # If you use Codeium

# List configured AIs
leo ai list
```

**Your existing `.github/copilot-instructions.md` remains unchanged and continues working!**

**Option 2: Fresh Initialization**

If you want to reconfigure from scratch:

```bash
# Backup existing config (optional)
mv .github/copilot-instructions.md .github/copilot-instructions.md.backup

# Re-run init with multi-AI selection
leo init

# Select your AI assistants during setup
# Choose all that you use (Copilot, Cursor, Cline, Codeium)
```

---

## 📦 What Happens Automatically

### Backward Compatibility ✅

- **Existing Copilot instructions are preserved** - v3.0.0 doesn't overwrite your current `.github/copilot-instructions.md`
- **Default AI is still Copilot** - If you don't add other AIs, everything works as before
- **Configuration is optional** - You can keep using just Copilot if you want

### New Configuration File

v3.0.0 adds an `ai-assistants` section to `.leorc.json`:

```json
{
  "ai-assistants": {
    "enabled": ["copilot"], // Default: Copilot only
    "primary": "copilot", // Your main AI assistant
    "sync-on-update": true // Auto-sync all AI files
  }
}
```

**This is created automatically when you run `leo ai add <name>`.**

---

## 🆕 Adding New AI Assistants

### Example: Adding Cursor Support

If you use **Cursor IDE** (Claude-powered), generate LEO workflow instructions for it:

```bash
leo ai add cursor
```

**Output:**

```
✓ Added Cursor
  Generated: .cursorrules
```

This creates a **41KB `.cursorrules` file** with:

- Full LEO workflow standards
- Cursor-specific tips (Composer Mode, @filename, Cmd+K shortcuts)
- Claude's strengths (contextual understanding, refactoring)
- Best practices for Cursor/Claude workflow

### Example: Adding Multiple AIs

```bash
# Add Cursor for Claude-powered IDE
leo ai add cursor

# Add Cline for autonomous coding tasks
leo ai add cline

# Add Codeium for free AI completion
leo ai add codeium

# Check what's configured
leo ai list
```

**Output:**

```
📦 Configured AI Assistants:

  ✓ GitHub Copilot
    .github/copilot-instructions.md
  ✓ Cursor
    .cursorrules
  ✓ Cline
    .clinerules
  ✓ Codeium
    .codeium/instructions.md

  Primary AI: copilot
```

---

## 🔄 Syncing AI Instructions

### When to Sync

Run `leo ai sync` after:

- Updating LEO Kit to a new version
- Modifying your project's workflow standards
- Adding new team members who need consistent AI instructions

```bash
leo ai sync
```

**Output:**

```
🔄 Syncing AI instruction files...

🚀 Generating AI instruction files...

  ✓ .github/copilot-instructions.md
  ✓ .cursorrules
  ✓ .clinerules
  ✓ .codeium/instructions.md

📊 Summary:
  ✓ Success: 4
```

This **regenerates all AI instruction files** with the latest LEO workflow standards.

---

## 🗑️ Removing AI Assistants

If you stop using an AI assistant:

```bash
leo ai remove cursor
```

**This will:**

1. Delete the `.cursorrules` file
2. Remove `cursor` from your `.leorc.json` config
3. Update primary AI if needed

---

## 🎯 Choosing a Primary AI

If you use multiple AI assistants, set your **primary** (most-used) AI:

```bash
# Edit .leorc.json manually
{
  "ai-assistants": {
    "enabled": ["copilot", "cursor", "cline"],
    "primary": "cursor",   // ← Change this
    "sync-on-update": true
  }
}
```

Or select during `leo init` when prompted:

```
? Which AI assistant do you use most often? (Sets as primary)
  🤖 GitHub Copilot
❯ 🎯 Cursor
  🚀 Cline
```

---

## 🆚 AI Assistant Comparison

### When to Use Each AI

| AI Assistant       | Best For                                    | Pricing                   | Strengths                                                 |
| ------------------ | ------------------------------------------- | ------------------------- | --------------------------------------------------------- |
| **GitHub Copilot** | General code completion, GitHub integration | $10/mo                    | Fast suggestions, great test generation, GitHub ecosystem |
| **Cursor**         | Complex refactoring, long coding sessions   | $20/mo                    | Claude-powered, Composer Mode, deep context understanding |
| **Cline**          | Autonomous multi-file tasks, bug fixing     | Free (pay for Claude API) | Autonomous execution, terminal access, file operations    |
| **Codeium**        | Budget-conscious teams, multi-language      | Free forever              | 70+ languages, fast, privacy-first, no subscription       |

### Can I Use Multiple AIs Together?

**Yes!** LEO Kit generates separate instruction files for each AI:

```
project/
├── .github/
│   └── copilot-instructions.md   ← GitHub Copilot reads this
├── .cursorrules                   ← Cursor reads this
├── .clinerules                    ← Cline reads this
└── .codeium/
    └── instructions.md            ← Codeium reads this
```

Each AI reads **only its own file**, so they don't conflict.

**Example workflow:**

- Use **Copilot** for quick completions while coding
- Use **Cursor** for large refactoring sessions
- Use **Cline** for autonomous multi-file feature implementation
- Use **Codeium** as a free backup option

---

## 🐛 Troubleshooting

### Q: My existing Copilot instructions are gone!

**A:** v3.0.0 should **never** delete existing files. Check:

```bash
ls -la .github/copilot-instructions.md
```

If missing, regenerate:

```bash
leo ai add copilot
```

### Q: Which AI should I use?

**A:** Start with your current AI and add more as needed:

- Already use Copilot? Keep using it!
- Use Cursor IDE? Run `leo ai add cursor`
- Want autonomous coding? Try `leo ai add cline`
- Budget-conscious? Try `leo ai add codeium`

### Q: Do I have to use all 4 AIs?

**No!** Use only the AIs you actually have installed. Common setups:

- **Copilot only** (default, no changes needed)
- **Copilot + Cursor** (best combo for most teams)
- **Cline + Codeium** (free alternative stack)
- **All 4** (maximum flexibility)

### Q: How do I go back to Copilot-only?

```bash
# Remove other AIs
leo ai remove cursor
leo ai remove cline
leo ai remove codeium

# Verify only Copilot remains
leo ai list
```

### Q: Does this affect my existing workflow?

**No!** The core LEO workflow remains the same:

1. Write specs in `docs/specs/`
2. Create GitHub issues
3. Reference issues in commits
4. Track work in GitHub Projects

v3.0.0 just extends this workflow to more AI assistants.

---

## 📚 Additional Resources

- **Full Documentation:** https://github.com/leonpagotto/leo-kit/wiki
- **v3.0.0 Release Notes:** [CHANGELOG.md](../CHANGELOG.md)
- **Multi-AI Specification:** [docs/specs/multi-ai-support.md](specs/multi-ai-support.md)
- **Issue #14:** https://github.com/leonpagotto/leo-kit/issues/14

---

## 🚨 Breaking Changes (Minor)

### For Package Developers

If you're building on top of LEO Kit:

**Changed:**

- `copilot-instructions-template.js` is now used as a **universal base template**
- New adapter system in `lib/ai-instructions/`
- `leo init` now prompts for AI selection (can be skipped with `--non-interactive`)

**Added:**

- New `leo ai` command with subcommands
- New `ai-assistants` config section
- New adapter classes: `BaseAIAdapter`, `CopilotAdapter`, `CursorAdapter`, etc.

**Removed:**

- None! All v2.x features remain available.

---

## ✅ Migration Checklist

- [ ] Update to v3.0.0: `npm install -g leo-workflow-kit@latest`
- [ ] Verify existing Copilot instructions still exist: `ls .github/copilot-instructions.md`
- [ ] Add AI assistants you use: `leo ai add <name>`
- [ ] Test new commands: `leo ai list`, `leo ai sync`
- [ ] Update team documentation about multi-AI support
- [ ] Consider which AI assistant is best for different tasks
- [ ] Configure `.leorc.json` with your primary AI
- [ ] Share migration guide with team members

---

**Questions or issues?** Open an issue: https://github.com/leonpagotto/leo-kit/issues

**v3.0.0 Status:** ✅ Phase 1 Complete - All 4 AI assistants supported!
