// Location page caching system for improved performance
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface LocationCacheData {
  builders: any[];
  statistics: {
    totalBuilders: number;
    verifiedBuilders: number;
    averageRating: number;
    totalProjects: number;
  };
  metadata: {
    country: string;
    city?: string;
    lastUpdated: string;
  };
}

class LocationCache {
  private cache = new Map<string, CacheEntry<LocationCacheData>>();
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes
  private readonly COUNTRY_TTL = 30 * 60 * 1000; // 30 minutes for country pages
  private readonly CITY_TTL = 10 * 60 * 1000; // 10 minutes for city pages

  private generateKey(country: string, city?: string): string {
    return city ? `${country}:${city}` : country;
  }

  private isExpired(entry: CacheEntry<LocationCacheData>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  set(country: string, city: string | undefined, data: LocationCacheData): void {
    const key = this.generateKey(country, city);
    const ttl = city ? this.CITY_TTL : this.COUNTRY_TTL;
    
    this.cache.set(key, {
      data: {
        ...data,
        metadata: {
          ...data.metadata,
          lastUpdated: new Date().toISOString()
        }
      },
      timestamp: Date.now(),
      ttl
    });

    console.log(`📦 Cached location data for ${key} (TTL: ${ttl / 1000}s)`);
  }

  get(country: string, city?: string): LocationCacheData | null {
    const key = this.generateKey(country, city);
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`❌ Cache miss for ${key}`);
      return null;
    }

    if (this.isExpired(entry)) {
      console.log(`⏰ Cache expired for ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache hit for ${key}`);
    return entry.data;
  }

  invalidate(country: string, city?: string): void {
    const key = this.generateKey(country, city);
    const deleted = this.cache.delete(key);
    
    if (deleted) {
      console.log(`🗑️ Invalidated cache for ${key}`);
    }

    // If invalidating a city, also invalidate the country cache
    if (city) {
      this.invalidate(country);
    }
  }

  invalidateAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cleared all cache entries (${size} items)`);
  }

  getStats(): {
    totalEntries: number;
    hitRate: number;
    entries: Array<{
      key: string;
      age: number;
      ttl: number;
      expired: boolean;
    }>;
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      ttl: entry.ttl,
      expired: this.isExpired(entry)
    }));

    return {
      totalEntries: this.cache.size,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
      entries
    };
  }

  // Cleanup expired entries
  cleanup(): void {
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
    }
  }

  // Preload cache with popular locations
  async preloadPopularLocations(locations: Array<{country: string; city?: string}>): Promise<void> {
    console.log(`🚀 Preloading cache for ${locations.length} popular locations...`);
    
    for (const location of locations) {
      try {
        // This would typically fetch from your data source
        // For now, we'll create placeholder data
        const data: LocationCacheData = {
          builders: [], // Would be populated from actual data source
          statistics: {
            totalBuilders: 0,
            verifiedBuilders: 0,
            averageRating: 0,
            totalProjects: 0
          },
          metadata: {
            country: location.country,
            city: location.city,
            lastUpdated: new Date().toISOString()
          }
        };
        
        this.set(location.country, location.city, data);
      } catch (error) {
        console.error(`Failed to preload ${location.country}${location.city ? ':' + location.city : ''}:`, error);
      }
    }
  }
}

// Singleton instance
export const locationCache = new LocationCache();

// Popular locations to preload
export const POPULAR_LOCATIONS = [
  { country: 'United States', city: 'Las Vegas' },
  { country: 'United States', city: 'Los Angeles' },
  { country: 'Germany', city: 'Berlin' },
  { country: 'Germany', city: 'Frankfurt' },
  { country: 'United Arab Emirates', city: 'Dubai' },
  { country: 'United Arab Emirates', city: 'Abu Dhabi' },
  { country: 'Australia', city: 'Sydney' },
  { country: 'Australia', city: 'Melbourne' },
  { country: 'United Kingdom', city: 'London' },
  { country: 'France', city: 'Paris' },
  { country: 'Italy', city: 'Milan' },
  { country: 'Spain', city: 'Barcelona' },
  { country: 'Netherlands', city: 'Amsterdam' },
  { country: 'Singapore', city: 'Singapore' },
  { country: 'Japan', city: 'Tokyo' },
  // Country-level caching
  { country: 'United States' },
  { country: 'Germany' },
  { country: 'United Arab Emirates' },
  { country: 'Australia' },
  { country: 'United Kingdom' },
];

// Cache warming function
export async function warmLocationCache(): Promise<void> {
  console.log('🔥 Warming location cache...');
  await locationCache.preloadPopularLocations(POPULAR_LOCATIONS);
  console.log('✅ Location cache warmed successfully');
}

// Cleanup function to run periodically
export function startCacheCleanup(): void {
  // Clean up expired entries every 5 minutes
  setInterval(() => {
    locationCache.cleanup();
  }, 5 * 60 * 1000);
  
  console.log('🧹 Started cache cleanup scheduler');
}

// Helper function to get cached builders for a location
export async function getCachedLocationData(
  country: string, 
  city?: string
): Promise<LocationCacheData | null> {
  return locationCache.get(country, city);
}

// Helper function to cache location data
export function cacheLocationData(
  country: string, 
  city: string | undefined, 
  data: LocationCacheData
): void {
  locationCache.set(country, city, data);
}

// Helper function to invalidate location cache
export function invalidateLocationCache(country: string, city?: string): void {
  locationCache.invalidate(country, city);
}

export default locationCache;