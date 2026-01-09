'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import non-critical components with no SSR
const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), { ssr: false });
const CoreWebVitalsMonitor = dynamic(() => import('./CoreWebVitalsMonitor'), { ssr: false });
const ServiceWorkerRegistration = dynamic(() => import('./ServiceWorkerRegistration'), { ssr: false });

export default function DeferredMonitoring() {
  useEffect(() => {
    // Only render these components after a delay to avoid impacting initial render
    const timer = setTimeout(() => {
      // Components will be rendered by Next.js dynamic import
    }, 3000); // Wait 3 seconds after initial render

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PerformanceMonitor />
      <CoreWebVitalsMonitor />
      <ServiceWorkerRegistration />
    </>
  );
}