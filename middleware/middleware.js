// middleware.js
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the URL path
  const path = req.nextUrl.pathname;
  
  // Protected routes (add all your protected routes)
  const protectedRoutes = ['/dashboard', '/vehicles', '/bookings', '/customers', '/reports', '/settings'];
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Redirect logic
  if (!session && isProtectedRoute) {
    // Create a URL object for the login page
    const redirectUrl = new URL('/login', req.url);
    // Add the original URL as a parameter to redirect back after login
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (session && path === '/login') {
    // Redirect logged in users from login page to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};