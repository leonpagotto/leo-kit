# Frontend Agent - IKEA Ingka Skapa Design System Instructions

> **🇸🇪 OFFICIAL IKEA DESIGN SYSTEM FOR INTERNAL USE** > **Last Updated:** 2025-10-30
> **Purpose:** Complete guide for implementing IKEA Ingka Skapa components

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Foundations](#design-foundations)
3. [Component Specifications](#component-specifications)
4. [Implementation Patterns](#implementation-patterns)
5. [Accessibility Requirements](#accessibility-requirements)
6. [Common Patterns](#common-patterns)
7. [Quality Checklist](#quality-checklist)

---

## Overview

### What is Ingka Skapa?

Ingka Skapa is the **official IKEA design system** used across all IKEA digital products. This guide contains extracted specifications from 83 official PDF documents.

### When to Use This Guide

**ALWAYS use this guide when:**

- User requests `--style ingka` in Spark generation
- Building components for IKEA projects
- Working with `@ingka/*` packages
- Implementing official IKEA brand standards

### Registry Configuration

All Ingka packages are available from the internal registry:

```bash
# Already configured in .npmrc
@ingka:registry=https://npm.m2.blue.cdtapps.com
```

---

## Design Foundations

### 🎨 Color System

**Official IKEA Brand Colors:**

```typescript
// Primary Brand Colors
const IKEA_BLUE = "#0051BA"; // Swedish Blue (primary)
const IKEA_YELLOW = "#FFDA1A"; // Swedish Yellow (secondary)

// Always import from @ingka/colours
import { colors } from "@ingka/colours";

// Usage
const primaryBlue = colors.blue.primary; // #0051BA
const accentYellow = colors.yellow.accent; // #FFDA1A
```

**Color Tokens** (from `Colour-tokens.pdf`):

```typescript
// Semantic colors
colors.text.primary; // Main text color
colors.text.secondary; // Secondary text
colors.background.base; // Base background
colors.background.raised; // Elevated surfaces
colors.border.default; // Default borders
colors.state.error; // Error states
colors.state.success; // Success states
colors.state.warning; // Warning states
```

**⚠️ CRITICAL RULES:**

- ❌ NEVER use arbitrary hex colors (`#3498db`, `#ff6b6b`, etc.)
- ✅ ALWAYS import from `@ingka/colours`
- ✅ ALWAYS use semantic color tokens for UI states
- ✅ ALWAYS maintain WCAG AA contrast ratios (4.5:1 minimum)

---

### 📏 Spacing System

**8px Base Grid** (from `Spacing.pdf`):

```typescript
// Standard spacing scale (all multiples of 8)
const spacing = {
  xs: "8px", // 8px  - Tight spacing
  sm: "16px", // 16px - Small spacing
  md: "24px", // 24px - Medium spacing
  lg: "32px", // 32px - Large spacing
  xl: "40px", // 40px - Extra large
  xxl: "48px", // 48px - Maximum spacing
};

// Import from design tokens
import { tokens } from "@ingka/design-tokens";

// Usage
<div
  style={{
    padding: tokens.spacing.md, // 24px
    margin: tokens.spacing.lg, // 32px
  }}
/>;
```

**Spacing Rules:**

- ✅ ALWAYS use multiples of 8 (8, 16, 24, 32, 40, 48)
- ❌ NEVER use arbitrary values (17px, 23px, etc.)
- ✅ Use design tokens for consistency
- ✅ Mobile: Prefer smaller spacing (8px, 16px)
- ✅ Desktop: Prefer larger spacing (24px, 32px, 48px)

---

### 🔤 Typography System

**Typeface** (from `Typography-typeface.pdf`):

```typescript
// Primary typeface for all IKEA products
font-family: 'Noto Sans', sans-serif;
```

**Type Scale** (from `Typography-system.pdf`):

```typescript
// Standard type scale
const typography = {
  xs: '12px',    // Caption, labels
  sm: '14px',    // Small text, helper text
  base: '16px',  // Body text (default)
  lg: '20px',    // Subheadings
  xl: '24px',    // Headings
  '2xl': '32px', // Large headings
  '3xl': '40px', // Hero headings
  '4xl': '48px'  // Display headings
};

// Line heights
const lineHeight = {
  tight: 1.2,    // Headings
  normal: 1.5,   // Body text
  relaxed: 1.8   // Long-form content
};

// Usage with @ingka/typography
import { Text, Heading } from '@ingka/typography';

<Text size="base" lineHeight="normal">
  Body text content
</Text>

<Heading level={1} size="3xl">
  Hero Heading
</Heading>
```

---

### 🔲 Corner Radius

**Border Radius Scale** (from `Corner-radius.pdf`):

```typescript
const borderRadius = {
  sm: '4px',   // Small elements (badges, tags)
  md: '8px',   // Medium elements (buttons, inputs)
  lg: '16px'   // Large elements (cards, modals)
};

// Import from design tokens
import { tokens } from '@ingka/design-tokens';

// Usage
<Button style={{ borderRadius: tokens.borderRadius.md }} />
<Card style={{ borderRadius: tokens.borderRadius.lg }} />
```

---

### 🌑 Elevation System

**Shadow Levels** (from `Elevation.pdf`):

```typescript
const elevation = {
  level1: '0 1px 2px rgba(0, 0, 0, 0.1)',      // Subtle - Cards
  level2: '0 4px 8px rgba(0, 0, 0, 0.12)',     // Medium - Dropdowns
  level3: '0 8px 24px rgba(0, 0, 0, 0.15)'     // Strong - Modals
};

// Import from design tokens
import { tokens } from '@ingka/design-tokens';

// Usage
<Card elevation={1} />           // Subtle shadow
<Dropdown elevation={2} />       // Medium shadow
<Modal elevation={3} />          // Strong shadow
```

---

## Component Specifications

### 🔘 Button Component

**Package:** `@ingka/button`
**Specification:** `Skapa-components/Button.pdf`

**Props:**

```typescript
interface ButtonProps {
  /** Button style variant */
  variant?: "primary" | "secondary" | "tertiary" | "ghost";

  /** Button size */
  size?: "small" | "medium" | "large";

  /** Disable button interactions */
  disabled?: boolean;

  /** Show loading spinner */
  loading?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** Button content */
  children: React.ReactNode;

  /** ARIA label for accessibility */
  "aria-label"?: string;
}
```

**Usage Examples:**

```tsx
import { Button } from '@ingka/button';

// ✅ Primary button (default)
<Button variant="primary" size="medium">
  Add to Cart
</Button>

// ✅ Secondary button
<Button variant="secondary" size="medium">
  Learn More
</Button>

// ✅ Tertiary button (less emphasis)
<Button variant="tertiary" size="small">
  Cancel
</Button>

// ✅ Ghost button (minimal style)
<Button variant="ghost">
  Skip
</Button>

// ✅ Loading state
<Button variant="primary" loading>
  Processing...
</Button>

// ✅ Disabled state
<Button variant="primary" disabled>
  Unavailable
</Button>

// ✅ Icon button with ARIA label
<Button
  variant="ghost"
  aria-label="Close dialog"
  onClick={handleClose}
>
  ×
</Button>
```

**States:**

- **Default:** Normal interactive state
- **Hover:** Visual feedback on mouse over
- **Active:** Pressed state
- **Disabled:** Non-interactive (use sparingly)
- **Loading:** Show spinner, disable interaction

**Accessibility:**

- ✅ Always include descriptive text or `aria-label`
- ✅ Icon-only buttons MUST have `aria-label`
- ✅ Use semantic `<button>` element
- ✅ Minimum touch target: 44x44px (mobile)

---

### 📝 Input Field Component

**Package:** `@ingka/input-field`
**Specification:** `Skapa-components/Input-field.pdf`

**Props:**

```typescript
interface InputFieldProps {
  /** Field label (required for accessibility) */
  label: string;

  /** Input type */
  type?: "text" | "email" | "password" | "number" | "tel" | "url";

  /** Placeholder text */
  placeholder?: string;

  /** Helper text below input */
  helperText?: string;

  /** Required field indicator */
  required?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Error state */
  error?: boolean;

  /** Error message (shown when error=true) */
  errorMessage?: string;

  /** Value */
  value?: string;

  /** Change handler */
  onChange?: (value: string) => void;
}
```

**Usage Examples:**

```tsx
import { InputField } from '@ingka/input-field';

// ✅ Basic text input
<InputField
  label="Full Name"
  type="text"
  placeholder="Enter your name"
  required
/>

// ✅ Email input with helper text
<InputField
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
  required
/>

// ✅ Password input
<InputField
  label="Password"
  type="password"
  placeholder="Enter password"
  helperText="Min 8 characters"
  required
/>

// ✅ Error state
<InputField
  label="Email Address"
  type="email"
  value={email}
  error={!!errors.email}
  errorMessage="Please enter a valid email address"
  onChange={handleChange}
/>

// ✅ Disabled state
<InputField
  label="Username"
  type="text"
  value="john_doe"
  disabled
/>
```

**Validation Patterns:**

```tsx
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (international)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Password strength (min 8 chars, uppercase, lowercase, number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
```

**Accessibility:**

- ✅ Always include `label` prop (MANDATORY)
- ✅ Use `helperText` for additional guidance
- ✅ Use `errorMessage` for validation feedback
- ✅ Link label to input with `htmlFor` (handled automatically)
- ✅ Use appropriate `type` for mobile keyboards

---

### 🎴 Card Component

**Package:** `@ingka/card`
**Specification:** `Skapa-components/Card.pdf`

**Structure:**

```tsx
<Card>
  <Card.Media /> // Optional: Image/video
  <Card.Content>
    <Card.Title />
    <Card.Description />
  </Card.Content>
  <Card.Actions /> // Optional: Buttons
</Card>
```

**Usage Examples:**

```tsx
import { Card } from '@ingka/card';
import { Button } from '@ingka/button';

// ✅ Product card
<Card elevation={1}>
  <Card.Media
    src="/products/chair.jpg"
    alt="POÄNG Armchair"
    aspectRatio="4:3"
  />
  <Card.Content>
    <Card.Title>POÄNG</Card.Title>
    <Card.Description>
      Armchair, birch veneer, Knisa light beige
    </Card.Description>
    <Card.Meta>
      <Price value={179} currency="USD" />
    </Card.Meta>
  </Card.Content>
  <Card.Actions>
    <Button variant="primary">Add to Cart</Button>
  </Card.Actions>
</Card>

// ✅ Simple content card
<Card elevation={1}>
  <Card.Content>
    <Card.Title>Sustainability</Card.Title>
    <Card.Description>
      We're committed to creating a better everyday life
      for the many people.
    </Card.Description>
  </Card.Content>
</Card>

// ✅ Clickable card
<Card elevation={1} clickable onClick={handleClick}>
  <Card.Content>
    <Card.Title>View Details</Card.Title>
    <Card.Description>
      Click to learn more
    </Card.Description>
  </Card.Content>
</Card>
```

**Best Practices:**

- ✅ Use `elevation={1}` for subtle shadow
- ✅ Always include descriptive `alt` text for images
- ✅ Use `aspectRatio` to prevent layout shift
- ✅ Keep descriptions concise (2-3 lines max)
- ✅ Limit actions to 1-2 buttons

---

### 📐 Grid Layout

**Package:** `@ingka/grid`
**Specification:** `Skapa-components/Layouts-grids.pdf`

**Responsive Grid System:**

```tsx
import { Grid } from '@ingka/grid';

// ✅ Responsive product grid
<Grid
  cols={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
  gap="md"        // 16px
  padding="lg"    // 24px
>
  {products.map(product => (
    <Grid.Item key={product.id}>
      <ProductCard product={product} />
    </Grid.Item>
  ))}
</Grid>

// ✅ Asymmetric layout
<Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  <Grid.Item span={{ mobile: 1, desktop: 2 }}>
    <HeroSection />
  </Grid.Item>
  <Grid.Item span={{ mobile: 1, desktop: 1 }}>
    <Sidebar />
  </Grid.Item>
</Grid>

// ✅ Auto-fit grid (flexible columns)
<Grid
  autoFit={{ minWidth: '280px' }}
  gap="md"
>
  {items.map(item => (
    <Grid.Item key={item.id}>
      <Card>{item.content}</Card>
    </Grid.Item>
  ))}
</Grid>
```

**Breakpoints:**

```typescript
const breakpoints = {
  mobile: "320px", // Small phones
  tablet: "768px", // Tablets
  desktop: "1024px", // Desktops
  wide: "1440px", // Large screens
};
```

**Gap Values:**

```typescript
const gaps = {
  xs: "4px", // Very tight
  sm: "8px", // Tight
  md: "16px", // Medium (default)
  lg: "24px", // Large
  xl: "32px", // Extra large
};
```

---

### 🪟 Modal Components

**Packages:** `@ingka/modal-prompt`, `@ingka/modal-sheets`, `@ingka/modal-theatre`
**Specification:** `Skapa-components/Modal-containers.pdf`

#### Modal Prompt (Dialogs)

```tsx
import { ModalPrompt } from '@ingka/modal-prompt';

// ✅ Confirmation dialog
<ModalPrompt
  open={isOpen}
  onClose={handleClose}
  title="Delete Item?"
  description="This action cannot be undone. Are you sure?"
  primaryAction={{
    label: 'Delete',
    onClick: handleDelete,
    variant: 'danger'
  }}
  secondaryAction={{
    label: 'Cancel',
    onClick: handleClose
  }}
/>

// ✅ Information dialog
<ModalPrompt
  open={isOpen}
  onClose={handleClose}
  title="Order Confirmed"
  description="Your order #12345 has been placed successfully."
  primaryAction={{
    label: 'View Order',
    onClick: handleViewOrder
  }}
/>
```

#### Modal Sheets (Bottom sheets on mobile)

```tsx
import { ModalSheets } from "@ingka/modal-sheets";

// ✅ Filter sheet
<ModalSheets open={isOpen} onClose={handleClose} title="Filter Products">
  <FilterForm onApply={handleApply} />
</ModalSheets>;
```

#### Modal Theatre (Full-screen)

```tsx
import { ModalTheatre } from "@ingka/modal-theatre";

// ✅ Image gallery
<ModalTheatre open={isOpen} onClose={handleClose}>
  <ImageGallery images={productImages} />
</ModalTheatre>;
```

**Modal Best Practices:**

- ✅ Use `ModalPrompt` for confirmations and alerts
- ✅ Use `ModalSheets` for forms and filters (mobile-friendly)
- ✅ Use `ModalTheatre` for immersive content (images, videos)
- ✅ Always provide close mechanism (`onClose`)
- ✅ Trap focus within modal when open
- ✅ Close on Escape key press
- ✅ Restore focus to trigger element on close

---

### ☑️ Form Components

#### Checkbox

**Package:** `@ingka/checkbox`
**Specification:** `Skapa-components/Checkbox.pdf`

```tsx
import { Checkbox } from '@ingka/checkbox';

// ✅ Single checkbox
<Checkbox
  label="I agree to terms and conditions"
  checked={agreed}
  onChange={setAgreed}
  required
/>

// ✅ Checkbox group
<Checkbox.Group label="Select features">
  <Checkbox label="Free delivery" value="delivery" />
  <Checkbox label="Assembly service" value="assembly" />
  <Checkbox label="Extended warranty" value="warranty" />
</Checkbox.Group>

// ✅ With helper text
<Checkbox
  label="Subscribe to newsletter"
  helperText="Get updates on new products and offers"
  checked={subscribed}
  onChange={setSubscribed}
/>
```

#### Radio Button

**Package:** `@ingka/radio-button`
**Specification:** `Skapa-components/Radio-button.pdf`

```tsx
import { RadioButton } from "@ingka/radio-button";

// ✅ Radio group
<RadioButton.Group
  label="Delivery method"
  value={deliveryMethod}
  onChange={setDeliveryMethod}
  required
>
  <RadioButton label="Standard (3-5 days)" value="standard" helperText="Free" />
  <RadioButton label="Express (1-2 days)" value="express" helperText="$9.99" />
  <RadioButton label="Store pickup" value="pickup" helperText="Free" />
</RadioButton.Group>;
```

#### Select Dropdown

**Package:** `@ingka/select`
**Specification:** `Skapa-components/Select.pdf`

```tsx
import { Select } from '@ingka/select';

// ✅ Basic select
<Select
  label="Country"
  placeholder="Select country"
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  required
/>

// ✅ With search
<Select
  label="Store location"
  placeholder="Search stores..."
  options={stores}
  searchable
  value={selectedStore}
  onChange={setSelectedStore}
/>

// ✅ Multi-select
<Select
  label="Product categories"
  placeholder="Select categories"
  options={categories}
  multiple
  value={selectedCategories}
  onChange={setSelectedCategories}
/>
```

---

### 🔔 Feedback Components

#### Toast Notifications

**Package:** `@ingka/toast`
**Specification:** `Skapa-components/Toast.pdf`

```tsx
import { toast } from "@ingka/toast";

// ✅ Success toast
toast.success("Item added to cart", {
  duration: 3000,
  position: "bottom-right",
});

// ✅ Error toast
toast.error("Payment failed. Please try again.", {
  duration: 5000,
  position: "top-center",
});

// ✅ Info toast
toast.info("Your order is being processed", {
  duration: 4000,
});

// ✅ Custom toast with action
toast.custom("Item removed from cart", {
  action: {
    label: "Undo",
    onClick: handleUndo,
  },
  duration: 5000,
});
```

#### Banner Messages

**Package:** `@ingka/banner`
**Specification:** `Skapa-components/Banner.pdf`

```tsx
import { Banner } from '@ingka/banner';

// ✅ Info banner
<Banner variant="info" onClose={handleClose}>
  Free delivery on orders over $50
</Banner>

// ✅ Warning banner
<Banner variant="warning">
  Some items in your cart are low in stock
</Banner>

// ✅ Error banner
<Banner variant="error" dismissible={false}>
  Unable to process payment. Please check your card details.
</Banner>

// ✅ Success banner
<Banner variant="success" icon={<CheckIcon />}>
  Your order has been confirmed!
</Banner>
```

#### Badge & Status

**Package:** `@ingka/badge`
**Specification:** `Skapa-components/Badge.pdf`

```tsx
import { Badge } from '@ingka/badge';

// ✅ Status badges
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error">Out of Stock</Badge>
<Badge variant="info">New</Badge>

// ✅ Count badge
<Badge count={5} max={99}>
  <ShoppingCartIcon />
</Badge>

// ✅ Dot indicator
<Badge dot variant="error">
  <NotificationIcon />
</Badge>
```

---

## Implementation Patterns

### Pattern 1: Form Validation

```tsx
import { InputField, Button, toast } from "@ingka/...";
import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await submitForm(formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Name"
        value={formData.name}
        onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
        error={!!errors.name}
        errorMessage={errors.name}
        required
      />

      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
        error={!!errors.email}
        errorMessage={errors.email}
        required
      />

      <TextArea
        label="Message"
        value={formData.message}
        onChange={(val) => setFormData((prev) => ({ ...prev, message: val }))}
        error={!!errors.message}
        errorMessage={errors.message}
        required
      />

      <Button variant="primary" type="submit">
        Send Message
      </Button>
    </form>
  );
}
```

### Pattern 2: Data Grid with Loading States

```tsx
import { Grid, Card, Skeleton, Button } from "@ingka/...";
import { useState, useEffect } from "react";

function ProductGrid({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(category).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  if (loading) {
    return (
      <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height="400px" />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
      {products.map((product) => (
        <Card key={product.id} elevation={1}>
          <Card.Media
            src={product.image}
            alt={product.name}
            aspectRatio="4:3"
          />
          <Card.Content>
            <Card.Title>{product.name}</Card.Title>
            <Card.Description>{product.description}</Card.Description>
            <Price value={product.price} currency="USD" />
          </Card.Content>
          <Card.Actions>
            <Button variant="primary">Add to Cart</Button>
          </Card.Actions>
        </Card>
      ))}
    </Grid>
  );
}
```

### Pattern 3: Modal Confirmation Flow

```tsx
import { Button, ModalPrompt, toast } from "@ingka/...";
import { useState } from "react";

function DeleteButton({ itemId, itemName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItem(itemId);
      toast.success(`${itemName} deleted successfully`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <ModalPrompt
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Delete ${itemName}?`}
        description="This action cannot be undone."
        primaryAction={{
          label: deleting ? "Deleting..." : "Delete",
          onClick: handleDelete,
          variant: "danger",
          loading: deleting,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setIsOpen(false),
        }}
      />
    </>
  );
}
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance (MANDATORY)

All Ingka components must meet WCAG 2.1 AA standards:

#### Color Contrast

```typescript
// ✅ WCAG AA compliant contrasts
const contrastRatios = {
  normalText: 4.5, // Text < 18px
  largeText: 3.0, // Text ≥ 18px or bold ≥ 14px
  uiComponents: 3.0, // Buttons, form controls
};
```

#### Keyboard Navigation

All interactive elements must be keyboard accessible:

```tsx
// ✅ Keyboard accessible component
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="Close menu"
>
  ×
</div>
```

#### ARIA Labels & Roles

```tsx
// ✅ Proper ARIA usage
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

// ✅ Form accessibility
<form role="search" aria-label="Product search">
  <InputField
    label="Search products"
    type="search"
    aria-describedby="search-hint"
  />
  <span id="search-hint">Enter at least 3 characters</span>
</form>

// ✅ Button with state
<Button
  aria-pressed={isActive}
  aria-expanded={isExpanded}
  aria-label="Toggle menu"
>
  Menu
</Button>
```

#### Focus Management

```tsx
// ✅ Visible focus indicators
.focusable:focus-visible {
  outline: 2px solid colors.blue.primary;
  outline-offset: 2px;
}

// ✅ Skip to content link
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

#### Touch Targets (Mobile)

```css
/* ✅ Minimum 44x44px touch targets */
.button,
.link,
.interactive {
  min-width: 44px;
  min-height: 44px;
  /* Spacing between targets */
  margin: 8px;
}
```

---

## Common Patterns

### Responsive Image Loading

```tsx
import { Image } from "@ingka/image";

// ✅ Optimized responsive image
<Image
  src="/products/chair.jpg"
  alt="POÄNG Armchair"
  srcSet="/products/chair-400.jpg 400w, /products/chair-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  aspectRatio="4:3"
/>;
```

### Error Boundary Pattern

```tsx
import { Banner } from "@ingka/banner";

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Banner variant="error">
        Something went wrong. Please refresh the page.
      </Banner>
    );
  }

  return children;
}
```

### Loading States

```tsx
import { Skeleton, Spinner } from '@ingka/loading';

// ✅ Skeleton for content loading
<Skeleton height="200px" width="100%" />

// ✅ Spinner for actions
<Button variant="primary" loading>
  Processing...
</Button>

// ✅ Page-level loading
{loading ? (
  <Spinner size="large" centered />
) : (
  <Content />
)}
```

---

## Quality Checklist

Before submitting any code using Ingka components, verify:

### Design Foundations

- [ ] All colors from `@ingka/colours` (no arbitrary hex values)
- [ ] All spacing uses 8px grid (8, 16, 24, 32, 40, 48)
- [ ] Typography uses Noto Sans and design tokens
- [ ] Border radius uses standard values (4px, 8px, 16px)
- [ ] Shadows use elevation tokens (level 1, 2, 3)

### Components

- [ ] Using official `@ingka/*` packages (not custom implementations)
- [ ] Props match official specifications (variant, size, etc.)
- [ ] Component structure follows PDF guidelines
- [ ] All required props provided
- [ ] Optional props used appropriately

### Accessibility

- [ ] All interactive elements keyboard accessible (Tab, Enter, Space)
- [ ] All form fields have labels
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Touch targets minimum 44x44px (mobile)

### Responsive Design

- [ ] Mobile-first approach
- [ ] Uses responsive props (cols={{ mobile, tablet, desktop }})
- [ ] Breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Images have responsive sizing
- [ ] Touch-friendly on mobile devices

### Performance

- [ ] Images use lazy loading
- [ ] Heavy components code-split
- [ ] Loading states for async operations
- [ ] Proper error handling
- [ ] No unnecessary re-renders

### Code Quality

- [ ] TypeScript types for all props
- [ ] Descriptive variable names
- [ ] Comments for complex logic
- [ ] No console errors or warnings
- [ ] Follows React best practices

---

## Reference Links

- **Component PDFs:** `docs/guides/Skapa-components/` (60+ specifications)
- **Foundation PDFs:** `docs/guides/Skapa-foundations/` (23 specifications)
- **Component Index:** `docs/guides/SKAPA_COMPONENT_INDEX.md`
- **Ingka Registry:** `https://npm.m2.blue.cdtapps.com`
- **Package Installation:** `npm install @ingka/[component-name]`

---

**Last Updated:** 2025-10-30
**Version:** 1.0.0
**Maintained by:** Ingvar Workflow Kit Team
