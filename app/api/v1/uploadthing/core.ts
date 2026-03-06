import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { Logger } from '@/lib/logger';

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
      const url = new URL(req.url);
      const isCallback = !url.searchParams.has('actionType');

      if (isCallback) {
        return { userId: 'system-callback' };
      }

      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new UploadThingError('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const supabase = createAdminClient();

        const { error } = await supabase
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
          Logger.error('Database error:', error);
          return {
            uploadedBy: metadata.userId,
            url: file.ufsUrl,
            dbError: error.message,
          };
        }

        return { uploadedBy: metadata.userId, url: file.ufsUrl, success: true };
      } catch (error) {
        Logger.error('Callback error:', error);
        return {
          uploadedBy: metadata.userId,
          url: file.ufsUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
