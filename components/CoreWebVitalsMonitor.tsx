'use client';

import { useEffect } from 'react';

// Component to monitor and report Core Web Vitals
export default function CoreWebVitalsMonitor() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        // Log Core Web Vitals to console in development
        if (process.env.NODE_ENV === 'development') {
          onCLS((metric: any) => console.log('CLS:', metric));
          onINP((metric: any) => console.log('INP:', metric));
          onFCP((metric: any) => console.log('FCP:', metric));
          onLCP((metric: any) => console.log('LCP:', metric));
          onTTFB((metric: any) => console.log('TTFB:', metric));
        }

        // Send to analytics in production
        if (process.env.NODE_ENV === 'production') {
          const sendToAnalytics = (metric: any) => {
            // Send metric to your analytics endpoint
          };

          onCLS(sendToAnalytics);
          onINP(sendToAnalytics);
          onFCP(sendToAnalytics);
          onLCP(sendToAnalytics);
          onTTFB(sendToAnalytics);
        }
      }).catch(error => {
        console.warn('Could not load web-vitals:', error);
      });
    }
  }, []);

  return null;
}