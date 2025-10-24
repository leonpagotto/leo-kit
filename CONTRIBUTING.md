# Contributing to LEO Kit

**Thank you for your interest in contributing to LEO Kit!**

---

## Welcome Contributors! 👋

LEO Kit is an open-source project and we welcome contributions from everyone:

- 👩‍💻 **Developers** - Help build features and fix bugs
- 📝 **Writers** - Improve documentation
- 🎨 **Designers** - Create beautiful interfaces
- 🧪 **QA Engineers** - Test and report issues
- 💡 **Ideas** - Share suggestions and feedback

---

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+
- Git 2.0+
- GitHub account (fork and PR)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/leo-kit.git
   cd leo-kit
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/leonpagotto/leo-kit.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Verify setup**
   ```bash
   npm test      # Should pass all tests
   leo --version # Should show version
   ```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming convention:**
- `feat/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Code refactor
- `chore/` - Maintenance

### 2. Make Your Changes

**Code style:**
- Use 2-space indentation
- Camelcase for variables
- SCREAMING_SNAKE_CASE for constants
- Descriptive names

**Example:**
```javascript
// Good
const maxRetries = 3;
const getUserById = async (id) => { /* ... */ };

// Bad
const mr = 3;
const get_user_by_id = async (id) => { /* ... */ };
```

### 3. Write Tests

**Add tests for:**
- New features
- Bug fixes
- API changes

**Run tests:**
```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # With coverage
```

**Test requirements:**
- 80%+ code coverage
- All tests passing
- No console warnings

### 4. Update Documentation

**Update:**
- README.md (if external API changes)
- Inline code comments
- JSDoc for public methods
- Related guides in docs/

**Example JSDoc:**
```javascript
/**
 * Generate code from specification.
 * @param {Object} spec - Specification object
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generated code files
 * @throws {Error} If specification invalid
 */
async function generateCode(spec, options) {
  // implementation
}
```

### 5. Commit Your Changes

**Commit message format:**
```
type(scope): brief description (#issue)

Optional detailed explanation.
Can be multiple paragraphs.

Closes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactor
- `chore` - Maintenance

**Examples:**
```bash
git commit -m "feat(spec): add code generation (#42)"
git commit -m "fix(api): resolve timeout issue (#89)"
git commit -m "docs(setup): improve installation guide"
```

**Keep it short:**
- Subject under 72 characters
- Describe what changed, not why (unless complex)
- Reference issue number

### 6. Push to Your Fork

```bash
git push origin feat/your-feature-name
```

### 7. Create Pull Request

**On GitHub:**
1. Click "New Pull Request"
2. Choose your branch → `main`
3. Fill in PR template
4. Click "Create Pull Request"

**PR Title Format:**
```
Brief description of changes (#issue)
```

**PR Description Template:**
```markdown
## What
Brief description of what was changed.

## Why
Explain the reason for this change.

## How
Describe how the change works.

## Testing
How to test this change.

## Checklist
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows code style

Closes #123
```

---

## Code Review Process

### What Happens Next

1. **Automated Checks**
   - Tests must pass
   - Code coverage checked
   - Linting verified
   - No conflicts

2. **Manual Review**
   - Code quality review
   - Architecture review
   - Performance review
   - Security review

3. **Feedback**
   - Constructive comments
   - Suggestions for improvement
   - Questions about implementation

4. **Approval & Merge**
   - Approval from maintainers
   - Squash and merge
   - Issue auto-closed
   - Released in next version

### Responding to Feedback

**Be Respectful:**
- Thank reviewers for feedback
- Ask clarifying questions
- Explain your approach
- Be open to suggestions

**Make Changes:**
- Address all feedback
- Push new commits
- Don't force-push
- Request re-review

---

## Types of Contributions

### 🐛 Bug Reports

**Found a bug?**

1. Check if already reported in issues
2. Create new issue with:
   - Clear title
   - Reproduction steps
   - Expected vs actual behavior
   - System info (OS, Node version)
   - Error messages

**Bug Report Template:**
```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Do this
2. Then do this
3. See the bug

## Expected Behavior
What should happen.

## Actual Behavior
What actually happened.

## Environment
- OS: macOS 12.6
- Node: 18.0.0
- LEO Kit: 5.0.0

## Error Message
```
Error message here
```
```

### ✨ Feature Requests

**Have an idea?**

1. Check existing issues/discussions
2. Create issue with:
   - Clear title describing feature
   - Problem it solves
   - Proposed solution
   - Alternative approaches
   - Example use case

**Feature Request Template:**
```markdown
## Description
What is the feature?

## Problem
What problem does it solve?

## Solution
How should it work?

## Example
How would someone use it?

## Alternatives
Other ways to solve it?
```

### 📚 Documentation

**Improve documentation:**

1. Fork and clone repo
2. Edit markdown files in `docs/`
3. Test links and formatting
4. Submit PR with changes

**Documentation guidelines:**
- Clear and concise
- Practical examples
- Accurate and up-to-date
- Consistent formatting
- Linked references

### ✅ Code Reviews

**Help review PRs:**

1. Read the PR description
2. Review code changes
3. Test the changes locally
4. Provide constructive feedback
5. Approve or request changes

**Review checklist:**
- ✅ Code correctness
- ✅ Tests included
- ✅ Documentation updated
- ✅ No console warnings
- ✅ Performance considered
- ✅ Security reviewed

### 🧪 Testing

**Add test coverage:**

1. Identify untested code
2. Write comprehensive tests
3. Verify coverage increased
4. Submit PR with tests

**Test guidelines:**
- Test happy path
- Test error cases
- Test edge cases
- Use descriptive names
- Use assertions clearly

---

## Project Structure

```
leo-kit/
├── bin/                    # CLI entry point
├── lib/
│   ├── commands/          # CLI commands
│   ├── spec/              # Specification system
│   ├── plugins/           # Plugin system
│   ├── generators/        # Code generators
│   ├── team/              # Team/API features
│   └── utils/             # Utilities
├── tests/                 # Test files
├── docs/                  # Documentation
├── package.json           # Dependencies
└── README.md              # Project readme
```

### Key Files

- `lib/spec/manager.js` - Core specification manager
- `lib/commands/spec.js` - Spec CLI commands
- `lib/team/api-server.js` - REST API server
- `tests/team/api-server.test.js` - API tests
- `tests/spec/workflow.e2e.test.js` - E2E tests

---

## Code Style

### JavaScript Standards

**Formatting:**
- 2-space indentation
- Single quotes for strings
- Semicolons required
- No trailing commas

**Naming:**
- Constants: `SCREAMING_SNAKE_CASE`
- Variables: `camelCase`
- Functions: `camelCase`
- Classes: `PascalCase`
- Private methods: `_methodName`

**Functions:**
```javascript
// Arrow functions for callbacks
const multiply = (a, b) => a * b;

// Regular functions for declarations
function addNumbers(a, b) {
  return a + b;
}

// Async functions
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}
```

**Comments:**
```javascript
// Inline comment for single line
// Use // not /* */ for clarity

/**
 * JSDoc for public functions.
 * @param {Type} param - Description
 * @returns {Type} Description
 */
function publicMethod(param) {
  // implementation
}
```

### Git Commit Style

**Format:**
```
type(scope): subject

body

footer
```

**Example:**
```bash
git commit -m "feat(spec): add code generation

Implement Claude 3.5 Sonnet integration for automatic code generation.
Users can now run 'leo spec implement' to generate production code.

- Add AICodeGenerator class
- Integrate Anthropic SDK
- Add error handling
- Update tests

Closes #42"
```

---

## Testing Guide

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- tests/team/api-server.test.js

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# Specific test by name
npm test -- --testNamePattern="should create user"
```

### Writing Tests

**Use Jest syntax:**
```javascript
describe('SpecificationManager', () => {
  let manager;

  beforeEach(() => {
    manager = new SpecificationManager();
  });

  it('should initialize specification', async () => {
    const result = await manager.init('test');
    expect(result).toBeDefined();
    expect(result.name).toBe('test');
  });

  it('should throw error if already exists', async () => {
    await manager.init('test');
    await expect(manager.init('test')).rejects.toThrow();
  });
});
```

### Test Coverage

Current coverage:
- API Server: 23/23 tests ✅
- E2E Tests: 26/26 tests ✅
- **Total: 49/49 tests ✅**

Target: 85%+ coverage for new code

---

## Release Process

### Version Numbers

LEO Kit uses semantic versioning: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes (1.0.0 → 2.0.0)
- `MINOR` - New features, backward compatible (1.0.0 → 1.1.0)
- `PATCH` - Bug fixes (1.0.0 → 1.0.1)

### Release Checklist

Before each release:
- [ ] All tests passing (49/49)
- [ ] Coverage verified (85%+)
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] npm published

### Creating a Release

Maintainers only:
```bash
# Update version
npm version minor

# Build and test
npm test
npm run build

# Publish
npm publish

# Create GitHub release
git push --tags
```

---

## Communication

### Getting Help

- **Issues:** GitHub Issues for bugs/features
- **Discussions:** GitHub Discussions for questions
- **Email:** support@leokit.dev
- **Discord:** Join our community server

### Code of Conduct

Be respectful and inclusive:
- Respect different opinions
- Support fellow contributors
- No harassment or discrimination
- Report issues to maintainers

---

## Useful Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run specific test
npm test -- test-name

# Watch mode
npm test -- --watch

# Code coverage
npm test -- --coverage

# Run CLI locally
npm link
leo spec init test

# Start development server
leo dashboard start

# View logs
npm test -- --verbose
```

---

## Resources

- **GitHub:** https://github.com/leonpagotto/leo-kit
- **Issues:** https://github.com/leonpagotto/leo-kit/issues
- **Discussions:** https://github.com/leonpagotto/leo-kit/discussions
- **Documentation:** https://github.com/leonpagotto/leo-kit/tree/main/docs
- **Wiki:** https://github.com/leonpagotto/leo-kit/wiki

---

## Recognition

**All contributors are recognized:**
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated in community

---

## Questions?

- 📖 Read the docs
- 💬 Check discussions
- 🐛 Search existing issues
- ✉️ Email support@leokit.dev

---

**Thank you for contributing to LEO Kit! Your work makes it better for everyone! 🚀**

---

**Last Updated:** October 25, 2025  
**Status:** ✅ Production Ready
