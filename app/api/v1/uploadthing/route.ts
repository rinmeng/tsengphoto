import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max for serverless function

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Debug',
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
  console.warn('[UploadThing] Host:', req.headers.get('host'));
  console.warn('[UploadThing] VERCEL_URL:', process.env.VERCEL_URL || 'NOT SET');
  console.warn(
    '[UploadThing] NEXT_PUBLIC_SITE_URL:',
    process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'
  );
  const result = await handlers.POST(req);
  console.warn('[UploadThing] POST completed - Status:', result.status);
  return result;
}
