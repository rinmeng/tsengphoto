import { Logger } from '@/lib/logger';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '16MB',
      maxFileCount: 100,
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
        Logger.info('onUploadComplete started', {
          userId: metadata.userId,
          fileName: file.name,
          fileUrl: file.ufsUrl,
        });

        const supabase = createAdminClient();

        const { data: upload, error } = await supabase
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
          Logger.error('Database error in onUploadComplete:', error);
          return {
            uploadedBy: metadata.userId,
            url: file.ufsUrl,
            dbError: error.message,
          };
        }

        Logger.info('onUploadComplete success', {
          uploadId: upload.id,
          fileName: file.name,
        });

        return {
          uploadedBy: metadata.userId,
          url: file.ufsUrl,
          uploadId: upload.id,
          success: true,
        };
      } catch (error) {
        Logger.error('Callback error in onUploadComplete:', error);
        return {
          uploadedBy: metadata.userId,
          url: file.ufsUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
