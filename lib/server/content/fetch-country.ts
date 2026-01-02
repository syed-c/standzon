/**
 * Server-side country data fetching with caching
 * Revalidates every 6 hours for fresh content while reducing DB load
 */

import { cache } from 'react';
import { revalidateTag } from 'next/cache';
import { getServerSupabase } from '../../supabase';
import { getCitiesByCountry } from '../db/locations';
import { parsePageContent } from './parse-content';
import { ContentFetchResult, ParsedPageContent } from './types';

// Cache duration: 6 hours (21600 seconds)
export const COUNTRY_REVALIDATE_TIME = 21600; // 6 hours
export const COUNTRY_CACHE_TAG = 'country-pages';

/**
 * Fetch and cache country page content
 * Uses React cache() for request deduplication and revalidateTag for ISR
 */
export const fetchCountryContent = cache(async (
  countrySlug: string,
  countryName: string,
  countryCode?: string
): Promise<ContentFetchResult | null> => {
  try {
    const sb = getServerSupabase();
    if (!sb) {
      console.warn("⚠️ No Supabase client available for country content fetch");
      return null;
    }

    // Fetch CMS content
    const { data: cmsData, error: cmsError } = await sb
      .from('page_contents')
      .select('content')
      .eq('id', countrySlug)
      .single();

    const cmsContent = cmsError ? null : cmsData?.content;

    // Default content
    const defaultContent: any = {
      id: `${countrySlug}-main`,
      title: `Exhibition Stand Builders in ${countryName}`,
      metaTitle: `${countryName} Exhibition Stand Builders | Trade Show Booth Design`,
      metaDescription: `Leading exhibition stand builders across ${countryName}. Custom trade show displays, booth design, and professional exhibition services.`,
      description: `${countryName} is a significant market for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in ${countryName}'s dynamic exhibition landscape.`,
      heroContent: `Partner with ${countryName}'s premier exhibition stand builders for trade show success across the country.`,
      seoKeywords: [
        `${countryName} exhibition stands`,
        `${countryName} trade show builders`,
        `${countryName} exhibition builders`,
        `${countryName} booth design`,
        `${countryName} exhibition services`
      ]
    };

    // Parse content
    const parsedContent = parsePageContent(cmsContent, defaultContent, countrySlug);

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

    // Fetch builders via API with caching
    let builders: any[] = [];
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const response = await fetch(
        `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
        { 
          next: { 
            revalidate: COUNTRY_REVALIDATE_TIME,
            tags: [COUNTRY_CACHE_TAG, `${COUNTRY_CACHE_TAG}-${countrySlug}`]
          }
        }
      );

      if (response.ok) {
        const buildersData = await response.json();
        if (buildersData.success && buildersData.data && Array.isArray(buildersData.data.builders)) {
          builders = filterBuildersByCountry(buildersData.data.builders, countryName);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching builders:', error);
    }

    // Calculate stats
    const stats = calculateBuilderStats(builders);

    return {
      content: parsedContent,
      builders,
      cities,
      stats,
    };
  } catch (error) {
    console.error('❌ Error in fetchCountryContent:', error);
    return null;
  }
});

/**
 * Filter builders by country with name variation handling
 */
function filterBuildersByCountry(builders: any[], countryName: string): any[] {
  const normalizedCountryName = countryName.toLowerCase();
  const countryVariations = [normalizedCountryName];
  
  if (normalizedCountryName.includes("united arab emirates")) {
    countryVariations.push("uae");
  } else if (normalizedCountryName === "uae") {
    countryVariations.push("united arab emirates");
  }

  const filtered = builders.filter((builder: any) => {
    const normalizeString = (str: string) => {
      if (!str) return '';
      return str.toString().toLowerCase().trim();
    };
    
    const headquartersCountry = normalizeString(
      builder.headquarters_country || 
      builder.headquarters?.country || 
      builder.headquartersCountry || 
      ''
    );
    
    const headquartersMatch = countryVariations.some(variation => 
      headquartersCountry === variation || headquartersCountry.includes(variation)
    );
    
    const serviceLocations = builder.service_locations || builder.serviceLocations || [];
    const serviceLocationMatch = serviceLocations.some((loc: any) => {
      const serviceCountry = normalizeString(loc.country);
      return countryVariations.some(variation => 
        serviceCountry === variation || serviceCountry.includes(variation)
      );
    });
    
    return headquartersMatch || serviceLocationMatch;
  });

  // Deduplicate by ID
  const builderMap = new Map();
  filtered.forEach((builder: any) => {
    if (!builderMap.has(builder.id)) {
      builderMap.set(builder.id, transformBuilderData(builder));
    }
  });

  return Array.from(builderMap.values());
}

/**
 * Transform builder data to standard format
 */
function transformBuilderData(b: any): any {
  return {
    id: b.id,
    companyName: b.company_name || b.companyName || "",
    companyDescription: (() => {
      let desc = b.description || b.companyDescription || "";
      // Remove SERVICE_LOCATIONS JSON from description
      desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
      desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
      desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
      desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
      desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
      desc = desc.replace(/sdfghjl.*$/g, '');
      desc = desc.replace(/testing.*$/g, '');
      desc = desc.replace(/sdfghj.*$/g, '');
      desc = desc.trim();
      return desc || "";
    })(),
    headquarters: {
      city: b.headquarters_city || b.headquarters?.city || "Unknown",
      country: b.headquarters_country || b.headquartersCountry || b.headquarters?.country || "Unknown",
      countryCode: b.headquarters?.countryCode || "XX",
      address: b.headquarters?.address || "",
      latitude: b.headquarters?.latitude || 0,
      longitude: b.headquarters?.longitude || 0,
      isHeadquarters: true,
    },
    serviceLocations: b.serviceLocations || b.service_locations || [],
    keyStrengths: b.keyStrengths || [],
    verified: b.verified || b.isVerified || false,
    rating: b.rating || 0,
    projectsCompleted: b.projectsCompleted || b.projects_completed || 0,
    importedFromGMB: b.importedFromGMB || b.gmbImported || false,
    logo: b.logo || "/images/builders/default-logo.png",
    establishedYear: b.establishedYear || b.established_year || 2020,
    teamSize: b.teamSize || 10,
    reviewCount: b.reviewCount || 0,
    responseTime: b.responseTime || "Within 24 hours",
    languages: b.languages || ["English"],
    premiumMember: b.premiumMember || b.premium_member || false,
    slug: b.slug || (b.company_name || b.companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
    primary_email: b.primary_email || b.primaryEmail || "",
    phone: b.phone || "",
    website: b.website || "",
    contact_person: b.contact_person || b.contactPerson || "",
    position: b.position || "",
    gmbImported: b.gmbImported || b.importedFromGMB || b.source === "GMB_API" || false,
  };
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
 * Revalidate country page cache
 * Call this when country data is updated in the CMS
 */
export async function revalidateCountryPage(countrySlug: string) {
  revalidateTag(`${COUNTRY_CACHE_TAG}-${countrySlug}`);
  revalidateTag(COUNTRY_CACHE_TAG);
}
