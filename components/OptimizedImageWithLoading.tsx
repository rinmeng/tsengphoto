'use client';
import { useState } from 'react';
import { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

/**
 * Wrapper around OptimizedImage that shows loading UI.
 * - Blur background + loader + text appear immediately when loading starts
 * - Used for PhotoCarousel, ImageViewer, UploadsGallery, and collection images
 */
export function OptimizedImageWithLoading(props: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad: ImageProps['onLoad'] = (result) => {
    setIsLoading(false);

    // Call the original onLoad if provided
    props.onLoad?.(result);
  };

  const handleError: ImageProps['onError'] = (error) => {
    setIsLoading(false);

    // Call the original onError if provided
    props.onError?.(error);
  };

  return (
    <div className='relative w-full h-full'>
      {isLoading && (
        <div
          className={`absolute inset-0 z-10 bg-black/50 backdrop-blur-md flex flex-col
          items-center justify-center fade-in-from-bottom ${getDelayClass(1)}`}
        >
          <Loader2
            className={`size-8 animate-spin text-primary mb-3 fade-in-from-bottom
            ${getDelayClass(2)}`}
          />
          <Text
            variant='bd-md'
            className={`text-center text-white fade-in-from-bottom ${getDelayClass(3)}`}
          >
            We&apos;re fetching the highest quality possible...
          </Text>
        </div>
      )}
      <OptimizedImage {...props} onLoad={handleLoad} onError={handleError} />
    </div>
  );
}
