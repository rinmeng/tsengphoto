import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';

/**
 * POST /api/v1/collections/[slug]/images
 * Links an uploaded image to a collection
 */
export async function POST(
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
    const body = await request.json();
    const { uploadId, imageUrl } = body;

    if (!slug || (!uploadId && !imageUrl)) {
      return NextResponse.json(
        { error: 'Collection slug and either Upload ID or Image URL are required' },
        { status: 400 }
      );
    }

    // Get collection by slug to retrieve ID
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', slug)
      .single();

    if (collectionError || !collection) {
      Logger.error('Error fetching collection by slug:', collectionError);
      return NextResponse.json({ error: 'Collection not found.' }, { status: 404 });
    }

    const collectionId = collection.id;

    // Get the max order for this collection
    const { data: maxOrderData } = await supabase
      .from('collection_image')
      .select('order')
      .eq('collection_id', collectionId)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData?.order != null ? maxOrderData.order + 1 : 0;

    // Insert into collection_image
    const { data, error } = await supabase
      .from('collection_image')
      .insert({
        collection_id: collectionId,
        image_url: imageUrl,
        order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      Logger.error('Error linking image to collection:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    // Optionally update the upload record to link it to the collection
    if (uploadId) {
      await supabase
        .from('uploads')
        .update({
          entity_type: 'collection',
          entity_id: collectionId,
        })
        .eq('id', uploadId);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    Logger.error('Error in POST /api/v1/collections/[slug]/images:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
