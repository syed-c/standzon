/**
 * Utility functions for handling image proxying
 */

/**
 * Convert a Supabase storage URL to a proxied URL
 * @param url The original Supabase storage URL
 * @param baseUrl Optional base URL to create absolute URLs (e.g., https://example.com)
 * @returns The proxied URL or the original URL if it's not a Supabase URL
 */
export function convertToProxyUrl(url: string, baseUrl?: string): string {
  // Check if this is a Supabase storage URL
  if (!url || typeof url !== 'string') {
    return url;
  }
  
  // Match Supabase storage URLs and extract the path
  // Handle both new format (with bucket) and old format (without bucket)
  const supabaseUrlPattern = /^https:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\/public\/(.+)$/;
  const match = url.match(supabaseUrlPattern);
  
  if (match && match[1]) {
    const fullPath = match[1]; // This includes bucket/path or just path
    
    // Check if the path starts with a known bucket
    const knownBuckets = ['gallery', 'portfolio-images'];
    const pathParts = fullPath.split('/');
    
    let proxiedPath: string;
    if (knownBuckets.includes(pathParts[0])) {
      // Already in the new format with bucket
      proxiedPath = `/api/media/${fullPath}`;
    } else {
      // Old format without bucket, default to gallery bucket
      proxiedPath = `/api/media/gallery/${fullPath}`;
    }
    
    // If baseUrl is provided, return absolute URL
    if (baseUrl) {
      // Remove trailing slash from baseUrl if present
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      return `${cleanBaseUrl}${proxiedPath}`;
    }
    
    // If we're in a browser environment, use the current window location
    if (typeof window !== 'undefined') {
      const currentBaseUrl = `${window.location.protocol}//${window.location.host}`;
      return `${currentBaseUrl}${proxiedPath}`;
    }
    
    // Return relative URL
    return proxiedPath;
  }
  
  // Return original URL if it's not a Supabase storage URL
  return url;
}

/**
 * Convert an array of image URLs to proxied URLs
 * @param urls Array of image URLs
 * @param baseUrl Optional base URL to create absolute URLs
 * @returns Array of proxied URLs
 */
export function convertImageUrlsToProxy(urls: string[], baseUrl?: string): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }
  
  return urls.map(url => convertToProxyUrl(url, baseUrl));
}