'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/dialog';
import { ImageUploader } from '@/components/ImageUploader';
import { useToast } from '@/hooks/use-toast';
import { collectionsQueryKeys } from '@/lib/queries/collections';

interface CollectionUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionSlug: string;
}

export function CollectionUploadDialog({
  open,
  onOpenChange,
  collectionSlug,
}: CollectionUploadDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation to link uploaded image to collection
  const linkImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const response = await fetch(`/api/v1/collections/${collectionSlug}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to link image to collection');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...collectionsQueryKeys.bySlug(collectionSlug)],
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to link image', { description: error.message });
    },
  });

  const handleUploadComplete = (uploadedUrls?: string[]) => {
    toast.success('Upload completed successfully!');

    // Link all uploaded URLs to the collection
    if (uploadedUrls && uploadedUrls.length > 0) {
      uploadedUrls.forEach((url) => {
        linkImageMutation.mutate(url);
      });
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error(`Upload failed: ${error.message}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>Upload new images to this collection.</DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          <ImageUploader
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
