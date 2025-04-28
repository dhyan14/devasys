import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get('token')?.value || '';

  // Redirect to login if accessing protected routes without authentication
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already authenticated, redirect away from login/register
  if (isPublicPath && token) {
    try {
      const payload = await verifyToken(token);
      if (payload) {
        const role = payload.role as string;
        // Redirect to role-specific dashboard
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
    // Fallback to generic dashboard if role verification fails
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Role-based access control
  if (token && !isPublicPath) {
    const payload = await verifyToken(token);
    if (!payload) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    const role = payload.role as string;

    // Dashboard redirection
    if (path === '/dashboard') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    // Admin routes
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    // Faculty routes
    if (path.startsWith('/faculty') && role !== 'faculty') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    // Student routes
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    // Parent routes
    if (path.startsWith('/parent') && role !== 'parent') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }
  }

  return NextResponse.next();
}

// Segment config to prevent middleware from running on API routes
export const config = {
  matcher: [
    // Exclude all API routes from middleware
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/admin/:path*',
    '/faculty/:path*',
    '/student/:path*',
    '/parent/:path*',
    '/login',
    '/register',
  ],
}; 