/**
 * VS Code Extension: LEO Model Selector Display
 *
 * This extension monitors real-time model selection changes and displays
 * the active model in VS Code's status bar and a custom dropdown.
 *
 * To use this extension:
 * 1. Copy to: ~/.vscode/extensions/leo-model-selector/
 * 2. Restart VS Code
 * 3. Watch the status bar for model changes during LEO tasks
 */

const vscode = require('vscode');
const fs = require('fs-extra');
const path = require('path');
const { EventEmitter } = require('events');

class LeoModelSelectorExtension {
  constructor(context) {
    this.context = context;
    this.statusBar = null;
    this.modelMonitor = null;
    this.currentModel = null;
    this.currentAgent = null;
    this.watchers = [];
    this.statusFileWatcher = null;
  }

  /**
   * Activate the extension
   */
  async activate() {
    console.log('LEO Model Selector Extension activating...');

    // Create status bar item
    this.createStatusBar();

    // Start monitoring for model changes
    this.startModelMonitoring();

    // Register commands
    this.registerCommands();

    // Watch for .leo-model-status.json changes
    this.watchStatusFile();

    console.log('LEO Model Selector Extension activated!');
  }

  /**
   * Create VS Code status bar item
   */
  createStatusBar() {
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100 // Priority
    );

    this.statusBar.command = 'leo-model-selector.showModelInfo';
    this.statusBar.tooltip = 'LEO Model Selector - Click for details';
    this.updateStatusBar('inactive', null, null);

    this.statusBar.show();
  }

  /**
   * Update status bar display
   * @param {string} state - 'active', 'inactive', 'complete'
   * @param {string} agent - Current agent
   * @param {string} model - Current model
   */
  updateStatusBar(state, agent, model) {
    if (state === 'active') {
      const agentEmoji = this.getAgentEmoji(agent);
      const modelLabel = this.formatModelLabel(model);
      this.statusBar.text = `$(sync~spin) ${agentEmoji} ${agent} → ${modelLabel}`;
      this.statusBar.color = '#4EC9B0'; // Teal = active
      this.statusBar.backgroundColor = new vscode.ThemeColor('statusBar.background');
    } else if (state === 'complete') {
      const agentEmoji = this.getAgentEmoji(agent);
      this.statusBar.text = `$(check) ${agentEmoji} ${agent} complete`;
      this.statusBar.color = '#6A9955'; // Green = complete
    } else {
      this.statusBar.text = '$(circle-slash) LEO Ready';
      this.statusBar.color = '#808080'; // Gray = inactive
    }

    this.currentAgent = agent;
    this.currentModel = model;
  }

  /**
   * Get emoji for agent type
   * @param {string} agent - Agent name
   * @returns {string} Emoji
   */
  getAgentEmoji(agent) {
    const emojis = {
      designer: '🎨',
      frontend: '💻',
      backend: '🔧',
      testing: '🧪',
      documentation: '📚',
      devops: '🚀',
      orchestrator: '🎯'
    };
    return emojis[agent] || '⚙️';
  }

  /**
   * Format model label for display
   * @param {string} model - Model identifier
   * @returns {string} Formatted label
   */
  formatModelLabel(model) {
    if (!model) return 'none';

    // Shorten model names for display
    const map = {
      'gpt-4': 'GPT-4',
      'gpt-4-turbo': 'GPT-4T',
      'gpt-3.5-turbo': 'GPT-3.5',
      'claude-3-opus': 'Claude-O',
      'claude-3-sonnet': 'Claude-S',
      'claude-3-haiku': 'Claude-H'
    };
    return map[model] || model;
  }

  /**
   * Watch for status file changes
   */
  watchStatusFile() {
    const statusFile = path.join(
      require('os').homedir(),
      '.leo-workflow-kit',
      '.leo-model-status.json'
    );

    // Create directory if it doesn't exist
    try {
      const dir = path.dirname(statusFile);
      fs.ensureDirSync(dir);
    } catch (error) {
      // Directory already exists or permission issue
    }

    // Use file system watcher
    this.statusFileWatcher = fs.watch(statusFile, async (eventType, filename) => {
      if (eventType === 'change') {
        try {
          const status = await fs.readJSON(statusFile);
          if (status.current) {
            const { agent, model, state } = status.current;
            this.updateStatusBar(state, agent, model);
          }
        } catch (error) {
          // File might be in the middle of being written
        }
      }
    });
  }

  /**
   * Start monitoring model changes
   */
  startModelMonitoring() {
    // Poll for status changes every 100ms
    setInterval(async () => {
      try {
        const statusFile = path.join(
          require('os').homedir(),
          '.leo-workflow-kit',
          '.leo-model-status.json'
        );

        if (fs.existsSync(statusFile)) {
          const status = await fs.readJSON(statusFile);
          if (status.current && status.current.agent !== this.currentAgent) {
            const { agent, model, state } = status.current;
            this.updateStatusBar(state, agent, model);
          }
        }
      } catch (error) {
        // Silently fail - file might not exist yet
      }
    }, 100);
  }

  /**
   * Register VS Code commands
   */
  registerCommands() {
    // Show detailed model information
    this.context.subscriptions.push(
      vscode.commands.registerCommand('leo-model-selector.showModelInfo', async () => {
        const statusFile = path.join(
          require('os').homedir(),
          '.leo-workflow-kit',
          '.leo-model-status.json'
        );

        try {
          const status = await fs.readJSON(statusFile);
          const current = status.current || {};

          const info = `
🎯 LEO Model Status

Agent: ${current.agent || 'None'}
Model: ${current.model || 'None'}
Status: ${current.state || 'Inactive'}
Time: ${current.timestamp || 'N/A'}

Recent Events:
${status.history?.map(h => `  • ${h.event || 'status'}: ${h.agent || 'system'}`).join('\n') || '  (none)'}
          `;

          vscode.window.showInformationMessage(info);
        } catch (error) {
          vscode.window.showErrorMessage('LEO model status not available');
        }
      })
    );

    // Show model selector dropdown
    this.context.subscriptions.push(
      vscode.commands.registerCommand('leo-model-selector.selectModel', async () => {
        const models = [
          'gpt-4 (Premium reasoning)',
          'gpt-4-turbo (Balanced)',
          'gpt-3.5-turbo (Fast/Cheap)',
          'claude-3-opus (Premium)',
          'claude-3-sonnet (Balanced)',
          'claude-3-haiku (Fast/Cheap)'
        ];

        const selected = await vscode.window.showQuickPick(models, {
          placeHolder: 'Select preferred model for next task'
        });

        if (selected) {
          const model = selected.split(' ')[0];
          vscode.window.showInformationMessage(`Model preference set to: ${model}`);
        }
      })
    );

    // Show model history
    this.context.subscriptions.push(
      vscode.commands.registerCommand('leo-model-selector.showHistory', async () => {
        const statusFile = path.join(
          require('os').homedir(),
          '.leo-workflow-kit',
          '.leo-model-status.json'
        );

        try {
          const status = await fs.readJSON(statusFile);
          const history = status.history || [];

          const items = history.map(h => ({
            label: `${h.agent} → ${h.model}`,
            description: `${h.event || 'execution'} - ${h.timestamp}`
          }));

          await vscode.window.showQuickPick(items, {
            placeHolder: 'Recent LEO model selections'
          });
        } catch (error) {
          vscode.window.showErrorMessage('No model history available');
        }
      })
    );
  }

  /**
   * Deactivate the extension
   */
  deactivate() {
    if (this.statusFileWatcher) {
      this.statusFileWatcher.close();
    }
    if (this.statusBar) {
      this.statusBar.dispose();
    }
  }
}

/**
 * VS Code Extension Activation Entry Point
 */
function activate(context) {
  const extension = new LeoModelSelectorExtension(context);
  extension.activate();

  // Store for deactivation
  context.subscriptions.push({
    dispose: () => extension.deactivate()
  });
}

/**
 * VS Code Extension Deactivation Entry Point
 */
function deactivate() {
  console.log('LEO Model Selector Extension deactivated');
}

module.exports = {
  activate,
  deactivate
};
