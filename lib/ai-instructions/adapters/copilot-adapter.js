const BaseAIAdapter = require('./base-adapter');

/**
 * GitHub Copilot Adapter
 * Generates .github/copilot-instructions.md file
 * https://docs.github.com/en/copilot
 */
class CopilotAdapter extends BaseAIAdapter {
  getName() {
    return 'GitHub Copilot';
  }

  getFilePath() {
    return '.github/copilot-instructions.md';
  }

  getFormat() {
    return 'markdown';
  }

  /**
   * Generate Copilot-specific instructions
   * Uses the existing template system
   */
  generateInstructions(universalTemplate) {
    // For now, use the universal template as-is
    // The existing copilot-instructions-template.js already has good structure
    let content = universalTemplate;

    // Apply Copilot-specific optimizations
    content = this.optimizeContent(content);

    return content;
  }

  /**
   * Optimize content for GitHub Copilot
   * - Copilot works best with clear, structured markdown
   * - Benefits from explicit code examples
   * - Prefers direct, actionable instructions
   */
  optimizeContent(content) {
    // Add Copilot-specific header with STRONG enforcement
    const header = `# GitHub Copilot Instructions - LEO Workflow Kit

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

> **AI Assistant:** GitHub Copilot
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** ${new Date().toISOString().split('T')[0]}
>
> **⚡ ACTIVE ENFORCEMENT MODE: These instructions are ALWAYS ACTIVE ⚡**
>
> GitHub Copilot MUST follow these rules in EVERY response, starting from the FIRST message:
>
> - **Issue Creation:** When user describes ANY work → Create GitHub issue IMMEDIATELY (use \`gh issue create\`)
> - **No Asking Permission:** NEVER ask "should I create an issue?" - JUST DO IT
> - **Auto-Resolve Check:** Read \`.leorc.json\` for \`auto-resolve\` setting before working
> - **Status Updates:** Comment "🚀 Starting work..." and update to "In Progress" when starting
> - **Commit Messages:** Keep under 72 characters, reference issue number
> - **Issue Comments:** Keep under 3-4 lines (200 chars max)
> - **Spec-First:** Create spec file for complex work (> 1 week), get approval first
>
> **These instructions apply to THIS conversation and EVERY conversation in this repository.**
> **Copilot must check for work descriptions in EVERY user message and act immediately.**

---

`;    // Add Copilot-specific tips
    const copilotTips = `

---

## 🎯 GitHub Copilot-Specific Tips

### Working with Copilot

- **Use inline suggestions** - Accept with Tab, partial with Ctrl+→
- **Write clear comments** - Copilot uses comments as prompts
- **Start with function signatures** - Define interfaces first
- **Use descriptive variable names** - Helps Copilot understand intent
- **Leverage Copilot Chat** - Ask questions about code

### Copilot's Strengths

- **Code completion**: Excellent at completing functions and patterns
- **Test generation**: Strong at generating test cases
- **Documentation**: Good at writing JSDoc comments
- **Boilerplate**: Excels at repetitive code patterns

### Best Practices with Copilot

1. **Write descriptive comments** before code
2. **Review all suggestions** before accepting
3. **Use Copilot Chat** for complex queries
4. **Provide context** through file structure
5. **Iterate on suggestions** - regenerate if not ideal

`;

    return header + content + copilotTips;
  }

  /**
   * Validate Copilot instructions file
   */
  validate(content) {
    if (!content || content.length === 0) {
      return false;
    }

    // Check for essential LEO workflow sections
    const hasIssueCreation = content.includes('issue') || content.includes('GitHub issue');
    const hasWorkflow = content.includes('workflow') || content.includes('Workflow');

    return hasIssueCreation && hasWorkflow;
  }
}

module.exports = CopilotAdapter;

