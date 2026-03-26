import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';

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

    return NextResponse.json({ data: collection }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/collections/[slug]:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
