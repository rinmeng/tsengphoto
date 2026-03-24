'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';
import type { CollectionImage } from '@/lib/types';

interface DriveImagesProps {
  images: CollectionImage[];
  driveLink?: string | null;
  collectionTitle: string;
  onImageClick: (index: number) => void;
  startIndex?: number; // Starting index for global navigation
}

export function DriveImages({
  images,
  driveLink,
  collectionTitle,
  onImageClick,
  startIndex = 0,
}: DriveImagesProps) {
  return (
    <div className='space-y-6'>
      {/* Section Header */}
      <Text variant='hd-lg' className='fade-in-from-bottom'>
        {startIndex > 0 ? 'More Images from' : 'Images from'}{' '}
        <Link
          href={driveLink || 'https://drive.google.com'}
          target='_blank'
          className='underline hover:text-primary hover:no-underline transition-all duration-200'
          rel='noopener noreferrer'
        >
          Google Drive
        </Link>
      </Text>

      {/* Images Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {images.map((image, index) => {
          const globalIndex = startIndex + index;
          return (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded bg-muted cursor-pointer
                fade-in-from-top ${getDelayClass(globalIndex + 5)}`}
              onClick={() => onImageClick(globalIndex)}
            >
              <div className='relative aspect-16/10 overflow-hidden bg-muted'>
                {image.image_url ? (
                  <Image
                    src={image.image_url}
                    alt={`${collectionTitle} - Google Drive Photo ${index + 1}`}
                    fill
                    className='object-cover hover:scale-105 transition-transform duration-300'
                    loading='lazy'
                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
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
