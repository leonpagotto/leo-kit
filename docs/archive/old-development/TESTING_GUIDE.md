# Testing LEO Workflow Kit v2.0 Installation

This guide helps you test the new v2.0 features before publishing to npm.

---

## Prerequisites

- Node.js 16+ installed
- GitHub CLI (`gh`) installed and authenticated
- Git repository (create a test repo if needed)

---

## Test Scenarios

### Scenario 1: New Project with New GitHub Project

```bash
# Create test repository
mkdir test-leo-new-project
cd test-leo-new-project
git init
gh repo create test-leo-new-project --public --source=. --remote=origin --push

# Link the local package (from workflow-cli directory)
cd /path/to/workflow-cli
npm link

# Test installation
cd /path/to/test-leo-new-project
leo init

# Expected flow:
# 1. Choose "Create new GitHub Project"
# 2. Enter project name: "Test LEO Project"
# 3. Enter description: "Testing v2.0 features"
# 4. Confirm setup
# 5. Verify creation of:
#    - docs/ folder with specs/
#    - .github/ISSUE_TEMPLATE/
#    - .vscode/ settings
#    - GitHub labels
#    - New GitHub Project with custom fields
```

**Verification Checklist:**
- [ ] docs/specs/ folder created
- [ ] docs/specs/EXAMPLE_SPEC.md exists
- [ ] .github/ISSUE_TEMPLATE/ has 8 templates
- [ ] .github/copilot-instructions.md created
- [ ] .vscode/settings.json exists
- [ ] GitHub labels created (check `gh label list`)
- [ ] New GitHub Project visible (check GitHub UI)
- [ ] Project has Priority and Component fields

---

### Scenario 2: Existing Project with Existing GitHub Project

```bash
# Create test repository
mkdir test-leo-existing-project
cd test-leo-existing-project
git init
gh repo create test-leo-existing-project --public --source=. --remote=origin --push

# Create GitHub Project manually first
# Note the project number (e.g., #5)
gh project create --owner YOUR_USERNAME --title "Existing Test Project"

# Test installation
leo init

# Expected flow:
# 1. Choose "Use existing GitHub Project"
# 2. Enter project number: 5
# 3. Confirm setup
# 4. Verify connection to existing project
```

**Verification Checklist:**
- [ ] All standard files created
- [ ] Repository added to existing project
- [ ] Project structure unchanged
- [ ] No duplicate custom fields created

---

### Scenario 3: Skip Project Setup

```bash
# Create test repository
mkdir test-leo-skip-project
cd test-leo-skip-project
git init
gh repo create test-leo-skip-project --public --source=. --remote=origin --push

# Test installation
leo init

# Expected flow:
# 1. Choose "Skip project setup (I'll do it later)"
# 2. Confirm setup
# 3. Verify workflow created without project
```

**Verification Checklist:**
- [ ] All standard files created
- [ ] No GitHub Project created or connected
- [ ] Can run `leo init` again to add project later

---

### Scenario 4: Organization Repository

```bash
# Test with org repo (if you have access)
cd /path/to/org-repo
leo init

# Expected flow:
# 1. Organization auto-detected and pre-filled
# 2. Project setup options presented
# 3. Verify org-specific project creation
```

---

## Feature Testing

### Test Component-First Guidelines

```bash
# After running leo init
cat .github/copilot-instructions.md | grep -A 10 "Component-First"

# Expected: See comprehensive component-first section
```

### Test Performance Guidelines

```bash
cat .github/copilot-instructions.md | grep -A 10 "Performance"

# Expected: See lazy loading, code splitting guidelines
```

### Test SEO Guidelines

```bash
cat .github/copilot-instructions.md | grep -A 10 "SEO"

# Expected: See meta tags, semantic HTML guidelines
```

### Test DRY Principle

```bash
cat .github/copilot-instructions.md | grep -A 10 "DRY"

# Expected: See code duplication prevention guidelines
```

---

## Command Testing

### Test leo status

```bash
leo status

# Expected output:
# ✓ GitHub CLI
# ✓ Git Repository
# ✓ Issue Templates
# ✓ Labels
# ✓ VS Code Config
```

### Test leo issue

```bash
leo issue

# Expected: Interactive issue creation with templates
```

### Test leo labels

```bash
leo labels --clean

# Expected: Clean and recreate all labels
```

### Test leo vscode

```bash
leo vscode --project

# Expected: Update Copilot instructions
```

---

## Edge Cases to Test

### 1. Already Initialized Repository

```bash
# Run leo init twice
leo init
leo init

# Expected: Skip already existing files, update Copilot instructions
```

### 2. No GitHub CLI

```bash
# Temporarily rename gh
which gh
sudo mv /usr/local/bin/gh /usr/local/bin/gh-backup

# Run leo init
leo init

# Expected: Error message with gh install instructions

# Restore
sudo mv /usr/local/bin/gh-backup /usr/local/bin/gh
```

### 3. Not in Git Repository

```bash
mkdir test-no-git
cd test-no-git

leo init

# Expected: Error about not being in a git repository
```

### 4. Invalid Project Number

```bash
leo init

# Choose "Use existing GitHub Project"
# Enter invalid number: 999999

# Expected: Graceful error handling
```

---

## Performance Testing

### Measure Initialization Time

```bash
time leo init

# Expected: Complete in < 60 seconds
# Target: 30-45 seconds for full setup
```

---

## Documentation Verification

### Check All Documentation Created

```bash
# After initialization
ls -la docs/
ls -la docs/specs/
ls -la .github/
ls -la .github/ISSUE_TEMPLATE/
ls -la .vscode/

# Verify all expected files exist
```

### Check README Updates

```bash
cat README.md | grep "v2.0"
cat README.md | grep "Component-First"
cat README.md | grep "Performance"
cat README.md | grep "SEO"

# Expected: All v2.0 features documented
```

### Check CHANGELOG

```bash
cat CHANGELOG.md | grep "\[2.0.0\]"

# Expected: Complete v2.0 changelog
```

---

## Publishing Checklist

Before publishing to npm:

- [ ] All test scenarios pass
- [ ] No errors in console output
- [ ] All documentation files created
- [ ] README.md updated
- [ ] CHANGELOG.md includes v2.0
- [ ] package.json version is 2.0.0
- [ ] No hardcoded test values
- [ ] All links in README work
- [ ] GitHub Project creation works
- [ ] GitHub Project connection works
- [ ] Copilot instructions comprehensive

---

## Rollback Plan

If issues are found after publishing:

```bash
# Quick fix
npm version patch
npm publish

# Major issues - deprecate and rollback
npm deprecate leo-workflow-kit@2.0.0 "Issue found, use v1.3.0"
npm unpublish leo-workflow-kit@2.0.0 --force (within 72 hours only)
```

---

## Local Testing Commands

```bash
# Install locally for testing
cd /path/to/workflow-cli
npm link

# Test in another directory
cd /path/to/test-project
leo init

# Unlink when done
npm unlink -g leo-workflow-kit
```

---

## Bug Report Template

If you find issues during testing:

```markdown
**Bug Title**: [Clear description]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happened

**Environment**:
- OS: [macOS/Linux/Windows]
- Node version: [x.x.x]
- leo-workflow-kit version: [2.0.0]
- GitHub CLI version: [x.x.x]

**Additional Context**:
Any other relevant information
```

---

## Success Criteria

v2.0 is ready to publish when:

1. ✅ All 4 test scenarios pass
2. ✅ All commands work correctly
3. ✅ All edge cases handled gracefully
4. ✅ Documentation is comprehensive
5. ✅ No console errors or warnings
6. ✅ Performance meets targets (< 60s)
7. ✅ GitHub Project creation works
8. ✅ GitHub Project connection works
9. ✅ Copilot instructions are complete
10. ✅ All links and references valid

---

**Ready to publish?** Run through all scenarios once more, then:

```bash
npm login
npm publish
```

🎉 **Congratulations on shipping v2.0!**
