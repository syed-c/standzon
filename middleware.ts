import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin protection
  if (pathname.startsWith('/admin')) {
    const cookie = request.cookies.get('admin_auth')?.value
    const isApi = pathname.startsWith('/api')
    if (!cookie && !pathname.startsWith('/admin/login')) {
      const loginUrl = new URL('/admin/login', request.url)
      if (isApi) return NextResponse.json({ success:false, error:'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(loginUrl)
    }
  }

  // Builder dashboard protection - allow access for now, let frontend handle auth
  if (pathname.startsWith('/builder/dashboard')) {
    // Let the frontend component handle authentication
    // This prevents middleware from redirecting before localStorage is set
    return NextResponse.next()
  }

  // Redirect UAE routes to United Arab Emirates
  if (pathname.startsWith('/exhibition-stands/uae')) {
    const newPathname = pathname.replace('/exhibition-stands/uae', '/exhibition-stands/united-arab-emirates')
    return NextResponse.redirect(new URL(newPathname, request.url))
  }

  // Also handle root /uae redirects
  if (pathname === '/uae') {
    return NextResponse.redirect(new URL('/united-arab-emirates', request.url))
  }

  // Fix city slug inconsistencies
  if (pathname.includes('/abudhabi')) {
    const newPathname = pathname.replace('/abudhabi', '/abu-dhabi')
    return NextResponse.redirect(new URL(newPathname, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/builder/dashboard/:path*',
    '/exhibition-stands/uae/:path*',
    '/uae/:path*',
    '/exhibition-stands/:country/abudhabi',
    '/exhibition-stands/:country/abudhabi/:path*'
  ]
}