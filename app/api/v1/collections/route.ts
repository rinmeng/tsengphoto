import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Logger } from '@/lib/logger';

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

    return NextResponse.json({ data: collections || [] }, { status: 200 });
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

    const { error } = await supabase.from('collections').delete().eq('id', id);

    if (error) {
      Logger.error('Error deleting collection:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
