import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/v1/collection-groups/[id]
 * Deletes a collection group (authenticated users only)
 * Collections in this group will have their collection_group_id set to NULL
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required.' }, { status: 400 });
    }

    // Delete the group (collections will have their collection_group_id set to NULL due to ON DELETE SET NULL)
    const { error } = await supabase.from('collection_groups').delete().eq('id', id);

    if (error) {
      Logger.error('Error deleting collection group:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collection-groups/[id]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
