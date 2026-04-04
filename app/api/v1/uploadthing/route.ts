import { NextRequest } from 'next/server';
import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Increase timeout for uploadthing callbacks (default is 10s on Vercel)
export const maxDuration = 60;

const handlers = createRouteHandler({
  router: ourFileRouter,
});

export async function GET(req: NextRequest) {
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  return handlers.POST(req);
}
