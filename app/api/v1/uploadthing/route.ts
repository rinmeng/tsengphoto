import { createRouteHandler } from 'uploadthing/next';
import { NextRequest } from 'next/server';

import { ourFileRouter } from './core';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max for serverless function

// Get the correct callback URL - use production domain if available
const getCallbackUrl = () => {
  // In production, use the production domain
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
  ) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/uploadthing`;
  }
  // For preview deployments, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/v1/uploadthing`;
  }
  // Local development - no callback URL (uses polling)
  return undefined;
};

const callbackUrl = getCallbackUrl();

const handlers = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Debug',
    callbackUrl,
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
