'use client';
import { useState } from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Button } from '@/components/animate-ui/components/button';
import { Spinner } from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import { Trash2 } from 'lucide-react';
import type { CollectionImage } from '@/lib/types';

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
}: UserUploadedImagesProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  return (
    <div className='space-y-6'>
      {/* Bulk Actions Bar */}
      {images.length > 0 && isAuthenticated && (
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
                <OptimizedImage
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

              {/* Controls (only when authenticated) */}
              {isAuthenticated && (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
