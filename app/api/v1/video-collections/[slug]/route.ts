import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';

/**
 * GET /api/v1/video-collections/[slug]
 * Fetches a single video collection by slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    let query = supabase
      .from('video_collections')
      .select(
        `
        *,
        videos:video(*)
      `
      )
      .eq('slug', slug);

    if (!user) {
      query = query.eq('is_published', true);
    }

    const { data: videoCollection, error } = await query.single();

    if (error) {
      Logger.error('Error fetching video collection by slug:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Video collection not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ data: videoCollection }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/video-collections/[slug]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/video-collections/[slug]
 * Deletes a video collection by slug (authenticated users only)
 * Also deletes associated cover image from UploadThing
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Fetch the video collection to get cover image URL before deletion
    const { data: videoCollection } = await supabase
      .from('video_collections')
      .select('id, cover_image, cover_image_id')
      .eq('slug', slug)
      .single();

    if (!videoCollection) {
      return NextResponse.json({ error: 'Video collection not found' }, { status: 404 });
    }

    // Delete the video collection (cascade will delete associated videos)
    const { error } = await supabase.from('video_collections').delete().eq('slug', slug);

    if (error) {
      Logger.error('Error deleting video collection:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    // Delete cover image from UploadThing if it exists
    if (videoCollection.cover_image && videoCollection.cover_image_id) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/v1/uploads`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: videoCollection.cover_image_id,
            fileUrl: videoCollection.cover_image,
          }),
        });

        if (!response.ok) {
          Logger.error('Failed to delete cover image from UploadThing');
        }
      } catch (err) {
        Logger.error('Error deleting cover image:', err);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/video-collections/[slug]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
