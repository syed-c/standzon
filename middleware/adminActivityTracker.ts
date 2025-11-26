import { NextRequest, NextResponse } from 'next/server';

export async function trackAdminActivity(request: NextRequest) {
  // Only track admin pages
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return;
  }

  // Skip login and API routes
  if (request.nextUrl.pathname.startsWith('/admin/login') || 
      request.nextUrl.pathname.startsWith('/admin/logout') ||
      request.nextUrl.pathname.startsWith('/api')) {
    return;
  }

  try {
    // Get session ID from cookie
    const adminAuthCookie = request.cookies.get('admin_auth')?.value;
    const sessionId = typeof window !== 'undefined' ? localStorage.getItem('adminSessionId') : null;
    
    if (adminAuthCookie && sessionId) {
      // Update session with page visit
      const response = await fetch(`${request.nextUrl.origin}/api/admin/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add-page-visit',
          data: {
            sessionId,
            url: request.nextUrl.pathname
          }
        }),
      });
      
      if (!response.ok) {
        console.warn('Failed to track page visit:', response.statusText);
      }
    }
  } catch (error) {
    console.warn('Error tracking admin activity:', error);
  }
}