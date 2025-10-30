/**
 * Code Generator for Ingvar Spark
 * Wrapper around the multi-model AI generator for app generation
 */

const { MultiModelCodeGenerator } = require('./multi-model-generator');
const chalk = require('chalk');

/**
 * Generate code using the multi-model AI system
 */
async function generateWithAI(systemPrompt, userPrompt, options = {}) {
  try {
    const generator = new MultiModelCodeGenerator();

    // Use Sonnet 3.5 by default for app generation (balanced performance/cost)
    const model = options.model || 'sonnet-3-5';
    const maxTokens = options.maxTokens || 4000;

    console.log(chalk.blue(`🤖 Using ${model} for code generation...`));

    const response = await generator.generateCode(
      systemPrompt,
      userPrompt,
      {
        model,
        maxTokens,
        temperature: 0.3 // Lower temperature for more consistent code
      }
    );

    return response.content;
  } catch (error) {
    console.log(chalk.yellow('⚠️  AI generation failed:', error.message));
    throw error;
  }
}

/**
 * Generate a complete React app structure
 */
async function generateSparkApp(prompt, appName, options = {}) {
  const systemPrompt = `You are an expert React developer creating a complete, production-ready app.

TECH STACK:
- React 19 + TypeScript
- Vite build tool
- Tailwind CSS v4 (latest)
- shadcn/ui components (pre-installed)
- Framer Motion animations
- React Hook Form + Zod validation
- @tanstack/react-query for state
- Lucide React icons

AVAILABLE COMPONENTS (import from @/components/ui/):
Button, Card, Input, Form, Dialog, Table, Chart, Select, Textarea, Checkbox, RadioGroup, Switch, Slider, Progress, Badge, Alert, Avatar, Accordion, Tabs, Calendar, Command, Dropdown, Navigation, Popover, Sheet, Sidebar, Tooltip, Carousel, Collapsible, HoverCard, Separator, Skeleton, Toggle, and more.

REQUIREMENTS:
1. Generate COMPLETE working React components
2. Use TypeScript with proper types
3. Implement responsive design (mobile-first)
4. Use shadcn/ui components extensively
5. Add smooth animations with Framer Motion
6. Include proper form validation with react-hook-form + zod
7. Add loading states and error handling
8. Create reusable, composable components
9. Follow React best practices (hooks, memo, etc.)
10. Use semantic HTML and accessibility features

OUTPUT FORMAT:
Generate multiple files as needed. Use this format:
\`\`\`tsx
// src/App.tsx
[component code here]
\`\`\`

\`\`\`tsx
// src/components/ComponentName.tsx
[component code here]
\`\`\`

\`\`\`tsx
// src/types/index.ts
[type definitions]
\`\`\`

Make it polished, production-ready, and delightful to use!`;

  const userPrompt = `Create a complete React app: ${prompt}

App name: ${appName}
Additional requirements: ${options.requirements || 'None'}

Generate a beautiful, functional app with multiple components, proper TypeScript types, responsive design, and excellent UX.`;

  return generateWithAI(systemPrompt, userPrompt, {
    model: options.model || 'sonnet-3-5',
    maxTokens: options.maxTokens || 4000
  });
}

module.exports = {
  generateWithAI,
  generateSparkApp
};
