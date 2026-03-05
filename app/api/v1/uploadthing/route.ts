import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Explicitly configure for Node.js runtime on Vercel
export const runtime = 'nodejs';
export const maxDuration = 60; // Max duration for callback processing

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    // Let UploadThing auto-detect the callback URL - works better on Vercel
    // Manual callbackUrl can cause "Callback Failed" errors in serverless environments
  },
});
