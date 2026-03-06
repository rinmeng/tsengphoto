'use client';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

interface CollectionImage {
  id: string;
  image_url: string | null;
  order?: number | null;
}

interface CollectionImageViewerProps {
  images: CollectionImage[];
  collectionTitle: string;
}

export function CollectionImageViewer({
  images,
  collectionTitle,
}: CollectionImageViewerProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  return (
    <>
      {/* Image Gallery Grid */}
      <div className='space-y-6'>
        {sortedImages.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden rounded bg-muted cursor-pointer
                  fade-in-from-bottom ${getDelayClass(index)}`}
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
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center'>
                      <Text variant='muted'>No image</Text>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <Text variant='muted'>No images in this collection</Text>
          </div>
        )}
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          className='w-full sm:w-[90%] h-auto p-5 sm:max-w-none overflow-hidden flex
            flex-col'
        >
          {rotatedImageUrls.length > 0 && (
            <PhotoCarousel
              images={rotatedImageUrls}
              autoplayDelay={0}
              itemsToShow={1}
              btnVariant='ghost'
              btnLocation='below-carousel'
              dotsLocation='below-carousel'
              fullWidth={true}
              className='w-full flex-1 min-h-0 mt-6'
              itemClassName='aspect-video max-h-[calc(90vh-8rem)]'
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
