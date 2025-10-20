/**
 * Cline AI Adapter
 * Generates .clinerules file for Cline (Claude-Dev VSCode Extension)
 *
 * Cline is a VSCode extension powered by Claude that provides:
 * - Autonomous coding tasks
 * - File editing and creation
 * - Terminal command execution
 * - Code understanding and refactoring
 *
 * File Format: Markdown with instructions
 * Path: .clinerules (project root)
 */

const BaseAIAdapter = require('./base-adapter');

class ClineAdapter extends BaseAIAdapter {
  getName() {
    return 'Cline';
  }

  getFilePath() {
    return '.clinerules';
  }

  getFormat() {
    return 'markdown';
  }

  /**
   * Generate Cline-specific instructions
   * Optimized for Claude-Dev's autonomous task execution
   */
  generateInstructions(universalTemplate) {
    const header = `# Cline Rules - LEO Workflow Kit

> **📖 MANDATORY: READ ALL INSTRUCTIONS FROM TOP TO BOTTOM**
>
> **BEFORE responding to ANY user message, you MUST:**
> 1. **READ this ENTIRE file from beginning to end** (all sections, no skipping)
> 2. **UNDERSTAND all rules, workflows, and requirements**
> 3. **APPLY the rules to the current user request**
> 4. **VERIFY you followed all mandatory workflows**
>
> **DO NOT skip sections. DO NOT assume you know the content.**
> **These instructions change and update - READ THEM EVERY TIME.**
> **If you don't read the full file, you WILL miss critical requirements.**

---

> **AI Assistant:** Cline (Claude-Dev VSCode Extension)
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** ${new Date().toISOString().split('T')[0]}
>
> **⚡ ACTIVE ENFORCEMENT MODE: These rules are ALWAYS ACTIVE ⚡**
>
> Claude via Cline MUST follow these rules in EVERY task, starting from the FIRST action:
>
> - **Issue Creation:** When user describes ANY work → Create GitHub issue IMMEDIATELY (use \`gh issue create\`)
> - **No Asking Permission:** NEVER ask "should I create an issue?" - JUST DO IT
> - **Auto-Resolve Check:** Read \`.leorc.json\` for \`auto-resolve\` setting before working
> - **Status Updates:** Comment "🚀 Starting work..." and update to "In Progress" when starting
> - **Commit Messages:** Keep under 72 characters, reference issue number
> - **Issue Comments:** Keep under 3-4 lines (200 chars max)
> - **Spec-First:** Create spec file for complex work (> 1 week), get approval first
>
> **These rules apply to THIS task and EVERY task in this repository.**
> **Cline must check for work descriptions in EVERY user message and act immediately.**

---## 🤖 About Cline

Cline is a VSCode extension powered by Claude AI that provides autonomous coding assistance:
- **File Operations**: Creates, edits, and refactors files
- **Terminal Access**: Executes commands and tests
- **Context Awareness**: Understands entire codebase
- **Autonomous Tasks**: Completes multi-step features independently

---

`;

    return header + universalTemplate;
  }

  /**
   * Optimize content for Cline's autonomous workflow
   * Add Cline-specific tips and best practices
   */
  optimizeContent(content) {
    const clineSection = `

---

## 🎯 Cline-Specific Workflow

### Using Cline Effectively

**Task Delegation:**
- Provide clear, actionable tasks: "Create a login component with email/password fields"
- Break complex features into smaller tasks
- Let Cline handle multi-file changes autonomously
- Review Cline's proposed changes before accepting

**File Operations:**
- Cline can create multiple files in one task
- Reference files explicitly: "Update auth.js and add tests in auth.test.js"
- Cline respects existing file structure
- Review diffs carefully before applying

**Terminal Commands:**
- Cline can run npm install, git commands, tests
- Always review commands before execution
- Check terminal output for errors
- Cline can fix errors autonomously if prompted

**Context Management:**
- Cline reads entire project structure
- Reference related files: "Look at user-service.js for patterns"
- Cline maintains context across multi-step tasks
- Use @filename to focus on specific files

---

## 💡 Claude's Strengths (via Cline)

### What Claude Does Best

1. **Autonomous Task Completion**
   - Give high-level goals, Claude breaks them down
   - Handles multi-file refactoring
   - Creates tests alongside features

2. **Code Understanding**
   - Deep analysis of complex codebases
   - Explains technical debt and suggests improvements
   - Identifies patterns and anti-patterns

3. **Refactoring at Scale**
   - Safe refactoring across multiple files
   - Maintains functionality while improving structure
   - Suggests architectural improvements

4. **Error Resolution**
   - Analyzes error messages and stack traces
   - Proposes and implements fixes
   - Adds defensive error handling

### Best Practices with Cline

- **Start Broad**: "Implement OAuth2 authentication with Google"
- **Add Details**: "Use passport.js, store tokens in PostgreSQL"
- **Review Diffs**: Check all file changes before accepting
- **Iterate**: Give feedback and let Cline refine
- **Trust Autonomy**: Let Cline handle repetitive tasks (file creation, testing)

---

## 🚀 Cline Workflow Tips

### Effective Prompts

✅ **Good Prompts:**
- "Create a REST API endpoint for user registration with validation"
- "Refactor the authentication logic to use async/await"
- "Add unit tests for the payment service"
- "Fix the responsive layout issues on mobile"

❌ **Vague Prompts:**
- "Make it better"
- "Fix stuff"
- "Improve code"

### Task Execution

1. **Planning Phase**: Cline outlines approach
2. **File Changes**: Proposes edits with diffs
3. **Terminal Commands**: Suggests commands to run
4. **Review**: You approve or request changes
5. **Execution**: Cline applies changes autonomously

### Error Handling

- Cline reads terminal output and error messages
- Can fix errors autonomously if given permission
- Review error fixes before accepting
- Cline learns from past errors in the session

---

## 📋 Integration with LEO Workflow

### Issue Creation
When Cline completes a task, ensure:
- GitHub issue is created/updated automatically
- Commits reference issue numbers
- PR links back to issue

### Status Updates
Cline can update issue status:
- "Mark issue #42 as In Progress"
- "Close issue #42 after this fix"
- Automatically move to Done when merged

### Testing
Always ask Cline to:
- Write tests for new features
- Run tests after changes
- Fix failing tests

---

`;

    // Insert Cline section after the core instructions but before Quick Reference
    const quickRefIndex = content.indexOf('## 📌 Quick Reference Card');
    if (quickRefIndex !== -1) {
      return content.slice(0, quickRefIndex) + clineSection + content.slice(quickRefIndex);
    }

    // Fallback: append at the end
    return content + clineSection;
  }

  /**
   * Validate Cline instruction content
   */
  validate(content) {
    // Basic validation - ensure content exists and has reasonable length
    if (!content || content.length < 1000) {
      throw new Error('Cline instructions are empty or too short');
    }

    // Check for either traditional sections OR multi-agent sections
    const hasTraditionalSections = content.includes('Automatic Issue Creation') && content.includes('Git & Version Control');
    const hasMultiAgentSections = content.includes('Orchestrator Agent') || content.includes('Frontend Agent') || content.includes('Backend Agent');

    if (!hasTraditionalSections && !hasMultiAgentSections) {
      throw new Error('Cline instructions missing required workflow sections');
    }

    return true;
  }

  /**
   * Return Cline metadata
   */
  getMetadata() {
    return {
      name: this.getName(),
      filePath: this.getFilePath(),
      format: this.getFormat(),
      description: 'Claude-powered VSCode extension for autonomous coding tasks',
      strengths: [
        'Autonomous task completion',
        'Multi-file refactoring',
        'Deep code understanding',
        'Error resolution',
        'Test generation'
      ],
      idealFor: [
        'Feature implementation',
        'Large-scale refactoring',
        'Bug fixing with context',
        'Test creation',
        'Code explanations'
      ],
      website: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev',
      documentation: 'https://github.com/saoudrizwan/claude-dev'
    };
  }
}

module.exports = ClineAdapter;
