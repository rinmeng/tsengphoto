'use client';
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { useImageOptimization } from '@/contexts/ImageOptimizationContext';

/**
 * Wrapper around Next.js Image that automatically falls back to unoptimized
 * images when Vercel returns 402 (billing limit exceeded).
 * Uses global state to avoid retrying optimization after first 402.
 */
export function OptimizedImage(props: ImageProps) {
  const { isOptimizationDisabled, disableOptimization } = useImageOptimization();
  const [localUnoptimized, setLocalUnoptimized] = useState(false);

  const handleError: ImageProps['onError'] = (error) => {
    // Disable optimization globally so all subsequent images skip optimization
    if (!isOptimizationDisabled) {
      disableOptimization();
    }
    setLocalUnoptimized(true);

    // Call the original onError if provided
    props.onError?.(error);
  };

  return (
    <Image
      {...props}
      alt={props.alt || ''}
      unoptimized={props.unoptimized || isOptimizationDisabled || localUnoptimized}
      onError={handleError}
    />
  );
}
