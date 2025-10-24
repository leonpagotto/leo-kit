# LEO Kit 5.0.0 - Quick Start (5 Minutes)

**Get started with LEO Kit in 5 minutes. No prior experience needed.**

---

## The 5-Minute Journey

### Minute 1: Install

```bash
npm install -g @leo/kit
leo --version
```

✅ **LEO Kit is installed!**

---

### Minute 2: Create Your First Project

```bash
leo spec init my-first-app
cd my-first-app
```

You now have:
- `constitution.md` - Team principles
- `specification.md` - What to build
- `plan.md` - How to build it
- `tasks.md` - What to do

```
✅ Project created!
```

---

### Minute 3: Write What You Want to Build

```bash
leo spec specify
```

A text editor opens. Replace the template with your idea:

```markdown
# User Authentication System

Build a simple login system with:
- User registration with email
- Password-protected login
- JWT tokens valid for 24 hours
- Email validation

## Acceptance Criteria
- User can sign up with email and password
- User can login with credentials
- Invalid passwords are rejected
- Tokens expire after 24 hours
```

Save and close the editor.

```
✅ Specification written!
```

---

### Minute 4: Generate Implementation Plan

```bash
leo spec plan
```

LEO Kit automatically creates:
- Phase breakdown
- Implementation steps
- Key deliverables

```
✅ Plan generated!
```

---

### Minute 5: Generate Code with AI

**First, set your API key (optional but recommended):**

```bash
# macOS/Linux
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"
```

Get a free API key at: https://console.anthropic.com

**Then generate:**

```bash
leo spec implement
```

Watch Claude 3.5 Sonnet generate your code:

```
🚀 Implementing specification...
✨ Generating with Claude 3.5 Sonnet...

Generated Files:
  ✅ src/auth/models/User.js
  ✅ src/auth/services/AuthService.js
  ✅ src/auth/routes/auth.routes.js
  ✅ tests/auth.test.js

📂 All files ready in: .leo/generated/
```

```
✅ Code generated!
```

---

## What You Just Did

1. ✅ Installed LEO Kit
2. ✅ Created a project structure
3. ✅ Wrote what you want to build
4. ✅ Generated an implementation plan
5. ✅ AI generated production-ready code

**Time spent:** 5 minutes  
**Code written:** 0 lines (AI did it!)  
**Productivity gained:** 10x ⚡

---

## Next: Use Your Generated Code

### View the Generated Code

```bash
ls -la .leo/generated/
cat .leo/generated/src/auth/services/AuthService.js
```

### Copy to Your Project

```bash
# Copy source files
cp -r .leo/generated/src/* ../my-app/src/

# Copy tests
cp -r .leo/generated/tests/* ../my-app/tests/

# Copy configuration
cp .leo/generated/package.json ../my-app/
```

### Install and Test

```bash
npm install
npm test
```

### Start Building

Your code is ready to use! You can:
- Review the code quality
- Run the tests
- Deploy to production
- Customize as needed

---

## Try Another Feature

Generate code for another feature:

```bash
# Back to main LEO Kit directory
leo spec init user-dashboard

# Write specification
leo spec specify

# Generate
leo spec implement
```

Repeat as many times as you want!

---

## Common Tasks

### See Generated Tasks

```bash
leo spec tasks
```

Shows all tasks generated from your specification.

### Check Project Status

```bash
leo spec status
```

Shows progress: Constitution → Specification → Plan → Tasks

### Start Local API Server

```bash
leo dashboard start

# In browser: http://localhost:3000
# WebSocket: ws://localhost:3000
```

### Create a Plugin

```bash
leo plugin create my-plugin
```

Extend LEO Kit with custom functionality.

---

## Get Help

### Available Commands

```bash
leo --help                # Overall help
leo spec --help          # Spec commands
leo plugin --help        # Plugin commands
leo dashboard --help     # Dashboard commands
```

### Read Full Documentation

- **Setup Guide:** See `docs/SETUP.md`
- **User Guide:** See `docs/USER_GUIDE.md`
- **API Reference:** See `docs/API_REFERENCE.md`
- **Tutorials:** See `docs/tutorials/`

### Report Issues

- GitHub Issues: https://github.com/leonpagotto/leo-kit/issues
- Discussions: https://github.com/leonpagotto/leo-kit/discussions

---

## Success! 🎉

You now know how to:
1. Install LEO Kit
2. Create specifications
3. Generate code with AI
4. Use your generated code

**Next steps:**
- Read full guides for advanced usage
- Create your own projects
- Try different feature types
- Share your specs with the community

---

**Welcome to LEO Kit! Happy building! 🚀**

---

## Cheat Sheet

```bash
# Installation
npm install -g @leo/kit

# Setup
leo spec init <name>
leo spec specify
leo spec plan
leo spec implement

# Commands
leo spec status          # Check progress
leo spec tasks          # View task list
leo dashboard start     # Start API server
leo plugin create <name> # Create plugin

# API Server
curl http://localhost:3000/api/specs

# Set API Key
export ANTHROPIC_API_KEY="sk-ant-..."
```

---

**Duration:** 5 minutes  
**Difficulty:** ⭐ Beginner  
**Result:** Generated production code ✅
