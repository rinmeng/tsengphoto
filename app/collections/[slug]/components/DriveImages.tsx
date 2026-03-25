'use client';
import { useState } from 'react';
import { ImageOff, Download } from 'lucide-react';
import { Text } from '@/components/Text';
import { Button } from '@/components/animate-ui/components/button';
import { Spinner } from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/dialog';
import { Progress } from '@/components/animate-ui/components/radix/progress';
import { getDelayClass } from '@/utils/animations';
import type { CollectionImage } from '@/lib/types';
import { OptimizedImageWithLoading } from '@/components/OptimizedImageWithLoading';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import JSZip from 'jszip';

interface DriveImagesProps {
  images: CollectionImage[];
  driveLink?: string | null;
  collectionTitle: string;
  onImageClick: (index: number) => void;
  startIndex?: number;
  driveFullQualityUrls?: string[];
}

export function DriveImages({
  images,
  collectionTitle,
  onImageClick,
  startIndex = 0,
  driveFullQualityUrls = [],
}: DriveImagesProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

    // Create array of selected images with their indices for URL lookup
    const selectedImagesWithIndices = images
      .map((img, idx) => ({ img, idx }))
      .filter(({ img }) => selectedIds.has(img.id));

    setDownloadProgress({ current: 0, total: selectedImagesWithIndices.length });

    try {
      // If only one image, download directly without zipping
      if (selectedImagesWithIndices.length === 1) {
        const { idx } = selectedImagesWithIndices[0];
        const fullQualityUrl = driveFullQualityUrls[idx];

        if (fullQualityUrl) {
          const filename = `${collectionTitle.replace(/\s+/g, '_')}_drive_${idx + 1}.jpg`;
          await downloadImage(fullQualityUrl, filename);
          toast.success('Downloaded 1 image');
        }
      } else {
        // Multiple images - create a zip file
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
              // Use the full quality URL for download
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
          // Generate zip and download
          const zipBlob = await zip.generateAsync({ type: 'blob' });
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
      if (selectedImagesWithIndices.length > 1) {
        setDownloadComplete(true);
      } else {
        setSelectedIds(new Set());
      }
    }
  };

  const handleCloseDialog = () => {
    setDownloadComplete(false);
    setSelectedIds(new Set());
  };

  const progressPercentage =
    downloadProgress.total > 0
      ? Math.round((downloadProgress.current / downloadProgress.total) * 100)
      : 0;

  return (
    <>
      {/* Download Progress Dialog */}
      <Dialog
        open={(isDownloading || downloadComplete) && downloadProgress.total > 1}
        onOpenChange={() => {}}
      >
        <DialogContent showCloseButton={false} className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {downloadComplete ? 'Download Complete' : 'Downloading Images'}
            </DialogTitle>
            <DialogDescription>
              {downloadComplete
                ? 'Your images have been downloaded successfully.'
                : "Your download is in progress. Feel free to close this dialog or switch tabs — just don't close this page."}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <Text variant='bd-sm'>
                  {downloadProgress.current} of {downloadProgress.total} images
                </Text>
                <Text variant='bd-sm'>{progressPercentage}%</Text>
              </div>
              <Progress value={progressPercentage} className='w-full' />
            </div>
            {downloadComplete && (
              <div className='flex justify-end pt-2'>
                <Button onClick={handleCloseDialog}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className='space-y-6'>
        <Text variant='hd-lg' className={`fade-in-from-top ${getDelayClass(1)}`}>
          {startIndex > 0 ? 'More Images from' : 'Images from'} Google Drive
        </Text>

        {/* Bulk Actions Bar - Always visible */}
        {images.length > 0 && (
          <div
            className={`flex items-center justify-between w-full gap-2 fade-in-from-top
            ${getDelayClass(4)}`}
          >
            <label className='flex items-center gap-2 cursor-pointer'>
              <Checkbox
                checked={selectedIds.size === images.length && images.length > 0}
                onCheckedChange={handleSelectAll}
                disabled={isDownloading}
              >
                <CheckboxIndicator />
              </Checkbox>
              <Text variant='bd-sm'>Select All</Text>
            </label>
            {selectedIds.size > 0 && (
              <Button
                variant='default'
                size='sm'
                onClick={handleBulkDownload}
                disabled={isDownloading}
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
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {images.map((image, index) => {
            const globalIndex = startIndex + index;
            const hasFailed = failedImages.has(image.id);

            return (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded bg-muted ${
                  isMobile ? '' : 'cursor-pointer'
                } fade-in-from-top
                ${getDelayClass(globalIndex + 5)}`}
                onClick={isMobile ? undefined : () => onImageClick(globalIndex)}
              >
                <div className='relative aspect-16/10 overflow-hidden bg-muted'>
                  {hasFailed ? (
                    <div
                      className='flex h-full flex-col items-center justify-center gap-2'
                    >
                      <ImageOff className='w-8 h-8 text-muted-foreground' />
                      <Text variant='muted-sm'>Failed to load</Text>
                    </div>
                  ) : image.image_url ? (
                    <OptimizedImageWithLoading
                      src={`/api/v1/proxy-image?url=${encodeURIComponent(image.image_url)}`}
                      alt={`${collectionTitle} - Google Drive Photo ${index + 1}`}
                      fill
                      className='object-cover hover:scale-105 transition-transform
                        duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      loading='lazy'
                      unoptimized
                      onError={() => handleImageError(image.id)}
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center'>
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
                      disabled={isDownloading}
                      variant='overlay'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
