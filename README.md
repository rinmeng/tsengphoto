# Tseng Photography

A modern, professional photography portfolio and event photography website built for showcasing photography work in Vancouver and Kelowna.

## ✨ Features

- **Portfolio Galleries** - Photo collections, event photography, series, and video galleries
- **SEO Optimized** - Meta tags, Open Graph, and Twitter Card support for social sharing
- **Responsive Design** - Optimized viewing experience across all devices
- **Image Carousel** - Autoplay hero carousel on landing page
- **Dark/Light Mode** - Theme toggle with system preference support
- **Admin Panel** - Secure admin area for content management
- **Authentication** - Supabase-powered user authentication

## 📸 About

Tseng Photography provides professional event photography services in Vancouver and Kelowna, British Columbia. This website showcases our portfolio across multiple categories:

- **Collection** - Curated photo galleries
- **Events** - Corporate events, weddings, and private celebrations
- **Series** - Exclusive photography series and ongoing projects
- **Videos** - Professional videography and cinematic event coverage

## 🛠️ Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Server Components
- **[Shadcn UI](https://ui.shadcn.com/)** - Beautifully designed, accessible components built with Radix UI and Tailwind CSS
- **[Supabase](https://supabase.com/)** - Backend with PostgreSQL database, authentication, and real-time subscriptions
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety across the entire stack
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid UI development
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel component with autoplay functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended), npm, or yarn
- A [Supabase account](https://supabase.com/) and project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rinmeng/tsengphoto.git
cd tsengphoto
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

You can find these in your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

4. Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🎨 Code Formatting

This project uses Prettier with plugins for consistent code formatting:

- **Import sorting** - Organized import statements
- **Package.json formatting** - Sorted package.json files
- **Tailwind class ordering** - Consistent className organization

Format your code:

```bash
pnpm format
```

## 🛠️ Adding UI Components

Add Shadcn UI components as needed:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add dialog
```

See all [available components](https://ui.shadcn.com/docs/components).

## 🎯 Architecture

### Context + Hooks Pattern

State management follows a clean architecture:

1. **Contexts** (`contexts/`) - React Context providers for global state
2. **Custom Hooks** (`hooks/`) - Hooks to consume contexts (e.g., `useAuth`, `useToast`)
3. **Types** (`lib/types/`) - Centralized TypeScript type definitions
4. **Barrel Exports** - Index files for easy imports

Example:
```tsx
// Use authentication
import { useAuth } from '@/hooks/use-auth';

// Import types
import { AuthContextType } from '@/lib/types';
```

## 🗃️ Database Setup

> You must have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and configured to run migrations.

Run the migrations located in the `supabase/migrations/` folder using the Supabase CLI:

```bash
npx supabase db push
```

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Add environment variables (use your **cloud** Supabase values, not localhost):
   - `SUPABASE_URL` - Your cloud Supabase URL (e.g., https://xxx.supabase.co)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Cloud anon/publishable key
   - `SUPABASE_SERVICE_ROLE_KEY` - Cloud service role key (required for uploadthing)
   - `NEXT_PUBLIC_SITE_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)
   - `UPLOADTHING_TOKEN` - Your UploadThing secret key
   - `UPLOADTHING_APP_ID` - Your UploadThing app ID
4. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other platforms.

## 📝 Project Structure

```text
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation and theme
│   ├── page.tsx           # Landing page with hero carousel
│   ├── collection/        # Photo collection gallery
│   │   ├── layout.tsx    # SEO metadata for collections
│   │   └── page.tsx      # Collection page
│   ├── events/            # Event photography showcase
│   │   ├── layout.tsx    # SEO metadata for events
│   │   └── page.tsx      # Events page
│   ├── series/            # Photography series & projects
│   │   ├── layout.tsx    # SEO metadata for series
│   │   └── page.tsx      # Series page
│   ├── videos/            # Videography portfolio
│   │   ├── layout.tsx    # SEO metadata for videos
│   │   └── page.tsx      # Videos page
│   ├── admin/             # Admin dashboard
│   │   └── page.tsx      # Admin page
│   ├── login/             # Authentication
│   │   └── page.tsx      # Login page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Hero.tsx          # Landing page carousel
│   ├── Navbar.tsx        # Navigation bar
│   ├── Logo.tsx          # Brand logo
│   ├── ModeToggle.tsx    # Dark/Light theme toggle
│   └── ui/               # Shadcn UI components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx   # Authentication context
│   └── ToastContext.tsx  # Toast notifications context
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   ├── use-toast.ts      # Toast notifications hook
│   └── use-mobile.ts     # Mobile detection hook
├── lib/                   # Utility functions and shared types
│   ├── supabase.ts       # Supabase client setup
│   ├── utils.ts          # Utility functions (cn, etc.)
│   └── types/            # TypeScript type definitions
│       ├── auth.ts       # Auth-related types
│       ├── toast.ts      # Toast-related types
│       └── index.ts      # Type exports
├── public/               # Static assets
│   ├── landing/          # Landing page assets
│   │   └── carousel/    # Carousel images (1-5.webp)
│   └── icons/           # Icon assets
├── supabase/             # Supabase configuration
│   ├── config.toml      # Supabase local config
│   └── migrations/      # Database migrations
└── next.config.ts        # Next.js configuration
```

## 📸 Features Overview

### SEO Optimization

Each page section (Collection, Events, Series, Videos) includes comprehensive SEO metadata:
- Custom titles and descriptions
- Open Graph tags for social media previews
- Twitter Card support
- Relevant keywords for search engines
- Canonical URLs
- Placeholder images from carousel assets

### Hero Carousel

The landing page features an auto-playing carousel with:
- 5 featured images from `/public/landing/carousel/`
- Autoplay with 2-second delay
- Navigation buttons and dots
- Responsive design that maintains full viewport height
- Object-cover for proper image scaling

### Theme Support

- Light and dark mode toggle
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation & Resources

### Next.js

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [App Router](https://nextjs.org/docs/app) - Modern routing and layouts
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Server-side mutations
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial

### Shadcn UI

- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - Component library docs
- [Browse Components](https://ui.shadcn.com/docs/components) - Available components
- [Installation Guide](https://ui.shadcn.com/docs/installation/next) - Next.js specific setup
- [Theming](https://ui.shadcn.com/docs/theming) - Customize colors and appearance

### Supabase

- [Supabase Documentation](https://supabase.com/docs) - Complete guide
- [Authentication](https://supabase.com/docs/guides/auth) - User authentication setup
- [Database](https://supabase.com/docs/guides/database) - PostgreSQL database
- [Real-time](https://supabase.com/docs/guides/realtime) - Real-time subscriptions
- [Storage](https://supabase.com/docs/guides/storage) - File storage
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) - Integration guide

### Styling

- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility classes
- [Radix UI](https://www.radix-ui.com/primitives) - Accessible component primitives

### Code Quality

- [Prettier Documentation](https://prettier.io/docs/en/) - Code formatting
- [Prettier Plugins](https://prettier.io/docs/en/plugins.html) - Extend Prettier functionality
