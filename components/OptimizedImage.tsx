'use client';
import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';
import { useImageOptimization } from '@/contexts/ImageOptimizationContext';
import { Text } from '@/components/Text';
import { getDelayClass } from '@/utils/animations';

/**
 * Wrapper around Next.js Image that automatically falls back to unoptimized
 * images when Vercel returns 402 (billing limit exceeded).
 * Uses global state to avoid retrying optimization after first 402.
 * Shows loading state while image loads (only after 1 second to prevent flashing).
 */
export function OptimizedImage(props: ImageProps) {
  const { isOptimizationDisabled, disableOptimization } = useImageOptimization();
  const [localUnoptimized, setLocalUnoptimized] = useState(false);
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

  return (
    <>
      {showLoadingUI && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-10
          bg-black/50 backdrop-blur-md t200e`}
        >
          <div className={`fade-in-from-bottom ${getDelayClass(1)}`}>
            <Loader2
              className={`size-8 animate-spin text-primary mb-3 fade-in-from-bottom
              ${getDelayClass(1)}`}
            />
            <Text
              variant='bd-xs'
              className={`text-white fade-in-from-bottom ${getDelayClass(3)}`}
            >
              We&apos;re fetching the highest quality possible...
            </Text>
          </div>
        </div>
      )}
      <Image
        {...props}
        alt={props.alt || ''}
        unoptimized={props.unoptimized || isOptimizationDisabled || localUnoptimized}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
