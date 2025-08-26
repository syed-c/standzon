import { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";

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
      slug: country,
    });

    if (!countryData) {
      console.log(`❌ Country data not found for metadata: ${country}`);
      return {
        title: "Country Not Found",
        description: "The requested country could not be found.",
      };
    }

    const countryName = countryData.countryName || country;

    console.log(`✅ Metadata generated for: ${countryName}`);

    return {
      title: `Exhibition Stand Builders ${countryName} | Professional Trade Show Displays`,
      description: `Find professional exhibition stand builders in ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services. Get quotes from verified contractors.`,
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
        slug: country,
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

    const countryName = preloadedCountryData.countryName || "Belgium";

    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
          country={countryName}
          initialBuilders={[]}
          initialContent={{
            id: `${country}-main`,
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
              Something went wrong while loading this page.
            </p>
          </div>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }
}

export async function generateStaticParams() {
  console.log(
    "🚀 Generating static params for all countries from comprehensive global database..."
  );

  try {
    // Get all countries from comprehensive global database
    const allCountries = await preloadQuery(api.locations.getAllCountries);

    // Check if allCountries is valid and is an array
    if (!allCountries || !Array.isArray(allCountries)) {
      console.warn(
        "⚠️ No countries data available or invalid format, returning empty params"
      );
      return [];
    }

    // Generate params for all countries in the comprehensive database
    const params = allCountries.map((country) => {
      return {
        country: country.slug,
      };
    });

    console.log(
      `📄 Generated ${params.length} static country pages from comprehensive global database`
    );
    console.log(
      "🔍 Sample countries:",
      params.slice(0, 10).map((p) => p.country)
    );

    return params;
  } catch (error) {
    console.error("❌ Error generating static params:", error);
    return [];
  }
}
