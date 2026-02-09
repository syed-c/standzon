import { Metadata } from "next";
import { notFound } from "next/navigation";
import ServerCountryCityPage from "@/components/ServerCountryCityPage";
import CountryPageClientWrapper from "@/components/CountryPageClientWrapper";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import { getServerSupabase } from "@/lib/supabase";
import { getCountryCodeByName } from "@/lib/utils/countryUtils";
import { getCitiesByCountry } from "@/lib/supabase/client";
// Import the global database function
import { getCitiesByCountry as getGlobalCitiesByCountry } from "@/lib/data/globalExhibitionDatabase";
import ServerPageWithBreadcrumbs from "@/components/ServerPageWithBreadcrumbs";

// ✅ FIX #1: Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

// Create a map for easy lookup
const COUNTRY_DATA: Record<string, any> = {};
GLOBAL_EXHIBITION_DATA.countries.forEach((country: any) => {
  COUNTRY_DATA[country.slug] = {
    name: country.name,
    code: country.countryCode,
    flag: '🏳️' // Placeholder flag
  };
});

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Fetch CMS content for the country page
async function getCountryPageContent(countrySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log("🔍 Server-side: Fetching CMS data for country:", countrySlug);



      const result = await sb
        .from("page_contents")
        .select("content")
        .eq("id", countrySlug)
        .single();

      if (result.error) {
        console.log("❌ Server-side: Supabase error:", result.error);
        return null;
      }

      if (result.data?.content) {
        console.log("✅ Server-side: Found CMS data for country:", countrySlug);
        return result.data.content;
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching country page content:", error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ country: string }>; searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const { page } = await searchParams;
  const currentPageNum = parseInt(page || "1", 10);
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];



  // Better error handling for missing country data
  if (!countryInfo) {
    console.warn(`⚠️ Country metadata not found for slug: ${countrySlug}`);
    return {
      title: 'Country Not Found',
      description: 'The requested country page was not found.',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  // Try to fetch CMS content for metadata
  let cmsMetadata = null;
  try {
    const sb = getServerSupabase();
    if (sb) {
      const result = await sb
        .from('page_contents')
        .select('content')
        .eq('id', countrySlug)
        .single();



      if (!result.error && result.data?.content) {
        const content = result.data.content;
        const seo = content.seo || {};
        const hero = content.hero || {};



        cmsMetadata = {
          title: seo.metaTitle || hero.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`,
          description: seo.metaDescription || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
          keywords: seo.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`],
        };
      }
    }
  } catch (error) {
    console.error('❌ Error fetching CMS metadata:', error);
    // Continue with fallback metadata even if CMS fails
  }

  // Handle pagination for SEO: canonical and robots tags
  const isPaginated = currentPageNum > 1;
  const canonicalUrl = `https://standszone.com/exhibition-stands/${countrySlug}`;
  
  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`];

  return {
    title: isPaginated ? `${title} - Page ${currentPageNum}` : title,
    description,
    keywords,
    robots: {
      index: !isPaginated, // Don't index paginated pages
      follow: true,        // But allow following links
      googleBot: isPaginated ? {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      } : {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: isPaginated ? `${title} - Page ${currentPageNum}` : title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: isPaginated ? `${title} - Page ${currentPageNum}` : title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const { page } = await searchParams;
  const currentPageNum = parseInt(page || "1", 10);
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];

  // Better error handling to prevent 5xx errors
  if (!countryInfo) {
    console.warn(`⚠️ Country not found: ${countrySlug}`);
    notFound();
  }

  console.log(`${countryInfo.flag} Loading ${countryInfo.name} page with modern UI...`);

  const cmsContent = await getCountryPageContent(countrySlug);

  // Get country code for fetching cities
  const countryCode = getCountryCodeByName(countryInfo.name);
  console.log(`🔍 Country code for ${countryInfo.name}: ${countryCode}`);

  // Fetch cities from Supabase
  let cities: any[] = [];
  try {
    if (countryCode) {
      const rawCities = await getCitiesByCountry(countryCode);
      console.log(`✅ Fetched ${rawCities.length} cities for ${countryInfo.name} (${countryCode}) from Supabase`);

      // Transform cities data to match expected format
      cities = rawCities.map((city: any) => ({
        name: city.city_name,
        slug: city.city_slug,
        builderCount: city.builder_count || 0
      }));
    } else {
      console.warn(`⚠️ Could not find country code for ${countryInfo.name}`);
    }
  } catch (error) {
    console.error(`❌ Error fetching cities for ${countryInfo.name}:`, error);
  }

  // If no cities from Supabase, fallback to global database
  if (cities.length === 0) {
    console.log(`🔄 Falling back to global database for cities in ${countryInfo.name}`);
    try {
      const globalCities = getGlobalCitiesByCountry(countrySlug);
      console.log(`✅ Found ${globalCities.length} cities for ${countryInfo.name} in global database`);

      // Transform global cities data to match expected format and deduplicate
      const cityMap = new Map();
      globalCities.forEach((city: any) => {
        // Use city name as key to deduplicate
        if (!cityMap.has(city.name)) {
          cityMap.set(city.name, {
            name: city.name,
            slug: city.slug,
            builderCount: city.builderCount || 0
          });
        }
      });

      cities = Array.from(cityMap.values());
      console.log(`✅ Deduplicated to ${cities.length} unique cities for ${countryInfo.name}`);
    } catch (error) {
      console.error(`❌ Error fetching cities from global database for ${countryInfo.name}:`, error);
    }
  }

  // Fetch builders directly from Supabase using optimized query
  let builders: any[] = [];
  let totalBuilders = 0;
  let totalPages = 0;

  try {
    const { getFilteredBuilders } = await import('@/lib/supabase/builders');

    const result = await getFilteredBuilders({
      country: countryInfo.name,
      page: currentPageNum,
      itemsPerPage: 6
    });

    builders = result.builders;
    totalBuilders = result.total;
    totalPages = result.totalPages;

    // Transform builders to match consistent interface
    builders = builders.map((b: any) => ({
      id: b.id,
      companyName: b.company_name || b.companyName || "",
      slug: b.slug || (b.company_name || b.companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
      headquarters: {
        city: b.headquarters_city || b.headquarters?.city || "Unknown",
        country: b.headquarters_country || b.headquartersCountry || b.headquarters?.country || "Unknown",
      },
      serviceLocations: b.service_locations || b.serviceLocations || [],
      rating: b.rating || 0,
      reviewCount: b.reviewCount || 0,
      projectsCompleted: b.projects_completed || b.projectsCompleted || 0,
      responseTime: b.response_time || b.responseTime || "Within 24 hours",
      verified: b.verified || b.isVerified || false,
      premiumMember: b.premium_member || b.premiumMember || false,
      services: b.services || [],
      specializations: b.specializations || [],
      companyDescription: b.description || b.company_description || "",
      keyStrengths: b.key_strengths || b.keyStrengths || [],
      featured: b.featured || false,
      logo: b.logo || b.profile_image || "/images/builders/default-logo.png",
      planType: b.plan_type || b.planType || "free",
    }));

    console.log(`📍 Fetched ${builders.length} builders for country: ${countryInfo.name} (page ${currentPageNum}/${totalPages}, total: ${totalBuilders})`);
  } catch (error) {
    console.error("❌ Error loading builders:", error);
    builders = [];
  }

  const defaultContent = {
    id: `${countrySlug}-main`,
    title: `Exhibition Stand Builders in ${countryInfo.name}`,
    metaTitle: `${countryInfo.name} Exhibition Stand Builders | Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${countryInfo.name} is a significant market for international trade shows and exhibitions.`,
    heroContent: `Partner with ${countryInfo.name}'s premier exhibition stand builders for trade show success.`,
    seoKeywords: [`${countryInfo.name} exhibition stands`, `${countryInfo.name} trade show builders`]
  };

  const countryBlock = cmsContent?.sections?.countryPages?.[countrySlug] || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };

  // ✅ FIX: Enhanced Soft 404 prevention - stricter validation
  const hasMeaningfulContent = totalBuilders > 0 || (cmsContent && cmsContent.content);
  const hasValidMetadata = cmsContent?.seo?.metaTitle && cmsContent?.seo?.metaDescription;
  
  // Return 404 for pages with no real value
  if (!hasMeaningfulContent) {
    console.warn(`⚠️ Soft 404: No meaningful content for ${countryInfo.name}. Builders: ${totalBuilders}, CMS: ${!!cmsContent}`);
    notFound();
  }
  
  // Additional validation: if we have CMS content but it's minimal/placeholder
  if (cmsContent && !hasValidMetadata) {
    const contentLength = JSON.stringify(cmsContent).length;
    if (contentLength < 500) { // Arbitrary threshold for meaningful content
      console.warn(`⚠️ Soft 404: CMS content too minimal (${contentLength} chars) for ${countryInfo.name}`);
      notFound();
    }
  }

  return (
    <ServerPageWithBreadcrumbs pathname={`/exhibition-stands/${countrySlug}`}>
      <div className="font-inter">
        <CountryPageClientWrapper>
          <ServerCountryCityPage
            country={countryInfo.name}
            initialBuilders={builders}
            initialContent={mergedContent}
            cmsContent={cmsContent}
            cities={cities}
            hideCitiesSection={false}
            serverCmsContent={cmsContent}
            currentPage={currentPageNum}
            totalBuilders={totalBuilders}
            totalPages={totalPages}
          />
        </CountryPageClientWrapper>
      </div>
    </ServerPageWithBreadcrumbs>
  );
}
