/**
 * Slack Integration Module
 *
 * Manages real-time notifications and integration between LionPack hunts and Slack.
 * Handles:
 * - Hunt lifecycle notifications
 * - Phase transition alerts
 * - Completion notifications with metrics
 * - Message formatting with Slack Block Kit
 */

const SlackAuth = require('./slack-auth');

/**
 * SlackIntegration - Send notifications to Slack
 */
class SlackIntegration {
  /**
   * Constructor
   * @param {SlackAuth} auth - Slack authentication instance
   * @param {string} channelId - Channel ID for notifications
   */
  constructor(auth, channelId) {
    if (!(auth instanceof SlackAuth)) {
      throw new Error('SlackIntegration requires SlackAuth instance');
    }

    this.auth = auth;
    this.channelId = channelId;
    this.baseUrl = 'https://slack.com/api';
    this.defaultColor = '#2196F3'; // Blue
    this.successColor = '#4CAF50'; // Green
    this.warningColor = '#FF9800'; // Orange
    this.errorColor = '#F44336'; // Red
  }

  /**
   * Send hunt created notification
   * @param {Object} hunt - Hunt object
   * @returns {Promise<string>} Message timestamp
   */
  async notifyHuntCreated(hunt) {
    try {
      const text = `🎯 New Hunt Created: ${hunt.title}`;
      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: text
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${hunt.title}*\n${hunt.description || 'No description'}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Status:*\n${hunt.currentPhase || 'Not Started'}`
            },
            {
              type: 'mrkdwn',
              text: `*Owner:*\n${hunt.owner || 'Unassigned'}`
            },
            {
              type: 'mrkdwn',
              text: `*Created:*\n${new Date(hunt.createdAt || Date.now()).toLocaleDateString()}`
            },
            {
              type: 'mrkdwn',
              text: `*Priority:*\n${hunt.priority || 'Medium'}`
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: '🚀 Hunt started and ready for tracking'
            }
          ]
        }
      ];

      return await this._sendMessage(this.channelId, text, blocks);
    } catch (error) {
      throw new Error(`Failed to send hunt created notification: ${error.message}`);
    }
  }

  /**
   * Send phase transition notification
   * @param {Object} hunt - Hunt object
   * @param {string} fromPhase - Previous phase
   * @param {string} toPhase - New phase
   * @returns {Promise<string>} Message timestamp
   */
  async notifyPhaseTransition(hunt, fromPhase, toPhase) {
    try {
      const phaseEmoji = {
        'Discovery': '🔍',
        'Analysis': '📊',
        'Implementation': '⚙️',
        'Testing': '🧪',
        'Deployment': '🚀',
        'Completed': '✅'
      };

      const text = `${phaseEmoji[toPhase] || '📍'} ${hunt.title} moved to ${toPhase}`;
      const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Hunt Phase Update*\n${text}`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Hunt:*\n${hunt.title}`
            },
            {
              type: 'mrkdwn',
              text: `*Transition:*\n${fromPhase} → ${toPhase}`
            },
            {
              type: 'mrkdwn',
              text: `*Updated:*\n<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty}|${new Date().toLocaleDateString()}>`
            },
            {
              type: 'mrkdwn',
              text: `*Progress:*\n${this._calculateProgress(hunt)}`
            }
          ]
        }
      ];

      if (hunt.githubIssue?.number) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<https://github.com/search?q=${hunt.githubIssue.number}|📌 GitHub Issue #${hunt.githubIssue.number}>`
          }
        });
      }

      return await this._sendMessage(this.channelId, text, blocks);
    } catch (error) {
      throw new Error(`Failed to send phase notification: ${error.message}`);
    }
  }

  /**
   * Send hunt completion notification
   * @param {Object} hunt - Hunt object
   * @param {Object} metrics - Completion metrics
   * @returns {Promise<string>} Message timestamp
   */
  async notifyHuntCompleted(hunt, metrics = {}) {
    try {
      const text = `✅ Hunt Completed: ${hunt.title}`;

      // Calculate metrics
      const duration = metrics.duration || hunt.getTotalDuration?.() || 0;
      const phases = hunt.phases?.length || 0;
      const completionRate = metrics.completionRate || 100;

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: text
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎉 *${hunt.title}* has been successfully completed!`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Status:*\nCompleted`
            },
            {
              type: 'mrkdwn',
              text: `*Completion:*\n${completionRate}%`
            },
            {
              type: 'mrkdwn',
              text: `*Duration:*\n${duration} minutes`
            },
            {
              type: 'mrkdwn',
              text: `*Phases:*\n${phases} completed`
            },
            {
              type: 'mrkdwn',
              text: `*Completed:*\n<!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty}|${new Date().toLocaleDateString()}>`
            }
          ]
        }
      ];

      // Add metrics if provided
      if (Object.keys(metrics).length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Metrics:*\n' + Object.entries(metrics)
              .filter(([key]) => key !== 'duration' && key !== 'completionRate')
              .map(([key, value]) => `• ${key}: ${value}`)
              .join('\n')
          }
        });
      }

      blocks.push({
        type: 'divider'
      });

      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '🏆 Hunt successfully tracked and completed'
          }
        ]
      });

      return await this._sendMessage(this.channelId, text, blocks, this.successColor);
    } catch (error) {
      throw new Error(`Failed to send completion notification: ${error.message}`);
    }
  }

  /**
   * Send error notification
   * @param {string} title - Error title
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   * @returns {Promise<string>} Message timestamp
   */
  async notifyError(title, message, details = {}) {
    try {
      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `⚠️ ${title}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:* ${message}`
          }
        }
      ];

      if (Object.keys(details).length > 0) {
        const detailsText = Object.entries(details)
          .map(([key, value]) => `• ${key}: ${value}`)
          .join('\n');

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Details:*\n${detailsText}`
          }
        });
      }

      return await this._sendMessage(this.channelId, title, blocks, this.errorColor);
    } catch (error) {
      throw new Error(`Failed to send error notification: ${error.message}`);
    }
  }

  /**
   * Send daily summary notification
   * @param {Array} hunts - Active hunts
   * @param {Object} stats - Summary statistics
   * @returns {Promise<string>} Message timestamp
   */
  async sendDailySummary(hunts = [], stats = {}) {
    try {
      const text = `📈 Daily Hunt Summary`;

      const blocks = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: text
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Active Hunts:*\n${hunts.length}`
            },
            {
              type: 'mrkdwn',
              text: `*Completed Today:*\n${stats.completedToday || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Avg Duration:*\n${stats.avgDuration || 0} min`
            },
            {
              type: 'mrkdwn',
              text: `*Success Rate:*\n${stats.successRate || 0}%`
            }
          ]
        }
      ];

      if (hunts.length > 0) {
        const huntList = hunts
          .slice(0, 5)
          .map(h => `• *${h.title}* - ${h.currentPhase || 'Not Started'}`)
          .join('\n');

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Current Hunts:*\n${huntList}${hunts.length > 5 ? `\n... and ${hunts.length - 5} more` : ''}`
          }
        });
      }

      blocks.push({
        type: 'divider'
      });

      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📊 Summary generated at ${new Date().toLocaleTimeString()}`
          }
        ]
      });

      return await this._sendMessage(this.channelId, text, blocks);
    } catch (error) {
      throw new Error(`Failed to send daily summary: ${error.message}`);
    }
  }

  // ============ Private Methods ============

  /**
   * Send message to Slack channel
   * @private
   */
  async _sendMessage(channelId, text, blocks = [], color = null) {
    try {
      const payload = {
        channel: channelId,
        text: text,
        blocks: blocks
      };

      const response = await fetch(`${this.baseUrl}/chat.postMessage`, {
        method: 'POST',
        headers: this.auth.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data.ts;
    } catch (error) {
      throw new Error(`Message send failed: ${error.message}`);
    }
  }

  /**
   * Calculate hunt progress percentage
   * @private
   */
  _calculateProgress(hunt) {
    if (!hunt.phases || hunt.phases.length === 0) return '0%';

    const completedPhases = hunt.phases.filter(p => p.completed).length;
    const totalPhases = hunt.phases.length;
    const percentage = Math.round((completedPhases / totalPhases) * 100);

    return `${percentage}%`;
  }

  /**
   * Format duration in human-readable format
   * @private
   */
  _formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${mins}m`;
  }

  /**
   * Update existing message
   * @private
   */
  async _updateMessage(channelId, ts, text, blocks = []) {
    try {
      const payload = {
        channel: channelId,
        ts: ts,
        text: text,
        blocks: blocks
      };

      const response = await fetch(`${this.baseUrl}/chat.update`, {
        method: 'POST',
        headers: this.auth.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Failed to update message');
      }

      return data.ts;
    } catch (error) {
      throw new Error(`Message update failed: ${error.message}`);
    }
  }

  /**
   * Delete message from Slack
   * @private
   */
  async _deleteMessage(channelId, ts) {
    try {
      const response = await fetch(`${this.baseUrl}/chat.delete`, {
        method: 'POST',
        headers: this.auth.headers,
        body: JSON.stringify({
          channel: channelId,
          ts: ts
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Failed to delete message');
      }

      return true;
    } catch (error) {
      throw new Error(`Message delete failed: ${error.message}`);
    }
  }

  // ============ Static Utility Methods ============

  /**
   * Create Block Kit message
   * @static
   */
  static createMessage(title, fields = {}, color = '#2196F3') {
    const blocks = [];

    if (title) {
      blocks.push({
        type: 'header',
        text: {
          type: 'plain_text',
          text: title
        }
      });
    }

    if (Object.keys(fields).length > 0) {
      const fieldBlocks = Object.entries(fields).map(([key, value]) => ({
        type: 'mrkdwn',
        text: `*${key}:*\n${value}`
      }));

      blocks.push({
        type: 'section',
        fields: fieldBlocks
      });
    }

    return blocks;
  }

  /**
   * Create action buttons
   * @static
   */
  static createActions(actions = []) {
    return {
      type: 'actions',
      elements: actions.map(action => ({
        type: 'button',
        text: {
          type: 'plain_text',
          text: action.label
        },
        value: action.value,
        action_id: action.id || action.label.toLowerCase().replace(/ /g, '_')
      }))
    };
  }
}

module.exports = SlackIntegration;
