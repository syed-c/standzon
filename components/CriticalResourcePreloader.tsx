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

      // Preload critical CSS chunks
      const criticalCSS = [
        '/_next/static/css/',
        '/_next/static/chunks/'
      ];

      criticalCSS.forEach(css => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = css;
        link.as = 'style';
        document.head.appendChild(link);
      });

      // Preload critical JavaScript chunks
      const criticalJS = [
        '/_next/static/chunks/webpack.js',
        '/_next/static/chunks/main.js',
        '/_next/static/chunks/pages/_app.js'
      ];

      criticalJS.forEach(js => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = js;
        link.as = 'script';
        document.head.appendChild(link);
      });
    };

    // Run immediately
    preloadCriticalResources();

    // Also run after a short delay to ensure DOM is ready
    setTimeout(preloadCriticalResources, 100);
  }, []);

  return null;
}
