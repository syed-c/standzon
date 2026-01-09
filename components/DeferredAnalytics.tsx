'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import analytics components with no SSR
const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(mod => mod.Analytics),
  { ssr: false }
);

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights),
  { ssr: false }
);

export default function DeferredAnalytics() {
  useEffect(() => {
    // Optional: Load after a delay
    const timer = setTimeout(() => {
      // Analytics will be loaded when component mounts
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}