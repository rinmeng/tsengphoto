import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '16MB',
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      // This code runs on your server before upload
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new UploadThingError('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log('[UploadThing] onUploadComplete CALLED');
        console.log('[UploadThing] metadata:', JSON.stringify(metadata));
        console.log('[UploadThing] file object:', JSON.stringify(file));
        console.log('[UploadThing] Environment:', {
          nodeEnv: process.env.NODE_ENV,
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        });
      } catch (logError) {
        console.error('[UploadThing] Error during logging:', logError);
      }

      try {
        // Save to Supabase database using admin client to bypass RLS
        const supabase = createAdminClient();

        const uploadData = {
          user_id: metadata.userId,
          file_url: file.ufsUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
        };

        console.log('[UploadThing] Inserting data:', uploadData);

        const { data, error } = await supabase
          .from('uploads')
          .insert(uploadData)
          .select()
          .single();

        if (error) {
          console.error('[UploadThing] Database error:', error);
          return {
            uploadedBy: metadata.userId,
            url: file.ufsUrl,
            dbError: error.message,
          };
        }

        console.log('[UploadThing] SUCCESS! Saved to database:', data);
        return { uploadedBy: metadata.userId, url: file.ufsUrl, success: true };
      } catch (error) {
        console.error('[UploadThing] CRITICAL EXCEPTION:', error);
        console.error(
          '[UploadThing] Error stack:',
          error instanceof Error ? error.stack : 'No stack'
        );
        return {
          uploadedBy: metadata.userId,
          url: file.ufsUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
