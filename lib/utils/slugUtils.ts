/**
 * Utility functions for consistent slug generation and normalization
 */

/**
 * Normalizes a string into a URL-friendly slug
 * Ensures consistent formatting across the application
 */
export function normalizeSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')   // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')       // Trim hyphens from start
    .replace(/-+$/, '');      // Trim hyphens from end
}

/**
 * Normalizes a country name into a URL-friendly slug
 */
export function normalizeCountrySlug(countryName: string): string {
  return normalizeSlug(countryName);
}

/**
 * Normalizes a city name into a URL-friendly slug
 */
export function normalizeCitySlug(cityName: string): string {
  return normalizeSlug(cityName);
}

/**
 * Generates a full URL path for a country page
 */
export function getCountryPageUrl(countryName: string): string {
  return `/exhibition-stands/${normalizeCountrySlug(countryName)}`;
}

/**
 * Generates a full URL path for a city page
 */
export function getCityPageUrl(countryName: string, cityName: string): string {
  return `/exhibition-stands/${normalizeCountrySlug(countryName)}/${normalizeCitySlug(cityName)}`;
}