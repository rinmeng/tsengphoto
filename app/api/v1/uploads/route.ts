import { Logger } from '@/lib/logger';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * GET /api/v1/uploads
 * Fetches all uploads for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { data: uploads, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Logger.error('Error fetching uploads:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }

    return NextResponse.json({ data: uploads || [] }, { status: 200 });
  } catch (error) {
    Logger.error('Error in GET /api/v1/uploads:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { uploadId, fileUrl } = await req.json();

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID is required' }, { status: 400 });
    }

    // First fetch the upload record to get the file_key
    const supabase = createAdminClient();
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('file_key, file_url')
      .eq('id', uploadId)
      .single();

    if (fetchError || !upload) {
      Logger.error('Error fetching upload:', fetchError);
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
    }

    // Get file key from database or fallback to URL parsing
    let fileKey = upload.file_key;
    if (!fileKey) {
      // Fallback: Extract from URL for old records without file_key
      const url = fileUrl || upload.file_url;
      fileKey = url?.split('/f/')[1];
      Logger.warn('file_key not found in database, extracted from URL:', {
        uploadId,
        fileKey,
      });
    }

    if (!fileKey) {
      return NextResponse.json(
        { error: 'Could not determine file key' },
        { status: 400 }
      );
    }

    // Delete from UploadThing first
    try {
      await utapi.deleteFiles(fileKey);
    } catch (utError) {
      Logger.error('Error deleting from UploadThing:', utError);
      return NextResponse.json(
        { error: 'Failed to delete file from UploadThing' },
        { status: 500 }
      );
    }

    // Then delete from Supabase database
    const { error: dbError } = await supabase.from('uploads').delete().eq('id', uploadId);

    if (dbError) {
      Logger.error('Error deleting from database:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete from database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Upload deleted successfully from both UploadThing and database' },
      { status: 200 }
    );
  } catch (error) {
    Logger.error('Unexpected error in DELETE /api/v1/uploads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
