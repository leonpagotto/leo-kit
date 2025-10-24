# LEO Kit 5.0.0 - Setup Guide

**Version:** 5.0.0  
**Released:** October 25, 2025  
**Status:** Production Ready ✅

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Environment Setup](#environment-setup)
4. [Configuration](#configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Prerequisites

| Requirement | Version | Notes |
|-----------|---------|-------|
| Node.js | 16+ | LTS recommended (18+) |
| npm | 7+ | Or yarn 1.22+ |
| Git | 2.0+ | For repository cloning |
| RAM | 2GB+ | 4GB+ recommended |
| Disk Space | 500MB+ | For node_modules |
| OS | Any | Windows, macOS, Linux supported |

### Supported Operating Systems

✅ **macOS** - Intel & Apple Silicon (M1/M2/M3)  
✅ **Windows** - 10/11 (PowerShell or Git Bash)  
✅ **Linux** - Ubuntu 20.04+, Debian 11+, CentOS 8+  

### Optional Software

| Tool | Purpose | Link |
|------|---------|------|
| Docker | Containerization | https://docker.com |
| Docker Compose | Multi-container | https://docs.docker.com/compose |
| Visual Studio Code | Recommended editor | https://code.visualstudio.com |
| Git | Version control | https://git-scm.com |

---

## Installation Methods

### Method 1: NPM Global Install (Recommended)

**Quickest way to get started:**

```bash
npm install -g @leo/kit
```

**Verify installation:**
```bash
leo --version
leo spec init --help
```

**Update to latest version:**
```bash
npm install -g @leo/kit@latest
```

### Method 2: NPM Local Install (Project-Specific)

**For project-specific installation:**

```bash
# Navigate to your project
cd my-project

# Install as dev dependency
npm install --save-dev @leo/kit

# Run with npx
npx leo spec init my-feature
```

**Or add to package.json:**
```json
{
  "devDependencies": {
    "@leo/kit": "^5.0.0"
  },
  "scripts": {
    "spec": "leo spec"
  }
}
```

Then run:
```bash
npm run spec init my-feature
```

### Method 3: Install from Source

**For development or latest features:**

```bash
# Clone repository
git clone https://github.com/leonpagotto/leo-kit.git
cd leo-kit

# Install dependencies
npm install

# Link globally
npm link

# Verify
leo --version
```

**Update from source:**
```bash
cd leo-kit
git pull origin main
npm install
npm link
```

### Method 4: Docker Installation

**Using Docker:**

```dockerfile
FROM node:18-alpine

# Install LEO Kit
RUN npm install -g @leo/kit

WORKDIR /workspace

# Initialize
RUN leo spec init my-feature

CMD ["leo", "dashboard", "start"]
```

**Build and run:**
```bash
docker build -t leo-kit .
docker run -p 3000:3000 leo-kit
```

---

## Environment Setup

### Step 1: Verify Node.js Installation

```bash
# Check Node.js version
node --version
# Should output: v16.0.0 or higher

# Check npm version
npm --version
# Should output: 7.0.0 or higher
```

**If not installed:**
- macOS: `brew install node`
- Windows: Download from https://nodejs.org
- Linux: `apt-get install nodejs npm` (Ubuntu/Debian)

### Step 2: Install LEO Kit

```bash
npm install -g @leo/kit
```

### Step 3: Configure API Key (Optional but Recommended)

For AI code generation, set your Claude API key:

**Option A: Environment Variable**

```bash
# macOS/Linux (add to ~/.zshrc or ~/.bashrc)
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"

# Windows PowerShell
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-xxxxxxxx", "User")

# Windows Command Prompt
setx ANTHROPIC_API_KEY "sk-ant-xxxxxxxx"
```

**Option B: .env File**

Create `.env` in your project:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

**Option C: Per-Session (Temporary)**

```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"
leo spec implement
```

**Get your API Key:**
1. Visit https://console.anthropic.com
2. Sign up or log in
3. Create new API key
4. Copy and store securely

### Step 4: Create Project Directory

```bash
# Create workspace
mkdir my-leo-project
cd my-leo-project

# Initialize git (recommended)
git init

# Create basic structure
mkdir -p specs/{features,examples}
touch .gitignore
```

### Step 5: Initialize First Specification

```bash
leo spec init my-first-feature
```

You should see:
```
✅ Specification initialized for my-first-feature
📁 Project structure created:
   - constitution.md
   - specification.md
   - plan.md
   - tasks.md
```

---

## Configuration

### Configuration File

Create `leo.config.json` in project root:

```json
{
  "version": "5.0.0",
  "project": {
    "name": "My Project",
    "description": "Project description"
  },
  "spec": {
    "outputDir": ".leo/generated",
    "templateDir": ".leo/templates"
  },
  "ai": {
    "provider": "claude",
    "model": "claude-3-5-sonnet-20241022"
  },
  "api": {
    "port": 3000,
    "host": "localhost",
    "cors": true
  },
  "plugins": {
    "enabled": ["web-dashboard", "vscode-extension"]
  }
}
```

### Environment Variables

Create `.env` file:

```bash
# API Configuration
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
LEO_API_PORT=3000
LEO_API_HOST=localhost

# Project Configuration
LEO_PROJECT_NAME="My Project"
LEO_OUTPUT_DIR=".leo/generated"

# Development
LEO_DEBUG=false
LEO_LOG_LEVEL=info

# Advanced
LEO_TIMEOUT=30000
LEO_MAX_RETRIES=3
```

### Directory Structure

Recommended project layout:

```
my-project/
├── .leo/                       # LEO Kit workspace
│   ├── generated/              # Generated code output
│   ├── templates/              # Custom templates
│   └── cache/                  # Cache files
├── specs/                      # Specification documents
│   ├── constitution.md         # Team principles
│   ├── specification.md        # Requirements
│   ├── plan.md                 # Implementation plan
│   └── tasks.md                # Task list
├── src/                        # Source code
│   ├── models/
│   ├── services/
│   └── routes/
├── tests/                      # Test files
├── docs/                       # Documentation
├── .env                        # Environment variables
├── leo.config.json             # LEO configuration
├── package.json                # NPM configuration
└── README.md                   # Project README
```

### .gitignore

Add to `.gitignore`:

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# LEO Kit
.leo/generated/*
.leo/cache/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
```

---

## Verification

### Verification Checklist

Run through these steps to verify everything works:

#### Step 1: Check Installation

```bash
leo --version

# Expected output:
# LEO Kit v5.0.0
# Ready to go! 🚀
```

#### Step 2: Check Commands

```bash
leo spec --help

# Should show all spec commands
# leo spec <command>
```

#### Step 3: Create Test Project

```bash
leo spec init test-project

# Expected output:
# ✅ Specification initialized for test-project
# 📁 Project structure created
```

#### Step 4: Verify API Server

```bash
leo dashboard start

# Expected output:
# 🚀 Dashboard server started
# Listening on http://localhost:3000
# Press Ctrl+C to stop
```

In another terminal:
```bash
curl http://localhost:3000/api/specs

# Should return JSON with specs
```

#### Step 5: Test Code Generation (with API Key)

If you configured ANTHROPIC_API_KEY:

```bash
# Create specification
leo spec specify

# Add simple requirement to specification.md
# Then generate code:
leo spec implement

# Should see:
# ✨ Generating with Claude 3.5 Sonnet...
# ✅ Generated 5 files (250 lines)
```

#### Step 6: Verify All Tests Pass

```bash
npm test

# Expected output:
# Test Suites: 2 passed, 2 total
# Tests: 49 passed, 49 total
# PASS ✅
```

### Verification Test Script

Create `verify.sh`:

```bash
#!/bin/bash

echo "🔍 LEO Kit Verification"
echo ""

# 1. Check Node
echo "1. Checking Node.js..."
node --version
if [ $? -eq 0 ]; then echo "✅ Node.js OK"; else echo "❌ Node.js FAILED"; exit 1; fi

# 2. Check LEO
echo "2. Checking LEO Kit..."
leo --version
if [ $? -eq 0 ]; then echo "✅ LEO Kit OK"; else echo "❌ LEO Kit FAILED"; exit 1; fi

# 3. Check API Key
echo "3. Checking API Key..."
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️ No API Key (optional but recommended)"
else
  echo "✅ API Key configured"
fi

# 4. Create test spec
echo "4. Creating test specification..."
leo spec init verify-test
if [ $? -eq 0 ]; then echo "✅ Spec creation OK"; else echo "❌ Spec creation FAILED"; exit 1; fi

# 5. Test API server
echo "5. Testing API server..."
leo dashboard start &
sleep 2
curl -s http://localhost:3000/api/specs > /dev/null
if [ $? -eq 0 ]; then echo "✅ API server OK"; else echo "❌ API server FAILED"; exit 1; fi
leo dashboard stop

echo ""
echo "✅ All verification checks passed!"
echo "You're ready to start building with LEO Kit!"
```

Run verification:
```bash
chmod +x verify.sh
./verify.sh
```

### Quick Verification

Quick 2-minute verification:

```bash
# 1. Version
leo --version

# 2. Initialize
leo spec init quick-test

# 3. Check files created
ls quick-test/

# 4. Status
leo spec status

# 5. You're done!
echo "✅ LEO Kit is working!"
```

---

## Troubleshooting

### Problem: "leo: command not found"

**Cause:** LEO Kit not installed or not in PATH

**Solutions:**

```bash
# Reinstall globally
npm install -g @leo/kit

# Or verify installation
npm list -g @leo/kit

# Or use npx instead
npx @leo/kit spec init my-feature
```

### Problem: "EACCES: permission denied"

**Cause:** Insufficient permissions for global install

**Solutions:**

```bash
# Option 1: Use sudo
sudo npm install -g @leo/kit

# Option 2: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Option 3: Use local install
npm install --save-dev @leo/kit
npx leo spec init my-feature
```

### Problem: "Module not found"

**Cause:** Missing dependencies

**Solutions:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or update
npm update
```

### Problem: "Port 3000 already in use"

**Cause:** Another process using port 3000

**Solutions:**

```bash
# Use different port
leo dashboard start --port 3001

# Or kill process on port 3000
lsof -ti :3000 | xargs kill -9

# macOS specific
sudo killall -9 node
```

### Problem: "API Key not working"

**Cause:** Invalid or missing API key

**Solutions:**

```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Should output: sk-ant-xxxxx

# If empty, set it:
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"

# Or check .env file exists:
cat .env | grep ANTHROPIC_API_KEY
```

### Problem: "Specification not found"

**Cause:** Wrong directory or spec not initialized

**Solutions:**

```bash
# Check current directory
pwd

# List existing specs
leo spec status

# Initialize if needed
leo spec init my-feature
```

### Problem: "Node version too old"

**Cause:** Node.js older than version 16

**Solutions:**

```bash
# Check version
node --version

# Update if needed
# macOS
brew upgrade node

# Windows
# Download from https://nodejs.org

# Linux
npm install -g n
n latest
```

### Problem: "Permission denied" on macOS/Linux

**Cause:** Incorrect file permissions

**Solutions:**

```bash
# Check permissions
ls -la /usr/local/bin/leo

# Fix permissions
sudo chown -R $(whoami) /usr/local/bin
sudo chown -R $(whoami) ~/.npm
```

### Problem: "Tests failing"

**Cause:** Missing dependencies or configuration

**Solutions:**

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test with verbose output
npm test -- --verbose --bail
```

### Problem: "Cannot find .env file"

**Cause:** .env file not in correct location

**Solutions:**

```bash
# Create .env in project root
cat > .env << EOF
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
LEO_API_PORT=3000
EOF

# Or set environment variables directly
export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"
```

---

## Platform-Specific Setup

### macOS Setup

**Using Homebrew:**

```bash
# Install Node if not present
brew install node

# Install LEO Kit
npm install -g @leo/kit

# Set API key (in ~/.zshrc or ~/.bash_profile)
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"' >> ~/.zshrc
source ~/.zshrc
```

**Apple Silicon (M1/M2/M3):**

LEO Kit works natively on Apple Silicon. No special setup needed.

### Windows Setup

**Using Windows Package Manager:**

```powershell
# Install Node if not present
winget install OpenJS.NodeJS

# Install LEO Kit
npm install -g @leo/kit

# Set API key permanently
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-xxxxxxxx", "User")

# Or for current session
$env:ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"
```

**Using PowerShell:**

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then install
npm install -g @leo/kit
```

### Linux Setup

**Ubuntu/Debian:**

```bash
# Install Node
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install LEO Kit
npm install -g @leo/kit

# Set API key (add to ~/.bashrc)
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

**CentOS/RHEL:**

```bash
# Install Node
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install LEO Kit
npm install -g @leo/kit
```

---

## Next Steps

1. ✅ **Install LEO Kit** - `npm install -g @leo/kit`
2. ✅ **Configure API Key** - Set `ANTHROPIC_API_KEY`
3. ✅ **Create First Project** - `leo spec init my-project`
4. ✅ **Read User Guide** - See `USER_GUIDE.md`
5. ✅ **Try Examples** - See `docs/tutorials/`

---

## Getting Help

- **Documentation:** https://github.com/leonpagotto/leo-kit/tree/main/docs
- **Issues:** https://github.com/leonpagotto/leo-kit/issues
- **Discussions:** https://github.com/leonpagotto/leo-kit/discussions
- **Email:** support@leokit.dev

---

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** ✅ Production Ready
