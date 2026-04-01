'use client';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { Button } from '@/components/animate-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/dialog';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import type { CollectionImage } from '@/lib/types';
import { getDelayClass } from '@/utils/animations';
import JSZip from 'jszip';
import { Download, ImageOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Masonry from 'react-masonry-css';

interface ImagesGridProps {
  images: CollectionImage[];
  collectionTitle: string;
  onImageClick: (index: number) => void;
  source: 'uploaded' | 'drive';
  startIndex?: number;
  driveFullQualityUrls?: string[];
  onDeleteImage?: (imageId: string) => void;
  isDeletingImage?: boolean;
  onBulkDelete?: (images: CollectionImage[]) => void;
  isBulkDeleting?: boolean;
  deletionProgress?: { current: number; total: number };
}

export function ImagesGrid({
  images,
  collectionTitle,
  onImageClick,
  source,
  startIndex = 0,
  driveFullQualityUrls = [],
  onDeleteImage,
  isDeletingImage = false,
  onBulkDelete,
  isBulkDeleting = false,
  deletionProgress = { current: 0, total: 0 },
}: ImagesGridProps) {
  const { isAuthenticated } = useAuth();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [zippingProgress, setZippingProgress] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const isDrive = source === 'drive';
  const isUploaded = source === 'uploaded';

  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(images.map((img) => img.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
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
    setDialogOpen(true);

    if (isDrive) {
      // Drive images - use indices for URL lookup
      const selectedImagesWithIndices = images
        .map((img, idx) => ({ img, idx }))
        .filter(({ img }) => selectedIds.has(img.id));

      setDownloadProgress({ current: 0, total: selectedImagesWithIndices.length });

      try {
        if (selectedImagesWithIndices.length === 1) {
          const { idx } = selectedImagesWithIndices[0];
          const fullQualityUrl = driveFullQualityUrls[idx];

          if (fullQualityUrl) {
            const filename = `${collectionTitle.replace(/\s+/g, '_')}_drive_${idx + 1}.jpg`;
            await downloadImage(fullQualityUrl, filename);
            toast.success('Downloaded 1 image');
          }
        } else {
          const zip = new JSZip();
          let successCount = 0;
          let failedCount = 0;

          for (let i = 0; i < selectedImagesWithIndices.length; i++) {
            const { idx } = selectedImagesWithIndices[i];
            const fullQualityUrl = driveFullQualityUrls[idx];
            setDownloadProgress({
              current: i + 1,
              total: selectedImagesWithIndices.length,
            });

            if (fullQualityUrl) {
              try {
                const response = await fetch(fullQualityUrl);
                const blob = await response.blob();
                const filename = `${collectionTitle.replace(/\s+/g, '_')}_drive_${idx + 1}.jpg`;
                zip.file(filename, blob);
                successCount++;
              } catch {
                failedCount++;
              }
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
            a.download = `${collectionTitle.replace(/\s+/g, '_')}_drive_images.zip`;
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
        if (selectedImagesWithIndices.length > 1) {
          setDownloadComplete(true);
        } else {
          setSelectedIds(new Set());
        }
      }
    } else {
      // Uploaded images - use image URLs directly
      const selectedImages = images.filter((img) => selectedIds.has(img.id));
      setDownloadProgress({ current: 0, total: selectedImages.length });

      try {
        if (selectedImages.length === 1) {
          const image = selectedImages[0];
          if (image.image_url) {
            const filename = `${collectionTitle.replace(/\s+/g, '_')}_1.jpg`;
            await downloadImage(image.image_url, filename);
            toast.success('Downloaded 1 image');
          }
        } else {
          const zip = new JSZip();
          let successCount = 0;
          let failedCount = 0;

          for (let i = 0; i < selectedImages.length; i++) {
            const image = selectedImages[i];
            setDownloadProgress({ current: i + 1, total: selectedImages.length });

            if (image.image_url) {
              try {
                const response = await fetch(image.image_url);
                const blob = await response.blob();
                const filename = `${collectionTitle.replace(/\s+/g, '_')}_${i + 1}.jpg`;
                zip.file(filename, blob);
                successCount++;
              } catch {
                failedCount++;
              }
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
            a.download = `${collectionTitle.replace(/\s+/g, '_')}_images.zip`;
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
        if (selectedImages.length > 1) {
          setDownloadComplete(true);
        } else {
          setSelectedIds(new Set());
        }
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0 || !onBulkDelete) return;
    const selectedImages = images.filter((img) => selectedIds.has(img.id));
    onBulkDelete(selectedImages);
  };

  const handleDeleteClick = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    if (onDeleteImage) {
      onDeleteImage(imageId);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDownloadComplete(false);
      setSelectedIds(new Set());
    }, 200);
  };

  const progressPercentage =
    downloadProgress.total > 0
      ? Math.round((downloadProgress.current / downloadProgress.total) * 100)
      : 0;

  return (
    <>
      <Dialog open={dialogOpen && downloadProgress.total > 1} onOpenChange={() => {}}>
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
                <Button onClick={handleCloseDialog}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className='space-y-6'>
        {/* Title for Drive images */}
        {isDrive && (
          <Text variant='hd-lg' className={`fade-in-from-top ${getDelayClass(1)}`}>
            {startIndex > 0 ? 'More Images from' : 'Images from'} Google Drive
          </Text>
        )}

        {/* Bulk Actions Bar */}
        {images.length > 0 && (
          <div
            className={`flex items-center justify-between w-full gap-2 fade-in-from-top
            ${getDelayClass(isDrive ? 4 : 1)}`}
          >
            <label className='flex items-center gap-2 cursor-pointer'>
              <Checkbox
                checked={selectedIds.size === images.length && images.length > 0}
                onCheckedChange={handleSelectAll}
                disabled={isBulkDeleting || isDownloading}
              >
                <CheckboxIndicator />
              </Checkbox>
              <Text variant='bd-sm'>Select All</Text>
            </label>
            <div className='flex gap-2'>
              {/* Delete button - only for authenticated users on uploaded images */}
              {isAuthenticated && isUploaded && selectedIds.size > 0 && (
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting || isDownloading}
                >
                  {isBulkDeleting ? (
                    <>
                      <Spinner /> Deleting {deletionProgress.current} of{' '}
                      {deletionProgress.total}...
                    </>
                  ) : (
                    <>
                      <Trash2 /> Delete Selected ({selectedIds.size})
                    </>
                  )}
                </Button>
              )}
              {/* Download button */}
              {selectedIds.size > 0 && (
                <Button
                  variant='default'
                  size='sm'
                  onClick={handleBulkDownload}
                  disabled={isDownloading || isBulkDeleting}
                >
                  {isDownloading ? (
                    <>
                      <Spinner /> Downloading {downloadProgress.current} of{' '}
                      {downloadProgress.total}...
                    </>
                  ) : (
                    <>
                      <Download /> Download Selected ({selectedIds.size})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Images Grid */}
        <Masonry
          breakpointCols={{ default: 3, 1024: 2, 768: 1 }}
          className='masonry-grid'
          columnClassName='masonry-grid_column'
        >
          {images.map((image, index) => {
            const globalIndex = isDrive ? startIndex + index : index;
            const hasFailed = failedImages.has(image.id);

            return (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded ${
                  isMobile ? '' : 'cursor-pointer'
                } fade-in-from-top
                ${getDelayClass(globalIndex + (isDrive ? 5 : 2))}`}
                onClick={isMobile ? undefined : () => onImageClick(globalIndex)}
              >
                <div className='relative overflow-hidden'>
                  {hasFailed && isDrive ? (
                    <div
                      className='flex h-64 flex-col items-center justify-center gap-2
                        bg-muted rounded'
                    >
                      <ImageOff className='w-8 h-8 text-muted-foreground' />
                      <Text variant='muted-sm'>Failed to load</Text>
                    </div>
                  ) : image.image_url ? (
                    <OptimizedImage
                      src={
                        isDrive
                          ? `/api/v1/proxy-image?url=${encodeURIComponent(image.image_url)}`
                          : image.image_url
                      }
                      alt={`${collectionTitle} - ${isDrive ? 'Google Drive Photo' : 'Photo'} ${index + 1}`}
                      width={800}
                      height={600}
                      className='w-full h-auto rounded hover:scale-105
                        transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      loading={isDrive ? 'lazy' : 'eager'}
                      showLoading={true}
                      onError={() => handleImageError(image.id)}
                    />
                  ) : (
                    <div
                      className='flex h-64 items-center justify-center bg-muted rounded'
                    >
                      <Text variant='muted'>No image</Text>
                    </div>
                  )}

                  {/* Checkbox - Always visible */}
                  <div className='absolute top-2 left-2 z-10'>
                    <Checkbox
                      checked={selectedIds.has(image.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(image.id, checked as boolean)
                      }
                      disabled={isBulkDeleting || isDownloading}
                      variant='overlay'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>

                  {/* Individual Delete button - Only for authenticated users on uploaded images */}
                  {isAuthenticated && isUploaded && (
                    <div className='absolute top-2 right-2 z-10'>
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={(e) => handleDeleteClick(e, image.id)}
                        disabled={isDeletingImage || isBulkDeleting || isDownloading}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>
    </>
  );
}
