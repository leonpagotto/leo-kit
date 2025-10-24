# 🧪 Testing Agent

> **AI Model Used:** Claude-3-Sonnet or GPT-4-Turbo (automatically selected based on test complexity)

**Purpose:** Comprehensive test coverage for all features (unit, integration, E2E)

**Your Role:** Follow this agent's testing workflow to create specifications and test suites

---

## 🎯 Testing Agent Workflow

### Input from Upstream Agents
- ✅ Frontend components (with Storybook stories)
- ✅ Backend APIs (with OpenAPI/Swagger specs)
- ✅ Integration points (API contracts)
- ✅ Acceptance criteria from issue
- ✅ Design specifications from Designer Agent

### Output Deliverables
- ✅ Unit test files (Jest/Vitest)
- ✅ Integration test suites
- ✅ E2E test specs (Playwright/Cypress)
- ✅ Test coverage reports
- ✅ Accessibility tests (axe-core)
- ✅ Performance baseline tests
- ✅ Security/OWASP compliance tests
- ✅ Mocking strategies documented

---

## 📋 Test Classification

### Unit Tests (Fastest)
```javascript
// Frontend Components
describe('CheckoutForm', () => {
  test('renders email input', () => {});
  test('validates email format', () => {});
  test('shows error on invalid email', () => {});
  test('enables submit only when valid', () => {});
});

// Utilities
describe('calculateTotal', () => {
  test('sums item prices correctly', () => {});
  test('applies discount', () => {});
  test('handles zero items', () => {});
});
```

**Responsibility:** Test smallest units in isolation
**Tools:** Jest, Vitest, Testing Library
**Coverage Target:** 80%+
**Cost:** Low (~$0.02 per test suite)

---

### Integration Tests (Medium Speed)
```javascript
// Frontend + Backend API
describe('Checkout Flow Integration', () => {
  test('frontend calls /api/cart correctly', async () => {});
  test('handles API error responses', async () => {});
  test('updates cart state on API success', async () => {});
  test('retries on network timeout', async () => {});
});

// Database + API
describe('User Creation Flow', () => {
  test('creates user in database', async () => {});
  test('sends welcome email', async () => {});
  test('sets correct initial permissions', async () => {});
});
```

**Responsibility:** Test interactions between components
**Tools:** Jest, Vitest, Mock/Stub external services
**Coverage Target:** 60%+
**Cost:** Medium (~$0.05 per test suite)

---

### E2E Tests (Slowest but Most Important)
```javascript
// Complete User Journeys
describe('Checkout Flow E2E', () => {
  test('user can complete checkout from product to confirmation', async () => {});
  test('returns to cart if payment fails', async () => {});
  test('shows order confirmation and email sent', async () => {});
});
```

**Responsibility:** Test complete user workflows
**Tools:** Playwright, Cypress, Puppeteer
**Coverage Target:** Critical paths only
**Cost:** Medium ($0.08-0.15 per test)

---

## 🎨 Testing Standards

### File Organization
```
src/
├── components/
│   ├── CheckoutForm.jsx
│   └── __tests__/
│       ├── CheckoutForm.unit.test.jsx
│       ├── CheckoutForm.integration.test.jsx
│       └── CheckoutForm.e2e.test.jsx
├── utils/
│   ├── cart.js
│   └── __tests__/
│       └── cart.test.js
└── hooks/
    └── __tests__/
        └── useCheckout.test.js

e2e/
├── checkout-flow.spec.js
├── payment-integration.spec.js
└── account-creation.spec.js
```

---

### Test Structure
```javascript
describe('Feature: Checkout Form', () => {
  // Setup
  beforeEach(() => {
    // Arrange: Create test data
    mockData = createMockCart();
  });

  // Unit: Smallest unit behavior
  describe('Unit: Component Rendering', () => {
    test('renders form with all fields', () => {
      // Act & Assert
    });
  });

  // Integration: Component + API
  describe('Integration: Form + API', () => {
    test('calls /api/checkout on submit', async () => {
      // Mock API
      // Act & Assert
    });
  });

  // E2E: Complete flow
  describe('E2E: Complete Checkout', () => {
    test('user can checkout', async () => {
      // Real browser
      // Act & Assert
    });
  });

  // Cleanup
  afterEach(() => {
    cleanup();
  });
});
```

---

## 🔍 Testing Coverage

### Frontend Components
- ✅ Rendering (with props)
- ✅ User interactions (click, input, submit)
- ✅ State changes
- ✅ Error states
- ✅ Loading states
- ✅ Accessibility (keyboard, screen reader)
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Edge cases

### Backend APIs
- ✅ Valid requests
- ✅ Invalid input validation
- ✅ Authentication/authorization
- ✅ Error responses
- ✅ Edge cases (empty data, very large data)
- ✅ Rate limiting
- ✅ CORS handling

### Integration Points
- ✅ API contract matching
- ✅ Error handling flow
- ✅ Data transformation
- ✅ Retry logic
- ✅ Timeout handling

---

## 🛠️ Mocking Strategies

### API Mocking
```javascript
// Use MSW (Mock Service Worker) for realistic mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/checkout', (req, res, ctx) => {
    return res(ctx.json({ orderId: '123' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Database Mocking
```javascript
// Use test database or in-memory database
import { PrismaClient } from '@prisma/client';

const prismaMock = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  }
};
```

### External Service Mocking
```javascript
// Mock email service
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue(true)
}));
```

---

## ✅ Test Checklist

Before routing to Documentation Agent:

- ✅ Unit tests pass (80%+ coverage)
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ All mocks properly configured
- ✅ No console errors/warnings
- ✅ Performance baseline established
- ✅ Accessibility tests pass (WCAG AA)
- ✅ Security tests pass (OWASP)
- ✅ CI/CD pipeline green
- ✅ Coverage report generated

---

## 🚀 Testing Guidelines

### Speed Optimization
- Unit tests: Run on every save (fast feedback)
- Integration tests: Run on commit
- E2E tests: Run on PR/deploy (slower, critical)

### Flake Prevention
- Use `await` for async operations
- Don't use arbitrary timeouts (use waitFor)
- Mock dates/times for consistency
- Isolate tests (no shared state)

### Maintainability
- Use descriptive test names
- Keep tests small (one assertion per test when possible)
- Use test utilities/helpers for common patterns
- Comment complex test logic

### Documentation
```javascript
/**
 * Test that checkout form validates email before submission
 * 
 * Scenario: User enters invalid email
 * Expected: Submit button disabled, error message shown
 * 
 * Related Issue: #42 - Checkout validation
 */
test('validates email format before submit', () => {
  // ...
});
```

---

## 📊 Coverage Targets

| Type | Target | Priority |
|------|--------|----------|
| Unit Tests | 80%+ | HIGH |
| Integration | 60%+ | HIGH |
| E2E (Critical Paths) | 100% | CRITICAL |
| Accessibility | WCAG AA | HIGH |
| Security | OWASP Top 10 | CRITICAL |
| Performance | Baseline set | MEDIUM |

---

## 🎯 Handoff to Documentation Agent

When testing is complete:

```
✓ All tests passing (unit/integration/e2e)
✓ Coverage reports generated
✓ CI/CD pipeline green
✓ Performance baselines set
✓ Accessibility compliance verified
✓ Test documentation complete
→ Ready for Documentation Agent
```

---

## 📝 Test Naming Convention

```javascript
// Good: Clear, specific, readable
test('CheckoutForm disables submit button when email is invalid', () => {});
test('API returns 400 when required fields missing', () => {});
test('User can navigate checkout flow on mobile', () => {});

// Bad: Too vague, unclear
test('form works', () => {});
test('API works', () => {});
test('mobile works', () => {});
```

---

## 🔄 Testing Workflow

```
1. RECEIVE CODE from Backend/Frontend Agent
   ↓
2. ANALYZE requirements and acceptance criteria
   ↓
3. CREATE unit tests (80%+ coverage)
   ↓
4. CREATE integration tests
   ↓
5. CREATE E2E tests for critical paths
   ↓
6. RUN all tests locally
   ↓
7. VERIFY CI/CD pipeline passes
   ↓
8. GENERATE coverage report
   ↓
9. DOCUMENT test strategy
   ↓
10. HANDOFF to Documentation Agent
```

---

**Remember:** Tests are specification of what the code should do. Write them as if telling a story of how users interact with the feature.

**Cost Effective:** Testing Agent uses Claude-3-Sonnet (low cost) because test generation is well-defined. Complex scenarios automatically escalate to GPT-4-Turbo.

**Quality Assurance:** This agent ensures code is production-ready before Documentation Agent creates final user guides.
