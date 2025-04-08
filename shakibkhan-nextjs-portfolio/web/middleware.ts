import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function verifyAccessToken(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-access`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('access_token')?.value || ''

  // Check if path starts with /auth
  const isAuthPath = path.startsWith('/auth')
  // Check if path starts with /admin/dashboard
  const isAdminDashboardPath = path.startsWith('/admin/dashboard')
  // Check if path is exactly /admin
  const isAdminPath = path === '/admin'

  // If not logged in
  if (!token) {
    // Allow access to auth paths
    if (isAuthPath) {
      return NextResponse.next()
    }
    // Redirect to auth for all other paths
    return NextResponse.redirect(new URL('/auth', request.nextUrl))
  }

  // If logged in, verify token
  const verificationResult = await verifyAccessToken(token)
  
  if (!verificationResult) {
    // Token is invalid
    const response = NextResponse.redirect(new URL('/auth', request.nextUrl))
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  const isAdmin = verificationResult.isAdmin

  // For logged-in users
  if (isAdmin) {
    // Admin can only access dashboard paths
    if (isAdminDashboardPath) {
      return NextResponse.next()
    }
    // Redirect admin to dashboard if trying to access /admin
    if (isAdminPath) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
    }
    // Redirect admin to dashboard if trying to access auth
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
    }
  } else {
    // Non-admin can only access /admin
    if (isAdminPath) {
      return NextResponse.next()
    }
    // Redirect non-admin to /admin if trying to access dashboard
    if (isAdminDashboardPath) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl))
    }
    // Redirect non-admin to /admin if trying to access auth
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl))
    }
  }

  // Default deny for any other paths
  return NextResponse.redirect(new URL('/auth', request.nextUrl))
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
}
