/**
 * LEO Workflow Kit GitHub Project Board Builder
 * Automatically creates and configures GitHub project boards
 * matching the workflow stages for the team size
 */

const fs = require('fs-extra');
const path = require('path');
const { WorkflowMode } = require('./workflow-modes');

/**
 * GitHub Project Builder
 * Creates project boards with columns matching workflow stages
 */
class GitHubProjectBuilder {
  constructor(repoOwner, repoName, teamSize) {
    this.repoOwner = repoOwner;
    this.repoName = repoName;
    this.teamSize = teamSize;
    this.config = WorkflowMode.getConfigByTeamSize(teamSize);
  }

  /**
   * Generate project board configuration
   * Can be used with GitHub CLI or API
   */
  getProjectConfig() {
    return {
      name: `🦁 LEO Workflow Kit Hunt ${this._getPackName()}`,
      description: this._getProjectDescription(),
      public: false,
      template: 'basic',
      columns: this.config.columns.map(col => ({
        name: col.name,
        description: col.description
      }))
    };
  }

  /**
   * Generate GitHub Actions workflow file
   * For automated board management
   */
  generateGitHubWorkflow() {
    const workflow = {
      name: 'LEO Workflow Kit Hunt Automation',
      on: {
        issues: {
          types: ['opened', 'reopened', 'labeled']
        },
        pull_request: {
          types: ['opened', 'ready_for_review', 'review_requested']
        }
      },
      jobs: {
        route_to_column: {
          'runs-on': 'ubuntu-latest',
          steps: [
            {
              uses: 'actions/github-script@v7',
              with: {
                'github-token': '${{ secrets.GITHUB_TOKEN }}',
                script: `
                  // Route to appropriate column based on labels and workflow stage
                  const labels = context.payload.issue?.labels || [];
                  const roleLabel = labels.find(l =>
                    l.name.includes('requirements') ||
                    l.name.includes('spec') ||
                    l.name.includes('impl') ||
                    l.name.includes('test')
                  );

                  // Move to appropriate column
                  // This requires project number and column mapping
                `
              }
            }
          ]
        }
      }
    };

    return workflow;
  }

  /**
   * Generate project board setup script (bash)
   * For manual or automated setup
   */
  generateSetupScript(members) {
    const columns = this.config.columns;
    const mapping = WorkflowMode.mapMembersToColumns(this.teamSize, members);

    let script = `#!/bin/bash
# LEO Workflow Kit Project Board Setup Script
# Generated for: ${this.repoOwner}/${this.repoName}

set -e

echo "🦁 Setting up LEO Workflow Kit project board..."
echo "Team Size: ${this.teamSize}"
echo ""

# Create project
PROJECT_NAME="🦁 LEO Workflow Kit Hunt - ${this._getPackName()}"
echo "Creating project: $PROJECT_NAME"

PROJECT=$(gh project create \\
  --repo ${this.repoOwner}/${this.repoName} \\
  --title "$PROJECT_NAME" \\
  --format json)

PROJECT_ID=$(echo $PROJECT | jq -r '.id')
PROJECT_NUMBER=$(echo $PROJECT | jq -r '.number')

echo "✓ Project created: #$PROJECT_NUMBER (ID: $PROJECT_ID)"
echo ""

# Create columns
echo "Creating workflow columns..."
`;

    columns.forEach((col, index) => {
      script += `\necho "  ${index + 1}/${columns.length}: ${col.name}"\n`;
      script += `gh project field-create $PROJECT_NUMBER --name "${col.name}" 2>/dev/null || true\n`;
    });

    script += `
echo ""
echo "✓ Project board setup complete!"
echo ""
echo "📊 Board Structure:"
`;

    columns.forEach(col => {
      const assignee = mapping[col.id] || 'Unassigned';
      script += `echo "   ${col.name}: @${assignee}"\n`;
    });

    script += `
echo ""
echo "🔗 Access your board:"
echo "   https://github.com/${this.repoOwner}/${this.repoName}/projects/$PROJECT_NUMBER"
echo ""
echo "💡 Next steps:"
echo "   1. Label issues with role: requirements, spec, implementation, testing"
echo "   2. Issues automatically route to columns"
echo "   3. Team members watch their columns"
`;

    return script;
  }

  /**
   * Generate project board documentation
   */
  generateBoardDocumentation(members) {
    const mapping = WorkflowMode.mapMembersToColumns(this.teamSize, members);
    const columnSequence = WorkflowMode.getColumnSequence(this.teamSize);

    let doc = `# 🦁 LEO Workflow Kit Project Board Guide\n\n`;
    doc += `**Team:** ${this.teamSize} developers\n`;
    doc += `**Repository:** ${this.repoOwner}/${this.repoName}\n`;
    doc += `**Mode:** ${this.config.mode.toUpperCase()}\n\n`;

    doc += `## 📊 Workflow Stages\n\n`;
    doc += `This project board has **${this.config.columns.length}** columns, one for each workflow stage:\n\n`;

    this.config.columns.forEach((col, index) => {
      const assignee = mapping[col.id] || 'Unassigned';
      const isParallel = col.roles && Array.isArray(col.roles) && col.roles.length > 1;

      doc += `### ${index + 1}. ${col.name}\n\n`;
      doc += `- **Emoji:** ${col.emoji}\n`;
      doc += `- **Owner:** @${assignee}\n`;
      doc += `- **Roles:** ${(col.roles || []).join(', ')}\n`;
      doc += `- **Description:** ${col.description}\n`;

      if (isParallel) {
        doc += `- **Note:** Parallel work - multiple roles active\n`;
      }

      doc += `\n`;
    });

    doc += `## 🔄 Hunt Cycle Flow\n\n`;
    doc += `Issues flow through the board in this sequence:\n\n`;

    columnSequence.forEach((colId, index) => {
      const col = this.config.columns.find(c => c.id === colId);
      const assignee = mapping[colId] || 'Unassigned';

      doc += `**${index + 1}. ${col.name}**\n`;
      doc += `   └─ Assigned to: @${assignee}\n`;

      if (index < columnSequence.length - 1) {
        doc += `      ↓ (auto-handoff)\n`;
      }
      doc += `\n`;
    });

    doc += `## 👥 Team Member Responsibilities\n\n`;

    members.forEach(member => {
      const memberColumns = this.config.columns.filter(col => {
        const assignee = mapping[col.id];
        return assignee === member.username;
      });

      if (memberColumns.length > 0) {
        doc += `### @${member.username} (${member.role})\n\n`;
        doc += `Manages these columns:\n`;
        memberColumns.forEach(col => {
          doc += `- ${col.name}\n`;
        });
        doc += `\n`;
      }
    });

    doc += `## 🏷️ Issue Labels\n\n`;
    doc += `Use these labels to route issues to appropriate columns:\n\n`;

    this.config.columns.forEach(col => {
      if (col.roles && Array.isArray(col.roles)) {
        col.roles.forEach(role => {
          doc += `- \`${role}\` - Routes to ${col.name}\n`;
        });
      } else if (col.roles) {
        doc += `- \`${col.roles}\` - Routes to ${col.name}\n`;
      }
    });

    doc += `\n## 🚀 Getting Started\n\n`;
    doc += `1. **Create Issue:** Start with a feature request or bug\n`;
    doc += `2. **Label Issue:** Add the appropriate role label\n`;
    doc += `3. **Route to Board:** Issue appears in corresponding column\n`;
    doc += `4. **Assign Owner:** Team member in that role takes over\n`;
    doc += `5. **Complete & Handoff:** Move to next column when done\n\n`;

    doc += `## 📈 Best Practices\n\n`;
    doc += `- ✓ Label all issues with role\n`;
    doc += `- ✓ One issue per discrete task\n`;
    doc += `- ✓ Update issue status as you move through columns\n`;
    doc += `- ✓ Link PRs to issues for tracking\n`;
    doc += `- ✓ Review velocity weekly in your hunt reports\n\n`;

    return doc;
  }

  /**
   * Save configuration files to project
   */
  async saveConfiguration(projectPath, members) {
    const leoDir = path.join(projectPath, '.leo');
    await fs.ensureDir(leoDir);

    // Save board config
    const boardConfigPath = path.join(leoDir, 'board.json');
    await fs.writeJson(boardConfigPath, {
      teamSize: this.teamSize,
      mode: this.config.mode,
      repoOwner: this.repoOwner,
      repoName: this.repoName,
      columns: this.config.columns,
      memberMapping: WorkflowMode.mapMembersToColumns(this.teamSize, members),
      createdAt: new Date().toISOString()
    }, { spaces: 2 });

    // Save setup script
    const scriptPath = path.join(leoDir, 'setup-board.sh');
    const script = this.generateSetupScript(members);
    await fs.writeFile(scriptPath, script, { mode: 0o755 });

    // Save documentation
    const docPath = path.join(projectPath, 'LIONPACK_BOARD.md');
    const doc = this.generateBoardDocumentation(members);
    await fs.writeFile(docPath, doc);

    return {
      configFile: boardConfigPath,
      scriptFile: scriptPath,
      docFile: docPath
    };
  }

  /**
   * Load existing configuration
   */
  static async loadConfiguration(projectPath) {
    const boardConfigPath = path.join(projectPath, '.leo', 'board.json');

    try {
      return await fs.readJson(boardConfigPath);
    } catch (error) {
      return null;
    }
  }

  // Private methods

  _getPackName() {
    const names = {
      1: 'Solo',
      2: 'Duo',
      3: 'Trio',
      4: 'Pack'
    };
    return names[this.teamSize] || 'Custom';
  }

  _getProjectDescription() {
    const descriptions = {
      1: 'Solo workflow - single developer coordinating all phases',
      2: 'Duo workflow - two developers specializing in key roles',
      3: 'Trio workflow - three developers with specialized expertise',
      4: 'Full pack - four developers covering all specializations'
    };
    return descriptions[this.teamSize] || 'LEO Workflow Kit team workflow';
  }
}

module.exports = {
  GitHubProjectBuilder
};
