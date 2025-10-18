import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";
import {
  ALL_COUNTRY_SLUGS,
  getDisplayNameFromSlug,
  isValidCountrySlug,
  sanitizeCountrySlug,
} from "@/lib/locations/countries";
import { getServerSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

// Default fallback content for each country
const getDefaultCountryContent = (countryName: string, countrySlug: string) => ({
  whyChooseHeading: `Why Choose Local Builders in ${countryName}?`,
  whyChooseParagraph: `Local builders offer unique advantages including market knowledge, logistical expertise, and established vendor relationships.`,
  infoCards: [
    {
      title: "Local Market Knowledge",
      text: `Understand local regulations, venue requirements, and cultural preferences specific to ${countryName}.`
    },
    {
      title: "Faster Project Delivery",
      text: "Reduced logistics time, easier coordination, and faster response times for urgent modifications or support."
    },
    {
      title: "Cost-Effective Solutions",
      text: "Lower transportation costs, established supplier networks, and competitive local pricing structures."
    }
  ],
  quotesParagraph: `Connect with 3-5 verified local builders who understand your market. No registration required, quotes within 24 hours.`,
  servicesHeading: `Exhibition Stand Builders in ${countryName}: Services, Costs, and Tips`,
  servicesParagraph: `Finding the right exhibition stand partner in ${countryName} can dramatically improve your event ROI. Local builders offer end-to-end services including custom design, fabrication, graphics, logistics, and on-site installation—ensuring your brand presents a professional, high‑impact presence on the show floor.`
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const sanitized = sanitizeCountrySlug(country);
  const isValid = isValidCountrySlug(sanitized);
  
  // Return 404 if country doesn't exist
  if (!isValid) {
    console.log('❌ Country not found in metadata:', sanitized);
    notFound();
  }
  
  const countryName = getDisplayNameFromSlug(sanitized);

  return {
    title: `Exhibition Stand Builders in ${countryName} | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services. Connect with verified contractors in major cities.`,
    keywords: [
      `exhibition stands ${countryName}`,
      `booth builders ${countryName}`,
      `trade show displays ${countryName}`,
    ],
    openGraph: {
      title: `Exhibition Stand Builders in ${countryName}`,
      description: `Professional exhibition stand builders across ${countryName}. Custom trade show displays and booth design services.`,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Exhibition Stand Builders in ${countryName}`,
      description: `Professional exhibition stand builders across ${countryName}. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/${sanitized}`,
    },
  };
}

// Fetch CMS content for the country page
async function getCountryPageContent(countrySlug: string) {
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching CMS data for country:', countrySlug);
      
      const { data, error } = await sb
        .from('page_contents')
        .select('content')
        .eq('id', countrySlug)
        .single();
      
      if (error) {
        console.log('❌ Server-side: Supabase error:', error);
        return null;
      }
      
      if (data?.content) {
        console.log('✅ Server-side: Found CMS data for country:', countrySlug);
        return data.content;
      }
    }
  } catch (error) {
    console.error('❌ Server-side: Error fetching CMS data:', error);
  }
  
  return null;
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const sanitized = sanitizeCountrySlug(country);
  
  // Validate country slug immediately to prevent template flash
  if (!isValidCountrySlug(sanitized)) {
    return notFound();
  }
  
  const countryName = getDisplayNameFromSlug(sanitized);

  // Fetch CMS content server-side for better SEO and performance
  const cmsContent = await getCountryPageContent(sanitized);
  
  // Generate default content as fallback
  const defaultContent = getDefaultCountryContent(countryName, sanitized);
  
  // Merge CMS content with defaults (CMS content takes precedence)
  // Be flexible with incoming shapes to avoid falling back to hardcoded defaults
  const countryBlock =
    (cmsContent as any)?.sections?.countryPages?.[sanitized] ||
    (cmsContent as any)?.countryPages?.[sanitized] ||
    cmsContent ||
    null;
  const mergedContent = {
    ...defaultContent,
    ...(countryBlock || {})
  };

  // Fetch builders from Supabase
  let builders: any[] = [];
  try {
    const sb = getServerSupabase();
    if (sb) {
      console.log('🔍 Server-side: Fetching builders for country:', countryName);
      
      const { data, error } = await sb
        .from('builder_profiles')
        .select('*')
        .eq('headquarters_country', countryName)
        .eq('verified', true)
        .order('rating', { ascending: false });
      
      if (error) {
        console.log('❌ Server-side: Supabase error fetching builders:', error);
      } else if (data) {
        // Transform Supabase data to match expected structure
        builders = data.map((builder: any) => ({
          id: builder.id,
          companyName: builder.company_name,
          slug: builder.slug,
          logo: builder.logo || "/images/builders/default-logo.png",
          establishedYear: builder.established_year || 2020,
          headquarters: {
            city: builder.headquarters_city || "Unknown",
            country: builder.headquarters_country || "Unknown",
            countryCode: builder.headquarters_country_code || "XX",
            address: builder.headquarters_address || "",
            latitude: builder.headquarters_latitude || 0,
            longitude: builder.headquarters_longitude || 0,
            isHeadquarters: true,
          },
          serviceLocations: [
            {
              city: builder.headquarters_city || "Unknown",
              country: builder.headquarters_country || "Unknown",
              countryCode: builder.headquarters_country_code || "XX",
              address: builder.headquarters_address || "",
              latitude: builder.headquarters_latitude || 0,
              longitude: builder.headquarters_longitude || 0,
              isHeadquarters: false,
            },
          ],
          contactInfo: {
            primaryEmail: builder.primary_email || "",
            phone: builder.phone || "",
            website: builder.website || "",
            contactPerson: builder.contact_person || "Contact Person",
            position: builder.position || "Manager",
          },
          services: [],
          specializations: [
            { id: 'general', name: 'Exhibition Builder', icon: '🏗️', color: '#3B82F6' }
          ],
          companyDescription: builder.company_description || 'Professional exhibition services provider',
          keyStrengths: ["Professional Service", "Quality Work", "Local Expertise"],
          projectsCompleted: builder.projects_completed || 25,
          rating: builder.rating || 4.0,
          reviewCount: builder.review_count || 0,
          responseTime: builder.response_time || 'Within 24 hours',
          languages: builder.languages || ['English'],
          verified: builder.verified || false,
          premiumMember: builder.premium_member || false,
          claimed: builder.claimed || false,
          claimStatus: builder.claim_status || 'unclaimed',
          teamSize: builder.team_size || 10,
          averageProjectValue: builder.average_project || 15000,
          currency: builder.currency || 'USD',
          basicStandMin: builder.basic_stand_min || 5000,
          basicStandMax: builder.basic_stand_max || 15000,
          customStandMin: builder.custom_stand_min || 15000,
          customStandMax: builder.custom_stand_max || 50000,
          premiumStandMin: builder.premium_stand_min || 50000,
          premiumStandMax: builder.premium_stand_max || 100000,
          gmbImported: builder.gmb_imported || false,
          importedFromGmb: builder.imported_from_gmb || false,
          source: builder.source || 'manual',
          createdAt: builder.created_at,
          updatedAt: builder.updated_at,
        }));
        console.log(`✅ Server-side: Found ${builders.length} builders for ${countryName}`);
        console.log('🔍 Server-side: Builder details:', builders.map(b => ({
          companyName: b.companyName,
          headquarters: b.headquarters,
          verified: b.verified
        })));
      }
    }
  } catch (error) {
    console.error('❌ Server-side: Error fetching builders:', error);
  }

  try {
    const displayName = countryName;

    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
          country={displayName}
          initialBuilders={builders}
          initialContent={{
            id: `${sanitized}-main`,
            title: `Exhibition Stand Builders in ${displayName}`,
            metaTitle: `${displayName} Exhibition Stand Builders | Trade Show Booth Design`,
            metaDescription: `Leading exhibition stand builders across ${displayName}. Custom trade show displays, booth design, and professional exhibition services in major cities.`,
            description: `Find the best exhibition stand builders across ${displayName}. Connect with experienced professionals who create stunning custom displays for trade shows and exhibitions across all major cities.`,
            heroContent: `Discover ${displayName}'s premier exhibition stand builders and booth designers.`,
            seoKeywords: [
              `${displayName} exhibition stands`,
              `${displayName} trade show builders`,
              `${displayName} booth design`,
            ],
          }}
          // Pass CMS content for dynamic rendering
          cmsContent={mergedContent}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
          country={countryName}
          initialBuilders={builders}
          initialContent={{
            id: `${sanitized}-main`,
            title: `Exhibition Stand Builders in ${countryName}`,
            metaTitle: `${countryName} Exhibition Stand Builders | Trade Show Booth Design`,
            metaDescription: `Leading exhibition stand builders across ${countryName}. Custom trade show displays, booth design, and professional exhibition services in major cities.`,
            description: `Find the best exhibition stand builders across ${countryName}. Connect with experienced professionals who create stunning custom displays for trade shows and exhibitions across all major cities.`,
            heroContent: `Discover ${countryName}'s premier exhibition stand builders and booth designers.`,
            seoKeywords: [
              `${countryName} exhibition stands`,
              `${countryName} trade show builders`,
              `${countryName} booth design`,
            ],
          }}
          // Pass CMS content for dynamic rendering
          cmsContent={mergedContent}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }
}

export async function generateStaticParams() {
  // Generate static params for the full list provided
  return ALL_COUNTRY_SLUGS.map((slug) => ({ country: slug }));
}

// Enable ISR with revalidation for dynamic content updates
export const revalidate = 0; // Disable ISR for now to ensure real-time updates
