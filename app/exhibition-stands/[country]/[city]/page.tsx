import { Metadata } from "next";
import { notFound } from "next/navigation";
import ServerCountryCityPage from "@/components/ServerCountryCityPage";
import {
  getCityBySlug as getGlobalCityBySlug,
  getCountryBySlug as getGlobalCountryBySlug,
} from "@/lib/data/globalExhibitionDatabase";
import {
  getCityBySlug as getComprehensiveCityBySlug,
  getCountryBySlug as getComprehensiveCountryBySlug,
} from "@/lib/data/comprehensiveLocationData";
import { getServerSupabase } from "@/lib/supabase";
import SimpleQuoteRequestForm from "@/components/SimpleQuoteRequestForm";
import { getCountryCodeByName } from "@/lib/utils/countryUtils";
import { getCitiesByCountry } from "@/lib/supabase/client";
// Import the global database function
import { getCitiesByCountry as getGlobalCitiesByCountry } from "@/lib/data/globalExhibitionDatabase";
import ServerPageWithBreadcrumbs from "@/components/ServerPageWithBreadcrumbs";

// ✅ PERFORMANCE: Use ISR with 1-hour revalidation
export const revalidate = 3600;

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Default fallback content for each city
const getDefaultCityContent = (cityName: string, countryName: string) => ({
  whyChooseHeading: `Why Choose Local Builders in ${cityName}, ${countryName}?`,
  whyChooseParagraph: `Local builders in ${cityName} offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`,
  infoCards: [
    {
      title: "Local Market Knowledge",
      text: `Understand local regulations, venue requirements, and cultural preferences specific to ${cityName}.`,
    },
    {
      title: "Faster Project Delivery",
      text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support.",
    },
    {
      title: "Cost-Effective Solutions",
      text: "Lower transportation costs, established supplier networks, and competitive local pricing structures.",
    },
  ],
  quotesParagraph: `Connect with 3-5 verified local builders in ${cityName} who understand your market. No registration required, quotes within 24 hours.`,
  servicesHeading: `Exhibition Stand Builders in ${cityName}: Services, Costs, and Tips`,
  servicesParagraph: `Finding the right exhibition stand partner in ${cityName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}): Promise<Metadata> {
  try {
    const { country, city } = await params;
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const toTitle = (s: string) =>
      s
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    const countrySlug = normalize(country);
    const citySlug = normalize(city);

    // ✅ FIX #1: Validate country exists before proceeding
    const countryData = getGlobalCountryBySlug(countrySlug) || getComprehensiveCountryBySlug(countrySlug);
    if (!countryData) {
      console.log("❌ Country not found in metadata:", countrySlug);
      notFound();
    }

    // ✅ FIX #2: Validate city exists before proceeding
    const cityData = getGlobalCityBySlug(countrySlug, citySlug) || getComprehensiveCityBySlug(countrySlug, citySlug);
    if (!cityData) {
      console.log(
        "❌ City not found in metadata:",
        citySlug,
        "in country:",
        countrySlug
      );
      notFound();
    }

    const cityName = ('name' in cityData) ? cityData.name : cityData.cityName;
    const countryName = toTitle(countrySlug);

    // ✅ FIX #3: Validate that we can fetch meaningful data before generating metadata
    let hasMeaningfulData = false;

    // Check if we can get builders for this city
    try {
      const { getFilteredBuilders } = await import('@/lib/supabase/builders');
      const builderResult = await getFilteredBuilders({
        country: countryName,
        city: cityName,
        page: 1,
        itemsPerPage: 1
      });

      if (builderResult.total > 0) {
        hasMeaningfulData = true;
      }
    } catch (error) {
      console.log("⚠️ Could not verify builder data for metadata:", error);
    }

    // Check if CMS content exists
    try {
      const sb = getServerSupabase();
      if (sb) {
        const cityPageId = `${countrySlug}-${citySlug}`;
        const result = await sb
          .from("page_contents")
          .select("content")
          .eq("id", cityPageId)
          .single();

        if (!result.error && result.data?.content) {
          hasMeaningfulData = true;
        }
      }
    } catch (error) {
      console.log("⚠️ Could not verify CMS data for metadata:", error);
    }

    // ✅ FIX #4: If no meaningful data, don't generate metadata - trigger 404 instead
    if (!hasMeaningfulData) {
      console.warn(`⚠️ Soft 404 metadata: No meaningful data for ${cityName}, ${countryName}`);
      notFound();
    }

    // Try to fetch CMS content for metadata
    let cmsMetadata = null;
    try {
      const sb = getServerSupabase();
      if (sb) {
        const cityPageId = `${countrySlug}-${citySlug}`;

        const result = await sb
          .from("page_contents")
          .select("content")
          .eq("id", cityPageId)
          .single();

        if (!result.error && result.data?.content) {
          const content = result.data.content;
          const seo = content.seo || {};
          const hero = content.hero || {};

          cmsMetadata = {
            title: seo.metaTitle || hero.title || `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`,
            description: seo.metaDescription || `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`,
            keywords: seo.keywords || [`exhibition stands ${cityName}`, `${cityName} trade show builders`, `${cityName} booth design`, `${countryName} ${cityName} exhibition services`],
          };
        }
      }
    } catch (error) {
      console.error("❌ Error fetching CMS metadata:", error);
    }

    // Use CMS metadata if available, otherwise fall back to default
    const title = cmsMetadata?.title || `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`;
    const description = cmsMetadata?.description || `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
    const keywords = cmsMetadata?.keywords || [`exhibition stands ${cityName}`, `${cityName} trade show builders`, `${cityName} booth design`, `${countryName} ${cityName} exhibition services`];

    return {
      title,
      description,
      keywords,
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
      openGraph: {
        title,
        description,
        type: "website",
      },
      alternates: {
        canonical: `https://standszone.com/exhibition-stands/${countrySlug}/${citySlug}`,
      },
    };
  } catch (error) {
    console.error("❌ generateMetadata error:", error);
    notFound();
  }
}

// Fetch CMS content for the city page
async function getCityPageContent(countrySlug: string, citySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log("🔍 Server-side: Fetching CMS data for city:", citySlug, "in country:", countrySlug);

      const cityPageId = `${countrySlug}-${citySlug}`;

      const result = await sb
        .from("page_contents")
        .select("content")
        .eq("id", cityPageId)
        .single();

      if (result.error) {
        console.log("❌ Server-side: Supabase error:", result.error);
        return null;
      }

      if (result.data?.content) {
        console.log("✅ Server-side: Found CMS data for city:", citySlug);
        return result.data.content;
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching city page content:", error);
    return null;
  }
}

// New function to extract and format CMS content properly
function formatCmsContent(cmsContent: any, countrySlug: string, citySlug: string, countryName: string, cityName: string) {
  if (!cmsContent) return null;

  console.log("🔍 Formatting CMS content for:", countrySlug, citySlug);

  // Extract the specific city content if it's nested
  const cityPageId = `${countrySlug}-${citySlug}`;
  let citySpecificContent = cmsContent?.sections?.cityPages?.[cityPageId] || cmsContent;

  // NEW: Handle the specific nested structure for hero description
  // sections.cityPages["united-arab-emirates-dubai"].countryPages.dubai.heroDescription
  if (cmsContent?.sections?.cityPages?.[cityPageId]?.countryPages?.[citySlug]?.heroDescription) {
    console.log("✅ Found heroDescription in nested structure");
    citySpecificContent = {
      ...citySpecificContent,
      heroDescription: cmsContent.sections.cityPages[cityPageId].countryPages[citySlug].heroDescription
    };
  }

  // Ensure we have the right structure
  const formattedContent = {
    id: `${countrySlug}-${citySlug}`,
    title: citySpecificContent?.hero?.title || citySpecificContent?.hero?.heading || `Exhibition Stand Builders in ${cityName}, ${countryName}`,
    metaTitle: citySpecificContent?.seo?.metaTitle || `${cityName} Exhibition Stand Builders | ${countryName}`,
    metaDescription: citySpecificContent?.seo?.metaDescription || `Professional exhibition stand builders in ${cityName}, ${countryName}. Get custom trade show displays and booth design services.`,
    description: citySpecificContent?.content?.introduction || citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Discover professional exhibition stand builders in ${cityName}, ${countryName}.`,
    heroContent: citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Connect with ${cityName}'s leading exhibition stand builders for your next trade show project.`,
    seoKeywords: citySpecificContent?.seo?.keywords || [`${cityName} exhibition stands`, `${cityName} trade show builders`, `${cityName} booth design`],
    seo: {
      metaTitle: citySpecificContent?.seo?.metaTitle || `${cityName} Exhibition Stand Builders | ${countryName}`,
      metaDescription: citySpecificContent?.seo?.metaDescription || `Professional exhibition stand builders in ${cityName}, ${countryName}. Get custom trade show displays and booth design services.`,
      keywords: citySpecificContent?.seo?.keywords || [`${cityName} exhibition stands`, `${cityName} trade show builders`, `${cityName} booth design`],
    },
    hero: {
      title: citySpecificContent?.hero?.title || citySpecificContent?.hero?.heading || `Exhibition Stand Builders in ${cityName}, ${countryName}`,
      description: citySpecificContent?.hero?.description || citySpecificContent?.hero?.text || citySpecificContent?.heroDescription || `Find trusted exhibition stand builders in ${cityName}.`,
      ctaText: citySpecificContent?.hero?.ctaText || "Get Free Quote",
      subtitle: citySpecificContent?.hero?.subtitle || `Professional booth design and construction services in ${cityName}`,
    },
    content: {
      introduction: citySpecificContent?.content?.introduction || citySpecificContent?.hero?.description || citySpecificContent?.heroDescription || `Discover professional exhibition stand builders in ${cityName}, ${countryName}.`,
      whyChooseSection: citySpecificContent?.content?.whyChooseSection || citySpecificContent?.whyChooseSection || `Why Choose Local Builders in ${cityName}?`,
      industryOverview: citySpecificContent?.content?.industryOverview || `Industry overview for ${cityName}`,
      venueInformation: citySpecificContent?.content?.venueInformation || `Venue information for ${cityName}`,
      builderAdvantages: citySpecificContent?.content?.builderAdvantages || `Builder advantages in ${cityName}`,
      conclusion: citySpecificContent?.content?.conclusion || `Conclusion for ${cityName}`,
    },
    design: {
      primaryColor: citySpecificContent?.design?.primaryColor || "#ec4899",
      accentColor: citySpecificContent?.design?.accentColor || "#f97316",
      layout: citySpecificContent?.design?.layout || "modern",
      showStats: citySpecificContent?.design?.showStats !== undefined ? citySpecificContent?.design?.showStats : true,
      showMap: citySpecificContent?.design?.showMap !== undefined ? citySpecificContent?.design?.showMap : true,
    },
  };

  // Ensure all content fields are strings, not objects
  const safeExtractText = (content: any): string => {
    if (typeof content === 'string') return content;
    if (typeof content === 'object' && content !== null) {
      // Try common properties in order of preference
      return content.description ||
        content.text ||
        content.heading ||
        content.title ||
        content.content ||
        JSON.stringify(content);
    }
    return String(content);
  };

  // Safely extract all content fields
  formattedContent.title = safeExtractText(formattedContent.title);
  formattedContent.metaTitle = safeExtractText(formattedContent.metaTitle);
  formattedContent.metaDescription = safeExtractText(formattedContent.metaDescription);
  formattedContent.description = safeExtractText(formattedContent.description);
  formattedContent.heroContent = safeExtractText(formattedContent.heroContent);

  // Ensure SEO keywords is an array of strings
  if (!Array.isArray(formattedContent.seoKeywords)) {
    formattedContent.seoKeywords = [safeExtractText(formattedContent.seoKeywords)];
  } else {
    formattedContent.seoKeywords = formattedContent.seoKeywords.map(keyword => safeExtractText(keyword));
  }

  // Ensure hero fields are strings
  formattedContent.hero.title = safeExtractText(formattedContent.hero.title);
  formattedContent.hero.description = safeExtractText(formattedContent.hero.description);
  formattedContent.hero.ctaText = safeExtractText(formattedContent.hero.ctaText);
  formattedContent.hero.subtitle = safeExtractText(formattedContent.hero.subtitle);

  // Ensure content fields are strings
  formattedContent.content.introduction = safeExtractText(formattedContent.content.introduction);
  formattedContent.content.whyChooseSection = safeExtractText(formattedContent.content.whyChooseSection);
  formattedContent.content.industryOverview = safeExtractText(formattedContent.content.industryOverview);
  formattedContent.content.venueInformation = safeExtractText(formattedContent.content.venueInformation);
  formattedContent.content.builderAdvantages = safeExtractText(formattedContent.content.builderAdvantages);
  formattedContent.content.conclusion = safeExtractText(formattedContent.content.conclusion);

  console.log("✅ Formatted CMS content:", JSON.stringify(formattedContent, null, 2));
  return formattedContent;
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { country, city } = await params;
  const { page } = await searchParams;
  const currentPageNum = parseInt(page || "1", 10);
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  const toTitle = (s: string) =>
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const countrySlug = normalize(country);
  const citySlug = normalize(city);

  console.log("🏙️ Loading city page:", {
    country: countrySlug,
    city: citySlug,
  });

  // ✅ FIX #5: Validate country exists - check both sources
  const countryData = getGlobalCountryBySlug(countrySlug) || getComprehensiveCountryBySlug(countrySlug);
  if (!countryData) {
    console.log("❌ Country not found:", countrySlug);
    notFound();
  }

  // Handle Düsseldorf spelling variations - block Düsseldorf but allow Dusseldorf
  let adjustedCitySlug = citySlug;
  if (countrySlug === "germany" && citySlug === "düsseldorf") {
    // Return 404 for Düsseldorf (with umlaut) - we only want Dusseldorf (without umlaut)
    console.log("❌ Düsseldorf spelling not allowed, use Dusseldorf instead:", citySlug);
    notFound();
  }

  // ✅ FIX #6: Validate city exists before proceeding (strict validation to match metadata)
  const cityData = getGlobalCityBySlug(countrySlug, adjustedCitySlug) || getComprehensiveCityBySlug(countrySlug, adjustedCitySlug);
  if (!cityData) {
    console.log(
      "❌ City not found in page:",
      citySlug,
      "in country:",
      countrySlug
    );
    notFound();
  }

  const cityName = ('name' in cityData) ? cityData.name : cityData.cityName;
  const countryName = toTitle(countrySlug);

  // ✅ FIX #7: Validate that we can fetch meaningful data before rendering page
  let hasMeaningfulData = false;

  // Check if we can get builders for this city
  try {
    const { getFilteredBuilders } = await import('@/lib/supabase/builders');
    const builderResult = await getFilteredBuilders({
      country: countryName,
      city: cityName,
      page: 1,
      itemsPerPage: 1
    });

    if (builderResult.total > 0) {
      hasMeaningfulData = true;
    }
  } catch (error) {
    console.log("⚠️ Could not verify builder data for page:", error);
  }

  // Check if CMS content exists
  try {
    const sb = getServerSupabase();
    if (sb) {
      const cityPageId = `${countrySlug}-${citySlug}`;
      const result = await sb
        .from("page_contents")
        .select("content")
        .eq("id", cityPageId)
        .single();

      if (!result.error && result.data?.content) {
        hasMeaningfulData = true;
      }
    }
  } catch (error) {
    console.log("⚠️ Could not verify CMS data for page:", error);
  }

  // ✅ FIX #8: If no meaningful data, don't render page - trigger 404 instead
  if (!hasMeaningfulData) {
    console.warn(`⚠️ Soft 404 page: No meaningful data for ${cityName}, ${countryName}`);
    notFound();
  }

  // ✅ FIX #9: Try to get CMS content (only after validation passes)
  const cmsContent = await getCityPageContent(countrySlug, citySlug);

  // Get country code for fetching cities (same as country pages)
  const countryCode = getCountryCodeByName(countryName);
  console.log(`🔍 Country code for ${countryName}: ${countryCode}`);

  // Fetch cities from Supabase (same approach as country pages)
  let cities: any[] = [];
  try {
    if (countryCode) {
      const rawCities = await getCitiesByCountry(countryCode);
      console.log(`✅ Fetched ${rawCities.length} cities for ${countryName} (${countryCode}) from Supabase`);

      // Transform cities data to match expected format
      cities = rawCities.map((city: any) => ({
        name: city.city_name,
        slug: city.city_slug,
        builderCount: city.builder_count || 0
      }));
    } else {
      console.warn(`⚠️ Could not find country code for ${countryName}`);
    }
  } catch (error) {
    console.error(`❌ Error fetching cities for ${countryName}:`, error);
  }

  // If no cities from Supabase, fallback to global database
  if (cities.length === 0) {
    console.log(`🔄 Falling back to global database for cities in ${countryName}`);
    try {
      const globalCities = getGlobalCitiesByCountry(countrySlug);
      console.log(`✅ Found ${globalCities.length} cities for ${countryName} in global database`);

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
      console.log(`✅ Deduplicated to ${cities.length} unique cities for ${countryName}`);
    } catch (error) {
      console.error(`❌ Error fetching cities from global database for ${countryName}:`, error);
    }
  }

  // ✅ FIX #9: Fetch builders directly from Supabase using optimized query
  let builders: any[] = [];
  let totalBuilders = 0;
  let totalPages = 0;

  try {
    const { getFilteredBuilders } = await import('@/lib/supabase/builders');

    console.log('🔍 Fetching builders for city:', cityName, 'in country:', countryName);

    const result = await getFilteredBuilders({
      country: countryName,
      city: cityName,
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

    console.log(`📍 Fetched ${builders.length} builders for city: ${cityName} (page ${currentPageNum}/${totalPages}, total: ${totalBuilders})`);
  } catch (error) {
    console.error("❌ Error loading builders for city:", error);
    builders = [];
  }

  // Create default content structure similar to country pages
  const defaultContent = {
    id: `${countrySlug}-${citySlug}`,
    title: `Exhibition Stand Builders in ${cityName}, ${countryName}`,
    metaTitle: `${cityName} Exhibition Stand Builders | ${countryName}`,
    metaDescription: `Professional exhibition stand builders in ${cityName}, ${countryName}. Get custom trade show displays and booth design services.`,
    description: `Discover professional exhibition stand builders in ${cityName}, ${countryName}. Our verified contractors specialize in custom trade show displays, booth design, and comprehensive exhibition services.`,
    heroContent: `Connect with ${cityName}'s leading exhibition stand builders for your next trade show project.`,
    seoKeywords: [
      `${cityName} exhibition stands`,
      `${cityName} trade show builders`,
      `${cityName} booth design`,
    ]
  };

  // Format CMS content properly
  const formattedCmsContent = formatCmsContent(cmsContent, countrySlug, citySlug, countryName, cityName);

  // Merge CMS content with default content (similar to country page approach)
  const mergedContent = {
    ...defaultContent,
    ...(formattedCmsContent || {})
  };

    

  return (
    <ServerPageWithBreadcrumbs pathname={`/exhibition-stands/${countrySlug}/${citySlug}`}>
      <div className="font-inter">
        <ServerCountryCityPage
          country={countryName}
          city={cityName}
          initialBuilders={builders}
          initialContent={mergedContent}
          cmsContent={cmsContent}
          showQuoteForm={true}
          hideCitiesSection={false}
          cities={cities}
          currentPage={currentPageNum}
          totalBuilders={totalBuilders}
          totalPages={totalPages}
          serverCmsContent={cmsContent}
        />
      </div>
    </ServerPageWithBreadcrumbs>
  );
}

// Dynamic route: don't generate static params to avoid build-time dependencies