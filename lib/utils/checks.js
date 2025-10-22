const { execSync } = require('child_process');
const fs = require('fs');

function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkIssueTemplates() {
  return fs.existsSync('.github/ISSUE_TEMPLATE');
}

function checkLabels() {
  try {
    const labels = execSync('gh label list', { encoding: 'utf8' });
    return labels.includes('P0') && labels.includes('P1');
  } catch {
    return false;
  }
}

function checkVSCode() {
  return fs.existsSync('.vscode/settings.json') || fs.existsSync('.github/copilot-instructions.md');
}

module.exports = {
  checkGitHubCLI,
  checkGitRepo,
  checkIssueTemplates,
  checkLabels,
  checkVSCode
};

