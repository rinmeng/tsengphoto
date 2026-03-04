import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    callbackUrl:
      process.env.NODE_ENV === 'production'
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/uploadthing`
        : undefined,
  },
});
