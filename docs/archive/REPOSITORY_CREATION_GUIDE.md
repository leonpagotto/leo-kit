# Ingvar Kit - Repository Creation Guide

**Date**: October 22, 2025  
**Status**: ✅ Ready for Repository Creation  
**Your Account**: `leo.de.souza1@ingka.ikea.com`  

---

## ✅ What's Been Completed

### Core Rebranding (100% Complete)

1. **✅ Package & CLI** 
   - Package name: `ingvar-workflow-kit` v1.0.0
   - CLI commands: `ingvar`, `ingvar-workflow`
   - Bin entries updated
   - CLI tested and working

2. **✅ Branding**
   - IKEA Blue (#0051BA) & Yellow (#FFDB00) colors
   - 🪑 Chair emoji + 🇸🇪 Swedish flag
   - "Inspired by Ingvar Kamprad & Ingka Way of Working"
   - All banners and welcome messages updated

3. **✅ Configuration Files**
   - `.ingvarrc.json.example` created
   - `.gitignore` updated
   - All code references changed

4. **✅ AI Assistant Instructions** (4 files)
   - `.github/copilot-instructions.md`
   - `.cursorrules`
   - `.clinerules`
   - `.codeium/instructions.md`

5. **✅ Source Code** (All lib/ files)
   - `lib/commands/` (9 files)
   - `lib/utils/` (4 files)
   - `lib/agents/` (6 files)
   - `lib/ai-instructions/` (all files)
   - `lib/banner.js`
   - `lib/copilot-instructions-template.js`

6. **✅ Scripts**
   - `scripts/postinstall.js` updated

7. **✅ Documentation**
   - `README_INGVAR.md` - Complete new README
   - `INGVAR_KIT_REBRANDING.md` - Rebranding guide
   - `INGVAR_KIT_QUICKSTART.md` - Quick reference

8. **✅ Testing**
   - ✅ `ingvar --version` works
   - ✅ `ingvar --help` works
   - ✅ Banner displays correctly
   - ✅ Welcome message shows Ingka branding

---

## 📦 Ready-to-Publish Files

### Essential Files (Rebranded & Tested)

```
ingvar-kit/
├── .github/
│   ├── copilot-instructions.md ✅
│   └── ISSUE_TEMPLATE/ (needs review)
├── .codeium/
│   └── instructions.md ✅
├── bin/
│   └── cli.js ✅
├── lib/
│   ├── banner.js ✅
│   ├── commands/ ✅ (all files)
│   ├── utils/ ✅ (all files)
│   ├── agents/ ✅ (all files)
│   ├── ai-instructions/ ✅ (all files)
│   └── copilot-instructions-template.js ✅
├── scripts/
│   ├── postinstall.js ✅
│   └── deploy-wiki.sh (needs review)
├── templates/ (needs review)
├── docs/ (needs update - optional)
├── wiki/ (needs update - optional)
├── .clinerules ✅
├── .cursorrules ✅
├── .gitignore ✅
├── .ingvarrc.json.example ✅
├── .npmignore (needs review)
├── package.json ✅
├── README.md → Use README_INGVAR.md ✅
├── CHANGELOG.md (needs v1.0.0 entry)
├── LICENSE ✅
└── CONTRIBUTING.md (optional - add Ingka guidelines)
```

---

## 🚀 Step-by-Step: Creating Your Ingka Repository

### Option 1: Create Repository First (Recommended)

1. **Go to GitHub**
   - Navigate to your Ingka organization on GitHub
   - Or create under your personal account if that's your org name

2. **Create New Repository**
   - Repository name: `ingvar-kit`
   - Description: "Ingvar Workflow Kit - AI-powered CLI following Ingka Way of Working"
   - **Public** or **Private** (your choice)
   - ❌ Don't initialize with README (we have one)
   - ❌ Don't add .gitignore (we have one)
   - ❌ Don't add license (we have MIT)

3. **Note the Repository URL**
   ```
   https://github.com/<your-org>/ingvar-kit.git
   ```

### Option 2: Use GitHub CLI (If you have it)

```bash
# Authenticate with your Ingka account
gh auth login

# Create repository
gh repo create <your-org>/ingvar-kit \
  --public \
  --description "Ingvar Workflow Kit - AI-powered CLI following Ingka Way of Working" \
  --homepage "https://github.com/<your-org>/ingvar-kit#readme"
```

---

## 📁 Preparing Files for Push

### Step 1: Clean Up Current Directory

```powershell
cd c:\ingvar-kit\leo-kit

# Remove old LEO-specific files (optional - move to archive)
# Don't delete these yet - just note them:
# - .leorc.json.example (we have .ingvarrc.json.example)
# - RELEASE_V*.md (LEO version history)
# - SESSION_SUMMARY_*.md (LEO dev logs)
# - LEO_KIT_BUG_REPORT.md
```

### Step 2: Rename README

```powershell
# Backup current README
Move-Item README.md README_LEO_ORIGINAL.md

# Use Ingvar README
Move-Item README_INGVAR.md README.md
```

### Step 3: Update Package.json Repository URL

**Important:** Before pushing, update `package.json` with your actual repository URL:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/<YOUR-ORG>/ingvar-kit.git"
  },
  "bugs": {
    "url": "https://github.com/<YOUR-ORG>/ingvar-kit/issues"
  },
  "homepage": "https://github.com/<YOUR-ORG>/ingvar-kit#readme"
}
```

Replace `<YOUR-ORG>` with your actual Ingka organization name.

### Step 4: Review Optional Files

These files can be updated later or removed:

- `docs/` - Documentation (can update after initial release)
- `wiki/` - Wiki pages (can update separately)
- `CHANGELOG.md` - Add v1.0.0 entry
- `CONTRIBUTING.md` - Add Ingka contribution guidelines
- `templates/` - Review for LEO references

---

## 🔨 Initial Commit & Push

### Step 1: Initialize Git (if not already)

```powershell
cd c:\ingvar-kit\leo-kit

# If this is a new git repo
git init
git branch -M main
```

### Step 2: Configure Git with Your Ingka Account

```powershell
# Set your Ingka email for this repository
git config user.email "leo.de.souza1@ingka.ikea.com"
git config user.name "Leo de Souza"

# Verify
git config user.email
git config user.name
```

### Step 3: Add Files

```powershell
# Add all rebranded files
git add .

# Or selectively add (recommended for first commit)
git add package.json
git add bin/
git add lib/
git add scripts/
git add .github/
git add .codeium/
git add .clinerules
git add .cursorrules
git add .gitignore
git add .ingvarrc.json.example
git add README.md
git add LICENSE
git add CHANGELOG.md
```

### Step 4: Commit

```powershell
git commit -m "feat: initial release of Ingvar Kit v1.0.0

- Rebranded from LEO Kit to Ingvar Kit
- Named after Ingvar Kamprad (IKEA founder)
- Aligned with Ingka Way of Working
- IKEA Blue & Yellow branding
- All commands changed to 'ingvar'
- Complete AI assistant support (Copilot, Cursor, Cline, Codeium)
- Spec-driven development methodology
- Automated GitHub Projects integration"
```

### Step 5: Add Remote & Push

```powershell
# Add your Ingka repository as remote
git remote add origin https://github.com/<YOUR-ORG>/ingvar-kit.git

# Push to main branch
git push -u origin main
```

---

## 📦 Publishing to NPM

### Step 1: Verify Package

```powershell
# Check package contents
npm pack --dry-run

# This shows what will be published
```

### Step 2: Login to NPM

```powershell
# Login with your NPM account
npm login

# You'll need:
# - NPM username
# - Password
# - Email (can use your Ingka email)
```

### Step 3: Publish

```powershell
# Publish publicly
npm publish --access public

# If under an organization scope
npm publish --access public --registry https://registry.npmjs.org/
```

### Step 4: Verify Installation

```powershell
# Test global installation
npm install -g ingvar-workflow-kit

# Verify
ingvar --version
ingvar --help
```

---

## ✅ Post-Publication Checklist

### GitHub Repository

- [ ] Repository created under Ingka organization
- [ ] README displays correctly
- [ ] All files pushed successfully
- [ ] Repository description set
- [ ] Topics/tags added: `ingka`, `ikea`, `ingvar-kamprad`, `workflow`, `cli`

### NPM Package

- [ ] Package published successfully
- [ ] Package page shows correct information
- [ ] Installation works: `npm install -g ingvar-workflow-kit`
- [ ] Commands work: `ingvar --version`, `ingvar init`

### Documentation

- [ ] README is complete and accurate
- [ ] All links work (no 404s)
- [ ] Installation instructions tested
- [ ] Example commands tested

### Release

- [ ] Create GitHub Release v1.0.0
- [ ] Add release notes
- [ ] Tag the commit: `git tag v1.0.0 && git push --tags`

### Communication

- [ ] Share with Ingka Digital team
- [ ] Update internal documentation
- [ ] Create demo/tutorial (optional)
- [ ] Announce in relevant channels

---

## 🔧 Quick Fixes If Needed

### Update Repository URL After Push

```powershell
# If you need to change the repository URL
cd c:\ingvar-kit\leo-kit

# Update package.json
# Then commit and push
git add package.json
git commit -m "fix: update repository URL"
git push
```

### Republish to NPM

```powershell
# Bump version first
npm version patch  # 1.0.0 → 1.0.1

# Then publish
npm publish --access public
```

---

## 📋 Current Package Configuration

**Package Name**: `ingvar-workflow-kit`  
**Version**: `1.0.0`  
**Bin Commands**: `ingvar`, `ingvar-workflow`  
**Author**: Ingka Digital  
**License**: MIT  

**Current Repository** (needs update):
```
https://github.com/ingka-group/ingvar-kit.git
```

**⚠️ REMEMBER**: Update `package.json` with your actual organization name before pushing!

---

## 🎯 Summary

You now have a **fully rebranded Ingvar Kit** ready to publish! 

**What's working:**
- ✅ All CLI commands
- ✅ IKEA/Ingka branding
- ✅ AI assistant instructions
- ✅ Banner and welcome messages
- ✅ Configuration files
- ✅ Source code updated

**Next steps:**
1. Create GitHub repository under your Ingka organization
2. Update `package.json` with actual repository URL
3. Rename `README_INGVAR.md` to `README.md`
4. Configure Git with your Ingka account
5. Commit and push to GitHub
6. Publish to NPM (optional)
7. Create v1.0.0 release

---

**Made with 🪑 by Ingka Digital**  
*Following Ingvar Kamprad's principles: Simple, Quality, Efficient*

---

## 📞 Need Help?

If you encounter any issues:

1. **Git Issues**: Check your Ingka account is configured
   ```powershell
   git config user.email  # Should show leo.de.souza1@ingka.ikea.com
   ```

2. **NPM Issues**: Ensure you're logged in
   ```powershell
   npm whoami  # Shows your NPM username
   ```

3. **CLI Issues**: Test locally first
   ```powershell
   node bin/cli.js --version
   ```

4. **Repository Issues**: Verify organization access on GitHub

All the hard work is done - now it's just a matter of creating the repo and pushing! 🚀
