import { createAdminClient } from '@/utils/supabase/admin';
import { UTApi } from 'uploadthing/server';
import { NextRequest, NextResponse } from 'next/server';

const utapi = new UTApi();

export async function DELETE(req: NextRequest) {
  try {
    const { uploadId, fileUrl } = await req.json();

    if (!uploadId || !fileUrl) {
      return NextResponse.json(
        { error: 'Upload ID and file URL are required' },
        { status: 400 }
      );
    }

    // Extract the file key from the UploadThing URL
    // URL format: https://{UPLOADTHING_APP_ID}.ufs.sh/f/{fileKey}
    const fileKey = fileUrl.split('/f/')[1];

    if (!fileKey) {
      return NextResponse.json({ error: 'Invalid file URL format' }, { status: 400 });
    }

    // Delete from UploadThing first
    try {
      await utapi.deleteFiles(fileKey);
    } catch (utError) {
      console.error('Error deleting from UploadThing:', utError);
      return NextResponse.json(
        { error: 'Failed to delete file from UploadThing' },
        { status: 500 }
      );
    }

    // Then delete from Supabase database using admin client
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from('uploads').delete().eq('id', uploadId);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
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
    console.error('Unexpected error in DELETE /api/v1/uploads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
