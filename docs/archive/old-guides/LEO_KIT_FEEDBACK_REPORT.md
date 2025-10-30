# LEO Workflow Kit v5.0.0 - Feature Request: Documentation Organization

**Date:** 2025-10-27
**Project:** LionPack Studio
**Submitted By:** Leo de Souza (@leonpagotto)
**LEO Workflow Kit Version:** 5.0.0
**Health Score:** 98/100 (Grade A - Excellent!)

---

## 🎉 Overall Assessment

**LEO Workflow Kit v5.0.0 is excellent!** Our project scores 98/100 on health checks. The issue tracking, workflow management, and Copilot integration work beautifully.

**However**, there's one remaining pain point that would make it perfect: **automated documentation organization**.

---

## The Problem: Documentation Sprawl

### What Happened

Over the course of development, our root directory accumulated **50+ markdown files**:

- `SESSION_SUMMARY_*.md` (14 files)
- `STORY_*.md` (15 files)
- `PHASE_*.md` (12 files)
- Various other docs (9+ files)

**Result:** Repository looked unprofessional and was difficult to navigate.

### Current Manual Cleanup Process

We had to manually:

1. Create organized folder structure (`docs/sessions/`, `docs/stories/`, `docs/phases/`)
2. Move 45+ files to correct locations
3. Update documentation index
4. Create automation script for future use

**Time Lost:** ~2 hours of unproductive work

### Desired Organization

```
Root/ (clean - only 5-6 essential files)
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
├── INDEX.md
└── LOCAL_DEPLOYMENT_GUIDE.md

docs/
├── sessions/YYYY-MM/     # Session summaries
├── stories/story-X.Y/    # Story documentation
├── phases/phase-X/       # Phase reports
└── guides/               # Testing guides
```

---

## Feature Request: Automated Documentation Enforcement

### 1. File Placement Validation (Pre-Commit Hook)

**Goal:** Prevent markdown files from being committed to root directory (except allowed files).

**Implementation:**

```bash
# .git/hooks/pre-commit (auto-installed by leo init)
#!/bin/bash

# Get new markdown files in root
ROOT_MD_FILES=$(git diff --cached --name-only --diff-filter=A |
  grep '^[^/]*\.md$' |
  grep -v -E '^(README|CONTRIBUTING|LICENSE|SECURITY|INDEX|LOCAL_DEPLOYMENT_GUIDE)\.md$')

if [ -n "$ROOT_MD_FILES" ]; then
  echo "❌ ERROR: Markdown files not allowed in root directory"
  echo ""
  echo "Files attempting to add:"
  echo "$ROOT_MD_FILES" | sed 's/^/  - /'
  echo ""
  echo "LEO Workflow Organization:"
  echo "  • Session summaries  → docs/sessions/YYYY-MM/"
  echo "  • Story docs         → docs/stories/story-X.Y/"
  echo "  • Phase reports      → docs/phases/phase-X/"
  echo "  • Guides             → docs/guides/"
  echo ""
  echo "Auto-fix: leo organize-docs"
  exit 1
fi
```

**User Experience:**

```bash
$ git commit -m "Add session summary"

❌ ERROR: Markdown files not allowed in root directory

Files attempting to add:
  - SESSION_SUMMARY_2025-10-27.md

LEO Workflow Organization:
  • Session summaries → docs/sessions/YYYY-MM/

Auto-fix: leo organize-docs
```

### 2. Real-Time Documentation Organization

**Goal:** Auto-move files to correct locations as they're created.

**Option A: File Watcher (Development)**

```javascript
// Auto-started with leo init or npm run dev
const watcher = chokidar.watch("*.md", { ignoreInitial: true });

watcher.on("add", async (filename) => {
  if (isAllowedInRoot(filename)) return;

  const targetDir = getTargetDirectory(filename);
  await moveFile(filename, targetDir);

  console.log(`📁 Auto-organized: ${filename} → ${targetDir}/`);
});
```

**Option B: New CLI Command**

```bash
# Manual organization
leo organize-docs

# Output:
# 📁 Organizing documentation...
# ✓ Moved SESSION_SUMMARY_2025-10-27.md → docs/sessions/2025-10/
# ✓ Moved STORY_3.10_COMPLETE.md → docs/stories/story-3.10/
# ✅ Documentation organized (2 files moved)
```

### 3. Health Check Integration

**Add to `leo health` command:**

```bash
$ leo health

Documentation Organization:
  ✓ docs/ directory structure (3 pts)
  ✗ Root directory clean (0/5 pts) - 7 extra markdown files found

Overall Score: 91/100 (91%) - Grade A-

💡 Run 'leo organize-docs' to fix documentation organization
```

### 4. Config Options

**Add to `.leorc.json`:**

```json
{
  "documentation": {
    "enforce-organization": true,
    "auto-organize": true,
    "root-files-max": 6,
    "allowed-root-files": [
      "README.md",
      "CONTRIBUTING.md",
      "LICENSE",
      "SECURITY.md",
      "INDEX.md",
      "LOCAL_DEPLOYMENT_GUIDE.md"
    ]
  }
}
```

**Configuration via CLI:**

```bash
# Enable enforcement
leo config set documentation.enforce-organization true

# Set auto-organize
leo config set documentation.auto-organize true

# Check current settings
leo config get documentation
```

---

## Suggested Implementation Priority

### Phase 1: Basic Validation (Highest Value)

1. **Pre-commit hook** - Prevent root directory clutter
2. **`leo organize-docs` command** - Manual organization tool
3. **Health check integration** - Add to scoring

**Effort:** Low | **Impact:** High

### Phase 2: Automation (Nice to Have)

4. **Real-time file watcher** - Auto-organize during development
5. **Config options** - Customizable enforcement

**Effort:** Medium | **Impact:** Medium

### Phase 3: Advanced Features (Future)

6. **VS Code extension integration** - Show warnings in IDE
7. **GitHub Actions validation** - CI/CD checks

**Effort:** High | **Impact:** Low (nice polish)

---

## Expected Benefits

### Developer Experience

- ✅ **Zero time wasted** on manual organization
- ✅ **Professional repository** structure maintained automatically
- ✅ **Clear feedback** when files are misplaced
- ✅ **Auto-fix available** with one command

### Workflow Compliance

- ✅ **100% adherence** to documentation standards
- ✅ **Consistent structure** across all LEO projects
- ✅ **Easy navigation** for team members
- ✅ **Onboarding friendly** - new devs see organized docs

### Time Saved

- **Per developer:** 2-4 hours/week (no manual cleanup)
- **Per project:** 8-16 hours/month across team
- **Per year:** 96-192 hours saved organization time

---

## Real-World Testing

We've already implemented and tested the manual version:

**Script Created:** `scripts/organize-docs.sh`

- Automatically categorizes files by naming patterns
- Creates proper directory structure
- Moves 45+ files in seconds
- Works perfectly ✅

**This proves the concept works** - just needs integration into LEO CLI.

---

## Alternative: Document the Pattern

If implementation is not feasible soon, at minimum:

1. **Document the pattern** in LEO documentation
2. **Provide template script** users can copy
3. **Add to `leo init`** - create folder structure upfront
4. **Example `.gitignore`** - ignore root markdown files (except allowed)

This would help but doesn't prevent the problem - just makes cleanup easier.

---

## Conclusion

**LEO Workflow Kit v5.0.0 is fantastic!** The issue tracking works perfectly, health checks are comprehensive, and the workflow integration is seamless.

**One enhancement would make it perfect:** Automated documentation organization enforcement.

This is the last pain point preventing 100% hands-free workflow compliance.

### Ask

Would the LEO team consider adding:

1. **Pre-commit hook** for file placement validation (Phase 1)
2. **`leo organize-docs` command** for auto-organization (Phase 1)
3. **Health check integration** for documentation (Phase 1)

These three features would eliminate the 2-hour manual cleanup burden and complete the workflow automation vision.

---

## Contact

**Submitted By:** Leo de Souza
**GitHub:** @leonpagotto
**Project:** LionPack Studio
**Repository:** https://github.com/leonpagotto/lionpack-studio

**Questions or Discussion:**

- Happy to collaborate on implementation
- Can provide our working script as starting point
- Available for testing and feedback

---

**Thank you for creating LEO Workflow Kit!** v5.0.0 is already excellent - this would make it perfect. 🚀
