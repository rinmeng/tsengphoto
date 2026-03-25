'use client';
import { useState, useEffect } from 'react';
import { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

/**
 * Wrapper around OptimizedImage that shows loading UI.
 * - Blur background appears immediately when loading starts
 * - Loader + text only appear after 1 second (prevents flash for fast loads)
 * - Used for PhotoCarousel and ImageViewer
 */
export function OptimizedImageWithLoading(props: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingUI, setShowLoadingUI] = useState(false);

  // Only show loading UI if image takes more than 1 second to load
  useEffect(() => {
    if (!isLoading) {
      const resetTimer = setTimeout(() => setShowLoadingUI(false), 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(() => {
      setShowLoadingUI(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading]);

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
          className='absolute inset-0 z-10 bg-black/50 backdrop-blur-md flex flex-col
            items-center justify-center'
        >
          {showLoadingUI && (
            <>
              <Loader2
                className={`size-8 animate-spin text-primary mb-3 fade-in-from-bottom
                ${getDelayClass(1)}`}
              />
              <Text
                variant='bd-md'
                className={`text-center text-white fade-in-from-bottom
                ${getDelayClass(2)}`}
              >
                We&apos;re fetching the highest quality possible...
              </Text>
            </>
          )}
        </div>
      )}
      <OptimizedImage {...props} onLoad={handleLoad} onError={handleError} />
    </div>
  );
}
