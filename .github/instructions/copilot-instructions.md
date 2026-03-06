---
description: Project-wide coding instructions for Copilot
applyTo: '**/*'
---

# Copilot Project Instructions

---

## Project Overview

### Stack

- **Framework:** Next.js 15 (App Router)
- **Backend:** Supabase (PostgreSQL)
- **File Uploads:** UploadThing
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI + Animate-UI
- **Authentication:** Supabase Auth

### Project Structure

```
app/                    # Next.js App Router pages and API routes
  ├── api/v1/          # API endpoints (versioned)
  ├── admin/           # Protected admin pages
  └── ...              # Public pages

components/
  ├── ui/             # Shadcn UI components
  ├── animate-ui/     # Animated Shadcn variants (prefer these)
  └── ...             # Feature components

services/              # Business logic layer (*.service.ts)
lib/types/             # TypeScript type definitions
utils/supabase/        # Supabase client configs (client, server, admin, proxy)
proxy.ts               # Next.js middleware (route protection)
supabase/migrations/   # Database migrations
```

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only, never expose to client
UPLOADTHING_TOKEN=
UPLOADTHING_APP_ID=                 # Used in next.config.ts for image optimization
NEXT_PUBLIC_SITE_URL=               # Optional, used for UploadThing callbacks on Vercel
```

---

## Architecture

This project follows a strict 3-layer architecture:

### 1. UI Layer (Components)

- React components in `/components/` and `/app/`
- No business logic, no direct Supabase calls
- Use service layer for all data operations
- Handle loading/error states via toast notifications

### 2. Service Layer (`/services/*.service.ts`)

- All business logic and data operations live here
- Returns structured responses: `{ success: boolean, data?: T, error?: string }`
- Logs errors with prefix: `[ServiceName] Error: ...`
- Never returns raw Supabase errors to callers

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

### 3. API / Route Layer (`/app/api/`)

- Authentication + input validation
- Calls service layer
- Returns safe, sanitized responses

---

## Preferences

### Navigation — Prefer `<Link>` Over `<a>`

Always use Next.js `<Link>` for internal navigation. Only use `<a>` for external URLs.

```tsx
// ✅ Internal navigation
import Link from 'next/link';
<Link href='/admin'>Dashboard</Link>

// ✅ External links only
<a href='https://example.com' target='_blank' rel='noopener noreferrer'>External</a>

// ❌ Never use <a> for internal routes
<a href='/admin'>Dashboard</a>
```

### Components — Prefer Animate-UI → Shadcn → Custom

1. **Animate-UI** (`/components/animate-ui/`) — animated Shadcn variants, always prefer
2. **Shadcn UI** (`/components/ui/`) — fallback for components not in animate-ui
3. **Custom** — only when neither option exists

```tsx
// ✅ Prefer animate-ui
import { Button, Dialog, Checkbox } from '@/components/animate-ui/components';

// ✅ Shadcn fallback
import { Card, Input, Skeleton } from '@/components/ui';

// ❌ Never build custom when a component already exists
```

### Typography — Always Use `<Text>`

Use the `Text` component for all text. Never use raw `h1`/`p`/`span` with manual classes.

```tsx
import { Text } from '@/components/Text';

<Text variant='hd-xxl'>Page Title</Text>      // → <h1>
<Text variant='hd-xl'>Section</Text>          // → <h2>
<Text variant='hd-lg'>Card Title</Text>       // → <h3>
<Text variant='bd-md'>Body text</Text>        // → <p> (default)
<Text variant='muted'>De-emphasized</Text>    // → <span>
<Text variant='label'>Form label</Text>       // → <label>
<Text variant='caption'>Footnote</Text>       // → <span>
```

Heading variants: `hd-xxl` → `hd-xs` (responsive, bold, semantic HTML auto-applied)
Body variants: `bd-xxl` → `bd-xs` (responsive)
Special: `caption`, `label`, `muted`, `muted-sm`

### Loading States — Use Global Context

Never use local `useState(false)` for loading. Always use the global `LoadingContext`.

```tsx
// ❌ Never
const [loading, setLoading] = useState(false);

// ✅ Always
const { setLoading, isLoading } = useLoading();

// Use namespaced keys and always clean up in finally
setLoading('user:save', true);
try {
  await saveUser();
} finally {
  setLoading('user:save', false);
}
```

Context from `@/context/LoadingContext.tsx` provides: `setLoading(key, value)`, `isLoading(key)`, `isAnyLoading()`, `loadingStates`.

**Skeleton** for data-dependent content (text, cards, images):

```tsx
{
  isLoading('data:fetch') ? (
    <Skeleton className='h-4 w-32' />
  ) : (
    <span>{count} items</span>
  );
}
```

**Spinner** for action-based operations (buttons, form submissions):

```tsx
<Button disabled={isLoading('form:submit')}>
  {isLoading('form:submit') ? (
    <>
      <Spinner /> Saving...
    </>
  ) : (
    'Save'
  )}
</Button>
```

### Empty States — Use `EmptyState`

```tsx
import { EmptyState } from '@/components/EmptyState';
import { ImageOff } from 'lucide-react';

<EmptyState
  icon={ImageOff}
  title='No items found'
  description='Get started by uploading your first item.'
  className='border-dashed border-2'
/>;
```

### File Uploads — Use `ImageUploader`

```tsx
import { ImageUploader } from '@/components/ImageUploader';

<ImageUploader
  onUploadComplete={() => {
    toast.success('Done!');
  }}
  onUploadError={(error) => {
    toast.error(`Failed: ${error.message}`);
  }}
/>;
```

### Buttons with Icons

Icons go directly inside `<Button>` — no extra wrappers or spacing classes needed.

```tsx
<Button variant='destructive'><Trash2 /> Delete</Button>
<Button><Plus /> Add New</Button>
<Button variant='ghost' size='icon'><Trash2 /></Button>
```

---

## Best Practices

### Security & Error Handling

**Never expose to clients:**

- Supabase error messages or stack traces
- SQL details or internal IDs
- Auth state details (`"User does not exist"`, `"Incorrect password"`)
- UploadThing internal errors

**Default user-facing error:**

> "Something went wrong. Please try again."

**Safe errors allowed to show:**

- "Invalid email format."
- "Password must be at least 8 characters."
- "File type not supported."
- "File size exceeds limit."

**Auth errors always use:**

- `"Invalid credentials."` or `"Unauthorized."`

**Supabase calls:**

```typescript
const { data, error } = await supabase.from('table').select('*');
if (error) {
  console.error('[Service] Error:', error); // Log server-side only
  throw new Error('Something went wrong.'); // Generic to client
}
```

### Logging

```typescript
// ❌ Remove verbose success logs
console.log('[API] Request received');

// ✅ Keep error logs with context
console.error('[UploadService] Database error:', error);

// ❌ Obvious comments
// Create a new user
const user = await createUser();

// ✅ Explain non-obvious behavior
// Skip auth check for callbacks — they don't have user session cookies
```

### Middleware (`proxy.ts`)

UploadThing callback routes must be excluded from middleware in **both** the matcher and an early return:

```typescript
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/v1/uploadthing')) {
    return NextResponse.next();
  }
  // normal auth logic...
}

export const config = {
  matcher: [
    '/((?!_next|api/v1/uploadthing|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
```

### UploadThing

- Exclude `/api/v1/uploadthing` from middleware (see above)
- Let UploadThing auto-detect callback URLs — don't set `callbackUrl` manually
- Callbacks don't have session cookies — skip auth checks for them (detect by absence of `actionType` query param)
- On Vercel: add `/api/v1/uploadthing` to "Protection Bypass for Automation" in project settings, or file metadata will never be saved (silent 401 failure)

### Authentication

```typescript
import { getCurrentUser, signInWithEmail, signOut, useAuth } from '@/hooks/use-auth';

const { user, error } = await getCurrentUser();
const { user } = useAuth(); // in components
```

Protected pages: check auth in `useEffect`, redirect to `/login` if no user.
Login pages: redirect authenticated users away to `/admin`.

### General Code Rules

- Import types from `@/lib/types`
- Never call Supabase directly in React components
- Wrap all external calls in `try/catch`
- Separate logging from response logic
- Prefer explicit types and return contracts
- Service functions must return structured `{ success, data?, error? }` responses

### Logging — Use `Logger` from `@/lib/logger`

Never use `console.log`, `console.error`, `console.warn`, or `console.debug` directly. Always use the `Logger` utility — server-side only.

```typescript
import { Logger } from '@/lib/logger';

Logger.info('Fetching uploads');
Logger.warn('No data returned');
Logger.error('Database failed', error);
Logger.debug('Payload', payload);
```

- `Logger` is server-side only — never import it in components or client code
- Caller name is auto-detected — never pass a prefix like `[ServiceName]` manually
- Use `Logger.error` for caught exceptions, always pass the error object as a second arg
- Remove any existing `console.*` calls when touching a file
