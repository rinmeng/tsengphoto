import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Error',
  },
});

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
