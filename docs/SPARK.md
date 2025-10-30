# 🚀 Ingvar Spark - Rapid App Generation

Generate complete, production-ready React apps from a single prompt using Ingvar Kit + GitHub Spark template!

## ✨ What is Ingvar Spark?

Ingvar Spark combines the power of:

- **Ingvar AI Code Generation** - Multi-model AI system (Claude 3.5 Sonnet, 4, 4.5)
- **GitHub Spark Template** - Modern React + TypeScript + Vite setup
- **shadcn/ui Components** - 40+ pre-built, accessible UI components
- **Modern Stack** - React 19, Tailwind CSS v4, Framer Motion, and more

**Result:** Complete apps generated in minutes, not hours!

## 🎯 Quick Start

```bash
# Generate a complete app from a prompt
ingvar spark --prompt "Create a todo app with dark mode"

# Specify app name and directory
ingvar spark --prompt "Build a dashboard with charts" --name "analytics-dash" --dir "./my-apps"

# Skip auto-install and auto-start
ingvar spark --prompt "Make a landing page" --no-install --no-start
```

## 📦 What You Get

### Complete Tech Stack

- **React 19** + **TypeScript** - Latest React with full type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form + Zod** - Form handling with validation
- **@tanstack/react-query** - Powerful state management
- **Lucide Icons** - Beautiful icon library

### Pre-built Components (40+)

```bash
# UI Components available out-of-the-box:
Button, Card, Input, Form, Dialog, Table, Chart, Select, Textarea,
Checkbox, RadioGroup, Switch, Slider, Progress, Badge, Alert, Avatar,
Accordion, Tabs, Calendar, Command, Dropdown, Navigation, Popover,
Sheet, Sidebar, Tooltip, Carousel, Collapsible, HoverCard, Separator,
Skeleton, Toggle, and more...
```

## 🎨 Example Prompts

### Simple Apps

```bash
ingvar spark --prompt "Create a todo app with dark mode"
ingvar spark --prompt "Build a simple calculator"
ingvar spark --prompt "Make a note-taking app"
```

### Dashboards & Data

```bash
ingvar spark --prompt "Create a analytics dashboard with charts and tables"
ingvar spark --prompt "Build a project management dashboard"
ingvar spark --prompt "Make a sales metrics dashboard with graphs"
```

### E-commerce & Business

```bash
ingvar spark --prompt "Create a product catalog with search and filters"
ingvar spark --prompt "Build an e-commerce checkout flow"
ingvar spark --prompt "Make a customer management system"
```

### Content & Media

```bash
ingvar spark --prompt "Create a blog with markdown support"
ingvar spark --prompt "Build a photo gallery with lightbox"
ingvar spark --prompt "Make a music player interface"
```

### Landing Pages & Marketing

```bash
ingvar spark --prompt "Create a SaaS landing page with pricing tiers"
ingvar spark --prompt "Build a portfolio website with contact form"
ingvar spark --prompt "Make a startup homepage with hero section"
```

## 🛠️ Command Options

```bash
ingvar spark [options]
```

### Options

- `-p, --prompt <text>` - Describe the app you want to build (required)
- `-n, --name <name>` - App name (auto-generated from prompt if not provided)
- `-d, --dir <directory>` - Output directory (default: `./spark-apps`)
- `--no-install` - Skip automatic `npm install`
- `--no-start` - Skip starting the development server

### Examples

```bash
# Interactive mode (prompts for input)
ingvar spark

# Direct command with prompt
ingvar spark --prompt "Create a weather app with location search"

# Custom name and directory
ingvar spark \
  --prompt "Build a task manager" \
  --name "my-tasks" \
  --dir "./projects"

# Skip install and start (for CI/CD)
ingvar spark \
  --prompt "Create a component library" \
  --no-install \
  --no-start
```

## 🏗️ Generated Project Structure

```
my-app/
├── src/
│   ├── App.tsx                 # Main application (AI-generated)
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   ├── components/            # Your custom components (AI-generated)
│   │   └── ui/                # shadcn/ui components (40+ pre-built)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ... (40+ more)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── components.json            # shadcn/ui configuration
```

## 🤖 AI Generation Process

1. **Template Setup** - Copy GitHub Spark template with all dependencies
2. **AI Code Generation** - Generate custom React components using Claude AI
3. **Component Integration** - Integrate with pre-built shadcn/ui components
4. **Dependency Installation** - Automatically install npm packages
5. **Development Server** - Start `npm run dev` automatically

### AI Models Used

- **Claude 3.5 Sonnet** (default) - Balanced performance and cost
- **Claude 4** - High-quality code generation
- **Claude 4.5** - Maximum capabilities for complex apps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm 9+ or Yarn
- Ingvar Kit installed: `npm install -g ingvar-kit`

### Create Your First App

```bash
# 1. Generate app
ingvar spark --prompt "Create a simple blog with dark mode"

# 2. Navigate to app
cd spark-apps/simple-blog

# 3. Start development
npm run dev

# 4. Open http://localhost:5173
```

## 🎨 Customization

The generated apps are fully customizable:

### Styling

- Modify `tailwind.config.js` for design tokens
- Edit `src/index.css` for global styles
- Use Tailwind classes for component styling

### Components

- Add new shadcn/ui components: `npx shadcn@latest add <component>`
- Create custom components in `src/components/`
- Import and use in your app

### Features

- Add more dependencies: `npm install <package>`
- Integrate with APIs using `@tanstack/react-query`
- Add routing with React Router
- Deploy to Vercel, Netlify, or any platform

## 🌟 Advanced Usage

### Custom AI Model

```bash
# Use specific AI model (for complex apps)
INGVAR_MODEL=claude-4 ingvar spark --prompt "Build a complex admin dashboard"
```

### Batch Generation

```bash
# Generate multiple apps
for app in "todo app" "calculator" "notes app"; do
  ingvar spark --prompt "Create a $app" --no-start --no-install
done
```

### CI/CD Integration

```bash
# Generate app in CI pipeline
ingvar spark \
  --prompt "$APP_DESCRIPTION" \
  --name "$APP_NAME" \
  --dir "./dist" \
  --no-install \
  --no-start
```

## 🔧 Troubleshooting

### Common Issues

**AI Generation Failed**

- Check internet connection
- Verify Anthropic API key: `export ANTHROPIC_API_KEY=your_key`
- Fallback template will be used automatically

**Install Failed**

- Run manually: `cd your-app && npm install`
- Check Node.js version: `node --version` (requires 18+)

**Dev Server Won't Start**

- Run manually: `cd your-app && npm run dev`
- Check port availability (default: 5173)

### Debug Mode

```bash
# Enable debug output
DEBUG=1 ingvar spark --prompt "Create an app"
```

## 📚 Resources

- [shadcn/ui Components](https://ui.shadcn.com/docs/components/accordion)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

Found a bug or want to contribute?

1. Check existing issues
2. Create new issue with details
3. Submit pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built with ❤️ by the Ingvar Kit team**

**🚀 Happy building!**
