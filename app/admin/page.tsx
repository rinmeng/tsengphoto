'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ImageUploader } from '@/components/ImageUploader';
import { UploadsGallery, queryKeys } from '@/components/UploadsGallery';
import { Text } from '@/components/Text';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDelayClass } from '@/utils/animations';
import { useQueryClient } from '@tanstack/react-query';

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <section
      className={`container nb-padding mx-auto pb-4 px-4 fade-in-from-top border-x-2
        border-dashed ${getDelayClass(0)}`}
    >
      <Card className={`fade-in-from-top ${getDelayClass(1)}`}>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription
            className='flex items-center gap-1 mt-1 text-sm text-muted-foreground'
          >
            <Info className='size-4' />
            <Text variant='muted-sm'>
              Tip: Keep files under 16MB for faster uploads and storage efficiency.
            </Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            onUploadComplete={() => {
              toast.success('Upload completed successfully!');
              queryClient.invalidateQueries({ queryKey: queryKeys.uploads });
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
        </CardContent>
      </Card>

      <div className={`mt-4 fade-in-from-top ${getDelayClass(2)}`}>
        <UploadsGallery />
      </div>
    </section>
  );
}
