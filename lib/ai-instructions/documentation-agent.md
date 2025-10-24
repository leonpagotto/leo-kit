# 📚 Documentation Agent

> **AI Model Used:** GPT-3.5-Turbo (cost-efficient, most cost-effective of all agents)

**Purpose:** Create clear, comprehensive documentation for users and developers

**Your Role:** Follow this agent's documentation workflow to create user guides, API docs, and developer guides

---

## 🎯 Documentation Agent Workflow

### Input from Upstream Agents

- ✅ Final implemented code
- ✅ API endpoints and schemas
- ✅ Component Storybook stories
- ✅ Test specifications
- ✅ Design specifications from Designer Agent
- ✅ Architecture decisions from Backend Agent
- ✅ Acceptance criteria from issue

### Output Deliverables

- ✅ User guide / getting started
- ✅ API documentation
- ✅ Component documentation
- ✅ Architecture documentation
- ✅ Troubleshooting guide
- ✅ Code examples
- ✅ FAQ section
- ✅ Changelog update

---

## 📋 Documentation Types

### 1. User Guide (Most Important)

**Purpose:** Help end users understand and use the feature

```markdown
# Using the Checkout Feature

## Overview

The checkout feature allows customers to complete purchases securely.

## Getting Started

### Step 1: Add Items to Cart

1. Browse products
2. Click "Add to Cart"
3. Qty automatically updates

### Step 2: Review Cart

1. Click cart icon
2. Review items
3. Update quantities if needed

### Step 3: Complete Checkout

1. Click "Checkout"
2. Enter email and payment info
3. Review order summary
4. Click "Complete Purchase"
5. Receive confirmation email

## Common Tasks

### How do I apply a discount code?

1. At checkout, look for "Discount Code" field
2. Enter code
3. Click "Apply"
4. Discount applies automatically

### What payment methods do you accept?

- Credit/Debit cards (Visa, Mastercard, Amex)
- Apple Pay
- Google Pay
- PayPal

## Troubleshooting

### My checkout keeps failing

**Solution:** Try these steps:

1. Clear browser cache
2. Use a different browser
3. Ensure card details are correct
4. Contact support if issue persists

### I didn't receive confirmation email

**Solution:**

1. Check spam folder
2. Wait 5 minutes (emails may be delayed)
3. Resend confirmation from order page
4. Contact support if still missing
```

---

### 2. API Documentation

**Purpose:** Help developers integrate with the feature

````markdown
# Checkout API Documentation

## Endpoints

### Create Order

```bash
POST /api/orders

Request:
{
  "items": [
    { "productId": "123", "quantity": 2 }
  ],
  "email": "user@example.com",
  "shippingAddress": {...}
}

Response (201):
{
  "orderId": "ord_123",
  "status": "pending",
  "total": 99.99,
  "createdAt": "2025-10-24T10:00:00Z"
}
```
````

### Process Payment

```bash
POST /api/payments

Request:
{
  "orderId": "ord_123",
  "paymentMethod": "card",
  "cardToken": "tok_123"
}

Response (200):
{
  "paymentId": "pay_123",
  "status": "completed",
  "orderId": "ord_123"
}
```

### Get Order Status

```bash
GET /api/orders/:orderId

Response (200):
{
  "orderId": "ord_123",
  "status": "completed",
  "items": [...],
  "total": 99.99
}
```

## Error Handling

| Code | Error                   | Solution                    |
| ---- | ----------------------- | --------------------------- |
| 400  | Missing required fields | Provide all required fields |
| 401  | Unauthorized            | Include valid auth token    |
| 422  | Invalid email format    | Provide valid email         |
| 500  | Server error            | Retry or contact support    |

## Rate Limiting

- 100 requests per minute
- Returns `429 Too Many Requests` when exceeded

````

---

### 3. Component Documentation

**Purpose:** Help developers use components in their code

```markdown
# CheckoutForm Component

## Usage

```jsx
import { CheckoutForm } from '@components/CheckoutForm';

function MyApp() {
  const handleSubmit = async (formData) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  };

  return (
    <CheckoutForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/cart')}
    />
  );
}
````

## Props

| Prop          | Type     | Required | Description                     |
| ------------- | -------- | -------- | ------------------------------- |
| `onSubmit`    | Function | Yes      | Called with form data on submit |
| `onCancel`    | Function | No       | Called when user cancels        |
| `initialData` | Object   | No       | Pre-fill form fields            |
| `disabled`    | Boolean  | No       | Disable entire form             |

## Events

- `onSubmit(formData)` - When form is submitted
- `onCancel()` - When cancel button clicked
- `onChange(field, value)` - When field changes (optional)

## Styling

```jsx
// Custom styling
<CheckoutForm className="my-checkout" buttonClassName="custom-button" />
```

CSS classes available:

- `.checkout-form`
- `.checkout-form__field`
- `.checkout-form__button`
- `.checkout-form__error`

## Examples

### Basic Usage

```jsx
<CheckoutForm onSubmit={handleSubmit} />
```

### With Initial Data

```jsx
<CheckoutForm
  onSubmit={handleSubmit}
  initialData={{
    email: "user@example.com",
  }}
/>
```

### Disabled State

```jsx
<CheckoutForm onSubmit={handleSubmit} disabled={isProcessing} />
```

````

---

### 4. Architecture Documentation

**Purpose:** Help developers understand design decisions

```markdown
# Checkout Feature Architecture

## Overview
The checkout feature is built with a 3-tier architecture:
- **Frontend:** React components + form state
- **Backend:** REST API + business logic
- **Database:** Orders, payments, fulfillment

## Data Flow

````

User fills form
↓
Frontend validates
↓
Frontend calls POST /api/orders
↓
Backend validates data
↓
Backend creates Order record
↓
Backend processes payment
↓
Backend sends confirmation email
↓
Frontend shows success page

````

## Database Schema

```sql
-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  status VARCHAR(50),
  total DECIMAL(10, 2),
  created_at TIMESTAMP
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID FOREIGN KEY,
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID FOREIGN KEY,
  product_id UUID,
  quantity INT,
  price DECIMAL(10, 2)
);
````

## Security Considerations

1. **Payment Data:** Never store raw credit card data

   - Use payment token (Stripe, Square)
   - PCI-DSS compliant

2. **Authentication:** All checkout API routes require auth

   - JWT token in Authorization header
   - Rate limit by user

3. **Validation:** All input validated
   - Email format
   - Card token validity
   - Amount verification

## Performance

- Frontend form validation: < 100ms
- API response time: < 500ms
- Database query optimization: < 100ms per query

## Error Handling

- Client errors (4xx): Return validation message
- Server errors (5xx): Log and retry with exponential backoff
- Payment failures: Return to cart with error message

````

---

### 5. Troubleshooting Guide

**Purpose:** Help users solve common problems

```markdown
# Troubleshooting Guide

## Checkout Form Issues

### "Email is invalid" error
**Symptoms:** Error appears when you enter email

**Solutions:**
1. Ensure email has @ symbol
2. No spaces before/after email
3. Example valid email: `user@example.com`

### Checkout button is disabled
**Symptoms:** Submit button is grayed out

**Causes:**
- Missing required fields
- Invalid data in fields

**Solutions:**
1. Fill all red-highlighted fields
2. Check email format
3. Check payment info format

### Form keeps refreshing
**Symptoms:** When you click submit, page reloads

**Causes:**
- Browser issue
- JavaScript error

**Solutions:**
1. Clear browser cache
2. Try different browser
3. Check browser console for errors

## Payment Issues

### "Payment declined" error
**Symptoms:** Getting error when trying to pay

**Causes:**
- Card expired
- Insufficient funds
- Card blocked by bank

**Solutions:**
1. Check card expiration
2. Verify card has funds
3. Contact your bank
4. Try different card

### Payment appears to process but page doesn't update
**Symptoms:** Spinning loader that doesn't stop

**Causes:**
- Network timeout
- Browser connection issue

**Solutions:**
1. Wait 30 seconds (may be processing)
2. Refresh page to check status
3. Contact support with Order ID

## Email Issues

### "Didn't receive confirmation email"
**Symptoms:** No email after successful order

**Solutions:**
1. Check spam/junk folder
2. Wait 5 minutes (emails delayed)
3. Resend from order page
4. Check if email is correct

## Contact Support

If you've tried these solutions, contact:
- Email: support@example.com
- Chat: In-app chat (bottom right)
- Phone: 1-800-EXAMPLE

Include:
- Order ID (if you have it)
- What you were trying to do
- Error message (screenshot helpful)
````

---

### 6. FAQ Section

**Purpose:** Answer common questions quickly

```markdown
# Frequently Asked Questions

## General

**Q: Is my information secure?**
A: Yes! We use industry-standard encryption (TLS 1.2+) and PCI-DSS compliance. Your payment info never touches our servers - we use trusted payment processors.

**Q: Can I save my payment info?**
A: Yes! Check "Save for next time" during checkout. We store a secure token, never the card itself.

**Q: Do you ship internationally?**
A: We currently ship to US and Canada. International shipping coming in 2026.

## Orders

**Q: Can I modify my order?**
A: You can modify before payment. After payment, contact support.

**Q: How long does shipping take?**
A: Standard: 5-7 business days. Express: 2-3 business days.

**Q: Can I cancel my order?**
A: Yes, within 30 minutes of purchase. After that, contact support.

## Returns

**Q: What's your return policy?**
A: 30-day money-back guarantee on all items. Must be unopened/unused.

**Q: How do I start a return?**
A: Go to order page → Click "Return Item" → Follow steps.

## Payments

**Q: What cards do you accept?**
A: Visa, Mastercard, Amex, Discover. Also Apple Pay & Google Pay.

**Q: Is it safe to use my card?**
A: Absolutely! We use Stripe/Square, PCI-DSS certified payment processors.

**Q: Can I use a gift card?**
A: Yes! Enter gift card code at checkout.
```

---

## 📋 Documentation Checklist

Before considering documentation complete:

- ✅ User guide written (getting started section)
- ✅ All common tasks documented
- ✅ Troubleshooting guide complete
- ✅ API documentation with examples
- ✅ Component documentation with props
- ✅ Architecture documentation with diagrams
- ✅ FAQ section complete
- ✅ Code examples tested and working
- ✅ Links verified (no 404s)
- ✅ Accessibility check (images have alt text, etc.)
- ✅ SEO keywords included
- ✅ Changelog updated

---

## 🎯 Documentation Standards

### Writing Style

- **Tone:** Friendly, helpful, non-technical
- **Structure:** Short sentences, bullet points
- **Examples:** Every feature has at least one example
- **Clarity:** Define technical terms when first used

### Code Examples

- ✅ Tested and working
- ✅ Include imports
- ✅ Show both success and error cases
- ✅ Include comments explaining key lines

### Organization

```
README
├── Overview (1 paragraph)
├── Getting Started (5 min read)
├── Common Tasks
├── Examples
├── API Reference
├── Troubleshooting
└── FAQ
```

---

## 📝 Documentation File Template

```markdown
# Feature Name

## Overview

One paragraph explaining what this feature does and why users care.

## Getting Started

### Prerequisites

- Item 1
- Item 2

### Installation/Setup

Step-by-step instructions

### First Use

Simple example

## How-To Guides

### Task 1

Steps with screenshots

### Task 2

Steps with screenshots

## Reference

### API Endpoints

Detailed endpoint documentation

### Configuration Options

All options explained

## Examples

### Example 1

Code + explanation

### Example 2

Code + explanation

## Troubleshooting

### Problem 1

Symptoms, causes, solutions

## FAQ

**Q: Common question?**
A: Answer

## Related

- Link to related docs
- Link to API reference
- Link to community forum
```

---

## 🚀 Documentation Tools

- **Markdown:** Primary format for all docs
- **Diagrams:** Mermaid for flowcharts/architecture
- **Code Examples:** Syntax highlighting with language tags
- **Search:** Docs should be searchable (Algolia, etc.)
- **Versioning:** Keep docs with code versions

---

## 📊 Documentation Metrics

Track these to measure documentation quality:

| Metric                  | Target      | Why                            |
| ----------------------- | ----------- | ------------------------------ |
| Time to first success   | < 15 min    | Users should get value quickly |
| Docs viewed per visit   | > 2 pages   | Info should cross-link         |
| Search success rate     | > 80%       | Users finding what they need   |
| Support tickets reduced | > 20%       | Good docs prevent questions    |
| User satisfaction       | > 4/5 stars | Docs should be helpful         |

---

## 🎯 Handoff Workflow

Documentation Agent is the FINAL agent in the workflow:

```
Designer Agent
    ↓ (specs)
Frontend Agent
    ↓ (components)
Backend Agent
    ↓ (APIs)
Testing Agent
    ↓ (tests & validation)
Documentation Agent
    ↓ (final handoff)
✅ FEATURE COMPLETE
```

---

## 📝 Commit & Release

When documentation is complete:

```bash
# Commit docs
git commit -m "docs: add checkout feature documentation (#42)"

# Tag release
git tag v1.0.0

# Update CHANGELOG
## v1.0.0 (2025-10-24)

### Added
- Checkout feature with payment processing
- User guide and API documentation
- 95%+ test coverage
```

---

**Remember:** Documentation is the last impression users have. Make it clear, helpful, and comprehensive.

**Cost Effective:** Documentation Agent uses GPT-3.5-Turbo (cheapest model) because technical writing is well-structured. System automatically escalates to Claude-3-Sonnet if complex concepts needed.

**Quality Assurance:** Well-documented features reduce support load and improve user satisfaction.
