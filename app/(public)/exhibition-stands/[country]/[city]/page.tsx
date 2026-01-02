import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/client/Navigation";
import Footer from "@/components/client/Footer";
import WhatsAppFloat from '@/components/client/WhatsAppFloat';
import CountryCityPage from '@/components/client/CountryCityPage';
import {
  getCityBySlug as getGlobalCityBySlug,
  getCountryBySlug as getGlobalCountryBySlug,
} from "@/lib/data/globalExhibitionDatabase";
import {
  getCityBySlug as getComprehensiveCityBySlug,
  getCountryBySlug as getComprehensiveCountryBySlug,
} from "@/lib/data/comprehensiveLocationData";
import { getCountryCodeByName } from "@/lib/utils/countryUtils";
import { getBuilders } from "@/lib/server/db/builders";
import { getCitiesByCountry } from "@/lib/server/db/locations";
import { getPageContent } from "@/lib/server/db/pages";

export const dynamic = 'force-dynamic';

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

  const cmsContent = await getPageContent(`${countrySlug}-${citySlug}`);
  
  const title = cmsContent?.seo?.metaTitle || `Exhibition Stand Builders in ${cityName}, ${countryName} | Professional Trade Show Displays`;
  const description = cmsContent?.seo?.metaDescription || `Find professional exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and comprehensive exhibition services.`;

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

  let cmsContent = await getPageContent(`${countrySlug}-${citySlug}`);
  
  // If city-specific content not found, try fetching country content
  if (!cmsContent) {
    console.log(`🔍 City content not found for ${countrySlug}-${citySlug}, falling back to country content: ${countrySlug}`);
    cmsContent = await getPageContent(countrySlug);
  }

  const countryCode = getCountryCodeByName(countryName);
  
  const rawCities = countryCode ? await getCitiesByCountry(countryCode) : [];
  const cities = rawCities.map((c: any) => ({
    name: c.city_name,
    slug: c.city_slug,
    builderCount: c.builder_count || 0
  }));

  const allBuilders = await getBuilders();
  const normalizedCityName = cityName.toLowerCase();
  const normalizedCountryName = countryName.toLowerCase();
  
  const filteredBuilders = allBuilders.filter((builder: any) => {
    const bCity = (builder.headquarters_city || '').toLowerCase();
    const bCountry = (builder.headquarters_country || '').toLowerCase();
    return (bCity === normalizedCityName || bCity.includes(normalizedCityName)) && 
           (bCountry === normalizedCountryName || bCountry.includes(normalizedCountryName) || 
            (normalizedCountryName === 'united arab emirates' && bCountry === 'uae') ||
            (normalizedCountryName === 'uae' && bCountry === 'united arab emirates'));
  });

  const transformedBuilders = filteredBuilders.map((builder: any) => ({
    id: builder.id,
    companyName: builder.company_name,
    slug: builder.slug,
    headquarters: {
      city: builder.headquarters_city,
      country: builder.headquarters_country
    },
    rating: builder.rating || 0,
    reviewCount: builder.review_count || 0,
    projectsCompleted: builder.projects_completed || 0,
    verified: builder.verified || false,
    premiumMember: builder.premium_member || false
  }));

  const defaultContent = {
    id: `${countrySlug}-${citySlug}-main`,
    title: `Exhibition Stand Builders in ${cityName}, ${countryName}`,
    metaTitle: `${cityName} Exhibition Stand Builders | ${countryName} Trade Show Booth Design`,
    metaDescription: `Leading exhibition stand builders in ${cityName}, ${countryName}. Custom trade show displays, booth design, and professional exhibition services.`,
    description: `${cityName} is a key hub for trade shows in ${countryName}. Our expert exhibition stand builders in ${cityName} deliver innovative designs that capture attention and drive results in this dynamic market.`,
    heroContent: `Partner with ${cityName}'s premier exhibition stand builders for trade show success.`,
    seoKeywords: [`${cityName} exhibition stands`, `${cityName} trade show builders`, `${cityName} exhibition builders`, `${countryName} booth design`, `${cityName} exhibition services`]
  };

  const cityBlock = cmsContent?.sections?.cityPages?.[`${countrySlug}-${citySlug}`] || cmsContent || null;
  const mergedContent = {
    ...defaultContent,
    ...(cityBlock || {})
  };

  return (
    <>
      <CountryCityPage 
        country={countryName} 
        city={cityName} 
        initialBuilders={transformedBuilders as any}
        initialContent={mergedContent}
        cities={cities}
        cmsContent={cmsContent}
      />
      <WhatsAppFloat />
    </>
  );
}
