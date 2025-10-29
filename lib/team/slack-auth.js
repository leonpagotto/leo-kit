/**
 * Slack Authentication Module
 *
 * Manages Slack OAuth and token handling for LEO Workflow Kit hunt integration.
 * Handles:
 * - Slack OAuth authentication
 * - Token validation and refresh
 * - Secure token storage
 * - Bot and user token management
 */

const fs = require('fs');
const path = require('path');

/**
 * SlackAuth - Handle Slack authentication and token management
 */
class SlackAuth {
  /**
   * Constructor
   * @param {string} token - Slack bot token
   */
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://slack.com/api';
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    this.tokenCache = null;
    this.workspaceCache = null;
  }

  /**
   * Validate Slack token against Slack API
   * @returns {Promise<Object>} User and workspace info
   * @throws {Error} If token is invalid
   */
  async validateToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth.test`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid token (401)');
        } else if (response.status === 403) {
          throw new Error('Insufficient permissions (403)');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      this.tokenCache = {
        user_id: data.user_id,
        team_id: data.team_id,
        team_name: data.team_name,
        url: data.url
      };

      return this.tokenCache;
    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Get authenticated user information
   * @returns {Promise<Object>} User details
   * @throws {Error} If request fails
   */
  async getUser() {
    try {
      const response = await fetch(`${this.baseUrl}/users.identity`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      return {
        user_id: data.user.id,
        user_name: data.user.name,
        team_id: data.team.id,
        team_name: data.team.name
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  /**
   * Get workspace information
   * @returns {Promise<Object>} Workspace details
   * @throws {Error} If request fails
   */
  async getWorkspaceInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/team.info`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      this.workspaceCache = {
        team_id: data.team.id,
        team_name: data.team.name,
        team_domain: data.team.domain,
        team_url: data.team.url
      };

      return this.workspaceCache;
    } catch (error) {
      throw new Error(`Failed to get workspace info: ${error.message}`);
    }
  }

  /**
   * Check if approaching rate limit (200 or fewer remaining)
   * @returns {boolean} True if near limit
   */
  isNearRateLimit() {
    if (!this.rateLimit) return false;
    return this.rateLimit.remaining <= 200;
  }

  /**
   * Get current rate limit status
   * @returns {Object} Rate limit info { remaining, limit, reset }
   */
  getRateLimit() {
    return this.rateLimit || { remaining: 600, limit: 600, reset: 0 };
  }

  /**
   * Update rate limit from response headers
   * @private
   */
  _updateRateLimit(headers) {
    const remaining = parseInt(headers.get('x-rate-limit-remaining') || 600);
    const limit = parseInt(headers.get('x-rate-limit-limit') || 600);
    const reset = parseInt(headers.get('x-rate-limit-reset') || 0);

    this.rateLimit = { remaining, limit, reset };
  }

  /**
   * Make authenticated API request
   * @private
   */
  async _makeRequest(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'GET',
      ...options,
      headers: this.headers
    });

    this._updateRateLimit(response.headers);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid token (401)');
      } else if (response.status === 403) {
        throw new Error('Insufficient permissions (403)');
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'API error');
    }

    return data;
  }

  // ============ Static Methods ============

  /**
   * Check if Slack token exists locally
   * @static
   * @returns {boolean} True if token file exists
   */
  static hasToken() {
    try {
      const tokenPath = path.join('.leo', 'slack-token');
      return fs.existsSync(tokenPath);
    } catch {
      return false;
    }
  }

  /**
   * Load Slack token from disk
   * @static
   * @returns {string} Saved token
   * @throws {Error} If token not found
   */
  static loadToken() {
    const tokenPath = path.join('.leo', 'slack-token');

    if (!fs.existsSync(tokenPath)) {
      throw new Error('No Slack token found. Run `leo team setupSlack` first.');
    }

    try {
      const token = fs.readFileSync(tokenPath, 'utf8').trim();
      if (!token) {
        throw new Error('Token file is empty');
      }
      return token;
    } catch (error) {
      throw new Error(`Failed to load token: ${error.message}`);
    }
  }

  /**
   * Save Slack token to disk securely
   * @static
   * @param {string} token - Slack bot token to save
   * @throws {Error} If save fails
   */
  static saveToken(token) {
    try {
      const leoDir = '.leo';

      // Create .leo directory if it doesn't exist
      if (!fs.existsSync(leoDir)) {
        fs.mkdirSync(leoDir, { recursive: true });
      }

      const tokenPath = path.join(leoDir, 'slack-token');

      // Save with restrictive permissions (user read/write only)
      fs.writeFileSync(tokenPath, token, {
        mode: 0o600,
        encoding: 'utf8'
      });
    } catch (error) {
      throw new Error(`Failed to save token: ${error.message}`);
    }
  }

  /**
   * Delete stored Slack token
   * @static
   * @throws {Error} If delete fails
   */
  static deleteToken() {
    try {
      const tokenPath = path.join('.leo', 'slack-token');

      if (fs.existsSync(tokenPath)) {
        fs.unlinkSync(tokenPath);
      }
    } catch (error) {
      throw new Error(`Failed to delete token: ${error.message}`);
    }
  }

  /**
   * Start Slack OAuth flow
   * @static
   * @returns {Object} OAuth config { client_id, redirect_uri, scopes }
   */
  static getOAuthConfig() {
    return {
      client_id: process.env.SLACK_CLIENT_ID || '',
      client_secret: process.env.SLACK_CLIENT_SECRET || '',
      redirect_uri: process.env.SLACK_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
      scopes: [
        'chat:write',
        'channels:read',
        'users:read',
        'team:read',
        'incoming-webhook'
      ]
    };
  }

  /**
   * Handle OAuth callback with auth code
   * @static
   * @param {string} code - OAuth authorization code from Slack
   * @returns {Promise<string>} Bot token
   * @throws {Error} If exchange fails
   */
  static async handleOAuthCallback(code) {
    try {
      const config = SlackAuth.getOAuthConfig();

      const response = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: config.client_id,
          client_secret: config.client_secret,
          code: code,
          redirect_uri: config.redirect_uri
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.error || 'OAuth failed');
      }

      // Validate required scopes
      const grantedScopes = data.scope ? data.scope.split(',') : [];
      const requiredScopes = ['chat:write', 'channels:read', 'users:read', 'team:read'];

      const hasAllScopes = requiredScopes.every(scope =>
        grantedScopes.includes(scope)
      );

      if (!hasAllScopes) {
        throw new Error('Missing required Slack scopes');
      }

      return {
        bot_token: data.bot_user_id ? data.xoxb_token : data.access_token,
        team_id: data.team.id,
        team_name: data.team.name,
        user_id: data.authed_user.id
      };
    } catch (error) {
      throw new Error(`OAuth callback failed: ${error.message}`);
    }
  }
}

module.exports = SlackAuth;
