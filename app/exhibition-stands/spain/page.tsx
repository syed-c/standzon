import { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CountryCityPage } from "@/components/CountryCityPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Exhibition Stand Builders in Spain | Professional Trade Show Displays`,
    description: `Find professional exhibition stand builders across Spain. Custom trade show displays, booth design, and comprehensive exhibition services in Madrid, Barcelona, Valencia, and more.`,
    keywords: [
      `exhibition stands Spain`,
      `booth builders Spain`,
      `trade show displays Spain`,
      `Madrid exhibition builders`,
      `Barcelona booth design`,
    ],
    openGraph: {
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Exhibition Stand Builders in Spain`,
      description: `Professional exhibition stand builders across Spain. Custom trade show displays and booth design services.`,
    },
    alternates: {
      canonical: `/exhibition-stands/spain`,
    },
  };
}

export default async function SpainPage() {
  console.log("🇪🇸 Loading Spain page...");

  try {
    // Preload country data for SSR
    const preloadedCountryData = await preloadQuery(
      api.locations.getCountryBySlug,
      { slug: "spain" }
    );

    if (!preloadedCountryData) {
      console.log("❌ Spain not found in database");
      return (
        <div className="font-inter">
          <Navigation />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Spain Not Found
              </h1>
              <p className="text-gray-600 mb-8">
                Spain data is not available yet. We're working on adding it.
              </p>
            </div>
          </div>
          <Footer />
          <WhatsAppFloat />
        </div>
      );
    }

    const countryName = preloadedCountryData.countryName || "Spain";

    return (
      <div className="font-inter">
        <Navigation />
        <CountryCityPage
          country={countryName}
          initialBuilders={[]}
          initialContent={{
            id: `spain-main`,
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
    console.error("❌ Error loading Spain page:", error);
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
