import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';
import { processYouTubeUrl } from '@/services/videos.service';

/**
 * POST /api/v1/video
 * Adds a new video to a collection (authenticated users only)
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
    const { video_collection_id, youtube_url, title, description } = body;

    if (!video_collection_id || !youtube_url) {
      return NextResponse.json(
        { error: 'Video collection ID and YouTube URL are required' },
        { status: 400 }
      );
    }

    // Validate and process YouTube URL
    const result = processYouTubeUrl(youtube_url);

    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { videoId, thumbnailUrl } = result.data;

    // Get the current max order for this collection
    const { data: maxOrderVideo } = await supabase
      .from('video')
      .select('order')
      .eq('video_collection_id', video_collection_id)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrderVideo?.order || 0) + 1;

    // Insert the video
    const { data: video, error } = await supabase
      .from('video')
      .insert({
        video_collection_id,
        youtube_video_id: videoId,
        youtube_url,
        thumbnail_url: thumbnailUrl,
        title: title || null,
        description: description || null,
        order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      Logger.error('Error adding video:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ data: video }, { status: 201 });
  } catch (error) {
    Logger.error('Error in POST /api/v1/video:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
