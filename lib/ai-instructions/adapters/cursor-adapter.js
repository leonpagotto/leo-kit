const BaseAIAdapter = require('./base-adapter');

/**
 * Cursor AI Adapter
 * Generates .cursorrules file for Cursor (Claude-powered IDE)
 * https://docs.cursor.com/context/rules-for-ai
 */
class CursorAdapter extends BaseAIAdapter {
  getName() {
    return 'Cursor';
  }

  getFilePath() {
    return '.cursorrules';
  }

  getFormat() {
    return 'markdown';
  }

  /**
   * Generate Cursor-specific instructions
   * Cursor prefers concise, direct rules in markdown format
   */
  generateInstructions(universalTemplate) {
    // Cursor works well with the universal template
    // but we'll optimize it for Claude's strengths
    let content = universalTemplate;

    // Apply Cursor-specific optimizations
    content = this.optimizeContent(content);

    return content;
  }

  /**
   * Optimize content for Cursor/Claude
   * - Claude excels at understanding context and nuance
   * - Prefers clear, structured markdown
   * - Benefits from explicit examples
   */
  optimizeContent(content) {
    // Add Cursor-specific header
    const header = `# Cursor AI Rules - LEO Workflow Kit

> **AI Assistant:** Cursor (Claude-powered)
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** ${new Date().toISOString().split('T')[0]}

---

`;

    // Add Cursor-specific tips at the end
    const cursorTips = `

---

## 🎯 Cursor-Specific Tips

### Working with Claude in Cursor

- **Use Composer Mode** for complex, multi-file changes
- **Reference files explicitly** with @filename when needed
- **Ask for explanations** - Claude excels at explaining reasoning
- **Iterate incrementally** - Make changes step-by-step for best results
- **Use Cursor's native features**:
  - Cmd+K for inline edits
  - Cmd+L for chat
  - @codebase for project-wide context

### Claude's Strengths

- **Contextual understanding**: Claude reads and understands large codebases well
- **Long conversations**: Can maintain context across lengthy sessions
- **Code explanations**: Excellent at explaining complex code
- **Refactoring**: Strong at suggesting architectural improvements

### Best Practices with Cursor

1. **Start broad, then narrow**: Let Claude understand the big picture first
2. **Provide context**: Reference related files when making changes
3. **Review suggestions**: Always review Claude's code suggestions
4. **Use chat history**: Reference previous conversations for consistency
5. **Leverage @workspace**: Use @workspace to give Claude full project context

`;

    return header + content + cursorTips;
  }

  /**
   * Validate Cursor rules file
   */
  validate(content) {
    if (!content || content.length === 0) {
      return false;
    }

    // Check for essential sections
    const hasWorkflowSection = content.includes('workflow') || content.includes('Workflow');
    const hasGitSection = content.includes('git') || content.includes('Git');

    return hasWorkflowSection && hasGitSection;
  }
}

module.exports = CursorAdapter;
