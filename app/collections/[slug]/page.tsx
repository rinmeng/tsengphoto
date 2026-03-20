'use client';

import { notFound, useParams } from 'next/navigation';
import { Text } from '@/components/Text';
import { Calendar, MapPin, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/animate-ui/components/button';
import { Badge } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import { CollectionImageViewer } from './components/CollectionImageViewer';
import { CollectionUploadDialog } from '@/components/collections/CollectionUploadDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import CollectionLoading from './loading';
import { useState } from 'react';
import type { CollectionImage } from '@/lib/types';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState({ current: 0, total: 0 });

  const {
    data: collection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [...collectionsQueryKeys.bySlug(slug), { includeUnpublished: !!user }],
    queryFn: async () => {
      const response = await fetch(`/api/v1/collections/${slug}`);
      if (!response.ok) {
        throw new Error('Collection not found');
      }
      const result = await response.json();
      return result.data;
    },
  });

  // Mutation to delete collection image
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/v1/collections/${slug}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong.');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...collectionsQueryKeys.bySlug(slug)],
      });
      toast.success('Image removed from collection');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete image', { description: error.message });
    },
  });

  // Mutation to bulk delete collection images
  const bulkDeleteMutation = useMutation({
    mutationFn: async (selectedImages: CollectionImage[]) => {
      const totalCount = selectedImages.length;
      let deletedCount = 0;

      setDeletionProgress({ current: 0, total: totalCount });

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        setDeletionProgress({ current: i + 1, total: totalCount });

        const response = await fetch(`/api/v1/collections/${slug}/images/${image.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          deletedCount++;
        } else {
          toast.error(`Failed to delete image ${i + 1}`);
        }
      }

      if (deletedCount === 0) {
        throw new Error('Failed to delete any images');
      }

      return deletedCount;
    },
    onSuccess: (deletedCount) => {
      queryClient.invalidateQueries({
        queryKey: [...collectionsQueryKeys.bySlug(slug)],
      });
      toast.success(
        `Successfully deleted ${deletedCount} image${deletedCount !== 1 ? 's' : ''}`
      );
      setDeletionProgress({ current: 0, total: 0 });
    },
    onError: () => {
      setDeletionProgress({ current: 0, total: 0 });
    },
  });

  // Show loading skeleton
  if (isLoading) {
    return <CollectionLoading />;
  }

  // Only call notFound after loading is complete and data is missing
  if (!isLoading && (isError || !collection)) {
    notFound();
  }

  const formattedDate = collection.date
    ? new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <section
      className='container border-x-2 border-dashed mx-auto pb-4 px-4 nb-padding flex
        flex-col min-h-screen'
    >
      {/* Back Button & Upload */}
      <div className={`sticky top-20 mb-6 z-50 fade-in-from-top ${getDelayClass(0)}`}>
        <div className='flex items-center gap-4'>
          <Link href='/collections'>
            <Button variant='default'>
              <ArrowLeft />
              Back to Collections
            </Button>
          </Link>
          {user && (
            <Button variant='secondary' onClick={() => setUploadDialogOpen(true)}>
              <Upload />
              Upload Images
            </Button>
          )}
        </div>
      </div>

      {/* Collection Header */}
      <div className='mb-12 space-y-6 fade-in-from-top'>
        <div className='space-y-2'>
          <Badge className={`fade-in-from-top capitalize ${getDelayClass(1)}`}>
            <Text variant='bd-xs'>{collection.type}</Text>
          </Badge>
          <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(2)}`}>
            {collection.title}
          </Text>
        </div>

        {collection.description && (
          <Text
            variant='bd-lg'
            className={`text-muted-foreground max-w-3xl fade-in-from-top
            ${getDelayClass(3)}`}
          >
            {collection.description}
          </Text>
        )}

        {/* Meta Information */}
        <div
          className={`flex flex-wrap gap-6 text-muted-foreground fade-in-from-top
            ${getDelayClass(4)}`}
        >
          {formattedDate && (
            <div className='flex items-center gap-2'>
              <Calendar className='size-5' />
              <Text variant='bd-md'>{formattedDate}</Text>
            </div>
          )}
          {collection.location && (
            <div className='flex items-center gap-2'>
              <MapPin className='size-5' />
              <Text variant='bd-md'>{collection.location}</Text>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <Text variant='bd-md'>
              {collection.images.length}{' '}
              {collection.images.length === 1 ? 'photo' : 'photos'}
            </Text>
          </div>
        </div>
      </div>

      {/* Image Gallery with Viewer */}
      <CollectionImageViewer
        images={collection.images}
        collectionTitle={collection.title}
        isAuthenticated={!!user}
        onDeleteImage={deleteImageMutation.mutate}
        isDeletingImage={deleteImageMutation.isPending}
        onBulkDelete={(images) => bulkDeleteMutation.mutate(images)}
        isBulkDeleting={bulkDeleteMutation.isPending}
        deletionProgress={deletionProgress}
      />

      {/* Upload Dialog */}
      {user && (
        <CollectionUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          collectionSlug={slug}
        />
      )}
    </section>
  );
}
