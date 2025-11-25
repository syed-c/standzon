// ✅ PWA: Enhanced Service Worker with advanced caching strategies
const CACHE_VERSION = 'v2.0.2';
const CACHE_NAME = `standszon-${CACHE_VERSION}`;
const STATIC_CACHE = `standszon-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `standszon-dynamic-${CACHE_VERSION}`;
const PAGES_CACHE = `standszon-pages-${CACHE_VERSION}`;

// Maximum number of cache entries
const MAX_CACHE_ENTRIES = 1000;

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/zonelogo1.png'
];

// Routes that should use Network First strategy
const NETWORK_FIRST_ROUTES = [
  '/builders',
  '/exhibition-stands',
  '/exhibitions',
  '/locations',
  '/contact',
  '/about',
  '/services',
  '/api/'
];

// Routes that should use Stale-While-Revalidate strategy
const STALE_WHILE_REVALIDATE_ROUTES = [
  '/',
  '/blog',
  '/trade-shows'
];

// Routes that should use Cache First strategy
const CACHE_FIRST_ROUTES = [
  '/_next/static/',
  '/images/',
  '/icons/',
  '/fonts/'
];

// Initialize IndexedDB for storing dynamic data
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StandsZoneDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pages')) {
        const store = db.createObjectStore('pages', { keyPath: 'url' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('userPreferences')) {
        db.createObjectStore('userPreferences', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Save page to IndexedDB
const savePageToIndexedDB = async (url, content) => {
  try {
    const db = await initIndexedDB();
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
};

// Get page from IndexedDB
const getPageFromIndexedDB = async (url) => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(['pages'], 'readonly');
    const store = transaction.objectStore('pages');
    
    const request = store.get(url);
    const result = await new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
    
    return result ? result.content : null;
  } catch (error) {
    console.warn('Failed to get page from IndexedDB:', error);
    return null;
  }
};

// Queue request for background sync
const queueForSync = async (request) => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    // Clone the request to save it
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.body ? await request.clone().text() : null,
      timestamp: Date.now()
    };
    
    await store.add(requestData);
    console.log('Request queued for background sync:', requestData.url);
  } catch (error) {
    console.warn('Failed to queue request for sync:', error);
  }
};

// Process sync queue
const processSyncQueue = async () => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    const requests = await new Promise((resolve) => {
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => resolve([]);
    });
    
    // Process each queued request
    for (const requestData of requests) {
      try {
        const request = new Request(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        const response = await fetch(request);
        
        if (response.ok) {
          // Remove from queue if successful
          await store.delete(requestData.id);
          console.log('Successfully synced request:', requestData.url);
        } else {
          console.warn('Failed to sync request:', requestData.url);
        }
      } catch (error) {
        console.warn('Error syncing request:', requestData.url, error);
      }
    }
  } catch (error) {
    console.warn('Failed to process sync queue:', error);
  }
};

// Clean up old cache entries to maintain size limits
const cleanCache = async (cacheName, maxEntries) => {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      // Delete oldest entries
      const keysToDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(keysToDelete.map(key => cache.delete(key)));
      console.log(`🧹 Cleaned ${keysToDelete.length} old entries from ${cacheName}`);
    }
  } catch (error) {
    console.warn('Cache cleanup failed:', error);
  }
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Pre-cache key pages
      caches.open(PAGES_CACHE).then((cache) => {
        const keyPages = [
          '/builders',
          '/exhibition-stands',
          '/exhibitions',
          '/contact'
        ];
        console.log('📦 Pre-caching key pages...');
        return cache.addAll(keyPages);
      })
    ]).then(() => {
      console.log('✅ All critical resources cached');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old version caches
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Clean up caches to maintain size limits
      return Promise.all([
        cleanCache(STATIC_CACHE, MAX_CACHE_ENTRIES),
        cleanCache(DYNAMIC_CACHE, MAX_CACHE_ENTRIES),
        cleanCache(PAGES_CACHE, MAX_CACHE_ENTRIES)
      ]);
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Determine caching strategy based on URL
const getCacheStrategy = (url) => {
  const pathname = url.pathname;
  
  // Check for Network First routes
  if (NETWORK_FIRST_ROUTES.some(route => pathname.startsWith(route))) {
    return 'networkFirst';
  }
  
  // Check for Stale-While-Revalidate routes
  if (STALE_WHILE_REVALIDATE_ROUTES.some(route => pathname === route)) {
    return 'staleWhileRevalidate';
  }
  
  // Check for Cache First routes
  if (CACHE_FIRST_ROUTES.some(route => pathname.startsWith(route))) {
    return 'cacheFirst';
  }
  
  // Default to Network First for dynamic routes
  if (pathname.startsWith('/api/') || pathname.includes('/[id]') || pathname.includes('/[slug]')) {
    return 'networkFirst';
  }
  
  // Default to Stale-While-Revalidate for other pages
  return 'staleWhileRevalidate';
};

// Network First strategy
const networkFirst = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      
      // Also save to IndexedDB for offline access
      if (request.mode === 'navigate') {
        const content = await networkResponse.clone().text();
        await savePageToIndexedDB(request.url, content);
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try to get from IndexedDB for navigation requests
    if (request.mode === 'navigate') {
      const content = await getPageFromIndexedDB(request.url);
      if (content) {
        return new Response(content, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Return offline page
      return caches.match('/offline.html');
    }
    
    // For POST requests, queue for background sync
    if (request.method === 'POST') {
      await queueForSync(request);
      return new Response(JSON.stringify({ 
        message: 'Request queued for background sync', 
        queued: true 
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
};

// Cache First strategy
const cacheFirst = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // For navigation requests, try IndexedDB as last resort
    if (request.mode === 'navigate') {
      const content = await getPageFromIndexedDB(request.url);
      if (content) {
        return new Response(content, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      return caches.match('/offline.html');
    }
    
    throw error;
  }
};

// Stale-While-Revalidate strategy
const staleWhileRevalidate = async (request) => {
  const cachedResponse = await caches.match(request);
  
  // Immediately return cached response if available
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(
        request.mode === 'navigate' ? PAGES_CACHE : DYNAMIC_CACHE
      );
      cache.put(request, networkResponse.clone());
      
      // Also save to IndexedDB for navigation requests
      if (request.mode === 'navigate') {
        const content = await networkResponse.clone().text();
        await savePageToIndexedDB(request.url, content);
      }
    }
    
    return networkResponse;
  }).catch(async (error) => {
    // For navigation requests, try IndexedDB as last resort
    if (request.mode === 'navigate') {
      const content = await getPageFromIndexedDB(request.url);
      if (content) {
        return new Response(content, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    throw error;
  });
  
  // Return cached response immediately, or wait for network if no cache
  return cachedResponse || fetchPromise;
};

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests (except for background sync handling)
  if (request.method !== 'GET') {
    // For POST requests, queue for background sync but don't try to cache them
    if (request.method === 'POST') {
      event.respondWith(
        (async () => {
          try {
            const response = await fetch(request);
            return response;
          } catch (error) {
            // Queue for background sync when offline
            await queueForSync(request);
            return new Response(JSON.stringify({ 
              message: 'Request queued for background sync', 
              queued: true 
            }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        })()
      );
    }
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Skip requests for browser devtools
  if (request.headers.get('x-devtools-emulate-network-conditions-client-id')) {
    return;
  }
  
  // Skip requests for missing chunks (like main-app.js which may not exist)
  if (url.pathname.includes('main-app.js') || url.pathname.includes('/.well-known/')) {
    console.log('Skipping problematic request:', url.pathname);
    return;
  }
  
  // Determine strategy based on URL
  const strategy = getCacheStrategy(url);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case 'networkFirst':
            return await networkFirst(request);
          case 'cacheFirst':
            return await cacheFirst(request);
          case 'staleWhileRevalidate':
          default:
            return await staleWhileRevalidate(request);
        }
      } catch (error) {
        console.error('Fetch handler error:', error);
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        // Return a basic response for other requests
        return new Response('Network error occurred', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    // Handle offline form submissions, etc.
    event.waitUntil(handleBackgroundSync());
  }
  
  if (event.tag === 'sync-queue') {
    console.log('🔄 Processing sync queue');
    event.waitUntil(processSyncQueue());
  }
});

// Handle background sync operations
const handleBackgroundSync = async () => {
  // This would handle queued requests when coming back online
  console.log('Handling background sync operations');
  await processSyncQueue();
};

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.png',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If there's already a page open, focus it
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new page
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_QUEUE') {
    event.waitUntil(processSyncQueue());
  }
});