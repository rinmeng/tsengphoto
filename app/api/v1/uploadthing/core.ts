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
      try {
        // Save to Supabase database using admin client to bypass RLS
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('uploads')
          .insert({
            user_id: metadata.userId,
            file_url: file.ufsUrl,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
          })
          .select()
          .single();

        if (error) {
          console.error('[UploadThing] Error saving upload to database:', error);
          throw error;
        }
        console.log('[UploadThing] Upload saved to database:', data);
        return { uploadedBy: metadata.userId, url: file.ufsUrl };
      } catch (error) {
        console.error('[UploadThing] Failed to save upload:', error);
        throw new UploadThingError('Failed to save upload to database');
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
