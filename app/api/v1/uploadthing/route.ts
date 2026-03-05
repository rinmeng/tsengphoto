import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

export const runtime = 'nodejs';

const handlers = createRouteHandler({
  router: ourFileRouter,
});

export async function GET(req: NextRequest) {
  console.log('[UploadThing] GET called - URL:', req.url);
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  console.log('[UploadThing] POST called - URL:', req.url);
  const result = await handlers.POST(req);
  console.log('[UploadThing] POST completed - Status:', result.status);
  return result;
}
