import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/v1/collections/cover-image
 * Immediately removes cover image from a collection and deletes the file
 * Expects: { collectionId: string } in request body
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { collectionId, uploadId, fileUrl } = await req.json();

    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    // Fetch current collection to get cover image info
    const { data: collection, error: fetchError } = await supabase
      .from('collections')
      .select('cover_image_url, cover_image_id')
      .eq('id', collectionId)
      .single();

    if (fetchError || !collection) {
      Logger.error('Error fetching collection:', fetchError);
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Use the values from the request (current form state) OR from the database
    const cover_image_url = fileUrl || collection.cover_image_url;
    const cover_image_id = uploadId || collection.cover_image_id;

    // Update collection to remove cover image references
    const { error: updateError } = await supabase
      .from('collections')
      .update({
        cover_image_url: null,
        cover_image_id: null,
        modified_at: new Date().toISOString(),
      })
      .eq('id', collectionId);

    if (updateError) {
      Logger.error('Error updating collection:', updateError);
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
    }

    Logger.info(
      '[DELETE /api/v1/collections/cover-image] Collection updated successfully'
    );

    // Delete the upload file if it exists
    if (cover_image_id && cover_image_url) {
      try {
        Logger.info('[DELETE /api/v1/collections/cover-image] Deleting upload:', {
          uploadId: cover_image_id,
          fileUrl: cover_image_url,
        });

        const response = await fetch(`${req.nextUrl.origin}/api/v1/uploads`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uploadId: cover_image_id,
            fileUrl: cover_image_url,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          Logger.error('Failed to delete cover image upload:', errorData);
          // Continue anyway - collection is already updated
        } else {
          Logger.info(
            '[DELETE /api/v1/collections/cover-image] Upload deleted successfully'
          );
        }
      } catch (uploadError) {
        Logger.error('Error deleting cover image:', uploadError);
        // Continue anyway - collection is already updated
      }
    }

    return NextResponse.json(
      { success: true, message: 'Cover image removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collections/cover-image:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
