import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import { getServerSupabase } from "@/lib/supabase";

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

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  // Better error handling for missing country data
  if (!countryInfo) {
    console.warn(`⚠️ Country metadata not found for slug: ${countrySlug}`);
    return {
      title: 'Country Not Found',
      description: 'The requested country page was not found.',
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

  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://standszone.com/exhibition-stands/${countrySlug}`,
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  // Better error handling to prevent 5xx errors
  if (!countryInfo) {
    console.warn(`⚠️ Country not found: ${countrySlug}`);
    // Log additional debugging information
    console.log(`🔍 Debug info - Requested country slug: ${countrySlug}`);
    console.log(`🔍 Debug info - Available country slugs: ${Object.keys(COUNTRY_DATA).slice(0, 10).join(', ')}...`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
          <p>The requested country page was not found.</p>
        </div>
      </div>
    );
  }

  console.log(`${countryInfo.flag} Loading ${countryInfo.name} page with modern UI...`);
  
  const cmsContent = await getCountryPageContent(countrySlug);
  
  // Fetch builders from Supabase API with better error handling
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
      const countryVariations = [countryInfo.name.toLowerCase()];
      if (countryInfo.name === "United Arab Emirates") {
        countryVariations.push("uae");
      } else if (countryInfo.name === "UAE") {
        countryVariations.push("united arab emirates");
      }
      
      console.log('🔍 DEBUG: Country variations for filtering:', countryVariations);
      
      // Filter builders for this country (with variations)
      const filteredBuilders = buildersData.data.builders.filter((builder: any) => {
        // Normalize strings for comparison
        const normalizeString = (str: string) => {
          if (!str) return '';
          return str.toString().toLowerCase().trim();
        };
        
        // Check headquarters country (handle different field names)
        const headquartersCountry = normalizeString(
          builder.headquarters_country || 
          builder.headquarters?.country || 
          builder.headquartersCountry || 
          ''
        );
        
        const headquartersMatch = countryVariations.some(variation => 
          headquartersCountry === variation || headquartersCountry.includes(variation)
        );
        
        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = normalizeString(loc.country);
          return countryVariations.some(variation => 
            serviceCountry === variation || serviceCountry.includes(variation)
          );
        });
        
        // Log for debugging first builder
        if (buildersData.data.builders.indexOf(builder) === 0) {
          console.log('🔍 DEBUG: Server-side country filtering for first builder:', {
            country: countryInfo.name,
            countryVariations,
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
          company_name: uniqueBuilders[0].company_name,
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
  
  // DEBUG: Log builders info
  console.log("🔍 DEBUG: Server-side builders count:", builders.length);
  if (builders.length > 0) {
    console.log("🔍 DEBUG: First server-side builder:", {
      id: builders[0].id,
      companyName: builders[0].companyName,
      headquarters: builders[0].headquarters,
      serviceLocations: builders[0].serviceLocations
    });
  } else {
    console.log("⚠️ DEBUG: No builders to send to client component");
  }
  
  const defaultContent = {
    id: `${countrySlug}-main`,
    title: `Exhibition Stand Builders in ${countryInfo.name}`,
    metaTitle: `${countryInfo.name} Exhibition Stand Builders | Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${countryInfo.name} is a significant market for international trade shows and exhibitions. Our expert exhibition stand builders deliver innovative designs that capture attention and drive results in ${countryInfo.name}'s dynamic exhibition landscape.`,
    heroContent: `Partner with ${countryInfo.name}'s premier exhibition stand builders for trade show success across the country.`,
    seoKeywords: [`${countryInfo.name} exhibition stands`, `${countryInfo.name} trade show builders`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition services`]
  };
  
  const countryBlock = cmsContent?.sections?.countryPages?.[countrySlug] || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };

  // Prepare country data for the client component
  const countryData = {
    countryName: countryInfo.name,
    countryCode: countryInfo.code,
    flag: countryInfo.flag,
    cities: [] // We'll populate this if needed
  };

  return (
    <div className="font-inter">
      <Navigation />
      <CountryCityPage
        country={countryInfo.name}
        initialBuilders={builders}
        initialContent={mergedContent}
        cmsContent={cmsContent}
      />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}