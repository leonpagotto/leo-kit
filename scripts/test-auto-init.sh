#!/bin/bash

# Auto-Initialization Test Script
# Tests the LEO_AUTO_INIT feature in a temporary directory

set -e

echo "🧪 Testing LEO Auto-Initialization Feature"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create temp directory
TEST_DIR="/tmp/leo-test-$(date +%s)"
echo -e "${BLUE}📁 Creating test directory: $TEST_DIR${NC}"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Initialize git repo
echo -e "${BLUE}🔧 Initializing git repository...${NC}"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"

# Create package.json
echo -e "${BLUE}📝 Creating package.json...${NC}"
cat > package.json << EOF
{
  "name": "leo-test-project",
  "version": "1.0.0",
  "private": true
}
EOF

# Get current LEO path
LEO_PATH="$(cd ~/workflow-cli && pwd)"
echo -e "${BLUE}📦 Using LEO from: $LEO_PATH${NC}"
echo ""

# Test 1: Auto-init with flag
echo -e "${YELLOW}Test 1: Install with LEO_AUTO_INIT=true${NC}"
echo "=========================================="
LEO_AUTO_INIT=true npm install "$LEO_PATH" --silent

# Verify files created
echo -e "\n${BLUE}Verifying files created...${NC}"

if [ -d "docs/specs" ]; then
  echo -e "${GREEN}✓${NC} docs/specs/ created"
else
  echo -e "${RED}✗${NC} docs/specs/ NOT created"
  exit 1
fi

if [ -d ".github/ISSUE_TEMPLATE" ]; then
  echo -e "${GREEN}✓${NC} .github/ISSUE_TEMPLATE/ created"
else
  echo -e "${RED}✗${NC} .github/ISSUE_TEMPLATE/ NOT created"
  exit 1
fi

if [ -d ".github/workflows" ]; then
  echo -e "${GREEN}✓${NC} .github/workflows/ created"
else
  echo -e "${RED}✗${NC} .github/workflows/ NOT created"
  exit 1
fi

if [ -f ".github/copilot-instructions.md" ]; then
  echo -e "${GREEN}✓${NC} .github/copilot-instructions.md created"
else
  echo -e "${RED}✗${NC} .github/copilot-instructions.md NOT created"
  exit 1
fi

if [ -f ".vscode/settings.json" ]; then
  echo -e "${GREEN}✓${NC} .vscode/settings.json created"
else
  echo -e "${RED}✗${NC} .vscode/settings.json NOT created"
  exit 1
fi

# Count issue templates
TEMPLATE_COUNT=$(ls -1 .github/ISSUE_TEMPLATE/*.md 2>/dev/null | wc -l | tr -d ' ')
if [ "$TEMPLATE_COUNT" -ge 8 ]; then
  echo -e "${GREEN}✓${NC} Issue templates created ($TEMPLATE_COUNT files)"
else
  echo -e "${RED}✗${NC} Not enough issue templates ($TEMPLATE_COUNT, expected 8+)"
  exit 1
fi

# Count workflows
WORKFLOW_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l | tr -d ' ')
if [ "$WORKFLOW_COUNT" -ge 3 ]; then
  echo -e "${GREEN}✓${NC} GitHub Actions workflows created ($WORKFLOW_COUNT files)"
else
  echo -e "${RED}✗${NC} Not enough workflows ($WORKFLOW_COUNT, expected 3+)"
  exit 1
fi

# Test status command
echo -e "\n${BLUE}Running: npx leo status${NC}"
npx leo status

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo -e "${BLUE}Test directory: $TEST_DIR${NC}"
echo -e "${YELLOW}To inspect: cd $TEST_DIR${NC}"
echo -e "${YELLOW}To cleanup: rm -rf $TEST_DIR${NC}"
