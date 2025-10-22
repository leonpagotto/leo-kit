const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Configuration Manager for Ingvar Workflow Kit
 * Manages both local (.ingvarrc.json in project) and global (~/.ingvarrc.json) configs
 */

const CONFIG_FILE_NAME = '.ingvarrc.json';
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), CONFIG_FILE_NAME);

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  'version': '3.0.3',
  'auto-resolve': true,  // Default: automatically work on created issues
  'auto-init': false,    // Auto-initialize on npm install
  'project-type': 'auto', // Auto-detect project type
  'ai-assistants': {
    'enabled': ['copilot'], // Default: GitHub Copilot only
    'primary': 'copilot',   // Primary AI assistant
    'sync-on-update': true  // Auto-sync all AI files when updating
  },
  'github': {
    'owner': null,         // GitHub owner (username or org)
    'repo': null,          // Repository name
    'project': {
      'number': null,      // GitHub Project number
      'url': null,         // GitHub Project URL
      'auto-add-issues': true // Auto-add created issues to project
    }
  },
  'agents': {
    'orchestrator': {
      'enabled': true      // Orchestrator always enabled
    },
    'frontend': {
      'enabled': false,
      'frameworks': [],    // e.g., ['react', 'vue', 'angular']
      'ui-library': null   // e.g., 'tailwindcss', 'mui', 'bootstrap'
    },
    'backend': {
      'enabled': false,
      'framework': null,   // e.g., 'express', 'fastify', 'nest'
      'database': null,    // e.g., 'postgresql', 'mongodb', 'mysql'
      'orm': null          // e.g., 'prisma', 'typeorm', 'sequelize'
    },
    'devops': {
      'enabled': false,
      'platform': null,    // e.g., 'railway', 'vercel', 'aws', 'gcp'
      'ci-cd': null        // e.g., 'github-actions', 'gitlab-ci', 'jenkins'
    },
    'testing': {
      'enabled': false,
      'frameworks': [],    // e.g., ['jest', 'vitest', 'mocha']
      'coverage-threshold': 80
    },
    'documentation': {
      'enabled': false,
      'style': 'jsdoc'     // e.g., 'jsdoc', 'typedoc', 'markdown'
    }
  },
  'routing': {
    'multi-agent-threshold': 3, // Tasks requiring 3+ agents trigger special handling
    'auto-handoff': true,       // Automatically handoff between agents
    'fallback-agent': 'orchestrator' // Agent to use when routing unclear
  }
};

/**
 * Get the path to the local config file (project-specific)
 * @returns {string} Path to local .ingvarrc.json
 */
function getLocalConfigPath() {
  // Start from current directory and search upwards for project root
  let currentDir = process.cwd();
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const configPath = path.join(currentDir, CONFIG_FILE_NAME);
    if (fs.existsSync(configPath)) {
      return configPath;
    }

    // Check if this is a project root (has package.json)
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      // This is the project root, return config path here
      return path.join(currentDir, CONFIG_FILE_NAME);
    }

    currentDir = path.dirname(currentDir);
  }

  // If no project root found, use current directory
  return path.join(process.cwd(), CONFIG_FILE_NAME);
}

/**
 * Read configuration from a file
 * @param {string} filePath - Path to config file
 * @returns {object} Configuration object
 */
function readConfig(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading config from ${filePath}:`, error.message);
    return {};
  }
}

/**
 * Write configuration to a file
 * @param {string} filePath - Path to config file
 * @param {object} config - Configuration object
 */
function writeConfig(filePath, config) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Error writing config to ${filePath}: ${error.message}`);
  }
}

/**
 * Get a configuration value
 * Priority: local config > global config > default
 * @param {string} key - Configuration key
 * @param {boolean} globalOnly - Only check global config
 * @returns {any} Configuration value
 */
function get(key, globalOnly = false) {
  let value;

  // Check local config first (unless globalOnly is true)
  if (!globalOnly) {
    const localPath = getLocalConfigPath();
    const localConfig = readConfig(localPath);
    if (key in localConfig) {
      return localConfig[key];
    }
  }

  // Check global config
  const globalConfig = readConfig(GLOBAL_CONFIG_PATH);
  if (key in globalConfig) {
    return globalConfig[key];
  }

  // Return default
  return DEFAULT_CONFIG[key];
}

/**
 * Set a configuration value
 * @param {string} key - Configuration key
 * @param {any} value - Configuration value
 * @param {boolean} global - Set in global config instead of local
 */
function set(key, value, global = false) {
  const filePath = global ? GLOBAL_CONFIG_PATH : getLocalConfigPath();
  const config = readConfig(filePath);

  // Convert string booleans to actual booleans
  if (value === 'true') value = true;
  if (value === 'false') value = false;

  config[key] = value;
  writeConfig(filePath, config);
}

/**
 * Get all configuration values (merged)
 * @returns {object} All configuration values
 */
function getAll() {
  const globalConfig = readConfig(GLOBAL_CONFIG_PATH);
  const localConfig = readConfig(getLocalConfigPath());

  return {
    ...DEFAULT_CONFIG,
    ...globalConfig,
    ...localConfig
  };
}

/**
 * List all configuration values with their sources
 * @returns {object} Configuration with source information
 */
function list() {
  const defaults = DEFAULT_CONFIG;
  const global = readConfig(GLOBAL_CONFIG_PATH);
  const local = readConfig(getLocalConfigPath());

  const result = {};

  // Get all unique keys
  const allKeys = new Set([
    ...Object.keys(defaults),
    ...Object.keys(global),
    ...Object.keys(local)
  ]);

  allKeys.forEach(key => {
    let value;
    let source;

    if (key in local) {
      value = local[key];
      source = 'local';
    } else if (key in global) {
      value = global[key];
      source = 'global';
    } else {
      value = defaults[key];
      source = 'default';
    }

    result[key] = { value, source };
  });

  return result;
}

/**
 * Delete a configuration key
 * @param {string} key - Configuration key
 * @param {boolean} global - Delete from global config
 */
function remove(key, global = false) {
  const filePath = global ? GLOBAL_CONFIG_PATH : getLocalConfigPath();
  const config = readConfig(filePath);

  if (key in config) {
    delete config[key];
    writeConfig(filePath, config);
    return true;
  }

  return false;
}

/**
 * Initialize a new local config file
 * @param {object} initialConfig - Initial configuration values
 */
function init(initialConfig = {}) {
  const configPath = getLocalConfigPath();

  if (fs.existsSync(configPath)) {
    throw new Error('Configuration file already exists');
  }

  const config = {
    ...DEFAULT_CONFIG,
    ...initialConfig
  };

  writeConfig(configPath, config);
  return configPath;
}

/**
 * Validate agents configuration
 * @param {object} agentsConfig - Agents configuration object
 * @returns {object} Validation result { valid: boolean, errors: string[] }
 */
function validateAgentsConfig(agentsConfig) {
  const errors = [];

  if (!agentsConfig || typeof agentsConfig !== 'object') {
    errors.push('Agents config must be an object');
    return { valid: false, errors };
  }

  const validAgents = ['orchestrator', 'frontend', 'backend', 'devops', 'testing', 'documentation'];

  for (const [agentName, agentConfig] of Object.entries(agentsConfig)) {
    if (!validAgents.includes(agentName)) {
      errors.push(`Invalid agent name: ${agentName}. Valid agents: ${validAgents.join(', ')}`);
      continue;
    }

    if (typeof agentConfig !== 'object') {
      errors.push(`Agent config for ${agentName} must be an object`);
      continue;
    }

    if (!('enabled' in agentConfig)) {
      errors.push(`Agent ${agentName} must have 'enabled' property`);
    }

    if (typeof agentConfig.enabled !== 'boolean') {
      errors.push(`Agent ${agentName} 'enabled' must be a boolean`);
    }

    // Orchestrator must always be enabled
    if (agentName === 'orchestrator' && agentConfig.enabled === false) {
      errors.push('Orchestrator agent cannot be disabled (required)');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get enabled agents
 * @returns {string[]} List of enabled agent names
 */
function getEnabledAgents() {
  const config = getAll();
  const agents = config.agents || DEFAULT_CONFIG.agents;

  return Object.entries(agents)
    .filter(([name, config]) => config.enabled === true)
    .map(([name]) => name);
}

/**
 * Enable an agent
 * @param {string} agentName - Name of agent to enable
 * @param {object} agentConfig - Optional agent-specific configuration
 * @param {boolean} global - Set in global config
 */
function enableAgent(agentName, agentConfig = {}, global = false) {
  const validAgents = ['orchestrator', 'frontend', 'backend', 'devops', 'testing', 'documentation'];

  if (!validAgents.includes(agentName)) {
    throw new Error(`Invalid agent name: ${agentName}. Valid agents: ${validAgents.join(', ')}`);
  }

  const filePath = global ? GLOBAL_CONFIG_PATH : getLocalConfigPath();
  const config = readConfig(filePath);

  if (!config.agents) {
    config.agents = {};
  }

  config.agents[agentName] = {
    enabled: true,
    ...agentConfig
  };

  writeConfig(filePath, config);
}

/**
 * Disable an agent
 * @param {string} agentName - Name of agent to disable
 * @param {boolean} global - Set in global config
 */
function disableAgent(agentName, global = false) {
  if (agentName === 'orchestrator') {
    throw new Error('Cannot disable orchestrator agent (required)');
  }

  const validAgents = ['frontend', 'backend', 'devops', 'testing', 'documentation'];

  if (!validAgents.includes(agentName)) {
    throw new Error(`Invalid agent name: ${agentName}. Valid agents: ${validAgents.join(', ')}`);
  }

  const filePath = global ? GLOBAL_CONFIG_PATH : getLocalConfigPath();
  const config = readConfig(filePath);

  if (!config.agents) {
    config.agents = {};
  }

  if (!config.agents[agentName]) {
    config.agents[agentName] = { ...DEFAULT_CONFIG.agents[agentName] };
  }

  config.agents[agentName].enabled = false;

  writeConfig(filePath, config);
}

/**
 * Get agent configuration
 * @param {string} agentName - Name of agent
 * @returns {object} Agent configuration
 */
function getAgentConfig(agentName) {
  const config = getAll();
  const agents = config.agents || DEFAULT_CONFIG.agents;

  if (!agents[agentName]) {
    return null;
  }

  return agents[agentName];
}

/**
 * Get project type with auto-detection fallback
 * @returns {string} Project type (fullstack, frontend, backend, cli, mobile, library)
 */
function getProjectType() {
  const config = getAll();
  let projectType = config['project-type'];

  if (projectType === 'auto') {
    // Auto-detect based on package.json
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Check for frontend frameworks
        const hasFrontend = !!(deps.react || deps.vue || deps.angular || deps['@angular/core'] || deps.svelte);

        // Check for backend frameworks
        const hasBackend = !!(deps.express || deps.fastify || deps['@nestjs/core'] || deps.koa);

        if (hasFrontend && hasBackend) return 'fullstack';
        if (hasFrontend) return 'frontend';
        if (hasBackend) return 'backend';
        if (packageJson.bin) return 'cli';
        if (packageJson.main || packageJson.module) return 'library';
      }
    } catch (error) {
      // Ignore errors, fall back to default
    }

    return 'fullstack'; // Default fallback
  }

  return projectType;
}

/**
 * Get recommended agents for project type
 * @param {string} projectType - Project type
 * @returns {string[]} List of recommended agent names
 */
function getRecommendedAgents(projectType) {
  const recommendations = {
    fullstack: ['orchestrator', 'frontend', 'backend', 'testing', 'documentation'],
    frontend: ['orchestrator', 'frontend', 'testing', 'documentation'],
    backend: ['orchestrator', 'backend', 'testing', 'devops', 'documentation'],
    cli: ['orchestrator', 'backend', 'testing', 'documentation'],
    mobile: ['orchestrator', 'frontend', 'backend', 'testing', 'documentation'],
    library: ['orchestrator', 'backend', 'testing', 'documentation']
  };

  return recommendations[projectType] || recommendations.fullstack;
}

module.exports = {
  get,
  set,
  getAll,
  list,
  remove,
  init,
  getLocalConfigPath,
  GLOBAL_CONFIG_PATH,
  DEFAULT_CONFIG,
  // Multi-agent specific functions
  validateAgentsConfig,
  getEnabledAgents,
  enableAgent,
  disableAgent,
  getAgentConfig,
  getProjectType,
  getRecommendedAgents
};

