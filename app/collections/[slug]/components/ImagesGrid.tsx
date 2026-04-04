'use client';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { Button } from '@/components/animate-ui/components/button';
import { Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CollectionImage } from '@/lib/types';
import { getDelayClass } from '@/utils/animations';
import { ImageOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Masonry from 'react-masonry-css';

interface ImagesGridProps {
  images: CollectionImage[];
  collectionTitle: string;
  onImageClick: (index: number) => void;
  source: 'uploaded' | 'drive';
  startIndex?: number;
  onDeleteImage?: (imageId: string) => void;
  isDeletingImage?: boolean;
  onBulkDelete?: (images: CollectionImage[]) => void;
  isBulkDeleting?: boolean;
  deletionProgress?: { current: number; total: number };
  maxColumns?: number;
  disableDownload?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

export function ImagesGrid({
  images,
  collectionTitle,
  onImageClick,
  source,
  startIndex = 0,
  onDeleteImage,
  isDeletingImage = false,
  onBulkDelete,
  isBulkDeleting = false,
  deletionProgress = { current: 0, total: 0 },
  maxColumns = 5,
  disableDownload = false,
  selectedIds = new Set<string>(),
  onSelectionChange,
}: ImagesGridProps) {
  const { isAuthenticated } = useAuth();
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const isDrive = source === 'drive';
  const isUploaded = source === 'uploaded';

  // Show selection UI only if user can download OR delete
  const canSelectImages = !disableDownload || (isAuthenticated && isUploaded);

  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(new Set(images.map((img) => img.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectionChange(newSelected);
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

  return (
    <div className='space-y-6'>
      {/* Title for Drive images */}
      {isDrive && (
        <Text variant='hd-lg' className={`fade-in-from-top ${getDelayClass(1)}`}>
          {startIndex > 0 ? 'More Images from' : 'Images from'} Google Drive
        </Text>
      )}

      {/* Bulk Actions Bar */}
      {images.length > 0 && canSelectImages && (
        <div
          className={`flex items-center justify-between w-full gap-2 fade-in-from-top
          ${getDelayClass(isDrive ? 4 : 1)}`}
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
          <div className='flex gap-2'>
            {/* Delete button - only for authenticated users on uploaded images */}
            {isAuthenticated && isUploaded && selectedIds.size > 0 && (
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
        </div>
      )}

      {/* Images Grid */}
      <Masonry
        breakpointCols={{
          default: maxColumns,
          1280: Math.min(maxColumns, 4),
          1024: Math.min(maxColumns, 3),
          768: 2,
          640: 1,
        }}
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
              ${getDelayClass(globalIndex)}`}
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
                    className='w-full h-auto rounded hover:scale-105 transition-transform
                      duration-300'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    loading='lazy'
                    showLoading='spinner-only'
                    onError={() => handleImageError(image.id)}
                  />
                ) : (
                  <div className='flex h-64 items-center justify-center bg-muted rounded'>
                    <Text variant='muted'>No image</Text>
                  </div>
                )}

                {/* Checkbox - Visible only if user can download or delete */}
                {canSelectImages && (
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
                )}

                {/* Individual Delete button - Only for authenticated users on uploaded images */}
                {isAuthenticated && isUploaded && (
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
                )}
              </div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
