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

  // Use CMS metadata if available, otherwise fall back to default
  const title = cmsMetadata?.title || `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`;
  const description = cmsMetadata?.description || `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = cmsMetadata?.keywords || [`exhibition stands ${countryInfo.name}`, `booth builders ${countryInfo.name}`, `trade show displays ${countryInfo.name}`, `${countryInfo.name} exhibition builders`, `${countryInfo.name} booth design`, `${countryInfo.name} exhibition stands`];

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

  // DEBUG: Log cities data to verify it's being passed correctly
  console.log(`🔍 DEBUG: Cities data for ${countryInfo.name}:`, cities);

  // Fetch builders from Supabase API with better error handling
  let builders: any[] = [];

  try {
    // Use absolute URL for server-side fetch
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Ensure the base URL has a protocol (http:// or https://)

    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }


    console.log(`🔍 Fetching builders from: ${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`);

    const response = await fetch(
      `${baseUrl}/api/admin/builders?limit=1000&prioritize_real=true`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      console.warn(`⚠️ Builders API returned ${response.status}: ${response.statusText}, falling back to direct Supabase query`);
      // Fallback to direct Supabase query
      const sb = getServerSupabase();
      if (!sb) {
        console.error('❌ Supabase client not available');
        throw new Error('Supabase client not available');
      }



      const { data: buildersData, error: buildersError } = await sb
        .from('builders')
        .select('*')
        .is('deleted_at', null); // Only get non-deleted builders



      if (buildersError) {
        console.error('❌ Error querying builders table:', buildersError);
        // Try the builder_profiles table as fallback
        console.warn('⚠️ No data in builders table or error occurred, trying builder_profiles table...');



        const { data: profilesData, error: profilesError } = await sb
          .from('builder_profiles')
          .select('*')
          .is('deleted_at', null);



        if (profilesError) {
          console.error('❌ Error querying builder_profiles table:', profilesError);
          builders = [];
        } else {
          console.log('✅ Found builders in builder_profiles:', profilesData?.length || 0);
          builders = profilesData || [];
        }
      } else {
        console.log('✅ Found builders in builders table:', buildersData?.length || 0);
        builders = buildersData || [];
      }



      // Filter builders for this country
      console.log('🔍 Filtering builders for country:', countryInfo.name);
      const normalizedCountryName = countryInfo.name.toLowerCase();
      const countryVariations = [normalizedCountryName];
      if (normalizedCountryName.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountryName === "uae") {
        countryVariations.push("united arab emirates");
      }



      // Filter builders by location
      builders = builders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
        const countryMatch = countryVariations.some(variation =>
          headquartersCountry.includes(variation)
        );

        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = (loc.country || '').toLowerCase().trim();
          return countryVariations.some(variation =>
            serviceCountry.includes(variation)
          );
        });

        return countryMatch || serviceLocationMatch;
      });

      console.log(`📍 Filtered to ${builders.length} builders for country: ${countryInfo.name}`);



      // Transform builders to match Builder interface
      builders = builders.map((b: any) => ({
        id: b.id,
        companyName: b.company_name || b.companyName || "",
        slug: b.slug ||
          (b.company_name || b.companyName || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-"),
        headquarters: {
          city: b.headquarters_city || b.headquarters?.city || "Unknown",
          country:
            b.headquarters_country ||
            b.headquartersCountry ||
            b.headquarters?.country ||
            "Unknown",
        },
        serviceLocations: b.service_locations || b.service_locations || [],
        rating: b.rating || 0,
        reviewCount: b.reviewCount || 0,
        projectsCompleted: b.projects_completed || b.projects_completed || 0,
        responseTime: b.response_time || b.responseTime || "Within 24 hours",
        verified: b.verified || b.isVerified || false,
        premiumMember: b.premium_member || b.premiumMember || false,
        services: b.services || [],
        specializations: b.specializations || [],
        companyDescription: b.description || b.company_description || "",
        keyStrengths: b.key_strengths || [],
        featured: b.featured || false,
        logo: b.logo || b.profile_image || b.image_url || b.avatar || b.photo || b.logo_url || b.brand_logo || "/images/builders/default-logo.png",
        // Add portfolio field for gallery/images
        portfolio: b.portfolio || b.gallery_images || b.images || [],
        certifications: b.certifications || [],
        awards: b.awards || [],
        tradeshowExperience: b.tradeshow_experience || [],
        priceRange: b.price_range || { min: 0, max: 0, currency: "USD" },
        whyChooseUs: b.why_choose_us || [],
        clientTestimonials: b.client_testimonials || [],
        socialMedia: b.social_media || {},
        businessLicense: b.business_license || "",
        insurance: b.insurance || {},
        sustainability: b.sustainability || {},
        recentProjects: b.recent_projects || [],
        claimed: b.claimed || false,
        claimStatus: b.claim_status || "unclaimed",
        planType: b.plan_type || "free",
        source: b.source || "",
        importedAt: b.imported_at || "",
        lastUpdated: b.last_updated || b.updated_at || new Date().toISOString(),
        status: b.status || "active",
        plan: b.plan || "free",
        contactEmail: b.contact_email || b.primary_email || b.primaryEmail || ""
      }));
    } else {
      const buildersData = await response.json();
      console.log(`✅ Builders API response received. Success: ${buildersData.success}, Builders count: ${buildersData.data?.builders?.length || 0}`);



      if (buildersData.success && buildersData.data && Array.isArray(buildersData.data.builders)) {
        // Handle country name variations (UAE vs United Arab Emirates)
        const normalizedCountryName = countryInfo.name.toLowerCase();
        const countryVariations = [normalizedCountryName];
        if (normalizedCountryName.includes("united arab emirates")) {
          countryVariations.push("uae");
        } else if (normalizedCountryName === "uae") {
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
            logo: b.logo || b.profile_image || b.image_url || b.avatar || b.photo || b.logo_url || b.brand_logo || "/images/builders/default-logo.png",
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
            // Add portfolio field for gallery/images
            portfolio: b.portfolio || b.gallery_images || b.images || [],
            services: b.services || [],
            specializations: b.specializations || [],
            certifications: b.certifications || [],
            awards: b.awards || [],
            tradeshowExperience: b.tradeshow_experience || [],
            priceRange: b.price_range || { min: 0, max: 0, currency: "USD" },
            whyChooseUs: b.why_choose_us || [],
            clientTestimonials: b.client_testimonials || [],
            socialMedia: b.social_media || {},
            businessLicense: b.business_license || "",
            insurance: b.insurance || {},
            sustainability: b.sustainability || {},
            recentProjects: b.recent_projects || [],
            claimed: b.claimed || false,
            claimStatus: b.claim_status || "unclaimed",
            source: b.source || "",
            importedAt: b.imported_at || "",
            lastUpdated: b.last_updated || b.updated_at || new Date().toISOString(),
            status: b.status || "active",
            plan: b.plan || "free",
            contactEmail: b.contact_email || b.primary_email || b.primaryEmail || ""
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
    }
  } catch (error) {
    console.error("❌ Error loading builders from API:", error);
  }



  // If API failed or returned no builders, fallback to direct Supabase query
  if (builders.length === 0) {
    try {
      console.log('🔍 Fetching all builders from Supabase as fallback...');
      const sb = getServerSupabase();
      if (!sb) {
        console.error('❌ Supabase client not available');
        throw new Error('Supabase client not available');
      }


      console.log('🔍 Using client type: Admin (bypasses RLS)');
      console.log('🔍 Querying builders table...');

      // Query the builders table
      const { data: buildersData, error: buildersError } = await sb
        .from('builders')
        .select('*')
        .is('deleted_at', null); // Only get non-deleted builders



      if (buildersError) {
        console.error('❌ Error querying builders table:', buildersError);
        // Try the builder_profiles table as fallback
        console.warn('⚠️ No data in builders table or error occurred, trying builder_profiles table...');



        const { data: profilesData, error: profilesError } = await sb
          .from('builder_profiles')
          .select('*')
          .is('deleted_at', null);



        if (profilesError) {
          console.error('❌ Error querying builder_profiles table:', profilesError);
        } else {
          console.log('✅ Found builders in builder_profiles:', profilesData?.length || 0);
          builders = profilesData || [];
        }
      } else {
        console.log('✅ Found builders in builders table:', buildersData?.length || 0);
        builders = buildersData || [];
      }



      // Filter builders for this country
      console.log('🔍 Filtering builders for country:', countryInfo.name);
      const normalizedCountryName = countryInfo.name.toLowerCase();
      const countryVariations = [normalizedCountryName];
      if (normalizedCountryName.includes("united arab emirates")) {
        countryVariations.push("uae");
      } else if (normalizedCountryName === "uae") {
        countryVariations.push("united arab emirates");
      }



      // Filter builders by location
      builders = builders.filter((builder: any) => {
        // Check headquarters country
        const headquartersCountry = (builder.headquarters_country || builder.country || '').toLowerCase().trim();
        const countryMatch = countryVariations.some(variation =>
          headquartersCountry.includes(variation)
        );

        // Check service locations
        const serviceLocations = builder.service_locations || builder.serviceLocations || [];
        const serviceLocationMatch = serviceLocations.some((loc: any) => {
          const serviceCountry = (loc.country || '').toLowerCase().trim();
          return countryVariations.some(variation =>
            serviceCountry.includes(variation)
          );
        });

        return countryMatch || serviceLocationMatch;
      });

      console.log(`📍 Filtered to ${builders.length} builders for country: ${countryInfo.name}`);



      // Transform builders to match Builder interface
      builders = builders.map((b: any) => ({
        id: b.id,
        companyName: b.company_name || b.companyName || "",
        slug: b.slug ||
          (b.company_name || b.companyName || "")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-"),
        headquarters: {
          city: b.headquarters_city || b.headquarters?.city || "Unknown",
          country:
            b.headquarters_country ||
            b.headquartersCountry ||
            b.headquarters?.country ||
            "Unknown",
        },
        serviceLocations: b.service_locations || b.service_locations || [],
        rating: b.rating || 0,
        reviewCount: b.reviewCount || 0,
        projectsCompleted: b.projects_completed || b.projects_completed || 0,
        responseTime: b.response_time || b.responseTime || "Within 24 hours",
        verified: b.verified || b.isVerified || false,
        premiumMember: b.premium_member || b.premiumMember || false,
        planType: b.plan_type || "free",
        services: b.services || [],
        specializations: b.specializations || [],
        companyDescription: b.description || b.company_description || "",
        keyStrengths: b.key_strengths || [],
        featured: b.featured || false,
        logo: b.logo || b.profile_image || b.image_url || b.avatar || b.photo || b.logo_url || b.brand_logo || null // Add all possible logo fields
      }));
    } catch (error) {
      console.error('❌ Error fetching all builders from Supabase fallback:', error);
      // Fallback to empty array
      builders = [];
    }
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

  // ✅ FIX: Prevent Soft 404s by returning 404 if data is missing (No builders AND no custom content)
  if (builders.length === 0 && !cmsContent) {
    console.warn(`⚠️ Soft 404 Check: No builders and no CMS content for ${countryInfo.name}. returning 404.`);
    notFound();
  }

  // Prepare country data for the client component
  const countryData = {
    countryName: countryInfo.name,
    countryCode: countryInfo.code,
    flag: countryInfo.flag,
    cities: [] // We'll populate this if needed
  };

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
            // Explicitly set hideCitiesSection to false to ensure cities section is shown
            hideCitiesSection={false}
            serverCmsContent={cmsContent}
          />
        </CountryPageClientWrapper>
      </div>
    </ServerPageWithBreadcrumbs>
  );
}
