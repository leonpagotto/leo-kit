# LEO Workflow Kit Wiki Content

This directory contains markdown files for the LEO Workflow Kit GitHub Wiki.

## 📚 Wiki Pages

### Essential Pages (Ready to Upload)
1. **Home.md** - Wiki homepage with navigation and overview
2. **Roadmap.md** - Product roadmap and future plans
3. **Installation-Guide.md** - Complete installation instructions
4. **Commands-Reference.md** - Full command documentation

### How to Set Up the Wiki

#### Option 1: Via GitHub Web Interface (Recommended)

1. **Enable Wiki**
   - Go to: https://github.com/leonpagotto/leo-kit/settings
   - Scroll to "Features"
   - Check ✅ "Wikis"
   - Click "Save changes"

2. **Create Initial Page**
   - Go to: https://github.com/leonpagotto/leo-kit/wiki
   - Click "Create the first page"
   - Click "Save Page" (creates Home page)

3. **Upload Wiki Pages**
   For each markdown file in this directory:
   
   **Home Page:**
   - Click "Edit" on Home page
   - Copy content from `wiki/Home.md`
   - Paste into editor
   - Click "Save Page"
   
   **Additional Pages:**
   - Click "New Page" button
   - Title: Use filename without `.md` (e.g., "Roadmap", "Installation-Guide")
   - Copy content from corresponding file
   - Click "Save Page"

#### Option 2: Via Git Clone (Advanced)

1. **Clone the Wiki Repository**
   ```bash
   git clone https://github.com/leonpagotto/leo-kit.wiki.git
   cd leo-kit.wiki
   ```

2. **Copy Wiki Files**
   ```bash
   cp ../leo-kit/wiki/*.md .
   ```

3. **Commit and Push**
   ```bash
   git add *.md
   git commit -m "docs: add comprehensive wiki pages"
   git push origin master
   ```

#### Option 3: Automated Script

Create a script to upload all pages:

```bash
#!/bin/bash
# upload-wiki.sh

WIKI_REPO="https://github.com/leonpagotto/leo-kit.wiki.git"
TEMP_DIR="./temp-wiki"

# Clone wiki
git clone $WIKI_REPO $TEMP_DIR
cd $TEMP_DIR

# Copy all markdown files
cp ../wiki/*.md .

# Commit and push
git add *.md
git commit -m "docs: update wiki pages"
git push origin master

# Cleanup
cd ..
rm -rf $TEMP_DIR

echo "✓ Wiki pages uploaded!"
```

## 📝 Wiki Pages Overview

### Home.md
- Welcome page with project overview
- Quick navigation to all wiki sections
- Current status and roadmap summary
- Key concepts and features

**Sections:**
- Quick Navigation (links to all pages)
- Quick Example
- Current Status
- Roadmap Summary
- Key Concepts
- Community & Resources

### Roadmap.md
- Complete product roadmap
- Release history (v2.0.0 - v2.3.0)
- Upcoming releases (v2.4.0 - v3.0.0)
- Feature requests and community input
- Success metrics

**Sections:**
- Release History
- In Progress (v2.3.1)
- Upcoming (v2.4.0, v2.5.0, v3.0.0)
- Feature Requests
- Research & Exploration
- Contributing to Roadmap

### Installation-Guide.md
- Complete installation instructions
- Prerequisites and requirements
- Multiple installation methods
- GitHub CLI setup
- First-time setup walkthrough
- Troubleshooting guide

**Sections:**
- Prerequisites
- Installation Methods (3)
- GitHub CLI Setup
- First-Time Setup
- Verification
- Troubleshooting
- Updating & Uninstallation

### Commands-Reference.md
- Complete command documentation
- Usage examples for each command
- Options and flags
- Common workflows
- Tips and tricks

**Sections:**
- Command Overview Table
- Detailed Command Reference (10 commands)
- Global Options
- Command Chaining
- Common Workflows
- Tips & Tricks
- Troubleshooting Commands

## 🎯 Additional Pages to Create

### Suggested Future Pages
1. **Quick-Start.md** - Step-by-step tutorial for beginners
2. **Configuration.md** - Customization and settings
3. **Automatic-Issue-Creation.md** - Guide to AI-powered issues
4. **GitHub-Projects-Integration.md** - Project management guide
5. **Status-Management.md** - Understanding status transitions
6. **Spec-Driven-Development.md** - Specs-first methodology
7. **Copilot-Instructions.md** - Understanding AI behavior
8. **Custom-Templates.md** - Creating custom templates
9. **Architecture.md** - System design and components
10. **Troubleshooting.md** - Common issues and solutions
11. **FAQ.md** - Frequently asked questions
12. **Development-Guide.md** - Contributing to LEO
13. **Release-Process.md** - How releases are made

## 📋 Wiki Maintenance Checklist

### When Adding New Features
- [ ] Update Home page with new feature summary
- [ ] Add to Roadmap (move from planned to released)
- [ ] Update Commands Reference if new commands added
- [ ] Create dedicated page for major features
- [ ] Update Quick Start if workflow changes
- [ ] Add troubleshooting section if needed

### Monthly Review
- [ ] Update Roadmap progress
- [ ] Review and update FAQ
- [ ] Check for outdated information
- [ ] Add new community-requested pages
- [ ] Update screenshots/diagrams
- [ ] Review external links (ensure not broken)

### Release Updates
- [ ] Update version numbers
- [ ] Add release notes to Roadmap
- [ ] Update Installation Guide if needed
- [ ] Update Commands Reference for new commands
- [ ] Add migration guide if breaking changes

## 🎨 Wiki Formatting Tips

### Use Consistent Headers
```markdown
# Page Title (H1 - once per page)
## Major Section (H2)
### Subsection (H3)
#### Detail (H4)
```

### Add Navigation
```markdown
---
**[⬆ Back to Top](#page-title)**
---
```

### Use Emoji Strategically
- 📚 Documentation
- 🚀 Quick Start/Actions
- 🎯 Goals/Targets
- ✅ Completed/Success
- 🔧 Configuration/Settings
- 💡 Tips/Ideas
- 🐛 Bugs/Issues
- ⚠️ Warnings
- 📊 Stats/Data

### Code Blocks
\`\`\`bash
leo init
\`\`\`

### Tables
| Command | Purpose |
|---------|---------|
| `leo init` | Initialize |

### Callouts
> **Note:** Important information

> **Warning:** Critical warning

> **Tip:** Helpful tip

## 🔗 Internal Linking

Link to other wiki pages:
```markdown
[Installation Guide](./Installation-Guide)
[Roadmap](./Roadmap)
[Commands Reference](./Commands-Reference)
```

Link to repo files:
```markdown
[diagrams/architecture.mmd](../diagrams/architecture.mmd)
[docs/guides/](../docs/guides/)
```

## 📞 Need Help?

- **Wiki Issues:** Report on main repository
- **Content Suggestions:** Open an issue with "wiki" label
- **Typos/Corrections:** Submit PR to this directory

---

**Last Updated:** October 19, 2025  
**Wiki Version:** 1.0  
**Maintainer:** @leonpagotto
