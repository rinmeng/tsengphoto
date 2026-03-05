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
    callbackUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/api/v1/uploadthing`,
  },
});
