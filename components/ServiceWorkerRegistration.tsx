'use client';

import { useEffect, useState } from 'react';

// IndexedDB helper for caching dynamic data
class IndexedDBCache {
  private dbName: string;
  private version: number;
  
  constructor(dbName: string = 'StandsZoneDB', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }
  
  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('pages')) {
          const store = db.createObjectStore('pages', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('recentlyVisited')) {
          const store = db.createObjectStore('recentlyVisited', { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }
  
  async savePage(url: string, content: string): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['pages'], 'readwrite');
      const store = transaction.objectStore('pages');
      
      await store.put({
        url,
        content,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Failed to save page to IndexedDB:', error);
    }
  }
  
  async getPage(url: string): Promise<string | null> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['pages'], 'readonly');
      const store = transaction.objectStore('pages');
      
      const request = store.get(url);
      const result = await new Promise<any>((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
      
      return result ? result.content : null;
    } catch (error) {
      console.warn('Failed to get page from IndexedDB:', error);
      return null;
    }
  }
  
  async saveUserPreference(key: string, value: any): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');
      
      await store.put({
        key,
        value,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Failed to save user preference:', error);
    }
  }
  
  async getUserPreference(key: string): Promise<any> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      
      const request = store.get(key);
      const result = await new Promise<any>((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
      
      return result ? result.value : null;
    } catch (error) {
      console.warn('Failed to get user preference:', error);
      return null;
    }
  }
  
  async addRecentlyVisited(url: string, title: string): Promise<void> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['recentlyVisited'], 'readwrite');
      const store = transaction.objectStore('recentlyVisited');
      
      // Keep only the last 50 visited pages
      const allPages = await new Promise<any[]>((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
      
      if (allPages.length >= 50) {
        // Delete oldest entries
        const sorted = allPages.sort((a, b) => a.timestamp - b.timestamp);
        const toDelete = sorted.slice(0, allPages.length - 49);
        
        await Promise.all(toDelete.map(page => 
          new Promise<void>((resolve) => {
            const deleteRequest = store.delete(page.url);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => resolve();
          })
        ));
      }
      
      await store.put({
        url,
        title,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Failed to add recently visited page:', error);
    }
  }
  
  async getRecentlyVisited(limit: number = 10): Promise<any[]> {
    try {
      const db = await this.init();
      const transaction = db.transaction(['recentlyVisited'], 'readonly');
      const store = transaction.objectStore('recentlyVisited');
      const index = store.index('timestamp');
      
      const request = index.getAll(null, limit);
      const result = await new Promise<any[]>((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
      
      // Sort by timestamp descending
      return result.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.warn('Failed to get recently visited pages:', error);
      return [];
    }
  }
}

export default function ServiceWorkerRegistration() {
  const [isOnline, setIsOnline] = useState(true);
  const [indexedDB, setIndexedDB] = useState<IndexedDBCache | null>(null);
  
  useEffect(() => {
    // Initialize IndexedDB
    const db = new IndexedDBCache();
    setIndexedDB(db);
    
    // Set up online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Only register SW in production; in dev/unset, unregister to avoid stale chunks
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        navigator.serviceWorker.getRegistrations?.().then(regs => 
          regs.forEach(r => {
            r.unregister().catch(() => {});
            console.log('🧹 Unregistered service worker in development');
          })
        );
        return;
      }
      
      const registerSW = async () => {
        try {
          // Force clear all caches in development
          if (!isProd) {
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              await Promise.all(cacheNames.map(name => caches.delete(name)));
              console.log('🧹 Cleared all caches in development');
            }
          }
          
          // Unregister any existing service workers first
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
          
          // Register the new service worker
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
                  console.log('🔄 New service worker available, skipping waiting...');
                  // Force the new service worker to activate immediately
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
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
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Provide IndexedDB access to the rest of the app
  useEffect(() => {
    if (indexedDB) {
      (window as any).indexedDBCache = indexedDB;
    }
  }, [indexedDB]);
  
  return null; // This component doesn't render anything
}