# Ingka Design System - Implementation Guide

> **Quick reference for implementing IKEA Ingka Skapa Design System** > **Date:** 2025-10-30

---

## 📚 Documentation Structure

The Ingka Design System documentation is organized into multiple files for better maintainability:

### 1. **Main Instructions** (for AI/Copilot)

📄 **Location:** `lib/ai-instructions/frontend-agent-ingka.instructions.md`

**Purpose:** Complete implementation guide for AI assistants
**Contents:**

- Design foundations (colors, spacing, typography, elevation)
- All component specifications with code examples
- Implementation patterns (forms, grids, modals)
- Accessibility requirements (WCAG 2.1 AA)
- Common patterns and quality checklist
- Extracted from 83 official Ingka PDF specifications

**When to use:** This is the **primary reference** for any Ingka component implementation.

### 2. **Component Index** (for quick lookup)

📄 **Location:** `docs/guides/SKAPA_COMPONENT_INDEX.md`

**Purpose:** Quick component lookup and categorization
**Contents:**

- All 75+ `@ingka/*` packages organized by category
- Component-to-PDF mapping
- Usage examples and quick reference

**When to use:** To find which component to use for a specific need.

### 3. **Official PDF Specifications** (source of truth)

📁 **Locations:**

- `docs/guides/Skapa-components/` - 60+ component PDFs
- `docs/guides/Skapa-foundations/` - 23 foundation PDFs

**Purpose:** Official IKEA design specifications with visual examples
**When to use:** For detailed visual guidelines, edge cases, and design rationale.

### 4. **Integration Documentation** (for developers)

📄 **Location:** `docs/guides/INGKA_DESIGN_SYSTEM.md`

**Purpose:** Setup and integration guide
**Contents:**

- NPM registry configuration
- Package installation
- CLI usage (`ingvar spark --style ingka`)
- Project setup

**When to use:** When setting up a new project or configuring Ingka access.

---

## 🎯 Workflow for Developers

### Step 1: Project Setup

```bash
# Configure registry (if not already done)
npm set --location project @ingka:registry="https://npm.m2.blue.cdtapps.com"

# Generate app with Ingka design
ingvar spark my-app --style ingka

# Or add to existing project
npm install @ingka/button @ingka/card @ingka/input-field
```

### Step 2: Find the Right Component

**Option A:** Use the component index

- Open `docs/guides/SKAPA_COMPONENT_INDEX.md`
- Search by category (Layout, Forms, Feedback, etc.)
- Find the `@ingka/*` package name

**Option B:** Search by need

- Need a button? → `@ingka/button`
- Need a form input? → `@ingka/input-field`
- Need a card? → `@ingka/card`
- Need a modal? → `@ingka/modal-prompt`, `@ingka/modal-sheets`, or `@ingka/modal-theatre`

### Step 3: Implement with AI Assistance

When using GitHub Copilot or AI assistants:

1. **Mention the component name** in your prompt
2. **Specify "Ingka" or "IKEA design system"**
3. **Reference the instructions:** AI will automatically consult `lib/ai-instructions/frontend-agent-ingka.instructions.md`

**Example prompts:**

```
"Create a product card using Ingka Card component"
"Add a contact form with Ingka InputField components"
"Implement a confirmation modal using Ingka ModalPrompt"
```

### Step 4: Verify Implementation

Check against the quality checklist:

- [ ] Using `@ingka/*` packages (not custom implementations)
- [ ] Props match specifications (e.g., `variant`, not `type`)
- [ ] Spacing uses 8px grid (8, 16, 24, 32, 40, 48)
- [ ] Colors from `@ingka/colours` (no arbitrary hex values)
- [ ] Accessibility attributes included (aria-label, etc.)
- [ ] Touch targets minimum 44x44px (mobile)

---

## 🔧 Common Tasks

### Task: Create a Button

```tsx
import { Button } from "@ingka/button";

<Button variant="primary" size="medium">
  Add to Cart
</Button>;
```

**Reference:** `lib/ai-instructions/frontend-agent-ingka.instructions.md` (Button Component section)
**PDF Spec:** `docs/guides/Skapa-components/Button.pdf`

---

### Task: Create a Form

```tsx
import { InputField } from "@ingka/input-field";
import { Button } from "@ingka/button";

<form onSubmit={handleSubmit}>
  <InputField
    label="Email"
    type="email"
    required
    error={!!errors.email}
    errorMessage={errors.email}
  />

  <Button variant="primary" type="submit">
    Submit
  </Button>
</form>;
```

**Reference:** `lib/ai-instructions/frontend-agent-ingka.instructions.md` (Input Field + Form Validation sections)
**PDF Specs:** `docs/guides/Skapa-components/Input-field.pdf`, `Button.pdf`

---

### Task: Create a Product Grid

```tsx
import { Grid } from "@ingka/grid";
import { Card } from "@ingka/card";

<Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
  {products.map((product) => (
    <Card key={product.id} elevation={1}>
      <Card.Media src={product.image} alt={product.name} />
      <Card.Content>
        <Card.Title>{product.name}</Card.Title>
      </Card.Content>
    </Card>
  ))}
</Grid>;
```

**Reference:** `lib/ai-instructions/frontend-agent-ingka.instructions.md` (Grid Layout + Card sections)
**PDF Specs:** `docs/guides/Skapa-components/Layouts-grids.pdf`, `Card.pdf`

---

## 🎨 Design Foundations Quick Reference

### Colors

```typescript
import { colors } from "@ingka/colours";

colors.blue.primary; // Swedish Blue #0051BA
colors.yellow.accent; // Swedish Yellow #FFDA1A
```

### Spacing (8px grid)

```typescript
import { tokens } from "@ingka/design-tokens";

tokens.spacing.xs; // 8px
tokens.spacing.sm; // 16px
tokens.spacing.md; // 24px
tokens.spacing.lg; // 32px
tokens.spacing.xl; // 40px
```

### Typography

```typescript
import { Text, Heading } from '@ingka/typography';

<Text size="base">Body text</Text>
<Heading level={1} size="3xl">Hero Heading</Heading>
```

**Full reference:** `lib/ai-instructions/frontend-agent-ingka.instructions.md` (Design Foundations section)

---

## 📖 Documentation Hierarchy

```
Priority 1: lib/ai-instructions/frontend-agent-ingka.instructions.md
  ↓ (Complete implementation guide - AI reads this)

Priority 2: docs/guides/SKAPA_COMPONENT_INDEX.md
  ↓ (Quick component lookup)

Priority 3: docs/guides/Skapa-components/*.pdf
  ↓ (Official visual specifications)

Priority 4: docs/guides/INGKA_DESIGN_SYSTEM.md
  ↓ (Setup and integration guide)
```

**Rule:** Always start with the AI instructions file for implementation details.

---

## 🚀 Benefits of This Structure

### ✅ For AI Assistants

- **Single source of truth:** All specifications in one machine-readable file
- **No PDF parsing needed:** Content already extracted and formatted
- **Consistent responses:** Same guidelines every time
- **Complete context:** Foundations + components + patterns in one place

### ✅ For Developers

- **Clear hierarchy:** Know which doc to check first
- **Faster lookup:** Component index for quick reference
- **Better maintenance:** Updates in one place propagate to AI
- **Version controlled:** All guidelines tracked in git

### ✅ For Teams

- **Consistency:** Everyone follows same guidelines
- **Scalability:** Easy to add new components
- **Discoverability:** Clear organization and naming
- **Documentation as code:** Lives with the codebase

---

## 🔄 Updating Documentation

When Ingka releases new components or updates:

1. **Add/update PDF** in `docs/guides/Skapa-components/`
2. **Extract specifications** to `lib/ai-instructions/frontend-agent-ingka.instructions.md`
3. **Update component index** in `docs/guides/SKAPA_COMPONENT_INDEX.md`
4. **Test with AI:** Verify AI generates correct implementation

**Single source of truth:** The AI instructions file is the canonical reference.

---

## 📞 Support

- **Ingka Registry:** `https://npm.m2.blue.cdtapps.com`
- **Component Index:** `docs/guides/SKAPA_COMPONENT_INDEX.md`
- **AI Instructions:** `lib/ai-instructions/frontend-agent-ingka.instructions.md`
- **Integration Guide:** `docs/guides/INGKA_DESIGN_SYSTEM.md`

---

**Last Updated:** 2025-10-30
**Version:** 1.0.0
**Maintained by:** Ingvar Workflow Kit Team
