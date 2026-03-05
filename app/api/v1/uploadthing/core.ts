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
    .middleware(async ({ req }) => {
      console.log('[UploadThing] middleware CALLED');

      // Skip auth check for callback requests (they don't have user cookies)
      const url = new URL(req.url);
      if (!url.searchParams.has('actionType')) {
        console.log('[UploadThing] Callback request detected - skipping auth');
        return { userId: 'callback' }; // Placeholder, unused in callback
      }

      console.log('[UploadThing] Upload request - authorizing user');
      // This code runs on your server before upload
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('[UploadThing] middleware - No user found, throwing Unauthorized');
        throw new UploadThingError('Unauthorized');
      }

      console.log('[UploadThing] middleware - User authorized:', user.id);
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.warn(
        '==================== UPLOADTHING CALLBACK START ===================='
      );
      console.warn('[UploadThing] onUploadComplete CALLED');
      console.warn('[UploadThing] File:', file);
      console.warn('[UploadThing] Metadata:', metadata);

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
        console.warn(
          '==================== UPLOADTHING CALLBACK SUCCESS ===================='
        );
        return { uploadedBy: metadata.userId, url: file.ufsUrl, success: true };
      } catch (error) {
        console.error('[UploadThing] CRITICAL EXCEPTION:', error);
        console.error(
          '[UploadThing] Error stack:',
          error instanceof Error ? error.stack : 'No stack'
        );
        console.warn(
          '==================== UPLOADTHING CALLBACK ERROR ===================='
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
