# LEO Workflow Kit - Best Practices Quick Reference

> **Version 2.0** - Comprehensive guide to component-first development, performance optimization, and SEO excellence

---

## 🧩 Component-First Development

### Atomic Design Hierarchy

```
components/
├── atoms/          # Button, Input, Icon, Label, Badge
├── molecules/      # SearchBar, FormField, Card, MenuItem  
├── organisms/      # Header, Footer, DataTable, Sidebar
├── templates/      # DashboardLayout, AuthLayout, BlogLayout
└── pages/          # HomePage, DashboardPage, ProfilePage
```

### Component Extraction Rules

**Extract a component when:**
- ✅ Used in 2+ places
- ✅ Complex enough to warrant isolation
- ✅ Represents a clear UI concept
- ✅ Has reusable logic or styling

**Keep it local when:**
- ❌ Only used once
- ❌ Tightly coupled to parent
- ❌ Too simple (just wrapping HTML)
- ❌ Premature abstraction

### Example: Good Component

```typescript
/**
 * Primary button component for user actions
 * 
 * @example
 * <Button variant="primary" size="lg" onClick={handleSave}>
 *   Save Changes
 * </Button>
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'button',
        `button--${variant}`,
        `button--${size}`,
        { 'button--loading': loading }
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

---

## 🔄 DRY Principle (Don't Repeat Yourself)

### When to Extract

| Repetition | Action |
|------------|--------|
| 3+ similar blocks | Extract to function/component |
| Repeated logic | Create utility function |
| Repeated styles | Extract CSS class/styled component |
| Repeated patterns | Create custom hook or HOC |

### Examples

#### ❌ Bad: Repeated Logic

```typescript
const handleUserClick = () => {
  if (!user) {
    toast.error('Please log in');
    router.push('/login');
    return;
  }
  // user logic
};

const handleCommentClick = () => {
  if (!user) {
    toast.error('Please log in');
    router.push('/login');
    return;
  }
  // comment logic
};
```

#### ✅ Good: Extracted Hook

```typescript
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

### Common Utilities to Extract

```typescript
// utils/formatters.ts
export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(value);

export const formatDate = (date: Date, style: 'short' | 'medium' | 'long' = 'medium') => 
  new Intl.DateTimeFormat('en-US', { dateStyle: style }).format(date);

// utils/validators.ts
export const isValidEmail = (email: string) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // ... implementation
};

// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay = 500) => {
  // ... implementation
};
```

---

## ⚡ Performance Optimization

### Lazy Loading Checklist

- [ ] **Route-based code splitting** (automatic with React Router/Next.js)
- [ ] **Component lazy loading** for heavy components (charts, videos, editors)
- [ ] **Image lazy loading** with `loading="lazy"` attribute
- [ ] **Dynamic imports** for features used by <50% of users

### Example: Lazy Loading

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

### Image Optimization

```html
<!-- ✅ Perfect: WebP with fallback, lazy loading, dimensions -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img 
    src="image.jpg" 
    alt="Descriptive alt text"
    width="800" 
    height="600"
    loading="lazy"
  >
</picture>
```

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | ≤2.5s | 2.5-4.0s | >4.0s |
| FID (First Input Delay) | ≤100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

### Performance Optimization Checklist

- [ ] All images optimized (WebP format, proper dimensions)
- [ ] Routes lazy loaded
- [ ] Heavy components code-split
- [ ] Critical CSS inlined in `<head>`
- [ ] Non-critical CSS loaded async
- [ ] Fonts optimized (system fonts + web fonts with `font-display: swap`)
- [ ] Preconnect to external domains
- [ ] Debounce expensive operations (search, scroll handlers)
- [ ] Virtualize long lists (react-window, react-virtual)
- [ ] Memoize expensive calculations (`useMemo`, `React.memo`)

---

## 🔍 SEO Optimization

### Essential Meta Tags Template

```html
<!-- Primary Meta Tags -->
<title>Page Title - Max 60 characters</title>
<meta name="title" content="Page Title">
<meta name="description" content="Compelling description 150-160 chars">

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

<!-- Canonical URL -->
<link rel="canonical" href="https://yoursite.com/page">
```

### Semantic HTML

```html
<!-- ✅ Good: Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
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

### Structured Data Example

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
  "image": "https://yoursite.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "Your Company",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoursite.com/logo.jpg"
    }
  }
}
</script>
```

### SEO Checklist

- [ ] **Title tag** (50-60 characters, includes primary keyword)
- [ ] **Meta description** (150-160 characters, compelling CTA)
- [ ] **Canonical URL** set for all pages
- [ ] **Open Graph tags** for social sharing
- [ ] **Twitter Card tags** for Twitter sharing
- [ ] **Semantic HTML** throughout (header, nav, main, article, section, footer)
- [ ] **Heading hierarchy** (single H1, logical H2-H6 structure)
- [ ] **Image alt text** for all images
- [ ] **Internal linking** with descriptive anchor text
- [ ] **Mobile-friendly** (responsive design, touch targets ≥44px)
- [ ] **Fast loading** (score >90 on PageSpeed Insights)
- [ ] **HTTPS** enabled
- [ ] **Sitemap.xml** generated and submitted
- [ ] **Robots.txt** configured
- [ ] **Structured data** implemented (Schema.org)

### URL Best Practices

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

---

## ♿ Accessibility (WCAG 2.1 AA)

### Checklist

- [ ] **Color contrast**: 4.5:1 for normal text, 3:1 for large text
- [ ] **Keyboard navigation**: All interactive elements accessible via Tab, Enter, Escape
- [ ] **Focus indicators**: Visible focus states for all interactive elements
- [ ] **Alt text**: Descriptive alt text for all images
- [ ] **ARIA labels**: Proper ARIA roles and labels where needed
- [ ] **Form labels**: All form inputs have associated labels
- [ ] **Touch targets**: Minimum 44x44px for mobile
- [ ] **Screen reader testing**: Test with VoiceOver/NVDA

### Example: Accessible Button

```typescript
<button
  aria-label="Save changes"
  aria-describedby="save-description"
  disabled={isLoading}
  onClick={handleSave}
>
  {isLoading ? <Spinner aria-hidden="true" /> : 'Save'}
</button>
<span id="save-description" className="sr-only">
  Save your changes to the database
</span>
```

---

## 🧪 Testing Standards

### Test Types

| Test Type | Purpose | Tools |
|-----------|---------|-------|
| **Unit** | Test individual functions/components | Jest, Vitest |
| **Integration** | Test component interactions | React Testing Library |
| **E2E** | Test complete user flows | Playwright, Cypress |
| **Visual** | Test UI appearance | Storybook, Chromatic |

### Testing Checklist

- [ ] Unit tests for all business logic
- [ ] Component tests for UI with different states
- [ ] Integration tests for critical workflows
- [ ] E2E tests for main user journeys
- [ ] Meaningful coverage (aim for 70%+, but focus on critical paths)
- [ ] Tests run in CI/CD pipeline

---

## 🔒 Security Best Practices

- [ ] Never commit secrets, API keys, or credentials
- [ ] Validate and sanitize all user inputs
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Implement proper authentication and authorization
- [ ] Use HTTPS for all production traffic
- [ ] Implement rate limiting for APIs
- [ ] Keep dependencies updated (use Dependabot)
- [ ] Follow OWASP Top 10 guidelines

---

## 📝 Code Style

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables/Functions | camelCase | `getUserData`, `isActive` |
| Components/Classes | PascalCase | `UserProfile`, `DataService` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Files | Match component or kebab-case | `UserProfile.tsx`, `api-client.ts` |

### Example: Clean Code

```typescript
// ✅ Good: Self-documenting, clean
const getActiveUsers = async (filters: UserFilters) => {
  const users = await fetchUsers(filters);
  return users.filter(user => user.status === 'active');
};

// ❌ Bad: Unclear, poor naming
const getData = async (f: any) => {
  const d = await fetch(f);
  return d.filter(x => x.s === 'a');
};
```

---

## 🚀 Quick Start

1. **Install**: `npm install -g leo-workflow-kit`
2. **Initialize**: `leo init` (choose to create new or use existing GitHub Project)
3. **Create issues**: `leo issue`
4. **Follow best practices**: Check `.github/copilot-instructions.md` for comprehensive guidelines

---

## 📚 Additional Resources

- **Full Documentation**: [GitHub Repository](https://github.com/leonpagotto/leo-kit)
- **Issue Templates**: `.github/ISSUE_TEMPLATE/`
- **Copilot Instructions**: `.github/copilot-instructions.md`
- **Component Examples**: Embedded in Copilot instructions

---

**Made with 🦁 by Leo Pagotto**

*LEO Workflow Kit v2.0 - Component-First Development with Spec-Driven Methodology*
