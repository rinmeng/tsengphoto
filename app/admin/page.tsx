'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ImageUploader } from '@/components/ImageUploader';
import { UploadsGallery } from '@/components/UploadsGallery';
import { Text } from '@/components/Text';
import { Info } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { toast } = useToast();
  const [galleryKey, setGalleryKey] = useState(0);

  return (
    <section
      className='container nb-padding mx-auto pb-4 px-4 fade-in-from-bottom border-x-2
        border-dashed'
    >
      <Card>
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
              setGalleryKey((prev) => prev + 1);
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
        </CardContent>
      </Card>

      <div className='mt-4'>
        <UploadsGallery key={galleryKey} />
      </div>
    </section>
  );
}
