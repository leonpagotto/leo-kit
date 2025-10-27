# 📊 Spec Evolution Tracking Guide

Track how your specs evolve over time with `leo spec-diff` - understand requirement changes, see what was added or removed, and maintain a complete audit trail of your specification history.

---

## 🎯 Overview

Spec evolution tracking helps you:
- **Understand Changes** - See exactly what changed in requirements, user stories, and acceptance criteria
- **Audit Trail** - Complete history of who changed what and when
- **Version Control** - Compare specific versions or ranges
- **Team Alignment** - Keep everyone informed about spec modifications
- **Decision Context** - Understand why requirements evolved

---

## 🚀 Quick Start

### View All Changes
```bash
leo spec-diff 42
```

Shows all changes between all versions with color-coded diff:
- 🟢 Green = Added
- 🔴 Red = Removed
- 🟡 Yellow = Version separator

### View Timeline
```bash
leo spec-diff 42 --timeline
```

Shows chronological history of all edits with timestamps and authors.

### View Summary Statistics
```bash
leo spec-diff 42 --summary
```

Shows aggregated statistics: total versions, items added/removed, most modified sections, contributors.

---

## 📋 Basic Commands

### 1. Full Diff View (Default)

```bash
leo spec-diff <issue-number>
```

**Example:**
```bash
leo spec-diff 80
```

**Output:**
```
📊 Analyzing spec evolution for issue #80...

📝 Spec Changes (3 edits)

━━━ Version 1 → 2 ━━━
10/27/2025, 3:00:17 PM by @leonpagotto

  Requirements:
    - Add payment processing with Stripe
    - Error handling implemented
    + Support for Google Pay and Apple Pay
    + Webhook integration for payment events

  User Stories:
    + As a user, I want to pay with Google Pay so that checkout is faster
    + As an admin, I want webhook notifications so that I can track payments
```

### 2. Timeline View

```bash
leo spec-diff <issue-number> --timeline
```

**Example:**
```bash
leo spec-diff 80 --timeline
```

**Output:**
```
📊 Analyzing spec evolution for issue #80...

📅 Spec Evolution Timeline

🆕 Version 1
   10/27/2025, 3:00:03 PM by @leonpagotto
   4 sections with content

✏️ Version 2
   10/27/2025, 3:00:17 PM by @alice
   9 sections with content

✏️ Version 3
   10/27/2025, 4:30:22 PM by @bob
   9 sections with content
```

### 3. Summary Statistics

```bash
leo spec-diff <issue-number> --summary
```

**Example:**
```bash
leo spec-diff 80 --summary
```

**Output:**
```
📊 Spec Evolution Summary

Versions:
  Total versions: 5
  Original: 10/27/2025
  Latest: 10/27/2025

Changes:
  Total edits: 3
  Items added: 11
  Items removed: 20
  Sections modified: 15

Most Modified Sections:
  Requirements: 3 changes
  User Stories: 2 changes
  Acceptance Criteria: 2 changes

Contributors:
  @leonpagotto, @alice, @bob
```

---

## 🎨 Advanced Features

### Version Range Comparison

Compare specific version range instead of all versions:

```bash
leo spec-diff <issue-number> --from <version> --to <version>
```

**Examples:**

```bash
# Compare v1 to v3
leo spec-diff 80 --from 1 --to 3

# Compare latest 2 versions
leo spec-diff 80 --from 4 --to 5

# From v2 to latest
leo spec-diff 80 --from 2
```

**Use Cases:**
- Focus on recent changes only
- Compare original spec to current state
- Review changes during specific sprint
- Skip irrelevant intermediate versions

### Section-Specific Diff

Focus on changes to a specific section:

```bash
leo spec-diff <issue-number> --section <section-name>
```

**Available Sections:**
- `context` - Context section
- `requirements` - Requirements list
- `userStories` - User stories list
- `acceptanceCriteria` - Acceptance criteria list
- `technicalNotes` - Technical notes
- `constraints` - Constraints section
- `outOfScope` - Out of scope section
- `successMetrics` - Success metrics

**Examples:**

```bash
# Only requirements changes
leo spec-diff 80 --section requirements

# Only user stories changes
leo spec-diff 80 --section userStories

# Only acceptance criteria changes
leo spec-diff 80 --section acceptanceCriteria
```

**Use Cases:**
- Product managers reviewing requirement changes
- Developers focusing on acceptance criteria
- QA checking test requirements
- Tech leads reviewing constraints

### Text Length Control

Control how much text is shown for long changes:

```bash
leo spec-diff <issue-number> --max-length <characters>
```

**Examples:**

```bash
# Show only 50 characters
leo spec-diff 80 --max-length 50

# Show full text (500 characters)
leo spec-diff 80 --max-length 500
```

**Default:** 100 characters

---

## 🔄 Combining Options

You can combine multiple options for precise queries:

```bash
# Recent requirements changes only
leo spec-diff 80 --from 3 --section requirements

# Summary for specific version range
leo spec-diff 80 --from 1 --to 3 --summary

# Timeline for recent versions
leo spec-diff 80 --from 4 --timeline

# Detailed diff with longer text
leo spec-diff 80 --section context --max-length 200
```

---

## 📊 Understanding the Output

### Color Coding

- **🟢 Green (+)** - Items added in this version
- **🔴 Red (-)** - Items removed in this version
- **🟡 Yellow (━━━)** - Version separator
- **⚪ Gray** - Metadata (timestamp, author)

### Change Types

**List Changes** (Requirements, User Stories, Acceptance Criteria):
```
Requirements:
  + New requirement added
  - Old requirement removed
```

**Text Changes** (Context, Technical Notes):
```
Context:
  - Old context description
  + New context description
```

### Version Numbers

- Version 1 = Original spec (when created)
- Version 2+ = Each edit to the issue body
- Versions are sequential and never skip

---

## 🎯 Common Use Cases

### 1. Product Manager - Track Requirement Changes

**Scenario:** You need to understand how requirements evolved during discovery.

```bash
# View all requirement changes
leo spec-diff 42 --section requirements

# Summary of how much changed
leo spec-diff 42 --summary
```

### 2. Developer - Review Acceptance Criteria Updates

**Scenario:** QA updated acceptance criteria, you need to see what changed.

```bash
# See only acceptance criteria changes
leo spec-diff 42 --section acceptanceCriteria

# Compare before/after specific edit
leo spec-diff 42 --from 2 --to 3 --section acceptanceCriteria
```

### 3. Team Lead - Sprint Review

**Scenario:** Review all changes made during the sprint.

```bash
# Timeline of edits
leo spec-diff 42 --timeline

# Summary statistics
leo spec-diff 42 --summary

# Detailed diff
leo spec-diff 42
```

### 4. QA - Verify Test Coverage

**Scenario:** Ensure tests cover all requirement changes.

```bash
# See what requirements were added
leo spec-diff 42 --section requirements

# Check user stories evolution
leo spec-diff 42 --section userStories
```

### 5. Stakeholder - Audit Trail

**Scenario:** External audit requires change history.

```bash
# Complete timeline with authors
leo spec-diff 42 --timeline

# Statistical summary
leo spec-diff 42 --summary

# Full diff for documentation
leo spec-diff 42 > spec-42-evolution.txt
```

---

## 🚨 Troubleshooting

### "No edits found for this spec"

**Cause:** The spec issue body has never been edited.

**Solution:** Edits to issue comments don't count - only edits to the main issue body are tracked.

### "Spec has not been edited yet (only 1 version exists)"

**Cause:** The spec was created but never modified.

**Solution:** This is normal for new specs. Edit the issue body to create version 2.

### Unexpected Changes Shown

**Cause:** GitHub's timeline API includes all body edits, including formatting changes.

**Solution:** Be mindful that even minor edits (typos, formatting) create new versions.

### Missing Versions

**Cause:** GitHub API may not return all timeline events immediately.

**Solution:** Wait a few seconds after editing, then re-run the diff command.

---

## 💡 Best Practices

### 1. **Edit Mindfully**
Each edit creates a new version. Group related changes into a single edit when possible.

### 2. **Use Section Diff for Reviews**
When reviewing with team, focus on specific sections to avoid noise.

### 3. **Document Major Changes**
Add a comment explaining why major requirements changed.

### 4. **Regular Timeline Reviews**
During sprint reviews, show the timeline to highlight iteration.

### 5. **Export for Documentation**
Save diff output to files for compliance or documentation:
```bash
leo spec-diff 42 > docs/spec-42-evolution.md
```

### 6. **Combine with Git**
Track spec evolution alongside code changes in your repository.

---

## 🔗 Integration with LEO Workflow

### Workflow Integration

```bash
# 1. Create spec
leo spec new "Add payment processing"  # Creates #42

# 2. Review and clarify
leo clarify 42

# 3. Update spec based on feedback (edit issue #42 on GitHub)

# 4. View changes
leo spec-diff 42 --section requirements

# 5. Create plan
leo plan 42

# 6. Track ongoing changes
leo spec-diff 42 --from 3 --timeline
```

### With Task Management

```bash
# Create tasks from spec
leo tasks create 42 --create-issues

# Spec requirements change - view diff
leo spec-diff 42 --section requirements

# Update child task issues to match
# (manual step: update child issues based on diff)
```

---

## 📈 Examples

### Example 1: E-commerce Feature Evolution

```bash
$ leo spec-diff 101 --summary

📊 Spec Evolution Summary

Versions:
  Total versions: 8
  Original: 10/20/2025
  Latest: 10/27/2025

Changes:
  Total edits: 7
  Items added: 15
  Items removed: 8
  Sections modified: 6

Most Modified Sections:
  Requirements: 5 changes
  User Stories: 4 changes
  Technical Notes: 3 changes

Contributors:
  @product-manager, @tech-lead, @frontend-dev
```

### Example 2: Bug Fix Scope Changes

```bash
$ leo spec-diff 52 --section acceptanceCriteria

📊 Analyzing spec evolution for issue #52...

━━━ Version 1 → 2 ━━━
10/25/2025, 9:15:22 AM by @qa-engineer

  Acceptance Criteria:
    + Test with 1000+ concurrent users
    + Verify error handling for timeout scenarios
    - Performance test not required (moved to next sprint)
```

### Example 3: Timeline for Sprint Review

```bash
$ leo spec-diff 75 --timeline

📅 Spec Evolution Timeline

🆕 Version 1
   10/20/2025, 2:00:00 PM by @product-manager
   4 sections with content

✏️ Version 2
   10/21/2025, 10:30:00 AM by @tech-lead
   7 sections with content (added Technical Notes)

✏️ Version 3
   10/23/2025, 3:15:00 PM by @stakeholder
   7 sections with content (updated Requirements)

✏️ Version 4
   10/27/2025, 11:00:00 AM by @qa-engineer
   7 sections with content (expanded Acceptance Criteria)
```

---

## 🎓 Tips & Tricks

### Tip 1: Quick Recent Changes Check
```bash
# See only the last edit
leo spec-diff 42 --from 4 --to 5
```

### Tip 2: Find Who Changed What
```bash
# Summary shows contributors
leo spec-diff 42 --summary
```

### Tip 3: Export for Email/Slack
```bash
# Copy output to clipboard (macOS)
leo spec-diff 42 | pbcopy

# Save to file
leo spec-diff 42 > spec-changes.txt
```

### Tip 4: Compare Original vs Current
```bash
# Full evolution from start to now
leo spec-diff 42

# Just original vs latest (skip intermediate)
leo spec-diff 42 --from 1 --to $(leo spec-diff 42 --timeline | grep -c "Version")
```

### Tip 5: Focus on User-Facing Changes
```bash
# User stories and acceptance criteria only
leo spec-diff 42 --section userStories
leo spec-diff 42 --section acceptanceCriteria
```

---

## 🔮 Future Enhancements

Coming soon to `leo spec-diff`:

- **Semantic Diff** - Understand meaning changes, not just text
- **Change Annotations** - Link changes to commits/PRs
- **Export Formats** - JSON, Markdown, HTML
- **Visual Diff** - Side-by-side comparison
- **Change Notifications** - Alert team when specs change
- **Diff Templates** - Customizable output formats

---

## 📚 Related Commands

- `leo spec new` - Create new spec issue
- `leo clarify` - Generate clarifying questions
- `leo plan` - Create implementation plan
- `leo tasks create` - Generate task checklists

---

**Track your spec evolution. Understand every change. Build better products.**

`leo spec-diff` - Making requirement changes transparent and traceable 📊
