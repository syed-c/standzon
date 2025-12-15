import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";
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

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
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

    // Validate country exists - check both sources
    const countryData = getGlobalCountryBySlug(countrySlug) || getComprehensiveCountryBySlug(countrySlug);
    if (!countryData) {
      console.log("❌ Country not found in metadata:", countrySlug);
      notFound();
    }

    // Try to get city data from global database or comprehensive location data
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
    return {
      title: "Exhibition Stand Builders",
      description: "Find professional exhibition stand builders worldwide.",
    };
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

export default async function CityPage({ params }: CityPageProps) {
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

  console.log("🏙️ Loading city page:", {
    country: countrySlug,
    city: citySlug,
  });

  // Validate country exists - check both sources
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

  // Get city data from global database or comprehensive location data
  const cityData = getGlobalCityBySlug(countrySlug, adjustedCitySlug) || getComprehensiveCityBySlug(countrySlug, adjustedCitySlug);

  // Return 404 if city doesn't exist
  if (!cityData) {
    console.log("❌ City not found:", citySlug, "in country:", countrySlug);
    notFound();
  }

  const cityName = ('name' in cityData) ? cityData.name : cityData.cityName;
  const countryName = toTitle(countrySlug);

  // Try to get CMS content
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

  // Fetch builders from Supabase API with better error handling (similar to country pages)
  let builders: any[] = [];
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    console.log(`🔍 Fetching builders from: ${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`);
    
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { 
        cache: "no-store"
      }
    );
    
    if (!response.ok) {
      throw new Error(`Builders API returned ${response.status}: ${response.statusText}`);
    }
    
    const buildersData = await response.json();
    console.log(`✅ Builders API response received. Success: ${buildersData.success}, Builders count: ${buildersData.data?.builders?.length || 0}`);
    
    if (buildersData.success && buildersData.data && Array.isArray(buildersData.data.builders)) {
      // Handle country name variations (UAE vs United Arab Emirates)
      const countryVariations = [countryName.toLowerCase()];
      if (countryName === "United Arab Emirates") {
        countryVariations.push("uae");
      } else if (countryName === "UAE") {
        countryVariations.push("united arab emirates");
      }
      
      console.log('🔍 DEBUG: City page country variations for filtering:', countryVariations);
      
      // Filter builders for this city and country
      const filteredBuilders = buildersData.data.builders.filter((builder: any) => {
        // Normalize strings for comparison
        const normalizeString = (str: string) => {
          if (!str) return '';
          return str.toString().toLowerCase().trim();
        };
        
        const normalizedCity = normalizeString(cityName);
        
        // Check headquarters (handle different field names)
        const headquartersCity = normalizeString(
          builder.headquarters_city || 
          builder.headquarters?.city || 
          ''
        );
        const headquartersCountry = normalizeString(
          builder.headquarters_country || 
          builder.headquarters?.country || 
          builder.headquartersCountry || 
          ''
        );
        
        const headquartersMatch = 
          (headquartersCity === normalizedCity || headquartersCity.includes(normalizedCity)) &&
          countryVariations.some(variation => 
            headquartersCountry === variation || headquartersCountry.includes(variation)
          );
        
        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCity = normalizeString(loc.city);
          const serviceCountry = normalizeString(loc.country);
          return (
            (serviceCity === normalizedCity || serviceCity.includes(normalizedCity)) &&
            countryVariations.some(variation => 
              serviceCountry === variation || serviceCountry.includes(variation)
            )
          );
        });
        
        // Log for debugging first builder
        if (buildersData.data.builders.indexOf(builder) === 0) {
          console.log('🔍 DEBUG: City page filtering for first builder:', {
            city: cityName,
            country: countryName,
            countryVariations,
            headquartersCity,
            headquartersCountry,
            headquartersMatch,
            serviceLocationMatch,
            finalResult: headquartersMatch || serviceLocationMatch
          });
        }
        
        return headquartersMatch || serviceLocationMatch;
      });
      
      // Deduplicate builders by ID
      const builderMap = new Map();
      filteredBuilders.forEach((builder: any) => {
        if (!builderMap.has(builder.id)) {
          builderMap.set(builder.id, builder);
        }
      });
      
      const uniqueBuilders = Array.from(builderMap.values());
      
      // Log before transformation
      console.log('🔍 DEBUG: Before transformation - unique builders count:', uniqueBuilders.length);
      if (uniqueBuilders.length > 0) {
        console.log('🔍 DEBUG: First unique builder before transformation:', {
          id: uniqueBuilders[0].id,
          companyName: uniqueBuilders[0].company_name,
          headquarters_city: uniqueBuilders[0].headquarters_city,
          headquarters_country: uniqueBuilders[0].headquarters_country
        });
      }
      
      // Transform builders to match expected interface (same as in BuildersDirectoryContent)
      builders = uniqueBuilders.map((b: any) => {
        const transformed = {
          id: b.id,
          companyName: b.company_name || b.companyName || "",
          companyDescription: (() => {
            let desc = b.description || b.companyDescription || "";
            // Remove SERVICE_LOCATIONS JSON from description more aggressively
            desc = desc.replace(/\n\nSERVICE_LOCATIONS:.*$/g, '');
            desc = desc.replace(/SERVICE_LOCATIONS:.*$/g, '');
            desc = desc.replace(/SERVICE_LOCATIONS:\[.*?\]/g, '');
            desc = desc.replace(/\n\n.*SERVICE_LOCATIONS.*$/g, '');
            desc = desc.replace(/.*SERVICE_LOCATIONS.*$/g, '');
            // Remove any remaining raw data patterns
            desc = desc.replace(/sdfghjl.*$/g, '');
            desc = desc.replace(/testing.*$/g, '');
            desc = desc.replace(/sdfghj.*$/g, '');
            desc = desc.trim();
            return desc || "";
          })(),
          headquarters: {
            city: b.headquarters_city || b.headquarters?.city || "Unknown",
            country:
              b.headquarters_country ||
              b.headquartersCountry ||
              b.headquarters?.country ||
              "Unknown",
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
          projectsCompleted:
            b.projectsCompleted || b.projects_completed || 0,
          importedFromGMB: b.importedFromGMB || b.gmbImported || false,
          logo: b.logo || "/images/builders/default-logo.png",
          establishedYear: b.establishedYear || b.established_year || 2020,
          teamSize: b.teamSize || 10,
          reviewCount: b.reviewCount || 0,
          responseTime: b.responseTime || "Within 24 hours",
          languages: b.languages || ["English"],
          premiumMember: b.premiumMember || b.premium_member || false,
          slug:
            b.slug ||
            (b.company_name || b.companyName || "")
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-"),
          primary_email: b.primary_email || b.primaryEmail || "",
          phone: b.phone || "",
          website: b.website || "",
          contact_person: b.contact_person || b.contactPerson || "",
          position: b.position || "",
          gmbImported:
            b.gmbImported ||
            b.importedFromGMB ||
            b.source === "GMB_API" ||
            false,
        };
        
        // Log first few transformations
        if (uniqueBuilders.indexOf(b) < 3) {
          console.log(`🔍 DEBUG: Transformed builder ${b.company_name || b.companyName}:`, {
            id: transformed.id,
            companyName: transformed.companyName,
            headquarters: transformed.headquarters
          });
        }
        
        return transformed;
      });
      
      console.log('🔍 DEBUG: After transformation - builders count:', builders.length);
    } else {
      console.warn('⚠️ No builders data received or invalid format:', {
        success: buildersData.success,
        hasData: !!buildersData.data,
        isArray: Array.isArray(buildersData.data?.builders)
      });
    }
  } catch (error) {
    console.error("❌ Error loading builders:", error);
    // Don't let builder loading errors crash the page
    builders = [];
  }

  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country={countryName}
        city={cityName}
        initialBuilders={builders}
        cityData={cityData}
        initialContent={mergedContent}
        cmsContent={cmsContent}
        showQuoteForm={true}
        hideCitiesSection={false}
        cities={cities}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// Dynamic route: don't generate static params to avoid build-time dependencies
