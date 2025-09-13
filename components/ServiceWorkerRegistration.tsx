'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // ✅ PERFORMANCE: Register service worker for aggressive caching
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
