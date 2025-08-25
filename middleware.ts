import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect UAE routes to United Arab Emirates
  if (pathname.startsWith('/exhibition-stands/uae')) {
    const newPathname = pathname.replace('/exhibition-stands/uae', '/exhibition-stands/united-arab-emirates')
    return NextResponse.redirect(new URL(newPathname, request.url))
  }

  // Also handle root /uae redirects
  if (pathname === '/uae') {
    return NextResponse.redirect(new URL('/united-arab-emirates', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/exhibition-stands/uae/:path*',
    '/uae/:path*'
  ]
}