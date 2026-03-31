import { Logger } from '@/lib/logger';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/collection-groups
 * Fetches all collection groups
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: groups, error } = await supabase
      .from('collection_groups')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      Logger.error('Error fetching collection groups:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ data: groups || [] }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/collection-groups:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

/**
 * POST /api/v1/collection-groups
 * Creates a new collection group (authenticated users only)
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

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Group name is required.' }, { status: 400 });
    }

    const { data: group, error } = await supabase
      .from('collection_groups')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      Logger.error('Error creating collection group:', error);
      // Check for unique constraint violation (PostgreSQL error code 23505)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A group with this name already exists.' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
    }

    return NextResponse.json({ data: group }, { status: 201 });
  } catch (error) {
    Logger.error('Error in POST /api/v1/collection-groups:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
