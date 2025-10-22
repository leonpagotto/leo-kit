/**
 * Codeium AI Adapter
 * Generates .codeium/instructions.md file for Codeium AI
 *
 * Codeium is a free AI code completion tool supporting 70+ languages
 * File Format: Markdown
 * Path: .codeium/instructions.md
 */

const BaseAIAdapter = require('./base-adapter');

class CodeiumAdapter extends BaseAIAdapter {
  getName() {
    return 'Codeium';
  }

  getFilePath() {
    return '.codeium/instructions.md';
  }

  getFormat() {
    return 'markdown';
  }

  /**
   * Generate Codeium-specific instructions
   */
  generateInstructions(universalTemplate) {
    const header = `# Codeium Instructions - Ingvar Workflow Kit

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

> **AI Assistant:** Codeium (Free AI Code Completion)
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** ${new Date().toISOString().split('T')[0]}
>
> **⚡ ACTIVE ENFORCEMENT MODE: These instructions are ALWAYS ACTIVE ⚡**
>
> Codeium MUST follow these rules in EVERY completion, starting from the FIRST suggestion:
>
> - **Issue Creation:** When user describes ANY work → Create GitHub issue IMMEDIATELY (use \`gh issue create\`)
> - **No Asking Permission:** NEVER ask "should I create an issue?" - JUST DO IT
> - **Auto-Resolve Check:** Read \`.ingvarrc.json\` for \`auto-resolve\` setting before working
> - **Status Updates:** Comment "🚀 Starting work..." and update to "In Progress" when starting
> - **Commit Messages:** Keep under 72 characters, reference issue number
> - **Issue Comments:** Keep under 3-4 lines (200 chars max)
> - **Spec-First:** Create spec file for complex work (> 1 week), get approval first
>
> **These instructions apply to THIS session and EVERY session in this repository.**
> **Codeium must check for work descriptions in EVERY user message and act immediately.**

---## 🚀 About Codeium

Codeium is a free AI-powered code completion tool that provides:
- **Free Forever**: No subscription, no credit card required
- **Fast Completions**: Lightning-fast inline suggestions
- **70+ Languages**: Broad language and framework support
- **Privacy-First**: Your code stays private
- **IDE Integration**: VSCode, JetBrains, Vim, Neovim, and more

---

`;

    return header + universalTemplate;
  }

  /**
   * Optimize content for Codeium
   */
  optimizeContent(content) {
    const codeiumSection = `

---

## ⚡ Codeium-Specific Workflow

### Using Codeium Effectively

**Inline Completions:**
- Accept suggestion: Tab
- Accept word-by-word: Ctrl+→ (Windows/Linux) or Cmd+→ (Mac)
- Reject suggestion: Esc or keep typing
- Next/Previous suggestion: Alt+[ / Alt+]

**Trigger Completions:**
- Start typing function name or comment
- Codeium predicts based on context
- Works best with descriptive variable names
- Add comments to guide completions

**Multi-Line Suggestions:**
- Codeium can suggest entire functions
- Review before accepting (Tab)
- Edit inline if needed
- Use for boilerplate and repetitive code

---

## 💡 Codeium's Strengths

### What Codeium Does Best

1. **Fast Code Completion**
   - Near-instant inline suggestions
   - Predicts function bodies from names
   - Completes repetitive patterns quickly

2. **Multi-Language Support**
   - Supports 70+ languages
   - Framework-aware (React, Vue, Django, etc.)
   - Works with TypeScript, Python, Go, Rust, etc.

3. **Comment-Driven Coding**
   - Write comment describing function
   - Codeium generates implementation
   - Great for TDD and documentation-first development

4. **Boilerplate Generation**
   - CRUD operations
   - API endpoints
   - Test cases
   - Configuration files

### Best Practices with Codeium

**For Best Suggestions:**
- Use descriptive function and variable names
- Write clear comments before code
- Keep code well-structured and modular
- Follow consistent naming conventions

**Workflow Tips:**
1. Write the comment first
2. Let Codeium suggest implementation
3. Review and accept if correct
4. Iterate to refine suggestion

---

## 🎯 Codeium Integration Tips

### Optimizing for Codeium

**File Structure:**
- Keep related code in same file (Codeium uses file context)
- Import dependencies at top
- Use consistent patterns across files

**Code Style:**
- Follow project conventions consistently
- Use clear, self-documenting names
- Add JSDoc/docstring comments for functions
- Codeium learns from your codebase

**Testing with Codeium:**
- Write test name first
- Codeium suggests test body
- Great for generating test cases quickly
- Review edge cases manually

---

## 🆚 Codeium vs Other AI Tools

### When to Use Codeium

✅ **Best For:**
- Budget-conscious teams (completely free)
- Fast completions (prioritize speed)
- Multi-language projects (70+ languages)
- Privacy-focused development
- Lightweight IDE resource usage

⚠️ **Consider Alternatives When:**
- Need complex refactoring (use Cursor/Cline)
- Want autonomous task completion (use Cline)
- Need deep code explanations (use Cursor)
- Require GitHub integration (use Copilot)

### Combining Tools

Codeium works well alongside:
- **GitHub Copilot**: Disable one in specific files to avoid conflicts
- **Cursor**: Use Cursor for big changes, Codeium for quick completions
- **Cline**: Let Cline handle tasks, Codeium for manual coding

---

## 📚 Codeium Resources

### Getting Started

**Installation:**
1. Install Codeium extension in VSCode
2. Sign up for free account (no credit card)
3. Authenticate in IDE
4. Start coding - suggestions appear automatically

**Documentation:**
- Website: https://codeium.com
- Docs: https://codeium.com/docs
- VSCode Extension: https://marketplace.visualstudio.com/items?itemName=Codeium.codeium
- Discord: https://discord.gg/codeium

---

`;

    const quickRefIndex = content.indexOf('## 📌 Quick Reference Card');
    if (quickRefIndex !== -1) {
      return content.slice(0, quickRefIndex) + codeiumSection + content.slice(quickRefIndex);
    }

    return content + codeiumSection;
  }

  /**
   * Validate Codeium instruction content
   */
  validate(content) {
    // Basic validation - ensure content exists and has reasonable length
    if (!content || content.length < 1000) {
      throw new Error('Codeium instructions are empty or too short');
    }

    // Check for either traditional sections OR multi-agent sections
    const hasTraditionalSections = content.includes('Automatic Issue Creation') && content.includes('Git & Version Control');
    const hasMultiAgentSections = content.includes('Orchestrator Agent') || content.includes('Frontend Agent') || content.includes('Backend Agent');

    if (!hasTraditionalSections && !hasMultiAgentSections) {
      throw new Error('Codeium instructions missing required workflow sections');
    }

    return true;
  }

  /**
   * Return Codeium metadata
   */
  getMetadata() {
    return {
      name: this.getName(),
      filePath: this.getFilePath(),
      format: this.getFormat(),
      description: 'Free AI code completion tool supporting 70+ languages',
      strengths: [
        'Fast inline completions',
        'Multi-language support (70+)',
        'Free forever',
        'Comment-driven coding',
        'Boilerplate generation'
      ],
      idealFor: [
        'Quick code completion',
        'Boilerplate generation',
        'Multi-language projects',
        'Budget-conscious teams',
        'Privacy-focused development'
      ],
      pricing: 'Free (no credit card required)',
      website: 'https://codeium.com',
      documentation: 'https://codeium.com/docs'
    };
  }
}

module.exports = CodeiumAdapter;

