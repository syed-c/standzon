import { Metadata } from "next";
import { notFound } from "next/navigation";
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import {
  getCityBySlug as getGlobalCityBySlug,
  getCountryBySlug as getGlobalCountryBySlug,
} from "@/lib/data/globalExhibitionDatabase";
import {
  getCityBySlug as getComprehensiveCityBySlug,
  getCountryBySlug as getComprehensiveCountryBySlug,
} from "@/lib/data/comprehensiveLocationData";
import { getCountryCodeByName } from "@/lib/utils/countryUtils";
import { fetchCityContent } from "@/lib/server/content/fetch-city";
import { extractContentBlocks } from "@/lib/server/content/parse-content";
import { BlockRenderer } from "@/components/blocks";
import { getCitiesByCountry as getGlobalCitiesByCountry } from "@/lib/data/globalExhibitionDatabase";

// Enable ISR with 6-hour revalidation
export const revalidate = 21600; // 6 hours in seconds

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}): Promise<Metadata> {
  const { country, city } = await params;
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const toTitle = (s: string) =>
    s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const countrySlug = normalize(country);
  const citySlug = normalize(city);

  const countryData = getGlobalCountryBySlug(countrySlug) || getComprehensiveCountryBySlug(countrySlug);
  if (!countryData) notFound();

  const cityData = getGlobalCityBySlug(countrySlug, citySlug) || getComprehensiveCityBySlug(countrySlug, citySlug);
  if (!cityData) notFound();

  const cityName = ('name' in cityData) ? cityData.name : cityData.cityName;
  const countryName = toTitle(countrySlug);

  // Fetch cached content - this will be shared with page render due to React cache()
  const contentData = await fetchCityContent(
    countrySlug,
    countryName,
    citySlug,
    cityName
  );

  const title = contentData?.content.seo?.metaTitle || 
    `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`;
  const description = contentData?.content.seo?.metaDescription || 
    `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `https://standszone.com/exhibition-stands/${countrySlug}/${citySlug}` },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { country, city } = await params;
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const toTitle = (s: string) =>
    s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const countrySlug = normalize(country);
  const citySlug = normalize(city);

  const countryData = getGlobalCountryBySlug(countrySlug) || getComprehensiveCountryBySlug(countrySlug);
  if (!countryData) notFound();

  const cityData = getGlobalCityBySlug(countrySlug, citySlug) || getComprehensiveCityBySlug(countrySlug, citySlug);
  if (!cityData) notFound();

  const cityName = ('name' in cityData) ? cityData.name : cityData.cityName;
  const countryName = toTitle(countrySlug);

  // Fetch all data in parallel using cached functions
  const contentData = await fetchCityContent(
    countrySlug,
    countryName,
    citySlug,
    cityName
  );

  if (!contentData) {
    console.error(`❌ Failed to load content for ${cityName}`);
    notFound();
  }

  const { content, builders, cities, stats } = contentData;

  // Extract blocks from parsed content
  const blocks = extractContentBlocks(content);

  // Get other cities in the same country
  const otherCities = cities
    .filter((c: any) => c.slug !== citySlug)
    .slice(0, 6);

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
            heading: content.buildersHeading || `Exhibition Stand Builders in ${cityName}`,
            intro: content.buildersIntro
          }
        };
      }
      if (block.id === 'cities-list') {
        return {
          ...block,
          data: {
            countrySlug,
            countryName,
            cities: otherCities,
            heading: `Other Cities in ${countryName}`,
            intro: `Find exhibition stand builders in other cities across ${countryName}`
          }
        };
      }
      if (block.id === 'final-cta') {
        return {
          ...block,
          data: {
            ...block.data,
            location: `${cityName}, ${countryName}`,
            heading: content.finalCtaHeading || `Need a Custom Exhibition Stand in ${cityName}?`
          }
        };
      }
      return block;
    })
  ];

  // Add builders-list block if not present
  if (!blocksWithData.find(b => b.id === 'builders-list')) {
    blocksWithData.push({
      id: 'builders-list',
      type: 'builders-list',
      order: 100,
      data: {
        builders,
        heading: `Exhibition Stand Builders in ${cityName}`,
        intro: content.buildersIntro
      }
    });
  }

  // Add cities-list block for city pages if not present and there are other cities
  if (!blocksWithData.find(b => b.id === 'cities-list') && otherCities.length > 0) {
    blocksWithData.push({
      id: 'cities-list',
      type: 'cities-list',
      order: 200,
      data: {
        countrySlug,
        countryName,
        cities: otherCities,
        heading: `Other Cities in ${countryName}`,
        intro: `Find exhibition stand builders in other cities across ${countryName}`
      }
    });
  }

  // Sort blocks by order
  blocksWithData.sort((a, b) => a.order - b.order);

  return (
    <div className="font-inter min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero section with stats integrated */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlockRenderer 
            blocks={[blocksWithData.find(b => b.id === 'hero') || blocksWithData[0]]}
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
          blocks={blocksWithData.filter(b => b.id !== 'hero')}
        />
      </div>

      <WhatsAppFloat />
    </div>
  );
}
