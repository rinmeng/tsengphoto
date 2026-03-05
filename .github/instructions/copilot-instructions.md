---
description: Describe when these instructions should be loaded
applyTo: '**/*' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

# Copilot Project Instructions

## Stack

- Framework: Next.js 15 (App Router)
- Backend: Supabase (PostgreSQL)
- File Uploads: UploadThing
- Language: TypeScript
- Styling: Tailwind CSS + Shadcn UI
- Authentication: Supabase Auth

---

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  ├── api/v1/          # API endpoints (versioned)
  ├── admin/           # Protected admin pages
  └── ...              # Public pages (events, series, collection, etc.)

components/            # React components
  ├── ui/             # Shadcn UI components
  ├── animate-ui/     # Custom animated components
  └── ...             # Feature components (Navbar, Hero, etc.)

services/              # Business logic layer
  └── *.service.ts    # Service modules for data operations

lib/
  ├── types/          # TypeScript type definitions
  └── utils.ts        # Utility functions

utils/supabase/       # Supabase client configurations
  ├── client.ts       # Client-side Supabase client
  ├── server.ts       # Server-side Supabase client (with cookies)
  ├── admin.ts        # Admin client (service role, bypasses RLS)
  └── proxy.ts        # Supabase session update for middleware

proxy.ts              # Next.js middleware (route protection)

supabase/             # Supabase local development
  ├── migrations/     # Database migrations
  └── seed.sql        # Seed data
```

---

## Middleware (proxy.ts)

**Important:** This project uses `proxy.ts` instead of the standard `middleware.ts` (Next.js 15 convention).

The middleware handles:
- Authentication state via Supabase session refresh
- Protected route redirects (e.g., `/admin` requires auth)
- Auth page redirects (e.g., logged-in users redirected away from `/login`)

### Excluding Routes from Middleware

Third-party API callbacks must be completely excluded from middleware to avoid interference.

**Best Practice Pattern:**
```typescript
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // Early return for routes that handle their own auth
  if (nextUrl.pathname.startsWith('/api/v1/uploadthing')) {
    return NextResponse.next();
  }

  // Normal middleware logic continues...
  const { user, supabaseResponse } = await updateSession(request);
  // ...
}

export const config = {
  matcher: [
    // Use negative lookahead to exclude specific routes
    '/((?!_next|api/v1/uploadthing|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
```

**Critical Rules:**
1. Exclude callback routes in BOTH matcher AND early return
2. Use negative lookahead pattern in matcher for exclusions
3. Always return `NextResponse.next()` for excluded routes (not `undefined`)
4. If using Vercel Deployment Protection, add callback routes to bypass list

---

## Architecture Pattern

This project follows a layered architecture:

1. UI Layer (Components)
   - React components in `/components/` and `/app/`
   - Must not contain business logic
   - Must not directly call Supabase or fetch APIs
   - Use hooks (`useAuth`, `useToast`) and service layer
   - Handle loading/error states from service responses

2. Service Layer (`/services/*.service.ts`)
   - Contains all business logic and data operations
   - Interacts with Supabase and UploadThing
   - Returns structured responses: `{ success: boolean, data?: T, error?: string }`
   - Logs errors with service name prefix: `[ServiceName] Error: ...`
   - Does NOT return raw database errors to callers

3. API / Route Layer (`/app/api/`)
   - Next.js Route Handlers for external-facing APIs
   - Authentication validation
   - Input validation
   - Calls service layer
   - Returns safe, sanitized responses

Rules:
- **Never call Supabase directly inside React components** - Always use service layer
- Never expose raw Supabase error objects
- Never mix validation logic with database logic
- Prefer explicit types and return contracts
- Import types from `@/lib/types`
- Service functions must return structured responses with `success` flag
- Components should check `success` and handle errors via toast notifications

**Example - Service Layer:**
```typescript
// services/uploads.service.ts
export async function fetchUploads(): Promise<Upload[] | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('uploads').select('*');
    
    if (error) {
      console.error('[UploadService] Error fetching uploads:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('[UploadService] Unexpected error:', error);
    return null;
  }
}
```

**Example - Component Usage:**
```typescript
// app/admin/page.tsx
import * as UploadService from '@/services/uploads.service';

const data = await UploadService.fetchUploads();
if (!data) {
  toast.error('Failed to load uploads');
} else {
  setUploads(data);
}
```

---

## Error Handling & Security Policy

Security is mandatory. Error messages must never leak internal details.

### Core Rule

User-facing responses must NEVER include:
- Supabase error messages
- Stack traces
- SQL details
- Internal IDs
- Auth state details
- UploadThing internal errors

---

## Default Error Response

If an error is not explicitly safe:

Return:
  "Something went wrong. Please try again."

Log:
- Full error object
- Stack trace
- Context (route name, user id if available)

Logging must only occur server-side.

---

## Safe Errors (Allowed to Show)

An error is considered safe ONLY if:
- It does not reveal internal structure.
- It does not help attackers enumerate resources.
- It does not confirm existence of sensitive data.

Examples of safe user-facing errors:
- "Invalid email format."
- "Password must be at least 8 characters."
- "File type not supported."
- "File size exceeds limit."

---

## Console Logging Best Practices

**Log Only What Matters:**
- ❌ Remove verbose debug logs from production code
- ❌ Remove request/response logging for successful operations
- ✅ Keep error logs with context (service name prefix: `[ServiceName] Error:`)
- ✅ Keep critical failure logs (database errors, auth failures, callback failures)
- ✅ Keep warnings for unexpected but handled conditions

**Comment Only When Needed:**
- Remove comments that simply restate the code
- Keep comments for complex logic, workarounds, or non-obvious behavior
- Document WHY, not WHAT (code shows what, comments explain why)

**Examples:**
```typescript
// ❌ Bad: Verbose success logging
console.log('[API] Request received');
console.log('[API] Processing data');
console.log('[API] Sending response');

// ✅ Good: Error logging only
if (error) {
  console.error('[UploadService] Database error:', error);
}

// ❌ Bad: Obvious comment
// Create a new user
const user = await createUser();

// ✅ Good: Explains non-obvious behavior
// Skip auth check for callbacks - they don't have user session cookies
if (!url.searchParams.has('actionType')) {
  return { userId: 'system-callback' };
}
```

---

## Authentication & Authorization

### Available Auth Functions

```typescript
// hooks/use-auth.ts
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut, useAuth } from '@/hooks/use-auth';

// Get current session user
const { user, error } = await getCurrentUser();

// Sign in
const { data, error } = await signInWithEmail(email, password);

// Sign up
const { data, error } = await signUpWithEmail(email, password);

// Sign out
const { error } = await signOut();

// Use auth context in components
const { user, loading } = useAuth();
```

### Protected Routes

For pages that should redirect unauthenticated users:
- Check auth status in `useEffect`
- Redirect to `/login` if no user
- Show loading state while checking

For login pages:
- Redirect authenticated users to `/admin` or appropriate page
- Prevent logged-in users from accessing login page

```typescript
// Example: Redirect if already logged in
useEffect(() => {
  const checkAuth = async () => {
    const { user } = await getCurrentUser();
    if (user) {
      router.push('/admin');
    }
  };
  checkAuth();
}, []);
```

---

## Authentication Rules

For login or protected routes:
- Never say "User does not exist."
- Never say "Incorrect password."
- Never confirm account state.

Use:
  "Invalid credentials."
  "Unauthorized."

---

## Supabase Handling

When calling Supabase:
- Check for `error`.
- If error exists:
    - Log full error server-side.
    - Throw a generic application error.
    - Do NOT return the Supabase error message to client.

---

## UploadThing Handling

**CRITICAL: Vercel Deployment Protection**
- UploadThing callbacks will receive 401 errors if Vercel Authentication/Protection is enabled
- **Solution:** Add `/api/v1/uploadthing` to "Protection Bypass for Automation" in Vercel dashboard
- Location: Project Settings → Deployment Protection → Protection Bypass for Automation
- Without this bypass, callbacks fail silently with 401 (files upload but database insert never happens)

**Middleware Configuration:**
- `/api/v1/uploadthing` routes MUST be excluded from proxy.ts middleware
- Middleware matcher must use negative lookahead: `/((?!_next|api/v1/uploadthing|...]).*)`
- Early return in proxy function: `if (nextUrl.pathname.startsWith('/api/v1/uploadthing')) return NextResponse.next();`

**Callback Authentication:**
- Callbacks from UploadThing servers don't have user session cookies
- Middleware in core.ts detects callbacks by absence of `actionType` query parameter
- Skip auth checks for callback requests (they use userId from metadata sent during upload)

**Auto-Detection:**
- Let UploadThing auto-detect callback URLs (don't set callbackUrl manually)
- Vercel sets VERCEL_URL automatically, but it may point to different preview deployments
- For production stability, set NEXT_PUBLIC_SITE_URL environment variable

When upload fails:
- Log full UploadThing error server-side
- Return a generic failure message
- Only expose validation-related failures (size/type) if safe

---

## UI/UX Guidelines

### Component Preferences

**Component Selection Priority:**

1. **Prefer Animate-UI** (when component exists) - Animated version of Shadcn
2. **Use Shadcn UI** (fallback) - Base component library
3. **Custom components** (only when necessary) - Last resort

**Animate-UI:**

Animate-UI is an animated variant of Shadcn UI with Framer Motion enhancements. Components are located in `/components/animate-ui/`.

Available Animate-UI components:
- `components/animate-ui/components/` - Exported animated components (Button, Dialog, Sheet, AlertDialog, Checkbox)
- `components/animate-ui/primitives/` - Base primitives with motion support

**Import pattern:**
```tsx
// ✅ Prefer animate-ui when available
import { Button, Dialog, Checkbox } from '@/components/animate-ui/components';

// ✅ Use shadcn for components not in animate-ui
import { Card, Input, Spinner } from '@/components/ui';

// ❌ Don't create custom components when shadcn/animate-ui exists
<div className='...custom button'> // Bad
```

**When to use Animate-UI:**
- Forms and interactive elements (Button, Checkbox, Dialog)
- User feedback components (AlertDialog, Sheet)
- Any component that benefits from smooth animations

**When to use Shadcn UI:**
- Layout components (Card, Separator, Tabs)
- Data display (Table, Badge, Skeleton)
- Components not yet available in animate-ui

**Available Shadcn components:**
- Layout: Card, CardHeader, CardTitle, CardDescription, CardContent
- Forms: Input, Form, FormField, Select, Textarea, etc.
- Feedback: Toast, Spinner, Skeleton, Empty, Alert
- Navigation: Tabs, Dropdown, etc.

Check `/components/animate-ui/components/` first, then `/components/ui/` before creating custom components.

### Typography - Text Component

Use the `Text` component for all text throughout the application - it provides consistent, responsive typography:

```tsx
import { Text } from '@/components/Text';

// Headings (hd-xxl = largest, hd-xs = smallest)
<Text variant='hd-xxl'>Main Page Title</Text>          // 3xl → 5xl → 6xl
<Text variant='hd-xl'>Section Heading</Text>           // 2xl → 4xl → 5xl
<Text variant='hd-lg'>Card/Component Title</Text>      // xl → 2xl → 3xl
<Text variant='hd-md'>Subsection</Text>                // lg → xl → 2xl
<Text variant='hd-sm'>Small Heading</Text>             // base → lg → xl
<Text variant='hd-xs'>Tiny Heading</Text>              // sm → base → lg

// Body text (bd-xxl = largest, bd-xs = smallest)
<Text variant='bd-xxl'>Extra large body</Text>         // xl → 2xl → 3xl
<Text variant='bd-xl'>Large body</Text>                // lg → xl → 2xl
<Text variant='bd-lg'>Emphasized body</Text>           // base → lg → xl
<Text variant='bd-md'>Regular body (default)</Text>    // sm → base → lg
<Text variant='bd-sm'>Small body</Text>                // sm → base
<Text variant='bd-xs'>Tiny body</Text>                 // xs → sm

// Special variants
<Text variant='caption'>Image caption or footnote</Text>
<Text variant='label'>Form label text</Text>
<Text variant='muted'>De-emphasized text</Text>
<Text variant='muted-sm'>Small muted text</Text>

// Combining with className
<Text variant='hd-xl' className='text-center text-primary'>
  Centered Primary Title
</Text>
```

**Available Variants:**

*Headings (all responsive & bold):*
- `hd-xxl` - Largest headings (3xl → 5xl → 6xl) → renders `<h1>`
- `hd-xl` - Section headings (2xl → 4xl → 5xl) → renders `<h2>`
- `hd-lg` - Card titles (xl → 2xl → 3xl) → renders `<h3>`
- `hd-md` - Subsections (lg → xl → 2xl) → renders `<h4>`
- `hd-sm` - Small headings (base → lg → xl) → renders `<h5>`
- `hd-xs` - Tiny headings (sm → base → lg) → renders `<h6>`

*Body text (all responsive):*
- `bd-xxl` - Extra large (xl → 2xl → 3xl)
- `bd-xl` - Large (lg → xl → 2xl)
- `bd-lg` - Emphasized (base → lg → xl)
- `bd-md` - Regular **(default)** (sm → base → lg)
- `bd-sm` - Small (sm → base)
- `bd-xs` - Tiny (xs → sm)

*Special variants:*
- `caption` - Muted small text (xs → sm)
- `label` - Form labels (sm → base, medium weight)
- `muted` - Muted regular text (sm → base)
- `muted-sm` - Muted small text (xs → sm)

**Props:**
- `variant` - Size/style variant (default: 'bd-md')
- `className` - Additional Tailwind classes
- `children` - Text content

**Auto-Semantic HTML:**
The component automatically selects the correct HTML element:
- `hd-xxl` → `<h1>`
- `hd-xl` → `<h2>`
- `hd-lg` → `<h3>`
- `hd-md` → `<h4>`
- `hd-sm` → `<h5>`
- `hd-xs` → `<h6>`
- `caption`/`muted` → `<span>`
- `label` → `<label>`
- Body variants → `<p>`

**Rules:**
- **Always use `Text` component** instead of raw h1/h2/h3/p/span with manual classes
- All text is automatically responsive (mobile → tablet → desktop)
- Use heading variants (hd-*) for titles and headings
- Use body variants (bd-*) for paragraphs and regular text
- The correct HTML element is automatically chosen based on variant
- Combine with `className` for additional styling (colors, alignment, etc.)
- The component works anywhere, not just page headers

### Empty States

Use the `EmptyState` component for empty/no-data states:

```tsx
import { EmptyState } from '@/components/EmptyState';
import { ImageOff } from 'lucide-react';

<EmptyState
  icon={ImageOff}
  title='No items found'
  description='Get started by uploading your first item.'
  className='border-dashed border-2'
/>
```

For more complex empty states, use the underlying shadcn `Empty` components:

```tsx
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui';
import { ImageOff } from 'lucide-react';

<Empty>
  <EmptyHeader>
    <EmptyMedia variant='icon'>
      <ImageOff />
    </EmptyMedia>
    <EmptyTitle>No items found</EmptyTitle>
    <EmptyDescription>
      Get started by uploading your first item.
    </EmptyDescription>
  </EmptyHeader>
</Empty>
```

**Rules:**
- Prefer `EmptyState` component for simple empty states
- Use `Empty` for all no-data/empty states
- Use `EmptyMedia variant='icon'` with a relevant Lucide icon
- Provide helpful, actionable empty state messages
- Never use plain divs for empty states

### File Uploads

Use the `ImageUploader` component for file uploads with drag-and-drop:

```tsx
import { ImageUploader } from '@/components/ImageUploader';

<ImageUploader
  onUploadComplete={() => {
    toast.success('Upload completed successfully!');
    // Refresh data
  }}
  onUploadError={(error) => {
    toast.error(`Upload failed: ${error.message}`);
  }}
/>
```

**Features:**
- Sequential upload (files uploaded one at a time for better error handling)
- Bulk upload support (up to 10 files)
- Drag and drop support with visual feedback
- Click to choose files
- Individual file preview with real-time status
- Per-file progress bars during upload
- Success/Error indicators for each file
- File size and type validation
- Automatic duplicate filename handling
- Remove individual files or clear all
- Scrollable file list for multiple selections
- Continues uploading even if one file fails

**Rules:**
- Use `ImageUploader` for image uploads instead of UploadThing's default components
- Always provide `onUploadComplete` and `onUploadError` callbacks
- Show toast notifications for upload success/failure
- Refresh data after successful upload
- File size limit is 16MB per file
- Sequential uploads allow better error tracking and per-file progress

## Global Loading State Pattern

This project uses a centralized `GlobalLoadingStates` context instead of local `useState(false)` loading booleans.

**Never suggest:**
```ts
const [loading, setLoading] = useState(false);
```

**Always suggest the global pattern:**
```ts
const { setLoading, isLoading } = useLoading();
```

Loading keys should be namespaced strings e.g. `'user:save'`, `'dashboard:fetch'`, `'products:delete'`.

Always wrap async operations in try/finally to guarantee cleanup:
```ts
setLoading('user:save', true);
try {
  await saveUser();
} finally {
  setLoading('user:save', false);
}
```

The context lives in `@/context/LoadingContext.tsx` and provides:
- `setLoading(key, value)` — register a loading state
- `isLoading(key)` — check a specific key
- `isAnyLoading()` — for global spinners or blocking UI
- `loadingStates` — the full map if needed

This applies to all Supabase calls, Next.js server actions, and any async UI interactions. Shadcn button/skeleton loading states should read from this context, not local state.

### Loading States

**Use Skeleton for data-dependent content** (text, images, cards):

```tsx
import { Skeleton } from '@/components/ui';

// Loading text that depends on fetched data
<CardDescription>
  {loading ? (
    <Skeleton className='h-4 w-32' />
  ) : (
    `${count} items loaded`
  )}
</CardDescription>

// Loading card/content area
<div className='grid grid-cols-2 gap-4'>
  {loading ? (
    Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className='h-48 w-full' />
    ))
  ) : (
    data.map(item => <Card key={item.id}>...</Card>)
  )}
</div>
```

**Use Spinner for action-based loading** (button clicks, form submissions, processes):

```tsx
import { Spinner } from '@/components/ui';

// Inline loading (e.g., in buttons)
<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner /> Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// Centered loading for actions/operations
<div className='text-center py-8'>
  <Spinner className='size-8 mx-auto' />
</div>
```

**Rules:**
- Use **Skeleton** for content/data that's being fetched (text, images, cards)
- Use **Spinner** for active operations (submitting, processing, actions)
- Use **Empty** from shadcn for empty/no-data states
- Never use plain text like "Loading..." without a loading component
- Match Skeleton dimensions to the content it's replacing (`h-4 w-32` for text, `h-48` for cards)
- Use `className='size-8 mx-auto'` for centered large spinners
- Disable interactive elements during loading states
- Always prefer shadcn components over custom implementations

---

## Environment Variables

Required environment variables for the project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL (local: http://127.0.0.1:8000)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase anon/public key (client-safe)
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key (server-side only, never expose to client)

# UploadThing Configuration
UPLOADTHING_TOKEN=                # UploadThing API secret key
UPLOADTHING_APP_ID=                # UploadThing app ID (used for image hostname in next.config)

# Site URL (optional - used for UploadThing callbacks on Vercel)
NEXT_PUBLIC_SITE_URL=              # Your deployment URL (auto-detected via VERCEL_URL)
```

**Important:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- `UPLOADTHING_APP_ID` is used dynamically in `next.config.ts` for image optimization
- All `NEXT_PUBLIC_*` variables are exposed to the client
- Use `.env.local` for local development (not committed to git)
- On Vercel, `VERCEL_URL` is automatically set for UploadThing callbacks

---

## Copilot Code Generation Requirements

When generating server code:
- Always wrap external calls in try/catch.
- Always separate logging from response.
- Never return `error.message` from external services.
- Never expose raw error objects in JSON responses.
- Default to generic error unless explicitly safe.

Security over convenience.