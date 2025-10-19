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
    // Add Copilot-specific header
    const header = `# GitHub Copilot Instructions - LEO Workflow Kit

> **AI Assistant:** GitHub Copilot
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** ${new Date().toISOString().split('T')[0]}

---

`;

    // Add Copilot-specific tips
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
