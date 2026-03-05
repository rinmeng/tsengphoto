import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Get the callback URL dynamically
const getCallbackUrl = () => {
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}/api/v1/uploadthing`;
    console.log('[UploadThing Route] Using VERCEL_URL callback:', url);
    return url;
  }
  // Fallback to NEXT_PUBLIC_SITE_URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/v1/uploadthing`;
    console.log('[UploadThing Route] Using NEXT_PUBLIC_SITE_URL callback:', url);
    return url;
  }
  // For local development, return undefined (uses default)
  console.log('[UploadThing Route] Using default callback (local dev)');
  return undefined;
};

console.log('[UploadThing Route] Initializing with environment:', {
  nodeEnv: process.env.NODE_ENV,
  hasVercelUrl: !!process.env.VERCEL_URL,
  hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: 'Info',
    callbackUrl: getCallbackUrl(),
  },
});
