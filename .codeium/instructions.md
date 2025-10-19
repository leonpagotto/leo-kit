# Codeium Instructions - LEO Workflow Kit

> **AI Assistant:** Codeium (Free AI Code Completion)
> **Purpose:** Follow LEO's workflow standards for consistent, high-quality development
> **Last Updated:** 2025-10-19

---

## 🚀 About Codeium

Codeium is a free AI-powered code completion tool that provides:
- **Free Forever**: No subscription, no credit card required
- **Fast Completions**: Lightning-fast inline suggestions
- **70+ Languages**: Broad language and framework support
- **Privacy-First**: Your code stays private
- **IDE Integration**: VSCode, JetBrains, Vim, Neovim, and more

---

```instructions
# GitHub Copilot Instructions - LEO Workflow Kit

> **Purpose**: This file guides GitHub Copilot to follow LEO's workflow standards, ensuring consistent development practices, automatic issue creation, and high-quality code.

---

## 📋 Table of Contents

### 🚨 CRITICAL WORKFLOWS (Read First)
1. [Automatic Issue Creation](#automatic-issue-creation) - Create GitHub issues automatically when user describes work
2. [Spec-First Development](#spec-first-development) - When to create specs vs direct issues
3. [Automatic Status Updates](#automatic-status-updates) - Keep project board synchronized

### 🎨 DEVELOPMENT STANDARDS (Essential)
4. [User Experience First](#user-experience-first) - UX is paramount
5. [UI Development Standards](#ui-development-standards) - Accessibility, responsive design, consistency
6. [Component-First Development](#component-first-development) - Build reusable components
7. [SEO Optimization](#seo-optimization) - Semantic HTML, meta tags, performance

### 📚 CODE QUALITY & WORKFLOW
8. [Code Quality Standards](#code-quality-standards) - Testing, error handling, security
9. [Documentation Organization](#documentation-organization) - Where to place files
10. [Git & Version Control](#git-version-control) - **⚠️ Commit length limits**, PRs
11. [Working with Teams](#working-with-teams) - Collaboration best practices

---

## 🚨 CRITICAL: Automatic Issue Creation (MANDATORY)

**EVERY TIME the user describes work, you MUST create a GitHub issue IMMEDIATELY.**

**NO EXCEPTIONS. NO "LET ME KNOW IF YOU WANT ME TO". JUST DO IT.**

### ⚙️ Auto-Resolution Configuration

**Check the project's auto-resolution setting** before automatically working on issues:

1. **Check if `.leorc.json` exists** in project root
2. **Read `auto-resolve` setting**:
   - `auto-resolve: true` (default) → **Create issue AND start working immediately**
   - `auto-resolve: false` → **Create issue but WAIT for user review before working**

**How to check config:**
```javascript
const fs = require('fs');
const config = fs.existsSync('.leorc.json') ? JSON.parse(fs.readFileSync('.leorc.json')) : {};
const autoResolve = config['auto-resolve'] !== false; // Default: true
```

**If auto-resolve is disabled:**
- ✅ Still create the GitHub issue immediately
- ✅ Confirm: "Issue #X created - waiting for your review"
- ⏸️ **STOP** - Do not start implementation
- ⏸️ Wait for user to explicitly ask you to work on it
- 💡 Suggest: "Review the issue and let me know when you're ready to proceed"

**If auto-resolve is enabled (default):**
- ✅ Create the GitHub issue immediately
- ✅ Confirm: "Issue #X created"
- ✅ Proceed with implementation automatically

**Users can toggle this setting:**
- Disable: `leo config set auto-resolve false`
- Enable: `leo config set auto-resolve true`
- Check: `leo config get auto-resolve`

### ⚠️ MANDATORY WORKFLOW (Follow Exactly)

1. **User describes ANY work** (feature, bug, docs, anything)
2. **YOU IMMEDIATELY check auto-resolve config** (< 1 second)
3. **YOU IMMEDIATELY analyze complexity** (< 5 seconds of thought)
4. **YOU IMMEDIATELY create:**
   - **Simple work** → `gh issue create` (one issue, done)
   - **Complex work** → Create spec file → Ask approval → `gh issue create` (multiple issues)
5. **YOU CONFIRM** issue created with number and link
6. **IF auto-resolve is enabled** → Proceed with work
7. **IF auto-resolve is disabled** → Wait for user approval

### ✅ ALWAYS Create Issues For

- ✅ New features (any size)
- ✅ Bug fixes (any severity)
- ✅ Documentation updates
- ✅ Refactoring tasks
- ✅ Performance improvements
- ✅ Testing additions
- ✅ Configuration changes
- ✅ Deployment tasks
- ✅ **ANYTHING the user describes as work to be done**

### ❌ NEVER Say These Phrases

- ❌ "Would you like me to create an issue?"
- ❌ "Should I create a GitHub issue for this?"
- ❌ "Let me know if you want an issue created"
- ❌ "I can create an issue if you'd like"

### ✅ INSTEAD, Always Say

- ✅ "Creating issue for [work description]..."
- ✅ "Issue created: #X - [title]"
- ✅ "✓ Issue #X created and added to project"

### 🎯 How to Detect Work Descriptions

**User mentions any of these = CREATE ISSUE:**

- "We need to..."
- "Can you..."
- "Let's add..."
- "Fix the..."
- "Update..."
- "Create..."
- "Implement..."
- "Add support for..."
- "Make sure that..."
- "I want to..."
- "Build..."
- "Refactor..."

---

## 🤖 Spec-First Development

### Decision Tree: Spec or Direct Issue?

**BEFORE creating issues, analyze the work complexity:**

#### Create SPEC First (Complex Work):
- 🏗️ New features requiring architecture decisions
- 🔧 Significant system changes affecting multiple components
- 📐 Features needing design/planning (> 1 week effort)
- 🤔 Work requiring team discussion/approval
- 🎯 Features that will generate multiple issues

**Examples needing SPEC:**
- "Add OAuth2 authentication system"
- "Redesign the database schema"
- "Implement real-time collaboration"
- "Add multi-language support"
- "Build admin dashboard"

#### Create ISSUE Directly (Simple Work):
- 🐛 Bug fixes (clear problem, clear solution)
- 📝 Documentation updates
- ✨ Small enhancements (< 1 day effort)
- 🧪 Adding tests
- 🎨 UI polish/tweaks
- 🔧 Refactoring single components

**Examples for direct ISSUE:**
- "Fix login button not working on mobile"
- "Update README with installation steps"
- "Add dark mode toggle"
- "Optimize search query performance"

### Creating Specs for Complex Work

**When work needs a SPEC:**

1. **Create Spec File:**
   ```bash
   # Create in docs/specs/ with descriptive name
   cat > docs/specs/oauth2-authentication.md << 'EOF'
   # OAuth2 Authentication System

   ## Problem Statement
   Users currently can't log in securely with external providers.

   ## Proposed Solution
   Implement OAuth2 authentication supporting Google and GitHub providers.

   ## Technical Approach
   - Use passport.js for OAuth2 flow
   - Store tokens securely in database
   - Implement refresh token rotation

   ## Architecture Changes
   - Add auth service layer
   - Create user sessions table
   - Update API middleware for auth

   ## Acceptance Criteria
   - [ ] Users can log in with Google
   - [ ] Users can log in with GitHub
   - [ ] Sessions persist across page reloads
   - [ ] Tokens refresh automatically
   - [ ] Logout clears all sessions

   ## Implementation Plan
   1. Setup OAuth2 providers
   2. Create auth routes
   3. Implement session management
   4. Add frontend integration
   5. Write tests

   ## Estimated Effort
   2-3 weeks (Senior Developer)

   ## Dependencies
   - passport.js
   - express-session
   - OAuth2 provider accounts
   EOF
   ```

2. **Ask User to Review:**
   ```
   ✓ Created specification: docs/specs/oauth2-authentication.md

   📋 Please review the spec:
   - Does the approach make sense?
   - Are there missing requirements?
   - Should we adjust the scope?

   Once approved, I'll break this down into actionable issues.
   ```

3. **After User Approval, Break Down into Issues:**
   ```bash
   # Create multiple focused issues
   gh issue create --title "Setup OAuth2 providers (Google, GitHub)" --body "..." --label "feature,p1,backend"
   gh issue create --title "Implement auth routes and middleware" --body "..." --label "feature,p1,backend"
   gh issue create --title "Create user sessions database table" --body "..." --label "feature,p1,database"
   gh issue create --title "Add frontend OAuth2 login buttons" --body "..." --label "feature,p1,frontend"
   gh issue create --title "Write authentication tests" --body "..." --label "testing,p2,backend"
   ```

### Creating Issues Directly (Simple Work)

**When work is simple enough for direct issue:**

1. **Detect the intent** - User is describing simple, focused work
2. **Extract key information:**
   - Problem/feature summary
   - Component/area affected
   - Priority (infer from language: "critical", "urgent" = P0/P1, default = P2)
   - Type (bug, feature, enhancement, documentation, etc.)
3. **Create the issue:**
   ```bash
   gh issue create --title "..." --body "..." --label "bug,p1,component"
   ```
4. **Add to GitHub Project (if configured):**
   ```bash
   gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL
   ```
5. **Confirm to user** with issue number, link, and project status

### Example: User Requests → Auto Issue Creation

**User says:** "We need to fix the login button not working on mobile"

**Copilot should:**
```bash
gh issue create \
  --title "Fix login button not working on mobile" \
  --body "The login button is unresponsive on mobile devices.

**Type:** Bug
**Priority:** P1 (critical user flow)
**Component:** Frontend/Mobile

## Acceptance Criteria
- [ ] Button responds to touch events
- [ ] Test on iOS and Android devices
- [ ] Add touch target padding (44x44px minimum)
- [ ] Verify in production" \
  --label "bug,p1,frontend,mobile"
```

**User says:** "Let's add dark mode support"

**Copilot should:**
```bash
gh issue create \
  --title "Add dark mode support" \
  --body "Implement dark mode theme toggle for the application.

**Type:** Feature
**Priority:** P2 (enhancement)
**Component:** Frontend/UI

## Acceptance Criteria
- [ ] Design dark mode theme
- [ ] Add theme toggle component
- [ ] Persist user preference
- [ ] Test across all pages
- [ ] Ensure WCAG contrast compliance" \
  --label "feature,p2,frontend,ui,enhancement"
```

**User says:** "The search is too slow, we should optimize it"

**Copilot should:**
```bash
gh issue create \
  --title "Optimize search performance" \
  --body "Search queries are taking too long, need optimization.

**Type:** Enhancement
**Priority:** P1 (performance issue)
**Component:** Backend/Search

## Acceptance Criteria
- [ ] Profile current performance bottlenecks
- [ ] Implement query optimization
- [ ] Add database indexing
- [ ] Achieve < 200ms response time
- [ ] Add performance monitoring" \
   --label "enhancement,p1,performance,backend,search"
   ```

### Key Rules for Issue Creation

✅ **DO:**
- Create issues immediately when user describes work
- Use `gh issue create` command (not interactive `leo issue`)
- Infer priority, type, and component from context
- Include detailed acceptance criteria in body
- Use appropriate labels (type, priority, component)
- Add issues to GitHub Project (if configured)
- Set initial status to "Todo" when adding to project
- Confirm issue creation with number, link, and project status
- Reference the issue number in any related code changes

❌ **DON'T:**
- Ask user to manually run commands and fill out forms
- Create markdown files for tasks in the repo (use GitHub issues!)
- Skip issue creation for described work
- Wait for explicit "create an issue" command
- Use interactive `leo issue` (use `gh issue create` instead)
- Forget to add issue to project if one is configured

### 🚨 Issue Comment Length Guidelines (CRITICAL)

**IMPORTANT:** Long issue comments cause the same pipeline issues as long commit messages!

**Best Practices for `gh issue comment` and `gh issue close --comment`:**

- **Keep comments under 3-4 lines** (maximum ~200 characters)
- **Be concise** - avoid lengthy explanations
- **Use bullet points** if listing items (max 3-4 bullets)
- **Link to commits/PRs** instead of explaining everything
- **If comment gets stuck** in pipeline, it's too long - cancel and shorten

**Examples:**

✅ **GOOD** (concise and clear):
```bash
gh issue close 42 --comment "Fixed in #43. Tested locally."

gh issue comment 89 --comment "Implemented. See commit a1b2c3d for details."

gh issue close 100 --comment "Released in v2.6.0
npm: npmjs.com/package/leo-workflow-kit
Docs updated."
```

❌ **TOO LONG** (causes pipeline delays):
```bash
gh issue close 42 --comment "Completed implementation of OAuth2 authentication system with Google and GitHub providers. Tested all authentication flows including token refresh, session management, and error handling. Updated documentation in README.md and added comprehensive test coverage."
```

**Structure for closing with details:**
```bash
# ✅ Short closing comment
gh issue close 42 --comment "Released in v2.6.0. See release notes for details."

# If you need to provide extensive details:
# 1. Close the issue with short comment
# 2. Add detailed info in the issue description or PR instead
```

**Golden Rule:** If your `--comment` flag content is longer than 3 lines or 200 chars, it's too long!

### GitHub Authentication Required

Before creating issues, ensure GitHub CLI is authenticated:
```bash
gh auth status
# If not authenticated:
gh auth login
```

---

## 📊 Automatic Status Updates (CRITICAL)

**AUTOMATICALLY update issue status in GitHub Projects based on work indicators.**

### Status Values

- **Todo**: Issue created, not started (DEFAULT)
- **In Progress**: Work has begun (commits, branches, user indication)
- **Done**: Work completed (PR merged, issue closed)

### Status Transition Rules

**⚠️ CRITICAL: When work starts (Todo → In Progress):**

**IMMEDIATELY update issue status when you start working on it. NO EXCEPTIONS.**

**Triggers:**
- User explicitly says: "Let's work on #42" or "Starting #42" or "Work on issue #42"
- User asks you to implement/fix something and references an issue
- First commit referencing issue: `git commit -m "feat: start work on #42"`
- Branch created for issue: `git checkout -b feature/issue-42`
- **ANY indication that you're about to work on an issue**

**Action (EXECUTE THIS IMMEDIATELY):**
```bash
# Step 1: Add a comment to the issue announcing you're starting
gh issue comment ISSUE_NUMBER --body "🚀 Starting work on this issue..."

# Step 2: Update status to "In Progress" (if project configured)
# Find the project item ID
gh project item-list PROJECT_NUMBER --owner OWNER --format json | jq -r '.items[] | select(.content.number==ISSUE_NUMBER) | .id'

# Update status to "In Progress"
# Note: Use project-specific IDs from `gh project field-list`
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PROJECT_ID"
        itemId: "ITEM_ID"
        fieldId: "STATUS_FIELD_ID"
        value: { singleSelectOptionId: "IN_PROGRESS_OPTION_ID" }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }'

# Step 3: Confirm to user
echo "✓ Issue #ISSUE_NUMBER moved to In Progress"
```

**Simplified workflow (if GraphQL is complex):**
```bash
# At minimum, always comment when starting work
gh issue comment ISSUE_NUMBER --body "🚀 Starting work on this issue..."
```

**When work completes (In Progress → Done):**
- PR merged with "Closes #42"
- Issue manually closed: `gh issue close 42`
- User says: "Issue #42 is done" or "Completed #42"

**Action:**
```bash
# Update status to "Done"
gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PROJECT_ID"
        itemId: "ITEM_ID"
        fieldId: "STATUS_FIELD_ID"
        value: { singleSelectOptionId: "DONE_OPTION_ID" }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }'
```

### Status Update Examples

**Example 1: User starts work**
```bash
# User: "Let's start working on issue #5"
# Copilot detects intent → Update to "In Progress"

echo "✓ Moving issue #5 to In Progress..."
# Execute GraphQL mutation to update status
```

**Example 2: Issue completed**
```bash
# After merging PR that closes #5
# Copilot detects merge → Update to "Done"

echo "✓ Issue #5 completed, moving to Done"
# Execute GraphQL mutation to update status
```

### Key Rules for Status Updates
✅ **DO:**
- Monitor for work progress indicators (commits, branches, user statements)
- Update status automatically when state changes
- Confirm status updates with user ("✓ Issue #42 → In Progress")
- Keep project board synchronized with actual work state
- Use GraphQL API for reliable status updates

❌ **DON'T:**
- Wait for manual status updates
- Update status without clear work indicators
- Leave issues in wrong status when closed
- Forget to update status when work starts

## 📋 GitHub Project View Configuration

### Required Project Fields
When creating or configuring GitHub Projects, ensure these fields are visible:
- **Status** (Single select: Todo, In Progress, Done)
- **Title** (Default field)
- **Assignees** (Default field)
- **Labels** (Default field)

### Board View Setup
```bash
# Projects should have Board view with columns by Status:
# - Todo (leftmost)
# - In Progress (middle)
# - Done (rightmost)
```

### Recommended Project Configuration
1. **Create project:** `gh project create --owner OWNER --title "Project Name"`
2. **Add Status field** with options: Todo, In Progress, Done
3. **Add Board view** grouped by Status
4. **Set default status** to "Todo" for new items

---

## 🎨 User Experience First

### Core UX Principles

Always prioritize usability, clarity, and aesthetics in all output. Code should not only function but also feel smooth and visually consistent.

Favor clean, minimal, and modern design patterns that enhance user experience. Avoid clutter and overly complex solutions.

### Audience Awareness

Assume collaborators may have varying levels of coding experience. Explanations and outputs must be explicit, descriptive, and self-contained. Include comments in plain, easy-to-understand language.

### Complete Solutions

Automatically generate complete and working solutions, avoiding half-finished code or requiring extra setup unless absolutely necessary.

Follow best practices in structure, naming conventions, accessibility, and performance.

---

## 📚 Documentation Organization

All documentation files must be organized within the `docs/` folder structure. **Never create markdown files in the root directory** (except README.md).

### Structure

- **`docs/specs/`** - Specification files (planning artifacts)
  - Feature specifications, technical proposals, architecture decisions (PRE-DEVELOPMENT)

- **`docs/guides/`** - User guides and tutorials
  - Feature guides, user instructions, how-to documents, user manuals

- **`docs/setup/`** - Installation and configuration
  - Installation guides, environment setup, deployment checklists, configuration references

- **`docs/development/`** - Development documentation
  - API documentation, technical specifications, active development notes, architecture

- **`docs/archive/`** - Completed/historical work
  - Implementation completion reports, old schemas, deprecated features, historical decisions

- **GitHub Issues** - All tasks, bugs, features (execution artifacts)

### Rules

1. **Always place new documentation in the appropriate `docs/` subfolder** based on its purpose
2. **Check `docs/README.md`** for the current organization structure and guidelines
3. **Move completed work to `docs/archive/`** when features are stable and documentation is historical
4. **Delete obsolete files** rather than archiving them if they have no historical value
5. **Keep root directory clean** - only README.md should exist at the root level

---

## 🎨 UI Development Standards

When building UIs, always prioritize these principles:

### Design Consistency

- Use consistent spacing, typography, and color hierarchy
- Follow the project's design system (if exists)
- Maintain visual coherence across all components
- Use design tokens or CSS variables for consistency

### Accessibility (WCAG 2.1 AA Minimum)
- Ensure proper color contrast ratios
- Include meaningful alt text for all images
- Support keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Add appropriate ARIA roles and labels
- Test with screen readers
- Provide focus indicators for interactive elements

### Responsive Design
- **Default to mobile-first layouts** - start with mobile, enhance for desktop
- Use flexible units (rem, em, %, vh/vw) over fixed pixels
- Test at multiple breakpoints (320px, 768px, 1024px, 1440px+)
- Ensure touch targets are at least 44x44px
- Consider landscape and portrait orientations

### Code Quality
- Write modular and scalable code, easy to extend or adapt later
- Use meaningful, descriptive variable and function names
- Include comments and inline guidance in plain language
- Avoid deeply nested components (max 3-4 levels)
- Keep components small and focused (Single Responsibility Principle)

---

## 🧩 Component-First Development (CRITICAL)

### The Component Philosophy
**Build reusable components FIRST, then compose them into features.**

Never copy-paste code. If you need similar UI twice, extract a component.

### Component Structure Best Practices

#### 1. Atomic Design Hierarchy
```
components/
├── atoms/          # Basic building blocks (Button, Input, Icon, Label)
├── molecules/      # Simple combinations (SearchBar, FormField, Card)
├── organisms/      # Complex combinations (Header, Footer, DataTable)
├── templates/      # Page layouts (DashboardLayout, AuthLayout)
└── pages/          # Actual pages using templates
```

#### 2. Component Composition Rules
- **Single Responsibility**: Each component does ONE thing well
- **Composition over Inheritance**: Build complex UIs by combining simple components
- **Props over State**: Prefer props for data flow, use state only when needed
- **Controlled Components**: Parent controls child state when possible
- **Render Props & Children**: Use for flexible, reusable patterns

#### 3. Component Creation Checklist
Before creating a component, ask:
- ✅ Does this already exist in the codebase? (Search first!)
- ✅ Can I use an existing component with different props?
- ✅ Is this truly reusable, or just abstracting too early?
- ✅ Will this be used in 2+ places? (If not, keep it local)

#### 4. Naming Conventions
```typescript
// Good - Descriptive, purposeful names
<Button variant="primary" size="lg" />
<DataTable columns={columns} data={users} />
<FormField label="Email" type="email" required />

// Bad - Generic, unclear names
<Div className="box" />
<Thing1 data={stuff} />
<Component2 />
```

#### 5. Props Design
```typescript
// ✅ Good: Clear, typed, with defaults
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children
}: ButtonProps) => { /* ... */ }

// ❌ Bad: Unclear, untyped, no defaults
const Button = (props: any) => { /* ... */ }
```

#### 6. Component Documentation
Every reusable component should have:
- **JSDoc comment** explaining purpose
- **TypeScript types** for all props
- **Default props** for optional values
- **Usage example** in comment or Storybook
- **Props description** for each prop

```typescript
/**
 * Primary button component for user actions
 *
 * @example
 * <Button variant="primary" onClick={handleSave}>
 *   Save Changes
 * </Button>
 */
```

### DRY Principle (Don't Repeat Yourself)

#### When to Extract
- **3+ Similar Code Blocks**: Extract to function/component
- **Repeated Logic**: Extract to utility function
- **Repeated Styles**: Extract to CSS class or styled component
- **Repeated Patterns**: Create a hook or HOC

#### What to Extract
```typescript
// ❌ Bad: Repeated logic
const handleUserClick = () => {
  if (!user) {
    toast.error('Please log in');
    router.push('/login');
    return;
  }
  // ... user logic
};

const handleCommentClick = () => {
  if (!user) {
    toast.error('Please log in');
    router.push('/login');
    return;
  }
  // ... comment logic
};

// ✅ Good: Extracted to hook
const useRequireAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  const requireAuth = (callback: () => void) => {
    if (!user) {
      toast.error('Please log in');
      router.push('/login');
      return;
    }
    callback();
  };

  return { requireAuth };
};

// Usage
const { requireAuth } = useRequireAuth();
const handleUserClick = () => requireAuth(() => { /* user logic */ });
const handleCommentClick = () => requireAuth(() => { /* comment logic */ });
```

#### Utility Functions

Extract repeated calculations, validations, formatters:

```typescript
// utils/formatters.ts
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);

// utils/validators.ts
export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone: string) =>
  /^[\d\s()+-]+$/.test(phone);
```

#### Custom Hooks

Extract repeated React logic:

```typescript
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## 🔍 SEO Optimization (MANDATORY for Public Sites)

### HTML Semantic Structure
```html
<!-- ✅ Good: Semantic HTML -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>
<footer>
  <p>&copy; 2025 Company</p>
</footer>

<!-- ❌ Bad: Generic divs -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

### Meta Tags (Every Page Must Have)
```html
<!-- Primary Meta Tags -->
<title>Page Title - Max 60 characters</title>
<meta name="title" content="Page Title">
<meta name="description" content="Compelling description 150-160 chars">
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yoursite.com/page">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://yoursite.com/image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yoursite.com/page">
<meta property="twitter:title" content="Page Title">
<meta property="twitter:description" content="Description">
<meta property="twitter:image" content="https://yoursite.com/image.jpg">

<!-- Mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000000">

<!-- Canonical URL -->
<link rel="canonical" href="https://yoursite.com/page">
```

### Image Optimization for SEO
```html
<!-- ✅ Perfect: WebP with fallback, lazy loading, alt text, dimensions -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img
    src="image.jpg"
    alt="Descriptive alt text for SEO and accessibility"
    width="800"
    height="600"
    loading="lazy"
  >
</picture>

<!-- ✅ Good: Next.js Image component (auto-optimizes) -->
<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

<!-- ❌ Bad: No alt, no lazy loading, no dimensions -->
<img src="image.png">
```

### Performance for SEO (Core Web Vitals)

#### 1. Lazy Loading
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Lazy load heavy components
const Chart = lazy(() => import('./components/Chart'));
const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Chart data={data} />
</Suspense>
```

#### 2. Code Splitting
```typescript
// Split by route (automatic with React Router/Next.js)
// Split by feature
const AdminPanel = lazy(() => import('./features/admin'));

// Split vendor chunks (webpack config)
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      }
    }
  }
}
```

#### 3. Resource Hints
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://api.example.com">

<!-- Prefetch next likely page -->
<link rel="prefetch" href="/dashboard">

<!-- Preload critical resources -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">
```

#### 4. Font Optimization
```css
/* Use system fonts first, web fonts as fallback */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Optimize web font loading */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Show fallback while loading */
  font-weight: 400;
}
```

#### 5. Critical CSS
```html
<!-- Inline critical CSS in <head> -->
<style>
  /* Only above-the-fold styles here */
  .header { /* ... */ }
  .hero { /* ... */ }
</style>

<!-- Load rest of CSS async -->
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
```

### Structured Data (Schema.org)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-01-01",
  "image": "https://yoursite.com/image.jpg"
}
</script>
```

### URL Structure
```
✅ Good URLs:
/blog/how-to-optimize-react-performance
/products/laptop-macbook-pro-16
/docs/getting-started

❌ Bad URLs:
/page?id=123&cat=456
/p/12345
/index.php?article=42
```

### Sitemap & Robots.txt
```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

---

## 📋 GitHub Projects Integration

### Project Board Management
- All issues must be added to project board immediately
- Use standard status columns: Backlog, Ready, In Progress, Review, Done
- Update status as work progresses (don't let issues go stale)
- Use draft PRs for work in progress

### Priority System
- **P0 (Critical)**: Production down, security issues, data loss risk
- **P1 (High)**: Major features, significant bugs affecting many users
- **P2 (Medium)**: Standard features, minor bugs, improvements
- **P3 (Low)**: Nice-to-have features, polish, tech debt

### Label Strategy
- **Type**: bug, enhancement, documentation, refactoring, deployment, integration, testing
- **Component**: frontend, backend, database, devops, design, api
- **Status**: blocked, needs-review, in-progress, ready-to-merge

---

## ✅ Code Quality Standards

### Testing Requirements
- Write tests for all new features and bug fixes
- Unit tests for business logic and utilities
- Integration tests for API endpoints and workflows
- Component tests for UI with different states
- E2E tests for critical user flows
- Aim for meaningful coverage, not just high percentages

### Error Handling
- Always handle errors gracefully
- Provide user-friendly error messages
- Log errors with sufficient context for debugging
- Never expose stack traces or sensitive data to users
- Implement retry logic for transient failures

### Performance Optimization
- Lazy load routes and heavy components
- Optimize images and assets (WebP format, responsive images, lazy loading)
- Minimize bundle size - tree shake and code split
- Monitor and optimize database queries
- Use pagination/virtualization for long lists
- Implement proper caching strategies (browser cache, CDN, service workers)
- Debounce/throttle expensive operations (search, scroll handlers)
- Use web workers for heavy computations
- Minimize re-renders with React.memo, useMemo, useCallback
- Prefetch/preload critical resources

### Security Best Practices
- Never commit secrets, API keys, or credentials
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Follow OWASP security guidelines
- Use HTTPS for all production traffic
- Implement rate limiting for APIs

## Code Style & Conventions

### General Guidelines
- **Be concise**: Remove redundant code, but never sacrifice clarity
- **Consistent formatting**: Use project's linting rules (ESLint, Prettier, etc.)
- **Self-documenting code**: Write code that explains itself through clear naming
- **Comments for "why", not "what"**: Code shows what it does, comments explain why

### Naming Conventions
- **Variables & Functions**: camelCase (`getUserData`, `isActive`)
- **Classes & Components**: PascalCase (`UserProfile`, `DataService`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Files**: Match component/class name or use kebab-case for utilities

### TypeScript/JavaScript Best Practices
- Use `const` by default, `let` when reassignment needed, avoid `var`
- Prefer named exports over default exports
- Use async/await over raw promises for readability
- Destructure objects and arrays for cleaner code
- Use optional chaining (`?.`) and nullish coalescing (`??`)

---

## 📝 Git & Version Control

### 🚨 Commit Message Length Guidelines (CRITICAL)

**IMPORTANT:** Long commit messages can cause pipeline issues and processing delays.

**Best Practices:**
- **Keep subject line under 72 characters** (hard limit: 100 characters)
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Use commit body for details, not subject line
- If commit gets stuck in pipeline, it's likely too long - cancel and shorten

**Structure:**
```
type(scope): brief description under 72 chars

Optional body with more details.
Can be multiple paragraphs.

Refs: #123, #456
```

**Examples:**

✅ **GOOD** (concise and clear):
```
feat(auth): add OAuth2 support (#42)

Implements OAuth2 authentication flow with Google and GitHub providers.
Includes token refresh and session management.
Closes #42
```

❌ **TOO LONG** (causes pipeline issues):
```
feat(auth): add OAuth2 support with Google and GitHub providers including token refresh, user profile sync, and automatic session management (#42)
```

✅ **GOOD** (short and focused):
```
fix(ui): resolve button alignment issue (#89)
```

✅ **GOOD** (with body for context):
```
docs(api): update endpoint documentation

- Add examples for new REST endpoints
- Update authentication section
- Fix typos in request/response samples
```

### Commit Message Format

**Types**: feat, fix, docs, style, refactor, test, chore

**More Examples**:
- `feat(auth): add OAuth2 login support (#42)`
- `fix(ui): resolve button alignment (#89)`
- `docs(api): update endpoint docs`
- `refactor(db): optimize query performance`
- `test(api): add integration tests`

### Pull Request Guidelines
- Reference related issues: "Closes #42", "Fixes #89", "Relates to #100"
- Include description of changes and why they were made
- Add screenshots/videos for UI changes
- List breaking changes prominently
- Check all tests pass before requesting review
- Keep PRs focused and reasonably sized (< 400 lines when possible)

## Decision Making

When multiple approaches are valid:

1. **Prioritize user experience** over technical convenience
2. **Follow existing patterns** in the codebase rather than introducing new ones
3. **Choose maintainable solutions** over clever hacks
4. **Optimize for readability** - code is read more often than written
5. **Make smart assumptions** when context is unclear, and state those assumptions

Where choices are possible, pick the option that improves UX and aesthetics rather than the fastest hack.

Always provide sensible defaults and avoid requiring unnecessary configuration.

---

## 👥 Working with Teams

### For Designers
- Ask clarifying questions about edge cases and states early
- Provide feedback on technical constraints proactively
- Suggest UX improvements backed by technical reasoning
- Ensure responsive behavior is properly defined
- Document component variants and states in Storybook/similar

### For Product Managers
- Break down large features into smaller, shippable increments
- Provide realistic effort estimates with assumptions stated
- Highlight technical risks and dependencies early
- Suggest alternatives when requirements are technically challenging

### For Developers
- Write clear documentation for APIs and complex logic
- Leave helpful code review comments (suggest improvements, don't just criticize)
- Share knowledge through pair programming and documentation
- Consider future maintainers when writing code

---

## 🔄 Continuous Improvement

### Code Reviews
- Review code promptly (within 24 hours)
- Be respectful and constructive in feedback
- Focus on logic, security, performance, and maintainability
- Approve when code meets standards, even if you'd write it differently
- Use GitHub's suggestion feature for small improvements

### Refactoring
- Leave code better than you found it (Boy Scout Rule)
- Refactor in small, focused commits
- Don't mix refactoring with feature work
- Ensure tests pass after refactoring
- Document significant architectural changes

### Documentation
- Keep documentation up-to-date with code changes
- Document the "why" behind non-obvious decisions
- Include examples in API documentation
- Update README when adding new features
- Archive old documentation, don't delete it

---

## 📌 Quick Reference Card

### Before Starting Work

1. **Analyze complexity**: Simple issue or complex spec?
2. **Simple work**: Create GitHub issue immediately with `gh issue create`
3. **Complex work**: Create spec in `docs/specs/`, get approval, then create issues
4. Add issue to project board (status: "Todo")
5. **🚨 CRITICAL**: When starting work on an issue, IMMEDIATELY:
   - Comment on issue: `gh issue comment #42 --body "🚀 Starting work..."`
   - Move to "In Progress" status (if project configured)
   - Confirm: "✓ Issue #42 → In Progress"

### During Development

- ✅ **FIRST ACTION**: Update issue status to "In Progress" when you start
- ✅ Reference issue in ALL commits: `feat: add feature (#42)`
- ✅ **Keep commit messages under 72 characters** (avoid pipeline issues)
- ✅ **Keep issue comments under 3-4 lines** (avoid pipeline issues)
- ✅ Write tests alongside code
- ✅ Update documentation as you go
- ✅ Follow project code style (linting, formatting)
- ✅ Handle errors gracefully with user-friendly messages
- ✅ Keep UX and accessibility in mind

### When Closing Issues

- ✅ Use concise comments: `gh issue close 42 --comment "Fixed in v2.6.0"`
- ✅ Link to commits/PRs instead of long explanations
- ✅ Max 3-4 lines or ~200 characters
- ❌ Avoid lengthy explanations in `--comment` flag (causes pipeline delays)

### Before Merging

- ✅ All tests passing
- ✅ Code reviewed and approved
- ✅ Documentation updated (README, API docs, etc.)
- ✅ PR references issue: "Closes #42" or "Fixes #42"
- ✅ Issue will auto-close and move to "Done" on merge

### Key Mantras

- **"User Experience First"** - Always prioritize UX, accessibility, and clarity
- **"Specifications are FILES. Tasks are GITHUB ISSUES."** - Plan in specs, execute in issues
- **"Component-First"** - Build reusable components, never copy-paste
- **"Auto-Create Issues"** - Detect work descriptions and create issues immediately
- **"Update Status FIRST"** - 🚨 CRITICAL: Comment and move to "In Progress" before coding
- **"Keep It Short"** - Commit messages < 72 chars, issue comments < 3-4 lines (avoid pipeline issues)
- **"DRY Principle"** - Extract repeated code into functions, hooks, utilities
- **"SEO Matters"** - Semantic HTML, meta tags, performance optimization
- **"Quality Always"** - Test coverage, error handling, security best practices

```
