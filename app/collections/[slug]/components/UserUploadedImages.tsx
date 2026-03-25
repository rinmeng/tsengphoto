'use client';
import { useState } from 'react';
import { OptimizedImageWithLoading } from '@/components/OptimizedImageWithLoading';
import { Button } from '@/components/animate-ui/components/button';
import { Spinner } from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { Trash2, Download } from 'lucide-react';
import type { CollectionImage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface UserUploadedImagesProps {
  images: CollectionImage[];
  collectionTitle: string;
  isAuthenticated?: boolean;
  onImageClick: (index: number) => void;
  onDeleteImage: (imageId: string) => void;
  isDeletingImage?: boolean;
  onBulkDelete: (images: CollectionImage[]) => void;
  isBulkDeleting?: boolean;
  deletionProgress?: { current: number; total: number };
  downloadMode?: boolean;
}

export function UserUploadedImages({
  images,
  collectionTitle,
  isAuthenticated = false,
  onImageClick,
  onDeleteImage,
  isDeletingImage = false,
  onBulkDelete,
  isBulkDeleting = false,
  deletionProgress = { current: 0, total: 0 },
  downloadMode = false,
}: UserUploadedImagesProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDownloadIds, setSelectedDownloadIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

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

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    const selectedImages = images.filter((img) => selectedIds.has(img.id));
    onBulkDelete(selectedImages);
  };

  const handleDeleteClick = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    onDeleteImage(imageId);
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
    const selectedImages = images.filter((img) => selectedDownloadIds.has(img.id));
    setDownloadProgress({ current: 0, total: selectedImages.length });

    try {
      // If only one image, download directly without zipping
      if (selectedImages.length === 1) {
        const image = selectedImages[0];
        if (image.image_url) {
          const filename = `${collectionTitle.replace(/\s+/g, '_')}_1.jpg`;
          await downloadImage(image.image_url, filename);
          toast.success('Downloaded 1 image');
        }
      } else {
        // Multiple images - create a zip file
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
          // Generate zip and download
          const zipBlob = await zip.generateAsync({ type: 'blob' });
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
      setSelectedDownloadIds(new Set());
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Bulk Actions Bar for Delete (Admin only) */}
      {images.length > 0 && isAuthenticated && !downloadMode && (
        <div
          className={`flex items-center justify-between w-full gap-2 fade-in-from-top
          ${getDelayClass(4)}`}
        >
          <label className='flex items-center gap-2 cursor-pointer'>
            <Checkbox
              checked={selectedIds.size === images.length && images.length > 0}
              onCheckedChange={handleSelectAll}
              disabled={isBulkDeleting}
            >
              <CheckboxIndicator />
            </Checkbox>
            <Text variant='bd-sm'>Select All</Text>
          </label>
          {(selectedIds.size > 0 || isBulkDeleting) && (
            <Button
              variant='destructive'
              size='sm'
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
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
        </div>
      )}

      {/* Bulk Actions Bar for Download (Public) */}
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

      {/* Images Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`group relative overflow-hidden rounded bg-muted cursor-pointer
            fade-in-from-top ${getDelayClass(index + 5)}`}
            onClick={() => onImageClick(index)}
          >
            <div className='relative aspect-16/10 overflow-hidden bg-muted'>
              {image.image_url ? (
                <OptimizedImageWithLoading
                  src={image.image_url}
                  alt={`${collectionTitle} - Photo ${index + 1}`}
                  fill
                  className='object-cover hover:scale-105 transition-transform
                    duration-300'
                  loading='eager'
                  sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <Text variant='muted'>No image</Text>
                </div>
              )}

              {/* Controls (only when authenticated and not in download mode) */}
              {isAuthenticated && !downloadMode && (
                <>
                  <div className='absolute top-2 left-2 z-10'>
                    <Checkbox
                      checked={selectedIds.has(image.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(image.id, checked as boolean)
                      }
                      disabled={isBulkDeleting}
                      variant='overlay'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </div>
                  <div className='absolute top-2 right-2 z-10'>
                    <Button
                      variant='destructive'
                      size='icon'
                      onClick={(e) => handleDeleteClick(e, image.id)}
                      disabled={isDeletingImage || isBulkDeleting}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </>
              )}

              {/* Download mode controls (public) */}
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
        ))}
      </div>
    </div>
  );
}
