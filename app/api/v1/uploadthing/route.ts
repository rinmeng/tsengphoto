import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

export const runtime = 'nodejs';

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/v1/uploadthing`
      : undefined,
    isDev: !process.env.VERCEL_URL, // Dev mode only for local
  },
});

export async function GET(req: NextRequest) {
  console.log('[UploadThing] GET called - URL:', req.url);
  console.log('[UploadThing] VERCEL_URL:', process.env.VERCEL_URL);
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  console.log('[UploadThing] POST called - URL:', req.url);
  console.log(
    '[UploadThing] Callback URL configured:',
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/v1/uploadthing`
      : 'undefined (local dev mode)'
  );
  const result = await handlers.POST(req);
  console.log('[UploadThing] POST completed - Status:', result.status);
  return result;
}
