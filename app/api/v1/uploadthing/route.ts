import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max for serverless function

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Debug',
    // Only set callback for production, let it auto-detect/poll for dev
    ...(process.env.VERCEL_URL && {
      callbackUrl: `https://${process.env.VERCEL_URL}/api/v1/uploadthing`,
    }),
  },
});

export async function GET(req: NextRequest) {
  console.warn('[UploadThing] ===== GET REQUEST =====');
  console.warn('[UploadThing] URL:', req.url);
  console.warn('[UploadThing] VERCEL_URL:', process.env.VERCEL_URL || 'NOT SET');
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  console.warn('[UploadThing] ===== POST REQUEST =====');
  console.warn('[UploadThing] URL:', req.url);
  console.warn('[UploadThing] VERCEL_URL:', process.env.VERCEL_URL || 'NOT SET');
  if (process.env.VERCEL_URL) {
    console.warn(
      '[UploadThing] Callback URL:',
      `https://${process.env.VERCEL_URL}/api/v1/uploadthing`
    );
  }
  const result = await handlers.POST(req);
  console.warn('[UploadThing] POST completed - Status:', result.status);
  return result;
}
