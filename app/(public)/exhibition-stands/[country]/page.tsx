import { Metadata } from "next";
import { notFound } from "next/navigation";
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import { GLOBAL_EXHIBITION_DATA } from "@/lib/data/globalCities";
import { getCountryCodeByName } from "@/lib/utils/countryUtils";
import { fetchCountryContent } from "@/lib/server/content/fetch-country";
import { extractContentBlocks } from "@/lib/server/content/parse-content";
import { BlockRenderer } from "@/components/blocks";
import { getCitiesByCountry as getGlobalCitiesByCountry } from "@/lib/data/globalExhibitionDatabase";

// Enable ISR with 6-hour revalidation
export const revalidate = 21600; // 6 hours in seconds

// Create a map for easy lookup
const COUNTRY_DATA: Record<string, any> = {};
GLOBAL_EXHIBITION_DATA.countries.forEach((country: any) => {
  COUNTRY_DATA[country.slug] = {
    name: country.name,
    code: country.countryCode,
    flag: '🏳️'
  };
});

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
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

  // Fetch cached content - this will be shared with page render due to React cache()
  const contentData = await fetchCountryContent(
    countrySlug,
    countryInfo.name,
    countryInfo.code
  );

  const title = contentData?.content.seo?.metaTitle || 
    `Exhibition Stand Builders in ${countryInfo.name} | Professional Trade Show Displays`;
  const description = contentData?.content.seo?.metaDescription || 
    `Find professional exhibition stand builders across ${countryInfo.name}. Custom trade show displays, booth design, and comprehensive exhibition services.`;
  const keywords = contentData?.content.seo?.keywords || [
    `exhibition stands ${countryInfo.name}`,
    `booth builders ${countryInfo.name}`,
    `trade show displays ${countryInfo.name}`,
    `${countryInfo.name} exhibition builders`,
    `${countryInfo.name} booth design`,
    `${countryInfo.name} exhibition stands`
  ];

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

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const countryInfo = COUNTRY_DATA[countrySlug as keyof typeof COUNTRY_DATA];
  
  if (!countryInfo) {
    console.warn(`⚠️ Country not found: ${countrySlug}`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Country Not Found</h1>
          <p>The requested country page was not found.</p>
        </div>
      </div>
    );
  }

  console.log(`${countryInfo.flag} Loading ${countryInfo.name} page with cached rendering...`);
  
  // Fetch all data in parallel using cached functions
  const [contentData] = await Promise.all([
    fetchCountryContent(countrySlug, countryInfo.name, countryInfo.code),
  ]);

  if (!contentData) {
    console.error(`❌ Failed to load content for ${countryInfo.name}`);
    notFound();
  }

  const { content, builders, cities, stats } = contentData;

  // If no cities from DB, fallback to global database (maintaining existing behavior)
  let allCities = cities;
  if (allCities.length === 0) {
    console.log(`🔄 Falling back to global database for cities in ${countryInfo.name}`);
    try {
      const globalCities = getGlobalCitiesByCountry(countrySlug);
      
      // Deduplicate cities
      const cityMap = new Map();
      globalCities.forEach((city: any) => {
        if (!cityMap.has(city.name)) {
          cityMap.set(city.name, {
            name: city.name,
            slug: city.slug,
            builderCount: city.builderCount || 0
          });
        }
      });
      
      allCities = Array.from(cityMap.values());
    } catch (error) {
      console.error(`❌ Error fetching cities from global database for ${countryInfo.name}:`, error);
    }
  }

  // Extract blocks from parsed content
  const blocks = extractContentBlocks(content);

  // Build complete block list with dynamic data
  const blocksWithData = [
    ...blocks.map(block => {
      // Inject dynamic data into specific blocks
      if (block.id === 'stats') {
        return {
          ...block,
          data: stats
        };
      }
      if (block.id === 'builders-list') {
        return {
          ...block,
          data: {
            builders,
            heading: content.buildersHeading || 'Exhibition Stand Builders',
            intro: content.buildersIntro
          }
        };
      }
      if (block.id === 'cities-list') {
        return {
          ...block,
          data: {
            countrySlug,
            countryName: countryInfo.name,
            cities: allCities,
            heading: `Exhibition Stand Builders by City in ${countryInfo.name}`,
            intro: `Find verified exhibition stand builders in major cities across ${countryInfo.name}. Click on any city to view local builders and get competitive quotes.`
          }
        };
      }
      if (block.id === 'final-cta') {
        return {
          ...block,
          data: {
            ...block.data,
            location: countryInfo.name,
            countryCode: countryInfo.code
          }
        };
      }
      return block;
    })
  ];

  return (
    <div className="font-inter min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero section with stats integrated */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlockRenderer 
            blocks={[blocksWithData[0]]} // Just hero block
            className="mb-12"
          />
          
          {/* Stats block (rendered directly after hero) */}
          <div id="stats" className="block-stats">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl lg:text-4xl font-bold text-white">
                    {stats.totalBuilders}+
                  </div>
                  <div className="text-blue-200 text-sm lg:text-base">
                    Verified Builders
                  </div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl lg:text-4xl font-bold text-white">
                    {stats.averageRating}
                  </div>
                  <div className="text-blue-200 text-sm lg:text-base">
                    Average Rating
                  </div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl lg:text-4xl font-bold text-white">
                    {stats.totalProjects}
                  </div>
                  <div className="text-blue-200 text-sm lg:text-base">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl lg:text-4xl font-bold text-white">
                    $450
                  </div>
                  <div className="text-blue-200 text-sm lg:text-base">
                    Avg. Price/sqm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlockRenderer 
          blocks={blocksWithData.slice(1)} // All blocks except hero
        />
      </div>

      <WhatsAppFloat />
    </div>
  );
}
