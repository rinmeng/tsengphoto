import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';

/**
 * DELETE /api/v1/collections/[slug]/images/[imageId]
 * Removes an image from a collection
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; imageId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { slug, imageId } = await params;

    if (!slug || !imageId) {
      return NextResponse.json(
        { error: 'Collection slug and Image ID are required' },
        { status: 400 }
      );
    }

    // Get collection by slug to verify it exists and get ID
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', slug)
      .single();

    if (collectionError || !collection) {
      Logger.error('Error fetching collection by slug:', collectionError);
      return NextResponse.json({ error: 'Collection not found.' }, { status: 404 });
    }

    // Delete the collection_image entry
    const { error } = await supabase
      .from('collection_image')
      .delete()
      .eq('id', imageId)
      .eq('collection_id', collection.id);

    if (error) {
      Logger.error('Error deleting collection image:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collections/[slug]/images/[imageId]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
