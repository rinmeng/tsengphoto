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
  └── admin.ts        # Admin client (service role, bypasses RLS)

supabase/             # Supabase local development
  ├── migrations/     # Database migrations
  └── seed.sql        # Seed data
```

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

When upload fails:
- Log full UploadThing error server-side.
- Return a generic failure message.
- Only expose validation-related failures (size/type) if safe.

---

## Environment Variables

Required environment variables for the project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL (local: http://127.0.0.1:8000)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=  # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key (server-side only, never expose to client)

# UploadThing Configuration
UPLOADTHING_TOKEN=                 # UploadThing API token
UPLOADTHING_APP_ID=                # UploadThing app ID (used for image hostname in next.config)
```

**Important:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- `UPLOADTHING_APP_ID` is used dynamically in `next.config.ts` for image optimization
- All `NEXT_PUBLIC_*` variables are exposed to the client
- Use `.env.local` for local development (not committed to git)

---

## Copilot Code Generation Requirements

When generating server code:
- Always wrap external calls in try/catch.
- Always separate logging from response.
- Never return `error.message` from external services.
- Never expose raw error objects in JSON responses.
- Default to generic error unless explicitly safe.

Security over convenience.