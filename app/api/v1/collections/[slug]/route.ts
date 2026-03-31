import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/collections/[slug]
 * Fetches a single collection by slug
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
      .from('collections')
      .select(
        `
        *,
        collection_group_name:collection_groups(name),
        images:collection_image(*)
      `
      )
      .eq('slug', slug);

    if (!user) {
      query = query.eq('is_published', true);
    }

    const { data: collection, error } = await query.single();

    if (error) {
      Logger.error('Error fetching collection by slug:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    // Transform collection_group_name from nested object to string
    const transformedCollection = {
      ...collection,
      collection_group_name:
        (collection.collection_group_name as { name: string } | null)?.name || null,
    };

    return NextResponse.json({ data: transformedCollection }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/collections/[slug]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
