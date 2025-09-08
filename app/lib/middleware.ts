import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from './auth';

// Protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/admin/homepage',
  '/admin/articles',
  '/admin/logos',
  '/admin/media',
  '/admin/pages',
  '/admin/services',
  '/admin/settings'
];

// Admin-only routes
const adminRoutes = [
  '/admin',
  '/admin/homepage',
  '/admin/articles',
  '/admin/logos',
  '/admin/media',
  '/admin/pages',
  '/admin/services',
  '/admin/settings'
];

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get user from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const sessionData = AuthService.verifyToken(token);
    
    if (!sessionData) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check admin permissions for admin routes
    if (isAdminRoute && sessionData.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Add user info to headers for use in components
    const response = NextResponse.next();
    response.headers.set('x-user-id', sessionData.user.id);
    response.headers.set('x-user-role', sessionData.user.role);
    
    return response;

  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}
