'use client';

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
import { Button } from '@/components/animate-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/dialog';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { CollectionUploadDialog } from '@/components/collections/CollectionUploadDialog';
import { EmptyState } from '@/components/EmptyState';
import { Text } from '@/components/Text';
import { Badge } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { collectionsQueryKeys } from '@/lib/queries/collections';
import type { CollectionImage, CollectionWithImages } from '@/lib/types';
import { getDelayClass } from '@/utils/animations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Download,
  Folder,
  ImageIcon,
  Loader2,
  MapPin,
  Share2,
  Type,
  Upload,
} from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ImagesGrid } from './components/ImagesGrid';
import { ImageViewer } from './components/ImageViewer';
import CollectionLoading from './loading';

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params['slug'] as string;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState({ current: 0, total: 0 });
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zippingProgress, setZippingProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const {
    data: collection,
    isLoading: isLoadingCollection,
    isError,
  } = useQuery<CollectionWithImages>({
    queryKey: [
      ...collectionsQueryKeys.bySlug(slug),
      { includeUnpublished: isAuthenticated },
    ],
    queryFn: async () => {
      const response = await fetch(`/api/v1/collections/${slug}`);
      if (!response.ok) {
        throw new Error('Collection not found');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !authLoading,
    retry: false, // Don't retry 404s - collection doesn't exist
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

  const handleShareClick = () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: collection.title,
          text: `Check out this collection: ${collection.title}`,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success('Link copied to clipboard');
        })
        .catch((error) => {
          toast.error('Failed to copy URL', { description: error.message });
        });
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      throw new Error(`Failed to download ${filename}`);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return;

    setIsDownloading(true);
    setDownloadComplete(false);
    setDownloadDialogOpen(true);

    // Combine uploaded and drive images
    const selectedUploaded = sortedImages.filter((img) => selectedIds.has(img.id));
    const selectedDrive = formattedDriveImages.filter((img) => selectedIds.has(img.id));
    const totalCount = selectedUploaded.length + selectedDrive.length;

    setDownloadProgress({ current: 0, total: totalCount });

    try {
      if (totalCount === 1) {
        // Single image download
        if (selectedUploaded.length === 1) {
          const image = selectedUploaded[0];
          if (image.image_url) {
            const filename = `${collection.title.replace(/\s+/g, '_')}_1.jpg`;
            await downloadImage(image.image_url, filename);
            toast.success('Downloaded 1 image');
          }
        } else if (selectedDrive.length === 1) {
          const driveImg = selectedDrive[0];
          const driveIndex = formattedDriveImages.findIndex(
            (img) => img.id === driveImg.id
          );
          const fullQualityUrl = driveFullQualityUrls[driveIndex];
          if (fullQualityUrl) {
            const filename = `${collection.title.replace(/\s+/g, '_')}_drive_${driveIndex + 1}.jpg`;
            await downloadImage(fullQualityUrl, filename);
            toast.success('Downloaded 1 image');
          }
        }
      } else {
        // Multiple images - create zip
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        let successCount = 0;
        let failedCount = 0;
        let currentProgress = 0;
        const BATCH_SIZE = 5;
        const collectionSlug = collection.title.replace(/\s+/g, '_');

        type DownloadTask = { url: string; filename: string };

        const uploadedTasks: DownloadTask[] = selectedUploaded
          .map((image, i) =>
            image.image_url
              ? { url: image.image_url, filename: `${collectionSlug}_${i + 1}.jpg` }
              : null
          )
          .filter((t): t is DownloadTask => t !== null);

        const driveTasks: DownloadTask[] = selectedDrive
          .map((driveImg) => {
            const driveIndex = formattedDriveImages.findIndex(
              (img) => img.id === driveImg.id
            );
            const fullQualityUrl = driveFullQualityUrls[driveIndex];
            return fullQualityUrl
              ? { url: fullQualityUrl, filename: `${collectionSlug}_drive_${driveIndex + 1}.jpg` }
              : null;
          })
          .filter((t): t is DownloadTask => t !== null);

        const allTasks = [...uploadedTasks, ...driveTasks];

        for (let i = 0; i < allTasks.length; i += BATCH_SIZE) {
          const batch = allTasks.slice(i, i + BATCH_SIZE);
          const results = await Promise.allSettled(
            batch.map(({ url, filename }) =>
              fetch(url)
                .then((r) => r.blob())
                .then((blob) => ({ filename, blob }))
            )
          );

          for (const result of results) {
            if (result.status === 'fulfilled') {
              zip.file(result.value.filename, result.value.blob);
              successCount++;
            } else {
              failedCount++;
            }
            setDownloadProgress({ current: ++currentProgress, total: totalCount });
          }
        }

        if (successCount > 0) {
          setIsZipping(true);
          setZippingProgress(0);

          const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
            setZippingProgress(metadata.percent);
          });
          const zipUrl = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = zipUrl;
          a.download = `${collection.title.replace(/\s+/g, '_')}_images.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(zipUrl);

          toast.success(
            `Downloaded ${successCount} image${successCount !== 1 ? 's' : ''} as zip`
          );
        }

        if (failedCount > 0) {
          toast.error(
            `Failed to download ${failedCount} image${failedCount !== 1 ? 's' : ''}`
          );
        }
      }
    } catch {
      toast.error('Failed to download images');
    } finally {
      setIsDownloading(false);
      setIsZipping(false);
      setZippingProgress(0);
      if (totalCount > 1) {
        setDownloadComplete(true);
      } else {
        setDownloadProgress({ current: 0, total: 0 });
        setSelectedIds(new Set());
      }
    }
  };

  const handleCloseDownloadDialog = () => {
    setDownloadDialogOpen(false);
    setTimeout(() => {
      setDownloadComplete(false);
      setDownloadProgress({ current: 0, total: 0 });
      setSelectedIds(new Set());
    }, 200);
  };

  const progressPercentage =
    downloadProgress.total > 0
      ? Math.round((downloadProgress.current / downloadProgress.total) * 100)
      : 0;

  return (
    <>
      <Dialog
        open={downloadDialogOpen && downloadProgress.total > 1}
        onOpenChange={() => {}}
      >
        <DialogContent showCloseButton={false} className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className={`fade-in-from-bottom ${getDelayClass(1)}`}>
              {downloadComplete ? 'Download Complete' : 'Downloading Images'}
            </DialogTitle>
            <DialogDescription className={`fade-in-from-bottom ${getDelayClass(2)}`}>
              {downloadComplete
                ? 'Your images have been downloaded successfully.'
                : isZipping
                  ? 'Please wait while we package your images into a zip file.'
                  : "Your download is in progress. Feel free to close this dialog or switch tabs — just don't close this page."}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {!downloadComplete && (
              <div className='space-y-2'>
                {isZipping ? (
                  <>
                    <div
                      className={`flex justify-between text-sm fade-in-from-bottom
                        ${getDelayClass(3)}`}
                    >
                      <Text variant='bd-sm'>Zipping files</Text>
                      <Text variant='bd-sm'>
                        {Math.round(zippingProgress) >= 100
                          ? 'Completed'
                          : `${Math.round(zippingProgress)}%`}
                      </Text>
                    </div>
                    <Progress
                      value={zippingProgress}
                      className={`w-full fade-in-from-bottom ${getDelayClass(4)}`}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={`flex justify-between text-sm fade-in-from-bottom
                        ${getDelayClass(3)}`}
                    >
                      <Text variant='bd-sm'>
                        {downloadProgress.current} of {downloadProgress.total} images
                      </Text>
                      <Text variant='bd-sm'>{progressPercentage}%</Text>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className={`w-full fade-in-from-bottom ${getDelayClass(4)}`}
                    />
                  </>
                )}
              </div>
            )}
            {downloadComplete && (
              <div
                className={`flex justify-end pt-2 fade-in-from-bottom ${getDelayClass(3)}`}
              >
                <Button onClick={handleCloseDownloadDialog}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section
        className='container border-x-2 border-dashed mx-auto pb-4 px-4 nb-padding flex
          flex-col min-h-screen'
      >
        {/* Back Button & Upload */}
        <div className={`sticky top-20 mb-6 z-40 fade-in-from-top ${getDelayClass(0)}`}>
          <div className='flex items-center gap-4 flex-wrap'>
            <Button variant='default' onClick={() => router.back()}>
              <ArrowLeft />
              Back
            </Button>
            <Button variant='secondary' onClick={handleShareClick}>
              <Share2 className='size-5' />
              Share
            </Button>
            {collection.type !== 'series' && selectedIds.size > 0 && (
              <Button
                variant='secondary'
                onClick={handleBulkDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className='animate-spin' /> Downloading{' '}
                    {downloadProgress.current} of {downloadProgress.total}...
                  </>
                ) : (
                  <>
                    <Download /> Download ({selectedIds.size})
                  </>
                )}
              </Button>
            )}
            {isAuthenticated && (
              <Button variant='secondary' onClick={() => setUploadDialogOpen(true)}>
                <Upload />
                Upload Images
              </Button>
            )}
          </div>
        </div>

        {/* Collection Header */}
        <div className='mb-4 space-y-6 fade-in-from-top'>
          <Text variant='hd-xxl' className={`fade-in-from-top ${getDelayClass(2)}`}>
            {collection.title}
          </Text>

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
            className={`flex flex-wrap gap-4 text-muted-foreground fade-in-from-top
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
            <Badge variant='outline' className='capitalize'>
              <Type className='size-12' />
              <Text variant='bd-xs'>{collection.type}</Text>
            </Badge>
            {collection.collection_group_name && (
              <Badge variant='outline' className='capitalize'>
                <Folder className='size-12' />
                <Text variant='bd-xs'>{collection.collection_group_name}</Text>
              </Badge>
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
                  isAuthenticated
                    ? 'Start by uploading some photos or linking a Google Drive folder to this collection via editing the collection on the previous page.'
                    : 'Please check back later!'
                }
              />
            </div>
          )}
          {/* User Uploaded Images */}
          {sortedImages.length > 0 && (
            <ImagesGrid
              images={sortedImages}
              collectionTitle={collection.title}
              onImageClick={handleImageClick}
              source='uploaded'
              onDeleteImage={handleDeleteClick}
              isDeletingImage={deleteImageMutation.isPending}
              onBulkDelete={(images) => bulkDeleteMutation.mutate(images)}
              isBulkDeleting={bulkDeleteMutation.isPending}
              deletionProgress={deletionProgress}
              maxColumns={collection.type === 'series' ? 3 : 4}
              disableDownload={collection.type === 'series'}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}

          {!isDriveImagesLoading && formattedDriveImages.length > 0 && (
            <div className={sortedImages.length > 0 ? 'mt-12' : ''}>
              <ImagesGrid
                images={formattedDriveImages}
                collectionTitle={collection.title}
                onImageClick={handleImageClick}
                source='drive'
                startIndex={sortedImages.length}
                maxColumns={collection.type === 'series' ? 3 : 4}
                disableDownload={collection.type === 'series'}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
          )}
        </div>

        {/* Image Viewer */}
        <ImageViewer
          images={rotatedImageUrls}
          isOpen={isViewerOpen}
          showDownloadButton={collection.type !== 'series'}
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

        {isAuthenticated && (
          <CollectionUploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            collectionSlug={slug}
          />
        )}
      </section>
    </>
  );
}
