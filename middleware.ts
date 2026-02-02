// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for the auth cookie
  const isAuthenticated = request.cookies.has('site_access')
  
  // If user is not authenticated and trying to access a protected page
  if (!isAuthenticated) {
    // Allow them to visit the login page
    if (request.nextUrl.pathname === '/login' || 
      request.nextUrl.pathname.includes('/follow-up')) {
      return NextResponse.next()
    }
    
    // Redirect all other requests to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user IS authenticated but tries to visit login, redirect to dashboard
  if (isAuthenticated && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)',
  ],
}