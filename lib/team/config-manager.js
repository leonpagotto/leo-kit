/**
 * LionPack Configuration Manager
 * Handles team setup, mode selection, and adaptive workflow configuration
 */

const fs = require('fs-extra');
const path = require('path');
const { WorkflowMode } = require('./workflow-modes');
const { RoleManager } = require('./roles');

/**
 * Configuration Manager
 * Manages .lionpack.json and adaptive workflow setup
 */
class ConfigurationManager {
  constructor(projectPath = '.') {
    this.projectPath = projectPath;
    this.configPath = path.join(projectPath, '.lionpack.json');
    this.config = null;
  }

  /**
   * Initialize new LionPack configuration
   */
  async initialize(options = {}) {
    const {
      name = 'My Project',
      org = 'my-org',
      repo = 'my-repo',
      teamSize = 1,
      members = []
    } = options;

    if (teamSize < 1 || teamSize > 4) {
      throw new Error('Team size must be 1-4');
    }

    // Trim members to match team size if more provided
    let validMembers = members;
    if (members.length > teamSize) {
      validMembers = members.slice(0, teamSize);
    } else if (members.length < teamSize) {
      throw new Error(
        `Expected ${teamSize} members, got ${members.length}`
      );
    }

    // Validate each member has a role
    validMembers.forEach(member => {
      if (!member.username || !member.role) {
        throw new Error('Each member must have username and role');
      }

      const role = RoleManager.getRole(member.role);
      if (!role) {
        throw new Error(`Invalid role: ${member.role}`);
      }
    });

    const config = {
      version: '1.0.0',
      name,
      org,
      repo,
      mode: teamSize === 1 ? WorkflowMode.MODES.SOLO : WorkflowMode.MODES.TEAM,
      teamSize,
      members: validMembers,
      workflow: {
        teamSize,
        columns: WorkflowMode.getColumns(teamSize),
        sequence: WorkflowMode.getColumnSequence(teamSize),
        memberMapping: WorkflowMode.mapMembersToColumns(teamSize, validMembers)
      },
      github: {
        projectId: null,
        projectNumber: null,
        columnMapping: {},
        labelsCreated: false
      },
      settings: {
        autoHandoff: true,
        autoLabel: true,
        notifyOnHandoff: true,
        trackMetrics: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.config = config;
    await this.save();

    return config;
  }

  /**
   * Load existing configuration
   */
  async load() {
    try {
      const data = await fs.readJson(this.configPath);
      this.config = data;
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Save configuration
   */
  async save() {
    if (!this.config) {
      throw new Error('No configuration to save');
    }

    this.config.updatedAt = new Date().toISOString();
    await fs.ensureDir(path.dirname(this.configPath));
    await fs.writeJson(this.configPath, this.config, { spaces: 2 });
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Add team member
   */
  async addMember(username, role) {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    // Check team size limit
    if (this.config.members.length >= 4) {
      throw new Error('Maximum team size is 4');
    }

    // Validate role
    const roleObj = RoleManager.getRole(role);
    if (!roleObj) {
      throw new Error(`Invalid role: ${role}`);
    }

    // Check for duplicate
    if (this.config.members.find(m => m.username === username)) {
      throw new Error(`Member ${username} already exists`);
    }

    // Check for duplicate role
    if (this.config.members.find(m => m.role === role)) {
      throw new Error(`Role ${role} already assigned to ${username}`);
    }

    this.config.members.push({ username, role });
    this.config.teamSize = this.config.members.length;

    // Update workflow for new team size
    const newTeamSize = this.config.teamSize;
    this.config.workflow = {
      teamSize: newTeamSize,
      columns: WorkflowMode.getColumns(newTeamSize),
      sequence: WorkflowMode.getColumnSequence(newTeamSize),
      memberMapping: WorkflowMode.mapMembersToColumns(
        newTeamSize,
        this.config.members
      )
    };

    this.config.mode = newTeamSize === 1
      ? WorkflowMode.MODES.SOLO
      : WorkflowMode.MODES.TEAM;

    await this.save();

    return this.config.members;
  }

  /**
   * Remove team member
   */
  async removeMember(username) {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.');
    }

    const index = this.config.members.findIndex(m => m.username === username);
    if (index === -1) {
      throw new Error(`Member not found: ${username}`);
    }

    this.config.members.splice(index, 1);
    this.config.teamSize = this.config.members.length;

    // Update workflow for new team size
    if (this.config.members.length > 0) {
      const newTeamSize = this.config.teamSize;
      this.config.workflow = {
        teamSize: newTeamSize,
        columns: WorkflowMode.getColumns(newTeamSize),
        sequence: WorkflowMode.getColumnSequence(newTeamSize),
        memberMapping: WorkflowMode.mapMembersToColumns(
          newTeamSize,
          this.config.members
        )
      };

      this.config.mode = newTeamSize === 1
        ? WorkflowMode.MODES.SOLO
        : WorkflowMode.MODES.TEAM;
    }

    await this.save();

    return this.config.members;
  }

  /**
   * Get member by role
   */
  getMemberByRole(role) {
    if (!this.config) {
      return undefined;
    }

    return this.config.members.find(m => m.role === role);
  }

  /**
   * Get all members
   */
  getMembers() {
    if (!this.config) {
      return [];
    }

    return this.config.members;
  }

  /**
   * Get column for a role
   */
  getColumnForRole(role) {
    if (!this.config) {
      return null;
    }

    const columns = this.config.workflow.columns;
    return columns.find(col => {
      if (!col.roles) return false;
      const roles = Array.isArray(col.roles) ? col.roles : [col.roles];
      return roles.includes(role);
    });
  }

  /**
   * Get next column in workflow
   */
  getNextColumn(currentColumnId) {
    if (!this.config) {
      return null;
    }

    return WorkflowMode.getNextColumn(this.config.teamSize, currentColumnId);
  }

  /**
   * Get workflow recommendations
   */
  getRecommendations() {
    if (!this.config) {
      return null;
    }

    return WorkflowMode.getRecommendations(this.config.teamSize);
  }

  /**
   * Update GitHub configuration
   */
  async setGitHubProjectInfo(projectNumber, projectId, columnMapping) {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    this.config.github = {
      projectNumber,
      projectId,
      columnMapping,
      labelsCreated: this.config.github.labelsCreated
    };

    await this.save();
  }

  /**
   * Mark labels as created
   */
  async markLabelsCreated() {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    this.config.github.labelsCreated = true;
    await this.save();
  }

  /**
   * Get current mode summary
   */
  getSummary() {
    if (!this.config) {
      return null;
    }

    return {
      name: this.config.name,
      mode: this.config.mode,
      teamSize: this.config.teamSize,
      members: this.config.members,
      columns: this.config.workflow.columns.length,
      sequence: this.config.workflow.sequence,
      memberMapping: this.config.workflow.memberMapping
    };
  }
}

module.exports = {
  ConfigurationManager
};
