---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

# This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

## Project-Specific Component Preferences

When working inside this Next.js project, apply these conventions on top of the design guidance above.

### Component Priority: Animate-UI → Shadcn → Custom

1. **Animate-UI** (`/components/animate-ui/`) — animated Shadcn variants, always prefer
2. **Shadcn UI** (`/components/ui/`) — fallback for components not in animate-ui
3. **Custom** — only when neither exists

```tsx
import { Button, Dialog, Checkbox } from '@/components/animate-ui/components';
import { Card, Input, Skeleton } from '@/components/ui';
```

### Typography — Use `<Text>` Component

Never use raw `h1`/`p`/`span` with manual Tailwind classes. Use the `Text` component:

```tsx
import { Text } from '@/components/Text';

<Text variant='hd-xxl'>Page Title</Text>   // h1
<Text variant='hd-lg'>Card Title</Text>    // h3
<Text variant='bd-md'>Body copy</Text>     // p (default)
<Text variant='muted'>Hint text</Text>     // span
```

Heading variants: `hd-xxl` → `hd-xs` | Body variants: `bd-xxl` → `bd-xs` | Special: `caption`, `label`, `muted`, `muted-sm`

### Navigation — `<Link>` Not `<a>`

```tsx
import Link from 'next/link';
<Link href='/admin'>Dashboard</Link>          // ✅ internal
<a href='https://ext.com' target='_blank'>…</a> // ✅ external only
```

### Empty States — `EmptyState` Component

```tsx
import { EmptyState } from '@/components/EmptyState';
import { ImageOff } from 'lucide-react';

<EmptyState icon={ImageOff} title='No items' description='Upload to get started.' />
```

### Loading States — Global Context

```tsx
const { setLoading, isLoading } = useLoading();
// Skeleton for data, Spinner for actions — never local useState(false)
```
