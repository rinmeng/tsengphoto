'use client';
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * Wrapper around Next.js Image that automatically falls back to unoptimized
 * images when Vercel returns 402 (billing limit exceeded).
 */
export function OptimizedImage(props: ImageProps) {
  const [useUnoptimized, setUseUnoptimized] = useState(false);

  const handleError: ImageProps['onError'] = (error) => {
    // Fall back to unoptimized on any error (including 402)
    setUseUnoptimized(true);

    // Call the original onError if provided
    props.onError?.(error);
  };

  return (
    <Image
      {...props}
      alt={props.alt || ''}
      unoptimized={props.unoptimized || useUnoptimized}
      onError={handleError}
    />
  );
}
