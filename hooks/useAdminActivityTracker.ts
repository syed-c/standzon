'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAdminActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track admin pages
    if (!pathname || !pathname.startsWith('/admin')) {
      return;
    }

    // Skip login and logout routes
    if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')) {
      return;
    }

    const trackPageVisit = async () => {
      try {
        // Get session ID from localStorage
        const sessionId = typeof window !== 'undefined' ? localStorage.getItem('adminSessionId') : null;
        
        if (sessionId) {
          // Update session with page visit
          const response = await fetch('/api/admin/activities', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'add-page-visit',
              data: {
                sessionId,
                url: pathname
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
    };

    trackPageVisit();
  }, [pathname]);
}