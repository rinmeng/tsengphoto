import { useState } from 'react';

/**
 * Detects if the user is on an actual mobile/tablet device
 * (iPhone, iPad, Android) based on user agent, not screen size.
 * Use this for feature detection (e.g., disabling memory-intensive operations).
 * For responsive UI, use useIsMobile() instead.
 */
export function useMobileDevice() {
  const [isMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent;
    const mobileRegex = /iPhone|iPad|iPod|Android/i;
    return mobileRegex.test(userAgent);
  });

  return isMobileDevice;
}
