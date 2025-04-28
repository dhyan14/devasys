import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Export as Node.js runtime only
export const runtime = 'nodejs';

// Simple JWT verification without mongoose
async function verifyJWT(token: string): Promise<any> {
  try {
    // This is a basic verification that doesn't require mongoose
    // It checks if the token is in the expected format and not expired
    if (!token) return null;

    // If you're using jose, just use inline without mongoose dependency
    const jose = require('jose');
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'e654e574e8aa61f62a24b145ebad7fce36f17fbdf53120f91bf27434a4c7a2f9'
    );

    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register' || path === '/';
  const token = request.cookies.get('token')?.value || '';

  // Redirect to login if accessing protected routes without authentication
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already authenticated, redirect away from login/register
  if (isPublicPath && path !== '/' && token) {
    try {
      const payload = await verifyJWT(token);
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
    const payload = await verifyJWT(token);
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