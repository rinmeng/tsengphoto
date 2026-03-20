import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAllCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from '@/services/collections.service';
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

    const collections = await fetchAllCollections(!!user);

    if (!collections) {
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
    }

    return NextResponse.json({ data: collections }, { status: 200 });
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
    const result = await createCollection(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
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

    const result = await updateCollection(id, updates);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
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

    const result = await deleteCollection(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    Logger.error('Error in DELETE /api/v1/collections:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
