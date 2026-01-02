/**
 * Server-side city data fetching with caching
 * Revalidates every 6 hours for fresh content while reducing DB load
 */

import { cache } from 'react';
import { revalidateTag } from 'next/cache';
import { getServerSupabase } from '../../supabase';
import { getCitiesByCountry } from '../db/locations';
import { getBuilders } from '../db/builders';
import { getPageContent } from '../db/pages';
import { parsePageContent } from './parse-content';
import { ContentFetchResult } from './types';

// Cache duration: 6 hours (21600 seconds)
export const CITY_REVALIDATE_TIME = 21600; // 6 hours
export const CITY_CACHE_TAG = 'city-pages';

/**
 * Fetch and cache city page content
 * Uses React cache() for request deduplication and revalidateTag for ISR
 */
export const fetchCityContent = cache(async (
  countrySlug: string,
  countryName: string,
  citySlug: string,
  cityName: string,
  countryCode?: string
): Promise<ContentFetchResult | null> => {
  try {
    const sb = getServerSupabase();
    
    // Fetch CMS content
    let cmsContent = await getPageContent(`${countrySlug}-${citySlug}`);
    
    // If city-specific content not found, try fetching country content
    if (!cmsContent && countryCode) {
      cmsContent = await getPageContent(countrySlug);
    }

    // Default content
    const defaultContent: any = {
      id: `${countrySlug}-${citySlug}-main`,
      title: `Exhibition Stand Builders in ${cityName}, ${countryName}`,
      metaTitle: `${cityName} Exhibition Stand Builders | ${countryName} Trade Show Booth Design`,
      metaDescription: `Leading exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and professional exhibition services.`,
      description: `${cityName} is a key hub for trade shows in ${countryName}. Our expert exhibition stand builders in ${cityName} deliver innovative designs that capture attention and drive results in this dynamic market.`,
      heroContent: `Partner with ${cityName}'s premier exhibition stand builders for trade show success.`,
      seoKeywords: [
        `${cityName} exhibition stands`,
        `${cityName} trade show builders`,
        `${cityName} exhibition builders`,
        `${countryName} booth design`,
        `${cityName} exhibition services`
      ]
    };

    // Parse content
    const parsedContent = parsePageContent(cmsContent, defaultContent, countrySlug, citySlug);

    // Fetch cities
    let cities: any[] = [];
    if (countryCode) {
      try {
        const rawCities = await getCitiesByCountry(countryCode);
        cities = rawCities.map((c: any) => ({
          name: c.city_name,
          slug: c.city_slug,
          builderCount: c.builder_count || 0
        }));
      } catch (error) {
        console.error(`❌ Error fetching cities for ${countryName}:`, error);
      }
    }

    // Fetch builders from database with caching
    let builders: any[] = [];
    try {
      const allBuilders = await getBuilders();
      builders = filterBuildersByCityAndCountry(allBuilders, cityName, countryName);
    } catch (error) {
      console.error('❌ Error fetching builders:', error);
    }

    // Transform builders
    const transformedBuilders = builders.map((builder: any) => ({
      id: builder.id,
      companyName: builder.company_name,
      slug: builder.slug,
      headquarters: {
        city: builder.headquarters_city,
        country: builder.headquarters_country
      },
      rating: builder.rating || 0,
      reviewCount: builder.review_count || 0,
      projectsCompleted: builder.projects_completed || 0,
      verified: builder.verified || false,
      premiumMember: builder.premium_member || false
    }));

    // Calculate stats
    const stats = calculateBuilderStats(transformedBuilders);

    return {
      content: parsedContent,
      builders: transformedBuilders,
      cities,
      stats,
    };
  } catch (error) {
    console.error('❌ Error in fetchCityContent:', error);
    return null;
  }
});

/**
 * Filter builders by city and country with name variation handling
 */
function filterBuildersByCityAndCountry(builders: any[], cityName: string, countryName: string): any[] {
  const normalizedCityName = cityName.toLowerCase();
  const normalizedCountryName = countryName.toLowerCase();
  
  const countryVariations = [normalizedCountryName];
  
  if (normalizedCountryName.includes("united arab emirates")) {
    countryVariations.push("uae");
  } else if (normalizedCountryName === "uae") {
    countryVariations.push("united arab emirates");
  }

  return builders.filter((builder: any) => {
    const bCity = (builder.headquarters_city || '').toLowerCase();
    const bCountry = (builder.headquarters_country || '').toLowerCase();
    
    const cityMatch = bCity === normalizedCityName || bCity.includes(normalizedCityName);
    
    const countryMatch = countryVariations.some(variation => 
      bCountry === variation || bCountry.includes(variation)
    );
    
    return cityMatch && countryMatch;
  });
}

/**
 * Calculate builder statistics
 */
function calculateBuilderStats(builders: any[]) {
  const builderCount = builders.length;
  const averageRating =
    builderCount > 0
      ? Math.round(
          (builders.reduce((sum: number, b: any) => sum + (b.rating || 4.8), 0) /
            builderCount) *
            10
        ) / 10
      : 4.8;
  const verifiedBuilders = builders.filter((b) => b.verified).length;
  const totalProjects = builders.reduce(
    (sum: number, b: any) => sum + (b.projectsCompleted || 0),
    0
  );

  return {
    totalBuilders: builderCount,
    averageRating,
    verifiedBuilders,
    totalProjects: totalProjects || builderCount * 15,
  };
}

/**
 * Revalidate city page cache
 * Call this when city data is updated in the CMS
 */
export async function revalidateCityPage(countrySlug: string, citySlug: string) {
  const cityPageId = `${countrySlug}-${citySlug}`;
  revalidateTag(`${CITY_CACHE_TAG}-${cityPageId}`);
  revalidateTag(CITY_CACHE_TAG);
}
