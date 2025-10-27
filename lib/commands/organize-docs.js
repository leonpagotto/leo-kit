#!/usr/bin/env node

/**
 * LEO Workflow Kit - Documentation Organization Command
 *
 * Automatically organizes documentation files into proper directories:
 * - Session summaries → docs/sessions/YYYY-MM/
 * - Story docs → docs/stories/
 * - Phase reports → docs/phases/
 * - Release notes → docs/releases/
 * - Guides → docs/guides/
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Allowed files in root directory
const ALLOWED_ROOT_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  'LICENSE',
  'LICENSE.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'INDEX.md'
];

// File patterns and their target directories
const FILE_PATTERNS = [
  {
    pattern: /^SESSION_SUMMARY_(\d{4})-(\d{2})-\d{2}.*\.md$/,
    getTarget: (filename, matches) => `docs/sessions/${matches[1]}-${matches[2]}`,
    description: 'Session summaries'
  },
  {
    pattern: /^PHASE_.*\.md$/,
    getTarget: () => 'docs/phases',
    description: 'Phase documentation'
  },
  {
    pattern: /^(DAYS?|STORY)_.*\.md$/,
    getTarget: () => 'docs/stories',
    description: 'Story documentation'
  },
  {
    pattern: /^(DEPLOYMENT|RELEASE|LAUNCH|LEO_V\d|V\d+.*|ENHANCED_LEO).*\.md$/,
    getTarget: () => 'docs/releases',
    description: 'Release documentation'
  },
  {
    pattern: /^(LIONPACK|CLAUDE|COPILOT|AGENTS|.*_GUIDE|.*_REPORT|.*improvements).*\.md$/i,
    getTarget: () => 'docs/guides',
    description: 'Guides and tutorials'
  }
];

/**
 * Get the target directory for a file
 */
function getTargetDirectory(filename) {
  for (const { pattern, getTarget } of FILE_PATTERNS) {
    const matches = filename.match(pattern);
    if (matches) {
      return getTarget(filename, matches);
    }
  }
  return null;
}

/**
 * Check if a file is allowed in root
 */
function isAllowedInRoot(filename) {
  return ALLOWED_ROOT_FILES.some(allowed =>
    filename.toLowerCase() === allowed.toLowerCase()
  );
}

/**
 * Organize documentation files
 */
async function organizeDocs(options = {}) {
  const rootDir = process.cwd();
  const dryRun = options.dryRun || false;

  console.log(chalk.cyan('\n📁 LEO Documentation Organizer\n'));

  if (dryRun) {
    console.log(chalk.yellow('🔍 DRY RUN MODE - No files will be moved\n'));
  }

  try {
    // Get all markdown files in root
    const files = await fs.readdir(rootDir);
    const markdownFiles = files.filter(f =>
      f.endsWith('.md') && !f.startsWith('.')
    );

    const filesToMove = [];
    const allowedFiles = [];
    const unmatchedFiles = [];

    // Categorize files
    for (const file of markdownFiles) {
      if (isAllowedInRoot(file)) {
        allowedFiles.push(file);
        continue;
      }

      const targetDir = getTargetDirectory(file);
      if (targetDir) {
        filesToMove.push({ file, targetDir });
      } else {
        unmatchedFiles.push(file);
      }
    }

    // Display summary
    console.log(chalk.white('Current state:'));
    console.log(chalk.green(`  ✓ ${allowedFiles.length} files properly in root`));
    console.log(chalk.yellow(`  ⚠ ${filesToMove.length} files need organization`));
    if (unmatchedFiles.length > 0) {
      console.log(chalk.red(`  ✗ ${unmatchedFiles.length} unmatched files`));
    }
    console.log('');

    if (filesToMove.length === 0) {
      console.log(chalk.green('✨ Documentation is already organized!\n'));
      return { success: true, moved: 0 };
    }

    // Group by target directory
    const byDirectory = {};
    for (const { file, targetDir } of filesToMove) {
      if (!byDirectory[targetDir]) {
        byDirectory[targetDir] = [];
      }
      byDirectory[targetDir].push(file);
    }

    // Move files
    let movedCount = 0;
    console.log(chalk.cyan('Moving files:\n'));

    for (const [targetDir, files] of Object.entries(byDirectory)) {
      const fullTargetPath = path.join(rootDir, targetDir);

      if (!dryRun) {
        await fs.ensureDir(fullTargetPath);
      }

      for (const file of files) {
        const source = path.join(rootDir, file);
        const destination = path.join(fullTargetPath, file);

        if (dryRun) {
          console.log(chalk.gray(`  [DRY RUN] ${file} → ${targetDir}/`));
        } else {
          await fs.move(source, destination, { overwrite: false });
          console.log(chalk.green(`  ✓ ${file} → ${targetDir}/`));
          movedCount++;
        }
      }
    }

    console.log('');

    // Show unmatched files warning
    if (unmatchedFiles.length > 0) {
      console.log(chalk.yellow('⚠ Unmatched files (manual review needed):\n'));
      for (const file of unmatchedFiles) {
        console.log(chalk.gray(`  - ${file}`));
      }
      console.log('');
    }

    // Summary
    if (dryRun) {
      console.log(chalk.cyan(`Would move ${filesToMove.length} files\n`));
      console.log(chalk.gray('Run without --dry-run to apply changes\n'));
    } else {
      console.log(chalk.green(`✅ Organized ${movedCount} files successfully!\n`));
    }

    return { success: true, moved: movedCount };

  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    return { success: false, error: error.message };
  }
}

/**
 * Validate documentation organization
 */
async function validateDocs() {
  const rootDir = process.cwd();

  console.log(chalk.cyan('\n📋 Documentation Organization Check\n'));

  try {
    const files = await fs.readdir(rootDir);
    const markdownFiles = files.filter(f =>
      f.endsWith('.md') && !f.startsWith('.')
    );

    const issues = [];
    const allowedFiles = [];

    for (const file of markdownFiles) {
      if (isAllowedInRoot(file)) {
        allowedFiles.push(file);
      } else {
        issues.push(file);
      }
    }

    console.log(chalk.white('Root directory status:'));
    console.log(chalk.green(`  ✓ ${allowedFiles.length} allowed files`));

    if (issues.length > 0) {
      console.log(chalk.red(`  ✗ ${issues.length} files need organization:\n`));
      for (const file of issues) {
        const target = getTargetDirectory(file) || 'unknown';
        console.log(chalk.gray(`    - ${file} → ${target}/`));
      }
      console.log('');
      console.log(chalk.yellow('Run "leo organize-docs" to fix\n'));
      return { valid: false, issues };
    } else {
      console.log(chalk.green('\n✨ Documentation is properly organized!\n'));
      return { valid: true, issues: [] };
    }

  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
    return { valid: false, error: error.message };
  }
}

module.exports = {
  organizeDocs,
  validateDocs,
  isAllowedInRoot,
  getTargetDirectory
};
