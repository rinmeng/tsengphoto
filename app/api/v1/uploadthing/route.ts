import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Get the callback URL dynamically
const getCallbackUrl = () => {
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}/api/v1/uploadthing`;
    return url;
  }
  // Fallback to NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/uploadthing`;
    return url;
  }
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
