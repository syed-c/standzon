import { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
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
  const countryName = isValid
    ? getDisplayNameFromSlug(sanitized)
    : getDisplayNameFromSlug(sanitized || "country");

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
  const isValid = isValidCountrySlug(sanitized);
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

  try {
    if (!isValid) {
      return (
        <div className="font-inter">
          <Navigation />
          <CountryCityPage
            country={countryName}
            initialBuilders={[]}
            initialContent={{
              id: `${sanitized || "country"}-main`,
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

    // Attempt to read from backend if available, but do not fail the page if it errors
    let preloadedCountryData: any = null;
    try {
      preloadedCountryData = await preloadQuery(
        api.locations.getCountryBySlug,
        { slug: sanitized }
      );
    } catch {}

    const displayName = preloadedCountryData?.countryName || countryName;

    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
          country={displayName}
          initialBuilders={[]}
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
          initialBuilders={[]}
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
