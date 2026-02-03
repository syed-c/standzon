'use client';

import { useEffect } from 'react';

// ✅ PERFORMANCE: Type definitions for performance monitoring
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  interface PerformanceEntry {
    hadRecentInput?: boolean;
    value?: number;
    processingStart?: number;
    loadEventEnd?: number;
    fetchStart?: number;
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // ✅ PERFORMANCE: Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor First Contentful Paint (FCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('🎨 First Contentful Paint:', entry.startTime, 'ms');
            
            // Send to analytics if needed
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FCP',
                value: Math.round(entry.startTime),
                event_category: 'Web Vitals',
                event_label: 'Performance'
              });
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🖼️ Largest Contentful Paint:', lastEntry.startTime, 'ms');
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals',
            event_label: 'Performance'
          });
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value || 0;
          }
        }
        console.log('📐 Cumulative Layout Shift:', clsValue);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000) / 1000,
            event_category: 'Web Vitals',
            event_label: 'Performance'
          });
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      
      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          console.log('⚡ First Input Delay:', fid, 'ms');
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(fid),
              event_category: 'Web Vitals',
              event_label: 'Performance'
            });
          }
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Monitor Time to Interactive (TTI)
      const ttiObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const tti = (entry as any).loadEventEnd - (entry as any).fetchStart;
            console.log('🚀 Time to Interactive:', tti, 'ms');
            
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'TTI',
                value: Math.round(tti),
                event_category: 'Web Vitals',
                event_label: 'Performance'
              });
            }
          }
        }
      });
      
      ttiObserver.observe({ entryTypes: ['navigation'] });
      
      // Cleanup observers
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
        ttiObserver.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
