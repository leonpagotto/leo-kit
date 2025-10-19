const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Configuration Manager for LEO Workflow Kit
 * Manages both local (.leorc.json in project) and global (~/.leorc.json) configs
 */

const CONFIG_FILE_NAME = '.leorc.json';
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), CONFIG_FILE_NAME);

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  'auto-resolve': true,  // Default: automatically work on created issues
  'auto-init': false,    // Auto-initialize on npm install
  'project-type': 'auto', // Auto-detect project type
  'ai-assistants': {
    'enabled': ['copilot'], // Default: GitHub Copilot only
    'primary': 'copilot',   // Primary AI assistant
    'sync-on-update': true  // Auto-sync all AI files when updating
  }
};

/**
 * Get the path to the local config file (project-specific)
 * @returns {string} Path to local .leorc.json
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

module.exports = {
  get,
  set,
  getAll,
  list,
  remove,
  init,
  getLocalConfigPath,
  GLOBAL_CONFIG_PATH,
  DEFAULT_CONFIG
};
