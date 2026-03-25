'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import type { CollectionImage } from '@/lib/types';

interface DriveImagesProps {
  images: CollectionImage[];
  driveLink?: string | null;
  collectionTitle: string;
  onImageClick: (index: number) => void;
  startIndex?: number;
}

export function DriveImages({
  images,
  collectionTitle,
  onImageClick,
  startIndex = 0,
}: DriveImagesProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageId: string) => {
    setFailedImages((prev) => new Set(prev).add(imageId));
  };

  return (
    <div className='space-y-6'>
      <Text variant='hd-lg' className={`fade-in-from-top ${getDelayClass(1)}`}>
        {startIndex > 0 ? 'More Images from' : 'Images from'} Google Drive
      </Text>

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
                  <Image
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
