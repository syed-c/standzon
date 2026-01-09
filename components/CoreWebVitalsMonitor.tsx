'use client';

import { useEffect } from 'react';

// Component to monitor and report Core Web Vitals
export default function CoreWebVitalsMonitor() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Log Core Web Vitals to console in development
        if (process.env.NODE_ENV === 'development') {
          getCLS((metric) => console.log('CLS:', metric));
          getFID((metric) => console.log('FID:', metric));
          getFCP((metric) => console.log('FCP:', metric));
          getLCP((metric) => console.log('LCP:', metric));
          getTTFB((metric) => console.log('TTFB:', metric));
        }

        // Send to analytics in production
        if (process.env.NODE_ENV === 'production') {
          const sendToAnalytics = (metric: any) => {
            // Send metric to your analytics endpoint
            // Example: fetch('/api/web-vitals', { method: 'POST', body: JSON.stringify(metric) })
          };

          getCLS(sendToAnalytics);
          getFID(sendToAnalytics);
          getFCP(sendToAnalytics);
          getLCP(sendToAnalytics);
          getTTFB(sendToAnalytics);
        }
      }).catch(error => {
        console.warn('Could not load web-vitals:', error);
      });
    }
  }, []);

  return null;
}