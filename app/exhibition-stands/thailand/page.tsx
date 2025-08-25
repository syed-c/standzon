import { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import EnhancedCountryPage from "@/components/EnhancedCountryPage";

interface CountryPageProps {
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

  try {
    console.log(`🔍 Generating metadata for country: ${country}`);

    // Preload country data for metadata
    const countryData = await preloadQuery(api.locations.getCountryBySlug, {
      countrySlug: country,
    });

    if (!countryData) {
      console.log(`❌ Country data not found for metadata: ${country}`);
      return {
        title: "Country Not Found",
        description: "The requested country could not be found.",
      };
    }

    const countryName = countryData.countryName;

    console.log(`✅ Metadata generated for: ${countryName}`);

    return {
      title: `Exhibition Stand Builders in ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders in ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services across major cities.`,
      keywords: `exhibition stands, ${countryName}, builders, contractors, trade show displays, booth design`,
      openGraph: {
        title: `Exhibition Stand Builders in ${countryName}`,
        description: `Professional exhibition stand builders in ${countryName}. Custom trade show displays and booth design services.`,
        type: "website",
      },
      alternates: {
        canonical: `/exhibition-stands/${country}`,
      },
    };
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return {
      title: "Exhibition Stand Builders",
      description: "Find professional exhibition stand builders worldwide.",
    };
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  console.log("🌍 Loading country page:", { country });

  try {
    // Preload country data for SSR
    const preloadedCountryData = await preloadQuery(
      api.locations.getCountryBySlug,
      {
        countrySlug: country,
      }
    );

    if (!preloadedCountryData) {
      console.log("❌ Country data not found:", { country });
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Country Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                The requested country could not be found.
              </p>
            </div>
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      );
    }

    // Preload cities data for this country
    const preloadedCitiesData = await preloadQuery(
      api.locations.getCitiesByCountry,
      {
        countrySlug: country,
      }
    );

    console.log("✅ Found country data:", preloadedCountryData.countryName);
    console.log("🏙️ Loaded cities:", preloadedCitiesData?.length || 0);

    return (
      <div className="font-inter">
        <Navigation />
        <EnhancedCountryPage
          countrySlug={country}
          preloadedCountryData={preloadedCountryData}
          preloadedCitiesData={preloadedCitiesData}
        />
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  } catch (error) {
    console.error("❌ Error loading country page:", error);
    return (
      <div className="font-inter">
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Error Loading Page
            </h1>
            <p className="text-gray-600 mb-8">
              There was an error loading this page. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }
}
