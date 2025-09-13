// ✅ PERFORMANCE: API Response Caching System
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from URL and params
  generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }
}

export const apiCache = new APICache();

// ✅ PERFORMANCE: Cached fetch function
export async function cachedFetch<T>(
  url: string, 
  options?: RequestInit, 
  ttl?: number
): Promise<T> {
  const cacheKey = apiCache.generateKey(url, options?.body ? JSON.parse(options.body as string) : undefined);
  
  // Check cache first
  const cached = apiCache.get<T>(cacheKey);
  if (cached) {
    console.log('🚀 Cache hit for:', url);
    return cached;
  }

  console.log('🌐 Fetching from API:', url);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache the response
  apiCache.set(cacheKey, data, ttl);
  
  return data;
}

// ✅ PERFORMANCE: Preload critical data
export async function preloadCriticalData() {
  const criticalEndpoints = [
    '/api/admin/footer',
    '/api/admin/builders?limit=100&prioritize_real=true',
  ];

  const preloadPromises = criticalEndpoints.map(endpoint => 
    cachedFetch(endpoint, { cache: 'no-store' }, 10 * 60 * 1000) // 10 minutes cache
  );

  try {
    await Promise.allSettled(preloadPromises);
    console.log('✅ Critical data preloaded');
  } catch (error) {
    console.warn('⚠️ Some critical data failed to preload:', error);
  }
}
