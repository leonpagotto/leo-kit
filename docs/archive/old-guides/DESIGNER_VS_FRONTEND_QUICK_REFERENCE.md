# 🎯 Quick Reference: Designer Agent vs Frontend Agent

> **Critical Clarification to Remember**

---

## ❓ What's the Difference?

### 🎨 DESIGNER AGENT

**Creates:** SPECIFICATIONS (NOT CODE)

```
INPUT:  "Build checkout form"
        ↓
DESIGNER CREATES:
  ✓ Wireframe showing layout
  ✓ Component tree diagram
  ✓ Color specs (hex codes)
  ✓ Typography specs (fonts, sizes)
  ✓ Spacing specs (padding, margins)
  ✓ Responsive behavior specs
  ✓ Accessibility requirements
  ✓ Interactive states (hover, focus, disabled, loading)
  ✓ Figma design link
        ↓
OUTPUT: SPECIFICATIONS (text + diagrams)
```

**What Designer Agent Creates:**

```markdown
# CheckoutForm Design Specification

## Visual Layout

[ASCII wireframe showing structure]

## Component Tree

CheckoutForm
├── EmailField
├── CardField
├── ExpiryField
├── CVCField
├── SubmitButton
└── CancelLink

## Design Tokens

- Width: 400px
- Background: #FFFFFF
- Primary color: #0066CC
- Font: -apple-system, sans-serif
- Border radius: 8px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

## Responsive

- Mobile: 100% with 16px margin
- Tablet: 90% width
- Desktop: 400px fixed

## Accessibility

- WCAG AA compliant
- Keyboard navigation supported
- Screen reader labels for all fields
- Color contrast ≥ 4.5:1

## States

- Hover: light gray background
- Focus: blue outline (3px)
- Disabled: 50% opacity
- Error: red border + error message
- Loading: disabled with spinner

## Figma Link

https://figma.com/file/[id]/CheckoutForm
```

---

### 💻 FRONTEND AGENT

**Creates:** ACTUAL COMPONENT CODE

```
INPUT:  [Designer specs from above]
        ↓
FRONTEND BUILDS:
  ✓ React component (.jsx)
  ✓ CSS styles (.css or .module.css)
  ✓ Storybook stories (.stories.jsx)
  ✓ Component tests (.test.jsx)
        ↓
OUTPUT: WORKING REACT COMPONENT
```

**What Frontend Agent Creates:**

```jsx
// CheckoutForm.jsx
import { useState } from "react";
import styles from "./CheckoutForm.module.css";

export function CheckoutForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    card: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation based on Designer specs
    // Call API
    // Handle response
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={errors.email ? styles.fieldError : ""}
          aria-label="Email address"
          required
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="card">Card</label>
        <input
          id="card"
          type="text"
          placeholder="1234 5678 9012 3456"
          value={formData.card}
          onChange={(e) => setFormData({ ...formData, card: e.target.value })}
          className={errors.card ? styles.fieldError : ""}
          aria-label="Card number"
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="expiry">Expiry</label>
          <input
            id="expiry"
            type="text"
            placeholder="MM/YY"
            value={formData.expiry}
            onChange={(e) =>
              setFormData({ ...formData, expiry: e.target.value })
            }
            aria-label="Expiration date"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="cvc">CVC</label>
          <input
            id="cvc"
            type="text"
            placeholder="123"
            value={formData.cvc}
            onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
            aria-label="CVC code"
            required
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Submit
        </button>
        <button type="button" onClick={onCancel} className={styles.cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
```

```css
/* CheckoutForm.module.css */
.form {
  width: 400px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field label {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.field input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.field input:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.field input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.fieldError {
  border-color: #ef4444 !important;
}

.error {
  color: #ef4444;
  font-size: 12px;
}

@media (max-width: 768px) {
  .form {
    width: calc(100% - 32px);
    margin: 16px;
  }
}
```

```jsx
// CheckoutForm.stories.jsx
import { CheckoutForm } from "./CheckoutForm";

export default {
  component: CheckoutForm,
  title: "Components/CheckoutForm",
};

export const Default = {
  args: {
    onSubmit: (data) => console.log("Submitted:", data),
    onCancel: () => console.log("Cancelled"),
  },
};

export const WithError = {
  args: {
    ...Default.args,
  },
  decorators: [
    (Story) => {
      // Pre-populate with error
      return <Story />;
    },
  ],
};
```

```jsx
// CheckoutForm.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutForm } from "./CheckoutForm";

describe("CheckoutForm", () => {
  test("renders form with all fields", () => {
    render(<CheckoutForm onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Card number")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiration date")).toBeInTheDocument();
    expect(screen.getByLabelText("CVC code")).toBeInTheDocument();
  });

  test("validates email before submit", () => {
    render(<CheckoutForm onSubmit={() => {}} onCancel={() => {}} />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
    // Should show error
  });

  test("calls onCancel when cancel clicked", () => {
    const handleCancel = jest.fn();
    render(<CheckoutForm onSubmit={() => {}} onCancel={handleCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalled();
  });
});
```

---

## 🔄 The Flow

```
USER: "Build checkout form"
    ↓
ORCHESTRATOR: "This is UI work → Design-First approach"
    ↓
STEP 1: DESIGNER AGENT (30-45 min)
├── Reads: designer-agent.md
├── Model: Claude-3-Sonnet (fast)
├── Creates: Specs + wireframes + design tokens
├── Output: TEXT DOCUMENT (not code)
└── Cost: ~$0.02

STEP 2: STAKEHOLDER REVIEW
├── Looks at designer specs
├── Approves / requests changes
├── Design locked in

STEP 3: FRONTEND AGENT (1.5-2 hours)
├── Reads: frontend-agent.md
├── Input: Designer specs (text document)
├── Model: Claude-3-Sonnet (UI expertise)
├── Creates: React component code
├── Output: .jsx, .css, .stories.jsx, .test.jsx
└── Cost: ~$0.15

STEP 4: Backend/Testing/Documentation (continues...)
    ↓
✅ FEATURE COMPLETE
```

---

## 🎯 Key Points to Remember

### Designer Agent DOES...

✅ Create wireframes
✅ Define colors/fonts/spacing
✅ Document responsive behavior
✅ Specify accessibility requirements
✅ List all interactive states
✅ Provide Figma links
✅ Create handoff checklist for Frontend

### Designer Agent DOES NOT...

❌ Write React code
❌ Write CSS
❌ Write HTML
❌ Create components
❌ Write any code at all

### Frontend Agent DOES...

✅ Read Designer specs (text document)
✅ Implement React components
✅ Write CSS styling
✅ Create Storybook stories
✅ Write component tests
✅ Implement all Design specs

### Frontend Agent DOES NOT...

❌ Create new design specs
❌ Change Designer decisions
❌ Skip accessibility
❌ Skip responsive behavior
❌ Deviate from Designer specs

---

## 💡 Why This Matters

### Old Approach (Code-First)

```
Dev writes component code
    ↓
Designer says "I'd make it different"
    ↓
Dev refactors component
    ↓
"Lots of rework"
```

### New Approach (Design-First)

```
Designer creates specs (30 min)
    ↓
Stakeholder approves specs (5 min)
    ↓
Frontend implements exactly as designed (no rework!)
    ↓
"Efficient, aligned, approved"
```

---

## 📊 Model Selection

| Agent        | Model           | Why                     | Cost  |
| ------------ | --------------- | ----------------------- | ----- |
| **Designer** | Claude-3-Sonnet | Fast iteration on specs | $0.02 |
| **Frontend** | Claude-3-Sonnet | UI/component expertise  | $0.15 |

Both use Claude-3-Sonnet because:

- ✅ Design work is well-defined (follow specs)
- ✅ No complex reasoning needed
- ✅ Fast iteration needed
- ✅ Cost efficiency important
- ✅ Quality excellent for this task type

If the spec is **extremely complex**, system automatically upgrades to GPT-4-Turbo.

---

## 🚀 Bottom Line

```
Designer Agent:  Creates WHAT it should look like
                 (Specs, not code)

Frontend Agent:  Creates HOW to build it
                 (Actual React components)

Together:        Perfect separation of concerns
                 Stakeholders see specs first
                 Dev follows spec exactly
                 30-40% faster than code-first
```

**Remember: Design Agent creates PLANS, Frontend Agent creates CODE** 📋 → 💻
