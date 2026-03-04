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
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
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
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.ufsUrl);

      // Save to Supabase database using admin client to bypass RLS
      // (user was already authenticated in middleware)
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('uploads')
        .insert({
          user_id: metadata.userId,
          file_url: file.ufsUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          // entity_type and entity_id can be passed from client via input
          // e.g., { entity_type: 'event', entity_id: 'uuid' }
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving upload to database:', error);
      } else {
        console.log('Upload saved to database:', data);
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
