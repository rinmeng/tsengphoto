import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    callbackUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/api/v1/uploadthing`,
  },
});
