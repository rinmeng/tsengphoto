import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Get the callback URL dynamically
const getCallbackUrl = () => {
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/v1/uploadthing`;
  }
  // Fallback to NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/uploadthing`;
  }
  // For local development, return undefined (uses default)
  return undefined;
};

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    callbackUrl: getCallbackUrl(),
  },
});
