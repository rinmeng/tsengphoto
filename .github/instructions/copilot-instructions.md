---
description: Project-wide coding instructions for Copilot
applyTo: '**/*'
---

# Copilot Project Instructions

---

## Project Overview

### Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL)
- **File Uploads:** UploadThing
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

The data flow always follows this order:

```
FE (component) → Service Layer (business logic) → API Route (Supabase)
```

The service layer runs first. If business logic passes, it forwards the call to the API route. The API route does nothing except authenticate, call Supabase, and return a safe response. This keeps components thin, business logic testable, and API routes simple.

### 1. UI Layer (Components)

- React components in `/components/` and `/app/`
- No business logic, no direct Supabase calls, no validation logic
- Calls service layer functions only — never calls API routes directly
- Handles loading/error states via TanStack Query and toast notifications

```tsx
// ✅ Component calls service, not API directly
const createMutation = useMutation({
  mutationFn: (values: CollectionFormValues) => createCollection(values),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    toast.success('Collection created');
  },
  onError: (error: Error) => {
    form.setError('root', { message: error.message });
    toast.error(error.message);
  },
});
```

### 2. Service Layer (`/services/*.service.ts`)

- All business logic lives here — validation, transformations, conflict checks, calculations
- Runs on the client before any API call is made
- If business logic passes, forwards to the API route via fetch
- Throws user-friendly errors on failure so `onError` in the component fires correctly
- Never returns raw API or Supabase errors to callers
- Exports schemas and types — components import them from here, never redefine them

```typescript
// services/collections.service.ts
export const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
});

export type CollectionFormValues = z.infer<typeof collectionSchema>;

export async function createCollection(values: CollectionFormValues): Promise<void> {
  // 1. Business logic — validate, transform, check rules before hitting the API
  const slug = values.slug.toLowerCase().trim();

  // 2. Forward to API route if logic passes
  const res = await fetch('/api/v1/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, slug }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Something went wrong. Please try again.');
  }
}
```

### 3. API Route Layer (`/app/api/v1/`)

- Authentication + input validation only
- Direct Supabase calls — no business logic here
- Returns safe, sanitized responses
- Uses Logger for server-side error logging
- Never returns raw Supabase errors

```typescript
// app/api/v1/collections/route.ts
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();

    const { error } = await supabase.from('collections').insert(body);
    if (error) {
      Logger.error('Failed to insert collection', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    Logger.error('Unexpected error in POST /collections', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
```

### Where Things Live

| Concern | Layer |
|---|---|
| Validation, transforms, business rules | Service |
| Schema and type definitions | Service (exported to FE) |
| Supabase calls | API Route |
| Auth checks | API Route |
| Error logging | API Route (Logger) |
| Toast / loading / form errors | Component |

### Expected vs Unexpected Errors

**Expected outcomes — handle as business logic in the service layer:**
- Slug or email already exists
- User not authorized to access a resource
- Business rule violations

**Unexpected errors — log in API route, return generic message:**
- Database connection failures
- Network timeouts
- Unhandled exceptions

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

### Loading States — Prefer TanStack Query, Fall Back to Global Context

Prefer TanStack Query's built-in loading states (`isPending`, `isLoading`, `isSuccess`) whenever the async operation is a query or mutation. Only reach for `useLoading()` when the operation falls outside TanStack Query.

```tsx
// ✅ Prefer — TanStack Query mutation loading
const deleteMutation = useMutation({ ... });

<Button disabled={deleteMutation.isPending}>
  {deleteMutation.isPending ? <><Spinner /> Deleting...</> : 'Delete'}
</Button>

// ✅ Prefer — TanStack Query query loading
const { data, isLoading } = useQuery({ ... });
{isLoading ? <Skeleton className='h-4 w-32' /> : <span>{data.count} items</span>}

// ✅ Fallback — use LoadingContext only when no TanStack Query is involved
const { setLoading, isLoading } = useLoading();
setLoading('user:save', true);
try {
  await someImperativeAction();
} finally {
  setLoading('user:save', false);
}

// ❌ Never use local useState for loading under any circumstance
const [loading, setLoading] = useState(false);
```

Context from `@/context/LoadingContext.tsx` provides: `setLoading(key, value)`, `isLoading(key)`, `isAnyLoading()`, `loadingStates`.

**Skeleton** for data-dependent content (text, cards, images).
**Spinner** for action-based operations (buttons, form submissions).

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
  onUploadComplete={() => toast.success('Done!')}
  onUploadError={(error) => toast.error(`Failed: ${error.message}`)}
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

### TanStack Query (React Query)

#### Queries vs Mutations

- **Queries** (`useQuery`) → reading/fetching data
- **Mutations** (`useMutation`) → any server-side action (create, update, delete, auth)

#### Query Keys

Always define query keys as constants — never inline:

```typescript
export const queryKeys = {
  uploads: ['uploads'] as const,
  upload: (id: string) => ['uploads', id] as const,
  collections: ['collections'] as const,
};

// ✅ Usage
const { data, isLoading } = useQuery({
  queryKey: queryKeys.collections,
  queryFn: () => fetchCollections(),
});

// ❌ Inline keys — impossible to invalidate reliably
useQuery({ queryKey: ['collections'], queryFn: ... });
```

#### Mutations

Always handle three things in every mutation:

1. `mutationFn` — calls the service function
2. `onSuccess` — toast, cache invalidation, redirect
3. `onError` — toast, form root error

```typescript
const createMutation = useMutation({
  mutationFn: (values: CollectionFormValues) => createCollection(values),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.collections });
    toast.success('Collection created');
  },
  onError: (error: Error) => {
    form.setError('root', { message: error.message });
    toast.error(error.message);
  },
});
```

#### Always Throw in Service Functions

`onError` only fires when the service function throws. Never return errors — always throw:

```typescript
// ❌ onError will never fire
if (!res.ok) return { error: 'Something went wrong.' };

// ✅ Throw so onError fires
if (!res.ok) throw new Error('Something went wrong.');
```

#### Loading & Success States

For auth/navigation mutations, include `isSuccess` to prevent the button flashing back to idle before navigation completes:

```tsx
<Button disabled={mutation.isPending || mutation.isSuccess}>
  {mutation.isPending || mutation.isSuccess ? (
    <><Spinner /> Signing In...</>
  ) : (
    <>Sign In <LogIn /></>
  )}
</Button>
```

Never use the deprecated `isLoading` on mutations — use `isPending`.

#### Cache Invalidation

Always invalidate related queries after mutations that change data:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.collections });
}
```

#### Integration with React Hook Form

Wire `onError` to both a toast and `setError('root')`:

```typescript
onError: (error: Error) => {
  form.setError('root', { message: error.message });
  toast.error('Action failed', { description: error.message });
},
```

```tsx
{form.formState.errors.root && (
  <div className='text-sm text-destructive'>
    {form.formState.errors.root.message}
  </div>
)}
```

#### General Rules

- Never use `useMutation` or `useQuery` inside service files — components only
- Never use local `useState` for loading when TanStack Query is available
- Never call `useQueryClient()` inside service files — components only
- No `try/catch` in components — use `onError` instead

---

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

---

### Logging — Use `Logger` from `@/lib/logger`

Never use `console.log`, `console.error`, `console.warn`, or `console.debug` directly. Always use the `Logger` utility — API routes only, never in components or service files.

```typescript
import { Logger } from '@/lib/logger';

Logger.info('Fetching uploads');
Logger.warn('No data returned');
Logger.error('Database failed', error);
Logger.debug('Payload', payload);
```

- `Logger` is server-side only — never import it in components or service files
- Caller name is auto-detected — never pass a prefix manually
- Always pass the error object as a second arg to `Logger.error`
- Remove any existing `console.*` calls when touching a file

---

### Middleware (`proxy.ts`)

UploadThing callback routes must be excluded from middleware in both the matcher and an early return:

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

- Import types and schemas from the relevant service file
- Use `@/lib/types` only for shared domain types not tied to a specific service
- Never define schemas or types in components — import from the service
- Never call Supabase directly in components or service files
- Separate logging from response logic
- Prefer explicit types and return contracts

---

## CMS / Admin UI Patterns

### Action Placement

Global actions (e.g. "Add New") belong at the top of the page. Item-specific actions (edit, delete) belong on each card — never at the top.

```tsx
// ✅ Correct
<div>
  <Button onClick={openAddDialog}><Plus /> Add Collection</Button>

  {collections.map(collection => (
    <Card key={collection.id}>
      <CardContent>...</CardContent>
      <CardFooter>
        <Button variant='ghost' size='icon' onClick={() => openEditDialog(collection)}>
          <Pencil />
        </Button>
        <Button variant='ghost' size='icon' onClick={() => openDeleteDialog(collection.id)}>
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>
```

### Add / Edit Forms — Single Shared Component

When add and edit forms are identical or near-identical, use one shared component with a `mode` prop. Never duplicate the form.

```typescript
interface CollectionFormProps {
  mode: 'add' | 'edit';
  collection?: Collection; // required when mode is 'edit'
  onSuccess?: () => void;
}

export function CollectionForm({ mode, collection, onSuccess }: CollectionFormProps) {
  const form = useForm({
    defaultValues: collection || {},
  });

  return (
    <>
      <DialogTitle>{mode === 'add' ? 'Add Collection' : 'Edit Collection'}</DialogTitle>
      {/* form fields */}
      <Button type='submit'>{mode === 'add' ? 'Create' : 'Save Changes'}</Button>
    </>
  );
}
```

### Add / Edit — Use Dialog or Sheet

Spawn add/edit forms in a Dialog (simple forms) or Sheet (longer forms) — never navigate to a separate page unless the form is very complex.

```tsx
// Simple form → Dialog
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <CollectionForm mode='add' onSuccess={() => setIsOpen(false)} />
  </DialogContent>
</Dialog>

// Longer form → Sheet
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <CollectionForm mode='edit' collection={selected} onSuccess={() => setIsOpen(false)} />
  </SheetContent>
</Sheet>
```

### Delete — Always Confirm

Never delete on a single click. Always use a confirmation AlertDialog:

```tsx
<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => deleteMutation.mutate(collectionId)}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Completion Checklist

After completing any code changes, always verify the following:

1. **Check for TypeScript errors** — Use `get_errors` tool or run `pnpm tsc --noEmit`
2. **Check for runtime errors** — Start the dev server and verify the changed functionality works
3. **Test the user flow** — Navigate to the affected pages and interact with them
4. **Review imports** — Ensure all imports are valid and paths are correct
5. **Check console** — Verify no unexpected warnings or errors appear in browser or terminal

Don't mark changes as complete until these checks pass.