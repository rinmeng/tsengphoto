'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/animate-ui/components/button';
import { Dialog, DialogClose, DialogContent, Spinner } from '@/components/ui';
import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/components';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { Text } from '@/components/Text';
import { EmptyState } from '@/components/EmptyState';
import { getDelayClass } from '@/utils/animations';
import { X, ImageOff, Trash2, Loader2, Upload } from 'lucide-react';
import type { CollectionImage } from '@/lib/types';

interface CollectionImageViewerProps {
  images: CollectionImage[];
  collectionTitle: string;
  isAuthenticated?: boolean;
  onDeleteImage?: (imageId: string) => void;
  isDeletingImage?: boolean;
  onBulkDelete?: (images: CollectionImage[]) => void;
  isBulkDeleting?: boolean;
  deletionProgress?: { current: number; total: number };
}

export function CollectionImageViewer({
  images,
  collectionTitle,
  isAuthenticated = false,
  onDeleteImage,
  isDeletingImage = false,
  onBulkDelete,
  isBulkDeleting = false,
  deletionProgress = { current: 0, total: 0 },
}: CollectionImageViewerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Extract and sort image URLs for the carousel
  const sortedImages = useMemo(
    () => images.sort((a, b) => (a.order || 0) - (b.order || 0)),
    [images]
  );

  const imageUrls = useMemo(
    () => sortedImages.map((img) => img.image_url).filter((url): url is string => !!url),
    [sortedImages]
  );

  // Rotate images array to start at selected index - only recalculate when index changes
  const rotatedImageUrls = useMemo(
    () => [
      ...imageUrls.slice(selectedImageIndex),
      ...imageUrls.slice(0, selectedImageIndex),
    ],
    [imageUrls, selectedImageIndex]
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    setImageToDelete(imageId);
  };

  const confirmDelete = () => {
    if (imageToDelete && onDeleteImage) {
      onDeleteImage(imageToDelete);
      setImageToDelete(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedImages.map((img) => img.id)));
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
    if (selectedIds.size === 0 || !onBulkDelete) return;
    const selectedImages = sortedImages.filter((img) => selectedIds.has(img.id));
    onBulkDelete(selectedImages);
  };

  return (
    <>
      {/* Image Gallery Grid */}
      <div className='flex flex-col space-y-6 min-h-[70vh]'>
        {/* Bulk Actions Bar */}
        {sortedImages.length > 0 && isAuthenticated && (
          <div
            className={`flex items-center justify-between w-full gap-2 fade-in-from-top
            ${getDelayClass(4)}`}
          >
            <label className='flex items-center gap-2 cursor-pointer'>
              <Checkbox
                checked={
                  selectedIds.size === sortedImages.length && sortedImages.length > 0
                }
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

        {sortedImages.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded bg-muted cursor-pointer
                  fade-in-from-top ${getDelayClass(index + 5)}`}
                onClick={() => handleImageClick(index)}
              >
                <div className={'relative aspect-16/10 overflow-hidden bg-muted'}>
                  {image.image_url ? (
                    <Image
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

                  {/* Checkbox and Delete button (only for authenticated users) */}
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
        ) : (
          <EmptyState
            className='h-full'
            bordered={true}
            icon={ImageOff}
            title='No images yet'
            description='This collection has no images. Check back later!'
            buttonIcon={Upload}
            buttonText='Upload Images'
          />
        )}
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          showCloseButton={false}
          className='w-full sm:w-[95%] h-auto p-0 sm:max-w-none overflow-hidden'
        >
          <DialogClose className='absolute top-2 right-2 z-10'>
            <Button variant='ghost' size='icon'>
              <X className='size-5' />
            </Button>
          </DialogClose>
          {rotatedImageUrls.length > 0 && (
            <PhotoCarousel
              images={rotatedImageUrls}
              autoplayDelay={0}
              itemsToShow={1}
              btnVariant='ghost'
              btnLocation='mb'
              dotsLocation='absolute'
              fullWidth={true}
              className='w-full flex-1 min-h-0'
              itemClassName='aspect-video max-h-[90vh]'
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogCancel disabled={isDeletingImage}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingImage}
              className='bg-destructive text-white hover:bg-destructive/90'
            >
              {isDeletingImage ? (
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
    </>
  );
}
