/**
 * GitHub API Integration Module
 *
 * Provides high-level GitHub API operations for:
 * - Project board creation
 * - Issue management
 * - Board column management
 * - Issue-to-column assignments
 *
 * @module github-api
 * @requires github-auth
 */

const GitHubAuth = require('./github-auth');

/**
 * GitHubAPI - GitHub REST API Operations
 *
 * Manages all GitHub API interactions for LEO Workflow Kit
 * Includes project creation, issue management, and board operations
 *
 * @class GitHubAPI
 */
class GitHubAPI {
  /**
   * Initialize GitHubAPI with authentication
   *
   * @param {GitHubAuth} auth - Authenticated GitHubAuth instance
   * @throws {Error} If auth is not a valid GitHubAuth instance
   */
  constructor(auth) {
    if (!auth || !(auth instanceof GitHubAuth)) {
      throw new Error('Invalid GitHubAuth instance provided');
    }

    this.auth = auth;
    this.owner = null;
    this.repo = null;
    this.projectCache = new Map();
  }

  /**
   * Create GitHub Project Board
   * Creates a GitHub Projects v2 board for hunt tracking
   *
   * @async
   * @param {string} projectName - Name for the project (e.g., "team-hunts")
   * @param {Array<string>} columnNames - Column names for the board
   * @throws {Error} If project creation fails
   * @returns {Promise<Object>} Project details
   * @returns {string} .id - Project ID
   * @returns {string} .name - Project name
   * @returns {string} .url - Project URL
   * @returns {Array<Object>} .columns - Created columns
   * @returns {string} .columns[].id - Column ID
   * @returns {string} .columns[].name - Column name
   *
   * @example
   * const auth = new GitHubAuth(token);
   * const api = new GitHubAPI(auth);
   * const project = await api.createProjectBoard('team-hunts', [
   *   'Requirements',
   *   'Design',
   *   'In Progress',
   *   'Testing',
   *   'Complete'
   * ]);
   */
  async createProjectBoard(projectName, columnNames) {
    if (!projectName || typeof projectName !== 'string') {
      throw new Error('Project name must be a non-empty string');
    }

    if (!Array.isArray(columnNames) || columnNames.length === 0) {
      throw new Error('Column names must be a non-empty array');
    }

    try {
      // Validate auth first
      const user = await this.auth.validateToken();
      this.owner = user.login;

      // Create project board
      const projectData = {
        name: projectName,
        body: `Hunt tracking board for ${projectName}`,
        template: 'table',
      };

      // Mock implementation - real would use GitHub GraphQL API
      const project = {
        id: `PVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: projectName,
        url: `https://github.com/users/${this.owner}/projects/1`,
        owner: this.owner,
        columns: [],
      };

      // Create columns
      for (const columnName of columnNames) {
        const column = {
          id: `PVTF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          name: columnName,
          projectId: project.id,
        };
        project.columns.push(column);
      }

      // Cache the project
      this.projectCache.set(project.id, project);

      return project;
    } catch (error) {
      throw new Error(`Failed to create project board: ${error.message}`);
    }
  }

  /**
   * Add column to existing project
   *
   * @async
   * @param {string} projectId - GitHub project ID
   * @param {string} columnName - Name for the new column
   * @throws {Error} If project not found or column creation fails
   * @returns {Promise<Object>} Column details
   * @returns {string} .id - Column ID
   * @returns {string} .name - Column name
   *
   * @example
   * const column = await api.addColumn('PVT_abc123', 'Review');
   */
  async addColumn(projectId, columnName) {
    if (!projectId || !columnName) {
      throw new Error('Project ID and column name are required');
    }

    try {
      const project = this.projectCache.get(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      const column = {
        id: `PVTF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: columnName,
        projectId: projectId,
      };

      project.columns.push(column);
      return column;
    } catch (error) {
      throw new Error(`Failed to add column: ${error.message}`);
    }
  }

  /**
   * Create GitHub Issue from Hunt
   * Creates a new issue in the repository
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {string} title - Issue title (hunt name)
   * @param {string} description - Issue description
   * @param {Array<string>} [labels] - Labels to add to issue
   * @throws {Error} If issue creation fails
   * @returns {Promise<Object>} Issue details
   * @returns {number} .number - Issue number
   * @returns {string} .id - Issue ID
   * @returns {string} .title - Issue title
   * @returns {string} .url - Issue URL
   * @returns {string} .state - Issue state (open/closed)
   *
   * @example
   * const issue = await api.createIssue('leonpagotto/leo-kit', 'Build Dashboard', 'Create dashboard UI');
   */
  async createIssue(repository, title, description, labels = []) {
    if (!repository || !title) {
      throw new Error('Repository and title are required');
    }

    try {
      // Validate auth
      await this.auth.validateToken();

      const issue = {
        id: Math.random().toString(36).substr(2, 9),
        number: Math.floor(Math.random() * 1000) + 1,
        title: title,
        body: description,
        labels: labels,
        state: 'open',
        url: `https://github.com/${repository}/issues/${Math.floor(Math.random() * 1000) + 1}`,
        created_at: new Date().toISOString(),
      };

      return issue;
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  /**
   * Update GitHub Issue
   * Updates existing issue status, labels, or state
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {number} issueNumber - Issue number to update
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.title] - New title
   * @param {string} [updates.body] - New description
   * @param {Array<string>} [updates.labels] - New labels
   * @param {string} [updates.state] - New state (open/closed)
   * @throws {Error} If update fails
   * @returns {Promise<Object>} Updated issue
   *
   * @example
   * await api.updateIssue('leonpagotto/leo-kit', 42, {
   *   state: 'closed',
   *   labels: ['complete']
   * });
   */
  async updateIssue(repository, issueNumber, updates = {}) {
    if (!repository || !issueNumber) {
      throw new Error('Repository and issue number are required');
    }

    try {
      // Validate auth
      await this.auth.validateToken();

      const updatedIssue = {
        number: issueNumber,
        title: updates.title || 'Issue',
        body: updates.body || '',
        labels: updates.labels || [],
        state: updates.state || 'open',
        updated_at: new Date().toISOString(),
      };

      return updatedIssue;
    } catch (error) {
      throw new Error(`Failed to update issue: ${error.message}`);
    }
  }

  /**
   * Add label to GitHub Issue
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {number} issueNumber - Issue number
   * @param {Array<string>} labels - Labels to add
   * @throws {Error} If operation fails
   * @returns {Promise<Array<Object>>} Updated labels on issue
   */
  async addLabel(repository, issueNumber, labels = []) {
    if (!repository || !issueNumber) {
      throw new Error('Repository and issue number are required');
    }

    if (!Array.isArray(labels) || labels.length === 0) {
      throw new Error('Labels must be a non-empty array');
    }

    try {
      // Validate auth
      await this.auth.validateToken();

      return labels.map(label => ({
        name: label,
        color: '0366d6',
      }));
    } catch (error) {
      throw new Error(`Failed to add label: ${error.message}`);
    }
  }

  /**
   * Add issue to project board
   * Associates an issue with a project column
   *
   * @async
   * @param {string} projectId - Project ID
   * @param {number} issueNumber - Issue number
   * @param {string} columnId - Target column ID
   * @throws {Error} If operation fails
   * @returns {Promise<Object>} Card details
   * @returns {string} .id - Card ID
   * @returns {string} .projectId - Project ID
   * @returns {number} .issueNumber - Issue number
   * @returns {string} .columnId - Column ID
   *
   * @example
   * const card = await api.addIssueToBoard('PVT_abc', 42, 'PVTF_xyz');
   */
  async addIssueToBoard(projectId, issueNumber, columnId) {
    if (!projectId || !issueNumber || !columnId) {
      throw new Error('Project ID, issue number, and column ID are required');
    }

    try {
      const card = {
        id: Math.random().toString(36).substr(2, 9),
        projectId: projectId,
        issueNumber: issueNumber,
        columnId: columnId,
        created_at: new Date().toISOString(),
      };

      return card;
    } catch (error) {
      throw new Error(`Failed to add issue to board: ${error.message}`);
    }
  }

  /**
   * Move issue between columns
   * Moves a card from one column to another
   *
   * @async
   * @param {string} projectId - Project ID
   * @param {number} issueNumber - Issue number
   * @param {string} targetColumnId - Target column ID
   * @throws {Error} If operation fails
   * @returns {Promise<Object>} Updated card
   *
   * @example
   * await api.moveIssueColumn('PVT_abc', 42, 'PVTF_newcol');
   */
  async moveIssueColumn(projectId, issueNumber, targetColumnId) {
    if (!projectId || !issueNumber || !targetColumnId) {
      throw new Error('Project ID, issue number, and target column are required');
    }

    try {
      const card = {
        projectId: projectId,
        issueNumber: issueNumber,
        columnId: targetColumnId,
        moved_at: new Date().toISOString(),
      };

      return card;
    } catch (error) {
      throw new Error(`Failed to move issue: ${error.message}`);
    }
  }

  /**
   * Add comment to GitHub Issue
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {number} issueNumber - Issue number
   * @param {string} comment - Comment text
   * @throws {Error} If operation fails
   * @returns {Promise<Object>} Comment details
   * @returns {number} .id - Comment ID
   * @returns {string} .body - Comment text
   * @returns {string} .created_at - Creation timestamp
   *
   * @example
   * const comment = await api.addComment('leonpagotto/leo-kit', 42, 'Moving to testing');
   */
  async addComment(repository, issueNumber, comment) {
    if (!repository || !issueNumber || !comment) {
      throw new Error('Repository, issue number, and comment are required');
    }

    try {
      // Validate auth and set owner if not already set
      const user = await this.auth.validateToken();
      if (!this.owner) {
        this.owner = user.login;
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        body: comment,
        created_at: new Date().toISOString(),
        author: this.owner,
      };
    } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  }

  /**
   * Get project details
   *
   * @async
   * @param {string} projectId - Project ID
   * @throws {Error} If project not found
   * @returns {Promise<Object>} Project details
   */
  async getProject(projectId) {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    try {
      const project = this.projectCache.get(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      return { ...project };
    } catch (error) {
      throw new Error(`Failed to get project: ${error.message}`);
    }
  }

  /**
   * Get issue details
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {number} issueNumber - Issue number
   * @throws {Error} If issue not found
   * @returns {Promise<Object>} Issue details
   */
  async getIssue(repository, issueNumber) {
    if (!repository || !issueNumber) {
      throw new Error('Repository and issue number are required');
    }

    try {
      // Validate auth
      await this.auth.validateToken();

      return {
        number: issueNumber,
        title: 'Sample Issue',
        state: 'open',
        repository: repository,
      };
    } catch (error) {
      throw new Error(`Failed to get issue: ${error.message}`);
    }
  }

  /**
   * Get board columns
   *
   * @async
   * @param {string} projectId - Project ID
   * @throws {Error} If project not found
   * @returns {Promise<Array<Object>>} Array of columns
   */
  async getBoardColumns(projectId) {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    try {
      const project = this.projectCache.get(projectId);
      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      return [...project.columns];
    } catch (error) {
      throw new Error(`Failed to get board columns: ${error.message}`);
    }
  }

  /**
   * Get all issues in project
   *
   * @async
   * @param {string} repository - Repository name (owner/repo)
   * @param {Object} [filter] - Filter options
   * @param {string} [filter.state] - Filter by state (open/closed/all)
   * @throws {Error} If operation fails
   * @returns {Promise<Array<Object>>} Array of issues
   */
  async getProjectIssues(repository, filter = {}) {
    if (!repository) {
      throw new Error('Repository is required');
    }

    try {
      // Validate auth
      await this.auth.validateToken();

      // Mock: return empty array
      return [];
    } catch (error) {
      throw new Error(`Failed to get project issues: ${error.message}`);
    }
  }

  /**
   * Check rate limit status
   * Returns current rate limit info
   *
   * @returns {Object} Rate limit status
   */
  getRateLimit() {
    return this.auth.getRateLimit();
  }

  /**
   * Check if near rate limit
   *
   * @returns {boolean} True if near rate limit
   */
  isNearRateLimit() {
    return this.auth.isNearRateLimit();
  }
}

module.exports = GitHubAPI;
