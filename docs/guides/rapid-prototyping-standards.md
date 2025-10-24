# 🚀 Rapid Prototyping Standards v5.0.0

> **Component-Driven, Design-First Development**
>
> This guide establishes standards for rapidly building UI components while maintaining
> consistency, accessibility, and performance. The goal: ship visual prototypes in
> minutes, not days.

---

## 📋 Table of Contents

- [Component Structure](#component-structure)
- [Naming Conventions](#naming-conventions)
- [Reusable Component Patterns](#reusable-component-patterns)
- [UI Kit / Component Library](#ui-kit--component-library)
- [Design Tokens](#design-tokens)
- [Rapid Build Workflow](#rapid-build-workflow)
- [Quality Checkpoints](#quality-checkpoints)

---

## Component Structure

### Directory Organization

```
src/
├── components/
│   ├── foundation/          # Design system foundations
│   │   ├── colors.js
│   │   ├── typography.js
│   │   ├── spacing.js
│   │   └── icons.js
│   ├── atoms/              # Single elements (Button, Input, Badge)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.stories.jsx
│   │   │   └── Button.test.jsx
│   │   ├── Input/
│   │   ├── Badge/
│   │   └── Icon/
│   ├── molecules/          # Combinations (FormGroup, Card, ListItem)
│   │   ├── FormGroup/
│   │   ├── Card/
│   │   └── ListItem/
│   ├── organisms/          # Complex sections (Header, Sidebar, Form)
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── ProfileForm/
│   ├── layouts/            # Page layouts
│   │   ├── MainLayout/
│   │   ├── AuthLayout/
│   │   └── DashboardLayout/
│   └── features/           # Feature-specific components
│       ├── Profile/
│       ├── Dashboard/
│       └── Settings/
```

### Component File Template

```javascript
// Button.jsx
import styles from './Button.module.css';

/**
 * @component
 * Button component for actions and navigation
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'} props.variant - Visual variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {ReactNode} props.children - Button text/content
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onClick - Click handler
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
}) {
  const classNames = `
    ${styles.button}
    ${styles[`variant-${variant}`]}
    ${styles[`size-${size}`]}
    ${disabled || loading ? styles.disabled : ''}
    ${className}
  `;
  
  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
}

export default Button;
```

---

## Naming Conventions

### Component Naming

**PascalCase for components:**
```
✅ Button, ProfileCard, UserAvatar, FormInput
❌ button, profileCard, user-avatar, form_input
```

### Prop Naming

**camelCase for props:**
```javascript
✅ onClick, onHover, isActive, hasError
❌ on-click, OnClick, on_click, has_error
```

### CSS Class Naming

**Use CSS Modules with BEM for specificity:**
```css
/* Button.module.css */
.button { /* base */ }
.button--primary { /* variant */ }
.button--lg { /* modifier */ }
.button:disabled { /* state */ }

/* Or with camelCase */
.button { /* base */ }
.buttonPrimary { /* variant */ }
.buttonLarge { /* size */ }
.buttonDisabled { /* state */ }
```

### File Naming

**Match component name:**
```
Button/
├── Button.jsx              # Component
├── Button.module.css       # Styles
├── Button.stories.jsx      # Storybook
├── Button.test.jsx         # Tests
└── index.js                # Export
```

---

## Reusable Component Patterns

### Pattern 1: Simple Input Component

```javascript
// Input.jsx
import styles from './Input.module.css';

export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = null,
  label = null,
  required = false,
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        className={`${styles.input} ${error ? styles.error : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
```

### Pattern 2: Card Component

```javascript
// Card.jsx
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Usage
<Card className="p-4">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### Pattern 3: List Component with Items

```javascript
// List.jsx
export function List({ items, renderItem, keyExtractor }) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={keyExtractor?.(item) || index} className={styles.listItem}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  keyExtractor={(user) => user.id}
  renderItem={(user) => <UserCard user={user} />}
/>
```

### Pattern 4: Modal Component

```javascript
// Modal.jsx
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
```

---

## UI Kit / Component Library

### Core Components to Build

#### Atoms (Single elements)

```
Button
├── Primary, Secondary, Danger variants
├── Small, Medium, Large sizes
├── Default, Hover, Active, Disabled, Loading states

Input
├── Text, Email, Password types
├── With/without label
├── Error state with message
├── Placeholder text

Badge
├── Color variants
├── Small, Medium sizes
├── Dismissible option

Icon
├── 24 standard icons
├── Scalable sizes
├── Color variants

Avatar
├── With image, initials, fallback
├── Small, Medium, Large, XL sizes
├── Online/offline badge
```

#### Molecules (Combinations)

```
FormGroup
├── Label + Input + Error

Card
├── Container with padding/shadow
├── Optional header/footer

ListItem
├── Icon + Text + Actions

NavigationItem
├── Icon + Label + Active state

Chip / Tag
├── Removable option
├── Color variants
```

#### Organisms (Complex sections)

```
Header / Navigation
├── Logo + Nav items + User menu

Sidebar
├── Navigation menu
├── Collapsible sections

Modal
├── Header + Content + Footer
├── Overlay backdrop

Form
├── Multiple FormGroups
├── Submit button
├── Validation

DataTable
├── Headers + Rows
├── Sorting + Pagination
├── Row selection
```

---

## Design Tokens

### Colors

```javascript
// src/tokens/colors.js
export const colors = {
  // Primary palette
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    500: '#0ea5e9',    // Main
    600: '#0284c7',
    900: '#0c2d6b',
  },
  
  // Semantic colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Neutral
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
};
```

### Typography

```javascript
// src/tokens/typography.js
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", monospace',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing

```javascript
// src/tokens/spacing.js
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
};
```

---

## Rapid Build Workflow

### Fast Component Workflow (Target: 5-10 min per component)

**Step 1: Define Props (2 min)**
```javascript
// Write prop interface first
const Button = ({ variant = 'primary', size = 'md', children, onClick }) => {
  // ...
}
```

**Step 2: Write JSX (3 min)**
```javascript
return (
  <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
    {children}
  </button>
);
```

**Step 3: Style (3 min)**
```css
.btn { /* base styles */ }
.btn-primary { /* variant */ }
.btn-md { /* size */ }
```

**Step 4: Create Story (2 min)**
```javascript
export const Primary = { args: { variant: 'primary', children: 'Click me' } };
export const Secondary = { args: { variant: 'secondary', children: 'Cancel' } };
```

### Total: ~10 minutes per component

---

## Quality Checkpoints

### Pre-Commit Checklist

✅ **Component Complete:**
- [ ] Props documented with JSDoc
- [ ] All variants rendered
- [ ] All states handled
- [ ] Responsive at all breakpoints

✅ **Styling:**
- [ ] Matches design tokens
- [ ] Colors correct
- [ ] Spacing using 8px grid
- [ ] Responsive CSS works
- [ ] Dark mode support

✅ **Accessibility:**
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus visible
- [ ] Color contrast passes

✅ **Testing:**
- [ ] Storybook stories created
- [ ] Unit tests passing
- [ ] No console warnings

### Commit Message Format

```
feat(components): add Button component (#42)

Implements primary, secondary, and danger variants
with small, medium, and large sizes.

- Base Button component
- All CSS variants
- Storybook stories
- Unit tests
```

---

## Speed Tips

### Reuse Everything

```javascript
// ✅ GOOD - Reuse existing Avatar
import Avatar from './atoms/Avatar';

// ❌ BAD - Create new
const CustomAvatar = () => { /* ... */ };
```

### Use Design Tokens

```javascript
// ✅ GOOD
import { colors, spacing } from '../tokens';
const style = { color: colors.primary[500], padding: spacing[4] };

// ❌ BAD
const style = { color: '#0ea5e9', padding: '16px' };
```

### Template Existing Patterns

```javascript
// Copy existing component structure
// Just change variant names/styles
// Saves 5 minutes per component
```

### Parallel Development

```
Designer → creates spec (5 min)
Frontend → builds Avatar (5 min)  ┐
Frontend → builds Button (5 min)  ├─ In parallel (10 min total)
Frontend → builds Card (5 min)    ┘
```

---

**End of Rapid Prototyping Standards v5.0.0**

> Ship fast. Reuse often. Design consistently.
> **Prototype in minutes. Iterate based on feedback. Ship with confidence.**
