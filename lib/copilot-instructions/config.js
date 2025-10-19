// Project Type Configuration for Smart Copilot Instructions
// Determines which sections to include based on project type

const PROJECT_TYPES = {
  fullstack: {
    name: 'Full Stack Web Application',
    description: 'Frontend + Backend web application',
    sections: ['workflow', 'ux', 'ui', 'components', 'seo', 'backend', 'testing', 'security', 'git', 'teams'],
    estimatedLines: 1200
  },
  frontend: {
    name: 'Frontend/UI Application',
    description: 'React, Vue, Angular, or other frontend frameworks',
    sections: ['workflow', 'ux', 'ui', 'components', 'seo', 'testing', 'git', 'teams'],
    estimatedLines: 900
  },
  backend: {
    name: 'Backend API',
    description: 'REST API, GraphQL, or other backend services',
    sections: ['workflow', 'backend', 'api', 'testing', 'security', 'git', 'teams'],
    estimatedLines: 600
  },
  cli: {
    name: 'CLI Tool',
    description: 'Command-line application or tool',
    sections: ['workflow', 'cli', 'testing', 'git'],
    estimatedLines: 400
  },
  mobile: {
    name: 'Mobile Application',
    description: 'React Native, Flutter, or native mobile apps',
    sections: ['workflow', 'ux', 'ui', 'components', 'mobile', 'testing', 'git', 'teams'],
    estimatedLines: 800
  },
  library: {
    name: 'Library/Package',
    description: 'NPM package, library, or reusable component',
    sections: ['workflow', 'api', 'documentation', 'versioning', 'testing', 'git'],
    estimatedLines: 500
  }
};

// Section definitions with metadata
const SECTIONS = {
  workflow: {
    name: 'Automatic Issue Creation & Spec-First',
    description: 'Core workflow: automatic GitHub issue creation and spec-first development',
    required: true, // ALWAYS included
    file: 'core-workflow.js',
    estimatedLines: 200
  },
  ux: {
    name: 'User Experience First',
    description: 'UX principles, audience awareness, complete solutions',
    file: 'ux-principles.js',
    estimatedLines: 50
  },
  ui: {
    name: 'UI Development Standards',
    description: 'Design consistency, accessibility, responsive design',
    file: 'ui-development.js',
    estimatedLines: 100
  },
  components: {
    name: 'Component-First Development',
    description: 'Atomic design, DRY principles, reusable components',
    file: 'component-first.js',
    estimatedLines: 200
  },
  seo: {
    name: 'SEO Optimization',
    description: 'Semantic HTML, meta tags, performance optimization',
    file: 'seo-optimization.js',
    estimatedLines: 300
  },
  backend: {
    name: 'Backend Best Practices',
    description: 'Server architecture, database design, caching',
    file: 'backend-api.js',
    estimatedLines: 150
  },
  api: {
    name: 'API Design',
    description: 'REST, GraphQL, API documentation, versioning',
    file: 'api-design.js',
    estimatedLines: 100
  },
  cli: {
    name: 'CLI Patterns',
    description: 'Command-line interface design, arguments, error messages',
    file: 'cli-patterns.js',
    estimatedLines: 80
  },
  mobile: {
    name: 'Mobile Development',
    description: 'Mobile-specific patterns, touch interactions, performance',
    file: 'mobile-patterns.js',
    estimatedLines: 100
  },
  documentation: {
    name: 'Documentation Organization',
    description: 'Where to place files, documentation standards',
    file: 'documentation.js',
    estimatedLines: 80
  },
  versioning: {
    name: 'Versioning & Releases',
    description: 'Semantic versioning, changelog, release process',
    file: 'versioning.js',
    estimatedLines: 60
  },
  testing: {
    name: 'Testing Standards',
    description: 'Unit tests, integration tests, E2E tests',
    file: 'testing.js',
    estimatedLines: 80
  },
  security: {
    name: 'Security Best Practices',
    description: 'Authentication, authorization, data protection',
    file: 'security.js',
    estimatedLines: 80
  },
  git: {
    name: 'Git & Version Control',
    description: 'Commit messages, pull requests, branching',
    file: 'git-workflow.js',
    estimatedLines: 80
  },
  teams: {
    name: 'Team Collaboration',
    description: 'Working with designers, PMs, developers',
    file: 'team-collaboration.js',
    estimatedLines: 60
  }
};

// Auto-detection rules based on package.json
const AUTO_DETECTION_RULES = {
  // Frontend frameworks
  'react': 'frontend',
  'react-dom': 'frontend',
  'vue': 'frontend',
  '@angular/core': 'frontend',
  'svelte': 'frontend',
  'next': 'fullstack', // Next.js is full stack
  
  // Backend frameworks
  'express': 'backend',
  'fastify': 'backend',
  'koa': 'backend',
  '@nestjs/core': 'backend',
  'hapi': 'backend',
  
  // Mobile
  'react-native': 'mobile',
  'expo': 'mobile',
  
  // CLI indicators
  'commander': 'cli',
  'yargs': 'cli',
  'inquirer': 'cli',
  'chalk': 'cli'
};

/**
 * Detect project type from package.json
 * @param {object} packageJson - Parsed package.json
 * @returns {string|null} - Detected project type or null
 */
function detectProjectType(packageJson) {
  if (!packageJson) return null;
  
  // Check if it has a bin field (CLI tool)
  if (packageJson.bin) {
    return 'cli';
  }
  
  // Check dependencies
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  // Count indicators for each type
  const indicators = {};
  for (const [dep, type] of Object.entries(AUTO_DETECTION_RULES)) {
    if (allDeps[dep]) {
      indicators[type] = (indicators[type] || 0) + 1;
    }
  }
  
  // Return type with most indicators
  const detected = Object.entries(indicators)
    .sort((a, b) => b[1] - a[1])[0];
  
  return detected ? detected[0] : null;
}

/**
 * Get section list for a project type
 * @param {string} projectType - Project type key
 * @returns {string[]} - Array of section keys
 */
function getSectionsForType(projectType) {
  const config = PROJECT_TYPES[projectType];
  return config ? config.sections : PROJECT_TYPES.fullstack.sections;
}

/**
 * Validate custom sections array
 * @param {string[]} sections - Array of section keys
 * @returns {object} - {valid: boolean, invalid: string[]}
 */
function validateSections(sections) {
  const validSections = Object.keys(SECTIONS);
  const invalid = sections.filter(s => !validSections.includes(s));
  
  return {
    valid: invalid.length === 0,
    invalid,
    validSections
  };
}

module.exports = {
  PROJECT_TYPES,
  SECTIONS,
  AUTO_DETECTION_RULES,
  detectProjectType,
  getSectionsForType,
  validateSections
};
