'use client';

import { notFound, useParams } from 'next/navigation';
import { Text } from '@/components/Text';
import { Calendar, MapPin, ArrowLeft, Upload, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/animate-ui/components/button';
import { Badge } from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import { UserUploadedImages } from './components/UserUploadedImages';
import { DriveImages } from './components/DriveImages';
import { ImageViewer } from './components/ImageViewer';
import { CollectionUploadDialog } from '@/components/collections/CollectionUploadDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/animate-ui/components/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import CollectionLoading from './loading';
import { useState, useMemo } from 'react';
import type { CollectionImage } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState({ current: 0, total: 0 });
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const {
    data: collection,
    isLoading: isLoadingCollection,
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
    enabled: !authLoading,
  });

  // Fetch Google Drive images if collection has a drive_link
  const { data: driveImages = [], isLoading: isDriveImagesLoading } = useQuery({
    queryKey: ['driveImages', slug],
    queryFn: async () => {
      const response = await fetch(`/api/v1/collections/${slug}/drive-images`);
      if (!response.ok) {
        return [];
      }
      const result = await response.json();
      return result.data || [];
    },
    enabled: !!collection?.drive_link, // Only fetch if drive_link exists
  });

  // Convert Drive images to CollectionImage format
  const formattedDriveImages: CollectionImage[] = useMemo(() => {
    return driveImages.map(
      (
        img: { id: string; name: string; thumbnailUrl: string; fullQualityUrl: string },
        index: number
      ) => ({
        id: `drive-${img.id}`,
        collection_id: collection?.id || '',
        image_url: img.thumbnailUrl, // Use thumbnail for grid display
        order: index,
        created_at: new Date().toISOString(),
      })
    );
  }, [driveImages, collection?.id]);

  // Full quality URLs for viewer (proxied to avoid rate limits)
  const driveFullQualityUrls: string[] = useMemo(() => {
    return driveImages.map(
      (img: { id: string; name: string; thumbnailUrl: string; fullQualityUrl: string }) =>
        `/api/v1/proxy-image?url=${encodeURIComponent(img.fullQualityUrl)}`
    );
  }, [driveImages]);

  // Combine all images for viewer
  const sortedImages: CollectionImage[] = useMemo(
    () =>
      (collection?.images || []).sort(
        (a: CollectionImage, b: CollectionImage) => (a.order || 0) - (b.order || 0)
      ),
    [collection?.images]
  );

  const allImageUrls: string[] = useMemo(() => {
    const uploaded = sortedImages
      .map((img: CollectionImage) => img.image_url)
      .filter(Boolean) as string[];
    // Use proxied full quality URLs for viewer to avoid rate limits
    return [...uploaded, ...driveFullQualityUrls];
  }, [sortedImages, driveFullQualityUrls]);

  // Rotate images for viewer
  const rotatedImageUrls: string[] = useMemo(
    () => [
      ...allImageUrls.slice(selectedImageIndex),
      ...allImageUrls.slice(0, selectedImageIndex),
    ],
    [allImageUrls, selectedImageIndex]
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteImageMutation.mutate(imageToDelete);
      setImageToDelete(null);
    }
  };

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

  // Show loading skeleton while auth is loading or collection is loading
  // Also show loading if collection hasn't loaded yet (even if query is disabled)
  const isLoading = authLoading || isLoadingCollection || (!collection && !isError);

  if (isLoading) {
    return <CollectionLoading />;
  }

  // Only call notFound after loading is complete and data is missing
  if (isError || !collection) {
    notFound();
  }

  const formattedDate = collection.date
    ? new Date(collection.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const isEmpty =
    !isDriveImagesLoading &&
    !isLoadingCollection &&
    sortedImages.length === 0 &&
    formattedDriveImages.length === 0;

  return (
    <section
      className='container border-x-2 border-dashed mx-auto pb-4 px-4 nb-padding flex
        flex-col min-h-screen'
    >
      {/* Back Button & Upload */}
      <div className={`sticky top-20 mb-6 z-40 fade-in-from-top ${getDelayClass(0)}`}>
        <div className='flex items-center gap-4 flex-wrap'>
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
      <div className='mb-4 space-y-6 fade-in-from-top'>
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
        </div>
      </div>

      {/* Image Gallery */}
      <div className='flex flex-col space-y-6 min-h-[70vh]'>
        {isEmpty && (
          <div className='flex h-full items-center justify-center'>
            <EmptyState
              className='min-h-[70vh]'
              bordered={true}
              icon={ImageIcon}
              title='No images in this collection yet.'
              description={
                user
                  ? 'Start by uploading some photos or linking a Google Drive folder to this collection via editing the collection on the previous page.'
                  : 'Please check back later!'
              }
            />
          </div>
        )}
        {/* User Uploaded Images */}
        {sortedImages.length > 0 && (
          <UserUploadedImages
            images={sortedImages}
            collectionTitle={collection.title}
            isAuthenticated={!!user}
            onImageClick={handleImageClick}
            onDeleteImage={handleDeleteClick}
            isDeletingImage={deleteImageMutation.isPending}
            onBulkDelete={(images) => bulkDeleteMutation.mutate(images)}
            isBulkDeleting={bulkDeleteMutation.isPending}
            deletionProgress={deletionProgress}
          />
        )}

        {!isDriveImagesLoading && formattedDriveImages.length > 0 && (
          <div className={sortedImages.length > 0 ? 'mt-12' : ''}>
            <DriveImages
              images={formattedDriveImages}
              driveLink={collection.drive_link}
              collectionTitle={collection.title}
              onImageClick={handleImageClick}
              startIndex={sortedImages.length}
              driveFullQualityUrls={driveFullQualityUrls}
            />
          </div>
        )}
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={rotatedImageUrls}
        isOpen={isViewerOpen}
        onOpenChange={setIsViewerOpen}
      />

      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={(open) => !open && setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove image from collection?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the image from
              this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteImageMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteImageMutation.isPending}
              className='bg-destructive text-white hover:bg-destructive/90'
            >
              {deleteImageMutation.isPending ? (
                <>
                  <Loader2 className='animate-spin' />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
