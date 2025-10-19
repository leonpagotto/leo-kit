// Smart Copilot Instructions System
// Main entry point for generating project-type-specific instructions

const { PROJECT_TYPES, SECTIONS, detectProjectType, getSectionsForType, validateSections } = require('./config');
const { buildInstructions } = require('./builder');

/**
 * Generate Copilot instructions for a project
 * @param {object} options - Generation options
 * @param {string} options.projectType - Project type key
 * @param {string[]} options.sections - Custom sections array
 * @param {object} options.packageJson - package.json for auto-detection
 * @param {boolean} options.autoDetect - Whether to auto-detect from package.json
 * @returns {string} - Generated instructions
 */
function generate(options = {}) {
  let { projectType, sections, packageJson, autoDetect = true } = options;
  
  // Auto-detect if enabled and package.json provided
  if (autoDetect && packageJson && !projectType) {
    const detected = detectProjectType(packageJson);
    if (detected) {
      console.log(`📊 Auto-detected project type: ${PROJECT_TYPES[detected].name}`);
      projectType = detected;
    }
  }
  
  // Default to fullstack if no type specified
  if (!projectType) {
    projectType = 'fullstack';
  }
  
  // Validate project type
  if (!PROJECT_TYPES[projectType]) {
    throw new Error(`Unknown project type: ${projectType}. Valid types: ${Object.keys(PROJECT_TYPES).join(', ')}`);
  }
  
  // Validate custom sections if provided
  if (sections) {
    const validation = validateSections(sections);
    if (!validation.valid) {
      throw new Error(`Invalid sections: ${validation.invalid.join(', ')}. Valid sections: ${validation.validSections.join(', ')}`);
    }
  }
  
  // Build and return instructions
  return buildInstructions(projectType, sections);
}

/**
 * Get list of available project types
 * @returns {object[]} - Array of project type objects
 */
function getProjectTypes() {
  return Object.entries(PROJECT_TYPES).map(([key, config]) => ({
    value: key,
    name: config.name,
    description: config.description,
    sections: config.sections,
    estimatedLines: config.estimatedLines
  }));
}

/**
 * Get list of available sections
 * @returns {object[]} - Array of section objects
 */
function getSections() {
  return Object.entries(SECTIONS).map(([key, config]) => ({
    value: key,
    name: config.name,
    description: config.description,
    required: config.required || false,
    estimatedLines: config.estimatedLines
  }));
}

module.exports = {
  generate,
  getProjectTypes,
  getSections,
  PROJECT_TYPES,
  SECTIONS,
  detectProjectType,
  getSectionsForType,
  validateSections
};
