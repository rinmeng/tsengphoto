import { NextResponse } from 'next/server';

// REMOVE THIS FILE AFTER DEBUGGING
export async function GET() {
  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    hasVercelUrl: !!process.env.VERCEL_URL,
    vercelUrl: process.env.VERCEL_URL,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasPublishableKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasUploadthingSecret: !!process.env.UPLOADTHING_TOKEN,
    hasUploadthingAppId: !!process.env.UPLOADTHING_APP_ID,
  });
}
