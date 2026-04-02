import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/collections
 * Fetches all collections (published only for non-authenticated, all for authenticated)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from('collections')
      .select(
        `
        *,
        collection_group_name:collection_groups(name),
        images:collection_image(*)
      `
      )
      .order('created_at', { ascending: false });

    if (!user) {
      query = query.eq('is_published', true);
    }

    const { data: collections, error } = await query;

    if (error) {
      Logger.error('Error fetching collections:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    // Transform collection_group_name from nested object to string
    const transformedCollections = collections?.map((collection) => ({
      ...collection,
      collection_group_name:
        (collection.collection_group_name as { name: string } | null)?.name || null,
    }));

    return NextResponse.json({ data: transformedCollections || [] }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * POST /api/v1/collections
 * Creates a new collection (authenticated users only)
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

    const { data: collection, error } = await supabase
      .from('collections')
      .insert(body)
      .select()
      .single();

    if (error) {
      Logger.error('Error creating collection:', error);
      // Check for unique constraint violation (PostgreSQL error code 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A collection with this slug already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ data: collection }, { status: 201 });
  } catch (error) {
    Logger.error('Error in POST /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * PATCH /api/v1/collections
 * Updates an existing collection (authenticated users only)
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
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    // Fetch current collection to check if cover image changed
    const { data: currentCollection } = await supabase
      .from('collections')
      .select('cover_image_url, cover_image_id')
      .eq('id', id)
      .single();

    const { data: collection, error } = await supabase
      .from('collections')
      .update({
        ...updates,
        modified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      Logger.error('Error updating collection:', error);
      // Check for unique constraint violation (PostgreSQL error code 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A collection with this slug already exists.' },
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
          Logger.error('Failed to delete old cover image upload');
        }
      } catch (uploadError) {
        Logger.error('Error deleting old cover image:', uploadError);
        // Continue anyway - collection is already updated
      }
    }

    return NextResponse.json({ data: collection }, { status: 200 });
  } catch (error) {
    Logger.error('Error in PATCH /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/collections
 * Deletes a collection (authenticated users only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    // First, fetch the collection to get cover_image_url info
    const { data: collection } = await supabase
      .from('collections')
      .select('cover_image_url, cover_image_id')
      .eq('id', id)
      .single();

    // Delete the collection
    const { error } = await supabase.from('collections').delete().eq('id', id);

    if (error) {
      Logger.error('Error deleting collection:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    // If the collection had a cover image, delete it from uploads table and UploadThing
    if (collection?.cover_image_id && collection?.cover_image_url) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/v1/uploads`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: collection.cover_image_id,
            fileUrl: collection.cover_image_url,
          }),
        });

        if (!response.ok) {
          Logger.error('Failed to delete cover image upload');
        }
      } catch (uploadError) {
        Logger.error('Error deleting cover image:', uploadError);
        // Continue anyway - collection is already deleted
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
