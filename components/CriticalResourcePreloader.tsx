'use client';

import { useEffect } from 'react';

export default function CriticalResourcePreloader() {
  useEffect(() => {
    // ✅ PERFORMANCE: Preload critical resources immediately
    const preloadCriticalResources = () => {
      // Preload critical API endpoints
      const criticalAPIs = [
        '/api/admin/pages-editor?action=get-content&path=%2F',
        '/api/admin/footer',
        '/api/admin/builders?limit=100&prioritize_real=true'
      ];

      criticalAPIs.forEach(api => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = api;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Avoid preloading non-existent chunk paths which caused 404s during dev
    };

    // Run immediately
    preloadCriticalResources();

    // Also run after a short delay to ensure DOM is ready
    setTimeout(preloadCriticalResources, 100);
  }, []);

  return null;
}
