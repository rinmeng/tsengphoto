'use client';
import { Text } from '@/components/Text';
import { useImageOptimization } from '@/contexts/ImageOptimizationContext';
import { getDelayClass } from '@/utils/animations';
import { Loader2 } from 'lucide-react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends ImageProps {
  showLoading?: boolean | 'spinner-only';
}

/**
 * Wrapper around Next.js Image that automatically falls back to unoptimized
 * images when Vercel returns 402 (billing limit exceeded).
 * Uses global state to avoid retrying optimization after first 402.
 *
 * @param showLoading - If true, shows a loading spinner and text while the image loads
 */
export function OptimizedImage({ showLoading = false, ...props }: OptimizedImageProps) {
  const { isOptimizationDisabled, disableOptimization } = useImageOptimization();
  const [localUnoptimized, setLocalUnoptimized] = useState(false);
  const [isLoading, setIsLoading] = useState(showLoading);

  const handleError: ImageProps['onError'] = (error) => {
    // Disable optimization globally so all subsequent images skip optimization
    if (!isOptimizationDisabled) {
      disableOptimization();
    }
    setLocalUnoptimized(true);
    setIsLoading(false);

    // Call the original onError if provided
    props.onError?.(error);
  };

  const handleLoad: ImageProps['onLoad'] = (result) => {
    setIsLoading(false);

    // Call the original onLoad if provided
    props.onLoad?.(result);
  };

  const imageElement = (
    <Image
      {...props}
      alt={props.alt || ''}
      unoptimized={props.unoptimized || isOptimizationDisabled || localUnoptimized}
      onError={handleError}
      onLoad={handleLoad}
    />
  );

  if (!showLoading) {
    return imageElement;
  }

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
          {showLoading !== 'spinner-only' && (
            <Text
              variant='bd-xs'
              className={`text-center text-white fade-in-from-bottom ${getDelayClass(3)}`}
            >
              We&apos;re fetching the highest quality possible...
            </Text>
          )}
        </div>
      )}
      {imageElement}
    </div>
  );
}
