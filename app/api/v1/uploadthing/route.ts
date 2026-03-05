import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    // Only set callbackUrl for Vercel deployments, let UploadThing use polling for local dev
    ...(process.env.VERCEL_URL && {
      callbackUrl: `https://${process.env.VERCEL_URL}/api/v1/uploadthing`,
    }),
  },
});
