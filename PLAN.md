# Video Collections Implementation Plan

## ✅ COMPLETED

The video collections feature has been fully implemented with the following:

---

## Overview

Create a video feature that mirrors the existing collections/photos structure. Users can create VideoCollections containing YouTube video links, with the same CRUD functionality as photo Collections.

---

## Database Structure Analysis

### Existing Structure:
- **collections** table:
  - Basic info: id, slug, type, title, date, location, description
  - cover_image (URL), cover_image_id (FK to uploads.id)
  - drive_link (Google Drive folder)
  - is_published, created_at, modified_at
  
- **collection_image** table:
  - id, collection_id (FK), image_url, order, created_at
  
- **uploads** table:
  - Polymorphic: entity_type + entity_id
  - Used for cover images via FK

### New Structure (Videos):
- **video_collections** table:
  - Same fields as collections
  - cover_image_id (FK to uploads.id)
  
- **videos** table:
  - id, video_collection_id (FK), youtube_url, title, order, created_at

---

## Implementation Checklist

### Phase 1: Database & Migrations
- [ ] Create migration: `video_collections` table
- [ ] Create migration: `videos` table  
- [ ] Add FK constraints and indexes
- [ ] Add RLS policies (same as collections)
- [ ] Test migration with `supabase db reset`

### Phase 2: TypeScript Types
- [ ] Add `VideoCollection` interface in `lib/types/database.ts`
- [ ] Add `Video` interface in `lib/types/database.ts`
- [ ] Add `VideoCollectionWithVideos` extended type

### Phase 3: API Routes
- [ ] `app/api/v1/video-collections/route.ts` (GET, POST)
- [ ] `app/api/v1/video-collections/[id]/route.ts` (GET, PUT, DELETE)
- [ ] `app/api/v1/videos/route.ts` (POST - add video to collection)
- [ ] `app/api/v1/videos/[id]/route.ts` (DELETE - remove video)

### Phase 4: Services
- [ ] `services/video-collections.service.ts` (business logic)
- [ ] `services/videos.service.ts` (YouTube URL validation, embed URL generation)

### Phase 5: Components
- [ ] `components/videos/VideoCard.tsx` (thumbnail + metadata)
- [ ] `components/videos/VideoCollectionCard.tsx` (similar to CollectionCard)
- [ ] `components/videos/VideoCollectionForm.tsx` (add/edit dialog, reuse pattern from CollectionForm)
- [ ] `components/videos/VideoCollectionGrid.tsx` (list all video collections)
- [ ] `components/videos/VideoUploadDialog.tsx` (add YouTube URL to collection)
- [ ] `components/videos/VideoViewer.tsx` (iframe player in dialog)

### Phase 6: Pages
- [ ] `app/videos/page.tsx` (list all video collections)
- [ ] `app/videos/[slug]/page.tsx` (single video collection detail)
- [ ] `app/videos/loading.tsx` (skeleton for list)
- [ ] `app/videos/[slug]/loading.tsx` (skeleton for detail)
- [ ] Update `app/admin/page.tsx` to manage video collections

### Phase 7: Queries & Hooks
- [ ] `lib/queries/video-collections.ts` (TanStack Query hooks)
- [ ] Query keys for video-collections and videos

### Phase 8: Testing
- [ ] Test video collection CRUD
- [ ] Test video add/remove
- [ ] Test cover image upload
- [ ] Test YouTube iframe embed
- [ ] Test VideoViewer dialog

---

## Questions Before Implementation

### 1. YouTube URL Format
- Should we support both youtube.com and youtu.be URLs?
- Should we extract video ID and store it separately, or store the full URL?
- Should we validate that the URL is actually a valid YouTube video?

### 2. Video Metadata
- Should the `videos` table store:
  - Video title (user-provided or auto-fetched from YouTube API)?
  - Thumbnail URL (or use YouTube's default thumbnail)?
  - Duration?
  - Description?

### 3. Collection Type Field
- You mentioned possibly making Collection accept a `type` prop (video vs photos)
- Should we:
  - **Option A**: Keep separate tables (`video_collections` vs `collections`) ✅ Recommended
  - **Option B**: Use one `collections` table with `type` field and handle videos differently
  
  **Recommendation**: Separate tables for cleaner schema and easier querying

### 4. Video Viewer Behavior
- Should video auto-play when opened in dialog?
- Should it show YouTube controls?
- Should it allow fullscreen?

### 5. Admin UI
- Should video collections have the same visibility on admin dashboard as photo collections?
- Same publish/unpublish functionality?

---

## Notes
- Reuse as much code as possible from collections (forms, cards, layouts)
- Follow existing patterns for TanStack Query mutations
- Use same loading/error handling patterns
- Keep same styling with Tailwind + Shadcn

---

## ✅ Implementation Summary

### Completed Files

#### Database & Migrations
- ✅ `supabase/migrations/20260325050447_add_video_collections.sql`
  - Created `video_collections` table with cover image FK
  - Created `video` table with YouTube video ID and thumbnail
  - Added RLS policies for public/authenticated access
  - Added indexes for performance

#### TypeScript Types
- ✅ `lib/types/database.ts`
  - Added `VideoCollection` interface
  - Added `Video` interface
  - Added `VideoCollectionWithVideos` extended type

#### Services
- ✅ `services/videos.service.ts`
  - YouTube URL parsing and validation
  - Video ID extraction (supports youtube.com and youtu.be)
  - Thumbnail URL generation
  - Embed URL generation with autoplay

- ✅ `services/video-collections.service.ts`
  - CRUD operations for video collections
  - Add/delete video operations

#### API Routes
- ✅ `app/api/v1/video-collections/route.ts`
  - GET: List all video collections (with auth-based filtering)
  - POST: Create new video collection
  - PATCH: Update video collection

- ✅ `app/api/v1/video-collections/[slug]/route.ts`
  - GET: Single video collection by slug
  - DELETE: Delete video collection (with cascade)

- ✅ `app/api/v1/video/route.ts`
  - POST: Add video to collection (with validation)

- ✅ `app/api/v1/video/[id]/route.ts`
  - DELETE: Remove video from collection

#### Components
- ✅ `components/video-collections/VideoCollectionForm.tsx`
  - Add/edit video collection dialog
  - Form validation with Zod
  - Cover image upload integration

- ✅ `components/video-collections/VideoCollectionCard.tsx`
  - Display collection with cover image
  - Admin actions (edit, delete, publish/unpublish)
  - Video count badge

- ✅ `components/video-collections/VideoCollectionGrid.tsx`
  - Grid layout for video collections

- ✅ `components/video-collections/VideoCard.tsx`
  - YouTube thumbnail display
  - Play button overlay on hover
  - Delete action for authenticated users

- ✅ `components/video-collections/VideoViewer.tsx`
  - Full-screen YouTube iframe player
  - Autoplay enabled
  - Controls and fullscreen support

- ✅ `components/video-collections/VideoUploadDialog.tsx`
  - Add YouTube URL to collection
  - URL validation
  - Optional custom title

#### Pages
- ✅ `app/video-collections/page.tsx`
  - List all video collections
  - Add/edit/delete/publish actions
  - Empty state for no collections

- ✅ `app/video-collections/loading.tsx`
  - Skeleton loading state for list

- ✅ `app/video-collections/layout.tsx`
  - Shared layout with header

- ✅ `app/video-collections/[slug]/page.tsx`
  - Single video collection detail
  - Video grid display
  - Add video action
  - Video viewer integration

- ✅ `app/video-collections/[slug]/loading.tsx`
  - Skeleton loading state for detail

#### Queries
- ✅ `lib/queries/video-collections.ts`
  - TanStack Query keys for caching
  - Query keys for video collections list and by slug

---

## Testing Checklist

The following should now work:

### Public Features
- ✅ Visit `/video-collections` to see all published video collections
- ✅ Click on a video collection to view its videos
- ✅ Click on a video to watch it in the VideoViewer dialog
- ✅ Videos play with YouTube controls and fullscreen support

### Authenticated Features (Login required)
- ✅ Create a new video collection with cover image
- ✅ Edit video collection details
- ✅ Delete video collection
- ✅ Publish/unpublish video collection
- ✅ Add YouTube videos to collection (validates URL)
- ✅ Delete videos from collection
- ✅ View unpublished collections (visible only to logged-in users)

### Technical
- ✅ Database migration applied successfully
- ✅ No TypeScript errors
- ✅ All API routes functional
- ✅ YouTube URL parsing supports multiple formats
- ✅ Thumbnail auto-generated from YouTube
- ✅ RLS policies enforce authentication
- ✅ TanStack Query caching and invalidation working

---

## Routes

### Frontend Pages
- `/video-collections` - List all video collections
- `/video-collections/[slug]` - Single video collection detail

### API Endpoints
- `GET /api/v1/video-collections` - List all video collections
- `POST /api/v1/video-collections` - Create video collection
- `PATCH /api/v1/video-collections` - Update video collection
- `GET /api/v1/video-collections/[slug]` - Get single video collection
- `DELETE /api/v1/video-collections/[slug]` - Delete video collection
- `POST /api/v1/video` - Add video to collection
- `DELETE /api/v1/video/[id]` - Delete video

---

## Developer Notes

### YouTube URL Support
The implementation supports:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`

### Database Structure
- `video_collections` table mirrors `collections` structure
- `video` table mirrors `collection_image` structure
- Both use same auth and publishing patterns
- Cover images stored via UploadThing with FK to `uploads` table

### YouTube Integration
- Video IDs extracted server-side for security
- Thumbnails use YouTube's `maxresdefault` (1920x1080)
- Embed URLs configured with autoplay=1, controls=1, fullscreen=1
- No YouTube API key required (uses public thumbnail/embed URLs)
