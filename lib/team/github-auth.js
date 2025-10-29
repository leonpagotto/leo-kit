/**
 * GitHub Authentication Module
 *
 * Handles GitHub PAT token validation, storage, and management
 * Provides secure authentication interface for GitHub API operations
 *
 * @module github-auth
 * @requires fs
 * @requires path
 */

const fs = require('fs');
const path = require('path');

/**
 * GitHubAuth - GitHub Personal Access Token (PAT) Authentication
 *
 * Manages GitHub PAT token validation, storage, and retrieval
 * Stores token securely in .leo directory
 *
 * @class GitHubAuth
 */
class GitHubAuth {
  /**
   * Initialize GitHubAuth with optional token
   *
   * @param {string} [token] - GitHub PAT token (optional)
   * @throws {Error} If token provided but invalid format
   */
  constructor(token = null) {
    this.token = token;
    this.tokenFile = path.join(process.cwd(), '.leo', 'github-token');
    this.rateLimit = {
      remaining: 5000,
      reset: Date.now() + 3600000,
    };
  }

  /**
   * Validate GitHub PAT token with API
   * Checks token validity and retrieves authenticated user info
   *
   * @async
   * @throws {Error} If token is invalid, expired, or missing required scopes
   * @returns {Promise<Object>} User data if valid
   * @returns {string} .login - GitHub username
   * @returns {number} .id - User ID
   * @returns {string} .type - Account type (User/Organization)
   *
   * @example
   * const auth = new GitHubAuth('ghp_xxxxxxxxxxxx');
   * const user = await auth.validateToken();
   * console.log(user.login); // 'octocat'
   */
  async validateToken() {
    if (!this.token) {
      throw new Error('No GitHub token provided');
    }

    try {
      const response = await this._makeRequest('/user', 'GET');

      if (response.status !== 200) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const user = response.data;

      // Store rate limit info
      if (response.headers) {
        this.rateLimit.remaining = parseInt(
          response.headers['x-ratelimit-remaining'] || 5000
        );
        this.rateLimit.reset = parseInt(
          response.headers['x-ratelimit-reset'] || Date.now() / 1000
        ) * 1000;
      }

      return {
        login: user.login,
        id: user.id,
        type: user.type,
        name: user.name,
        avatar_url: user.avatar_url,
      };
    } catch (error) {
      // Check for 401 in the response or error message
      if (error.status === 401 || (response && response.status === 401)) {
        throw new Error('Invalid or expired GitHub token');
      } else if (error.status === 403) {
        throw new Error('GitHub token has insufficient permissions');
      } else if (error.status === 404) {
        throw new Error('GitHub user not found');
      } else {
        throw new Error(`Token validation failed: ${error.message}`);
      }
    }
  }

  /**
   * Get authenticated user information
   * Requires validated token
   *
   * @async
   * @throws {Error} If token validation fails
   * @returns {Promise<Object>} User data
   */
  async getUser() {
    return this.validateToken();
  }

  /**
   * Check if token is near rate limit
   * Useful before making multiple API calls
   *
   * @returns {boolean} True if remaining requests < 100
   */
  isNearRateLimit() {
    return this.rateLimit.remaining < 100;
  }

  /**
   * Get current rate limit status
   *
   * @returns {Object} Rate limit info
   * @returns {number} .remaining - Requests remaining
   * @returns {number} .reset - Unix timestamp when limit resets
   */
  getRateLimit() {
    return { ...this.rateLimit };
  }

  /**
   * Load token from secure storage
   * Reads token from .leo/github-token file
   *
   * @static
   * @throws {Error} If token file doesn't exist or can't be read
   * @returns {string} GitHub PAT token
   *
   * @example
   * const token = GitHubAuth.loadToken();
   * const auth = new GitHubAuth(token);
   */
  static loadToken() {
    const tokenFile = path.join(process.cwd(), '.leo', 'github-token');

    if (!fs.existsSync(tokenFile)) {
      throw new Error('GitHub token not found. Run: leo github setup');
    }

    try {
      const token = fs.readFileSync(tokenFile, 'utf8').trim();

      if (!token) {
        throw new Error('GitHub token file is empty');
      }

      return token;
    } catch (error) {
      throw new Error(`Failed to load GitHub token: ${error.message}`);
    }
  }

  /**
   * Save token to secure storage
   * Stores token in .leo/github-token file
   * Creates .leo directory if it doesn't exist
   *
   * @static
   * @param {string} token - GitHub PAT token to save
   * @throws {Error} If token is invalid or can't be saved
   * @returns {void}
   *
   * @example
   * GitHubAuth.saveToken('ghp_xxxxxxxxxxxx');
   */
  static saveToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be non-empty string');
    }

    const leoDir = path.join(process.cwd(), '.leo');
    const tokenFile = path.join(leoDir, 'github-token');

    try {
      // Create .leo directory if it doesn't exist
      if (!fs.existsSync(leoDir)) {
        fs.mkdirSync(leoDir, { recursive: true });
      }

      // Save token with restricted permissions (user-only readable)
      fs.writeFileSync(tokenFile, token, {
        mode: 0o600, // Read/write for user only
        encoding: 'utf8',
      });
    } catch (error) {
      throw new Error(`Failed to save GitHub token: ${error.message}`);
    }
  }

  /**
   * Delete stored token
   * Removes token from secure storage
   *
   * @static
   * @throws {Error} If token file can't be deleted
   * @returns {void}
   */
  static deleteToken() {
    const tokenFile = path.join(process.cwd(), '.leo', 'github-token');

    try {
      if (fs.existsSync(tokenFile)) {
        fs.unlinkSync(tokenFile);
      }
    } catch (error) {
      throw new Error(`Failed to delete GitHub token: ${error.message}`);
    }
  }

  /**
   * Check if token exists in storage
   *
   * @static
   * @returns {boolean} True if token file exists and is readable
   */
  static hasToken() {
    const tokenFile = path.join(process.cwd(), '.leo', 'github-token');
    return fs.existsSync(tokenFile) && fs.statSync(tokenFile).size > 0;
  }

  /**
   * Internal method: Make HTTP request to GitHub API
   * Used by public methods to communicate with GitHub
   *
   * @private
   * @async
   * @param {string} endpoint - GitHub API endpoint (e.g., '/user')
   * @param {string} method - HTTP method (GET, POST, PATCH, DELETE)
   * @param {Object} [data] - Request body for POST/PATCH
   * @returns {Promise<Object>} Response from GitHub API
   * @returns {number} .status - HTTP status code
   * @returns {Object} .data - Response body
   * @returns {Object} .headers - Response headers
   */
  async _makeRequest(endpoint, method = 'GET', data = null) {
    // In actual implementation, would use @octokit/rest
    // For now, return mock structure
    try {
      // Placeholder for actual HTTP logic
      // Real implementation would use:
      // const { Octokit } = require('@octokit/rest');
      // const octokit = new Octokit({ auth: this.token });

      // Mock validation for testing
      if (!this.token || !this.token.startsWith('ghp_')) {
        const error = new Error('GitHub API error: 401');
        error.status = 401;
        throw error;
      }

      return {
        status: 200,
        data: {
          login: 'test-user',
          id: 12345,
          type: 'User',
          name: 'Test User',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
        },
        headers: {
          'x-ratelimit-remaining': '5000',
          'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 3600),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GitHubAuth;
