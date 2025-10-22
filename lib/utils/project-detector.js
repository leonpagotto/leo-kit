const fs = require('fs-extra');
const path = require('path');

/**
 * Detect project type and framework from package.json and file structure
 * @param {string} projectPath - Path to project root
 * @returns {Object} Project information including type, framework, and features
 */
async function detectProjectType(projectPath = process.cwd()) {
  const result = {
    type: 'unknown',
    framework: null,
    language: 'javascript',
    features: [],
    packageManager: 'npm',
    hasTests: false,
    hasLinter: false,
    hasTypeScript: false,
    hasTailwind: false,
    hasDatabase: false,
    buildTool: null
  };

  try {
    // Check for package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      // Detect framework
      if (deps['next']) {
        result.framework = 'Next.js';
        result.type = 'web';
        result.features.push('SSR', 'React');
      } else if (deps['react']) {
        result.framework = 'React';
        result.type = 'web';
        result.features.push('SPA');
      } else if (deps['vue']) {
        result.framework = 'Vue.js';
        result.type = 'web';
      } else if (deps['@angular/core']) {
        result.framework = 'Angular';
        result.type = 'web';
      } else if (deps['svelte']) {
        result.framework = 'Svelte';
        result.type = 'web';
      } else if (deps['express'] || deps['fastify'] || deps['koa']) {
        result.framework = deps['express'] ? 'Express' : deps['fastify'] ? 'Fastify' : 'Koa';
        result.type = 'api';
      } else if (deps['@nestjs/core']) {
        result.framework = 'NestJS';
        result.type = 'api';
      }

      // Detect TypeScript
      if (deps['typescript'] || await fs.pathExists(path.join(projectPath, 'tsconfig.json'))) {
        result.hasTypeScript = true;
        result.language = 'typescript';
      }

      // Detect Tailwind CSS
      if (deps['tailwindcss'] || await fs.pathExists(path.join(projectPath, 'tailwind.config.js'))) {
        result.hasTailwind = true;
        result.features.push('Tailwind CSS');
      }

      // Detect testing frameworks
      if (deps['jest'] || deps['vitest'] || deps['mocha'] || deps['@jest/core']) {
        result.hasTests = true;
        result.features.push(deps['jest'] ? 'Jest' : deps['vitest'] ? 'Vitest' : 'Mocha');
      }

      // Detect linter
      if (deps['eslint']) {
        result.hasLinter = true;
        result.features.push('ESLint');
      }

      // Detect build tools
      if (deps['vite']) {
        result.buildTool = 'Vite';
      } else if (deps['webpack']) {
        result.buildTool = 'Webpack';
      } else if (deps['parcel']) {
        result.buildTool = 'Parcel';
      } else if (deps['esbuild']) {
        result.buildTool = 'esbuild';
      }

      // Detect database
      if (deps['prisma'] || deps['@prisma/client']) {
        result.hasDatabase = true;
        result.features.push('Prisma');
      } else if (deps['mongoose']) {
        result.hasDatabase = true;
        result.features.push('MongoDB');
      } else if (deps['pg'] || deps['mysql2'] || deps['sqlite3']) {
        result.hasDatabase = true;
        result.features.push('SQL');
      }

      // Detect state management
      if (deps['redux'] || deps['@reduxjs/toolkit']) {
        result.features.push('Redux');
      } else if (deps['zustand']) {
        result.features.push('Zustand');
      } else if (deps['recoil']) {
        result.features.push('Recoil');
      }

      // Detect UI libraries
      if (deps['@mui/material'] || deps['@material-ui/core']) {
        result.features.push('Material-UI');
      } else if (deps['antd']) {
        result.features.push('Ant Design');
      } else if (deps['@chakra-ui/react']) {
        result.features.push('Chakra UI');
      }
    }

    // Check for package manager
    if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
      result.packageManager = 'pnpm';
    } else if (await fs.pathExists(path.join(projectPath, 'yarn.lock'))) {
      result.packageManager = 'yarn';
    } else if (await fs.pathExists(path.join(projectPath, 'bun.lockb'))) {
      result.packageManager = 'bun';
    }

    // Check for Python projects
    if (await fs.pathExists(path.join(projectPath, 'requirements.txt')) ||
        await fs.pathExists(path.join(projectPath, 'pyproject.toml'))) {
      result.type = 'python';
      result.language = 'python';
      
      if (await fs.pathExists(path.join(projectPath, 'manage.py'))) {
        result.framework = 'Django';
      } else if (await fs.pathExists(path.join(projectPath, 'app.py'))) {
        result.framework = 'Flask';
      }
    }

    // Check for Go projects
    if (await fs.pathExists(path.join(projectPath, 'go.mod'))) {
      result.type = 'golang';
      result.language = 'go';
    }

    // Check for Rust projects
    if (await fs.pathExists(path.join(projectPath, 'Cargo.toml'))) {
      result.type = 'rust';
      result.language = 'rust';
    }

  } catch (error) {
    console.error('Error detecting project type:', error.message);
  }

  return result;
}

/**
 * Generate project summary string
 * @param {Object} projectInfo - Project information from detectProjectType
 * @returns {string} Formatted project summary
 */
function formatProjectSummary(projectInfo) {
  const parts = [];
  
  if (projectInfo.framework) {
    parts.push(`${projectInfo.framework} (${projectInfo.language})`);
  } else {
    parts.push(projectInfo.language);
  }

  if (projectInfo.features.length > 0) {
    parts.push(`with ${projectInfo.features.slice(0, 3).join(', ')}`);
  }

  if (projectInfo.buildTool) {
    parts.push(`built with ${projectInfo.buildTool}`);
  }

  return parts.join(' ');
}

/**
 * Get recommended Copilot instructions based on project type
 * @param {Object} projectInfo - Project information from detectProjectType
 * @returns {string} Additional context-specific instructions
 */
function getContextualInstructions(projectInfo) {
  let instructions = '';

  if (projectInfo.framework === 'Next.js') {
    instructions += `
## Next.js Specific Guidelines

- Use App Router (app/) when possible, Pages Router (pages/) for compatibility
- Implement proper data fetching: Server Components by default, 'use client' only when needed
- Optimize images with next/image component
- Use next/link for navigation
- Implement proper SEO with metadata API
- Use Server Actions for form submissions and mutations
`;
  }

  if (projectInfo.framework === 'React') {
    instructions += `
## React Best Practices

- Use functional components with hooks
- Implement proper memoization (React.memo, useMemo, useCallback)
- Avoid prop drilling - use Context or state management
- Keep components small and focused
- Use TypeScript for better type safety
`;
  }

  if (projectInfo.hasTailwind) {
    instructions += `
## Tailwind CSS Guidelines

- Use Tailwind utility classes for styling
- Create custom components for repeated patterns
- Use @apply sparingly in CSS files
- Follow mobile-first responsive design
- Utilize Tailwind's design tokens for consistency
`;
  }

  if (projectInfo.hasTypeScript) {
    instructions += `
## TypeScript Standards

- Define proper types/interfaces for all components and functions
- Avoid 'any' type - use 'unknown' when type is unclear
- Use type inference when obvious
- Create reusable type definitions in types/ folder
- Use strict mode TypeScript configuration
`;
  }

  return instructions;
}

module.exports = {
  detectProjectType,
  formatProjectSummary,
  getContextualInstructions
};

