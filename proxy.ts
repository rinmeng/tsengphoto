import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // Skip middleware for API routes that handle their own auth
  if (nextUrl.pathname.startsWith('/api/v1/uploadthing')) {
    console.warn('[Proxy] SKIPPING middleware for UploadThing:', nextUrl.pathname);
    return NextResponse.next();
  }

  console.log('[Proxy] Running middleware for:', nextUrl.pathname);
  const { user, supabaseResponse } = await updateSession(request);

  const pathname = nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/admin'];
  const authRoutes = ['/login'];

  // Check if user is trying to access a protected route without being logged in
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Protect /auth/result success page (but allow error display)
  if (!user && pathname === '/auth/result') {
    const url = request.nextUrl.clone();
    const success = url.searchParams.get('success');
    if (success === 'true') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Check if logged-in user is trying to access auth routes (like login page)
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next internals
     * - static files
     * - /api/v1/uploadthing (UploadThing callbacks)
     */
    '/((?!_next|api/v1/uploadthing|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
