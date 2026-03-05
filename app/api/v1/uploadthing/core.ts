import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
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
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('[UploadThing] ========================================');
      console.log('[UploadThing] onUploadComplete CALLED');
      console.log('[UploadThing] metadata:', metadata);
      console.log('[UploadThing] file object:', file);
      console.log('[UploadThing] Environment:', {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });

      try {
        // Save to Supabase database using admin client to bypass RLS
        const supabase = createAdminClient();

        const uploadData = {
          user_id: metadata.userId,
          file_url: file.url,
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
          // Return success to prevent UploadThing from marking as failed
          return { uploadedBy: metadata.userId, url: file.url, dbError: error.message };
        }

        console.log('[UploadThing] SUCCESS! Saved to database:', data);
        return { uploadedBy: metadata.userId, url: file.url, success: true };
      } catch (error) {
        console.error('[UploadThing] Exception caught:', error);
        // Return a valid response instead of throwing
        return {
          uploadedBy: metadata.userId,
          url: file.url,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
