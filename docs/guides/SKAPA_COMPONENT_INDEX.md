# Skapa Design System - Component Reference Index

> **Official IKEA Ingka Skapa Design System Documentation**
>
> This index references the official PDF documentation located in `docs/guides/Skapa-components/` and `docs/guides/Skapa-foundations/`

---

## 📚 How to Use This Reference

**For AI/Copilot:** When generating code with Ingka components, reference the specific PDF for that component to ensure:

- Correct props and variants
- Proper usage patterns
- Accessibility requirements
- Visual specifications

**For Developers:** Review the PDFs before implementing components to understand IKEA's design standards.

---

## 🎨 Foundations (Design Tokens & Principles)

### Color System

- **`Colour-brand.pdf`** - IKEA brand colors (Swedish Blue, Yellow)
- **`Colour-main.pdf`** - Primary color palette
- **`Colour-extended.pdf`** - Extended color variations
- **`Colour-tokens.pdf`** - Color token specifications
- **Package:** `@ingka/colours`

### Typography

- **`Typography-system.pdf`** - Type system overview
- **`Typography-typeface.pdf`** - Typeface specifications (Noto Sans)
- **`Typography-using.pdf`** - Usage guidelines
- **`Typography-showcase.pdf`** - Typography examples
- **Package:** `@ingka/typography`

### Spacing & Layout

- **`Spacing.pdf`** - Spacing system (8px grid)
- **`Layouts-grids.pdf`** - Grid system and layouts
- **Package:** `@ingka/grid`

### Visual Elements

- **`Borders.pdf`** - Border specifications
- **`Corner-radius.pdf`** - Border radius standards
- **`Elevation.pdf`** - Shadow and depth system
- **`Design-tokens.pdf`** - Complete token reference
- **Package:** `@ingka/design-tokens`

### Iconography

- **`Iconography.pdf`** - Icon system overview
- **`Iconography-specs.pdf`** - Icon specifications
- **`Icons.pdf`** - Available icons
- **Package:** `@ingka/icon`

### Motion & Animation

- **`Motion-overview.pdf`** - Animation principles
- **`Motion-dynamics.pdf`** - Motion dynamics
- **`Motion-tokens.pdf`** - Animation tokens
- **Package:** `@ingka/animations`

### Content & Writing

- **`Writting-overview.pdf`** - Content strategy
- **`Writting-style.pdf`** - Writing style guide
- **`Writting-voice-tone.pdf`** - Voice and tone guidelines

---

## 🧩 Component Reference

### Layout Components

#### **Grid**

- **PDF:** `Layouts-grids.pdf`
- **Package:** `@ingka/grid`
- **Usage:** Responsive grid layouts

```tsx
import { Grid } from "@ingka/grid";
<Grid cols={3} gap="md">
  <Grid.Item>Content</Grid.Item>
</Grid>;
```

#### **Aspect Ratio Box**

- **PDF:** `Aspect-ratio-box.pdf`
- **Package:** `@ingka/aspect-ratio-box`
- **Usage:** Maintain aspect ratios for media

#### **Divider**

- **PDF:** `Divider.pdf`
- **Package:** `@ingka/divider`
- **Usage:** Visual separators

---

### Display Components

#### **Card**

- **PDF:** `Card.pdf`
- **Package:** `@ingka/card`
- **Usage:** Content containers

```tsx
import { Card } from "@ingka/card";
<Card>
  <Card.Media src="..." alt="..." />
  <Card.Content>
    <Card.Title>Title</Card.Title>
  </Card.Content>
</Card>;
```

#### **Compact Card**

- **PDF:** `Compact-card.pdf`
- **Package:** `@ingka/compact-card`
- **Usage:** Space-efficient cards

#### **Text**

- **PDF:** `Text.pdf`
- **Package:** `@ingka/text`
- **Usage:** Typography component with variants

#### **Image**

- **PDF:** `Image.pdf`, `Broken-image.pdf`
- **Package:** `@ingka/image`
- **Usage:** Optimized images with loading states

#### **List**

- **PDF:** `List.pdf`, `List-view-item.pdf`, `List-box.pdf`
- **Packages:** `@ingka/list`, `@ingka/list-view`, `@ingka/list-box`
- **Usage:** Lists and list items

#### **Table**

- **PDF:** `Table.pdf`
- **Package:** `@ingka/table`
- **Usage:** Data tables

#### **Tabs**

- **PDF:** `Tabs.pdf`
- **Package:** `@ingka/tabs`
- **Usage:** Tab navigation

#### **Text Overlay Cards**

- **PDF:** `Text-overlay-cards.pdf`
- **Package:** `@ingka/text-overlay-card`
- **Usage:** Cards with overlaid text on images

---

### Button Components

#### **Button**

- **PDF:** `Button.pdf` ⭐ **PRIMARY REFERENCE**
- **Package:** `@ingka/button`
- **Variants:** primary, secondary, tertiary, ghost
- **Sizes:** small, medium, large

```tsx
import { Button } from "@ingka/button";
<Button variant="primary" size="medium">
  Click me
</Button>;
```

#### **Icon Button**

- **PDF:** `Icon-button.pdf`
- **Package:** `@ingka/icon-button`
- **Usage:** Icon-only buttons

#### **Dual Button**

- **PDF:** `Dual-button.pdf`
- **Package:** `@ingka/dual-button`
- **Usage:** Two related actions

#### **Jumbo Button**

- **PDF:** `Jumbo-button.pdf`
- **Package:** `@ingka/jumbo-button`
- **Usage:** Large, prominent CTAs

#### **Expanding Button**

- **PDF:** `Expanding-button.pdf`
- **Package:** `@ingka/expanding-button`
- **Usage:** Expandable action buttons

#### **Pill / Icon Pill**

- **PDF:** `Pill.pdf`, `Icon-pill.pdf`
- **Packages:** `@ingka/pill`, `@ingka/icon-pill`
- **Usage:** Pill-shaped buttons

#### **Hyperlink**

- **PDF:** `Hyperlink.pdf`
- **Package:** `@ingka/hyperlink`
- **Usage:** Text links

---

### Form Components

#### **Input Field**

- **PDF:** `Input-field.pdf` ⭐ **PRIMARY REFERENCE**
- **Package:** `@ingka/input-field`
- **Types:** text, email, password, number, tel, url

```tsx
import { InputField } from "@ingka/input-field";
<InputField
  label="Email"
  type="email"
  required
  placeholder="Enter email"
  helperText="We'll never share your email"
/>;
```

#### **Text Area**

- **PDF:** `Text-area.pdf`
- **Package:** `@ingka/text-area`
- **Usage:** Multi-line text input

#### **Checkbox**

- **PDF:** `Checkbox.pdf`
- **Package:** `@ingka/checkbox`
- **Usage:** Boolean selections

#### **Radio Button**

- **PDF:** `Radio-button.pdf`
- **Package:** `@ingka/radio-button`
- **Usage:** Single selection from options

#### **Switch**

- **PDF:** `Switch.pdf`
- **Package:** `@ingka/switch`
- **Usage:** Toggle between two states

#### **Toggle**

- **PDF:** `Toggle.pdf`
- **Package:** `@ingka/toggle`
- **Usage:** Alternative toggle component

#### **Select**

- **PDF:** `Select-native.pdf`
- **Package:** `@ingka/select`
- **Usage:** Dropdown selection

#### **Combobox**

- **PDF:** `Combobox.pdf`
- **Package:** `@ingka/combobox`
- **Usage:** Searchable dropdown

#### **Choice**

- **PDF:** `Choice.pdf`
- **Package:** `@ingka/choice`
- **Usage:** Choice selector

#### **Search**

- **PDF:** `Search.pdf`
- **Package:** `@ingka/search`
- **Usage:** Search input with suggestions

#### **Slider**

- **PDF:** `Slider.pdf`
- **Package:** `@ingka/slider`
- **Usage:** Range slider

#### **Quantity Stepper**

- **PDF:** `Quantity-stepper.pdf`
- **Package:** `@ingka/quantity-stepper`
- **Usage:** Increment/decrement numeric input

#### **Segmented Control**

- **PDF:** `Segmented-control.pdf`
- **Package:** `@ingka/segmented-control`
- **Usage:** Segmented button group

---

### Feedback Components

#### **Badge**

- **PDF:** `Badge.pdf`
- **Package:** `@ingka/badge`
- **Usage:** Status indicators, counts

#### **Status**

- **PDF:** `Status.pdf`
- **Package:** `@ingka/status`
- **Usage:** Status indicators

#### **Toast**

- **PDF:** `Toast.pdf`
- **Package:** `@ingka/toast`
- **Usage:** Temporary notifications

#### **Banner**

- **PDF:** `Banner.pdf`
- **Package:** `@ingka/banner`
- **Usage:** Prominent messages

#### **Inline Message**

- **PDF:** `Inline-message.pdf`
- **Package:** `@ingka/inline-message`
- **Usage:** Contextual messages

#### **Helper Text**

- **PDF:** `Helper-text.pdf`
- **Package:** `@ingka/helper-text`
- **Usage:** Explanatory text for forms

#### **Loading**

- **PDF:** `Loading.pdf`
- **Package:** `@ingka/loading`
- **Usage:** Loading indicators

#### **Progress Indicator**

- **PDF:** `Progress-indicator.pdf`
- **Package:** `@ingka/progress-indicator`
- **Usage:** Progress bars

---

### Modal Components

#### **Modal Containers**

- **PDF:** `Modal-containers.pdf` ⭐ **PRIMARY REFERENCE**
- **Packages:** `@ingka/modal-prompt`, `@ingka/modal-sheets`, `@ingka/modal-theatre`
- **Types:** Prompt, Sheet, Theatre

```tsx
import { ModalPrompt } from "@ingka/modal-prompt";
<ModalPrompt open={isOpen} onClose={handleClose} title="Confirm Action">
  Content here
</ModalPrompt>;
```

#### **Prompt**

- **PDF:** `Prompt.pdf`
- **Package:** `@ingka/modal-prompt`
- **Usage:** Dialog prompts

#### **Sheet**

- **PDF:** `Sheet.pdf`
- **Package:** `@ingka/modal-sheets`
- **Usage:** Bottom sheets

#### **Theatre**

- **PDF:** `Theatre.pdf`
- **Package:** `@ingka/modal-theatre`
- **Usage:** Full-screen modals

#### **Tooltip**

- **PDF:** `Tooltip.pdf`
- **Package:** `@ingka/tooltip`
- **Usage:** Contextual help

---

### Navigation Components

#### **App Bar**

- **PDF:** `App-bar.pdf`
- **Package:** Not listed (may be part of another package)
- **Usage:** Application header

#### **Menu Item**

- **PDF:** `Menu-item.pdf`
- **Package:** Part of menu components
- **Usage:** Menu list items

---

### Media Components

#### **Simple Video**

- **PDF:** `Simple-video.pdf`
- **Package:** `@ingka/simple-video`
- **Usage:** Video player

#### **Carousel**

- **PDF:** `Carousel.pdf`
- **Package:** `@ingka/carousel`
- **Usage:** Image/content carousel

#### **Avatar**

- **PDF:** `Avatar.pdf`
- **Package:** `@ingka/avatar`
- **Usage:** User avatars

#### **Rating**

- **PDF:** `Rating.pdf`
- **Package:** `@ingka/rating`
- **Usage:** Star ratings

---

### E-commerce Components

#### **Price**

- **PDF:** `Price.pdf`
- **Package:** `@ingka/price`
- **Usage:** Price display with formatting

#### **Product Identifier**

- **PDF:** `Product-identifier.pdf`
- **Package:** `@ingka/product-identifier`
- **Usage:** Product IDs and SKUs

#### **Tag**

- **PDF:** `Tag.pdf`
- **Package:** `@ingka/tag`
- **Usage:** Product tags

#### **Endorsement Label**

- **PDF:** `Endorsement-label.pdf`
- **Package:** `@ingka/endorsement-label`
- **Usage:** Product endorsements

---

### Utility Components

#### **Accordion**

- **PDF:** `Accordion.pdf`
- **Package:** `@ingka/accordion`
- **Usage:** Expandable sections

#### **Expander**

- **PDF:** `Expander.pdf`
- **Package:** `@ingka/expander`
- **Usage:** Expandable content

---

## 🎯 Quick Reference for AI Code Generation

### When generating code with Ingka components:

1. **Check the PDF** - Review the component's PDF for:

   - Available props and variants
   - Required vs optional props
   - Accessibility requirements
   - Usage examples

2. **Follow patterns** - Use the documented patterns from PDFs:

   ```tsx
   // ✅ Correct (from PDF spec)
   <Button variant="primary" size="medium">Submit</Button>

   // ❌ Wrong (not in spec)
   <Button type="primary" big>Submit</Button>
   ```

3. **Respect foundations** - Reference foundation PDFs for:

   - Colors: `Colour-tokens.pdf`
   - Spacing: `Spacing.pdf` (8px grid)
   - Typography: `Typography-system.pdf`
   - Motion: `Motion-tokens.pdf`

4. **Accessibility first** - All components include accessibility specs in their PDFs

---

## 📝 Notes for Implementation

### For AI Assistants:

- **Always reference the PDF** when uncertain about component usage
- **Use exact prop names** as documented in PDFs
- **Follow IKEA's design principles**: Minimalist, functional, accessible
- **Stick to 8px spacing grid** as documented in `Spacing.pdf`

### For Developers:

- PDFs contain complete specifications including:
  - Visual examples
  - Code snippets
  - Accessibility guidelines
  - Do's and don'ts
  - Responsive behavior

### PDF Location:

- **Components:** `/docs/guides/Skapa-components/`
- **Foundations:** `/docs/guides/Skapa-foundations/`

---

## 🔍 How to Find the Right Component

| Need         | Component                      | PDF Reference                                           |
| ------------ | ------------------------------ | ------------------------------------------------------- |
| Display data | Table, Card, List              | `Table.pdf`, `Card.pdf`, `List.pdf`                     |
| User input   | Input Field, Text Area, Select | `Input-field.pdf`, `Text-area.pdf`, `Select-native.pdf` |
| Actions      | Button, Icon Button, Hyperlink | `Button.pdf`, `Icon-button.pdf`, `Hyperlink.pdf`        |
| Navigation   | Tabs, App Bar, Menu Item       | `Tabs.pdf`, `App-bar.pdf`, `Menu-item.pdf`              |
| Feedback     | Toast, Banner, Badge           | `Toast.pdf`, `Banner.pdf`, `Badge.pdf`                  |
| Selection    | Checkbox, Radio, Switch        | `Checkbox.pdf`, `Radio-button.pdf`, `Switch.pdf`        |
| Layout       | Grid, Divider, Card            | `Layouts-grids.pdf`, `Divider.pdf`, `Card.pdf`          |
| Media        | Image, Video, Carousel         | `Image.pdf`, `Simple-video.pdf`, `Carousel.pdf`         |
| Overlay      | Modal, Sheet, Tooltip          | `Modal-containers.pdf`, `Sheet.pdf`, `Tooltip.pdf`      |

---

**🎉 Complete reference to official IKEA Ingka Skapa Design System documentation**

All PDFs contain authoritative specifications directly from IKEA. When implementing components, always consult the relevant PDF for accurate, production-ready code.
