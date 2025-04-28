import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

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

    // Admin routes
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Faculty routes
    if (path.startsWith('/faculty') && role !== 'faculty') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Student routes
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Parent routes
    if (path.startsWith('/parent') && role !== 'parent') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/faculty/:path*',
    '/student/:path*',
    '/parent/:path*',
    '/login',
    '/register',
    '/api/:path*',
  ],
}; 