// Smart Copilot Instructions Builder
// Assembles instructions based on project type and configuration

const path = require('path');
const { SECTIONS, getSectionsForType } = require('./config');

/**
 * Build table of contents based on included sections
 * @param {string[]} sections - Array of section keys to include
 * @returns {string} - Table of contents markdown
 */
function buildTableOfContents(sections) {
  const criticalSections = sections.filter(s => SECTIONS[s]?.required || s === 'workflow');
  const developmentSections = sections.filter(s =>
    ['ux', 'ui', 'components', 'seo', 'backend', 'api', 'cli', 'mobile'].includes(s)
  );
  const workflowSections = sections.filter(s =>
    ['documentation', 'versioning', 'testing', 'security', 'git', 'teams'].includes(s)
  );

  let toc = '## 📋 Table of Contents\n\n';

  if (criticalSections.length > 0) {
    toc += '### 🚨 CRITICAL WORKFLOWS (Read First)\n';
    criticalSections.forEach((key, i) => {
      const section = SECTIONS[key];
      if (section) {
        toc += `${i + 1}. [${section.name}](#${key}) - ${section.description}\n`;
      }
    });
    toc += '\n';
  }

  if (developmentSections.length > 0) {
    toc += '### 🎨 DEVELOPMENT STANDARDS (Essential)\n';
    developmentSections.forEach((key, i) => {
      const section = SECTIONS[key];
      if (section) {
        toc += `${i + 1}. [${section.name}](#${key}) - ${section.description}\n`;
      }
    });
    toc += '\n';
  }

  if (workflowSections.length > 0) {
    toc += '### 📚 CODE QUALITY & WORKFLOW\n';
    workflowSections.forEach((key, i) => {
      const section = SECTIONS[key];
      if (section) {
        toc += `${i + 1}. [${section.name}](#${key}) - ${section.description}\n`;
      }
    });
  }

  return toc;
}

/**
 * Load section content from file
 * @param {string} sectionKey - Section key (e.g., 'workflow', 'ui')
 * @returns {string} - Section content
 */
function loadSectionContent(sectionKey) {
  const section = SECTIONS[sectionKey];
  if (!section) {
    console.warn(`Warning: Unknown section "${sectionKey}"`);
    return '';
  }

  try {
    const sectionPath = path.join(__dirname, 'sections', section.file);
    const content = require(sectionPath);
    return typeof content === 'function' ? content() : content;
  } catch (error) {
    console.error(`Error loading section "${sectionKey}":`, error.message);
    return `<!-- Section "${sectionKey}" not yet implemented -->`;
  }
}

/**
 * Build quick reference card based on included sections
 * @param {string[]} sections - Array of section keys
 * @returns {string} - Quick reference markdown
 */
function buildQuickReference(sections) {
  const hasUI = sections.includes('ui') || sections.includes('components');
  const hasSEO = sections.includes('seo');
  const hasBackend = sections.includes('backend') || sections.includes('api');
  const hasMobile = sections.includes('mobile');
  const hasCLI = sections.includes('cli');

  let mantras = [
    '"User Experience First" - Always prioritize UX and clarity',
    '"Specifications are FILES. Tasks are GITHUB ISSUES." - Plan in specs, execute in issues',
    '"Auto-Create Issues" - Detect work descriptions and create issues immediately'
  ];

  if (hasUI) {
    mantras.push('"Component-First" - Build reusable components, never copy-paste');
  }

  if (hasSEO) {
    mantras.push('"SEO Matters" - Semantic HTML, meta tags, performance optimization');
  }

  if (hasBackend) {
    mantras.push('"API-First" - Design clean, well-documented APIs');
  }

  if (hasMobile) {
    mantras.push('"Mobile-First" - Touch-friendly, responsive, performant');
  }

  if (hasCLI) {
    mantras.push('"CLI UX Matters" - Clear messages, helpful errors, good defaults');
  }

  mantras.push(
    '"DRY Principle" - Extract repeated code into functions, hooks, utilities',
    '"Quality Always" - Test coverage, error handling, security best practices'
  );

  return `## 📌 Quick Reference Card

### Before Starting Work

1. **Analyze complexity**: Simple issue or complex spec?
2. **Simple work**: Create GitHub issue immediately with \`gh issue create\`
3. **Complex work**: Create spec in \`docs/specs/\`, get approval, then create issues
4. Add issue to project board (status: "Todo")
5. Move to "In Progress" when starting work

### During Development

- ✅ Reference issue in ALL commits: \`feat: add feature (#42)\`
- ✅ Write tests alongside code
- ✅ Update documentation as you go
- ✅ Follow project code style (linting, formatting)
- ✅ Handle errors gracefully with user-friendly messages${hasUI ? '\n- ✅ Keep UX and accessibility in mind' : ''}${hasSEO ? '\n- ✅ Optimize for SEO and performance' : ''}${hasBackend ? '\n- ✅ Design clean, versioned APIs' : ''}
- ✅ Update issue status to "In Progress"

### Before Merging

- ✅ All tests passing
- ✅ Code reviewed and approved
- ✅ Documentation updated (README, API docs, etc.)
- ✅ PR references issue: "Closes #42" or "Fixes #42"
- ✅ Issue will auto-close and move to "Done" on merge

### Key Mantras

${mantras.map(m => `- **${m}**`).join('\n')}

`;
}

/**
 * Build complete Copilot instructions
 * @param {string} projectType - Project type key (fullstack, frontend, backend, etc.)
 * @param {string[]} customSections - Optional custom sections array
 * @returns {string} - Complete Copilot instructions markdown
 */
function buildInstructions(projectType = 'fullstack', customSections = null) {
  // Get sections for this project type
  const sections = customSections || getSectionsForType(projectType);

  // Always include workflow section
  if (!sections.includes('workflow')) {
    sections.unshift('workflow');
  }

  // Build header
  const projectTypeInfo = require('./config').PROJECT_TYPES[projectType];
  const header = `# GitHub Copilot Instructions - LEO Workflow Kit

> **Purpose**: This file guides GitHub Copilot to follow LEO's workflow standards, ensuring consistent development practices, automatic issue creation, and high-quality code.
>
> **Project Type**: ${projectTypeInfo?.name || 'Custom Configuration'}
> **Sections Included**: ${sections.length} sections (~${projectTypeInfo?.estimatedLines || '???'} lines)

---

`;

  // Build table of contents
  const toc = buildTableOfContents(sections);

  // Load all section content
  const sectionContents = sections.map(key => {
    const content = loadSectionContent(key);
    return content ? `---\n\n${content}` : '';
  }).filter(Boolean);

  // Build quick reference
  const quickRef = buildQuickReference(sections);

  // Assemble everything
  return `\`\`\`instructions
${header}
${toc}

${sectionContents.join('\n\n')}

---

${quickRef}
\`\`\``;
}

module.exports = {
  buildInstructions,
  buildTableOfContents,
  buildQuickReference,
  loadSectionContent
};
