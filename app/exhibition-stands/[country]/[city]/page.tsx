import { Metadata } from "next";
import { notFound } from "next/navigation";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
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
        
        // Special handling for Jordan, Lebanon, Israel, and Oman cities
        const isSpecialCountry = ['jordan', 'lebanon', 'israel', 'oman'].includes(countrySlug);
        
        let data, error;
        
        if (isSpecialCountry) {
          // Try multiple query patterns for special countries
          const result = await sb
            .from("page_contents")
            .select("content")
            .or(`id.eq.${cityPageId},id.eq.city-${cityPageId}`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (result.data?.[0]) {
            data = result.data[0];
            error = null;
          } else {
            // Fallback to exact match if no results from OR query
            const exactResult = await sb
              .from("page_contents")
              .select("content")
              .eq("id", cityPageId)
              .single();
              
            data = exactResult.data;
            error = exactResult.error;
          }
        } else {
          // Standard query for other countries
          const result = await sb
            .from("page_contents")
            .select("content")
            .eq("id", cityPageId)
            .single();
            
          data = result.data;
          error = result.error;
        }

        if (!error && data?.content) {
          const content = data.content;
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
        canonical: `/exhibition-stands/${countrySlug}/${citySlug}`,
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
      console.log(
        "🔍 Server-side: Fetching CMS data for city:",
        citySlug,
        "in country:",
        countrySlug
      );

      // Special handling for Jordan, Lebanon, Israel, and Oman cities
      const isSpecialCountry = ['jordan', 'lebanon', 'israel', 'oman'].includes(countrySlug);
      const cityPageId = `${countrySlug}-${citySlug}`;
      
      let data, error;
      
      if (isSpecialCountry) {
        console.log('🔍 Special country city detected, using enhanced query strategy:', cityPageId);
        
        // Try multiple query patterns for special countries
        const result = await sb
          .from("page_contents")
          .select("content")
          .or(`id.eq.${cityPageId},id.eq.city-${cityPageId}`)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (result.data?.[0]) {
          data = result.data[0];
          error = null;
        } else {
          // Fallback to exact match if no results from OR query
          const exactResult = await sb
            .from("page_contents")
            .select("content")
            .eq("id", cityPageId)
            .single();
            
          data = exactResult.data;
          error = exactResult.error;
        }
      } else {
        // Standard query for other countries
        const result = await sb
          .from("page_contents")
          .select("content")
          .eq("id", cityPageId)
          .single();
          
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.log("❌ Server-side: Supabase error:", error);
        return null;
      }

      if (data?.content) {
        const key = cityPageId;
        const fromCityPages = (data.content as any)?.sections?.cityPages?.[key];
        console.log(
          "✅ Server-side: Found CMS data for city page, cityPages hit:",
          Boolean(fromCityPages)
        );
        return fromCityPages || data.content;
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching city page content:", error);
    return null;
  }
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
  
  // Fetch builders from Supabase API
  let builders = [];
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      { cache: "no-store" }
    );
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data.builders)) {
      // Handle country name variations (UAE vs United Arab Emirates)
      const countryVariations = [countryName];
      if (countryName === "United Arab Emirates") {
        countryVariations.push("UAE");
      } else if (countryName === "UAE") {
        countryVariations.push("United Arab Emirates");
      }
      
      // Filter builders for this city and country
      builders = data.data.builders.filter((builder: any) => {
        // Check if builder serves this city and country
        const servesCity = builder.serviceLocations?.some(
          (loc: any) =>
            countryVariations.includes(loc.country) &&
            ((loc.cities && Array.isArray(loc.cities) && loc.cities.some((c: string) => c.toLowerCase().trim() === cityName.toLowerCase().trim())) ||
             (loc.city && loc.city.toLowerCase().trim() === cityName.toLowerCase().trim()))
        );
        const headquartersMatch =
          countryVariations.includes(builder.headquarters?.country) &&
          builder.headquarters?.city &&
          builder.headquarters?.city.toLowerCase().trim() === cityName.toLowerCase().trim();

        return servesCity || headquartersMatch;
      });
      
      // Deduplicate builders by ID
      const builderMap = new Map();
      builders.forEach((builder: any) => {
        if (!builderMap.has(builder.id)) {
          builderMap.set(builder.id, builder);
        }
      });
      
      builders = Array.from(builderMap.values());
    }
  } catch (error) {
    console.error("❌ Error loading builders:", error);
  }

  // Use default content if no CMS content is available
  const defaultContent = getDefaultCityContent(cityName, countryName);
  const pageContent = cmsContent || defaultContent;

  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country={countryName}
        city={cityName}
        initialBuilders={builders}
        cityData={cityData}
        cmsContent={pageContent}
        showQuoteForm={true}
        hideCitiesSection={true}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// Dynamic route: don't generate static params to avoid build-time dependencies
