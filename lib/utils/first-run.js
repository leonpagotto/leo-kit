#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Get config directory
const getConfigDir = () => {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.leo-workflow');
  return configDir;
};

// Check if this is the first run
const isFirstRun = () => {
  const configDir = getConfigDir();
  const firstRunFile = path.join(configDir, '.first-run-complete');
  return !fs.existsSync(firstRunFile);
};

// Mark first run as complete
const markFirstRunComplete = () => {
  const configDir = getConfigDir();
  const firstRunFile = path.join(configDir, '.first-run-complete');
  
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(firstRunFile, new Date().toISOString());
    return true;
  } catch (error) {
    // Silently fail if we can't write the file
    return false;
  }
};

module.exports = {
  isFirstRun,
  markFirstRunComplete,
  getConfigDir
};

