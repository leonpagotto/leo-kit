# Testing Automatic Issue Creation

## Date: October 19, 2025

## Test Results ✅

### Setup Verification

- ✅ GitHub CLI authenticated (`leonpagotto`)
- ✅ Repository: `leonpagotto/leo-kit`
- ✅ Can create issues via `gh issue create`
- ✅ Issues visible in GitHub

### Test Issue Created

**Issue #3:** Test: Verify automatic issue creation works
**URL:** https://github.com/leonpagotto/leo-kit/issues/3
**Status:** ✅ Created successfully

## How Copilot Should Create Issues

### Current Approach (What Copilot Should Use)

When user describes work, Copilot should use `gh issue create` directly:

```bash
gh issue create \
  --title "Issue title from user description" \
  --body "Detailed description with acceptance criteria" \
  --label "bug,p1" \
  --assignee "@me"
```

### Example: User Says "Fix the login button on mobile"

**Copilot should run:**

```bash
gh issue create \
  --title "Fix login button not working on mobile" \
  --body "The login button is unresponsive on mobile devices.

**Component:** Frontend/Mobile
**Priority:** P1 (critical user flow)

## Acceptance Criteria
- [ ] Button responds to touch events
- [ ] Test on iOS devices
- [ ] Test on Android devices
- [ ] Add touch target padding (44x44px minimum)

## Technical Details
- Likely CSS or touch event handler issue
- Check viewport settings
- Verify button z-index" \
  --label "bug,p1,frontend,mobile"
```

**Result:**

```
Creating issue in leonpagotto/leo-kit

https://github.com/leonpagotto/leo-kit/issues/4
```

## Why `gh issue create` Instead of `leo issue`

### ✅ Advantages of `gh issue create`:

1. **Non-interactive by default** - Works with automation
2. **Simple syntax** - Easy for Copilot to construct
3. **Direct to GitHub** - No intermediate processing
4. **Well-documented** - Standard GitHub CLI tool
5. **Reliable** - Battle-tested by GitHub

### ❌ Problems with `leo issue`:

1. **Interactive prompts** - Requires user input (inquirer)
2. **Non-interactive mode has bugs** - Missing description handling
3. **More complex** - Extra layer of abstraction
4. **Harder to automate** - Not designed for programmatic use

## Updated Copilot Instructions

The Copilot instructions should be updated to use `gh issue create` instead of `leo issue`.

### Example Pattern:

**User intent detected:** "We need to add dark mode"

**Copilot action:**

1. Extract information:

   - Type: Feature
   - Title: "Add dark mode support"
   - Priority: P2 (enhancement)
   - Component: Frontend/UI

2. Construct command:

```bash
gh issue create \
  --title "Add dark mode support" \
  --body "Implement dark mode theme toggle for the application.

**Type:** Feature
**Priority:** P2
**Component:** Frontend/UI

## Acceptance Criteria
- [ ] Design dark mode theme
- [ ] Add theme toggle component
- [ ] Persist user preference
- [ ] Test across all pages
- [ ] Ensure WCAG contrast compliance

## Technical Approach
- Use CSS variables for theming
- Store preference in localStorage
- Add toggle to settings/header" \
  --label "feature,p2,frontend,ui,enhancement"
```

3. Execute and confirm:

```
✅ Issue #5 created: Add dark mode support
🔗 https://github.com/leonpagotto/leo-kit/issues/5
```

## Testing Commands

### Test 1: Simple Issue

```bash
gh issue create \
  --title "Test issue from automation" \
  --body "This is a test" \
  --label "testing,p3"
```

### Test 2: Complete Issue

```bash
gh issue create \
  --title "Optimize dashboard loading performance" \
  --body "Dashboard page has slow loading times.

## Problem
Initial load takes 5+ seconds

## Acceptance Criteria
- [ ] Profile performance bottlenecks
- [ ] Implement lazy loading
- [ ] Optimize database queries
- [ ] Achieve < 2s load time" \
  --label "enhancement,p1,performance,frontend"
```

### Test 3: Bug Report

```bash
gh issue create \
  --title "Search results showing duplicates" \
  --body "Search functionality is displaying duplicate entries.

## Steps to Reproduce
1. Navigate to search page
2. Enter any search term
3. Observe duplicate results

## Expected
Unique results only

## Actual
Duplicate entries appear

## Acceptance Criteria
- [ ] Identify root cause
- [ ] Implement deduplication
- [ ] Add tests
- [ ] Verify in production" \
  --label "bug,p1,backend,search"
```

## Verification Steps

### 1. Check issue was created:

```bash
gh issue list --limit 5
```

### 2. View specific issue:

```bash
gh issue view 3
```

### 3. Check on GitHub:

```
https://github.com/leonpagotto/leo-kit/issues
```

## Current Issues in Repository

```bash
$ gh issue list

ID  TITLE                                             LABELS
#3  Test: Verify automatic issue creation works       P3, testing
#1  Add architecture and workflow diagrams to README
```

## Recommendations

### 1. Update Copilot Instructions

Change from:

```bash
leo issue
# → Requires interactive input ❌
```

To:

```bash
gh issue create --title "..." --body "..." --label "..."
# → Works non-interactively ✅
```

### 2. Fix `leo issue` Non-Interactive Mode (Optional)

If we want to keep `leo issue` for automated use:

- Add description parameter
- Handle missing description gracefully
- Add comprehensive testing

### 3. Document the Process

- Update README with examples
- Add to developer guide
- Create issue creation guide

## Summary

✅ **GitHub issue creation works!**
✅ **Command:** Use `gh issue create`
✅ **Test successful:** Issue #3 created
❌ **Current problem:** Copilot instructions use `leo issue` which is interactive
🔧 **Solution:** Update instructions to use `gh issue create` directly

**Next Step:** Update Copilot instructions template to use `gh issue create`
