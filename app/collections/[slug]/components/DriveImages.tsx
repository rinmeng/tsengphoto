'use client';
import { useState } from 'react';
import { ImageOff, Download } from 'lucide-react';
import { Text } from '@/components/Text';
import { Button } from '@/components/animate-ui/components/button';
import { Spinner } from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { getDelayClass } from '@/utils/animations';
import type { CollectionImage } from '@/lib/types';
import { OptimizedImageWithLoading } from '@/components/OptimizedImageWithLoading';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface DriveImagesProps {
  images: CollectionImage[];
  driveLink?: string | null;
  collectionTitle: string;
  onImageClick: (index: number) => void;
  startIndex?: number;
  downloadMode?: boolean;
  driveFullQualityUrls?: string[];
}

export function DriveImages({
  images,
  collectionTitle,
  onImageClick,
  startIndex = 0,
  downloadMode = false,
  driveFullQualityUrls = [],
}: DriveImagesProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedDownloadIds, setSelectedDownloadIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  // Download handlers
  const handleSelectAllDownload = (checked: boolean) => {
    if (checked) {
      setSelectedDownloadIds(new Set(images.map((img) => img.id)));
    } else {
      setSelectedDownloadIds(new Set());
    }
  };

  const handleSelectOneDownload = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedDownloadIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedDownloadIds(newSelected);
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
    if (selectedDownloadIds.size === 0) return;

    setIsDownloading(true);

    // Create array of selected images with their indices for URL lookup
    const selectedImagesWithIndices = images
      .map((img, idx) => ({ img, idx }))
      .filter(({ img }) => selectedDownloadIds.has(img.id));

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
      setSelectedDownloadIds(new Set());
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className='space-y-6'>
      <Text variant='hd-lg' className={`fade-in-from-top ${getDelayClass(1)}`}>
        {startIndex > 0 ? 'More Images from' : 'Images from'} Google Drive
      </Text>

      {/* Bulk Actions Bar for Download */}
      {images.length > 0 && downloadMode && (
        <div
          className={`flex items-center justify-between w-full gap-2 fade-in-from-top
          ${getDelayClass(4)}`}
        >
          <label className='flex items-center gap-2 cursor-pointer'>
            <Checkbox
              checked={selectedDownloadIds.size === images.length && images.length > 0}
              onCheckedChange={handleSelectAllDownload}
              disabled={isDownloading}
            >
              <CheckboxIndicator />
            </Checkbox>
            <Text variant='bd-sm'>Select All</Text>
          </label>
          {(selectedDownloadIds.size > 0 || isDownloading) && (
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
                  <Download /> Download Selected ({selectedDownloadIds.size})
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
              className={`group relative overflow-hidden rounded bg-muted cursor-pointer
              fade-in-from-top ${getDelayClass(globalIndex + 5)}`}
              onClick={() => onImageClick(globalIndex)}
            >
              <div className='relative aspect-16/10 overflow-hidden bg-muted'>
                {hasFailed ? (
                  <div className='flex h-full flex-col items-center justify-center gap-2'>
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

                {/* Download mode controls */}
                {downloadMode && (
                  <div className='absolute top-2 left-2 z-10'>
                    <Checkbox
                      checked={selectedDownloadIds.has(image.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOneDownload(image.id, checked as boolean)
                      }
                      disabled={isDownloading}
                      variant='overlay'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
