import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    // Let UploadThing auto-detect the callback URL - works better on Vercel
    // Manual callbackUrl can cause "Callback Failed" errors in serverless environments
  },
});
