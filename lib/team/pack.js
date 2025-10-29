/**
 * LEO Workflow Kit TeamPack Manager
 * Manages team structure, members, and configuration
 */

const fs = require('fs-extra');
const path = require('path');
const { RoleManager } = require('./roles');

/**
 * TeamPack Configuration Schema
 */
class TeamPackConfig {
  constructor(packName, organization, repository) {
    this.version = '1.0';
    this.packName = packName;
    this.organization = organization;
    this.repository = repository;

    this.members = [];
    this.roles = {};

    this.config = {
      autoHandoff: true,
      notifyRole: true,
      trackAnalytics: true,
      huntCycleDays: 7,
      defaultLabels: ['pack-hunt', 'spec-driven']
    };

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add member to pack
   */
  addMember(username, role) {
    RoleManager.validateRole(role);

    const member = {
      id: this.members.length + 1,
      username,
      role,
      joinedAt: new Date().toISOString(),
      assignedIssues: 0,
      completedHunts: 0
    };

    this.members.push(member);
    this.roles[role] = username;
    this.updatedAt = new Date().toISOString();

    return member;
  }

  /**
   * Get member by role
   */
  getMemberByRole(role) {
    return this.members.find(m => m.role === role);
  }

  /**
   * Get member by username
   */
  getMemberByUsername(username) {
    return this.members.find(m => m.username === username);
  }

  /**
   * Remove member
   */
  removeMember(username) {
    const index = this.members.findIndex(m => m.username === username);
    if (index < 0) {
      throw new Error(`Member not found: ${username}`);
    }

    const member = this.members[index];
    this.members.splice(index, 1);

    if (this.roles[member.role] === username) {
      delete this.roles[member.role];
    }

    this.updatedAt = new Date().toISOString();
    return member;
  }

  /**
   * Assign member to role
   */
  assignRole(username, newRole) {
    const member = this.getMemberByUsername(username);
    if (!member) {
      throw new Error(`Member not found: ${username}`);
    }

    RoleManager.validateRole(newRole);

    const oldRole = member.role;
    member.role = newRole;

    if (this.roles[oldRole] === username) {
      delete this.roles[oldRole];
    }

    this.roles[newRole] = username;
    this.updatedAt = new Date().toISOString();

    return member;
  }

  /**
   * Serialize to .leo.json
   */
  toJSON() {
    return {
      version: this.version,
      packName: this.packName,
      organization: this.organization,
      repository: this.repository,
      members: this.members,
      roles: this.roles,
      config: this.config,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Deserialize from .leo.json
   */
  static fromJSON(data) {
    const pack = new TeamPackConfig(
      data.packName,
      data.organization,
      data.repository
    );

    pack.version = data.version;
    pack.members = data.members || [];
    pack.roles = data.roles || {};
    pack.config = { ...pack.config, ...data.config };
    pack.createdAt = data.createdAt;
    pack.updatedAt = data.updatedAt;

    return pack;
  }
}

/**
 * TeamPack Manager
 * Handles team lifecycle and configuration
 */
class TeamPack {
  /**
   * Initialize new team pack
   */
  constructor(config) {
    this.config = config;
    this.packName = config.packName;
    this.organization = config.organization;
    this.repository = config.repository;
  }

  /**
   * Load pack from .leo.json
   */
  static async load(projectPath = '.') {
    const configPath = path.join(projectPath, '.leo.json');

    try {
      const data = await fs.readJson(configPath);
      const config = TeamPackConfig.fromJSON(data);
      return new TeamPack(config);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(
          'Pack not initialized. Run "leo team init" first.'
        );
      }
      throw error;
    }
  }

  /**
   * Create and save new pack
   */
  static async create(packName, organization, repository, projectPath = '.') {
    const config = new TeamPackConfig(packName, organization, repository);
    const pack = new TeamPack(config);

    await pack.save(projectPath);
    return pack;
  }

  /**
   * Save pack configuration
   */
  async save(projectPath = '.') {
    const configPath = path.join(projectPath, '.leo.json');
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJson(configPath, this.config.toJSON(), { spaces: 2 });
  }

  /**
   * Add team member
   */
  addMember(username, role) {
    return this.config.addMember(username, role);
  }

  /**
   * Remove team member
   */
  removeMember(username) {
    return this.config.removeMember(username);
  }

  /**
   * Get member by role
   */
  getMemberByRole(role) {
    return this.config.getMemberByRole(role);
  }

  /**
   * Get member by username
   */
  getMemberByUsername(username) {
    return this.config.getMemberByUsername(username);
  }

  /**
   * Assign member to role
   */
  assignRole(username, newRole) {
    return this.config.assignRole(username, newRole);
  }

  /**
   * Get all members
   */
  getMembers() {
    return this.config.members;
  }

  /**
   * Get team size
   */
  getSize() {
    return this.config.members.length;
  }

  /**
   * Check if team is complete (all 4 roles filled)
   */
  isComplete() {
    const sequence = RoleManager.getSequence();
    return sequence.every(roleId => this.config.roles[roleId]);
  }

  /**
   * Get missing roles
   */
  getMissingRoles() {
    const sequence = RoleManager.getSequence();
    return sequence.filter(roleId => !this.config.roles[roleId]);
  }

  /**
   * Get formatted team display
   */
  getDisplayString() {
    return this.config.members
      .map(m => {
        const role = RoleManager.getRole(m.role);
        return `${role.emoji} ${m.username} (${role.name})`;
      })
      .join('\n  ');
  }

  /**
   * Verify member exists on GitHub (stub for now)
   */
  static async verifyGitHubUser(username) {
    // TODO: Call GitHub API to verify user exists
    // For now, just validate format
    if (!username || username.length < 1) {
      throw new Error('Invalid GitHub username');
    }
    return true;
  }

  /**
   * Export configuration
   */
  toJSON() {
    return this.config.toJSON();
  }
}

module.exports = {
  TeamPack,
  TeamPackConfig
};
