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

interface PageProps {
  params: Promise<{
    country: string;
  }>;
}

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

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const sanitized = sanitizeCountrySlug(country);
  const isValid = isValidCountrySlug(sanitized);
  const countryName = getDisplayNameFromSlug(sanitized);

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
