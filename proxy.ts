import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/proxy';

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // Skip middleware for UploadThing API routes (they handle their own callbacks)
  if (nextUrl.pathname.startsWith('/api/v1/uploadthing')) {
    return;
  }

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

// Export as default for Next.js middleware
export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * Always run for API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/(api|trpc)(.*)',
  ],
};
