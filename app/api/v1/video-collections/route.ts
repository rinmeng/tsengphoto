import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/video-collections
 * Fetches all video collections (published only for non-authenticated, all for authenticated)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from('video_collections')
      .select(
        `
        *,
        videos:video(*)
      `
      )
      .order('created_at', { ascending: false });

    if (!user) {
      query = query.eq('is_published', true);
    }

    const { data: videoCollections, error } = await query;

    if (error) {
      Logger.error('Error fetching video collections:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ data: videoCollections || [] }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/video-collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * POST /api/v1/video-collections
 * Creates a new video collection (authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();

    const { data: videoCollection, error } = await supabase
      .from('video_collections')
      .insert(body)
      .select()
      .single();

    if (error) {
      Logger.error('Error creating video collection:', error);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A video collection with this slug already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ data: videoCollection }, { status: 201 });
  } catch (error) {
    Logger.error('Error in POST /api/v1/video-collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/video-collections
 * Updates an existing video collection (authenticated users only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Video collection ID is required' },
        { status: 400 }
      );
    }

    // Fetch current video collection to check if cover image changed
    const { data: currentCollection } = await supabase
      .from('video_collections')
      .select('cover_image_url, cover_image_id')
      .eq('id', id)
      .single();

    const { data: videoCollection, error } = await supabase
      .from('video_collections')
      .update({
        ...updates,
        modified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      Logger.error('Error updating video collection:', error);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A video collection with this slug already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    // Delete old cover image if it was changed or removed
    const oldCoverImageId = currentCollection?.cover_image_id;
    const newCoverImageId = updates.cover_image_id;

    if (
      oldCoverImageId &&
      oldCoverImageId !== newCoverImageId &&
      currentCollection?.cover_image_url
    ) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/v1/uploads`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: oldCoverImageId,
            fileUrl: currentCollection.cover_image_url,
          }),
        });

        if (!response.ok) {
          Logger.error('Failed to delete old cover image');
        }
      } catch (err) {
        Logger.error('Error deleting old cover image:', err);
      }
    }

    return NextResponse.json({ data: videoCollection }, { status: 200 });
  } catch (error) {
    Logger.error('Error in PATCH /api/v1/video-collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
