# 📦 Package Update Notice for Contributors

## leo-workflow-kit Update Required

**Date:** October 29, 2025
**Action Required:** Update `leo-workflow-kit` after pulling latest changes

### Why This Update?

The project has been updated to use `leo-workflow-kit v5.3.1` (from v4.1.1). If you pull the latest code, you'll need to update your local dependencies.

---

## 🔄 For Contributors: After Pulling Latest Code

When you pull the latest changes from the repository, follow these steps:

### Step 1: Pull Latest Code
```bash
git pull origin main
```

### Step 2: Update Dependencies
```bash
npm install
```

**This will automatically:**
- ✅ Install leo-workflow-kit v5.3.1
- ✅ Install 41 new dependency packages
- ✅ Update package-lock.json

### Step 3: Verify Installation
```bash
npm list leo-workflow-kit
```

**Expected output:**
```
rest-express@1.0.0 /path/to/osp-contabilidade
└── leo-workflow-kit@5.3.1
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Package not found"
**Problem:** leo-workflow-kit not installing

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

### Issue 2: Version Mismatch
**Problem:** Still seeing v4.1.1

**Solution:**
```bash
# Force update
npm update leo-workflow-kit

# Or explicitly install
npm install leo-workflow-kit@latest
```

### Issue 3: Peer Dependency Warnings
**Problem:** Warnings about @types/node with Vite

**Expected:** This is normal! These are non-blocking warnings.

**Action:** No action needed - warnings don't affect functionality

---

## 🚀 For First-Time Setup

If you're setting up the project for the first time:

### Step 1: Clone Repository
```bash
git clone https://github.com/osp-group/contabilidade.git
cd osp-contabilidade
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install Next.js Dependencies
```bash
cd next-migration
npm install
```

### Step 4: Verify Setup
```bash
# Check leo-workflow-kit
npm list leo-workflow-kit

# Test build
npm run build
```

---

## 📋 Dependency Update Checklist

After running `npm install`, verify:

- [ ] ✅ leo-workflow-kit@5.3.1 installed
- [ ] ✅ No critical errors during installation
- [ ] ✅ Build succeeds: `cd next-migration && npm run build`
- [ ] ✅ Development server starts: `npm run dev`
- [ ] ⚠️ Peer dependency warnings (expected - ignore)

---

## 🔍 What Changed in v5.3.1?

**Package:** leo-workflow-kit
**Previous Version:** 4.1.1
**New Version:** 5.3.1

**Changes:**
- Updated to latest commit in leo-kit repository
- 41 new dependency packages added
- Latest features and improvements included

**Impact:**
- ✅ Improved workflow tooling
- ✅ Bug fixes from v4.1.1
- ✅ New features available
- ⚠️ Some new dependencies (41 packages)

---

## 💡 Best Practices

### Always After Pulling:
```bash
git pull origin main
npm install          # Root dependencies
cd next-migration
npm install          # Next.js dependencies
```

### Check for Updates Regularly:
```bash
# Check outdated packages
npm outdated

# Update specific package
npm update leo-workflow-kit
```

### Clean Install (If Issues):
```bash
# Remove all dependencies
rm -rf node_modules package-lock.json
rm -rf next-migration/node_modules next-migration/package-lock.json

# Fresh install
npm install
cd next-migration && npm install
```

---

## 🆘 Need Help?

### Check These First:
1. **Node Version:** Ensure you're using Node.js 18+ (`node --version`)
2. **NPM Version:** Ensure npm 9+ (`npm --version`)
3. **Git Status:** Ensure you're on latest commit (`git log -1`)

### Still Having Issues?
1. Check existing GitHub issues
2. Create new issue with:
   - Error message
   - npm version
   - Node version
   - Steps to reproduce

### Quick Diagnostics:
```bash
# System info
node --version
npm --version
git log -1 --oneline

# Package info
npm list leo-workflow-kit
npm list --depth=0

# Build test
cd next-migration && npm run build
```

---

## 📊 Summary

**When you pull latest code:**
1. ✅ Run `npm install` (automatically updates leo-workflow-kit)
2. ✅ Verify version: `npm list leo-workflow-kit`
3. ✅ Test build works
4. ⚠️ Ignore peer dependency warnings (normal)

**You do NOT need to:**
- ❌ Manually run `npm update leo-workflow-kit`
- ❌ Delete node_modules (unless troubleshooting)
- ❌ Worry about peer dependency warnings

**`npm install` handles everything automatically!**

---

**Last Updated:** October 29, 2025
**Package Version:** leo-workflow-kit v5.3.1
**Status:** Ready for contributors ✅
