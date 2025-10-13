'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register SW in production; in dev/unset, unregister to avoid stale chunks
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        navigator.serviceWorker.getRegistrations?.().then(regs => regs.forEach(r => r.unregister().catch(()=>{})));
        return;
      }
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });
          
          console.log('🚀 Service Worker registered successfully:', registration);
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New service worker available, reloading...');
                  window.location.reload();
                }
              });
            }
          });
          
        } catch (error) {
          console.warn('⚠️ Service Worker registration failed:', error);
        }
      };
      
      // Register after a short delay to not block initial render
      setTimeout(registerSW, 1000);
    }
  }, []);

  return null; // This component doesn't render anything
}
